/**
 * 用户相关路由
 */
const { Router } = require('express');
const bcrypt = require('bcryptjs');
const { getDb, queryOne, saveDb } = require('../db/init');

const router = Router();

/**
 * POST /api/users/register
 */
router.post('/register', (req, res) => {
  try {
    const { username, password, nickname, phone } = req.body;
    if (!username || !password) return res.status(400).json({ code: 400, message: '用户名和密码不能为空' });
    if (username.length < 3 || username.length > 20) return res.status(400).json({ code: 400, message: '用户名长度 3-20 字符' });
    if (password.length < 6) return res.status(400).json({ code: 400, message: '密码不少于 6 位' });

    const db = getDb();
    const exists = queryOne(db, 'SELECT id FROM users WHERE username = ?', [username]);
    if (exists) return res.status(409).json({ code: 409, message: '用户名已存在' });

    const hash = bcrypt.hashSync(password, 10);
    db.run('INSERT INTO users (username, password, nickname, phone, points) VALUES (?, ?, ?, ?, 100)',
      [username, hash, nickname || username, phone || '']);
    saveDb();

    const id = db.exec('SELECT last_insert_rowid() as id')[0].values[0][0];
    res.json({ code: 200, message: '注册成功，赠送 100 积分', data: { id, username, nickname: nickname || username } });
  } catch (err) {
    res.status(500).json({ code: 500, message: err.message });
  }
});

/**
 * POST /api/users/login
 */
router.post('/login', (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ code: 400, message: '用户名和密码不能为空' });

    const db = getDb();
    const user = queryOne(db, 'SELECT * FROM users WHERE username = ?', [username]);
    if (!user) return res.status(401).json({ code: 401, message: '用户名不存在' });
    if (!bcrypt.compareSync(password, user.password)) return res.status(401).json({ code: 401, message: '密码错误' });

    const { password: _, ...safeUser } = user;
    res.json({ code: 200, message: '登录成功', data: safeUser });
  } catch (err) {
    res.status(500).json({ code: 500, message: err.message });
  }
});

/**
 * GET /api/users/:id
 */
router.get('/:id', (req, res) => {
  try {
    const db = getDb();
    const user = queryOne(db, 'SELECT id, username, nickname, avatar, phone, points, created_at FROM users WHERE id = ?', [Number(req.params.id)]);
    if (!user) return res.status(404).json({ code: 404, message: '用户不存在' });
    res.json({ code: 200, data: user });
  } catch (err) {
    res.status(500).json({ code: 500, message: err.message });
  }
});

module.exports = router;
