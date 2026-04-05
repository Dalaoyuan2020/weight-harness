# Weight Harness — 三方制衡降重系统

> 🏋️ 教练 × 学生 × 家长 | 驾驭工程

## 核心理念

三方制衡，科学降重：

- **教练（编排器）** — 制定计划，激活主脑
- **学生（执行者）** — 接收指令，执行打卡
- **家长（评估器）** — 监督进度，提供支持

## 快速启动

```bash
pip install fastapi uvicorn
python server.py
# 访问 http://localhost:8080
```

## 项目结构

```
weight-harness/
├── server.py              # FastAPI 服务入口
├── templates/             # 页面模板
│   ├── index.html         # 首页（三角制衡图）
│   ├── coach.html         # 教练端
│   ├── student.html       # 学生端
│   └── parent.html        # 家长端
├── knowledge_base/        # 知识库（RAG用）
│   └── market_research.md # 市场调研报告
├── api/                   # 后端API（待开发）
└── static/                # 静态资源
```
