/**
 * 数据库初始化模块 (sql.js — 纯 JS SQLite)
 */
const path = require('path');
const fs = require('fs');
const initSqlJs = require('sql.js');

const DB_PATH = path.join(__dirname, 'flower_shop.db');

let _db = null;
let _ready = null;

/**
 * 初始化数据库（异步，仅首次调用执行）
 * @returns {Promise<Database>}
 */
function initDb() {
  if (_ready) return _ready;

  _ready = (async () => {
    const SQL = await initSqlJs();

    // 如果数据库文件已存在，读取它；否则新建
    if (fs.existsSync(DB_PATH)) {
      const buffer = fs.readFileSync(DB_PATH);
      _db = new SQL.Database(buffer);
    } else {
      _db = new SQL.Database();
    }

    // 启用外键约束
    _db.run('PRAGMA foreign_keys = ON;');

    // 建表
    initSchema(_db);

    // 持久化
    saveDb();

    return _db;
  })();

  return _ready;
}

/**
 * 获取已初始化的数据库实例
 */
function getDb() {
  if (!_db) throw new Error('数据库未初始化，请先调用 initDb()');
  return _db;
}

/**
 * 持久化到文件
 */
function saveDb() {
  if (!_db) return;
  const data = _db.export();
  fs.writeFileSync(DB_PATH, Buffer.from(data));
}

/**
 * 建表
 */
function initSchema(db) {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      username    TEXT    NOT NULL UNIQUE,
      password    TEXT    NOT NULL,
      nickname    TEXT    NOT NULL DEFAULT '',
      avatar      TEXT    NOT NULL DEFAULT 'images/avatar.jpg',
      phone       TEXT    NOT NULL DEFAULT '',
      points      INTEGER NOT NULL DEFAULT 0,
      created_at  TEXT    NOT NULL DEFAULT (datetime('now','localtime'))
    );
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS categories (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      name        TEXT    NOT NULL UNIQUE,
      slug        TEXT    NOT NULL UNIQUE,
      sort_order  INTEGER NOT NULL DEFAULT 0
    );
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      name        TEXT    NOT NULL,
      category_id INTEGER NOT NULL,
      price       REAL    NOT NULL,
      original_price REAL,
      image       TEXT    NOT NULL,
      tag         TEXT    NOT NULL DEFAULT '',
      description TEXT    NOT NULL DEFAULT '',
      stock       INTEGER NOT NULL DEFAULT 100,
      sold        INTEGER NOT NULL DEFAULT 0,
      is_active   INTEGER NOT NULL DEFAULT 1,
      created_at  TEXT    NOT NULL DEFAULT (datetime('now','localtime')),
      FOREIGN KEY (category_id) REFERENCES categories(id)
    );
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS cart_items (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id     INTEGER NOT NULL,
      product_id  INTEGER NOT NULL,
      quantity    INTEGER NOT NULL DEFAULT 1,
      created_at  TEXT    NOT NULL DEFAULT (datetime('now','localtime')),
      FOREIGN KEY (user_id)    REFERENCES users(id)    ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
      UNIQUE(user_id, product_id)
    );
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS orders (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      order_no    TEXT    NOT NULL UNIQUE,
      user_id     INTEGER NOT NULL,
      total       REAL    NOT NULL,
      status      TEXT    NOT NULL DEFAULT 'pending',
      address     TEXT    NOT NULL DEFAULT '',
      remark      TEXT    NOT NULL DEFAULT '',
      created_at  TEXT    NOT NULL DEFAULT (datetime('now','localtime')),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS order_items (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id    INTEGER NOT NULL,
      product_id  INTEGER NOT NULL,
      product_name TEXT   NOT NULL,
      price       REAL    NOT NULL,
      quantity    INTEGER NOT NULL DEFAULT 1,
      FOREIGN KEY (order_id)   REFERENCES orders(id)   ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id)
    );
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS reviews (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id     INTEGER NOT NULL,
      product_id  INTEGER NOT NULL,
      content     TEXT    NOT NULL,
      rating      INTEGER NOT NULL DEFAULT 5,
      region      TEXT    NOT NULL DEFAULT '',
      created_at  TEXT    NOT NULL DEFAULT (datetime('now','localtime')),
      FOREIGN KEY (user_id)    REFERENCES users(id),
      FOREIGN KEY (product_id) REFERENCES products(id)
    );
  `);

  // 索引
  db.run('CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);');
  db.run('CREATE INDEX IF NOT EXISTS idx_cart_user         ON cart_items(user_id);');
  db.run('CREATE INDEX IF NOT EXISTS idx_orders_user       ON orders(user_id);');
  db.run('CREATE INDEX IF NOT EXISTS idx_reviews_product   ON reviews(product_id);');
}

/**
 * 查询辅助：将 sql.js 的 exec 结果转为对象数组
 */
function queryAll(db, sql, params = []) {
  const stmt = db.prepare(sql);
  if (params.length) stmt.bind(params);
  const rows = [];
  while (stmt.step()) {
    rows.push(stmt.getAsObject());
  }
  stmt.free();
  return rows;
}

/**
 * 查询辅助：返回单行
 */
function queryOne(db, sql, params = []) {
  const rows = queryAll(db, sql, params);
  return rows.length > 0 ? rows[0] : null;
}

module.exports = { initDb, getDb, saveDb, initSchema, queryAll, queryOne, DB_PATH };
