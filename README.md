<div align="center">

# 🌸 ROSIÈRE

**现代法式轻奢鲜花电商平台 · 全栈系统**

<br>

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap_5-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)

<br>

基于语义化 HTML5 与 Bootstrap 5 栅格体系构建前端交互层<br>
Node.js + Express 驱动 RESTful 后端服务，SQLite 持久化业务数据

[快速启动](#-快速启动) · [系统功能](#-系统功能) · [技术架构](#-技术架构) · [接口文档](#-接口文档)

</div>

---

## 系统概述

ROSIÈRE 是一套面向鲜花电商场景的全栈 Web 系统，采用**现代法式轻奢 / 极简高级感**的视觉语言，覆盖了从商品展示、用户交互到后端数据管理的完整业务链路。

系统前端基于 Bootstrap 5 响应式栅格体系，通过 CSS 自定义属性构建了一套统一的设计令牌（Design Tokens）系统，实现了色彩、阴影、圆角、过渡动效的全局一致性；后端采用 Node.js + Express 构建 RESTful API，配合 SQLite 轻量级数据库完成数据持久化，整体架构清晰、模块解耦、易于扩展。

### 设计语言

| 维度 | 实现方案 |
|------|---------|
| 色彩体系 | 主色 `#8B1E2F`（高定玫瑰红）、辅色 `#C5A46C`（香槟金）、底色 `#FAFAFA`（暖白） |
| 阴影层级 | 三级递进式暖色调微阴影 `rgba(139,30,47,...)` |
| 过渡动效 | `cubic-bezier(0.25, 0.46, 0.45, 0.94)` 贯穿全站交互 |
| 排版细节 | `clamp()` 流式字号、`letter-spacing` 字间距、`::selection` 选中色 |
| 响应式 | 六档断点（xs → xxl）+ 根字号降级 + 暗色模式 + 打印适配 |

---

## 系统功能

### 前端交互层

| 模块 | 功能描述 | 核心技术 |
|------|---------|---------|
| **快捷导航** | 登录/注册/购物车/客服热线，桌面端右侧自动显隐 | Bootstrap Icons、`d-none d-md-flex` |
| **主导航栏** | 响应式折叠导航 + 锚点平滑滚动定位 | `navbar-expand-md`、`scroll-behavior: smooth`、`scroll-margin-top` |
| **轮播图** | 双图自动轮播，2 秒间隔，悬停不暂停 | Bootstrap Carousel、`data-bs-interval="2000"` |
| **服务模块** | 五项信任标识单行横排展示 | CSS Sprites 精灵图、`background-position` 定位 |
| **鲜花推荐** | 8 张推荐卡片（竖图/横图差异化适配） | `object-fit: cover/contain`、方向修饰类 |
| **商品列表** | 10 个商品卡片，悬停平滑放大 | `transform: scale(1.1)`、`overflow: hidden` 裁切 |
| **用户评价** | 8 条评价卡片，超长文本省略号截断 | `-webkit-line-clamp`、Flexbox 弹性布局 |
| **服务条款** | 四列链接 + 16 个内容详情页 | 动态 Bootstrap Modal 注入 |

### 用户交互系统

- **身份认证** — 登录/注册弹窗，bcrypt 密码加密，localStorage 会话持久化
- **购物车** — 商品卡片悬停浮现加入按钮，后端实时同步增删改查
- **在线客服** — 右下角浮动聊天窗口，消息气泡 + 模拟自动回复
- **内容服务** — 16 个功能详情页（购物流程/会员体系/退换货/配送/社交平台等）
- **无障碍适配** — `prefers-reduced-motion`、`prefers-color-scheme: dark`、`@media print`

### 后端服务层

- **用户服务** — 注册（自动赠送积分）、登录、个人信息查询
- **商品服务** — 列表分页、分类筛选、关键词搜索、详情（含评价）
- **购物车服务** — 增删改查、库存校验、数量更新
- **评价服务** — 发表评价（赠送积分）、按商品筛选、分页查询
- **分类服务** — 分类列表、商品数量统计

---

## 技术架构

### 前端技术栈

| 技术 | 版本 | 职责 |
|------|------|------|
| HTML5 | — | 语义化标签构建页面结构 |
| CSS3 | — | 自定义变量、Flexbox、Grid、关键帧动画 |
| Bootstrap 5 | 5.x | 响应式栅格系统、组件（Navbar / Carousel / Modal） |
| Bootstrap Icons | 1.x | 矢量图标库（1800+ 图标） |
| JavaScript | ES6+ | 原生 JS，无框架依赖 |

### 后端技术栈

| 技术 | 版本 | 职责 |
|------|------|------|
| Node.js | ≥ 18 | 运行时环境 |
| Express | 4.x | Web 框架，中间件，路由 |
| sql.js | 1.x | 纯 JS SQLite 实现，免编译部署 |
| bcryptjs | 2.x | 密码哈希加密 |
| cors | 2.x | 跨域资源共享 |

### 数据库表结构

| 表名 | 说明 | 关键字段 |
|------|------|---------|
| `users` | 用户表 | username, password(bcrypt), nickname, points |
| `categories` | 分类表 | name, slug, sort_order |
| `products` | 商品表 | name, price, image, tag, stock, sold |
| `cart_items` | 购物车表 | user_id, product_id, quantity |
| `orders` / `order_items` | 订单表 | order_no, total, status |
| `reviews` | 评价表 | content, rating, region |

---

## 项目结构

```
rosiere-flower-shop/
│
├── index.html                       # 系统主页面（八大模块 + 弹窗 + 客服浮窗）
│
├── css/
│   ├── bootstrap.min.css            # Bootstrap 5 框架样式
│   ├── index.css                    # 设计令牌 / 全局样式 / 组件样式
│   └── media.css                    # 六档断点媒体查询 + 暗色模式 + 打印样式
│
├── js/
│   ├── bootstrap.min.js             # Bootstrap 5 运行时
│   └── app.js                       # 前端交互逻辑（认证/购物车/评价/客服/内容页）
│
├── images/                          # 图片资源
│   ├── elder1-10.jpg                # 商品图片 ×10
│   ├── slide01.jpg / slide02.jpg    # 轮播图
│   ├── common_sprite.png            # CSS 精灵图
│   └── ...
│
├── bootstrap-icons/font/            # 运行所需的精简 Bootstrap Icons 字体
│
├── server/
│   ├── server.js                    # Express 服务入口
│   ├── db/
│   │   ├── init.js                  # 数据库连接 / 建表 / 查询工具函数
│   │   ├── seed.js                  # 种子数据（18 商品 / 3 用户 / 8 评价）
│   │   └── flower_shop.db           # SQLite 数据库文件（自动生成）
│   └── routes/
│       ├── products.js              # 商品接口
│       ├── users.js                 # 用户接口
│       ├── cart.js                  # 购物车接口
│       ├── reviews.js               # 评价接口
│       └── categories.js            # 分类接口
│
├── package.json                     # 项目配置与依赖
├── .gitignore                       # Git 忽略规则
└── README.md                        # 系统说明文档
```

---

## 快速启动

### 环境要求

- Node.js ≥ 18
- npm ≥ 8

### 安装与运行

```bash
# 克隆仓库
git clone https://github.com/H1nk5/rosiere-flower-shop.git
cd rosiere-flower-shop

# 安装依赖
npm install

# 启动系统
npm start
```

浏览器访问 **http://localhost:3000** 即可进入系统。

### 命令速查

| 命令 | 说明 |
|------|------|
| `npm start` | 启动生产服务 |
| `npm run dev` | 开发模式（文件变更自动重启） |
| `npm run seed` | 重新填充种子数据 |
| `npm run reset` | 重置数据库（清空并重新初始化） |

### 测试账号

| 用户名 | 密码 | 昵称 | 积分 |
|--------|------|------|------|
| `test` | `123456` | 花间漫步 | 1,280 |
| `demo` | `123456` | 浪漫主义者 | 560 |
| `admin` | `123456` | 系统管理员 | 9,999 |

---

## 接口文档

### 商品服务

| 方法 | 路径 | 说明 | 参数 |
|------|------|------|------|
| `GET` | `/api/products` | 商品列表 | `?category=elder&keyword=玫瑰&page=1&limit=20` |
| `GET` | `/api/products/:id` | 商品详情（含评价） | — |
| `GET` | `/api/products/hot/list` | 热销 TOP 8 | — |
| `GET` | `/api/categories` | 分类列表（含商品数） | — |

### 用户服务

| 方法 | 路径 | 说明 | 参数 |
|------|------|------|------|
| `POST` | `/api/users/register` | 注册（赠送 100 积分） | `{ username, password, nickname?, phone? }` |
| `POST` | `/api/users/login` | 登录 | `{ username, password }` |
| `GET` | `/api/users/:id` | 用户信息 | — |

### 购物车服务

| 方法 | 路径 | 说明 | 参数 |
|------|------|------|------|
| `GET` | `/api/cart` | 查询购物车 | `?user_id=1` |
| `POST` | `/api/cart` | 加入购物车 | `{ user_id, product_id, quantity? }` |
| `PUT` | `/api/cart/:id` | 更新数量 | `{ quantity }` |
| `DELETE` | `/api/cart/:id` | 删除商品 | — |

### 评价服务

| 方法 | 路径 | 说明 | 参数 |
|------|------|------|------|
| `GET` | `/api/reviews` | 评价列表 | `?product_id=1&page=1&limit=8` |
| `POST` | `/api/reviews` | 发表评价（赠送 10 积分） | `{ user_id, product_id, content, rating?, region? }` |

---

## 响应式体系

| 断点 | 范围 | 目标设备 | 布局策略 |
|------|------|---------|---------|
| `xs` | < 576px | 竖屏手机 | 单列布局、根字号 14px、服务模块 3+2 折行 |
| `sm` | 576 – 768px | 横屏手机 | 双列网格 |
| `md` | 768 – 992px | 平板设备 | 三列商品、导航栏水平展开 |
| `lg` | 992 – 1200px | 小屏桌面 | 四列推荐卡片 |
| `xl` | 1200 – 1400px | 标准桌面 | 五列商品网格 |
| `xxl` | ≥ 1400px | 大屏桌面 | 加宽间距、放大标题字号 |

---

## 设计令牌

```css
:root {
  --clr-primary: #8B1E2F;           /* 高定玫瑰红 */
  --clr-gold: #C5A46C;              /* 香槟金 */
  --clr-warm-white: #FAFAFA;        /* 暖白 */
  --shadow-sm: 0 2px 8px rgba(139, 30, 47, 0.06);
  --shadow-md: 0 4px 20px rgba(139, 30, 47, 0.08);
  --shadow-lg: 0 8px 32px rgba(139, 30, 47, 0.12);
  --transition-normal: 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
```

---

## 版本记录

| 版本 | 日期 | 更新内容 |
|------|------|---------|
| **v2.2** | 2026-06 | 在线客服浮窗 + 16 个服务内容详情页 |
| **v2.1** | 2026-06 | 登录注册弹窗 + 购物车系统 + 用户状态管理 |
| **v2.0** | 2026-06 | Node.js 后端服务 + SQLite 数据库 + RESTful API |
| **v1.3** | 2026-06 | 全面响应式重构 — 六档断点 + 根字号降级 + 文本截断 |
| **v1.2** | 2026-06 | 推荐卡片图片视口适配 — `object-fit` 方向修饰类方案 |
| **v1.1** | 2026-06 | 法式轻奢设计体系 — CSS 变量 / 微阴影 / 过渡动效 |
| **v1.0** | 2026-06 | HTML5 语义化骨架 + Bootstrap 5 栅格布局 |

---

## 开源许可

MIT © [H1nk5](https://github.com/H1nk5)
