/**
 * 分类相关路由
 */
const { Router } = require('express');
const { getDb, queryAll } = require('../db/init');

const router = Router();

/**
 * GET /api/categories
 */
router.get('/', (req, res) => {
  try {
    const db = getDb();
    const categories = queryAll(db, `
      SELECT c.*, COUNT(p.id) as product_count
      FROM categories c
      LEFT JOIN products p ON p.category_id = c.id AND p.is_active = 1
      GROUP BY c.id ORDER BY c.sort_order
    `);
    res.json({ code: 200, data: categories });
  } catch (err) {
    res.status(500).json({ code: 500, message: err.message });
  }
});

module.exports = router;
