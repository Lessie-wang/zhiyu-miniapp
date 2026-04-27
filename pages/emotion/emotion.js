// 12种情绪数据
const emotionsData = {
  开心: {
    icon: '😊',
    name: '开心',
    definition: '感到愉悦和满足的积极情绪',
    derivatives: ['兴奋', '满足', '自豪', '感激', '希望', '乐观', '愉快', '欣慰']
  },
  平静: {
    icon: '😐',
    name: '平静',
    definition: '内心安宁、情绪稳定的状态',
    derivatives: ['放松', '安详', '淡定', '从容', '宁静', '舒适', '自在', '安心']
  },
  难过: {
    icon: '😔',
    name: '难过',
    definition: '失去重要事物或遇到挫折时的情感体验',
    derivatives: ['失落', '沮丧', '孤独', '绝望', '忧郁', '痛苦', '哀伤', '遗憾']
  },
  累: {
    icon: '😫',
    name: '累',
    definition: '身心疲惫、能量耗尽的感觉',
    derivatives: ['疲惫', '困倦', '无力', '倦怠', '精疲力竭', '劳累', '乏力', '疲乏']
  },
  烦躁: {
    icon: '😤',
    name: '烦躁',
    definition: '内心不安、容易被激怒的状态',
    derivatives: ['不耐烦', '急躁', '心烦', '焦躁', '暴躁', '恼火', '不爽', '烦闷']
  },
  焦虑: {
    icon: '😨',
    name: '焦虑',
    definition: '对未来不确定性的担忧和不安',
    derivatives: ['担忧', '紧张', '惊慌', '不安', '恐慌', '害怕', '畏惧', '忧虑']
  },
  愤怒: {
    icon: '😡',
    name: '愤怒',
    definition: '当边界被侵犯时的强烈情绪反应',
    derivatives: ['恼怒', '激怒', '愤慨', '暴怒', '不满', '怨恨', '气愤', '愤懑']
  },
  感动: {
    icon: '❤️',
    name: '感动',
    definition: '被温暖的人或事触动内心的情感',
    derivatives: ['温暖', '感恩', '珍惜', '动容', '感激', '欣慰', '感怀', '感念']
  },
  困惑: {
    icon: '🤔',
    name: '困惑',
    definition: '对事物不理解、感到迷茫的状态',
    derivatives: ['迷茫', '疑惑', '不解', '纠结', '犹豫', '茫然', '困扰', '迷惑']
  },
  无聊: {
    icon: '🥱',
    name: '无聊',
    definition: '缺乏兴趣和刺激的空虚感',
    derivatives: ['乏味', '单调', '空虚', '无趣', '厌倦', '枯燥', '沉闷', '百无聊赖']
  },
  震惊: {
    icon: '🤯',
    name: '震惊',
    definition: '遇到意外或强烈刺激时的反应',
    derivatives: ['惊讶', '惊愕', '错愕', '诧异', '惊奇', '意外', '吃惊', '震撼']
  },
  不知道: {
    icon: '❓',
    name: '不知道',
    definition: '无法准确识别或描述当前的情绪状态',
    derivatives: ['说不清', '复杂', '混乱', '麻木', '茫然', '模糊', '不确定', '难以言说']
  }
};

Page({
  data: {
    emotions: [],
    selectedEmotion: '',
    currentDerivatives: []
  },

  onLoad: function(options) {
    // 将情绪数据转换为数组
    const emotionsArray = Object.keys(emotionsData).map(key => emotionsData[key]);
    this.setData({
      emotions: emotionsArray
    });
  },

  // 选择情绪
  selectEmotion: function(e) {
    const emotionName = e.currentTarget.dataset.emotion;
    const emotion = emotionsData[emotionName];

    this.setData({
      selectedEmotion: emotionName,
      currentDerivatives: emotion.derivatives
    });

    // 触觉反馈
    wx.vibrateShort({
      type: 'light'
    });
  },

  // 跳转到方法论页面
  goToMethodology: function() {
    wx.navigateTo({
      url: '/pages/training/training'
    });
  },

  // 跳转到主页
  goToMain: function() {
    wx.switchTab({
      url: '/pages/index/index'
    });
  },

  onShareAppMessage: function() {
    return {
      title: '知愈 - 为你的感受找到一个名字',
      path: '/pages/emotion/emotion'
    };
  }
})
