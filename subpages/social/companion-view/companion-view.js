// pages/companion-view/companion-view.js
const cloudUtil = require('../../../utils/cloud.js');

Page({
  data: {
    userId: '',
    userInfo: {},
    periodStatus: null,
    lastPeriodDate: '',
    cycleLength: 28,
    currentPhase: null,
    recentEmotions: [],
    careSuggestion: '',
    showPainAlert: false,
    painLevel: 0
  },

  onLoad(options) {
    if (options.userId) {
      this.setData({ userId: options.userId });
      this.loadUserData();
    }
  },

  onShow() {
    if (this.data.userId) {
      this.loadUserData();
    }
  },

  // 加载用户数据
  loadUserData() {
    wx.showLoading({ title: '加载中...' });

    Promise.all([
      this.loadUserInfo(),
      this.loadPeriodStatus(),
      this.loadRecentEmotions()
    ]).then(() => {
      wx.hideLoading();
      this.generateCareSuggestion();
    }).catch(err => {
      wx.hideLoading();
      console.error('加载数据失败:', err);
      wx.showToast({ title: '加载失败', icon: 'none' });
    });
  },

  // 加载用户信息
  loadUserInfo() {
    return wx.cloud.callFunction({
      name: 'getCompanionUserInfo',
      data: { userId: this.data.userId }
    }).then(res => {
      if (res.result.success) {
        this.setData({
          userInfo: res.result.userInfo
        });
      }
    });
  },

  // 加载经期状态
  loadPeriodStatus() {
    return wx.cloud.callFunction({
      name: 'getCompanionPeriodStatus',
      data: { userId: this.data.userId }
    }).then(res => {
      if (res.result.success && res.result.periodData) {
        const data = res.result.periodData;
        this.setData({
          periodStatus: data,
          lastPeriodDate: data.lastPeriodDate,
          cycleLength: data.cycleLength,
          currentPhase: this.calculatePhase(data),
          showPainAlert: data.painLevel >= 4,
          painLevel: data.painLevel
        });
      }
    });
  },

  // 计算当前阶段
  calculatePhase(periodData) {
    if (!periodData.lastPeriodDate) return null;

    const lastDate = new Date(periodData.lastPeriodDate);
    const today = new Date();
    const daysDiff = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));

    if (daysDiff < periodData.periodLength) {
      return {
        icon: '🌸',
        name: '经期中',
        desc: `第 ${daysDiff + 1} 天`
      };
    } else if (daysDiff >= periodData.cycleLength - 3) {
      return {
        icon: '🌙',
        name: '经前期',
        desc: `距离下次经期 ${periodData.cycleLength - daysDiff} 天`
      };
    } else if (daysDiff < periodData.periodLength + 3) {
      return {
        icon: '🌿',
        name: '经后恢复期',
        desc: '身体正在恢复'
      };
    }

    return {
      icon: '☀️',
      name: '平稳期',
      desc: '状态良好'
    };
  },

  // 加载近期情绪
  loadRecentEmotions() {
    return wx.cloud.callFunction({
      name: 'getCompanionEmotions',
      data: {
        userId: this.data.userId,
        limit: 5
      }
    }).then(res => {
      if (res.result.success) {
        const emotions = res.result.emotions.map(item => ({
          id: item._id,
          emotion: item.emotion,
          icon: item.emotionIcon,
          intensity: item.intensity,
          time: this.formatTime(item.recordDate)
        }));
        this.setData({ recentEmotions: emotions });
      }
    });
  },

  // 格式化时间
  formatTime(dateStr) {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return '今天';
    if (days === 1) return '昨天';
    if (days < 7) return `${days}天前`;
    return `${date.getMonth() + 1}月${date.getDate()}日`;
  },

  // 生成关怀建议
  generateCareSuggestion() {
    let suggestion = '';

    // 根据经期状态生成建议
    if (this.data.currentPhase) {
      if (this.data.currentPhase.name === '经期中') {
        if (this.data.painLevel >= 4) {
          suggestion = '她正在经历痛经，可以问问她需不需要帮助，比如准备热水袋、红糖水，或者陪她聊聊天分散注意力。';
        } else {
          suggestion = '她正处于经期，可能会感到疲惫。给她一些温暖的关心，让她知道你在身边支持她。';
        }
      } else if (this.data.currentPhase.name === '经前期') {
        suggestion = '她即将进入经期，可能会情绪波动或感到焦虑。多一些耐心和理解，避免争吵。';
      }
    }

    // 根据情绪状态补充建议
    if (this.data.recentEmotions.length > 0) {
      const recentEmotion = this.data.recentEmotions[0];
      const negativeEmotions = ['难过', '焦虑', '愤怒', '沮丧', '孤独'];

      if (negativeEmotions.includes(recentEmotion.emotion)) {
        if (!suggestion) {
          suggestion = `她最近感到${recentEmotion.emotion}，可以主动问候她，倾听她的感受，给予陪伴和支持。`;
        }
      }
    }

    if (!suggestion) {
      suggestion = '她目前状态良好，继续保持关心和陪伴，让她感受到你的支持。';
    }

    this.setData({ careSuggestion: suggestion });
  },

  // 发送关怀消息
  sendCareMessage() {
    wx.showModal({
      title: '发送关怀',
      content: '这个功能将帮助你向TA发送一条温暖的关怀消息',
      confirmText: '发送',
      success: (res) => {
        if (res.confirm) {
          // TODO: 实现发送消息功能
          wx.showToast({
            title: '消息已发送',
            icon: 'success'
          });
        }
      }
    });
  },

  // 查看更多建议
  viewMoreSuggestions() {
    wx.showModal({
      title: '更多关怀建议',
      content: '1. 主动询问她的感受\n2. 提供实际帮助（如准备食物）\n3. 给予情感支持和陪伴\n4. 尊重她的空间需求\n5. 避免说教或轻视她的感受',
      showCancel: false,
      confirmText: '知道了'
    });
  }
});
