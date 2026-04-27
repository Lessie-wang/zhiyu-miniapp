// pages/knowledge/knowledge.js
Page({
  data: {
    currentTab: 'all',
    categories: [
      { id: 'all', name: '全部', icon: '📚' },
      { id: 'period', name: '经期护理', icon: '🌸' },
      { id: 'pain', name: '痛经缓解', icon: '💊' },
      { id: 'emotion', name: '情绪调节', icon: '💝' },
      { id: 'diet', name: '饮食建议', icon: '🥗' },
      { id: 'exercise', name: '运动指导', icon: '🧘' }
    ],
    professionalKnowledge: [
      {
        id: 1,
        icon: '🌸',
        title: '经期护理的科学方法',
        source: '妇产科医学期刊',
        summary: '了解经期的生理变化，掌握正确的护理方法，包括卫生用品选择、清洁护理、饮食调理等专业建议...',
        readCount: 1234,
        category: 'period'
      },
      {
        id: 2,
        icon: '💊',
        title: '痛经的成因与缓解方法',
        source: '中华医学会',
        summary: '痛经分为原发性和继发性两种，本文详细介绍痛经的医学成因、诊断方法以及科学的缓解措施...',
        readCount: 2156,
        category: 'pain'
      },
      {
        id: 3,
        icon: '💝',
        title: '经期情绪波动的生理机制',
        source: '心理健康研究中心',
        summary: '激素水平变化如何影响情绪？了解经前综合征（PMS）的科学原理，学会识别和应对情绪变化...',
        readCount: 1876,
        category: 'emotion'
      },
      {
        id: 4,
        icon: '🥗',
        title: '经期饮食营养指南',
        source: '营养学会',
        summary: '经期应该补充哪些营养？哪些食物有助于缓解不适？专业营养师为你制定科学的饮食方案...',
        readCount: 1543,
        category: 'diet'
      }
    ],
    communityExperiences: [
      {
        id: 1,
        userName: '小雨',
        timeAgo: '2天前',
        isHelpful: true,
        title: '我的痛经缓解小妙招',
        content: '分享一下我这几年总结的经验：热敷真的很有用！我会在经期前一天就开始用暖宝宝，配合轻柔的腹部按摩。另外，红糖姜茶对我也很有效...',
        tags: ['痛经缓解', '热敷', '饮食调理'],
        likes: 328,
        comments: 45,
        favorites: 156,
        category: 'pain'
      },
      {
        id: 2,
        userName: '晴天',
        timeAgo: '5天前',
        isHelpful: true,
        title: '经期情绪管理的心得',
        content: '以前每次经期前都会莫名烦躁，后来学会了记录情绪日记。现在能提前预知情绪波动，会主动调整作息和活动安排，感觉好多了...',
        tags: ['情绪管理', '日记', '自我觉察'],
        likes: 267,
        comments: 38,
        favorites: 124,
        category: 'emotion'
      },
      {
        id: 3,
        userName: '月光',
        timeAgo: '1周前',
        isHelpful: false,
        title: '适合经期的轻运动推荐',
        content: '经期不是不能运动，而是要选对运动！我会做一些瑜伽和拉伸，特别是猫式、婴儿式这些温和的体式，既能缓解不适，又能保持活力...',
        tags: ['运动', '瑜伽', '拉伸'],
        likes: 189,
        comments: 23,
        favorites: 87,
        category: 'exercise'
      },
      {
        id: 4,
        userName: '星辰',
        timeAgo: '1周前',
        isHelpful: false,
        title: '经期护理用品的选择经验',
        content: '试过很多品牌后，我发现适合自己的才是最好的。分享一下我的选择标准：材质、吸收力、舒适度。另外，建议大家可以尝试不同类型...',
        tags: ['护理用品', '选择建议'],
        likes: 145,
        comments: 19,
        favorites: 62,
        category: 'period'
      }
    ]
  },

  onLoad(options) {
    // 如果有传入分类参数，切换到对应分类
    if (options.category) {
      this.setData({ currentTab: options.category });
      this.filterContent(options.category);
    }
  },

  // 切换分类标签
  switchTab(e) {
    const tabId = e.currentTarget.dataset.id;
    this.setData({ currentTab: tabId });
    this.filterContent(tabId);
  },

  // 筛选内容
  filterContent(category) {
    // 这里可以根据分类筛选内容
    // 实际应用中可能需要重新请求数据
    if (category === 'all') {
      // 显示全部内容
      return;
    }

    // 筛选对应分类的内容
    // 这里只是示例，实际应该从服务器获取
    wx.showToast({
      title: '加载中...',
      icon: 'loading',
      duration: 500
    });
  },

  // 查看知识详情
  viewKnowledgeDetail(e) {
    const item = e.currentTarget.dataset.item;
    wx.showModal({
      title: item.title,
      content: `${item.summary}\n\n来源：${item.source}\n\n这是一个示例，实际应用中会跳转到详情页面。`,
      confirmText: '我知道了',
      showCancel: false
    });

    // 实际应用中应该跳转到详情页
    // wx.navigateTo({
    //   url: `/pages/knowledge-detail/knowledge-detail?id=${item.id}`
    // });
  },

  // 查看经验详情
  viewExperienceDetail(e) {
    const item = e.currentTarget.dataset.item;
    wx.showModal({
      title: item.title,
      content: `${item.content}\n\n作者：${item.userName}\n发布时间：${item.timeAgo}\n\n这是一个示例，实际应用中会跳转到详情页面。`,
      confirmText: '我知道了',
      showCancel: false
    });

    // 实际应用中应该跳转到详情页
    // wx.navigateTo({
    //   url: `/pages/experience-detail/experience-detail?id=${item.id}`
    // });
  },

  // 分享经验
  shareExperience() {
    wx.showModal({
      title: '分享你的经验',
      content: '你的经验可能会帮助到其他人。是否要创建一篇分享？',
      confirmText: '开始写作',
      success: (res) => {
        if (res.confirm) {
          // 跳转到发布页面
          wx.showToast({
            title: '功能开发中',
            icon: 'none'
          });

          // 实际应用中应该跳转到发布页
          // wx.navigateTo({
          //   url: '/pages/publish-experience/publish-experience'
          // });
        }
      }
    });
  }
});
