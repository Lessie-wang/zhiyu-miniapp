Page({
  data: {
    userInfo: {},
    showWomenModule: true
  },

  onLoad: function () {
    // 移除粒子系统初始化
  },

  onReady: function () {
    // 移除粒子系统启动
  },

  onShow: function () {
    var userInfo = wx.getStorageSync('userInfo') || {};
    var showWomenModule = wx.getStorageSync('showWomenModule');
    this.setData({
      userInfo: userInfo,
      showWomenModule: showWomenModule !== false
    });
  },

  onHide: function () {
    // 移除粒子系统停止
  },

  onUnload: function () {
    // 移除粒子系统停止
  },

  // ========== 导航 ==========

  editProfile: function () {
    wx.navigateTo({ url: '/pages/onboarding/onboarding?step=2' });
  },

  goToEmotionLibrary: function () {
    wx.navigateTo({ url: '/subpages/emotion/emotion-library/emotion-library' });
  },

  goToSettings: function () {
    wx.navigateTo({ url: '/subpages/profile/settings/settings' });
  },

  goToAbout: function () {
    wx.navigateTo({ url: '/subpages/profile/about/about' });
  },

  goToContact: function () {
    wx.navigateTo({ url: '/subpages/social/contact/contact' });
  }
});
