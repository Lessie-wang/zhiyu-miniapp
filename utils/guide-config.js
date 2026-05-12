// 主页面引导步骤配置
export const mainPageGuideSteps = [
  {
    target: '.date-card',
    title: '欢迎来到知愈',
    icon: '👋',
    description: '这里是你的情绪日历，记录每一天的感受',
    actionHint: null,
    requireAction: false,
    cardPosition: 'bottom',
    padding: 15,
    borderRadius: '20rpx',
    showArrow: true
  },
  {
    target: '.emotion-grid .emotion-card:first-child',
    title: '选择你的情绪',
    icon: '😊',
    description: '轻触情绪卡片，选择此刻的感受。可以同时选择多个情绪哦',
    actionHint: '点击任意情绪卡片试试',
    requireAction: true,
    cardPosition: 'bottom',
    padding: 12,
    borderRadius: '16rpx',
    showArrow: true
  },
  {
    target: '.body-feeling-card',
    title: '身体感受',
    icon: '💭',
    description: '情绪常常伴随身体感觉，记录下来能帮你更好地理解自己',
    actionHint: null,
    requireAction: false,
    cardPosition: 'bottom',
    padding: 15,
    borderRadius: '20rpx',
    showArrow: true
  },
  {
    target: '.quick-note-section',
    title: '快速记录',
    icon: '✍️',
    description: '用文字记录今天的故事，不需要很长，几句话就好',
    actionHint: null,
    requireAction: false,
    cardPosition: 'top',
    padding: 15,
    borderRadius: '20rpx',
    showArrow: true
  },
  {
    target: '.action-row .action-btn:first-child',
    title: '保存记录',
    icon: '💾',
    description: '点击保存，你的情绪就会被温柔收藏。也可以选择继续对话，让小知陪你聊聊',
    actionHint: null,
    requireAction: false,
    cardPosition: 'top',
    padding: 12,
    borderRadius: '40rpx',
    showArrow: true
  }
];

// 聊天页面引导步骤
export const chatPageGuideSteps = [
  {
    target: '.ai-profile',
    title: '认识小知',
    icon: '🤖',
    description: '小知是你的情绪陪伴者，随时倾听你的感受',
    actionHint: null,
    requireAction: false,
    cardPosition: 'bottom',
    padding: 15,
    borderRadius: '20rpx',
    showArrow: true
  },
  {
    target: '.emotion-tags',
    title: '情绪标签',
    icon: '🏷️',
    description: '这里显示你刚才选择的情绪，小知会根据这些来理解你',
    actionHint: null,
    requireAction: false,
    cardPosition: 'bottom',
    padding: 12,
    borderRadius: '16rpx',
    showArrow: true
  },
  {
    target: '.input-area',
    title: '开始对话',
    icon: '💬',
    description: '在这里输入你想说的话，小知会认真倾听并回应你',
    actionHint: '试着输入一句话',
    requireAction: true,
    cardPosition: 'top',
    padding: 15,
    borderRadius: '24rpx',
    showArrow: true
  },
  {
    target: '.message-actions',
    title: '消息操作',
    icon: '⚙️',
    description: '长按消息可以复制、收藏或重新生成。你还可以编辑自己的消息',
    actionHint: null,
    requireAction: false,
    cardPosition: 'top',
    padding: 10,
    borderRadius: '12rpx',
    showArrow: true
  }
];

// 训练页面引导步骤
export const trainingPageGuideSteps = [
  {
    target: '.entry-card.dialogue-card',
    title: '模拟对话训练',
    icon: '🎭',
    description: '在真实场景中练习情绪表达，提升沟通能力',
    actionHint: '点击进入对话训练',
    requireAction: true,
    cardPosition: 'bottom',
    padding: 15,
    borderRadius: '20rpx',
    showArrow: true
  },
  {
    target: '.entry-card.writing-card',
    title: '感官写作训练',
    icon: '✨',
    description: '通过五感描述情绪，让表达更具体、更生动',
    actionHint: null,
    requireAction: false,
    cardPosition: 'bottom',
    padding: 15,
    borderRadius: '20rpx',
    showArrow: true
  }
];

// 历史页面引导步骤
export const historyPageGuideSteps = [
  {
    target: '.calendar-view',
    title: '情绪日历',
    icon: '📅',
    description: '查看你的情绪轨迹，发现情绪变化的规律',
    actionHint: null,
    requireAction: false,
    cardPosition: 'bottom',
    padding: 15,
    borderRadius: '20rpx',
    showArrow: true
  },
  {
    target: '.stats-card',
    title: '情绪统计',
    icon: '📊',
    description: '了解你最常出现的情绪，以及情绪的变化趋势',
    actionHint: null,
    requireAction: false,
    cardPosition: 'bottom',
    padding: 15,
    borderRadius: '20rpx',
    showArrow: true
  }
];

// 个人中心引导步骤
export const minePageGuideSteps = [
  {
    target: '.profile-card',
    title: '个人信息',
    icon: '👤',
    description: '点击可以修改头像、昵称和个人设置',
    actionHint: null,
    requireAction: false,
    cardPosition: 'bottom',
    padding: 15,
    borderRadius: '20rpx',
    showArrow: true
  },
  {
    target: '.menu-list',
    title: '更多功能',
    icon: '🎯',
    description: '这里有收藏的金句、隐私设置等更多功能',
    actionHint: null,
    requireAction: false,
    cardPosition: 'top',
    padding: 15,
    borderRadius: '20rpx',
    showArrow: true
  }
];

// 获取指定页面的引导步骤
export function getGuideSteps(pageName) {
  const guideMap = {
    'main': mainPageGuideSteps,
    'chat': chatPageGuideSteps,
    'training': trainingPageGuideSteps,
    'history': historyPageGuideSteps,
    'mine': minePageGuideSteps
  };

  return guideMap[pageName] || [];
}

// 检查是否需要显示引导
export function shouldShowGuide(pageName) {
  const key = `hasCompletedGuide_${pageName}`;
  return !wx.getStorageSync(key);
}

// 标记引导已完成
export function markGuideCompleted(pageName) {
  const key = `hasCompletedGuide_${pageName}`;
  wx.setStorageSync(key, true);
}

// 重置所有引导状态（用于测试或重新引导）
export function resetAllGuides() {
  const pages = ['main', 'chat', 'training', 'history', 'mine'];
  pages.forEach(page => {
    const key = `hasCompletedGuide_${page}`;
    wx.removeStorageSync(key);
  });
}
