<div align="center">

# 🌸 ROSIÈRE

**A Modern Luxury Flower Shop — Full-Stack E-Commerce Platform**

<br>

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap_5-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)

<br>

A full-stack flower e-commerce platform crafted with a **French luxury minimalist** aesthetic.<br>
Front-end built on semantic HTML5 & Bootstrap 5 grid system. Back-end powered by Node.js, Express & SQLite.

[Getting Started](#-getting-started) · [Features](#-features) · [API Reference](#-api-reference) · [Architecture](#-architecture)

</div>

---

## About

ROSIÈRE is a premium online flower shop that blends **haute couture visual design** with **production-grade engineering**. The platform features a refined color palette of deep rose red (`#8B1E2F`), champagne gold (`#C5A46C`), and warm ivory (`#FAFAFA`), expressed through meticulous micro-shadows, fluid transitions, and a responsive six-breakpoint layout system.

### Design Philosophy

| Element | Approach |
|---------|----------|
| Color | Low-saturation rose red primary, champagne gold accent, warm white surface |
| Typography | System serif display + sans-serif body, `0.02em` letter-spacing |
| Shadow | Three-tier warm-tinted shadows (`rgba(139,30,47,...)`) |
| Motion | `cubic-bezier(0.25, 0.46, 0.45, 0.94)` easing across all interactions |
| Layout | Bootstrap 5 12-column grid, `clamp()` fluid typography, CSS custom properties |

---

## Features

### Front-End Modules

| Module | Description | Implementation |
|--------|-------------|----------------|
| **Fast Navigation** | Auth, cart, service hotline — desktop-only right panel | `d-none d-md-flex` conditional visibility |
| **Navigation Bar** | Responsive collapse with smooth scroll anchors | `navbar-expand-md`, `scroll-behavior: smooth` |
| **Hero Carousel** | Auto-advancing dual-slide banner, 2s interval | Bootstrap Carousel, `data-bs-pause="false"` |
| **Service Bar** | Five trust signals in a single row | CSS Sprites (`common_sprite.png`) |
| **Flower Gallery** | 8 recommendation cards (portrait + landscape) | `object-fit: cover/contain` with orientation modifiers |
| **Product Grid** | 10 product cards with hover zoom | `transform: scale(1.1)`, `overflow: hidden` |
| **Reviews** | 8 user testimonials with truncation | `-webkit-line-clamp`, flexbox card layout |
| **Service Terms** | 4-column footer links, 16 content pages | Dynamic Bootstrap Modal injection |

### Interactive Features

- **Authentication** — Login / Register via Bootstrap Modals, bcrypt-hashed passwords, localStorage session persistence
- **Shopping Cart** — Hover-reveal add-to-cart buttons, real-time sync with SQLite backend
- **Live Chat** — Floating chat widget with slide-up animation, message bubbles, and simulated auto-replies
- **Service Pages** — 16 rich-content modals (shipping, returns, membership, FAQ, social media)
- **Accessibility** — `prefers-reduced-motion`, `prefers-color-scheme: dark`, `focus-visible` outlines, `@media print`

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- npm ≥ 8

### Installation

```bash
git clone https://github.com/H1nk5/rosiere-flower-shop.git
cd rosiere-flower-shop
npm install
npm start
```

Open **http://localhost:3000** in your browser.

### Commands

| Command | Description |
|---------|-------------|
| `npm start` | Start production server |
| `npm run dev` | Start with file-watch auto-restart |
| `npm run seed` | Re-seed database with sample data |
| `npm run reset` | Drop & recreate database from scratch |

### Demo Accounts

| Username | Password | Role |
|----------|----------|------|
| `test` | `123456` | Regular user (1,280 pts) |
| `demo` | `123456` | Regular user (560 pts) |
| `admin` | `123456` | Admin (9,999 pts) |

---

## Architecture

```
rosiere-flower-shop/
│
├── index.html                    # Single-page application entry
│
├── css/
│   ├── bootstrap.min.css         # Bootstrap 5 framework
│   ├── index.css                 # Design tokens, components, chat widget
│   └── media.css                 # 6-breakpoint responsive + dark mode + print
│
├── js/
│   ├── bootstrap.min.js          # Bootstrap JS runtime
│   └── app.js                    # SPA logic: auth, cart, chat, content pages
│
├── images/                       # Product & UI assets
│   ├── elder1-10.jpg             # Product catalog (10 items)
│   ├── slide01/02.jpg            # Carousel slides
│   ├── common_sprite.png         # CSS sprite sheet
│   └── ...
│
├── bootstrap-icons/              # Icon font (1800+ SVG icons)
│
├── server/
│   ├── server.js                 # Express entry point
│   ├── db/
│   │   ├── init.js               # Schema definition & query helpers
│   │   ├── seed.js               # Sample data seeder
│   │   └── flower_shop.db        # SQLite database (auto-generated)
│   └── routes/
│       ├── products.js           # Product CRUD & search
│       ├── users.js              # Auth (register / login)
│       ├── cart.js               # Shopping cart operations
│       ├── reviews.js            # Review submission & listing
│       └── categories.js         # Category taxonomy
│
├── package.json
├── .gitignore
└── README.md
```

---

## API Reference

### Products

```
GET    /api/products              List products (?category=&keyword=&page=&limit=)
GET    /api/products/:id          Product detail (includes reviews)
GET    /api/products/hot/list     Top 8 bestsellers
GET    /api/categories            Category list with product counts
```

### Authentication

```
POST   /api/users/register        Register (+100 bonus points)
POST   /api/users/login           Login (returns user object)
GET    /api/users/:id             User profile
```

### Shopping Cart

```
GET    /api/cart?user_id=1        View cart
POST   /api/cart                  Add item { user_id, product_id, quantity? }
PUT    /api/cart/:id              Update quantity { quantity }
DELETE /api/cart/:id              Remove item
```

### Reviews

```
GET    /api/reviews               List reviews (?product_id=&page=&limit=)
POST   /api/reviews               Submit review (+10 points) { user_id, product_id, content, rating?, region? }
```

---

## Responsive Breakpoints

| Token | Range | Target | Strategy |
|-------|-------|--------|----------|
| `xs` | < 576px | Portrait phone | Single column, `font-size: 14px`, 3+2 service layout |
| `sm` | 576 – 768px | Landscape phone | 2-column grid |
| `md` | 768 – 992px | Tablet | 3-column products, navbar expands |
| `lg` | 992 – 1200px | Small desktop | 4-column gallery |
| `xl` | 1200 – 1400px | Standard desktop | 5-column product grid |
| `xxl` | ≥ 1400px | Large desktop | Wider spacing, larger headings |

---

## Design System

```css
:root {
  --clr-primary: #8B1E2F;           /* Haute couture rose red */
  --clr-gold: #C5A46C;              /* Champagne gold accent */
  --clr-warm-white: #FAFAFA;        /* Warm ivory surface */
  --shadow-sm: 0 2px 8px rgba(139, 30, 47, 0.06);
  --shadow-md: 0 4px 20px rgba(139, 30, 47, 0.08);
  --shadow-lg: 0 8px 32px rgba(139, 30, 47, 0.12);
  --transition-normal: 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
```

---

## Changelog

| Version | Date | Highlights |
|---------|------|-----------|
| **2.2** | 2026-06 | Live chat widget, 16 service content pages |
| **2.1** | 2026-06 | Auth modals, shopping cart, session persistence |
| **2.0** | 2026-06 | Node.js + Express backend, SQLite database, RESTful API |
| **1.3** | 2026-06 | Full responsive refactor — 6 breakpoints, root font scaling |
| **1.2** | 2026-06 | Image viewport fix — orientation-aware `object-fit` |
| **1.1** | 2026-06 | French luxury design system — CSS variables, shadows, transitions |
| **1.0** | 2026-06 | Semantic HTML5 scaffold + Bootstrap 5 grid layout |

---

## License

MIT © [H1nk5](https://github.com/H1nk5)
