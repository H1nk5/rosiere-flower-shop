/**
 * ROSIÈRE 鲜花商城 — 后端服务入口
 * 技术栈：Node.js + Express + SQLite (sql.js)
 */
const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const { initDb, DB_PATH } = require('./db/init');

const app = express();
const PORT = process.env.PORT || 3000;

// ── 中间件 ──
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── 静态文件托管 ──
app.use(express.static(path.join(__dirname, '..')));

// ── 请求日志 ──
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const ms = Date.now() - start;
    const status = res.statusCode;
    const color = status >= 400 ? '\x1b[31m' : '\x1b[32m';
    console.log(`  ${color}${status}\x1b[0m ${req.method} ${req.originalUrl} — ${ms}ms`);
  });
  next();
});

// ── 首页 ──
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// ── 异步启动 ──
(async () => {
  // 初始化数据库
  console.log('📦 正在初始化数据库...');
  await initDb();

  // 如果没有商品数据，自动 seed
  const { queryOne } = require('./db/init');
  const db = (await Promise.resolve(require('./db/init').getDb()));
  const count = queryOne(db, 'SELECT COUNT(*) as c FROM products');
  if (!count || count.c === 0) {
    console.log('🌱 数据库为空，正在填充种子数据...');
    require('./db/seed');
    console.log('');
  }

  // ── API 路由 ──
  app.use('/api/products',   require('./routes/products'));
  app.use('/api/users',      require('./routes/users'));
  app.use('/api/cart',       require('./routes/cart'));
  app.use('/api/reviews',    require('./routes/reviews'));
  app.use('/api/categories', require('./routes/categories'));

  // ── API 404 ──
  app.use('/api/*', (req, res) => {
    res.status(404).json({ code: 404, message: '接口不存在' });
  });

  // ── 全局错误处理 ──
  app.use((err, req, res, next) => {
    console.error('❌ 服务器错误:', err.message);
    res.status(500).json({ code: 500, message: '服务器内部错误' });
  });

  // ── 启动 ──
  app.listen(PORT, () => {
    console.log('')
    console.log('  🌸 ════════════════════════════════════════ 🌸')
    console.log('  ║                                           ║')
    console.log('  ║   ROSIÈRE 在线鲜花商城 — 后端服务已启动   ║')
    console.log('  ║                                           ║')
    console.log(`  ║   🌐 地址: http://localhost:${PORT}            ║`)
    console.log('  ║   📂 数据: server/db/flower_shop.db       ║')
    console.log('  ║   👤 测试: test / 123456                  ║')
    console.log('  ║                                           ║')
    console.log('  🌸 ════════════════════════════════════════ 🌸')
    console.log('')
    console.log('  API 接口：')
    console.log('    GET    /api/products          商品列表')
    console.log('    GET    /api/products/:id       商品详情')
    console.log('    GET    /api/categories         分类列表')
    console.log('    POST   /api/users/register     用户注册')
    console.log('    POST   /api/users/login        用户登录')
    console.log('    GET    /api/cart?user_id=1      购物车')
    console.log('    POST   /api/cart               加入购物车')
    console.log('    PUT    /api/cart/:id            更新数量')
    console.log('    DELETE /api/cart/:id            删除')
    console.log('    GET    /api/reviews             评价列表')
    console.log('    POST   /api/reviews             发表评价')
    console.log('')
  });
})();
