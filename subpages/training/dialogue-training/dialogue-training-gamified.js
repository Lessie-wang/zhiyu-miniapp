// 表达训练 - 游戏化关卡设计
const { DialogueTrainingGame } = require('../../../utils/game-system.js');
const { dialogueScenarios } = require('../../../utils/dialogue-scenarios.js');

Page({
  data: {
    // 用户进度数据
    userLevel: 1,
    currentExp: 0,
    nextLevelExp: 100,
    expProgress: 0,
    completedLevels: 0,
    totalBadges: 0,
    streakDays: 0,

    // 关卡数据 - 从场景数据生成
    levels: [],

    // 徽章数据
    badges: [
      { id: 'beginner', name: '初学者', icon: '🌱', unlocked: true, description: '完成第一关' },
      { id: 'persistent', name: '坚持者', icon: '🔥', unlocked: false, description: '连续3天训练' },
      { id: 'explorer', name: '探索者', icon: '🔍', unlocked: false, description: '完成5关' },
      { id: 'emotion_master', name: '情绪大师', icon: '👑', unlocked: false, description: '完成BOSS关' },
      { id: 'expression_artist', name: '表达艺术家', icon: '🎨', unlocked: false, description: '完成第8关' },
      { id: 'streak_7', name: '连续7天', icon: '⭐', unlocked: false, description: '连续7天训练' },
      { id: 'perfectionist', name: '完美主义', icon: '💯', unlocked: false, description: '获得10个三星' },
      { id: 'helper', name: '助人为乐', icon: '🤝', unlocked: false, description: '分享训练成果' }
    ],

    unlockedBadges: 1,
    totalBadgesCount: 8,
    hasAvailableLevel: true,

    // 弹窗数据
    showLevelModal: false,
    selectedLevel: null
  },

  onLoad(options) {
    // 初始化游戏系统
    this.gameSystem = new DialogueTrainingGame();

    // 从场景数据生成关卡列表
    this._initializeLevels();

    // 更新连续天数
    this.gameSystem.updateStreak();

    // 加载用户进度数据
    this.loadUserProgress();

    // 延迟滚动到第一个可用关卡（等待页面渲染完成）
    setTimeout(() => {
      this.scrollToFirstAvailableLevel();
    }, 300);
  },

  // 从场景数据初始化关卡列表
  _initializeLevels() {
    const levels = [];
    for (let i = 1; i <= 10; i++) {
      const scenario = dialogueScenarios[i];
      if (scenario) {
        levels.push({
          id: scenario.id,
          number: i,
          title: scenario.title,
          description: scenario.focus,
          fullDescription: scenario.background,
          icon: `/assets/images/levels/level-${i}.png`,
          status: i === 1 ? 'available' : 'locked',
          isBoss: i === 5 || i === 10,
          expReward: 50 + (i - 1) * 10,
          badgeReward: i === 5 ? '情绪识别大师' : (i === 10 ? '情绪表达大师' : null),
          objectives: scenario.objectives || []
        });
      }
    }
    this.setData({ levels });
  },

  onShow() {
    // 页面显示时重新加载进度（用户可能完成了关卡返回）
    if (this.gameSystem) {
      this.loadUserProgress();

      // 延迟滚动到第一个可用关卡
      setTimeout(() => {
        this.scrollToFirstAvailableLevel();
      }, 300);
    }
  },

  // 加载用户进度
  loadUserProgress() {
    const stats = this.gameSystem.getStats();

    // 更新关卡状态
    const levels = this.data.levels.map((level, index) => {
      // 第一关始终可用
      if (level.id === 1) {
        return {
          ...level,
          status: 'available'
        };
      }

      const isCompleted = this.gameSystem.isLevelCompleted(level.id);
      const prevCompleted = index === 0 || this.gameSystem.isLevelCompleted(this.data.levels[index - 1].id);

      return {
        ...level,
        status: isCompleted ? 'completed' : (prevCompleted ? 'available' : 'locked')
      };
    });

    // 更新徽章状态
    const badges = this.data.badges.map(badge => ({
      ...badge,
      unlocked: this.gameSystem.isBadgeUnlocked(badge.id)
    }));

    this.setData({
      userLevel: stats.level,
      currentExp: stats.exp,
      nextLevelExp: stats.nextLevelExp,
      expProgress: parseFloat(stats.expProgress),
      completedLevels: stats.completedLevelsCount,
      totalBadges: stats.unlockedBadgesCount,
      streakDays: stats.streakDays,
      levels,
      badges,
      unlockedBadges: stats.unlockedBadgesCount
    });

    console.log('加载用户进度完成，第一关状态:', levels[0].status);
  },

  // 点击关卡
  onLevelTap(e) {
    const level = e.currentTarget.dataset.level;
    const levelId = e.currentTarget.dataset.levelId;

    console.log('点击关卡:', level);
    console.log('关卡状态:', level.status);

    if (level.status === 'locked') {
      wx.showToast({
        title: '请先完成前置关卡',
        icon: 'none'
      });
      return;
    }

    // 震动反馈
    wx.vibrateShort({ type: 'light' });

    // 先滚动到关卡位置，再显示弹窗
    this.scrollToLevel(levelId, () => {
      this.setData({
        selectedLevel: level,
        showLevelModal: true
      });
    });
  },

  // 点击徽章
  onBadgeTap(e) {
    const badge = e.currentTarget.dataset.badge;

    if (badge.unlocked) {
      wx.showToast({
        title: `已获得：${badge.name}`,
        icon: 'success'
      });
    } else {
      wx.showToast({
        title: '继续努力解锁徽章',
        icon: 'none'
      });
    }
  },

  // 继续训练
  onContinueTap() {
    if (!this.data.hasAvailableLevel) {
      return;
    }

    // 找到第一个可用关卡
    const availableLevel = this.data.levels.find(level => level.status === 'available');

    if (availableLevel) {
      this.setData({
        selectedLevel: availableLevel,
        showLevelModal: true
      });
    }
  },

  // 开始关卡
  onStartLevel() {
    const level = this.data.selectedLevel;

    if (level.status !== 'available' && level.status !== 'completed') {
      return;
    }

    // 关闭弹窗
    this.setData({
      showLevelModal: false
    });

    // 跳转到对话训练页面，直接使用关卡ID
    wx.navigateTo({
      url: `/subpages/training/dialogue-training/dialogue-training?scenarioId=${level.id}`
    });
  },

  // 滚动到指定关卡
  scrollToLevel(levelId, callback) {
    const query = wx.createSelectorQuery();
    query.select(`#level-${levelId}`).boundingClientRect();
    query.selectViewport().scrollOffset();
    query.exec((res) => {
      if (res[0]) {
        const offsetTop = res[0].top + res[1].scrollTop;
        // 滚动到关卡位置，留出一些顶部空间
        wx.pageScrollTo({
          scrollTop: Math.max(0, offsetTop - 200),
          duration: 300,
          success: () => {
            // 滚动完成后执行回调
            if (callback) {
              setTimeout(callback, 100);
            }
          }
        });
      } else if (callback) {
        // 如果查询失败，直接执行回调
        callback();
      }
    });
  },

  // 滚动到第一个可用关卡
  scrollToFirstAvailableLevel() {
    const availableLevel = this.data.levels.find(level => level.status === 'available');
    if (availableLevel) {
      this.scrollToLevel(availableLevel.id);
    }
  },

  // 关闭弹窗
  onCloseModal() {
    this.setData({
      showLevelModal: false,
      selectedLevel: null
    });
  },

  // 阻止弹窗内容点击冒泡
  onModalContentTap() {
    // 空函数，阻止事件冒泡
  },

  // 分享
  onShareAppMessage() {
    return {
      title: '知愈 - 情绪表达训练',
      path: '/subpages/training/dialogue-training/dialogue-training-gamified',
      imageUrl: '/assets/images/share-training.png'
    };
  }
});
