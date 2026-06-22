/**
 * ROSIÈRE 鲜花商城 — 前端 API 交互模块
 * 负责：用户登录注册、购物车、评价等 AJAX 调用与 UI 更新
 */
(function () {
  'use strict';

  const API = '/api';

  // ── 工具函数 ──
  function $(sel) { return document.querySelector(sel); }
  function $$(sel) { return document.querySelectorAll(sel); }

  function showToast(msg, type) {
    const toast = $('#appToast');
    const body = $('#toastBody');
    body.textContent = msg;
    toast.className = 'toast align-items-center border-0 text-bg-' + (type || 'success');
    new bootstrap.Toast(toast, { delay: 3000 }).show();
  }

  async function api(path, options) {
    const res = await fetch(API + path, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
      body: options?.body ? JSON.stringify(options.body) : undefined,
    });
    return res.json();
  }

  // ── 用户状态管理 ──
  const User = {
    KEY: 'rosiere_user',

    get() {
      try { return JSON.parse(localStorage.getItem(this.KEY)); } catch { return null; }
    },

    save(user) {
      localStorage.setItem(this.KEY, JSON.stringify(user));
      this.renderNav();
    },

    logout() {
      localStorage.removeItem(this.KEY);
      this.renderNav();
      showToast('已退出登录', 'secondary');
    },

    renderNav() {
      const user = this.get();
      const guest = $('#navGuest');
      const navUser = $('#navUser');
      if (!guest || !navUser) return;

      if (user) {
        guest.style.display = 'none';
        navUser.style.display = '';
        $('#navNickname span').textContent = user.nickname || user.username;
        $('#navPoints span').textContent = user.points || 0;
      } else {
        guest.style.display = '';
        navUser.style.display = 'none';
      }
    }
  };

  // ── 登录 ──
  const loginForm = $('#loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const errEl = $('#loginError');
      errEl.style.display = 'none';

      const username = $('#loginUsername').value.trim();
      const password = $('#loginPassword').value;

      try {
        const res = await api('/users/login', {
          method: 'POST',
          body: { username, password }
        });

        if (res.code === 200) {
          User.save(res.data);
          bootstrap.Modal.getInstance($('#loginModal')).hide();
          showToast(`欢迎回来，${res.data.nickname}！`);
          loginForm.reset();
          Cart.load();
        } else {
          errEl.textContent = res.message;
          errEl.style.display = 'block';
        }
      } catch {
        errEl.textContent = '网络错误，请重试';
        errEl.style.display = 'block';
      }
    });
  }

  // ── 注册 ──
  const regForm = $('#registerForm');
  if (regForm) {
    regForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const errEl = $('#registerError');
      errEl.style.display = 'none';

      const body = {
        username: $('#regUsername').value.trim(),
        nickname: $('#regNickname').value.trim(),
        password: $('#regPassword').value,
        phone: $('#regPhone').value.trim(),
      };

      try {
        const res = await api('/users/register', { method: 'POST', body });

        if (res.code === 200) {
          // 注册成功后自动登录
          const loginRes = await api('/users/login', {
            method: 'POST',
            body: { username: body.username, password: body.password }
          });
          if (loginRes.code === 200) {
            User.save(loginRes.data);
          }
          bootstrap.Modal.getInstance($('#registerModal')).hide();
          showToast(res.message);
          regForm.reset();
        } else {
          errEl.textContent = res.message;
          errEl.style.display = 'block';
        }
      } catch {
        errEl.textContent = '网络错误，请重试';
        errEl.style.display = 'block';
      }
    });
  }

  // ── 退出 ──
  const logoutBtn = $('#navLogout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      User.logout();
      Cart.clear();
    });
  }

  // ── 购物车 ──
  const Cart = {
    async load() {
      const user = User.get();
      if (!user) return;

      try {
        const res = await api(`/cart?user_id=${user.id}`);
        if (res.code === 200) {
          this.render(res.data);
        }
      } catch { /* 静默失败 */ }
    },

    async add(productId) {
      const user = User.get();
      if (!user) {
        showToast('请先登录', 'warning');
        new bootstrap.Modal($('#loginModal')).show();
        return;
      }

      try {
        const res = await api('/cart', {
          method: 'POST',
          body: { user_id: user.id, product_id: productId, quantity: 1 }
        });

        if (res.code === 200) {
          showToast(res.message);
          this.load();
        } else {
          showToast(res.message, 'danger');
        }
      } catch {
        showToast('操作失败', 'danger');
      }
    },

    async remove(cartItemId) {
      try {
        await api(`/cart/${cartItemId}`, { method: 'DELETE' });
        this.load();
      } catch { /* 静默失败 */ }
    },

    render(data) {
      const countEl = $('#cartCount');
      const emptyEl = $('#cartEmpty');
      const listEl = $('#cartList');
      const footerEl = $('#cartFooter');
      const totalEl = $('#cartTotal');

      if (!countEl) return;

      countEl.textContent = data.count || 0;

      if (data.count === 0) {
        emptyEl.style.display = '';
        listEl.style.display = 'none';
        footerEl.style.display = 'none';
        return;
      }

      emptyEl.style.display = 'none';
      listEl.style.display = '';
      footerEl.style.display = '';
      totalEl.textContent = data.total;

      listEl.innerHTML = data.items.map(item => `
        <div class="d-flex align-items-center py-2 border-bottom">
          <img src="${item.image}" alt="${item.name}" style="width:56px;height:56px;object-fit:cover;border-radius:8px;">
          <div class="ms-3 flex-grow-1">
            <div class="fw-semibold">${item.name}</div>
            <div class="small text-muted">¥ ${item.price} × ${item.quantity}</div>
          </div>
          <div class="fw-bold me-3" style="color:#8B1E2F;">¥ ${(item.price * item.quantity).toFixed(0)}</div>
          <button class="btn btn-sm btn-outline-danger" onclick="window.__cartRemove(${item.id})">
            <i class="bi bi-trash"></i>
          </button>
        </div>
      `).join('');
    },

    clear() {
      const countEl = $('#cartCount');
      if (countEl) countEl.textContent = '0';
      const emptyEl = $('#cartEmpty');
      const listEl = $('#cartList');
      const footerEl = $('#cartFooter');
      if (emptyEl) emptyEl.style.display = '';
      if (listEl) listEl.style.display = 'none';
      if (footerEl) footerEl.style.display = 'none';
    }
  };

  // 暴露给 onclick
  window.__cartRemove = (id) => Cart.remove(id);

  // ── 为商品卡片绑定"加入购物车"按钮 ──
  function bindCartButtons() {
    // 为推荐卡片添加购物车按钮
    $$('.recommend-card').forEach((card, i) => {
      if (card.querySelector('.recommend-card__cart-btn')) return;
      const btn = document.createElement('button');
      btn.className = 'recommend-card__cart-btn';
      btn.innerHTML = '<i class="bi bi-cart-plus"></i>';
      btn.title = '加入购物车';
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        // 根据卡片索引映射商品 ID（推荐卡片前 4 个对应推荐商品）
        const ids = [11, 1, 13, 15, 5, 6, 7, 8];
        Cart.add(ids[i] || 1);
      });
      card.appendChild(btn);
    });

    // 为长辈商品卡片添加购物车按钮
    $$('.product-card').forEach((card, i) => {
      if (card.querySelector('.product-card__cart-btn')) return;
      const btn = document.createElement('button');
      btn.className = 'product-card__cart-btn';
      btn.innerHTML = '<i class="bi bi-cart-plus"></i>';
      btn.title = '加入购物车';
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        Cart.add(i + 1); // elder1-10 对应 product id 1-10
      });
      card.querySelector('.product-card__img-wrap').appendChild(btn);
    });
  }

  // ── 为商品卡片添加 hover 显示购买按钮的样式 ──
  function injectCartBtnStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .recommend-card__cart-btn,
      .product-card__cart-btn {
        position: absolute;
        bottom: 8px;
        right: 8px;
        z-index: 10;
        width: 36px;
        height: 36px;
        border: none;
        border-radius: 50%;
        background: rgba(139,30,47,0.85);
        color: #fff;
        font-size: 1rem;
        cursor: pointer;
        opacity: 0;
        transform: translateY(6px);
        transition: opacity 0.25s, transform 0.25s, background 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .recommend-card:hover .recommend-card__cart-btn,
      .product-card__img-wrap:hover .product-card__cart-btn {
        opacity: 1;
        transform: translateY(0);
      }
      .recommend-card__cart-btn:hover,
      .product-card__cart-btn:hover {
        background: #C5A46C;
        color: #2C2C2C;
      }
    `;
    document.head.appendChild(style);
  }

  // ── 服务条款页面内容 ──
  const PAGES = {
    'guide-flow': {
      title: '购物流程',
      html: `<h6>🛒 ROSIÈRE 购物流程</h6>
        <p><strong>第一步：浏览商品</strong><br>在首页浏览推荐鲜花，或通过导航栏进入各分类页面，挑选您心仪的花束。</p>
        <p><strong>第二步：加入购物车</strong><br>点击商品卡片上的购物车图标，将商品加入购物车。您可以继续选购或直接结算。</p>
        <p><strong>第三步：确认订单</strong><br>在购物车中确认商品、数量和收货信息，选择配送方式和配送时间。</p>
        <p><strong>第四步：支付</strong><br>支持微信支付、支付宝、银行卡等多种支付方式，支付成功后系统自动发送确认短信。</p>
        <p><strong>第五步：等待收花</strong><br>我们会在约定时间内新鲜包装、准时送达，您可随时在"我的订单"中查看配送状态。</p>`
    },
    'guide-member': {
      title: '会员介绍',
      html: `<h6>👑 会员等级体系</h6>
        <table class="table table-bordered table-sm mt-3">
          <thead class="table-light"><tr><th>等级</th><th>积分要求</th><th>专属权益</th></tr></thead>
          <tbody>
            <tr><td>🌸 花蕾会员</td><td>0 - 499</td><td>注册赠送 100 积分、生日专属折扣</td></tr>
            <tr><td>🌹 花语会员</td><td>500 - 1999</td><td>全场 95 折、每月 1 张满减券</td></tr>
            <tr><td>💎 花冠会员</td><td>2000+</td><td>全场 9 折、优先配送、专属客服</td></tr>
          </tbody>
        </table>
        <p class="small text-muted">* 每消费 1 元累积 1 积分，评价订单额外赠送 10 积分</p>`
    },
    'guide-faq': {
      title: '常见问题',
      html: `<h6>❓ 常见问题解答</h6>
        <p><strong>Q：花束能保存多久？</strong><br>A：我们的花束均使用新鲜花材，在适宜环境下可保存 5-7 天。随花附赠保鲜剂和养护指南。</p>
        <p><strong>Q：可以指定配送时间吗？</strong><br>A：可以。下单时可选择配送日期和时段（上午 9:00-12:00 / 下午 14:00-18:00）。</p>
        <p><strong>Q：收到的花不满意怎么办？</strong><br>A：我们承诺"不满意即退换"，收到花后 2 小时内拍照联系客服，即可免费补送或全额退款。</p>
        <p><strong>Q：可以开发票吗？</strong><br>A：可以。订单完成后在"我的订单"中申请电子发票，1-3 个工作日内发送至您的邮箱。</p>
        <p><strong>Q：积分怎么用？</strong><br>A：100 积分可抵扣 1 元，在结算页面勾选"使用积分"即可。</p>`
    },
    'guide-service': {
      title: '联系客服',
      html: `<h6>📞 联系我们</h6>
        <p><strong>客服热线：</strong>400-888-9999（工作日 9:00-21:00）</p>
        <p><strong>在线客服：</strong>点击页面右下角聊天图标，实时在线咨询</p>
        <p><strong>微信客服：</strong>搜索 <code>rosiere_service</code> 添加好友</p>
        <p><strong>邮箱：</strong>service@rosiere.com</p>
        <p><strong>投诉专线：</strong>400-888-0000（24 小时）</p>
        <hr>
        <p class="small text-muted">一般问题我们会在 30 分钟内回复，紧急订单问题优先处理。</p>`
    },
    'delivery-pickup': {
      title: '上门自提',
      html: `<h6>🏪 上门自提</h6>
        <p>我们在全国主要城市设有 <strong>50+</strong> 自提点，下单后 2 小时即可到店取花。</p>
        <p><strong>自提流程：</strong></p>
        <ol>
          <li>下单时选择"上门自提"，选择就近门店</li>
          <li>收到取货短信通知（含取货码）</li>
          <li>凭取货码到店取花，现场验花确认</li>
        </ol>
        <p><strong>自提优惠：</strong>自提订单额外赠送 50 积分</p>
        <p class="small text-muted">* 自提点营业时间：每日 9:00-20:00</p>`
    },
    'delivery-express': {
      title: '快递运输',
      html: `<h6>🚚 快递配送</h6>
        <p>与顺丰冷运、京东物流深度合作，全程冷链保鲜配送。</p>
        <p><strong>配送时效：</strong></p>
        <ul>
          <li>同城订单：下单后 <strong>4 小时</strong>内送达</li>
          <li>省内订单：次日达</li>
          <li>跨省订单：1-3 天送达</li>
        </ul>
        <p><strong>包装保障：</strong>专业花艺师手工包装，防震防压外箱，确保花束完美送达。</p>
        <p><strong>配送费用：</strong>满 199 免运费，未满收取 15 元运费。</p>`
    },
    'delivery-fast': {
      title: '特快专递',
      html: `<h6>⚡ 特快专递（2 小时达）</h6>
        <p>急用鲜花？选择"特快专递"，<strong>最快 2 小时</strong>送达！</p>
        <p><strong>服务范围：</strong>全国一二线城市主城区</p>
        <p><strong>加急费用：</strong>在基础运费上加收 20 元</p>
        <p><strong>下单截止：</strong>每日 18:00 前下单可当日送达</p>
        <hr>
        <p class="small text-muted">* 特快专递由专属骑手全程护送，实时追踪配送位置</p>`
    },
    'delivery-range': {
      title: '配送范围',
      html: `<h6>📍 配送范围说明</h6>
        <p><strong>全国覆盖：</strong>我们支持全国 <strong>31 个省市自治区</strong> 的鲜花配送。</p>
        <p><strong>配送能力：</strong></p>
        <ul>
          <li>🏙️ 一线城市（北上广深）：全区域覆盖，支持 4 小时达</li>
          <li>🌆 二线城市：主城区覆盖，支持次日达</li>
          <li>🏘️ 三四线城市：核心区域覆盖，1-3 天送达</li>
          <li>🌄 偏远地区：部分覆盖，3-5 天送达（建议提前下单）</li>
        </ul>
        <p>输入您的收货地址，系统会自动判断是否在配送范围内。</p>`
    },
    'after-return': {
      title: '退换货政策',
      html: `<h6>🔄 退换货政策</h6>
        <p>我们承诺<strong>"鲜花不满意，无条件退换"</strong>：</p>
        <ul>
          <li>✅ 收到花后 <strong>2 小时内</strong>发现质量问题，免费补送或全额退款</li>
          <li>✅ 花材与描述严重不符，免费重做并补偿 20 元优惠券</li>
          <li>✅ 配送超时超过 2 小时，订单享 8 折优惠</li>
        </ul>
        <p><strong>不支持退换的情况：</strong></p>
        <ul>
          <li>❌ 因个人原因（如收花人不在）导致的二次配送</li>
          <li>❌ 超过 24 小时后提出的退换请求</li>
          <li>❌ 花束已拆封且无质量问题</li>
        </ul>`
    },
    'after-process': {
      title: '退换货流程',
      html: `<h6>📋 退换货流程</h6>
        <p><strong>第一步：联系客服</strong><br>拨打 400-888-9999 或在线客服，说明退换原因并提供订单号。</p>
        <p><strong>第二步：提供凭证</strong><br>拍摄花束实物照片（含整体和细节），发送给客服核实。</p>
        <p><strong>第三步：确认方案</strong><br>客服确认后，与您协商处理方案（补送/退款/换花）。</p>
        <p><strong>第四步：完成处理</strong><br>补送：24 小时内重新配送；退款：1-3 个工作日内原路退回。</p>
        <hr>
        <p class="small text-muted">* 整个流程我们承诺 2 小时内给出处理方案，让您无后顾之忧。</p>`
    },
    'after-price': {
      title: '价格保护',
      html: `<h6>💰 价格保护政策</h6>
        <p>为了让您安心购物，我们提供 <strong>7 天价格保护</strong>服务：</p>
        <ul>
          <li>下单后 7 天内，如商品降价，差价自动退回您的账户余额</li>
          <li>大促期间（如情人节、母亲节）的价格保护期延长至 15 天</li>
          <li>会员等级折扣与平台优惠可叠加使用</li>
        </ul>
        <p><strong>温馨提示：</strong>价格保护不适用于限时秒杀和清仓特惠商品。</p>`
    },
    'after-complaint': {
      title: '投诉建议',
      html: `<h6>📢 投诉与建议</h6>
        <p>您的每一条反馈都是我们进步的动力！</p>
        <p><strong>投诉渠道：</strong></p>
        <ul>
          <li>📞 投诉专线：<strong>400-888-0000</strong>（24 小时）</li>
          <li>📧 邮箱：<strong>complaint@rosiere.com</strong></li>
          <li>💬 在线客服：页面右下角聊天窗口</li>
        </ul>
        <p><strong>处理承诺：</strong></p>
        <ul>
          <li>一般投诉：2 小时内响应，24 小时内解决</li>
          <li>重大投诉：1 小时内升级处理，48 小时内给出最终方案</li>
        </ul>
        <p>建议通道：<strong>suggest@rosiere.com</strong>，被采纳的建议将赠送 500 积分！</p>`
    },
    'social-wechat': {
      title: '官方微信',
      html: `<div class="text-center">
        <h6>📱 关注 ROSIÈRE 官方微信</h6>
        <p class="my-3">微信搜索 <strong>ROSIÈRE花店</strong> 或扫描下方二维码关注</p>
        <div style="width:180px;height:180px;margin:0 auto;background:#f5f5f5;border-radius:12px;display:flex;align-items:center;justify-content:center;border:2px dashed #C5A46C;">
          <i class="bi bi-qr-code" style="font-size:4rem;color:#C5A46C;"></i>
        </div>
        <p class="mt-3 small text-muted">关注后可领取新人 20 元优惠券</p>
      </div>`
    },
    'social-qq': {
      title: '官方QQ',
      html: `<div class="text-center">
        <h6>🐧 ROSIÈRE 官方 QQ 群</h6>
        <p class="my-3">加入粉丝群，获取最新优惠和花艺知识</p>
        <p><strong>粉丝福利群：</strong><code>123456789</code></p>
        <p><strong>花艺交流群：</strong><code>987654321</code></p>
        <p class="mt-3 small text-muted">入群备注"花店粉丝"，管理员审核通过即可</p>
      </div>`
    },
    'social-weibo': {
      title: '新浪微博',
      html: `<div class="text-center">
        <h6>🔴 关注 @ROSIÈRE花店</h6>
        <p class="my-3">微博搜索 <strong>@ROSIÈRE花店</strong> 关注我们</p>
        <p>每周抽奖送花束，节日限定款式首发预告</p>
        <p>参与 <strong>#ROSIÈRE花语#</strong> 话题互动，分享你的送花故事</p>
      </div>`
    },
    'social-xhs': {
      title: '小红书',
      html: `<div class="text-center">
        <h6>📷 小红书 @ROSIÈRE花店</h6>
        <p class="my-3">搜索 <strong>ROSIÈRE花店</strong> 关注我们的小红书账号</p>
        <p>每日更新花艺灵感、养护技巧、买家秀精选</p>
        <p>发布带 <strong>#ROSIÈRE买家秀#</strong> 标签的笔记，有机会获得免费花束！</p>
      </div>`
    },
  };

  // ── 页面内容弹窗逻辑 ──
  function initContentPages() {
    const modal = $('#contentModal');
    const titleEl = $('#contentModalTitle');
    const bodyEl = $('#contentModalBody');
    if (!modal) return;

    document.querySelectorAll('[data-page]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const key = link.dataset.page;
        const page = PAGES[key];
        if (!page) return;
        titleEl.textContent = page.title;
        bodyEl.innerHTML = page.html;
        new bootstrap.Modal(modal).show();
      });
    });
  }

  // ── 在线客服聊天窗口 ──
  function initChatWidget() {
    const toggle = $('#chatToggle');
    const window_ = $('#chatWindow');
    const closeBtn = $('#chatClose');
    const input = $('#chatInput');
    const sendBtn = $('#chatSend');
    const messages = $('#chatMessages');
    const badge = toggle?.querySelector('.chat-badge');

    if (!toggle || !window_) return;

    // 预设回复
    const REPLIES = [
      '您好，请问有什么可以帮到您的？🌸',
      '我们的花束都是当天新鲜采摘，品质有保障哦！',
      '配送时间可以自由选择，下单时备注即可 🚚',
      '目前母亲节特惠活动进行中，全场满 199 减 30！',
      '如果对花束不满意，2 小时内可以免费退换 ❤️',
      '建议您提前 1-2 天预订，节日期间订单较多哦~',
      '积分可以在下次购物时抵扣现金，100 积分 = 1 元',
      '感谢您的咨询，祝您生活愉快！🌻',
    ];

    function getReply() {
      return REPLIES[Math.floor(Math.random() * REPLIES.length)];
    }

    function addMsg(text, isUser) {
      const now = new Date();
      const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
      const div = document.createElement('div');
      div.className = `chat-msg ${isUser ? 'chat-msg--user' : 'chat-msg--bot'}`;
      div.innerHTML = `
        <div class="chat-msg__bubble">${text}</div>
        <span class="chat-msg__time">${time}</span>
      `;
      messages.appendChild(div);
      messages.scrollTop = messages.scrollHeight;
    }

    function send() {
      const text = input.value.trim();
      if (!text) return;
      addMsg(text, true);
      input.value = '';

      // 模拟客服回复（800ms 延迟）
      setTimeout(() => addMsg(getReply(), false), 800);
    }

    toggle.addEventListener('click', () => {
      const isOpen = window_.style.display !== 'none';
      window_.style.display = isOpen ? 'none' : 'flex';
      if (badge) badge.style.display = 'none';
      if (!isOpen) input.focus();
    });

    closeBtn?.addEventListener('click', () => window_.style.display = 'none');
    sendBtn?.addEventListener('click', send);
    input?.addEventListener('keydown', (e) => { if (e.key === 'Enter') send(); });
  }

  // ── 初始化 ──
  document.addEventListener('DOMContentLoaded', () => {
    User.renderNav();
    injectCartBtnStyles();
    bindCartButtons();
    initContentPages();
    initChatWidget();

    const user = User.get();
    if (user) Cart.load();
  });

})();
