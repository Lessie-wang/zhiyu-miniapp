// 感官写作 - 游戏化关卡设计
const GameSystem = require('../../../utils/game-system.js');

Page({
  data: {
    // 用户数据
    userLevel: 1,
    currentExp: 0,
    nextLevelExp: 100,
    expProgress: 0,
    completedLevels: 0,
    totalBadges: 0,
    streakDays: 0,
    unlockedBadges: 0,
    totalBadgesCount: 10,

    // 关卡数据
    levels: [
      {
        id: 1,
        number: 1,
        title: '感官觉醒',
        description: '学习用五感观察世界',
        fullDescription: '通过视觉、听觉、触觉、嗅觉、味觉五个维度，重新认识身边的事物。这是感官写作的第一步，也是最重要的基础。',
        objectives: [
          '理解五感的基本概念',
          '学会用五感描述一个物体',
          '完成3个感官观察练习'
        ],
        icon: '/assets/images/levels/sensory-1.png',
        status: 'available', // available, locked, completed
        isBoss: false,
        expReward: 50,
        badgeReward: null,
        unlockCondition: null
      },
      {
        id: 2,
        number: 2,
        title: '视觉捕捉',
        description: '用眼睛记录细节',
        fullDescription: '训练视觉观察能力，学会捕捉光影、色彩、形状、质感等视觉元素，用文字还原眼前的画面。',
        objectives: [
          '观察并描述3种不同的颜色',
          '捕捉光影变化的瞬间',
          '描述一个物体的质感'
        ],
        icon: '/assets/images/levels/sensory-2.png',
        status: 'locked',
        isBoss: false,
        expReward: 60,
        badgeReward: null,
        unlockCondition: 1
      },
      {
        id: 3,
        number: 3,
        title: '听觉探索',
        description: '倾听世界的声音',
        fullDescription: '训练听觉敏感度，学会区分不同的声音，用文字描述音色、音调、节奏、韵律。',
        objectives: [
          '识别并描述5种不同的声音',
          '捕捉环境中的背景音',
          '用文字表达声音的情绪'
        ],
        icon: '/assets/images/levels/sensory-3.png',
        status: 'locked',
        isBoss: false,
        expReward: 70,
        badgeReward: null,
        unlockCondition: 2
      },
      {
        id: 4,
        number: 4,
        title: '触觉体验',
        description: '用手感受质感',
        fullDescription: '训练触觉感知，学会区分温度、湿度、粗糙度、软硬度等触觉元素，用文字传递触感。',
        objectives: [
          '描述3种不同的材质',
          '感受温度的变化',
          '用触觉唤起情感记忆'
        ],
        icon: '/assets/images/levels/sensory-4.png',
        status: 'locked',
        isBoss: false,
        expReward: 80,
        badgeReward: null,
        unlockCondition: 3
      },
      {
        id: 5,
        number: 5,
        title: '五感融合',
        description: 'Boss关卡：综合运用五感',
        fullDescription: '这是第一个Boss关卡！综合运用视觉、听觉、触觉、嗅觉、味觉，完成一篇完整的感官写作作品。',
        objectives: [
          '在一篇文章中运用所有五感',
          '创造沉浸式的阅读体验',
          '获得导师的认可'
        ],
        icon: '/assets/images/levels/sensory-boss-1.png',
        status: 'locked',
        isBoss: true,
        expReward: 150,
        badgeReward: '五感大师',
        unlockCondition: 4
      },
      {
        id: 6,
        number: 6,
        title: '情绪色彩',
        description: '用感官表达情绪',
        fullDescription: '学习如何通过感官描写来传递情绪，让读者不仅看到、听到，更能感受到你的情感。',
        objectives: [
          '用颜色表达3种不同情绪',
          '用声音传递情感氛围',
          '创造情绪化的感官场景'
        ],
        icon: '/assets/images/levels/sensory-6.png',
        status: 'locked',
        isBoss: false,
        expReward: 90,
        badgeReward: null,
        unlockCondition: 5
      },
      {
        id: 7,
        number: 7,
        title: '记忆重现',
        description: '用感官唤醒记忆',
        fullDescription: '学习如何通过感官细节唤起读者的记忆，创造共鸣和代入感。',
        objectives: [
          '描写一个童年记忆场景',
          '用气味唤起情感记忆',
          '重现一个特殊时刻'
        ],
        icon: '/assets/images/levels/sensory-7.png',
        status: 'locked',
        isBoss: false,
        expReward: 100,
        badgeReward: null,
        unlockCondition: 6
      },
      {
        id: 8,
        number: 8,
        title: '场景构建',
        description: '创造立体的场景',
        fullDescription: '学习如何通过多层次的感官描写，构建一个立体、真实、可感的场景。',
        objectives: [
          '构建一个完整的场景',
          '运用多层次感官描写',
          '创造空间感和纵深感'
        ],
        icon: '/assets/images/levels/sensory-8.png',
        status: 'locked',
        isBoss: false,
        expReward: 110,
        badgeReward: null,
        unlockCondition: 7
      },
      {
        id: 9,
        number: 9,
        title: '意象创造',
        description: '用感官创造意象',
        fullDescription: '学习如何通过感官描写创造独特的意象，让文字具有诗意和美感。',
        objectives: [
          '创造3个独特的感官意象',
          '运用通感手法',
          '让文字具有画面感'
        ],
        icon: '/assets/images/levels/sensory-9.png',
        status: 'locked',
        isBoss: false,
        expReward: 120,
        badgeReward: null,
        unlockCondition: 8
      },
      {
        id: 10,
        number: 10,
        title: '感官大师',
        description: 'Boss关卡：成为感官写作大师',
        fullDescription: '最终Boss关卡！创作一篇完整的感官写作作品，展现你对感官写作的全面掌握。',
        objectives: [
          '创作一篇1000字以上的作品',
          '综合运用所有学到的技巧',
          '获得专业导师的高度评价',
          '解锁"感官大师"称号'
        ],
        icon: '/assets/images/levels/sensory-boss-2.png',
        status: 'locked',
        isBoss: true,
        expReward: 200,
        badgeReward: '感官大师',
        unlockCondition: 9
      }
    ],

    // 徽章数据
    badges: [
      { id: 1, name: '感官探索者', icon: '🔍', unlocked: false },
      { id: 2, name: '视觉艺术家', icon: '👁️', unlocked: false },
      { id: 3, name: '听觉大师', icon: '👂', unlocked: false },
      { id: 4, name: '触觉专家', icon: '✋', unlocked: false },
      { id: 5, name: '五感大师', icon: '🌟', unlocked: false },
      { id: 6, name: '情绪画师', icon: '🎨', unlocked: false },
      { id: 7, name: '记忆守护者', icon: '💭', unlocked: false },
      { id: 8, name: '场景建筑师', icon: '🏛️', unlocked: false },
      { id: 9, name: '意象诗人', icon: '📝', unlocked: false },
      { id: 10, name: '感官大师', icon: '👑', unlocked: false }
    ],

    // 弹窗相关
    showLevelModal: false,
    selectedLevel: {},

    // 是否有可玩关卡
    hasAvailableLevel: true
  },

  onLoad() {
    // 初始化游戏系统
    this.gameSystem = new GameSystem.SensoryWritingGame();

    // 更新连续天数
    this.gameSystem.updateStreak();

    // 加载用户进度数据
    this.loadUserProgress();
  },

  // 加载用户进度
  loadUserProgress() {
    const stats = this.gameSystem.getStats();

    // 更新关卡状态
    this.updateLevelStatus();

    this.setData({
      userLevel: stats.level,
      currentExp: stats.exp,
      nextLevelExp: stats.nextLevelExp,
      expProgress: parseFloat(stats.expProgress),
      completedLevels: stats.completedLevelsCount,
      totalBadges: stats.unlockedBadgesCount,
      unlockedBadges: stats.unlockedBadgesCount,
      streakDays: stats.streakDays
    });
  },

  // 更新关卡状态
  updateLevelStatus() {
    const levels = this.data.levels.map((level, index) => {
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

    const hasAvailableLevel = levels.some(level => level.status === 'available');
    this.setData({ levels, badges, hasAvailableLevel });
  },

  // 点击关卡
  onLevelTap(e) {
    const level = e.currentTarget.dataset.level;

    if (level.status === 'locked') {
      wx.showToast({
        title: '请先完成前置关卡',
        icon: 'none'
      });
      return;
    }

    this.setData({
      selectedLevel: level,
      showLevelModal: true
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
        title: '完成相应关卡解锁',
        icon: 'none'
      });
    }
  },

  // 继续训练
  onContinueTap() {
    if (!this.data.hasAvailableLevel) {
      wx.showToast({
        title: '已完成所有关卡',
        icon: 'none'
      });
      return;
    }

    // 找到第一个可玩的关卡
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

    if (level.status !== 'available') {
      wx.showToast({
        title: '关卡暂未解锁',
        icon: 'none'
      });
      return;
    }

    // 关闭弹窗
    this.setData({ showLevelModal: false });

    // 跳转到感官写作训练页面（场景选择）
    wx.navigateTo({
      url: `/subpages/training/sensory-writing/sensory-writing`
    });
  },

  // 关闭弹窗
  onCloseModal() {
    this.setData({ showLevelModal: false });
  },

  // 阻止弹窗内容点击穿透
  onModalContentTap() {
    // 空函数，阻止事件冒泡
  },

  // 完成关卡（由关卡详情页调用）
  completeLevel(levelId, earnedExp) {
    // 更新用户数据
    const newExp = this.data.currentExp + earnedExp;
    const newLevel = Math.floor(newExp / this.data.nextLevelExp) + 1;

    // 检查是否升级
    if (newLevel > this.data.userLevel) {
      wx.showToast({
        title: `恭喜升级到 Lv.${newLevel}！`,
        icon: 'success'
      });
    }

    // 检查是否获得徽章
    const level = this.data.levels.find(l => l.id === levelId);
    if (level && level.badgeReward) {
      const badgeIndex = this.data.badges.findIndex(b => b.name === level.badgeReward);
      if (badgeIndex !== -1) {
        const badges = [...this.data.badges];
        badges[badgeIndex].unlocked = true;
        this.setData({
          badges,
          unlockedBadges: this.data.unlockedBadges + 1,
          totalBadges: this.data.totalBadges + 1
        });

        wx.showToast({
          title: `获得徽章：${level.badgeReward}`,
          icon: 'success'
        });
      }
    }

    // 更新数据
    this.setData({
      userLevel: newLevel,
      currentExp: newExp,
      expProgress: (newExp / this.data.nextLevelExp) * 100,
      completedLevels: this.data.completedLevels + 1
    });

    // 更新关卡状态
    this.updateLevelStatus();

    // 保存到本地存储或云端
    this.saveUserProgress();
  },

  // 保存用户进度
  saveUserProgress() {
    const userData = {
      level: this.data.userLevel,
      exp: this.data.currentExp,
      completedLevels: this.data.levels.filter(l => l.status === 'completed').map(l => l.id),
      unlockedBadges: this.data.badges.filter(b => b.unlocked).map(b => b.id),
      streakDays: this.data.streakDays
    };

    // 保存到本地存储
    wx.setStorageSync('sensory_writing_progress', userData);

    // 如果使用云开发，也可以保存到云端
    // wx.cloud.callFunction({...})
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.loadUserProgress();
    this.updateLevelStatus();
    wx.stopPullDownRefresh();
  }
});
