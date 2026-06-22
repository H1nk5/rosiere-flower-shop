/**
 * 商品相关路由
 */
const { Router } = require('express');
const { getDb, queryAll, queryOne, saveDb } = require('../db/init');

const router = Router();

/**
 * GET /api/products
 * 查询商品列表（支持分类筛选、搜索、分页）
 */
router.get('/', (req, res) => {
  try {
    const db = getDb();
    const { category, keyword, page = 1, limit = 20 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    const params = [];
    let where = 'WHERE p.is_active = 1';

    if (category) {
      where += ' AND c.slug = ?';
      params.push(category);
    }
    if (keyword) {
      where += ' AND (p.name LIKE ? OR p.description LIKE ?)';
      params.push(`%${keyword}%`, `%${keyword}%`);
    }

    const countRow = queryOne(db, `SELECT COUNT(*) as total FROM products p LEFT JOIN categories c ON p.category_id = c.id ${where}`, params);
    const total = countRow ? countRow.total : 0;

    const products = queryAll(db, `
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM products p LEFT JOIN categories c ON p.category_id = c.id
      ${where} ORDER BY p.sold DESC LIMIT ? OFFSET ?
    `, [...params, Number(limit), offset]);

    res.json({ code: 200, data: { products, total, page: Number(page), limit: Number(limit) } });
  } catch (err) {
    res.status(500).json({ code: 500, message: err.message });
  }
});

/**
 * GET /api/products/hot/list
 * 热销商品
 */
router.get('/hot/list', (req, res) => {
  try {
    const db = getDb();
    const products = queryAll(db, `
      SELECT p.*, c.name as category_name
      FROM products p LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.is_active = 1 ORDER BY p.sold DESC LIMIT 8
    `);
    res.json({ code: 200, data: products });
  } catch (err) {
    res.status(500).json({ code: 500, message: err.message });
  }
});

/**
 * GET /api/products/:id
 * 商品详情
 */
router.get('/:id', (req, res) => {
  try {
    const db = getDb();
    const product = queryOne(db, `
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM products p LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ?
    `, [Number(req.params.id)]);

    if (!product) return res.status(404).json({ code: 404, message: '商品不存在' });

    const reviews = queryAll(db, `
      SELECT r.*, u.nickname, u.avatar
      FROM reviews r LEFT JOIN users u ON r.user_id = u.id
      WHERE r.product_id = ? ORDER BY r.created_at DESC LIMIT 10
    `, [Number(req.params.id)]);

    res.json({ code: 200, data: { ...product, reviews } });
  } catch (err) {
    res.status(500).json({ code: 500, message: err.message });
  }
});

module.exports = router;
