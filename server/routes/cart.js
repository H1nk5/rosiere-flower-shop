/**
 * 购物车相关路由
 */
const { Router } = require('express');
const { getDb, queryAll, queryOne, saveDb } = require('../db/init');

const router = Router();

/**
 * GET /api/cart?user_id=1
 */
router.get('/', (req, res) => {
  try {
    const userId = req.query.user_id;
    if (!userId) return res.status(400).json({ code: 400, message: '缺少 user_id' });

    const db = getDb();
    const items = queryAll(db, `
      SELECT ci.id, ci.quantity,
             p.id as product_id, p.name, p.price, p.image, p.stock
      FROM cart_items ci JOIN products p ON ci.product_id = p.id
      WHERE ci.user_id = ? ORDER BY ci.created_at DESC
    `, [Number(userId)]);

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    res.json({ code: 200, data: { items, total: Math.round(total * 100) / 100, count: items.length } });
  } catch (err) {
    res.status(500).json({ code: 500, message: err.message });
  }
});

/**
 * POST /api/cart
 */
router.post('/', (req, res) => {
  try {
    const { user_id, product_id, quantity = 1 } = req.body;
    if (!user_id || !product_id) return res.status(400).json({ code: 400, message: '缺少 user_id 或 product_id' });

    const db = getDb();
    const product = queryOne(db, 'SELECT id, stock, name FROM products WHERE id = ?', [product_id]);
    if (!product) return res.status(404).json({ code: 404, message: '商品不存在' });

    const existing = queryOne(db, 'SELECT id, quantity FROM cart_items WHERE user_id = ? AND product_id = ?', [user_id, product_id]);

    if (existing) {
      const newQty = existing.quantity + quantity;
      if (newQty > product.stock) return res.status(400).json({ code: 400, message: '超出库存' });
      db.run('UPDATE cart_items SET quantity = ? WHERE id = ?', [newQty, existing.id]);
      saveDb();
      res.json({ code: 200, message: '数量已更新', data: { id: existing.id, quantity: newQty } });
    } else {
      if (quantity > product.stock) return res.status(400).json({ code: 400, message: '超出库存' });
      db.run('INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)', [user_id, product_id, quantity]);
      saveDb();
      const id = db.exec('SELECT last_insert_rowid() as id')[0].values[0][0];
      res.json({ code: 200, message: '已加入购物车', data: { id, quantity } });
    }
  } catch (err) {
    res.status(500).json({ code: 500, message: err.message });
  }
});

/**
 * PUT /api/cart/:id
 */
router.put('/:id', (req, res) => {
  try {
    const { quantity } = req.body;
    if (!quantity || quantity < 1) return res.status(400).json({ code: 400, message: '数量必须大于 0' });

    const db = getDb();
    const item = queryOne(db, 'SELECT * FROM cart_items WHERE id = ?', [Number(req.params.id)]);
    if (!item) return res.status(404).json({ code: 404, message: '购物车项不存在' });

    const product = queryOne(db, 'SELECT stock FROM products WHERE id = ?', [item.product_id]);
    if (quantity > product.stock) return res.status(400).json({ code: 400, message: '超出库存' });

    db.run('UPDATE cart_items SET quantity = ? WHERE id = ?', [quantity, Number(req.params.id)]);
    saveDb();
    res.json({ code: 200, message: '更新成功' });
  } catch (err) {
    res.status(500).json({ code: 500, message: err.message });
  }
});

/**
 * DELETE /api/cart/:id
 */
router.delete('/:id', (req, res) => {
  try {
    const db = getDb();
    db.run('DELETE FROM cart_items WHERE id = ?', [Number(req.params.id)]);
    saveDb();
    res.json({ code: 200, message: '已移除' });
  } catch (err) {
    res.status(500).json({ code: 500, message: err.message });
  }
});

module.exports = router;
