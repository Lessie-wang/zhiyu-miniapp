// 表达训练页面（言心小筑）

// 模拟对话场景数据（扩展为4个预设 + 自定义）
const dialogueScenarios = [
  {
    id: 1,
    title: '日常沟通',
    iconType: 'chat',
    description: '朋友情绪低落，练习倾听和共情表达',
    difficulty: '初级'
  },
  {
    id: 2,
    title: '表达拒绝',
    iconType: 'shield',
    description: '面对不合理要求，学会温和而坚定地说不',
    difficulty: '中级'
  },
  {
    id: 3,
    title: '处理冲突',
    iconType: 'bolt',
    description: '和室友发生矛盾，练习非暴力沟通',
    difficulty: '中级'
  },
  {
    id: 4,
    title: '安慰他人',
    iconType: 'heart',
    description: '朋友刚经历分手，练习陪伴与情感支持',
    difficulty: '初级'
  }
];

Page({
  data: {
    dialogueScenarios: dialogueScenarios,
    showDialogueScenarios: false,
    showCustomInput: false,
    customSceneText: '',
    // 训练历史
    trainingRecords: [],
    showHistory: false,
    viewingRecord: null
  },

  onLoad: function(options) {
    this.loadTrainingHistory();
  },

  onShow: function() {
    this.loadTrainingHistory();
  },

  // 点击"模拟对话"按钮
  showDialogueOptions: function() {
    this.setData({
      showDialogueScenarios: !this.data.showDialogueScenarios,
      showWritingInput: false
    });
    wx.vibrateShort({ type: 'light' });
  },

  // 选择预设场景并跳转
  selectScenario: function(e) {
    var scenarioId = e.currentTarget.dataset.id;
    wx.vibrateShort({ type: 'medium' });
    wx.navigateTo({
      url: '/pages/dialogue-training/dialogue-training?scenarioId=' + scenarioId
    });
  },

  // 显示自定义场景输入
  showCustomScene: function() {
    this.setData({ showCustomInput: true });
    wx.vibrateShort({ type: 'light' });
  },

  // 自定义场景输入变化
  onCustomInput: function(e) {
    this.setData({ customSceneText: e.detail.value });
  },

  // 提交自定义场景
  submitCustomScene: function() {
    var text = this.data.customSceneText.trim();
    if (!text) {
      wx.showToast({ title: '请描述你想练习的场景', icon: 'none' });
      return;
    }
    wx.vibrateShort({ type: 'medium' });
    wx.navigateTo({
      url: '/pages/dialogue-training/dialogue-training?customScene=' + encodeURIComponent(text)
    });
  },

  // 点击"感官写作"按钮 - 直接跳转到场景选择页面
  showWritingOptions: function() {
    wx.vibrateShort({ type: 'medium' });
    wx.navigateTo({
      url: '/pages/sensory-writing/sensory-writing'
    });
  },

  // 加载训练历史
  loadTrainingHistory: function() {
    var records = wx.getStorageSync('trainingRecords') || [];
    this.setData({ trainingRecords: records });
  },

  // 进入历史列表
  viewTrainingHistory: function() {
    wx.vibrateShort({ type: 'light' });
    this.setData({ showHistory: true });
  },

  // 返回主视图
  backFromHistory: function() {
    this.setData({ showHistory: false, viewingRecord: null });
  },

  // 查看记录详情
  viewRecordDetail: function(e) {
    var id = e.currentTarget.dataset.id;
    var records = this.data.trainingRecords;
    for (var i = 0; i < records.length; i++) {
      if (records[i].id === id) {
        this.setData({ viewingRecord: records[i] });
        return;
      }
    }
  },

  // 返回列表
  backFromDetail: function() {
    this.setData({ viewingRecord: null });
  },

  // 删除记录
  deleteRecord: function(e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '删除记录',
      content: '确定要删除这条训练记录吗？',
      confirmText: '删除',
      success: function(res) {
        if (res.confirm) {
          var records = that.data.trainingRecords.filter(function(r) { return r.id !== id; });
          wx.setStorageSync('trainingRecords', records);
          that.setData({ trainingRecords: records, viewingRecord: null });
          wx.showToast({ title: '已删除', icon: 'success' });
        }
      }
    });
  },

  onShareAppMessage: function() {
    return {
      title: '知愈 - 表达训练',
      path: '/pages/training/training'
    };
  }
});
