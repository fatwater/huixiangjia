# 会想家 (Huixiangjia)

多租户 SaaS 智慧园区服务平台

## 项目概述

会想家是一款面向企业园区的多租户 SaaS 平台，提供办公物业管理、周边商家服务、公司团购、公司门禁等功能。

## 技术栈

| 模块 | 技术 |
|------|------|
| 小程序前端 | Skyline + glass-easel |
| Web 管理端 | React + Ant Design |
| 后端服务 | NestJS + TypeORM |
| 数据库 | MySQL |
| 认证 | 企业微信 OAuth |

## 项目结构

```
miniprogram-2/
├── pages/                    # 小程序页面
│   ├── index/               # 首页
│   ├── property/             # 办公物业
│   ├── merchant/            # 周边商家
│   ├── groupbuy/            # 公司团购
│   ├── access/              # 公司门禁
│   └── profile/             # 个人中心
├── components/               # 小程序组件
├── api/                     # 小程序 API 服务层
├── utils/                   # 小程序工具函数
├── server/                  # NestJS 后端
│   └── src/
│       └── modules/         # 业务模块
│           ├── auth/        # 认证模块
│           ├── tenant/      # 租户模块
│           ├── user/        # 用户模块
│           ├── property/    # 物业模块
│           ├── merchant/    # 商家模块
│           ├── groupbuy/    # 团购模块
│           ├── access/      # 门禁模块
│           ├── payment/     # 支付模块
│           ├── dashboard/   # 统计模块
│           ├── upload/      # 文件上传
│           └── health/      # 健康检查
├── web-admin/               # Web 管理端
└── docs/                   # 文档
```

## 快速开始

### 1. 环境要求

- Node.js >= 16
- MySQL >= 5.7
- 微信开发者工具

### 2. 数据库初始化

```bash
mysql -u root -p < server/database/init.sql
```

### 3. 配置后端

```bash
cd server
cp config.yaml.example config.yaml
# 编辑 config.yaml 填入数据库和企业微信配置
```

### 4. 启动后端

```bash
cd server
npm install
npm run start:dev
```

### 5. 启动 Web 管理端

```bash
cd web-admin
npm install
npm start
```

### 6. 导入小程序

使用微信开发者工具打开项目目录 `E:\WeChatProjects\miniprogram-2`

## 默认账号

- **管理员登录**：手机号 `13800138000`，密码 `admin123`
- **Web 管理端**：`http://localhost:3000`

## API 文档

启动后端后访问：http://localhost:3000/api/docs

## 主要功能

### 小程序端
- 首页：数据概览、快速入口
- 办公物业：会议室预约、我的预约
- 周边商家：商家列表、收藏、详情
- 公司团购：商品列表、下单、提货码
- 公司门禁：访客预约、通行码、通行记录
- 个人中心：用户信息、统计数据

### Web 管理端
- 仪表盘：数据统计
- 租户管理：多租户配置
- 员工管理：员工 CRUD
- 会议室管理：会议室配置
- 商家管理：商家 CRUD
- 团购管理：商品、订单管理
- 门禁配置：设备管理

## 配置说明

### config.yaml

```yaml
port: 3000

database:
  host: localhost
  port: 3306
  username: root
  password: your_password
  database: huixiangjia

jwt:
  secret: your-jwt-secret
  expiresIn: '7d'

wecom:
  corpId: your-corp-id
  agentId: your-agent-id
  secret: your-agent-secret

wepay:
  appId: your-appid
  mchId: your-mchid
  mchKey: your-mchkey
  notifyUrl: http://your-domain/api/v1/payment/notify
```

## 开发说明

- 分支策略：`main` 为稳定分支，`dev` 为开发分支
- 提交规范：使用 `feat:`、`fix:`、`docs:` 等前缀
- 代码规范：遵循 ESLint 配置

## License

MIT
