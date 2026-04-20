// Weight Harness — shared app behavior
// - Theme persistence & toggle
// - Edit-mode (Tweaks) protocol
// - Animated triangle (stroke-dash draw-in → 2-3 loop pulses → static)

(function () {
  const root = document.documentElement;
  const saved = localStorage.getItem('wh-theme') || 'light';
  root.setAttribute('data-theme', saved);

  function applyTheme(t) {
    root.setAttribute('data-theme', t);
    localStorage.setItem('wh-theme', t);
    document.querySelectorAll('[data-theme-sync]').forEach(el => {
      const mode = el.getAttribute('data-theme-sync');
      if (mode === 'chip') el.textContent = t === 'dark' ? 'Light' : 'Dark';
    });
    document.querySelectorAll('.seg-toggle button[data-theme]').forEach(b => {
      b.classList.toggle('on', b.dataset.theme === t);
    });
  }
  applyTheme(saved);

  document.addEventListener('click', (e) => {
    const chip = e.target.closest('[data-theme-toggle]');
    if (chip) {
      const cur = root.getAttribute('data-theme');
      applyTheme(cur === 'dark' ? 'light' : 'dark');
      try { window.parent.postMessage({ type: '__edit_mode_set_keys', edits: { theme: root.getAttribute('data-theme') } }, '*'); } catch(e) {}
    }
    const seg = e.target.closest('.seg-toggle button[data-theme]');
    if (seg) {
      applyTheme(seg.dataset.theme);
      try { window.parent.postMessage({ type: '__edit_mode_set_keys', edits: { theme: seg.dataset.theme } }, '*'); } catch(e) {}
    }
  });

  // Tweaks panel
  const panel = document.getElementById('tweaks');
  window.addEventListener('message', (e) => {
    const d = e.data || {};
    if (d.type === '__activate_edit_mode' && panel) panel.classList.add('on');
    if (d.type === '__deactivate_edit_mode' && panel) panel.classList.remove('on');
  });
  try { window.parent.postMessage({ type: '__edit_mode_available' }, '*'); } catch (e) {}
})();


/* ============================================
   Animated triangle — draw-in then loop-pulse
   ============================================ */
window.initTriangle = function initTriangle(rootEl) {
  if (!rootEl || rootEl.dataset.init === '1') return;
  rootEl.dataset.init = '1';

  const paths = rootEl.querySelectorAll('.tri-edge');
  const nodes = rootEl.querySelectorAll('.tri-node');
  const labels = rootEl.querySelectorAll('.tri-label');
  const pulses = rootEl.querySelectorAll('.tri-pulse');
  const nodeLabels = rootEl.querySelectorAll('.tri-node-label');

  // pre-set stroke dash
  paths.forEach((p) => {
    const len = p.getTotalLength();
    p.style.strokeDasharray = len;
    p.style.strokeDashoffset = len;
    p.dataset.len = len;
  });
  nodes.forEach(n => n.classList.add('tri-node-hidden'));
  labels.forEach(l => l.classList.add('tri-label-hidden'));
  nodeLabels.forEach(l => l.classList.add('tri-label-hidden'));
  pulses.forEach(p => p.style.opacity = 0);

  function drawIn() {
    // Draw each edge sequentially over ~6s total
    const dur = 1800; // per edge
    paths.forEach((p, i) => {
      setTimeout(() => {
        p.style.transition = `stroke-dashoffset ${dur}ms cubic-bezier(0.45,0,0.15,1)`;
        p.style.strokeDashoffset = 0;
      }, i * dur);
    });

    // Reveal nodes staggered with edges
    nodes.forEach((n, i) => {
      setTimeout(() => n.classList.remove('tri-node-hidden'), 200 + i * dur);
    });
    nodeLabels.forEach((l, i) => {
      setTimeout(() => l.classList.remove('tri-label-hidden'), 500 + i * dur);
    });

    // Reveal edge labels after draw
    setTimeout(() => {
      labels.forEach((l, i) => {
        setTimeout(() => l.classList.remove('tri-label-hidden'), i * 120);
      });
    }, paths.length * dur);

    // Start pulses
    setTimeout(startPulse, paths.length * dur + 400);
  }

  let pulseCount = 0;
  const maxPulses = 3;

  function startPulse() {
    if (pulseCount >= maxPulses) {
      // Rest state: make edges solid, hide pulses, re-highlight labels
      pulses.forEach(p => { p.style.opacity = 0; });
      rootEl.classList.add('tri-rest');
      return;
    }
    pulseCount++;
    // Each pulse travels around 3 edges (coach → student → parent → coach)
    pulses.forEach((pulseEl, edgeIdx) => {
      const edge = paths[edgeIdx];
      const total = +edge.dataset.len;
      const dur = 1200;
      const delay = edgeIdx * dur;

      setTimeout(() => {
        const start = performance.now();
        pulseEl.style.opacity = 1;
        function step(t) {
          const p = Math.min(1, (t - start) / dur);
          const pt = edge.getPointAtLength(p * total);
          pulseEl.setAttribute('cx', pt.x);
          pulseEl.setAttribute('cy', pt.y);

          // Highlight associated label when pulse is in its window
          const lbl = labels[edgeIdx];
          if (lbl) {
            if (p > 0.25 && p < 0.75) lbl.classList.add('tri-label-hot');
            else lbl.classList.remove('tri-label-hot');
          }

          if (p < 1) requestAnimationFrame(step);
          else {
            pulseEl.style.opacity = 0;
            if (lbl) lbl.classList.remove('tri-label-hot');
            // When final pulse of this loop finishes, schedule next loop
            if (edgeIdx === pulses.length - 1) {
              setTimeout(startPulse, 300);
            }
          }
        }
        requestAnimationFrame(step);
      }, delay);
    });
  }

  // Trigger on scroll into view
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        drawIn();
        io.disconnect();
      }
    });
  }, { threshold: 0.35 });
  io.observe(rootEl);

  // Click to replay
  rootEl.addEventListener('click', () => {
    if (!rootEl.classList.contains('tri-rest')) return;
    rootEl.classList.remove('tri-rest');
    pulseCount = 0;
    // reset and redraw
    paths.forEach(p => { p.style.transition = 'none'; p.style.strokeDashoffset = p.dataset.len; });
    nodes.forEach(n => n.classList.add('tri-node-hidden'));
    labels.forEach(l => { l.classList.add('tri-label-hidden'); l.classList.remove('tri-label-hot'); });
    nodeLabels.forEach(l => l.classList.add('tri-label-hidden'));
    // force reflow
    void rootEl.offsetWidth;
    drawIn();
  });
};

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-triangle]').forEach(el => window.initTriangle(el));
});
