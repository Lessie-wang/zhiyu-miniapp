// 她的时间页面
const aiUtil = require('../../../utils/ai.js');
const cloudUtil = require('../../../utils/cloud.js');

// 护理知识分类
const knowledgeCategories = [
  {
    id: 1,
    title: '经期饮食',
    icon: '🍎',
    desc: '科学饮食，补充营养'
  },
  {
    id: 2,
    title: '运动指南',
    icon: '🧘',
    desc: '适度运动，缓解不适'
  },
  {
    id: 3,
    title: '保暖护理',
    icon: '🔥',
    desc: '温暖呵护，舒适度过'
  },
  {
    id: 4,
    title: '情绪管理',
    icon: '💭',
    desc: '理解情绪，温柔对待'
  }
];

// 经期各阶段情绪提示
const periodEmotionTips = {
  before: {
    phase: '经前期',
    icon: '🌙',
    emotions: ['烦躁', '敏感', '焦虑', '情绪波动'],
    tip: '经前激素变化可能让你更容易感到烦躁或低落，这是身体的正常反应，不是你的错。',
    suggestions: [
      '允许自己慢下来，减少不必要的社交',
      '做一些让自己舒服的事，比如泡脚、听音乐',
      '如果想哭就哭，不需要压抑'
    ]
  },
  during: {
    phase: '经期中',
    icon: '🌸',
    emotions: ['疲惫', '低落', '脆弱', '想被关心'],
    tip: '经期身体在努力工作，感到疲惫和脆弱是很自然的。给自己多一点温柔。',
    suggestions: [
      '保证充足的休息和睡眠',
      '吃一些温暖的食物，补充能量',
      '可以和小知聊聊，说说你的感受'
    ]
  },
  after: {
    phase: '经后恢复期',
    icon: '🌿',
    emotions: ['轻松', '恢复', '平静', '精力回升'],
    tip: '经期结束后身体在恢复，你可能会感到轻松和精力充沛，好好享受这个阶段。',
    suggestions: [
      '适当运动，帮助身体恢复活力',
      '回顾这个周期的情绪变化，了解自己的模式',
      '为下一个周期做好准备'
    ]
  }
};

// 舒缓音乐列表（第一首有云端音源）
const PERIOD_MUSIC_FILE_ID = 'cloud://cloud1-7g2wu7as9a592655.636c-cloud1-7g2wu7as9a592655-1405184369/audio/有效缓解痛经频率432赫兹｜经期暖宝宝｜补气血.mp3';

const soothingMusic = [
  { id: 1, title: '经期舒缓 432Hz', duration: '舒缓频率', icon: '🩹', fileID: PERIOD_MUSIC_FILE_ID },
  { id: 2, title: '雨声冥想', duration: '10分钟', icon: '🌧️', fileID: '' },
  { id: 3, title: '森林漫步', duration: '15分钟', icon: '🌲', fileID: '' },
  { id: 4, title: '海浪轻拍', duration: '12分钟', icon: '🌊', fileID: '' }
];

Page({
  data: {
    // 生理期状态
    periodStatus: null, // 'before' | 'during' | 'after' | null
    daysUntilPeriod: 0,
    daysSincePeriodStart: 0,

    // 生理期记录
    lastPeriodDate: null,
    cycleLength: 28, // 默认周期28天
    periodLength: 5, // 默认经期5天

    // 痛经程度
    painLevel: 0, // 0-10

    // 护理知识分类
    knowledgeCategories: knowledgeCategories,

    // 舒缓音乐
    soothingMusic: soothingMusic,
    currentMusicId: 0, // 当前播放的音乐 id，0 表示没有在播放

    // AI 陪伴
    aiMessage: '',

    // 多人管理
    companions: [], // 绑定的陪伴者列表

    // 经期情绪提示
    periodEmotionTip: null
  },

  onLoad: function(options) {
    this.loadPeriodData();
    this.loadCompanions();
    this.calculatePeriodStatus();
    this.generateAIMessage();
  },

  onShow: function() {
    this.calculatePeriodStatus();
  },

  onUnload: function() {
    // 离开页面时停止并销毁音乐实例
    if (this._musicAudio) {
      this._musicAudio.stop();
      this._musicAudio.destroy();
      this._musicAudio = null;
    }
  },

  // 加载生理期数据（优先从云端）
  loadPeriodData: function() {
    // 先用本地数据渲染
    const periodData = wx.getStorageSync('periodData') || {};
    this.setData({
      lastPeriodDate: periodData.lastPeriodDate || null,
      cycleLength: periodData.cycleLength || 28,
      periodLength: periodData.periodLength || 5,
      painLevel: periodData.painLevel || 0
    });

    // 再尝试从云端获取
    cloudUtil.getPeriodDataFromCloud().then(cloudData => {
      if (cloudData) {
        this.setData({
          lastPeriodDate: cloudData.lastPeriodDate || this.data.lastPeriodDate,
          cycleLength: cloudData.cycleLength || this.data.cycleLength,
          periodLength: cloudData.periodLength || this.data.periodLength,
          painLevel: cloudData.painLevel || this.data.painLevel
        });
        // 同步到本地
        wx.setStorageSync('periodData', {
          lastPeriodDate: this.data.lastPeriodDate,
          cycleLength: this.data.cycleLength,
          periodLength: this.data.periodLength,
          painLevel: this.data.painLevel
        });
        this.calculatePeriodStatus();
        this.generateAIMessage();
      }
    }).catch(err => {
      console.error('云端加载经期数据失败，使用本地数据', err);
    });
  },

  // 加载陪伴者列表
  loadCompanions: function() {
    const companions = wx.getStorageSync('periodCompanions') || [];
    this.setData({
      companions: companions
    });
  },

  // 计算生理期状态
  calculatePeriodStatus: function() {
    if (!this.data.lastPeriodDate) {
      this.setData({
        periodStatus: null
      });
      return;
    }

    const lastDate = new Date(this.data.lastPeriodDate);
    const today = new Date();
    const daysDiff = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));

    let status = null;
    let daysUntil = 0;
    let daysSince = 0;

    if (daysDiff < this.data.periodLength) {
      // 经期中
      status = 'during';
      daysSince = daysDiff + 1;
    } else if (daysDiff >= this.data.cycleLength - 3) {
      // 经期前3天
      status = 'before';
      daysUntil = this.data.cycleLength - daysDiff;
    } else if (daysDiff < this.data.periodLength + 3) {
      // 经期后3天
      status = 'after';
      daysSince = daysDiff - this.data.periodLength + 1;
    }

    this.setData({
      periodStatus: status,
      daysUntilPeriod: daysUntil,
      daysSincePeriodStart: daysSince,
      periodEmotionTip: status ? periodEmotionTips[status] : null
    });
  },

  // 生成 AI 关怀消息
  generateAIMessage: function() {
    const status = this.data.periodStatus;
    const companionCount = this.data.companions.length;
    let message = '';

    if (!status) {
      if (companionCount > 0) {
        message = `已有 ${companionCount} 位陪伴者关注你。记录生理期，让 TA 们更懂你 🌸`;
      } else {
        message = '记录你的生理期，邀请另一半或朋友一起关注 🌸';
      }
    } else if (status === 'before') {
      message = `距离经期还有 ${this.data.daysUntilPeriod} 天。`;
      if (companionCount > 0) {
        message += '你的陪伴者已收到提醒 💕';
      }
    } else if (status === 'during') {
      message = `今天是经期第 ${this.data.daysSincePeriodStart} 天。`;
      if (companionCount > 0) {
        message += 'TA 们正在关注你的状态 🤗';
      } else {
        message += '记得多喝温水，好好照顾自己 🤗';
      }
    } else if (status === 'after') {
      message = '经期刚过，身体可能还在恢复。继续保持良好的作息哦 ✨';
    }

    this.setData({
      aiMessage: message
    });
  },

  // 记录生理期
  recordPeriod: function() {
    const that = this;

    wx.showModal({
      title: '记录生理期',
      content: '今天是经期第一天吗？',
      confirmText: '是的',
      cancelText: '取消',
      success: function(res) {
        if (res.confirm) {
          const today = new Date().toISOString().split('T')[0];

          // 保存数据
          const periodData = {
            lastPeriodDate: today,
            cycleLength: that.data.cycleLength,
            periodLength: that.data.periodLength,
            painLevel: that.data.painLevel
          };

          wx.setStorageSync('periodData', periodData);

          // 同步到云端
          cloudUtil.savePeriodDataToCloud(periodData).catch(err => {
            console.error('经期数据云端同步失败', err);
          });

          that.setData({
            lastPeriodDate: today
          });

          that.calculatePeriodStatus();
          that.generateAIMessage();

          // 通知陪伴者
          that.notifyCompanions('period_start');

          wx.showToast({
            title: '记录成功',
            icon: 'success'
          });
        }
      }
    });
  },

  // 设置周期长度
  setCycleLength: function() {
    const that = this;

    wx.showModal({
      title: '设置周期长度',
      content: '请输入你的月经周期天数（通常为21-35天）',
      editable: true,
      placeholderText: '28',
      success: function(res) {
        if (res.confirm && res.content) {
          const length = parseInt(res.content);
          if (length >= 21 && length <= 35) {
            that.setData({
              cycleLength: length
            });

            // 保存数据
            const periodData = wx.getStorageSync('periodData') || {};
            periodData.cycleLength = length;
            wx.setStorageSync('periodData', periodData);

            // 同步到云端
            cloudUtil.savePeriodDataToCloud(periodData).catch(err => {
              console.error('经期数据云端同步失败', err);
            });

            that.calculatePeriodStatus();
            that.generateAIMessage();

            wx.showToast({
              title: '设置成功',
              icon: 'success'
            });
          } else {
            wx.showToast({
              title: '请输入21-35之间的数字',
              icon: 'none'
            });
          }
        }
      }
    });
  },

  // 记录痛经程度
  recordPainLevel: function(e) {
    const level = e.currentTarget.dataset.level;

    this.setData({
      painLevel: level
    });

    // 保存数据
    const periodData = wx.getStorageSync('periodData') || {};
    periodData.painLevel = level;
    wx.setStorageSync('periodData', periodData);

    // 同步到云端
    cloudUtil.savePeriodDataToCloud(periodData).catch(err => {
      console.error('经期数据云端同步失败', err);
    });

    // 触觉反馈
    wx.vibrateShort({
      type: 'light'
    });

    // 通知陪伴者
    if (level >= 4) {
      this.notifyCompanions('pain_level', level);
    }

    // 根据痛经程度给出建议
    let tip = '';
    if (level <= 3) {
      tip = '轻微不适，注意保暖和休息即可';
    } else if (level <= 6) {
      tip = '中度不适，可以热敷腹部，喝些红糖水';
    } else {
      tip = '疼痛较严重，建议咨询医生，必要时服用止痛药';
    }

    wx.showToast({
      title: tip,
      icon: 'none',
      duration: 3000
    });
  },

  // 查看护理知识详情（跳转到知识社区页面）
  viewKnowledgeDetail: function(e) {
    const category = e.currentTarget.dataset.item;

    wx.navigateTo({
      url: `/pages/knowledge/knowledge?id=${category.id}&title=${category.title}`
    });
  },

  // 播放舒缓音乐
  playMusic: function(e) {
    var that = this;
    var music = e.currentTarget.dataset.music;

    // 如果没有音源
    if (!music.fileID) {
      wx.showToast({ title: '该音乐即将上线', icon: 'none' });
      return;
    }

    // 如果正在播放同一首，则暂停
    if (this.data.currentMusicId === music.id && this._musicAudio) {
      this._musicAudio.pause();
      this.setData({ currentMusicId: 0 });
      return;
    }

    // 停掉之前的音乐
    if (this._musicAudio) {
      this._musicAudio.stop();
      this._musicAudio.destroy();
    }

    // 同时暂停 BGM，避免两首音乐重叠
    var app = getApp();
    if (app.globalData.bgmPlaying) {
      app.globalData.bgmAudio.pause();
      app.globalData.bgmPlaying = false;
    }

    this.setData({ currentMusicId: music.id });

    // 通过云函数获取临时 URL 再播放
    wx.showLoading({ title: '加载中' });
    wx.cloud.callFunction({
      name: 'getAudioUrl',
      data: { fileID: music.fileID },
      success: function(res) {
        wx.hideLoading();
        if (res.result && res.result.success) {
          var audio = wx.createInnerAudioContext();
          audio.src = res.result.url;
          audio.loop = true;
          audio.volume = 0.6;
          audio.obeyMuteSwitch = false;
          audio.play();
          that._musicAudio = audio;

          audio.onError(function(err) {
            console.error('音乐播放错误:', err.errCode, err.errMsg);
            that.setData({ currentMusicId: 0 });
          });

          audio.onEnded(function() {
            that.setData({ currentMusicId: 0 });
          });
        } else {
          wx.showToast({ title: '音乐加载失败', icon: 'none' });
          that.setData({ currentMusicId: 0 });
        }
      },
      fail: function() {
        wx.hideLoading();
        wx.showToast({ title: '网络错误', icon: 'none' });
        that.setData({ currentMusicId: 0 });
      }
    });
  },

  // 开启 AI 陪伴对话
  startAIChat: function() {
    this.setData({
      showAIChat: true
    });

    // TODO: 实现 AI 对话功能
    wx.showToast({
      title: 'AI 陪伴功能开发中',
      icon: 'none',
      duration: 2000
    });
  },

  // 管理陪伴者
  manageCompanions: function() {
    wx.navigateTo({
      url: '/pages/companion/companion'
    });
  },

  // 通知陪伴者
  notifyCompanions: function(type, data) {
    const companions = this.data.companions.filter(c => c.status === 'active');
    if (companions.length === 0) return;

    // 调用云函数发送通知
    wx.cloud.callFunction({
      name: 'notifyCompanions',
      data: {
        companionIds: companions.map(c => c.id),
        notificationType: type,
        notificationData: data
      }
    }).then(res => {
      console.log('陪伴者通知已发送:', res);
    }).catch(err => {
      console.error('发送陪伴者通知失败:', err);
    });
  },

  // 查看经期情绪报告
  viewEmotionReport: function() {
    wx.navigateTo({
      url: '/pages/emotion-report/emotion-report'
    });
  },

  onShareAppMessage: function() {
    return {
      title: '知愈 - 她的时间',
      path: '/pages/women/women'
    };
  }
})
