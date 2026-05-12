Page({
  data: {
    hasNewUpdate: true,
    showLetter: false,
    letterOpened: false,
    showInfoModal: false,
    infoTitle: '',
    infoItems: [],
    infoBtnText: '知道了'
  },

  // 打开信封弹窗
  openLetter: function() {
    this.setData({
      showLetter: true,
      letterOpened: false
    });
    wx.vibrateShort({ type: 'light' });
  },

  // 打开信封
  openEnvelope: function() {
    if (!this.data.letterOpened) {
      this.setData({
        letterOpened: true
      });
      wx.vibrateShort({ type: 'medium' });
    }
  },

  // 关闭信封弹窗
  closeLetter: function() {
    this.setData({
      showLetter: false,
      letterOpened: false
    });
    wx.vibrateShort({ type: 'light' });
  },

  // 复制邮箱
  copyEmail: function() {
    wx.setClipboardData({
      data: 'yinji_aito@yeah.net',
      success: function() {
        wx.showToast({
          title: '邮箱已复制',
          icon: 'success',
          duration: 2000
        });
        wx.vibrateShort({ type: 'light' });
      }
    });
  },

  // 关闭信息弹窗
  closeInfoModal: function() {
    this.setData({ showInfoModal: false });
  },

  // 更新日志
  goToChangelog: function() {
    this.setData({
      showInfoModal: true,
      infoTitle: '更新日志 v1.2.0',
      infoBtnText: '知道了',
      infoItems: [
        { text: '🎨 视觉全面升级！', type: 'highlight' },
        { text: '· 全新水彩手绘风格图标' },
        { text: '· 玻璃拟态卡片设计' },
        { text: '· 彩色玻璃教堂光影效果' },
        { text: '· 动态背景与飘落花瓣' },
        { text: '· 页面精简优化' },
        { text: '· 对话训练关卡修复' },
        { text: '· 整体性能提升' }
      ]
    });
  },

  // 重要提醒
  goToNotices: function() {
    this.setData({
      showInfoModal: true,
      infoTitle: '重要提醒',
      infoBtnText: '我知道了',
      infoItems: [
        { text: '知愈不是心理咨询平台，如遇紧急心理危机，请拨打 24 小时心理援助热线：', type: 'warn' },
        { text: '400-161-9995', type: 'highlight' },
        { text: 'AI 对话内容仅供参考，不构成专业心理建议。' },
        { text: '请定期保存你的情绪记录。' }
      ]
    });
  },

  // 数据隐私
  goToPrivacy: function() {
    wx.navigateTo({
      url: '/pages/privacy-policy/privacy-policy'
    });
  },

  onShareAppMessage: function() {
    return {
      title: '知愈 - 养育你的情绪',
      path: '/pages/about/about'
    };
  }
});
