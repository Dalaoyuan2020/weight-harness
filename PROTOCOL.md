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

## 六、从GSD-2吸收的机制（预留，待实现）

### 6.1 磁盘状态机（Disk State Machine）
> 来源：GSD-2的.gsd/目录

所有运行状态写磁盘，不依赖内存。Agent崩了、断电了、网断了，重启后从磁盘恢复。

```
data/state/
├── current_phase.json    # 当前阶段（哪个学员、哪天、做到哪一步）
├── checkpoints/          # 每个关键操作的快照
│   ├── 2026-04-06_plan_created.json
│   └── 2026-04-06_checkin_3of7.json
└── recovery.json         # 崩溃恢复指引
```

好处：系统永远可恢复，不怕意外中断。

### 6.2 每个任务开新上下文（Context Isolation）
> 来源：GSD-2的context rot对策

不让Agent在一个长会话里干所有事。每个任务（比如生成计划、评估体重趋势）单独启动一次AI调用，干完就结束。

好处：避免上下文越来越脏，每次都是干净的起点。

### 6.3 上下文使用率监控（Context Budget）
> 来源：GSD-2的70%阈值机制

监控AI的token消耗：
- 50%：正常
- 70%：提醒收尾，先保存当前成果
- 90%：强制收尾，写checkpoint

好处：不会因为token耗尽而丢失工作。

### 6.4 三级工作分解（Work Breakdown）
> 来源：GSD-2的Milestone→Slice→Task

复杂项目不能只有一级Task，需要分层：
- **Milestone**（里程碑）：比如"第一阶段：减2kg"
- **Slice**（切片）：比如"本周饮食控制"
- **Task**（任务）：比如"今日早餐打卡"

好处：大目标拆小，进度可追踪，不会迷失方向。

### 6.5 Meta-Prompting（程序化构建提示）
> 来源：GSD-2的上下文工程

不让AI自己决定看什么。Harness替AI精选上下文：
- 只给相关的知识库片段
- 注入当前任务的前序摘要
- 注入决策历史记录

好处：AI看到的都是精选信息，不会被无关内容干扰。

---

## 七、开发者协议的核心优势

### 我们有而别人没有的：

1. **三方制衡** — 编排×执行×评估互相监督，防止单方独断
2. **收敛性迭代** — 不追求一次完美，追求多轮收敛到80%
3. **三层边界** — Skill/API/框架严格分离，AI不能改底层
4. **预留端口** — 未实现的功能先定义接口（501），随时可扩展
5. **知识库驱动** — 所有决策基于knowledge_base，不是AI瞎编

### 从GSD-2吸收的优点：

6. **磁盘状态机** — 崩溃可恢复，不怕断电
7. **上下文隔离** — 每个任务干净起点，不累积脏数据
8. **上下文预算** — 70%阈值提醒，不浪费token
9. **三级分解** — 里程碑→切片→任务，大项目不迷路
10. **Meta-Prompting** — Harness替AI精选上下文

### 一句话：
> 开发者协议 = 系统的宪法。规定了谁能做什么、谁不能做什么、出事了怎么办、未来怎么扩展。有了它，系统越跑越稳，而不是越跑越乱。

---

## 八、未来扩展端口（已定义接口，未实现）

1. **拍照确认** — POST /api/v1/checkin/photo
2. **AI生成计划** — POST /api/v1/plan/generate
3. **AI动态调整** — PUT /api/v1/plan/adjust
4. **通知推送** — POST /api/v1/notify（微信/飞书/钉钉）
5. **家长评价** — POST /api/v1/review
6. **异常提醒** — GET /api/v1/alerts
7. **数据分析** — GET /api/v1/analytics
8. **Skill系统** — /api/v1/skill/*
9. **状态恢复** — GET /api/v1/state/checkpoint（磁盘状态机）
10. **上下文预算** — GET /api/v1/context/usage（token监控）
