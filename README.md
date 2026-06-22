# 🌸 ROSIÈRE — 在线鲜花商城

> Web开发基础课程期末大作业 — 一个具有完整前后端的现代法式轻奢风格鲜花电商首页

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap%205-7952B3?style=flat&logo=bootstrap&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-003B57?style=flat&logo=sqlite&logoColor=white)

---

## 📖 项目简介

本项目是一个在线鲜花商城的首页，采用**现代法式轻奢 / 极简高级感**的视觉风格，实现了八大核心功能模块，并配备了完整的 Node.js 后端 API 与 SQLite 数据库。

### 设计理念

- **主色调**：低饱和度深优雅红 `#8B1E2F`（高定玫瑰红）
- **辅助色**：香槟金 `#C5A46C`、柔和暖白 `#FAFAFA`
- **设计语言**：精致微阴影、优雅圆角、细腻字间距、丝滑过渡动效

---

## ✨ 功能特性

### 前端八大模块

| 模块 | 功能 | 技术要点 |
|------|------|---------|
| 🔗 快捷导航 | 登录/注册/购物车/客服热线 | Bootstrap Icons、响应式显隐 |
| 🧭 导航栏 | 响应式导航 + 锚点平滑滚动 | `navbar-expand-md`、`scroll-behavior: smooth` |
| 🎠 轮播图 | 双图自动轮播 + 手动控制 | Bootstrap Carousel、`data-bs-interval="2000"` |
| 🏅 服务模块 | 5 项服务横排展示 | CSS Sprites 精灵图 |
| 💐 鲜花推荐 | 8 张推荐卡片（大图+小图） | Bootstrap Grid、`object-fit` 差异化适配 |
| 🎁 送长辈鲜花 | 10 个商品卡片 + 悬停放大 | `transform: scale(1.1)`、`transition: 0.45s` |
| 💬 晒单评价 | 8 条用户评价卡片 | `-webkit-line-clamp` 多行文本截断 |
| 📋 服务条款 | 4 列链接 + 16 个功能详情页 | 动态 Modal 内容注入 |

### 交互功能

- ✅ **登录 / 注册**：Bootstrap Modal 弹窗，对接后端 API
- ✅ **用户状态管理**：localStorage 持久化，刷新不丢失
- ✅ **购物车**：商品卡片 hover 浮现加入按钮，实时同步后端
- ✅ **在线客服**：右下角浮窗，消息气泡 + 自动回复
- ✅ **服务条款**：16 个详情页（购物流程/会员/退换货/配送等）
- ✅ **响应式适配**：xs/sm/md/lg/xl/xxl 六档断点全覆盖

### 后端 API

- ✅ 用户注册 / 登录（bcrypt 密码加密）
- ✅ 商品列表 / 详情 / 搜索 / 分类筛选
- ✅ 购物车 CRUD（增删改查）
- ✅ 评价列表 / 发表评价
- ✅ 分类列表

---

## 🛠️ 技术栈

### 前端

| 技术 | 版本 | 用途 |
|------|------|------|
| HTML5 | — | 语义化标签构建页面结构 |
| CSS3 | — | 自定义变量、Flexbox、Grid、动画 |
| Bootstrap 5 | 5.x | 响应式栅格、组件（Navbar/Carousel/Modal） |
| Bootstrap Icons | 1.x | 矢量图标库 |
| JavaScript (ES6+) | — | 原生 JS，无框架依赖 |

### 后端

| 技术 | 版本 | 用途 |
|------|------|------|
| Node.js | ≥18 | 运行时环境 |
| Express | 4.x | Web 框架，RESTful API |
| sql.js | 1.x | 纯 JS SQLite 实现，免编译 |
| bcryptjs | 2.x | 密码哈希加密 |
| cors | 2.x | 跨域资源共享 |

---

## 🚀 快速开始

### 环境要求

- Node.js ≥ 18
- npm ≥ 8

### 安装与运行

```bash
# 1. 克隆仓库
git clone https://github.com/H1nk5/rosiere-flower-shop.git
cd rosiere-flower-shop

# 2. 安装依赖
npm install

# 3. 启动服务
npm start
```

浏览器访问 **http://localhost:3000** 即可。

### 其他命令

```bash
npm run seed     # 重新填充种子数据
npm run reset    # 重置数据库（清空 + 重新 seed）
npm run dev      # 开发模式（文件变更自动重启）
```

### 测试账号

| 用户名 | 密码 | 昵称 | 积分 |
|--------|------|------|------|
| `test` | `123456` | 花间漫步 | 1280 |
| `demo` | `123456` | 浪漫主义者 | 560 |
| `admin` | `123456` | 系统管理员 | 9999 |

---

## 📁 项目结构

```
rosiere-flower-shop/
│
├── index.html                 # 主页面（八大模块 + 弹窗 + 客服浮窗）
│
├── css/
│   ├── bootstrap.min.css      # Bootstrap 5 框架样式
│   ├── index.css              # 主样式（变量/全局/组件/客服浮窗）
│   └── media.css              # 媒体查询（六档断点 + 暗色/打印/无障碍）
│
├── js/
│   ├── bootstrap.min.js       # Bootstrap 5 JS（Carousel/Modal/Collapse）
│   └── app.js                 # 前端交互（用户/购物车/评价/客服/页面内容）
│
├── images/                    # 图片资源
│   ├── slide01.jpg            # 轮播图 1
│   ├── slide02.jpg            # 轮播图 2
│   ├── lover.jpg              # 推荐卡片 - 恋人
│   ├── elder.jpg              # 推荐卡片 - 长辈
│   ├── friend.jpg             # 推荐卡片 - 朋友
│   ├── birthday.jpg           # 推荐卡片 - 生日
│   ├── elder1-10.jpg          # 长辈鲜花商品图 ×10
│   ├── avatar.jpg             # 用户头像
│   ├── logo.png               # 品牌 Logo
│   ├── common_sprite.png      # CSS 精灵图（服务模块图标）
│   └── ...
│
├── bootstrap-icons/           # Bootstrap Icons 图标库
│   └── font/
│       ├── bootstrap-icons.min.css
│       └── bootstrap-icons.woff2
│
├── server/
│   ├── server.js              # Express 服务入口
│   ├── db/
│   │   ├── init.js            # 数据库初始化（建表 + 查询工具）
│   │   ├── seed.js            # 种子数据（18 商品 / 3 用户 / 8 评价）
│   │   └── flower_shop.db     # SQLite 数据库文件（自动生成）
│   └── routes/
│       ├── products.js        # 商品 API
│       ├── users.js           # 用户 API
│       ├── cart.js            # 购物车 API
│       ├── reviews.js         # 评价 API
│       └── categories.js      # 分类 API
│
├── package.json               # 项目配置
├── .gitignore                 # Git 忽略规则
└── README.md                  # 项目说明文档
```

---

## 🔌 API 文档

### 商品接口

| 方法 | 路径 | 说明 | 参数 |
|------|------|------|------|
| `GET` | `/api/products` | 商品列表 | `?category=elder&keyword=玫瑰&page=1&limit=20` |
| `GET` | `/api/products/:id` | 商品详情（含评价） | — |
| `GET` | `/api/products/hot/list` | 热销 TOP 8 | — |
| `GET` | `/api/categories` | 分类列表（含商品数） | — |

### 用户接口

| 方法 | 路径 | 说明 | 参数 |
|------|------|------|------|
| `POST` | `/api/users/register` | 注册（送 100 积分） | `{ username, password, nickname?, phone? }` |
| `POST` | `/api/users/login` | 登录 | `{ username, password }` |
| `GET` | `/api/users/:id` | 用户信息 | — |

### 购物车接口

| 方法 | 路径 | 说明 | 参数 |
|------|------|------|------|
| `GET` | `/api/cart` | 查询购物车 | `?user_id=1` |
| `POST` | `/api/cart` | 加入购物车 | `{ user_id, product_id, quantity? }` |
| `PUT` | `/api/cart/:id` | 更新数量 | `{ quantity }` |
| `DELETE` | `/api/cart/:id` | 删除商品 | — |

### 评价接口

| 方法 | 路径 | 说明 | 参数 |
|------|------|------|------|
| `GET` | `/api/reviews` | 评价列表 | `?product_id=1&page=1&limit=8` |
| `POST` | `/api/reviews` | 发表评价（送 10 积分） | `{ user_id, product_id, content, rating?, region? }` |

---

## 📐 响应式断点

| 断点 | 范围 | 设备 | 布局策略 |
|------|------|------|---------|
| xs | < 576px | 竖屏手机 | 单列、根字号 14px、服务模块 3+2 |
| sm | 576 - 768px | 横屏手机 | 双列推荐卡片 |
| md | 768 - 992px | 平板 | 三列商品、导航栏展开 |
| lg | 992 - 1200px | 小桌面 | 四列推荐 |
| xl | 1200 - 1400px | 标准桌面 | 五列商品 |
| xxl | ≥ 1400px | 大桌面 | 加宽间距、放大标题 |

---

## 🎨 设计细节

### CSS 变量体系

```css
:root {
  --clr-primary: #8B1E2F;       /* 高定玫瑰红 */
  --clr-gold: #C5A46C;          /* 香槟金 */
  --clr-warm-white: #FAFAFA;    /* 暖白 */
  --shadow-sm: 0 2px 8px rgba(139, 30, 47, 0.06);  /* 暖色调微阴影 */
  --transition-normal: 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);  /* 丝滑缓动 */
}
```

### 核心动效

- **导航项**：`::after` 伪元素渐变下划线，hover 居中展开
- **商品卡片**：hover 上浮 6px + 阴影加深 + 图片放大 1.1 倍
- **推荐卡片**：hover 遮罩层从灰色渐变为玫瑰红
- **客服浮窗**：`slideUp` 入场动画 + 消息气泡渐变色

---

## 📸 页面截图

> 启动服务后访问 http://localhost:3000 查看完整效果

---

## 📝 开发日志

- **v1.0** — 完成 HTML 语义化骨架 + Bootstrap 5 栅格布局
- **v1.1** — 实现法式轻奢视觉设计（CSS 变量 + 阴影 + 过渡动效）
- **v1.2** — 修复推荐卡片图片截断 Bug（object-fit 方向修饰类）
- **v1.3** — 全面响应式重构（六档断点 + 根字号降级 + 文本截断）
- **v2.0** — 新增 Node.js 后端 + SQLite 数据库 + RESTful API
- **v2.1** — 新增登录注册弹窗 + 购物车 + 用户状态管理
- **v2.2** — 新增在线客服浮窗 + 16 个服务条款功能页

---

## 📄 License

MIT License © 2026 ROSIÈRE
