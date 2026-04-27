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
      infoTitle: '更新日志 v1.1.0',
      infoBtnText: '知道了',
      infoItems: [
        { text: '🎉 迭代版本正式上线！', type: 'highlight' },
        { text: '· 小知人格完善' },
        { text: '· AI对话与情绪记录大升级' },
        { text: '· 自定义五感写作训练' },
        { text: '· 日历情绪颜色展示' },
        { text: '· UI全面优化' },
        { text: '· 她的时间可隐藏' },
        { text: '· 各种bug修复' }
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
    this.setData({
      showInfoModal: true,
      infoTitle: '数据隐私声明',
      infoBtnText: '我了解了',
      infoItems: [
        { text: '知愈非常重视你的隐私：', type: 'highlight' },
        { text: '· 情绪记录仅存储在你的设备和个人云端' },
        { text: '· 我们不会将你的数据分享给第三方' },
        { text: '· AI 对话内容不会被用于训练模型' },
        { text: '· 你可以随时导出或删除所有数据' },
        { text: '· 注销账号后所有数据将被永久删除' }
      ]
    });
  },

  onShareAppMessage: function() {
    return {
      title: '知愈 - 养育你的情绪',
      path: '/pages/about/about'
    };
  }
});
