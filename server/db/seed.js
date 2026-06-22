/**
 * 数据库种子脚本
 * 建表 + 填充商品、用户、评价等初始数据
 */
const bcrypt = require('bcryptjs');
const { initDb, saveDb } = require('./init');

async function seed() {
  const db = await initDb();

  // ── 清空旧数据 ──
  db.run('DELETE FROM order_items;');
  db.run('DELETE FROM orders;');
  db.run('DELETE FROM cart_items;');
  db.run('DELETE FROM reviews;');
  db.run('DELETE FROM products;');
  db.run('DELETE FROM categories;');
  db.run('DELETE FROM users;');

  // ── 分类 ──
  const categories = [
    ['恋人鲜花', 'lover', 1],
    ['长辈鲜花', 'elder', 2],
    ['朋友鲜花', 'friend', 3],
    ['生日鲜花', 'birthday', 4],
    ['热销鲜花', 'hot', 5],
    ['特惠鲜花', 'sale', 6],
    ['新品鲜花', 'new', 7],
    ['精致花篮', 'basket', 8],
  ];
  const catIds = {};
  for (const [name, slug, order] of categories) {
    db.run('INSERT INTO categories (name, slug, sort_order) VALUES (?, ?, ?)', [name, slug, order]);
    const row = db.exec('SELECT last_insert_rowid() as id');
    catIds[slug] = row[0].values[0][0];
  }

  // ── 商品 ──
  const products = [
    ['馨情永恒',   catIds.elder, 268, 328, 'images/elder1.jpg',  '畅销款特惠', '精选粉色康乃馨搭配白色百合，温馨典雅。', 200, 1283],
    ['感恩之心',   catIds.elder, 328, 398, 'images/elder2.jpg',  '温情推荐',   '红色康乃馨与粉色玫瑰的完美搭配。',       150, 967],
    ['岁月静好',   catIds.elder, 358, 428, 'images/elder3.jpg',  '新品上市',   '淡紫色绣球花搭配白色桔梗，宁静优雅。',   120, 756],
    ['福寿康宁',   catIds.elder, 298, 358, 'images/elder4.jpg',  '长辈挚爱',   '金色向日葵搭配橙色玫瑰，阳光温暖。',     180, 1045],
    ['金色年华',   catIds.elder, 388, 468, 'images/elder5.jpg',  '限量珍品',   '香槟色玫瑰与金色满天星的奢华组合。',     80,  534],
    ['温情相伴',   catIds.elder, 258, 308, 'images/elder6.jpg',  '畅销款特惠', '粉色百合搭配浅紫勿忘我，温柔陪伴。',     250, 1421],
    ['花开富贵',   catIds.elder, 318, 388, 'images/elder7.jpg',  '人气爆款',   '红色牡丹菊搭配金色百合，雍容华贵。',     160, 889],
    ['春晖永驻',   catIds.elder, 348, 418, 'images/elder8.jpg',  '温情推荐',   '粉色芍药搭配白色洋桔梗，温柔不散。',     130, 672],
    ['康乃馨颂',   catIds.elder, 238, 288, 'images/elder9.jpg',  '经典之选',   '纯色康乃馨花束，经典永不过时。',         300, 1567],
    ['如意吉祥',   catIds.elder, 398, 488, 'images/elder10.jpg', '节日特供',   '红色玫瑰与金色蕙兰的节庆组合。',         100, 423],
    ['倾城之恋',   catIds.lover, 368, 438, 'images/lover.jpg',   '浪漫首选',   '99朵红玫瑰花束，热烈而深沉的爱情宣言。', 90,  2156],
    ['甜蜜告白',   catIds.lover, 268, 328, 'images/flower05.jpg','人气爆款',   '粉色玫瑰搭配白色满天星，甜蜜浪漫。',     200, 1893],
    ['友谊长存',   catIds.friend, 198, 248, 'images/friend.jpg',  '清新之选',   '向日葵搭配绿色雏菊，阳光活力。',         220, 1034],
    ['繁花似锦',   catIds.friend, 228, 278, 'images/flower06.jpg','新品上市',   '混色郁金香花束，色彩缤纷。',             160, 789],
    ['生日快乐',   catIds.birthday, 258, 318, 'images/birthday.jpg','生日专属', '彩虹玫瑰花束，每一片花瓣都是祝福。',     180, 1567],
    ['星语心愿',   catIds.birthday, 288, 348, 'images/flower07.jpg','限量发售', '蓝色妖姬搭配银色满天星。',               100, 845],
    ['法式花篮',   catIds.basket, 458, 558, 'images/express.jpg',  '高端定制', '进口厄瓜多尔玫瑰搭配荷兰郁金香。',       60,  312],
    ['田园花篮',   catIds.basket, 328, 398, 'images/shangye.jpg',  '自然风格', '混搭野花与绿植，质朴自然。',             90,  456],
  ];

  const insertProd = db.prepare(
    'INSERT INTO products (name, category_id, price, original_price, image, tag, description, stock, sold) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
  );
  for (const p of products) {
    insertProd.run(p);
  }
  insertProd.free();

  // ── 用户 ──
  const hash = bcrypt.hashSync('123456', 10);
  const insertUser = db.prepare(
    'INSERT INTO users (username, password, nickname, phone, points) VALUES (?, ?, ?, ?, ?)'
  );
  insertUser.run(['test',  hash, '花间漫步',   '13800001111', 1280]);
  insertUser.run(['demo',  hash, '浪漫主义者', '13800002222', 560]);
  insertUser.run(['admin', hash, '系统管理员', '13800000000', 9999]);
  insertUser.free();

  // ── 评价 ──
  const reviews = [
    [1, 1,  '送给妈妈的生日花束，包装精美，花材新鲜，妈妈收到后特别开心！', 5, '北京', '2026-05-18 14:23:00'],
    [2, 2,  '花束比图片还要好看，配送很准时，强烈推荐这家店！',             5, '上海', '2026-05-15 09:45:00'],
    [1, 3,  '连续三年母亲节都在这里订花，品质一如既往地好。',               5, '广州', '2026-05-12 16:30:00'],
    [2, 4,  '朋友生日送的花篮，设计感很强，完全不像流水线作品。',           5, '深圳', '2026-05-10 11:20:00'],
    [1, 5,  '第一次在网上买花，收到后惊艳到了！花瓣饱满，颜色鲜艳。',       4, '成都', '2026-05-08 20:15:00'],
    [2, 6,  '给爸爸的退休纪念花束，寓意好，花材高级。',                     5, '杭州', '2026-05-05 13:50:00'],
    [1, 7,  '结婚纪念日订的玫瑰，开得正好，颜色正，香味浓郁。',             5, '武汉', '2026-05-02 18:40:00'],
    [2, 8,  '花束层次丰富，配色高级，送长辈特别有面子。',                   5, '南京', '2026-04-28 10:05:00'],
  ];

  const insertReview = db.prepare(
    'INSERT INTO reviews (user_id, product_id, content, rating, region, created_at) VALUES (?, ?, ?, ?, ?, ?)'
  );
  for (const r of reviews) {
    insertReview.run(r);
  }
  insertReview.free();

  // 持久化
  saveDb();

  console.log('✅ 数据库初始化完成！');
  console.log(`   📂 路径: ${require('path').resolve(__dirname, 'flower_shop.db')}`);
  console.log(`   📦 商品: ${products.length} 条`);
  console.log(`   👤 用户: 3 条 (测试账号: test / 123456)`);
  console.log(`   💬 评价: ${reviews.length} 条`);
  console.log(`   📂 分类: ${categories.length} 条`);
}

seed().catch(err => {
  console.error('❌ 种子脚本执行失败:', err);
  process.exit(1);
});
