/**
 * 评价相关路由
 */
const { Router } = require('express');
const { getDb, queryAll, queryOne, saveDb } = require('../db/init');

const router = Router();

/**
 * GET /api/reviews
 */
router.get('/', (req, res) => {
  try {
    const db = getDb();
    const { product_id, page = 1, limit = 8 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    const params = [];
    let where = '';

    if (product_id) {
      where = 'WHERE r.product_id = ?';
      params.push(Number(product_id));
    }

    const countRow = queryOne(db, `SELECT COUNT(*) as total FROM reviews r ${where}`, params);
    const total = countRow ? countRow.total : 0;

    const reviews = queryAll(db, `
      SELECT r.id, r.content, r.rating, r.region, r.created_at,
             u.nickname, u.avatar,
             p.name as product_name, p.image as product_image, p.price as product_price
      FROM reviews r
      LEFT JOIN users u ON r.user_id = u.id
      LEFT JOIN products p ON r.product_id = p.id
      ${where} ORDER BY r.created_at DESC LIMIT ? OFFSET ?
    `, [...params, Number(limit), offset]);

    res.json({ code: 200, data: { reviews, total, page: Number(page), limit: Number(limit) } });
  } catch (err) {
    res.status(500).json({ code: 500, message: err.message });
  }
});

/**
 * POST /api/reviews
 */
router.post('/', (req, res) => {
  try {
    const { user_id, product_id, content, rating = 5, region = '' } = req.body;
    if (!user_id || !product_id || !content) return res.status(400).json({ code: 400, message: '缺少必填字段' });
    if (content.length < 5) return res.status(400).json({ code: 400, message: '评价不少于 5 字' });

    const db = getDb();
    const product = queryOne(db, 'SELECT id FROM products WHERE id = ?', [product_id]);
    if (!product) return res.status(404).json({ code: 404, message: '商品不存在' });

    db.run('INSERT INTO reviews (user_id, product_id, content, rating, region) VALUES (?, ?, ?, ?, ?)',
      [user_id, product_id, content, rating, region]);
    db.run('UPDATE users SET points = points + 10 WHERE id = ?', [user_id]);
    saveDb();

    const id = db.exec('SELECT last_insert_rowid() as id')[0].values[0][0];
    res.json({ code: 200, message: '评价成功，获得 10 积分', data: { id } });
  } catch (err) {
    res.status(500).json({ code: 500, message: err.message });
  }
});

module.exports = router;
