const cloudUtil = require('../../../utils/cloud.js');

const emotionIconMap = {
  '开心': '😊', '平静': '😐', '难过': '😔', '累': '😫',
  '烦躁': '😤', '焦虑': '😨', '愤怒': '😡', '感动': '🥰',
  '困惑': '🤔', '无聊': '🥱', '震惊': '🤯', '不知道': '❓',
  '兴奋': '🤩', '满足': '😌', '失落': '😞', '沮丧': '😩',
  '紧张': '😰', '担忧': '😟', '不安': '😣', '恼怒': '😠',
  '温暖': '🥰', '感激': '🙏', '迷茫': '😶‍🌫️', '疑惑': '🤨',
  '乏味': '😑', '空虚': '🫥', '惊讶': '😲', '说不清': '🫤',
  '麻木': '😶', '茫然': '😐'
};

Page({
  data: {
    // 常见情绪列表
    emotionList: [
      '开心', '平静', '难过', '累', '烦躁', '焦虑',
      '愤怒', '感动', '困惑', '无聊', '震惊', '不知道',
      '兴奋', '满足', '失落', '沮丧', '紧张', '担忧',
      '不安', '恼怒', '温暖', '感激', '迷茫', '疑惑',
      '乏味', '空虚', '惊讶', '说不清', '麻木', '茫然'
    ],
    selectedEmotion: '', // 选中的情绪
    intensity: 5, // 情绪强度（1-10）
    noteText: '', // 文字记录
    showWritingPrompt: false, // 感官写作引导弹窗
  },

  onLoad: function(options) {
    // 页面加载
  },

  // 选择情绪
  selectEmotion: function(e) {
    const emotion = e.currentTarget.dataset.emotion;
    this.setData({
      selectedEmotion: emotion
    });

    // 触觉反馈
    wx.vibrateShort({
      type: 'light'
    });
  },

  // 强度变化
  onIntensityChange: function(e) {
    this.setData({
      intensity: e.detail.value
    });
  },

  // 文字输入
  onNoteInput: function(e) {
    this.setData({
      noteText: e.detail.value
    });
  },

  // 保存记录
  saveRecord: function() {
    const { selectedEmotion, intensity, noteText } = this.data;

    if (!selectedEmotion) {
      wx.showToast({
        title: '请选择情绪',
        icon: 'none',
        duration: 2000
      });
      return;
    }

    // 创建记录对象
    const record = {
      id: Date.now(), // 使用时间戳作为ID
      emotion: selectedEmotion,
      intensity: intensity,
      note: noteText,
      timestamp: new Date().toISOString(),
      date: this.formatDate(new Date())
    };

    // 获取本地存储的记录
    let records = wx.getStorageSync('emotionRecords') || [];

    // 添加新记录到数组开头
    records.unshift(record);

    // 保存到本地存储
    wx.setStorageSync('emotionRecords', records);

    // 同时保存到云端
    cloudUtil.saveEmotionToCloud({
      emotion: selectedEmotion,
      emotionIcon: emotionIconMap[selectedEmotion] || '📝',
      intensity: intensity,
      note: noteText,
      bodyFeelings: [],
      recordDate: new Date().toISOString()
    }).then(() => {
      console.log('云端保存成功');
    }).catch(err => {
      console.error('云端保存失败，已保存到本地', err);
    });

    // 触觉反馈
    wx.vibrateShort({
      type: 'medium'
    });

    // 显示成功提示
    wx.showToast({
      title: '记录成功',
      icon: 'success',
      duration: 1500
    });

    // 显示感官写作引导弹窗
    setTimeout(() => {
      this.setData({ showWritingPrompt: true });
    }, 1500);
  },

  // 跳转到感官写作
  goToSensoryWriting() {
    const { selectedEmotion } = this.data;
    const title = encodeURIComponent(selectedEmotion + '的此刻');
    const desc = encodeURIComponent('我感到' + selectedEmotion + '，想用文字感受一下');
    wx.navigateTo({
      url: `/subpages/training/sensory-writing/sensory-writing?customTitle=${title}&customDesc=${desc}`
    });
  },

  // 关闭引导弹窗并返回
  dismissPrompt() {
    this.setData({ showWritingPrompt: false });
    wx.navigateBack();
  },

  // 格式化日期
  formatDate: function(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}`;
  },

  onShareAppMessage: function() {
    return {
      title: '知愈 - 记录此刻情绪',
      path: '/pages/record/record'
    };
  }
})
