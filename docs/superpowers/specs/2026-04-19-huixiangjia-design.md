# 会想家 - 智慧园区服务平台 设计文档

## 1. 项目概述

**项目名称**：会想家
**项目类型**：微信小程序（多租户平台）+ Web 管理端 + NestJS 后端
**核心价值**：为园区/写字楼/社区提供一站式生活服务，涵盖办公物业、便民服务、硬件管理

**MVP 范围**：办公物业管理、周边商家、公司团购、公司门禁

---

## 2. 技术架构

### 2.1 技术栈

| 层级 | 技术选型 | 说明 |
|------|----------|------|
| 小程序 | Skyline + glass-easel | 新渲染引擎，性能更好 |
| Web 管理端 | React + Ant Design | PC 端管理员使用 |
| 后端 | NestJS + TypeORM | 企业级 Node.js 框架 |
| 数据库 | MySQL | 腾讯云 MySQL |
| 认证 | 企业微信 OAuth | 员工免注册 SSO |
| 部署 | 腾讯云 | 与小程序同生态 |

### 2.2 系统架构图

```
┌─────────────────────────────────────────────────────────┐
│                     微信小程序                           │
│  ┌─────────┬─────────┬─────────┬─────────┬─────────┐  │
│  │  登录   │  物业   │  商家   │  团购   │  门禁   │  │
│  └────┬────┴────┬────┴────┬────┴────┬────┴────┬────┘  │
└───────┼─────────┼─────────┼─────────┼─────────┼───────┘
        │         │         │         │         │
        └─────────┴────┬────┴─────────┴─────────┘
                       │ HTTPS
                       ▼
              ┌─────────────────┐
              │   NestJS API    │
              │   (JWT 认证)     │
              └────────┬────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
        ▼              ▼              ▼
   ┌─────────┐   ┌─────────┐   ┌─────────┐
   │  MySQL  │   │ 企业微信 │   │ 门禁API  │
   └─────────┘   └─────────┘   └─────────┘
                       ▲
        ┌──────────────┴──────────────┐
        │         Web 管理端           │
        │  (React + Ant Design)       │
        └─────────────────────────────┘
```

### 2.3 目录结构

```
miniprogram-2/
├── miniprogram/              # 微信小程序
│   ├── app.js / app.json / app.wxss
│   ├── pages/
│   │   ├── index/            # 首页
│   │   ├── property/         # 办公物业
│   │   │   ├── meeting/      # 会议室预约
│   │   │   ├── space/        # 场地查询
│   │   │   └── repair/       # 报修
│   │   ├── merchant/         # 周边商家
│   │   │   ├── list/         # 商家列表
│   │   │   └── detail/       # 商家详情
│   │   ├── groupbuy/         # 公司团购
│   │   │   ├── list/         # 商品列表
│   │   │   └── order/        # 订单管理
│   │   ├── access/           # 公司门禁
│   │   │   ├── visitor/      # 访客预约
│   │   │   ├── record/       # 通行记录
│   │   │   └── code/         # 通行码
│   │   └── profile/          # 个人中心
│   ├── components/           # 公共组件
│   └── utils/                # 工具函数
│
├── web-admin/                # Web 管理端
│   ├── src/
│   │   ├── pages/
│   │   │   ├── dashboard/   # 数据概览
│   │   │   ├── tenant/       # 租户管理
│   │   │   ├── employee/     # 员工管理
│   │   │   ├── property/     # 物业配置
│   │   │   ├── merchant/     # 商家管理
│   │   │   ├── groupbuy/     # 团购管理
│   │   │   └── access/       # 门禁配置
│   │   ├── components/
│   │   └── services/         # API 调用
│   └── package.json
│
└── server/                   # NestJS 后端
    ├── src/
    │   ├── modules/
    │   │   ├── auth/         # 认证模块
    │   │   ├── tenant/       # 租户模块
    │   │   ├── user/         # 用户模块
    │   │   ├── property/     # 办公物业
    │   │   ├── merchant/      # 商家模块
    │   │   ├── groupbuy/     # 团购模块
    │   │   └── access/       # 门禁模块
    │   ├── common/            # 公共模块
    │   │   ├── guards/        # 守卫
    │   │   ├── interceptors/  # 拦截器
    │   │   ├── filters/       # 异常过滤器
    │   │   └── decorators/   # 装饰器
    │   └── config/            # 配置文件
    ├── test/
    ├── package.json
    └── tsconfig.json
```

---

## 3. 数据库设计

### 3.1 ER 图概述

```
tenants ─────────< users
  │                 │
  │                 │
  └────< meeting_rooms ─────< space_bookings
  │
  ├────< repair_requests
  │
  ├────< merchants ─────────< orders (团购)
  │
  ├────< products ──────────< orders (团购)
  │
  └────< visitors ──────────< access_logs
```

### 3.2 核心表结构

#### tenants（租户表）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT PK | 主键 |
| name | VARCHAR(100) | 租户名称 |
| logo | VARCHAR(255) | Logo URL |
| corp_id | VARCHAR(64) | 企业微信 CorpID |
| status | TINYINT | 状态：0-禁用 1-启用 |
| created_at | DATETIME | 创建时间 |
| updated_at | DATETIME | 更新时间 |

#### users（用户表）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT PK | 主键 |
| tenant_id | INT FK | 租户 ID |
| wx_userid | VARCHAR(64) | 企业微信用户 ID |
| name | VARCHAR(50) | 姓名 |
| phone | VARCHAR(20) | 手机号 |
| avatar | VARCHAR(255) | 头像 URL |
| role | ENUM | admin/employee |
| status | TINYINT | 状态 |
| created_at | DATETIME | 创建时间 |
| updated_at | DATETIME | 更新时间 |

#### meeting_rooms（会议室表）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT PK | 主键 |
| tenant_id | INT FK | 租户 ID |
| name | VARCHAR(50) | 会议室名称 |
| floor | VARCHAR(20) | 楼层 |
| capacity | INT | 容纳人数 |
| facilities | JSON | 设施列表 |
| status | TINYINT | 状态 |

#### space_bookings（场地预约表）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT PK | 主键 |
| tenant_id | INT FK | 租户 ID |
| user_id | INT FK | 预约人 |
| room_id | INT FK | 会议室 ID |
| book_date | DATE | 预约日期 |
| time_slot | VARCHAR(20) | 时间段 |
| purpose | VARCHAR(200) | 用途 |
| status | ENUM | pending/confirmed/cancelled |
| created_at | DATETIME | 创建时间 |

#### merchants（商家表）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT PK | 主键 |
| tenant_id | INT FK | 租户 ID |
| name | VARCHAR(100) | 商家名称 |
| category | VARCHAR(50) | 分类 |
| address | VARCHAR(200) | 地址 |
| phone | VARCHAR(20) | 电话 |
| photos | JSON | 图片列表 |
| description | TEXT | 描述 |
| coupon_info | VARCHAR(200) | 优惠信息 |
| status | TINYINT | 状态 |
| created_at | DATETIME | 创建时间 |

#### products（团购商品表）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT PK | 主键 |
| tenant_id | INT FK | 租户 ID |
| name | VARCHAR(100) | 商品名称 |
| cover_image | VARCHAR(255) | 封面图 |
| price | DECIMAL(10,2) | 现价 |
| original_price | DECIMAL(10,2) | 原价 |
| stock | INT | 库存 |
| sales_count | INT | 已售数量 |
| status | TINYINT | 状态 |
| created_at | DATETIME | 创建时间 |

#### orders（订单表）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT PK | 主键 |
| tenant_id | INT FK | 租户 ID |
| user_id | INT FK | 用户 ID |
| order_type | ENUM | groupbuy/merchant |
| product_id | INT | 商品/商家 ID |
| quantity | INT | 数量 |
| total_amount | DECIMAL(10,2) | 总金额 |
| status | ENUM | pending/paid/cancelled/completed |
| trade_no | VARCHAR(64) | 交易流水号 |
| created_at | DATETIME | 创建时间 |
| updated_at | DATETIME | 更新时间 |

#### visitors（访客表）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT PK | 主键 |
| tenant_id | INT FK | 租户 ID |
| user_id | INT FK | 邀请人 |
| visitor_name | VARCHAR(50) | 访客姓名 |
| phone | VARCHAR(20) | 访客手机 |
| visit_date | DATE | 访问日期 |
| purpose | VARCHAR(200) | 访问目的 |
| access_code | VARCHAR(32) | 通行码 |
| status | ENUM | pending/active/expired |
| created_at | DATETIME | 创建时间 |

#### access_logs（通行记录表）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT PK | 主键 |
| tenant_id | INT FK | 租户 ID |
| user_id | INT FK | 用户 ID |
| visitor_id | INT FK | 访客 ID |
| access_type | ENUM | qr/bluetooth/manual |
| device_name | VARCHAR(50) | 设备名称 |
| result | TINYINT | 结果：0-失败 1-成功 |
| access_time | DATETIME | 通行时间 |

---

## 4. API 接口设计

### 4.1 认证模块

```
POST /api/v1/auth/login
  请求：{ code: string }          // 企业微信授权码
  响应：{
    token: string,                 // JWT Token
    user: { id, name, phone, tenant_id, role },
    tenant: { id, name, logo }
  }

POST /api/v1/auth/logout
  请求：{ }
  响应：{ success: true }

GET  /api/v1/auth/userinfo
  响应：{ user, tenant }
```

### 4.2 办公物业模块

```
GET    /api/v1/property/meeting-rooms
  参数：tenant_id, date, floor
  响应：{ list: [{ id, name, floor, capacity, status, time_slots }] }

GET    /api/v1/property/meeting-rooms/:id
  响应：{ id, name, floor, capacity, facilities, bookings }

POST   /api/v1/property/bookings
  请求：{ room_id, date, time_slot, purpose }
  响应：{ id, status }

GET    /api/v1/property/bookings
  参数：user_id, date, status
  响应：{ list: [{ id, room, date, time_slot, status }] }

DELETE /api/v1/property/bookings/:id
  响应：{ success: true }
```

### 4.3 周边商家模块

```
GET    /api/v1/merchants
  参数：tenant_id, category, keyword, page, pageSize
  响应：{ list: [{ id, name, category, address, coupon_info }], total }

GET    /api/v1/merchants/:id
  响应：{ id, name, category, address, phone, photos, description, coupon_info }

POST   /api/v1/merchants/:id/favorite
  请求：{ user_id }
  响应：{ favorited: true }

DELETE /api/v1/merchants/:id/favorite
  请求：{ user_id }
  响应：{ favorited: false }

GET    /api/v1/merchants/favorites
  参数：user_id
  响应：{ list: [...] }
```

### 4.4 公司团购模块

```
GET    /api/v1/groupbuy/products
  参数：tenant_id, status, page, pageSize
  响应：{ list: [{ id, name, cover_image, price, original_price, sales_count }], total }

GET    /api/v1/groupbuy/products/:id
  响应：{ id, name, cover_image, price, original_price, stock, sales_count, description }

POST   /api/v1/groupbuy/orders
  请求：{ product_id, quantity, address }
  响应：{ order_id, total_amount, trade_no }

GET    /api/v1/groupbuy/orders
  参数：user_id, status
  响应：{ list: [{ id, product, quantity, total_amount, status, created_at }] }

PUT    /api/v1/groupbuy/orders/:id/cancel
  响应：{ success: true }
```

### 4.5 公司门禁模块

```
POST   /api/v1/access/visitors
  请求：{ visitor_name, phone, visit_date, purpose }
  响应：{ id, visitor_name, access_code }

GET    /api/v1/access/visitors
  参数：user_id, status
  响应：{ list: [{ id, visitor_name, phone, visit_date, status }] }

GET    /api/v1/access/visitors/:id/code
  响应：{ access_code, expires_at }

GET    /api/v1/access/records
  参数：user_id, start_date, end_date, page
  响应：{ list: [{ id, access_type, device_name, result, access_time }], total }
```

### 4.6 统一响应格式

```json
{
  "code": 200,
  "message": "success",
  "data": { },
  "timestamp": 1704067200000
}
```

错误响应：

```json
{
  "code": 400,
  "message": "该时段已被预约",
  "error": "SLOT_ALREADY_BOOKED"
}
```

---

## 5. 小程序端设计

### 5.1 页面结构

```
pages/
├── index/                    # 首页
│   └── index.js / wxml / wxss
├── property/                # 办公物业
│   ├── meeting/
│   │   ├── list/            # 会议室列表
│   │   └── detail/          # 会议室详情 + 预约
│   ├── space/               # 场地查询
│   └── repair/              # 报修
├── merchant/                # 周边商家
│   ├── list/               # 商家列表
│   └── detail/             # 商家详情
├── groupbuy/                # 公司团购
│   ├── list/              # 商品列表
│   └── order/             # 订单管理
├── access/                  # 公司门禁
│   ├── visitor/           # 访客预约
│   ├── record/            # 通行记录
│   └── code/              # 通行码展示
└── profile/                # 个人中心
    ├── info/              # 个人信息
    ├── bind/              # 账号绑定
    └── settings/          # 设置
```

### 5.2 首页设计

```
┌────────────────────────────────────────┐
│           自定义导航栏                   │
├────────────────────────────────────────┤
│  ┌──────────────────────────────────┐  │
│  │  [头像]  姓名                     │  │
│  │          公司名称                 │  │
│  └──────────────────────────────────┘  │
├────────────────────────────────────────┤
│  ┌────────┐  ┌────────┐              │
│  │        │  │        │              │
│  │  物业  │  │  商家  │              │
│  │        │  │        │              │
│  └────────┘  └────────┘              │
│  ┌────────┐  ┌────────┐              │
│  │        │  │        │              │
│  │  团购  │  │  门禁  │              │
│  │        │  │        │              │
│  └────────┘  └────────┘              │
├────────────────────────────────────────┤
│  快捷入口                              │
│  ┌──────────────────────────────┐    │
│  │  📅 我的预约   👤 访客邀请   │    │
│  └──────────────────────────────┘    │
│  ┌──────────────────────────────┐    │
│  │  📦 我的订单   🚪 开门记录   │    │
│  └──────────────────────────────┘    │
└────────────────────────────────────────┘
```

### 5.3 核心组件

| 组件名 | 用途 | 位置 |
|--------|------|------|
| module-card | 首页模块入口卡片 | components/module-card/ |
| quick-action | 快捷入口按钮组 | components/quick-action/ |
| meeting-room-card | 会议室信息卡片 | components/meeting-room-card/ |
| merchant-card | 商家卡片 | components/merchant-card/ |
| product-card | 团购商品卡片 | components/product-card/ |
| visitor-form | 访客预约表单 | components/visitor-form/ |
| access-record | 通行记录列表项 | components/access-record/ |
| loading-button | 带加载状态的按钮 | components/loading-button/ |
| empty-state | 空状态占位 | components/empty-state/ |

---

## 6. Web 管理端设计

### 6.1 页面结构

```
pages/
├── dashboard/              # 数据概览
├── tenant/                  # 租户管理
│   ├── list/               # 租户列表
│   └── detail/            # 租户详情
├── employee/               # 员工管理
│   ├── list/             # 员工列表
│   └── import/           # 批量导入
├── property/              # 物业配置
│   ├── meeting/          # 会议室管理
│   └── space/            # 场地管理
├── merchant/              # 商家管理
│   ├── list/            # 商家列表
│   ├── add/             # 添加商家
│   └── category/        # 分类管理
├── groupbuy/             # 团购管理
│   ├── product/         # 商品管理
│   └── order/           # 订单管理
└── access/               # 门禁配置
    ├── device/          # 设备管理
    └── rule/            # 通行规则
```

### 6.2 布局结构

```
┌────────────────────────────────────────────────────────┐
│  Logo   会想家管理后台           [当前租户 ▼] [退出]   │
├──────────┬─────────────────────────────────────────────┤
│          │                                             │
│  📊 数据概览 │                                         │
│  🏢 租户管理 │           内容区域                       │
│  👥 员工管理 │                                         │
│  🏠 物业配置 │                                         │
│  🏪 商家管理 │                                         │
│  📦 团购管理 │                                         │
│  🚪 门禁配置 │                                         │
│  ⚙️ 系统设置 │                                         │
│          │                                             │
└──────────┴─────────────────────────────────────────────┘
```

---

## 7. 部署架构

### 7.1 腾讯云部署

```
┌─────────────────────────────────────────────────────┐
│                   腾讯云                           │
│                                                 │
│  ┌─────────────────────────────────────────┐    │
│  │            CVM 云服务器                  │    │
│  │  ┌───────────┐  ┌───────────┐          │    │
│  │  │  NestJS   │  │  React   │          │    │
│  │  │  API      │  │  Web     │          │    │
│  │  │  :3000    │  │  Admin   │          │    │
│  │  │           │  │  :3001   │          │    │
│  │  └───────────┘  └───────────┘          │    │
│  └─────────────────────────────────────────┘    │
│        │                                        │
│  ┌─────────────────────────────────────────┐    │
│  │            腾讯云 MySQL                   │    │
│  │           内网访问                       │    │
│  └─────────────────────────────────────────┘    │
│                                                 │
└─────────────────────────────────────────────────────┘
```

### 7.2 域名规划

| 服务 | 域名 | 说明 |
|------|------|------|
| API | api.huixiangjia.com | 后端 API |
| Web 管理端 | admin.huixiangjia.com | 管理后台 |

### 7.3 Nginx 配置要点

- HTTPS 强制跳转
- API 反向代理到 NestJS
- Web 静态资源托管
- CORS 跨域配置

---

## 8. MVP 交付计划

### 第一期（核心功能）

| 模块 | 功能点 | 优先级 | 预计工时 |
|------|--------|--------|----------|
| 登录 | 企业微信 OAuth 接入 | P0 | 1天 |
| 首页 | 4 个模块入口 + 快捷入口 | P0 | 1天 |
| 办公物业 | 会议室列表 + 预约 | P0 | 2天 |
| 办公物业 | 场地查询 | P1 | 1天 |
| 周边商家 | 商家列表 + 详情 + 收藏 | P0 | 2天 |
| 公司团购 | 商品列表 + 下单 | P0 | 2天 |
| 公司门禁 | 访客预约 + 通行码 | P0 | 2天 |
| 管理端 | 基础框架 + 账号管理 | P0 | 2天 |
| 管理端 | 各模块 CRUD | P1 | 3天 |

**第一期总工时**：约 16 天

### 第二期（完善功能）

- 报修提交 + 进度查询
- 工位预订
- 订单管理
- 通行记录查询
- 数据统计仪表盘

---

## 9. 环境准备清单

### 微信小程序

- [ ] AppID：wxc05716d83a396368（已有）
- [ ] 企业微信 CorpID
- [ ] 企业应用 AgentID 和 Secret
- [ ] 门禁设备 API 对接文档

### 腾讯云

- [ ] 云服务器 CVM
- [ ] 云数据库 MySQL
- [ ] 域名备案
- [ ] SSL 证书

### 企业微信

- [ ] 管理员账号
- [ ] 应用可信域名配置
- [ ] 通讯录同步权限
