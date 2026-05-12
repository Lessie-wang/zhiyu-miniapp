Page({
  data: {
    fromOnboarding: false
  },

  onLoad: function(options) {
    // 检查是否从onboarding流程进入
    if (options.from === 'onboarding') {
      this.setData({
        fromOnboarding: true
      });
    }
  },

  // 返回
  goBack: function() {
    wx.navigateBack();
  },

  // 同意并继续
  agreeAndContinue: function() {
    // 标记用户已同意隐私政策
    wx.setStorageSync('privacyPolicyAgreed', true);
    wx.setStorageSync('privacyPolicyAgreedTime', new Date().toISOString());

    wx.vibrateShort({ type: 'light' });

    // 返回onboarding流程
    wx.navigateBack();
  },

  onShareAppMessage: function() {
    return {
      title: '知愈隐私政策',
      path: '/pages/privacy-policy/privacy-policy'
    };
  }
});
