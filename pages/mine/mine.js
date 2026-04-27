Page({
  data: {
    userInfo: {},
    showWomenModule: true
  },

  _particleTimer: null,
  _particles: [],
  _canvasWidth: 375,
  _canvasHeight: 667,
  _canvasReady: false,

  onLoad: function () {
    this.initParticles();
  },

  onReady: function () {
    this._canvasReady = true;
    this.startParticleAnimation();
  },

  onShow: function () {
    var userInfo = wx.getStorageSync('userInfo') || {};
    var showWomenModule = wx.getStorageSync('showWomenModule');
    this.setData({
      userInfo: userInfo,
      showWomenModule: showWomenModule !== false
    });
    if (this._canvasReady) {
      this.startParticleAnimation();
    }
  },

  onHide: function () {
    this.stopParticleAnimation();
  },

  onUnload: function () {
    this.stopParticleAnimation();
  },

  // ========== 粒子系统 ==========

  initParticles: function () {
    var info = wx.getSystemInfoSync();
    this._canvasWidth = info.windowWidth;
    this._canvasHeight = info.windowHeight;
    this._particles = [];

    var colors = [
      { r: 212, g: 184, b: 165 },  // 知愈棕
      { r: 232, g: 196, b: 216 },  // 柔粉
      { r: 242, g: 230, b: 223 },  // 暖米
      { r: 196, g: 168, b: 147 },  // 深棕
      { r: 232, g: 212, b: 196 }   // 淡棕
    ];

    for (var i = 0; i < 30; i++) {
      this._particles.push(
        this._createParticle(this._canvasWidth, this._canvasHeight, colors, true)
      );
    }
  },

  _createParticle: function (w, h, colors, randomPhase) {
    var color = colors[Math.floor(Math.random() * colors.length)];
    var maxLife = 200 + Math.random() * 300;
    return {
      x: Math.random() * w,
      y: Math.random() * h,
      size: 1.5 + Math.random() * 3.5,
      color: color,
      opacity: 0,
      maxOpacity: 0.12 + Math.random() * 0.22,
      vx: (Math.random() - 0.5) * 0.25,
      vy: -(0.08 + Math.random() * 0.25),
      life: randomPhase ? Math.random() * maxLife : 0,
      maxLife: maxLife,
      drift: Math.random() * Math.PI * 2,
      driftSpeed: 0.004 + Math.random() * 0.012
    };
  },

  startParticleAnimation: function () {
    if (this._particleTimer) return;

    var self = this;
    var ctx = wx.createCanvasContext('particleCanvas');
    var w = this._canvasWidth;
    var h = this._canvasHeight;
    var colors = [
      { r: 212, g: 184, b: 165 },
      { r: 232, g: 196, b: 216 },
      { r: 242, g: 230, b: 223 },
      { r: 196, g: 168, b: 147 },
      { r: 232, g: 212, b: 196 }
    ];

    var animate = function () {
      ctx.clearRect(0, 0, w, h);

      for (var i = 0; i < self._particles.length; i++) {
        var p = self._particles[i];
        p.life++;

        // 生命周期淡入淡出
        var ratio = p.life / p.maxLife;
        if (ratio < 0.15) {
          p.opacity = (ratio / 0.15) * p.maxOpacity;
        } else if (ratio > 0.8) {
          p.opacity = ((1 - ratio) / 0.2) * p.maxOpacity;
        } else {
          p.opacity = p.maxOpacity;
        }

        // 缓慢飘动
        p.drift += p.driftSpeed;
        p.x += p.vx + Math.sin(p.drift) * 0.15;
        p.y += p.vy;

        // 绘制粒子
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.setFillStyle(
          'rgba(' + p.color.r + ',' + p.color.g + ',' + p.color.b + ',' + p.opacity + ')'
        );
        ctx.fill();

        // 大粒子加光晕（柔焦效果）
        if (p.size > 3) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2);
          ctx.setFillStyle(
            'rgba(' + p.color.r + ',' + p.color.g + ',' + p.color.b + ',' + (p.opacity * 0.12) + ')'
          );
          ctx.fill();
        }

        // 粒子重生
        if (p.life >= p.maxLife) {
          self._particles[i] = self._createParticle(w, h, colors, false);
          self._particles[i].y = h + 10;
        }
      }

      ctx.draw();
      self._particleTimer = setTimeout(animate, 50);
    };

    animate();
  },

  stopParticleAnimation: function () {
    if (this._particleTimer) {
      clearTimeout(this._particleTimer);
      this._particleTimer = null;
    }
  },

  // ========== 导航 ==========

  editProfile: function () {
    wx.navigateTo({ url: '/pages/onboarding/onboarding?step=2' });
  },

  goToWomen: function () {
    wx.navigateTo({ url: '/pages/women/women' });
  },

  goToShop: function () {
    wx.navigateTo({ url: '/pages/shop/shop' });
  },

  goToEmotionLibrary: function () {
    wx.navigateTo({ url: '/pages/emotion-library/emotion-library' });
  },

  goToSettings: function () {
    wx.navigateTo({ url: '/pages/settings/settings' });
  },

  goToAbout: function () {
    wx.navigateTo({ url: '/pages/about/about' });
  },

  goToContact: function () {
    wx.navigateTo({ url: '/pages/contact/contact' });
  }
});
