// 引入云端工具函数
const cloudUtil = require('../../utils/cloud.js');

// 节日祝福库 - 格式：{ month: 月份, day: 日期, message: 祝福语 }
const festivals = [
  // 1月
  { month: 1, day: 1, message: "新年快乐，愿你在新的一年里，温柔且坚定。" },

  // 2月
  { month: 2, day: 14, message: "今天是情人节，你本身就值得被爱。" },
  { month: 2, day: 16, message: "除夕夜，愿你与温暖相伴，与爱同行。" },
  { month: 2, day: 17, message: "春节快乐，愿你在新的一年里，心有所栖，情有所依。" },

  // 3月
  { month: 3, day: 3, message: "元宵节快乐，愿你的生活如汤圆般圆满甜蜜。" },
  { month: 3, day: 8, message: "玫瑰与钢铁，皆是她。妇女节快乐，愿你永远知道自己的珍贵。" },
  { month: 3, day: 12, message: "植树节，愿你悲伤有岸，疲惫有靠。" },

  // 4月
  { month: 4, day: 1, message: "愚人节，真实的自己不需要伪装。" },
  { month: 4, day: 4, message: "清明时节，允许自己怀念，也允许自己释怀。" },
  { month: 4, day: 5, message: "清明时节，允许自己怀念，也允许自己释怀。" },

  // 5月
  { month: 5, day: 1, message: "劳动节快乐，你的努力值得被看见。" },
  { month: 5, day: 4, message: "青年节，愿你永远保持对生活的好奇。" },
  { month: 5, day: 12, message: "母亲节，感谢那些养育我们的温柔时刻。" },
  { month: 5, day: 20, message: "520，爱自己是一切爱的开始。" },

  // 6月
  { month: 6, day: 1, message: "儿童节快乐，愿你内心的小孩永远被温柔对待。" },
  { month: 6, day: 16, message: "父亲节，感谢那些沉默却坚定的支持。" },
  { month: 6, day: 19, message: "端午安康，愿你平安喜乐。" },

  // 7月
  { month: 7, day: 7, message: "七夕，愿你遇见懂得你情绪的人。" },

  // 8月
  { month: 8, day: 15, message: "中秋节，月圆人圆，心安即是归处。" },

  // 9月
  { month: 9, day: 10, message: "教师节，感谢那些教会我们表达的人。" },

  // 10月
  { month: 10, day: 1, message: "国庆快乐，愿你拥有内心的自由与平静。" },
  { month: 10, day: 31, message: "万圣节，不必害怕展现真实的自己。" },

  // 11月
  { month: 11, day: 11, message: "双十一，对自己好一点，你值得。" },

  // 12月
  { month: 12, day: 24, message: "平安夜，愿你的心找到安放之处。" },
  { month: 12, day: 25, message: "圣诞快乐，愿你被温暖包围。" },
  { month: 12, day: 31, message: "辞旧迎新，感谢这一年的自己。" }
];

// 12种情绪数据（每种情绪对应独特的莫兰迪色系）
const emotionsData = [
  {
    name: '开心',
    iconType: 'happy',
    selected: false,
    color: '#F5C6CB', // 温暖粉
    subEmotions: ['满足', '愉悦', '欣喜', '兴奋', '雀跃', '狂喜']
  },
  {
    name: '平静',
    iconType: 'calm',
    selected: false,
    color: '#B8D4E8', // 天蓝
    subEmotions: ['安宁', '放松', '淡然', '宁静', '祥和', '超然']
  },
  {
    name: '难过',
    iconType: 'sad',
    selected: false,
    color: '#9BA8BC', // 雾蓝
    subEmotions: ['失落', '沮丧', '忧伤', '悲伤', '心痛', '绝望']
  },
  {
    name: '累',
    iconType: 'tired',
    selected: false,
    color: '#D4C5B0', // 沙棕
    subEmotions: ['疲倦', '困乏', '疲惫', '劳累', '精疲力竭', '身心俱疲']
  },
  {
    name: '烦躁',
    iconType: 'irritated',
    selected: false,
    color: '#E8A5A5', // 珊瑚红
    subEmotions: ['不耐烦', '急躁', '烦闷', '烦躁', '暴躁', '狂躁']
  },
  {
    name: '焦虑',
    iconType: 'anxious',
    selected: false,
    color: '#C4B5D8', // 薰衣草紫
    subEmotions: ['担心', '不安', '紧张', '焦虑', '恐慌', '惊恐']
  },
  {
    name: '愤怒',
    iconType: 'angry',
    selected: false,
    color: '#D89B9B', // 砖红
    subEmotions: ['不满', '生气', '恼怒', '愤怒', '暴怒', '狂怒']
  },
  {
    name: '感动',
    iconType: 'touched',
    selected: false,
    color: '#F5D4C4', // 蜜桃色
    subEmotions: ['温暖', '触动', '感动', '感激', '感恩', '深深感动']
  },
  {
    name: '困惑',
    iconType: 'confused',
    selected: false,
    color: '#C4D4B5', // 鼠尾草绿
    subEmotions: ['疑惑', '迷茫', '困惑', '不解', '茫然', '迷失']
  },
  {
    name: '无聊',
    iconType: 'bored',
    selected: false,
    color: '#D0CFC4', // 灰米
    subEmotions: ['乏味', '无趣', '无聊', '厌倦', '麻木', '空虚']
  },
  {
    name: '震惊',
    iconType: 'shocked',
    selected: false,
    color: '#E8C4D8', // 玫瑰粉
    subEmotions: ['意外', '惊讶', '吃惊', '震惊', '震撼', '目瞪口呆']
  },
  {
    name: '不知道',
    iconType: 'unknown',
    selected: false,
    color: '#BCBCBC', // 中性灰
    subEmotions: ['说不清', '模糊', '混乱', '复杂', '矛盾', '无法言说']
  }
];

// 身体感受选项（新增"其他"选项）
const bodyFeelings = [
  { name: '心跳加速', selected: false },
  { name: '呼吸急促', selected: false },
  { name: '胸口发闷', selected: false },
  { name: '肩膀紧绷', selected: false },
  { name: '手心出汗', selected: false },
  { name: '胃部不适', selected: false },
  { name: '头晕目眩', selected: false },
  { name: '浑身无力', selected: false },
  { name: '肌肉紧张', selected: false },
  { name: '喉咙发紧', selected: false },
  { name: '身体放松', selected: false },
  { name: '精力充沛', selected: false },
  { name: '其他', selected: false, isOther: true }
];

Page({
  data: {
    currentDate: '',
    currentTime: '',
    festivalMessage: '',  // 节日祝福
    emotions: emotionsData,
    selectedEmotions: [],
    emotionIntensities: {}, // 存储每个情绪的强度 {情绪名: {intensity: 0-5, subEmotion: '子情绪'}}
    showIntensitySlider: false,
    currentEditingEmotion: null, // 当前正在编辑强度的情绪
    currentIntensity: 2, // 当前滑动选择的强度，默认中间值
    bodyFeelings: bodyFeelings,
    selectedBodyFeelings: [],
    otherBodyFeeling: '', // 用户自定义的身体感受
    showOtherInput: false,
    userProfile: null,
    quickNote: '',  // 快速记录文本
    showGuide: false,  // 是否显示新手引导
    guideStep: 0  // 引导步骤 0-3
  },

  onLoad: function(options) {
    this.updateDate();
    this.updateTime();
    this.updateFestival();  // 更新节日祝福
    this.loadUserProfile();
    this.checkFirstTime();
  },

  onShow: function() {
    this.updateTime();
    this.updateFestival();  // 每次显示时更新节日祝福
    this._timeTimer = setInterval(() => {
      this.updateTime();
    }, 1000);
  },

  onHide: function() {
    clearInterval(this._timeTimer);
  },

  onUnload: function() {
    clearInterval(this._timeTimer);
  },

  // 更新时间
  updateTime: function() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    this.setData({
      currentTime: `${hours}:${minutes}`
    });
  },

  // 更新日期
  updateDate: function() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const weekDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    const weekDay = weekDays[now.getDay()];

    this.setData({
      currentDate: `${year}年${month}月${day}日 ${weekDay}`
    });
  },

  // 更新节日祝福
  updateFestival: function() {
    const now = new Date();
    const month = now.getMonth() + 1; // 月份从0开始，需要+1
    const day = now.getDate();

    // 查找今天是否有节日
    const todayFestival = festivals.find(f => f.month === month && f.day === day);

    if (todayFestival) {
      this.setData({
        festivalMessage: todayFestival.message
      });
    } else {
      this.setData({
        festivalMessage: ''
      });
    }
  },

  // 加载用户画像（云端优先，本地兜底）
  loadUserProfile: function() {
    // 先用本地缓存快速展示
    const localProfile = wx.getStorageSync('userProfile');
    if (localProfile) {
      this.setData({ userProfile: localProfile });
    }

    // 异步从云端拉取最新画像
    cloudUtil.getUserProfileFromCloud().then(cloudProfile => {
      if (cloudProfile) {
        // 云端数据写回本地缓存，保持一致
        wx.setStorageSync('userProfile', cloudProfile);
        this.setData({ userProfile: cloudProfile });
      }
    }).catch(err => {
      console.error('云端画像加载失败，使用本地缓存', err);
    });
  },

  // 跳转到情绪库解读页面
  goToEmotionLibrary: function() {
    wx.navigateTo({
      url: '/pages/emotion-library/emotion-library'
    });
  },

  // 切换情绪选择（点击后弹出强度滑块）
  toggleEmotion: function(e) {
    const emotionName = e.currentTarget.dataset.name;
    const emotions = this.data.emotions;
    const emotion = emotions.find(e => e.name === emotionName);

    if (!emotion) return;

    // 如果已选中，则取消选中
    if (emotion.selected) {
      emotion.selected = false;
      const emotionIntensities = this.data.emotionIntensities;
      delete emotionIntensities[emotionName];

      const selectedEmotions = emotions.filter(e => e.selected).map(e => e.name);
      this.setData({
        emotions: emotions,
        selectedEmotions: selectedEmotions,
        emotionIntensities: emotionIntensities
      });
    } else {
      // 未选中，弹出强度滑块
      emotion.selected = true;

      // 为每个子情绪生成渐变色（从浅到深）
      const intensityColors = emotion.subEmotions.map((subEmotion, idx) => {
        const baseColor = emotion.color;
        const opacity = (idx + 1) * 0.15 + 0.1; // 0.25 到 1.0
        return this.hexToRgba(baseColor, opacity);
      });

      // 检查是否已有保存的强度
      const savedIntensity = this.data.emotionIntensities[emotionName];
      const defaultIntensity = savedIntensity ? savedIntensity.intensity : 2;

      this.setData({
        emotions: emotions,
        showIntensitySlider: true,
        currentEditingEmotion: {
          ...emotion,
          intensityColors: intensityColors
        },
        currentIntensity: defaultIntensity
      });
    }

    wx.vibrateShort({ type: 'light' });
  },

  // 将十六进制颜色转换为 rgba
  hexToRgba: function(hex, opacity) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  },

  // 滑动过程中实时更新（可选，用于实时反馈）
  onIntensityChanging: function(e) {
    const intensity = e.detail.value;
    this.setData({
      currentIntensity: intensity
    });
  },

  // 滑动结束时更新
  onIntensityChange: function(e) {
    const intensity = e.detail.value;
    this.setData({
      currentIntensity: intensity
    });
    wx.vibrateShort({ type: 'light' });
  },

  // 确认选择强度
  confirmIntensity: function() {
    const emotion = this.data.currentEditingEmotion;
    const intensity = this.data.currentIntensity;

    if (!emotion) return;

    const emotionIntensities = this.data.emotionIntensities;
    emotionIntensities[emotion.name] = {
      intensity: intensity,
      subEmotion: emotion.subEmotions[intensity]
    };

    const selectedEmotions = this.data.emotions.filter(e => e.selected).map(e => e.name);

    this.setData({
      emotionIntensities: emotionIntensities,
      selectedEmotions: selectedEmotions,
      showIntensitySlider: false,
      currentEditingEmotion: null,
      currentIntensity: 2
    });

    wx.vibrateShort({ type: 'medium' });

    // 等待身体感受区域渲染完成后滚动到身体感受区域
    setTimeout(() => {
      wx.pageScrollTo({
        selector: '.body-feeling-section',
        duration: 300
      });
    }, 150);
  },

  // 关闭强度滑块（不保存）
  closeIntensitySlider: function() {
    const emotion = this.data.currentEditingEmotion;
    if (emotion) {
      emotion.selected = false;
      this.setData({
        emotions: this.data.emotions,
        showIntensitySlider: false,
        currentEditingEmotion: null,
        currentIntensity: 2
      });
    }
  },

  // 切换身体感受
  toggleBodyFeeling: function(e) {
    const feeling = e.currentTarget.dataset.feeling;
    const bodyFeelings = this.data.bodyFeelings;

    const targetFeeling = bodyFeelings.find(item => item.name === feeling);
    if (targetFeeling) {
      // 如果是"其他"选项
      if (targetFeeling.isOther) {
        if (!targetFeeling.selected) {
          targetFeeling.selected = true;
          this.setData({
            bodyFeelings: bodyFeelings,
            showOtherInput: true
          });
        } else {
          targetFeeling.selected = false;
          this.setData({
            bodyFeelings: bodyFeelings,
            showOtherInput: false,
            otherBodyFeeling: ''
          });
        }
      } else {
        targetFeeling.selected = !targetFeeling.selected;
        this.setData({ bodyFeelings: bodyFeelings });
      }
    }

    // 更新选中的身体感受列表
    const selectedBodyFeelings = bodyFeelings
      .filter(item => item.selected && !item.isOther)
      .map(item => item.name);

    // 如果"其他"被选中且有内容，加入列表
    if (bodyFeelings.find(f => f.isOther && f.selected) && this.data.otherBodyFeeling) {
      selectedBodyFeelings.push(this.data.otherBodyFeeling);
    }

    this.setData({ selectedBodyFeelings: selectedBodyFeelings });
    wx.vibrateShort({ type: 'light' });
  },

  // 输入自定义身体感受
  onOtherFeelingInput: function(e) {
    const value = e.detail.value;
    this.setData({ otherBodyFeeling: value });

    // 更新选中列表
    const selectedBodyFeelings = this.data.bodyFeelings
      .filter(item => item.selected && !item.isOther)
      .map(item => item.name);

    if (value.trim()) {
      selectedBodyFeelings.push(value);
    }

    this.setData({ selectedBodyFeelings: selectedBodyFeelings });
  },

  // 快速记录输入
  onQuickNoteInput: function(e) {
    this.setData({ quickNote: e.detail.value });
  },

  // 自定义情绪标签
  showCustomEmotionInput: function() {
    wx.showModal({
      title: '自定义情绪',
      editable: true,
      placeholderText: '输入你的情绪词...',
      success: (res) => {
        if (res.confirm && res.content && res.content.trim()) {
          const customName = res.content.trim().substring(0, 6);
          const emotions = this.data.emotions;

          // 检查是否已存在
          if (emotions.find(e => e.name === customName)) {
            wx.showToast({ title: '该情绪已存在', icon: 'none' });
            return;
          }

          // 添加自定义情绪
          emotions.push({
            name: customName,
            iconType: 'custom',
            selected: true,
            color: '#C4B5D8',
            subEmotions: [customName],
            isCustom: true
          });

          const selectedEmotions = emotions.filter(e => e.selected).map(e => e.name);
          this.setData({ emotions, selectedEmotions });
          wx.vibrateShort({ type: 'light' });
        }
      }
    });
  },

  // 开始 AI 引导
  startAIGuidance: function() {
    if (this.data.selectedEmotions.length === 0) {
      wx.showToast({
        title: '请先选择情绪',
        icon: 'none',
        duration: 2000
      });
      return;
    }

    // 触觉反馈
    wx.vibrateShort({
      type: 'medium'
    });

    // 将情绪数据传递到独立对话页面
    const emotions = encodeURIComponent(JSON.stringify(this.data.selectedEmotions));
    const bodyFeelings = encodeURIComponent(JSON.stringify(this.data.selectedBodyFeelings));
    const intensities = encodeURIComponent(JSON.stringify(this.data.emotionIntensities));

    wx.navigateTo({
      url: `/pages/chat/chat?emotions=${emotions}&bodyFeelings=${bodyFeelings}&intensities=${intensities}`
    });
  },

  // 保存记录
  saveRecord: function() {
    const { selectedEmotions, selectedBodyFeelings, emotionIntensities, quickNote } = this.data;

    if (selectedEmotions.length === 0) {
      wx.showToast({
        title: '请至少选择一个情绪',
        icon: 'none',
        duration: 2000
      });
      return;
    }

    // 获取当前精确时间
    const now = new Date();
    const recordTime = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');

    // 构建记录对象
    const record = {
      id: Date.now(),
      date: now.toISOString(),
      recordTime: recordTime,
      emotions: selectedEmotions,
      emotionIntensities: emotionIntensities,
      bodyFeelings: selectedBodyFeelings,
      conversation: [],
      note: quickNote || '',
      timestamp: now.toLocaleString('zh-CN')
    };

    // 保存到本地存储
    let records = wx.getStorageSync('dailyRecords') || [];
    records.unshift(record);
    wx.setStorageSync('dailyRecords', records);

    // 同时保存到云端（合并为一条记录，包含多个情绪）
    const emotionsWithIntensity = selectedEmotions.map(emotion => {
      const emotionObj = this.data.emotions.find(e => e.name === emotion);
      const intensityInfo = emotionIntensities[emotion] || {};
      return {
        name: emotion,
        icon: emotionObj ? emotionObj.icon : '',
        intensity: intensityInfo.intensity !== undefined ? intensityInfo.intensity + 1 : 5,
        subEmotion: intensityInfo.subEmotion || ''
      };
    });

    cloudUtil.saveEmotionToCloud({
      emotions: emotionsWithIntensity,
      emotion: selectedEmotions[0],
      emotionIcon: emotionsWithIntensity[0].icon,
      intensity: emotionsWithIntensity[0].intensity,
      subEmotion: emotionsWithIntensity[0].subEmotion,
      note: quickNote || '',
      bodyFeelings: selectedBodyFeelings,
      conversation: [],
      recordDate: now.toISOString(),
      recordTime: recordTime
    }).then(() => {
      console.log('云端保存成功');
    }).catch(err => {
      console.error('云端保存失败，已保存到本地', err);
    });

    // 触觉反馈
    wx.vibrateShort({
      type: 'medium'
    });

    // 显示保存成功引导
    wx.showModal({
      title: '记录已保存',
      content: '可在「我的历史」日历中查看',
      confirmText: '去看看',
      cancelText: '好的',
      success: (res) => {
        if (res.confirm) {
          wx.navigateTo({ url: '/pages/history/history' });
        }
      }
    });

    // 重置页面
    this.resetPage();
  },

  // 重置页面
  resetPage: function() {
    const emotions = emotionsData.map(e => ({ ...e, selected: false }));
    const resetBodyFeelings = bodyFeelings.map(f => ({ ...f, selected: false }));

    this.setData({
      emotions: emotions,
      selectedEmotions: [],
      emotionIntensities: {},
      bodyFeelings: resetBodyFeelings,
      selectedBodyFeelings: [],
      otherBodyFeeling: '',
      showOtherInput: false,
      quickNote: ''  // 清空快速记录输入框
    });
  },

  // 底部导航跳转
  goToMain: function() {
    // 当前页面，不需要跳转
  },

  goToTraining: function() {
    wx.navigateTo({
      url: '/pages/training/training'
    });
  },

  goToProfile: function() {
    wx.navigateTo({
      url: '/pages/history/history'
    });
  },

  goToWomen: function() {
    wx.navigateTo({
      url: '/pages/women/women'
    });
  },

  goToShop: function() {
    wx.navigateTo({
      url: '/pages/shop/shop'
    });
  },

  goToKnowledge: function() {
    wx.navigateTo({
      url: '/pages/psych-knowledge/psych-knowledge'
    });
  },

  goToAbout: function() {
    wx.navigateTo({
      url: '/pages/about/about'
    });
  },

  goToChat: function() {
    const selectedEmotions = this.data.emotions.filter(e => e.selected).map(e => e.name);
    const selectedBodyFeelings = this.data.bodyFeelings.filter(f => f.selected).map(f => f.name);
    const intensities = this.data.emotionIntensities || {};
    const quickNote = this.data.quickNote || '';

    // 用 localStorage 传递 quickNote 避免 URL 长度限制
    if (quickNote.trim()) {
      wx.setStorageSync('tempQuickNote', quickNote);
    } else {
      wx.removeStorageSync('tempQuickNote');
    }

    wx.navigateTo({
      url: `/pages/chat/chat?emotions=${encodeURIComponent(JSON.stringify(selectedEmotions))}&bodyFeelings=${encodeURIComponent(JSON.stringify(selectedBodyFeelings))}&intensities=${encodeURIComponent(JSON.stringify(intensities))}`
    });
  },

  goToMine: function() {
    wx.navigateTo({
      url: '/pages/mine/mine'
    });
  },

  // 检查是否首次使用
  checkFirstTime: function() {
    const hasSeenGuide = wx.getStorageSync('hasSeenGuide');
    if (!hasSeenGuide) {
      this.setData({
        showGuide: true,
        guideStep: 0
      });
    }
  },

  // 下一步引导
  nextGuideStep: function() {
    const nextStep = this.data.guideStep + 1;
    if (nextStep > 3) {
      this.closeGuide();
    } else {
      this.setData({
        guideStep: nextStep
      });
    }
  },

  // 跳过引导
  skipGuide: function() {
    this.closeGuide();
  },

  // 关闭引导
  closeGuide: function() {
    this.setData({
      showGuide: false
    });
    wx.setStorageSync('hasSeenGuide', true);
  },

  onShareAppMessage: function() {
    return {
      title: '知愈 - 养育你的情绪',
      path: '/pages/main/main'
    };
  }
})
