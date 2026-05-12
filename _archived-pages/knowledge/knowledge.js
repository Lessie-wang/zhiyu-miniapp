// 知识库页面 - 整合情绪库的深度知识系统
// 设计理念：从"被动阅读"到"主动探索" + 知识付费可行性

// 知识库数据结构 - 增强版
const knowledgeDatabase = {
  // 情绪相关知识（与情绪库深度整合）
  emotionKnowledge: [
    {
      id: 'ek001',
      emotionTag: '焦虑', // 关联情绪库
      title: '焦虑的神经科学：大脑如何制造担忧',
      subtitle: '从杏仁核到前额叶的情绪调节之路',
      level: 'advanced', // basic, intermediate, advanced
      readTime: 8,
      isPremium: false, // 免费试读
      coverImage: '/assets/images/knowledge/anxiety-brain.png',
      author: {
        name: '李明博士',
        title: '北京大学心理与认知科学学院副教授',
        verified: true
      },
      summary: '焦虑不是你的错，而是大脑保护机制的"过度激活"。本文基于最新神经科学研究，解析焦虑的生理机制，并提供循证有效的应对方法。',
      content: {
        sections: [
          {
            title: '焦虑的大脑地图',
            content: '当你感到焦虑时，大脑中的杏仁核（amygdala）会率先激活，这是一个古老的"警报系统"。杏仁核会向下丘脑发送信号，触发"战或逃"反应：心跳加速、呼吸急促、肌肉紧张。\n\n同时，前额叶皮层（prefrontal cortex）——负责理性思考的区域——会尝试评估威胁的真实性。但在焦虑状态下，杏仁核的信号往往"压过"前额叶的理性判断。',
            references: ['LeDoux, J. (2015). Anxious: Using the Brain to Understand and Treat Fear and Anxiety. Viking.']
          },
          {
            title: '为什么有些人更容易焦虑？',
            content: '研究发现，焦虑倾向与以下因素相关：\n\n1. **遗传因素**：约30-40%的焦虑倾向可遗传\n2. **早期经历**：童年创伤或不安全依恋会重塑大脑的威胁检测系统\n3. **神经递质**：GABA（γ-氨基丁酸）水平较低的人更易焦虑\n4. **认知模式**：习惯性灾难化思维会强化焦虑回路',
            references: ['Hettema, J. M., et al. (2001). A review and meta-analysis of the genetic epidemiology of anxiety disorders. American Journal of Psychiatry, 158(10), 1568-1578.']
          },
          {
            title: '循证有效的焦虑管理方法',
            content: '**1. 认知行为疗法（CBT）**\n识别和挑战灾难化思维。研究显示，12-16次CBT疗程可使60-80%的焦虑症患者显著改善。\n\n**2. 正念冥想**\nfMRI研究发现，8周正念训练可增加前额叶皮层厚度，增强情绪调节能力。\n\n**3. 渐进性肌肉放松（PMR）**\n通过放松身体来"欺骗"大脑，降低交感神经系统的激活。\n\n**4. 暴露疗法**\n在安全环境中逐步面对恐惧，重新训练杏仁核的威胁评估系统。',
            references: [
              'Hofmann, S. G., et al. (2012). The efficacy of cognitive behavioral therapy: A review of meta-analyses. Cognitive Therapy and Research, 36(5), 427-440.',
              'Hölzel, B. K., et al. (2011). Mindfulness practice leads to increases in regional brain gray matter density. Psychiatry Research: Neuroimaging, 191(1), 36-43.'
            ]
          }
        ],
        practiceExercise: {
          title: '5-4-3-2-1接地技巧',
          description: '当焦虑来袭时，用这个方法把注意力从担忧拉回当下：',
          steps: [
            '说出5样你能看到的东西',
            '说出4样你能触摸到的东西',
            '说出3样你能听到的声音',
            '说出2样你能闻到的气味',
            '说出1样你能尝到的味道'
          ],
          evidence: '这个技巧基于"接地"（grounding）原理，通过激活感官系统来中断焦虑的认知循环。'
        }
      },
      relatedEmotions: ['焦虑', '紧张', '恐慌'],
      relatedArticles: ['ek002', 'ek005'],
      tags: ['神经科学', '认知行为疗法', '正念', '循证心理学'],
      likes: 1247,
      collections: 856,
      comments: 234,
      publishDate: '2026-04-15',
      lastUpdate: '2026-04-28'
    },
    {
      id: 'ek002',
      emotionTag: '难过',
      title: '悲伤的意义：为什么我们需要哭泣',
      subtitle: '眼泪中的生物化学与心理治愈',
      level: 'intermediate',
      readTime: 6,
      isPremium: false,
      coverImage: '/assets/images/knowledge/sadness-tears.png',
      author: {
        name: '陈晓雯',
        title: '中科院心理研究所研究员',
        verified: true
      },
      summary: '哭泣不是软弱，而是大脑的自我修复机制。最新研究发现，眼泪中含有压力激素和天然止痛物质，哭泣后你会感觉更好是有科学依据的。',
      content: {
        sections: [
          {
            title: '眼泪的三种类型',
            content: '人类的眼泪分为三种：\n\n1. **基础泪液**：持续分泌，保持眼睛湿润\n2. **反射性泪液**：受到刺激（如洋葱、灰尘）时产生\n3. **情绪性泪液**：由情绪引发，含有独特的生化成分\n\n情绪性泪液中含有：\n- 皮质醇（压力激素）\n- 脑啡肽（天然止痛剂）\n- 催乳素（与情绪调节相关）\n\n哭泣是身体排出压力激素的方式之一。',
            references: ['Frey, W. H. (1985). Crying: The Mystery of Tears. Winston Press.']
          },
          {
            title: '悲伤的进化意义',
            content: '从进化心理学角度看，悲伤具有重要的适应功能：\n\n**1. 社会信号**：眼泪和悲伤表情向他人传递"我需要帮助"的信号，促进社会支持\n\n**2. 行为调整**：悲伤让我们放慢节奏，反思失去的意义，调整未来的行为策略\n\n**3. 情感处理**：悲伤是心理"消化"失去的过程，压抑悲伤会延长痛苦\n\n**4. 价值确认**：我们为重要的人和事悲伤，悲伤的深度反映了价值的重要性',
            references: ['Keltner, D., & Kring, A. M. (1998). Emotion, social function, and psychopathology. Review of General Psychology, 2(3), 320-342.']
          },
          {
            title: '健康的悲伤 vs 病理性抑郁',
            content: '如何区分正常的悲伤和需要专业帮助的抑郁？\n\n**健康的悲伤**：\n- 与具体事件相关\n- 强度随时间逐渐减弱\n- 仍能体验到其他情绪（如温暖、感激）\n- 不影响基本的自我价值感\n\n**病理性抑郁**：\n- 持续超过2周，无明显诱因\n- 对所有事物失去兴趣\n- 伴随强烈的无价值感或自杀念头\n- 严重影响日常功能\n\n如果你的悲伤符合后者，请寻求专业心理咨询或精神科医生的帮助。',
            references: ['American Psychiatric Association. (2013). Diagnostic and Statistical Manual of Mental Disorders (5th ed.).']
          }
        ],
        practiceExercise: {
          title: '悲伤日记',
          description: '给自己的悲伤一个空间：',
          steps: [
            '找一个安静的时间，写下"我现在感到悲伤，因为..."',
            '不要评判或试图"修正"这份悲伤，只是描述它',
            '写下这份悲伤告诉你什么是重要的',
            '如果想哭，就让眼泪流下来',
            '写完后，做一件温柔的自我关怀行为（如泡杯茶、听首歌）'
          ],
          evidence: '表达性写作（expressive writing）被证实能改善情绪和身体健康。Pennebaker的研究发现，连续4天每天写作15-20分钟，可显著降低抑郁和焦虑水平。'
        }
      },
      relatedEmotions: ['难过', '悲伤', '失落'],
      relatedArticles: ['ek001', 'ek007'],
      tags: ['情绪科学', '进化心理学', '表达性写作', '心理健康'],
      likes: 2134,
      collections: 1523,
      comments: 456,
      publishDate: '2026-04-10',
      lastUpdate: '2026-04-25'
    }
  ],

  // 心理学理论知识（深度内容，适合付费）
  psychologyTheory: [
    {
      id: 'pt001',
      title: '依恋理论完全指南：从婴儿期到成人关系',
      subtitle: '鲍尔比、安斯沃斯到现代依恋研究的70年',
      level: 'advanced',
      readTime: 25,
      isPremium: true, // 付费内容
      price: 9.9,
      coverImage: '/assets/images/knowledge/attachment-theory.png',
      author: {
        name: '王芳教授',
        title: '清华大学社会科学学院心理学系教授',
        verified: true,
        credentials: '国际依恋研究学会会员'
      },
      summary: '这是一份系统的依恋理论学习资料，涵盖理论起源、实证研究、临床应用和自我成长路径。适合心理学爱好者、咨询师和希望改善亲密关系的人。',
      tableOfContents: [
        '第一章：依恋理论的诞生（鲍尔比的战争孤儿研究）',
        '第二章：陌生情境实验（安斯沃斯的开创性研究）',
        '第三章：四种依恋风格的神经生物学基础',
        '第四章：成人依恋访谈（AAI）与测量方法',
        '第五章：依恋创伤的代际传递',
        '第六章：如何从不安全依恋走向安全依恋',
        '第七章：依恋理论在心理治疗中的应用',
        '附录：依恋风格自测量表（含解读）'
      ],
      preview: '前两章免费试读',
      relatedEmotions: ['焦虑', '困惑', '感动'],
      tags: ['依恋理论', '亲密关系', '心理治疗', '发展心理学'],
      purchaseCount: 3421,
      rating: 4.9,
      reviews: 287
    },
    {
      id: 'pt002',
      title: '认知行为疗法（CBT）实操手册',
      subtitle: '从理论到实践的完整工作簿',
      level: 'advanced',
      readTime: 30,
      isPremium: true,
      price: 12.9,
      coverImage: '/assets/images/knowledge/cbt-workbook.png',
      author: {
        name: '张伟',
        title: '注册心理咨询师（国家二级）',
        verified: true,
        credentials: 'CBT认证治疗师'
      },
      summary: '这不是一本理论书，而是一本可以跟着做的工作簿。包含20+个CBT练习，帮助你识别和改变负面思维模式。',
      tableOfContents: [
        '模块1：认知模型基础',
        '模块2：识别自动化思维',
        '模块3：挑战认知扭曲',
        '模块4：行为激活技术',
        '模块5：暴露疗法原理与实践',
        '模块6：问题解决训练',
        '模块7：预防复发策略',
        '附录：21天CBT自助计划'
      ],
      preview: '模块1免费试读',
      relatedEmotions: ['焦虑', '难过', '烦躁'],
      tags: ['认知行为疗法', '自助心理学', '抑郁', '焦虑'],
      purchaseCount: 5234,
      rating: 4.8,
      reviews: 412
    }
  ],

  // 实用技能（免费+进阶付费）
  practicalSkills: [
    {
      id: 'ps001',
      title: '非暴力沟通：21天实践计划',
      subtitle: '从理论到日常对话的转化',
      level: 'intermediate',
      readTime: 15,
      isPremium: false,
      coverImage: '/assets/images/knowledge/nvc-practice.png',
      author: {
        name: '刘静',
        title: 'NVC认证培训师',
        verified: true
      },
      summary: '马歇尔·卢森堡的非暴力沟通理论很美好，但如何用在真实生活中？这份21天计划提供每日练习和场景示例。',
      content: {
        weeklyPlan: [
          {
            week: 1,
            theme: '观察 vs 评判',
            dailyExercises: [
              '第1天：记录一天中的5个评判性语言',
              '第2天：将评判转化为观察',
              '第3天：练习描述事实而非解读',
              // ... 更多练习
            ]
          },
          {
            week: 2,
            theme: '感受 vs 想法',
            dailyExercises: [
              '第8天：情绪词汇扩展练习',
              '第9天：区分"我感到"和"我觉得"',
              // ... 更多练习
            ]
          },
          {
            week: 3,
            theme: '需要与请求',
            dailyExercises: [
              '第15天：识别未被满足的需要',
              '第16天：提出具体可行的请求',
              // ... 更多练习
            ]
          }
        ]
      },
      relatedEmotions: ['愤怒', '委屈', '困惑'],
      tags: ['沟通技巧', '人际关系', '非暴力沟通'],
      likes: 3421,
      collections: 2134,
      hasAdvancedVersion: true,
      advancedVersionId: 'ps001-pro'
    }
  ],

  // 用户个性化推荐数据
  userProgress: {
    readArticles: [],
    collectedArticles: [],
    purchasedArticles: [],
    emotionHistory: [], // 从情绪库同步
    recommendedArticles: []
  }
};

Page({
  data: {
    // 当前视图模式
    viewMode: 'integrated', // 'integrated' | 'emotion-based' | 'theory' | 'skills'

    // 顶部导航
    navTabs: [
      { id: 'for-you', name: '为你推荐', icon: '✨' },
      { id: 'emotion', name: '情绪相关', icon: '💭' },
      { id: 'theory', name: '深度理论', icon: '📚' },
      { id: 'skills', name: '实用技能', icon: '🛠️' }
    ],
    activeNav: 'for-you',

    // 个性化推荐区
    personalizedSection: {
      title: '基于你的情绪，我们推荐',
      subtitle: '最近你记录了"焦虑"和"疲惫"',
      articles: []
    },

    // 情绪关联知识
    emotionKnowledge: [],

    // 深度理论（付费内容）
    theoryArticles: [],

    // 实用技能
    skillArticles: [],

    // 搜索相关
    searchQuery: '',
    searchHistory: [],
    searchSuggestions: [],
    isSearching: false,

    // 筛选器
    filters: {
      level: 'all', // all, basic, intermediate, advanced
      isPremium: 'all', // all, free, premium
      emotion: 'all',
      sortBy: 'recommended' // recommended, latest, popular
    },

    // 用户学习进度
    userStats: {
      readCount: 0,
      readTime: 0, // 分钟
      collectionCount: 0,
      currentStreak: 0, // 连续学习天数
      totalStreak: 0
    },

    // 知识付费相关
    showPremiumModal: false,
    selectedPremiumArticle: null
  },

  onLoad: function(options) {
    // 加载用户数据
    this.loadUserData();

    // 加载知识库数据
    this.loadKnowledgeData();

    // 从情绪库同步用户情绪历史
    this.syncEmotionHistory();

    // 生成个性化推荐
    this.generateRecommendations();
  },

  // 加载用户数据
  loadUserData: function() {
    const userProgress = wx.getStorageSync('knowledgeProgress') || {
      readArticles: [],
      readTime: 0,
      collectedArticles: [],
      purchasedArticles: [],
      currentStreak: 0,
      totalStreak: 0
    };

    this.setData({
      'userStats.readCount': userProgress.readArticles.length,
      'userStats.readTime': userProgress.readTime,
      'userStats.collectionCount': userProgress.collectedArticles.length,
      'userStats.currentStreak': userProgress.currentStreak,
      'userStats.totalStreak': userProgress.totalStreak
    });
  },

  // 加载知识库数据
  loadKnowledgeData: function() {
    this.setData({
      emotionKnowledge: knowledgeDatabase.emotionKnowledge,
      theoryArticles: knowledgeDatabase.psychologyTheory,
      skillArticles: knowledgeDatabase.practicalSkills
    });
  },

  // 从情绪库同步情绪历史
  syncEmotionHistory: function() {
    const emotionHistory = wx.getStorageSync('emotionHistory') || [];

    // 分析最近7天的情绪
    const recentEmotions = emotionHistory.slice(-7);
    const emotionCounts = {};

    recentEmotions.forEach(record => {
      emotionCounts[record.emotion] = (emotionCounts[record.emotion] || 0) + 1;
    });

    // 找出最频繁的情绪
    const topEmotions = Object.entries(emotionCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([emotion]) => emotion);

    this.setData({
      'personalizedSection.subtitle': topEmotions.length > 0
        ? `最近你记录了"${topEmotions.join('"、"')}"`
        : '开始记录情绪，获取个性化推荐'
    });

    return topEmotions;
  },

  // 生成个性化推荐
  generateRecommendations: function() {
    const topEmotions = this.syncEmotionHistory();
    const allArticles = [
      ...this.data.emotionKnowledge,
      ...this.data.theoryArticles,
      ...this.data.skillArticles
    ];

    // 基于情绪匹配推荐
    const recommended = allArticles
      .filter(article => {
        if (!article.relatedEmotions) return false;
        return article.relatedEmotions.some(emotion =>
          topEmotions.includes(emotion)
        );
      })
      .slice(0, 5);

    // 如果没有情绪历史，推荐热门文章
    if (recommended.length === 0) {
      recommended.push(...allArticles.slice(0, 5));
    }

    this.setData({
      'personalizedSection.articles': recommended
    });
  },

  // 切换导航标签
  switchNav: function(e) {
    const navId = e.currentTarget.dataset.id;
    this.setData({ activeNav: navId });
    wx.vibrateShort({ type: 'light' });
  },

  // 查看文章详情
  viewArticle: function(e) {
    const article = e.currentTarget.dataset.article;

    // 如果是付费内容且未购买
    if (article.isPremium && !this.isPurchased(article.id)) {
      this.showPremiumPreview(article);
      return;
    }

    // 跳转到文章详情页
    wx.navigateTo({
      url: `/pages/knowledge-detail/knowledge-detail?id=${article.id}`
    });

    // 记录阅读
    this.recordReading(article.id);
  },

  // 检查是否已购买
  isPurchased: function(articleId) {
    const userProgress = wx.getStorageSync('knowledgeProgress') || {};
    return (userProgress.purchasedArticles || []).includes(articleId);
  },

  // 显示付费内容预览
  showPremiumPreview: function(article) {
    this.setData({
      showPremiumModal: true,
      selectedPremiumArticle: article
    });
  },

  // 购买付费内容
  purchaseArticle: function() {
    const article = this.data.selectedPremiumArticle;

    wx.showModal({
      title: '购买知识内容',
      content: `《${article.title}》\n价格：¥${article.price}\n\n购买后可永久阅读，支持作者创作更多优质内容。`,
      confirmText: '立即购买',
      success: (res) => {
        if (res.confirm) {
          // 调用支付接口
          this.processPayment(article);
        }
      }
    });
  },

  // 处理支付
  processPayment: function(article) {
    // 这里应该调用微信支付接口
    // 示例代码：
    wx.showLoading({ title: '处理中...' });

    setTimeout(() => {
      wx.hideLoading();

      // 保存购买记录
      const userProgress = wx.getStorageSync('knowledgeProgress') || {};
      userProgress.purchasedArticles = userProgress.purchasedArticles || [];
      userProgress.purchasedArticles.push(article.id);
      wx.setStorageSync('knowledgeProgress', userProgress);

      wx.showToast({
        title: '购买成功',
        icon: 'success'
      });

      this.setData({ showPremiumModal: false });

      // 跳转到文章详情
      wx.navigateTo({
        url: `/pages/knowledge-detail/knowledge-detail?id=${article.id}`
      });
    }, 1500);
  },

  // 关闭付费弹窗
  closePremiumModal: function() {
    this.setData({ showPremiumModal: false });
  },

  // 收藏文章
  toggleCollection: function(e) {
    const articleId = e.currentTarget.dataset.id;
    const userProgress = wx.getStorageSync('knowledgeProgress') || {};
    userProgress.collectedArticles = userProgress.collectedArticles || [];

    const index = userProgress.collectedArticles.indexOf(articleId);
    if (index > -1) {
      userProgress.collectedArticles.splice(index, 1);
      wx.showToast({ title: '已取消收藏', icon: 'none' });
    } else {
      userProgress.collectedArticles.push(articleId);
      wx.showToast({ title: '已收藏', icon: 'success' });
    }

    wx.setStorageSync('knowledgeProgress', userProgress);
    this.loadUserData();
  },

  // 记录阅读
  recordReading: function(articleId) {
    const userProgress = wx.getStorageSync('knowledgeProgress') || {};
    userProgress.readArticles = userProgress.readArticles || [];

    if (!userProgress.readArticles.includes(articleId)) {
      userProgress.readArticles.push(articleId);
      wx.setStorageSync('knowledgeProgress', userProgress);
    }
  },

  // 搜索功能
  onSearchInput: function(e) {
    const query = e.detail.value;
    this.setData({ searchQuery: query });

    if (query.length > 0) {
      this.generateSearchSuggestions(query);
    } else {
      this.setData({ searchSuggestions: [] });
    }
  },

  // 生成搜索建议
  generateSearchSuggestions: function(query) {
    const allArticles = [
      ...this.data.emotionKnowledge,
      ...this.data.theoryArticles,
      ...this.data.skillArticles
    ];

    const suggestions = allArticles
      .filter(article =>
        article.title.includes(query) ||
        article.tags.some(tag => tag.includes(query))
      )
      .slice(0, 5)
      .map(article => article.title);

    this.setData({ searchSuggestions: suggestions });
  },

  // 执行搜索
  performSearch: function() {
    const query = this.data.searchQuery;
    if (!query) return;

    // 保存搜索历史
    let searchHistory = wx.getStorageSync('searchHistory') || [];
    if (!searchHistory.includes(query)) {
      searchHistory.unshift(query);
      searchHistory = searchHistory.slice(0, 10);
      wx.setStorageSync('searchHistory', searchHistory);
    }

    // 执行搜索
    this.setData({ isSearching: true });

    // 这里应该调用搜索接口
    // 示例：显示搜索结果
    wx.showToast({
      title: '搜索功能开发中',
      icon: 'none'
    });
  },

  // 查看学习统计
  viewStats: function() {
    wx.navigateTo({
      url: '/pages/knowledge-stats/knowledge-stats'
    });
  }
});
