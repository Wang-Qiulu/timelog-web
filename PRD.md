# 柳比歇夫时间管理工具 - 数据结构PRD

## 当前问题
- 数据路径混乱（uid vs 用户名）
- 旧数据无法迁移
- 结构不清晰

---

## 设计方案

### Firestore 数据结构

```
firestore
└── users (集合)
    └── {username} (文档，username唯一)
        ├── username: string      // 用户名
        ├── createdAt: number     // 创建时间
        └── timeLogs (子集合)
            └── {logId} (文档)
                ├── id: string           // 日志ID
                ├── description: string // 事件描述
                ├── categoryId: string   // 分类(A/B/C/D)
                ├── startTime: number    // 开始时间戳
                ├── endTime: number      // 结束时间戳
                ├── duration: number     // 持续时长(分钟)
                └── createdAt: number    // 记录创建时间
```

---

## 字段说明

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| username | string | Y | 用户名，唯一标识 |
| createdAt | number | Y | Unix时间戳 |
| id | string | Y | UUID |
| description | string | Y | 事件描述 |
| categoryId | string | Y | A/B/C/D |
| startTime | number | Y | 开始时间戳 |
| endTime | number | Y | 结束时间戳 |
| duration | number | Y | 时长(分钟) |
| createdAt | number | Y | 记录创建时间 |

---

## 数据操作

### 新用户注册
1. 检查username是否已存在 → 存在则提示更换
2. 创建 `users/{username}` 文档
3. localStorage记住username

### 登录（自动）
1. 读取localStorage的username
2. 检查云端是否存在 → 不存在则跳转注册

### 记录时间
1. 添加到 `users/{username}/timeLogs/`

### 导出数据
1. 读取 `users/{username}/timeLogs/` 全部数据
2. 导出JSON/CSV

---

## 分类定义

| ID | 名称 | 颜色 |
|----|------|------|
| A | 核心产出 | 红色 |
| B | 基础事务 | 黄色 |
| C | 生活休息 | 绿色 |
| D | 时间黑洞 | 灰色 |
