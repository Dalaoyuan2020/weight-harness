"""Weight Harness — 三方制衡降重系统"""

from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from pathlib import Path

app = FastAPI(title="Weight Harness")
app.mount("/static", StaticFiles(directory="static"), name="static")

TEMPLATES = Path("templates")


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
