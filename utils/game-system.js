/**
 * 游戏化系统工具类
 * 用于表达训练和感官写作的进度管理、等级计算、徽章解锁
 */

class GameSystem {
  constructor(storageKey) {
    this.storageKey = storageKey;
    this.data = this.loadProgress();
  }

  /**
   * 加载用户进度
   */
  loadProgress() {
    try {
      const data = wx.getStorageSync(this.storageKey);
      return data || this.getDefaultData();
    } catch (e) {
      console.error('加载进度失败:', e);
      return this.getDefaultData();
    }
  }

  /**
   * 获取默认数据
   */
  getDefaultData() {
    return {
      level: 1,
      exp: 0,
      totalExp: 0,
      completedLevels: [],
      unlockedBadges: [],
      streakDays: 0,
      lastPlayDate: null,
      totalPlayTime: 0,
      bestScore: 0,
      combo: 0,
      achievements: []
    };
  }

  /**
   * 保存进度
   */
  saveProgress() {
    try {
      wx.setStorageSync(this.storageKey, this.data);
      return true;
    } catch (e) {
      console.error('保存进度失败:', e);
      return false;
    }
  }

  /**
   * 计算升级所需经验值
   * 使用指数增长公式：baseExp * (level ^ 1.5)
   */
  getExpForLevel(level) {
    const baseExp = 100;
    return Math.floor(baseExp * Math.pow(level, 1.5));
  }

  /**
   * 获取当前等级所需经验值
   */
  getCurrentLevelExp() {
    return this.getExpForLevel(this.data.level);
  }

  /**
   * 获取下一等级所需经验值
   */
  getNextLevelExp() {
    return this.getExpForLevel(this.data.level + 1);
  }

  /**
   * 添加经验值
   * @param {number} exp - 经验值
   * @returns {object} - { leveledUp: boolean, newLevel: number, overflow: number }
   */
  addExp(exp) {
    this.data.exp += exp;
    this.data.totalExp += exp;

    const result = {
      leveledUp: false,
      newLevel: this.data.level,
      overflow: 0
    };

    // 检查是否升级
    const nextLevelExp = this.getNextLevelExp();
    if (this.data.exp >= nextLevelExp) {
      result.leveledUp = true;
      result.overflow = this.data.exp - nextLevelExp;
      this.data.level += 1;
      this.data.exp = result.overflow;
      result.newLevel = this.data.level;

      // 触发升级音效和动画
      this.triggerLevelUpEffect();
    }

    this.saveProgress();
    return result;
  }

  /**
   * 完成关卡
   * @param {number} levelId - 关卡ID
   * @param {number} score - 得分
   * @param {number} stars - 星级 (1-3)
   */
  completeLevel(levelId, score = 0, stars = 3) {
    // 检查是否已完成
    const existingLevel = this.data.completedLevels.find(l => l.id === levelId);

    if (existingLevel) {
      // 更新最佳成绩
      if (score > existingLevel.score) {
        existingLevel.score = score;
        existingLevel.stars = stars;
        existingLevel.completedAt = Date.now();
      }
    } else {
      // 新完成的关卡
      this.data.completedLevels.push({
        id: levelId,
        score: score,
        stars: stars,
        completedAt: Date.now()
      });
    }

    // 更新最佳分数
    if (score > this.data.bestScore) {
      this.data.bestScore = score;
    }

    this.saveProgress();
    return true;
  }

  /**
   * 解锁徽章
   * @param {string} badgeId - 徽章ID
   */
  unlockBadge(badgeId) {
    if (!this.data.unlockedBadges.includes(badgeId)) {
      this.data.unlockedBadges.push(badgeId);
      this.saveProgress();

      // 触发徽章解锁动画
      this.triggerBadgeUnlockEffect(badgeId);
      return true;
    }
    return false;
  }

  /**
   * 检查关卡是否已完成
   */
  isLevelCompleted(levelId) {
    return this.data.completedLevels.some(l => l.id === levelId);
  }

  /**
   * 检查徽章是否已解锁
   */
  isBadgeUnlocked(badgeId) {
    return this.data.unlockedBadges.includes(badgeId);
  }

  /**
   * 更新连续天数
   */
  updateStreak() {
    const today = new Date().toDateString();
    const lastPlay = this.data.lastPlayDate ? new Date(this.data.lastPlayDate).toDateString() : null;

    if (lastPlay === today) {
      // 今天已经玩过了
      return this.data.streakDays;
    }

    const yesterday = new Date(Date.now() - 86400000).toDateString();

    if (lastPlay === yesterday) {
      // 连续登录
      this.data.streakDays += 1;
    } else if (lastPlay !== today) {
      // 中断了，重置为1
      this.data.streakDays = 1;
    }

    this.data.lastPlayDate = Date.now();
    this.saveProgress();

    // 检查连续登录成就
    this.checkStreakAchievements();

    return this.data.streakDays;
  }

  /**
   * 检查连续登录成就
   */
  checkStreakAchievements() {
    const streakMilestones = [3, 7, 14, 30, 100];

    streakMilestones.forEach(milestone => {
      if (this.data.streakDays === milestone) {
        const badgeId = `streak_${milestone}`;
        this.unlockBadge(badgeId);

        wx.showToast({
          title: `连续${milestone}天！`,
          icon: 'success'
        });
      }
    });
  }

  /**
   * 获取关卡星级
   */
  getLevelStars(levelId) {
    const level = this.data.completedLevels.find(l => l.id === levelId);
    return level ? level.stars : 0;
  }

  /**
   * 获取关卡得分
   */
  getLevelScore(levelId) {
    const level = this.data.completedLevels.find(l => l.id === levelId);
    return level ? level.score : 0;
  }

  /**
   * 触发升级特效
   */
  triggerLevelUpEffect() {
    // 震动反馈
    wx.vibrateShort({ type: 'heavy' });

    // 显示升级提示
    wx.showToast({
      title: `升级到 Lv.${this.data.level}！`,
      icon: 'success',
      duration: 2000
    });
  }

  /**
   * 触发徽章解锁特效
   */
  triggerBadgeUnlockEffect(badgeId) {
    // 震动反馈
    wx.vibrateShort({ type: 'medium' });

    // 显示徽章解锁提示
    wx.showToast({
      title: '获得新徽章！',
      icon: 'success',
      duration: 2000
    });
  }

  /**
   * 获取统计数据
   */
  getStats() {
    return {
      level: this.data.level,
      exp: this.data.exp,
      totalExp: this.data.totalExp,
      nextLevelExp: this.getNextLevelExp(),
      expProgress: (this.data.exp / this.getNextLevelExp() * 100).toFixed(1),
      completedLevelsCount: this.data.completedLevels.length,
      unlockedBadgesCount: this.data.unlockedBadges.length,
      streakDays: this.data.streakDays,
      bestScore: this.data.bestScore,
      totalStars: this.data.completedLevels.reduce((sum, l) => sum + l.stars, 0)
    };
  }

  /**
   * 重置进度（慎用）
   */
  resetProgress() {
    this.data = this.getDefaultData();
    this.saveProgress();
  }
}

/**
 * 表达训练游戏系统
 */
class DialogueTrainingGame extends GameSystem {
  constructor() {
    super('dialogue_training_progress');
  }

  /**
   * 检查并解锁特定徽章
   */
  checkAchievements() {
    const stats = this.getStats();

    // 完成所有关卡
    if (stats.completedLevelsCount >= 8) {
      this.unlockBadge('all_levels_completed');
    }

    // 获得所有三星
    if (stats.totalStars >= 24) {
      this.unlockBadge('perfect_master');
    }

    // 达到10级
    if (stats.level >= 10) {
      this.unlockBadge('level_10');
    }
  }
}

/**
 * 感官写作游戏系统
 */
class SensoryWritingGame extends GameSystem {
  constructor() {
    super('sensory_writing_progress');
  }

  /**
   * 检查并解锁特定徽章
   */
  checkAchievements() {
    const stats = this.getStats();

    // 完成所有关卡
    if (stats.completedLevelsCount >= 10) {
      this.unlockBadge('sensory_master');
    }

    // 获得所有三星
    if (stats.totalStars >= 30) {
      this.unlockBadge('perfect_sensory');
    }

    // 达到15级
    if (stats.level >= 15) {
      this.unlockBadge('sensory_legend');
    }
  }
}

// 导出
module.exports = {
  GameSystem,
  DialogueTrainingGame,
  SensoryWritingGame
};
