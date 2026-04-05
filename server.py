"""Weight Harness — 三方制衡降重系统"""

from fastapi import FastAPI
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import List, Optional
from pathlib import Path
from datetime import date

from api.core import (
    add_student, list_students, create_plan, get_plan,
    checkin_weight, complete_task, get_today_tasks,
    get_dashboard, get_weight_trend
)

app = FastAPI(title="Weight Harness", version="0.1.0")
app.mount("/static", StaticFiles(directory="static"), name="static")

TEMPLATES = Path("templates")


# ========== Pydantic Models ==========

class StudentCreate(BaseModel):
    name: str
    age: int
    sport: str
    current_weight: float
    target_weight: float
    competition_date: str

class TaskItem(BaseModel):
    time: str
    content: str
    type: str = "training"
    completed: bool = False

class PlanCreate(BaseModel):
    student_id: str
    date: str
    tasks: List[TaskItem]
    target_weight: Optional[float] = None
    notes: str = ""

class WeightCheckin(BaseModel):
    student_id: str
    weight: float

class TaskComplete(BaseModel):
    student_id: str
    date: str
    task_index: int


# ========== API Routes (v1) ==========

@app.post("/api/v1/student")
async def api_add_student(s: StudentCreate):
    return add_student(s.name, s.age, s.sport, s.current_weight, s.target_weight, s.competition_date)

@app.get("/api/v1/students")
async def api_list_students():
    return list_students()

@app.post("/api/v1/plan")
async def api_create_plan(p: PlanCreate):
    tasks = [t.dict() for t in p.tasks]
    return create_plan(p.student_id, p.date, tasks, p.target_weight, p.notes)

@app.get("/api/v1/plan/{student_id}/{plan_date}")
async def api_get_plan(student_id: str, plan_date: str):
    plan = get_plan(student_id, plan_date)
    if plan:
        return plan
    return JSONResponse(status_code=404, content={"error": "计划未找到"})

@app.post("/api/v1/checkin/weight")
async def api_checkin_weight(c: WeightCheckin):
    return checkin_weight(c.student_id, c.weight)

@app.post("/api/v1/checkin/task")
async def api_complete_task(t: TaskComplete):
    result = complete_task(t.student_id, t.date, t.task_index)
    if result:
        return result
    return JSONResponse(status_code=404, content={"error": "任务未找到"})

@app.get("/api/v1/today/{student_id}")
async def api_today(student_id: str):
    plan = get_today_tasks(student_id)
    if plan:
        return plan
    return JSONResponse(status_code=404, content={"error": "今日无计划"})

@app.get("/api/v1/dashboard/{student_id}")
async def api_dashboard(student_id: str):
    data = get_dashboard(student_id)
    if data:
        return data
    return JSONResponse(status_code=404, content={"error": "学员未找到"})

@app.get("/api/v1/weight-trend/{student_id}")
async def api_weight_trend(student_id: str):
    return get_weight_trend(student_id)

# ========== 预留端口（返回501） ==========

@app.post("/api/v1/checkin/photo")
async def api_checkin_photo():
    return JSONResponse(status_code=501, content={"error": "拍照确认功能开发中"})

@app.post("/api/v1/plan/generate")
async def api_plan_generate():
    return JSONResponse(status_code=501, content={"error": "AI生成计划功能开发中"})

@app.put("/api/v1/plan/adjust")
async def api_plan_adjust():
    return JSONResponse(status_code=501, content={"error": "AI动态调整功能开发中"})

@app.post("/api/v1/notify")
async def api_notify():
    return JSONResponse(status_code=501, content={"error": "通知推送功能开发中"})

@app.post("/api/v1/review")
async def api_review():
    return JSONResponse(status_code=501, content={"error": "家长评价功能开发中"})

@app.get("/api/v1/skills")
async def api_skills():
    return JSONResponse(status_code=501, content={"error": "Skill系统开发中"})


@app.get("/", response_class=HTMLResponse)
async def home():
    return TEMPLATES.joinpath("index.html").read_text(encoding="utf-8")


@app.get("/coach", response_class=HTMLResponse)
async def coach():
    return TEMPLATES.joinpath("coach.html").read_text(encoding="utf-8")


@app.get("/student", response_class=HTMLResponse)
async def student():
    return TEMPLATES.joinpath("student.html").read_text(encoding="utf-8")


@app.get("/parent", response_class=HTMLResponse)
async def parent():
    return TEMPLATES.joinpath("parent.html").read_text(encoding="utf-8")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8080)
