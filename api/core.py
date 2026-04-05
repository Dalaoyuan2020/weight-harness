"""
Weight Harness — 核心API函数层
AI只能调用这些函数，不能修改
"""

import json
import uuid
from datetime import datetime, date
from pathlib import Path

DB_DIR = Path("data")
DB_DIR.mkdir(exist_ok=True)

STUDENTS_FILE = DB_DIR / "students.json"
PLANS_FILE = DB_DIR / "plans.json"
CHECKINS_FILE = DB_DIR / "checkins.json"


def _load(path: Path) -> list:
    if path.exists():
        return json.loads(path.read_text(encoding="utf-8"))
    return []


def _save(path: Path, data: list):
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2, default=str), encoding="utf-8")


# ========== 教练端 API ==========

def add_student(name: str, age: int, sport: str, current_weight: float,
                target_weight: float, competition_date: str) -> dict:
    """添加学员"""
    students = _load(STUDENTS_FILE)
    student = {
        "id": str(uuid.uuid4())[:8],
        "name": name,
        "age": age,
        "sport": sport,
        "current_weight": current_weight,
        "target_weight": target_weight,
        "competition_date": competition_date,
        "created_at": datetime.now().isoformat()
    }
    students.append(student)
    _save(STUDENTS_FILE, students)
    return student


def list_students() -> list:
    """获取所有学员"""
    return _load(STUDENTS_FILE)


def create_plan(student_id: str, plan_date: str, tasks: list, target_weight: float = None, notes: str = "") -> dict:
    """创建/更新每日计划"""
    plans = _load(PLANS_FILE)
    # 如果已有该日计划，更新
    plans = [p for p in plans if not (p["student_id"] == student_id and p["date"] == plan_date)]
    plan = {
        "id": str(uuid.uuid4())[:8],
        "student_id": student_id,
        "date": plan_date,
        "tasks": tasks,
        "target_weight": target_weight,
        "notes": notes,
        "created_at": datetime.now().isoformat()
    }
    plans.append(plan)
    _save(PLANS_FILE, plans)
    return plan


def get_plan(student_id: str, plan_date: str) -> dict:
    """获取某学员某日计划"""
    plans = _load(PLANS_FILE)
    for p in plans:
        if p["student_id"] == student_id and p["date"] == plan_date:
            return p
    return None


# ========== 学生端 API ==========

def checkin_weight(student_id: str, weight: float, checkin_time: str = None) -> dict:
    """提交体重打卡"""
    checkins = _load(CHECKINS_FILE)
    record = {
        "id": str(uuid.uuid4())[:8],
        "student_id": student_id,
        "date": date.today().isoformat(),
        "weight": weight,
        "time": checkin_time or datetime.now().strftime("%H:%M"),
        "type": "weight"
    }
    checkins.append(record)
    _save(CHECKINS_FILE, checkins)

    # 更新学生当前体重
    students = _load(STUDENTS_FILE)
    for s in students:
        if s["id"] == student_id:
            s["current_weight"] = weight
    _save(STUDENTS_FILE, students)

    return record


def complete_task(student_id: str, plan_date: str, task_index: int) -> dict:
    """勾选任务完成"""
    plans = _load(PLANS_FILE)
    for p in plans:
        if p["student_id"] == student_id and p["date"] == plan_date:
            if 0 <= task_index < len(p["tasks"]):
                p["tasks"][task_index]["completed"] = True
                _save(PLANS_FILE, plans)
                return p
    return None


def get_today_tasks(student_id: str) -> dict:
    """获取今日任务清单"""
    today = date.today().isoformat()
    return get_plan(student_id, today)


# ========== 家长端 API ==========

def get_dashboard(student_id: str) -> dict:
    """获取看板数据"""
    students = _load(STUDENTS_FILE)
    student = next((s for s in students if s["id"] == student_id), None)
    if not student:
        return None

    today = date.today().isoformat()
    plan = get_plan(student_id, today)
    checkins = _load(CHECKINS_FILE)
    weight_history = [c for c in checkins if c["student_id"] == student_id and c["type"] == "weight"]
    weight_history.sort(key=lambda x: x["date"])

    # 计算完成度
    total_tasks = len(plan["tasks"]) if plan else 0
    done_tasks = sum(1 for t in plan["tasks"] if t.get("completed")) if plan else 0

    # 计算剩余天数
    comp_date = datetime.strptime(student["competition_date"], "%Y-%m-%d").date()
    days_left = (comp_date - date.today()).days

    return {
        "student": student,
        "days_left": days_left,
        "weight_to_lose": round(student["current_weight"] - student["target_weight"], 1),
        "today_plan": plan,
        "today_progress": {"total": total_tasks, "done": done_tasks},
        "weight_history": weight_history[-30:],  # 最近30条
        "last_weight_change": round(weight_history[-1]["weight"] - weight_history[-2]["weight"], 2) if len(weight_history) >= 2 else 0
    }


def get_weight_trend(student_id: str) -> list:
    """获取体重趋势数据"""
    checkins = _load(CHECKINS_FILE)
    weights = [c for c in checkins if c["student_id"] == student_id and c["type"] == "weight"]
    weights.sort(key=lambda x: x["date"])
    return weights
