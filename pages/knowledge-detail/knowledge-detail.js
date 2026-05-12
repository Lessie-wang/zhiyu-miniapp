// 知识详情页 - 深度阅读体验
Page({
  data: {
    article: null,
    articleId: '',

    // 阅读进度
    readProgress: 0,
    readStartTime: 0,

    // 是否已收藏
    isCollected: false,

    // 是否已购买（付费内容）
    isPurchased: false,

    // 相关文章推荐
    relatedArticles: [],

    // 评论区
    comments: [],
    showCommentInput: false,
    commentText: '',

    // 练习区域
    showPracticeModal: false,
    practiceCompleted: false
  },

  onLoad: function(options) {
    const articleId = options.id;
    this.setData({ articleId });

    // 加载文章内容
    this.loadArticle(articleId);

    // 检查是否已收藏
    this.checkCollection(articleId);

    // 检查是否已购买
    this.checkPurchase(articleId);

    // 加载相关文章
    this.loadRelatedArticles(articleId);

    // 记录阅读开始时间
    this.setData({ readStartTime: Date.now() });
  },

  onUnload: function() {
    // 保存阅读时长
    this.saveReadingTime();
  },

  onPageScroll: function(e) {
    // 计算阅读进度
    const scrollTop = e.scrollTop;
    const scrollHeight = this.data.scrollHeight || 1;
    const progress = Math.min(100, Math.floor((scrollTop / scrollHeight) * 100));

    this.setData({ readProgress: progress });
  },

  // 加载文章内容
  loadArticle: function(articleId) {
    // 这里应该从服务器或本地数据库加载
    // 示例：使用本地数据
    const knowledgeDatabase = require('./knowledge-database.js');
    const article = knowledgeDatabase.getArticleById(articleId);

    if (article) {
      this.setData({ article });

      // 获取页面高度用于计算阅读进度
      wx.createSelectorQuery()
        .select('.article-content')
        .boundingClientRect((rect) => {
          this.setData({ scrollHeight: rect.height });
        })
        .exec();
    } else {
      wx.showToast({
        title: '文章不存在',
        icon: 'none'
      });
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    }
  },

  // 检查是否已收藏
  checkCollection: function(articleId) {
    const userProgress = wx.getStorageSync('knowledgeProgress') || {};
    const collectedArticles = userProgress.collectedArticles || [];
    this.setData({ isCollected: collectedArticles.includes(articleId) });
  },

  // 检查是否已购买
  checkPurchase: function(articleId) {
    const userProgress = wx.getStorageSync('knowledgeProgress') || {};
    const purchasedArticles = userProgress.purchasedArticles || [];
    this.setData({ isPurchased: purchasedArticles.includes(articleId) });
  },

  // 加载相关文章
  loadRelatedArticles: function(articleId) {
    const knowledgeDatabase = require('./knowledge-database.js');
    const related = knowledgeDatabase.getRelatedArticles(articleId);
    this.setData({ relatedArticles: related });
  },

  // 切换收藏
  toggleCollection: function() {
    const articleId = this.data.articleId;
    const userProgress = wx.getStorageSync('knowledgeProgress') || {};
    userProgress.collectedArticles = userProgress.collectedArticles || [];

    const index = userProgress.collectedArticles.indexOf(articleId);
    if (index > -1) {
      userProgress.collectedArticles.splice(index, 1);
      this.setData({ isCollected: false });
      wx.showToast({ title: '已取消收藏', icon: 'none' });
    } else {
      userProgress.collectedArticles.push(articleId);
      this.setData({ isCollected: true });
      wx.showToast({ title: '已收藏', icon: 'success' });
    }

    wx.setStorageSync('knowledgeProgress', userProgress);
  },

  // 分享文章
  shareArticle: function() {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });
  },

  onShareAppMessage: function() {
    const article = this.data.article;
    return {
      title: article.title,
      path: `/pages/knowledge-detail/knowledge-detail?id=${article.id}`,
      imageUrl: article.coverImage
    };
  },

  // 打开练习弹窗
  openPractice: function() {
    this.setData({ showPracticeModal: true });
  },

  // 关闭练习弹窗
  closePractice: function() {
    this.setData({ showPracticeModal: false });
  },

  // 完成练习
  completePractice: function() {
    this.setData({
      practiceCompleted: true,
      showPracticeModal: false
    });

    wx.showToast({
      title: '练习已完成',
      icon: 'success'
    });

    // 保存练习记录
    this.savePracticeRecord();
  },

  // 保存练习记录
  savePracticeRecord: function() {
    const userProgress = wx.getStorageSync('knowledgeProgress') || {};
    userProgress.practiceRecords = userProgress.practiceRecords || [];

    userProgress.practiceRecords.push({
      articleId: this.data.articleId,
      completedAt: new Date().toISOString()
    });

    wx.setStorageSync('knowledgeProgress', userProgress);
  },

  // 保存阅读时长
  saveReadingTime: function() {
    const readTime = Math.floor((Date.now() - this.data.readStartTime) / 1000 / 60); // 分钟

    if (readTime > 0) {
      const userProgress = wx.getStorageSync('knowledgeProgress') || {};
      userProgress.readTime = (userProgress.readTime || 0) + readTime;
      userProgress.readArticles = userProgress.readArticles || [];

      if (!userProgress.readArticles.includes(this.data.articleId)) {
        userProgress.readArticles.push(this.data.articleId);
      }

      wx.setStorageSync('knowledgeProgress', userProgress);
    }
  },

  // 跳转到相关文章
  viewRelatedArticle: function(e) {
    const articleId = e.currentTarget.dataset.id;
    wx.redirectTo({
      url: `/pages/knowledge-detail/knowledge-detail?id=${articleId}`
    });
  },

  // 与小知聊聊这个话题
  chatWithXiaozhi: function() {
    const article = this.data.article;

    // 保存话题信息到临时存储
    wx.setStorageSync('tempKnowledgeTopic', {
      title: article.title,
      subtitle: article.subtitle,
      id: article.id
    });

    wx.navigateTo({
      url: '/pages/chat/chat'
    });
  }
});
