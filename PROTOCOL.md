# Weight Harness 开发者协议（L5 灯塔协议）

> 版本：v0.1 | 更新：2026-04-06

---

## 一、设计原则

### 1. MVP先行，端口预留
- 功能做最小可用，协议做最全
- 每个API预留版本号和扩展参数
- 未实现的功能先定义接口，返回501

### 2. AI只能调用函数，不能改框架
- AI通过封装好的API端点调用功能
- AI不能直接操作数据库
- AI不能修改路由、模型定义、核心逻辑

### 3. AI的扩展在Skill层
- AI想做复杂事 → 写Skill（skills/目录下的.py文件）
- Skill只能调用已有的API函数
- Skill可以组合多个API完成复杂任务
- Skill可以被热加载、热替换

---

## 二、三层边界

```
┌──────────────────────────────┐
│ Skill层（AI可编辑区）         │  skills/*.py
│ AI可以：写/改Skill            │  组合调用API函数
│ AI不能：碰Skill层以下的代码    │
├──────────────────────────────┤
│ API函数层（只能调用）          │  api/*.py
│ 封装好的函数接口              │  有版本号、有参数校验
│ AI只能调用，不能修改          │
├──────────────────────────────┤
│ 底层框架（禁区）              │  server.py, models.py
│ 路由定义、数据模型、核心逻辑   │  AI完全不能碰
└──────────────────────────────┘
```

---

## 三、API函数清单（MVP + 预留）

### 教练端（编排器）
| API | 状态 | 说明 |
|-----|------|------|
| POST /api/v1/student | MVP | 添加学员 |
| GET /api/v1/students | MVP | 学员列表 |
| POST /api/v1/plan | MVP | 创建/更新每日计划 |
| GET /api/v1/plan/{student_id}/{date} | MVP | 获取某学员某日计划 |
| POST /api/v1/plan/generate | 预留 | AI生成计划建议 |
| PUT /api/v1/plan/adjust | 预留 | AI动态调整计划 |
| GET /api/v1/analytics/coach | 预留 | 教练数据分析面板 |

### 学生端（执行者）
| API | 状态 | 说明 |
|-----|------|------|
| POST /api/v1/checkin/weight | MVP | 提交体重打卡 |
| POST /api/v1/checkin/task | MVP | 勾选任务完成 |
| POST /api/v1/checkin/photo | 预留 | 拍照确认 |
| GET /api/v1/today/{student_id} | MVP | 获取今日任务清单 |
| GET /api/v1/history/{student_id} | 预留 | 历史记录 |

### 家长端（评估器）
| API | 状态 | 说明 |
|-----|------|------|
| GET /api/v1/dashboard/{student_id} | MVP | 看板数据 |
| GET /api/v1/weight-trend/{student_id} | MVP | 体重趋势 |
| POST /api/v1/review | 预留 | 家长评价/验收 |
| GET /api/v1/alerts/{student_id} | 预留 | 异常提醒 |

### 通信层
| API | 状态 | 说明 |
|-----|------|------|
| POST /api/v1/notify | 预留 | 发送提醒（微信/飞书/短信） |
| GET /api/v1/messages/{role}/{id} | 预留 | 消息列表 |

### AI Skill层
| API | 状态 | 说明 |
|-----|------|------|
| GET /api/v1/skills | 预留 | 已加载的Skill列表 |
| POST /api/v1/skill/invoke | 预留 | 调用某个Skill |
| POST /api/v1/skill/reload | 预留 | 热加载Skill |

---

## 四、数据模型（MVP）

### Student（学员）
```json
{
    "id": "uuid",
    "name": "张三",
    "age": 15,
    "sport": "跆拳道",
    "current_weight": 48.0,
    "target_weight": 42.0,
    "competition_date": "2026-05-20",
    "created_at": "2026-04-06"
}
```

### DailyPlan（每日计划）
```json
{
    "id": "uuid",
    "student_id": "uuid",
    "date": "2026-04-06",
    "tasks": [
        {"time": "06:30", "content": "晨跑5km", "type": "training", "completed": false},
        {"time": "07:30", "content": "早餐：鸡蛋2个+全麦面包", "type": "diet", "completed": false}
    ],
    "target_weight": 47.8,
    "notes": "注意补水"
}
```

### WeightCheckin（体重打卡）
```json
{
    "id": "uuid",
    "student_id": "uuid",
    "date": "2026-04-06",
    "weight": 47.5,
    "time": "07:00",
    "photo_url": null
}
```

---

## 五、决策日志

| 日期 | 决策 | 原因 |
|------|------|------|
| 2026-04-06 | 用SQLite不用PostgreSQL | MVP阶段零配置，单文件 |
| 2026-04-06 | 用纯HTML不用React | 最快上线，手机兼容好 |
| 2026-04-06 | AI不能改框架只能调API | 防止系统被AI改乱 |
| 2026-04-06 | Skill层独立目录 | AI扩展功能不影响核心 |
| 2026-04-06 | API预留版本号v1 | 为后续迭代留空间 |

---

## 六、未来扩展端口（已定义接口，未实现）

1. **拍照确认** — POST /api/v1/checkin/photo
2. **AI生成计划** — POST /api/v1/plan/generate
3. **AI动态调整** — PUT /api/v1/plan/adjust
4. **通知推送** — POST /api/v1/notify（微信/飞书/钉钉）
5. **家长评价** — POST /api/v1/review
6. **异常提醒** — GET /api/v1/alerts
7. **数据分析** — GET /api/v1/analytics
8. **Skill系统** — /api/v1/skill/*
