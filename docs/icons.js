// Shared SF Symbols-style line icons. 24x24 viewBox, 1.5 stroke.
// Usage: <span class="iframe-ic" data-icon="coach"></span>
//        hydrateIcons(root?)

const ICONS = {
  // Logo — harness/ribcage glyph
  harness: `<path d="M6 4v16M18 4v16M6 9h12M6 15h12"/>`,

  // Coach — brain / planning
  coach: `<path d="M9 5a3 3 0 0 0-3 3 2.5 2.5 0 0 0-1.5 4.5A2.5 2.5 0 0 0 6 17a3 3 0 0 0 3 2h1.5V5Z"/><path d="M13.5 5a3 3 0 0 1 3 3 2.5 2.5 0 0 1 1.5 4.5A2.5 2.5 0 0 1 16.5 17a3 3 0 0 1-3 2H12V5Z"/>`,

  // Student — dumbbell
  student: `<path d="M4 10v4M20 10v4M7 7v10M17 7v10M9 11h6M9 13h6"/>`,

  // Parent — eye
  parent: `<path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"/><circle cx="12" cy="12" r="2.5"/>`,

  // Chart / trend
  chart: `<path d="M4 19V5M4 19h16M7 15l3-4 3 2 4-6"/>`,

  // Check
  check: `<path d="M5 12l4 4 10-10"/>`,

  // Plus
  plus: `<path d="M12 5v14M5 12h14"/>`,

  // Bell (alert)
  bell: `<path d="M6 15V10a6 6 0 0 1 12 0v5l1.5 2h-15zM10 19a2 2 0 0 0 4 0"/>`,

  // Calendar
  calendar: `<rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/>`,

  // Clock
  clock: `<circle cx="12" cy="12" r="8"/><path d="M12 8v4l2.5 2"/>`,

  // Arrow right
  arrowRight: `<path d="M5 12h14M13 6l6 6-6 6"/>`,

  // Settings
  gear: `<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3h.1a1.7 1.7 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8v.1a1.7 1.7 0 0 0 1.5 1H21a2 2 0 0 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z"/>`,

  // Scale
  scale: `<path d="M5 20h14M7 20V9h10v11M9 9a3 3 0 0 1 6 0M10 13l4 4M14 13l-4 4"/>`,

  // Message
  message: `<path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-7l-4 4v-4H6a2 2 0 0 1-2-2z"/>`,

  // Search
  search: `<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4 4"/>`,

  // Food/plate
  plate: `<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/>`,

  // Run
  run: `<circle cx="14" cy="5" r="2"/><path d="M8 12l3-3 3 2 2 4M6 19l3-4 2 2M15 14l3 1v4"/>`,

  // Book / docs
  book: `<path d="M5 5a2 2 0 0 1 2-2h11v16H7a2 2 0 0 0-2 2V5zM5 5v16"/>`,

  // Triangle
  triangle: `<path d="M12 4 L21 20 H3 Z"/>`,

  // Sun / Moon
  sun: `<circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.5 5.5l1.5 1.5M17 17l1.5 1.5M5.5 18.5 7 17M17 7l1.5-1.5"/>`,
  moon: `<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>`,

  // Logout
  logout: `<path d="M9 5H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h4M15 8l4 4-4 4M11 12h8"/>`,

  // Flow (for hero product ph)
  flow: `<rect x="3" y="4" width="7" height="5" rx="1"/><rect x="14" y="4" width="7" height="5" rx="1"/><rect x="3" y="15" width="7" height="5" rx="1"/><rect x="14" y="15" width="7" height="5" rx="1"/><path d="M10 6.5h4M10 17.5h4M6.5 9v6M17.5 9v6"/>`,

  // External / link
  external: `<path d="M14 5h5v5M19 5 10 14M11 5H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-5"/>`,
};

function iconSVG(name) {
  const d = ICONS[name];
  if (!d) return '';
  return `<svg viewBox="0 0 24 24" aria-hidden="true">${d}</svg>`;
}

function hydrateIcons(root) {
  (root || document).querySelectorAll('[data-icon]').forEach(el => {
    const name = el.getAttribute('data-icon');
    if (ICONS[name]) el.innerHTML = iconSVG(name);
  });
}

window.ICONS = ICONS;
window.iconSVG = iconSVG;
window.hydrateIcons = hydrateIcons;
document.addEventListener('DOMContentLoaded', () => hydrateIcons());
