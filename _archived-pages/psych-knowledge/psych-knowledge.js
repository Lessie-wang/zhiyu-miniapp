Page({
  data: {
    // 用户最近情绪
    recentEmotions: [],

    // 当前展开的主题ID
    expandedTopic: null,

    // 用户进度
    userProgress: {
      readTopics: [],
      collectedTopics: []
    },

    // 知识分类
    categories: [
      {
        id: 'emotion-basics',
        name: '情绪基础',
        desc: '理解情绪的本质与运作机制',
        topics: [
          {
            id: 'emotion-granularity',
            title: '情绪颗粒度',
            subtitle: '为什么精确识别情绪如此重要',
            author: {
              name: '丽莎·费尔德曼·巴瑞特',
              title: '东北大学心理学教授'
            },
            isRead: false,
            isCollected: false,
            sections: [
              {
                type: 'concept',
                title: '什么是情绪颗粒度',
                content: '情绪颗粒度是指一个人区分和标记自己情绪体验的能力。高情绪颗粒度的人能够精确识别"焦虑"、"沮丧"、"失望"之间的细微差别，而低颗粒度的人可能只能笼统地说"我感觉不好"。'
              },
              {
                type: 'why',
                title: '为什么它很重要',
                content: '研究表明，情绪颗粒度高的人在压力情境下表现出更好的情绪调节能力。当你能准确命名情绪时，大脑的前额叶皮层会更有效地调节杏仁核的反应，从而减少情绪的强度和持续时间。'
              },
              {
                type: 'exercise',
                title: '如何提升',
                content: '每天记录情绪日记时，尝试使用更具体的词汇。不要只写"难过"，而是问自己：这是失望、悲伤、孤独，还是羞愧？使用情绪词汇表可以帮助你扩展情绪词汇库。'
              },
              {
                type: 'source',
                title: '研究来源',
                content: 'Barrett, L. F. (2017). How Emotions Are Made. 该理论基于神经科学和心理学的大量实证研究，已被多项fMRI研究验证。'
              }
            ]
          },
          {
            id: 'constructed-emotion',
            title: '情绪建构论',
            subtitle: '情绪不是被触发的，而是被创造的',
            author: {
              name: '丽莎·费尔德曼·巴瑞特',
              title: '东北大学心理学教授'
            },
            isRead: false,
            isCollected: false,
            sections: [
              {
                type: 'concept',
                title: '核心观点',
                content: '传统观点认为情绪是对外界刺激的自动反应，但建构论认为情绪是大脑基于过去经验、身体感觉和当前情境主动构建的。你的大脑不是在"发现"情绪，而是在"创造"情绪。'
              },
              {
                type: 'why',
                title: '这意味着什么',
                content: '如果情绪是被构建的，那么你就有能力改变它。通过改变对情境的解释、扩展情绪概念、调整身体状态，你可以影响大脑构建情绪的方式。这为情绪调节提供了全新的视角。'
              },
              {
                type: 'exercise',
                title: '实践方法',
                content: '当你感到强烈情绪时，尝试重新标记它。例如，将"焦虑"重新解释为"兴奋"——两者的身体感觉相似，但意义完全不同。这种重新标记可以改变大脑对情境的预测。'
              },
              {
                type: 'source',
                title: '研究来源',
                content: 'Barrett, L. F. (2017). The theory of constructed emotion. Social Cognitive and Affective Neuroscience, 12(1), 1-23.'
              }
            ]
          }
        ]
      },
      {
        id: 'cognitive-patterns',
        name: '认知模式',
        desc: '识别和改变思维陷阱',
        topics: [
          {
            id: 'cognitive-distortions',
            title: '认知扭曲',
            subtitle: '10种常见的思维陷阱',
            author: {
              name: '大卫·伯恩斯',
              title: '斯坦福大学精神病学教授'
            },
            isRead: false,
            isCollected: false,
            sections: [
              {
                type: 'concept',
                title: '什么是认知扭曲',
                content: '认知扭曲是指系统性的、不准确的思维模式，它们会扭曲现实，导致负面情绪。这些模式通常是自动的、无意识的，但一旦识别出来，就可以被改变。'
              },
              {
                type: 'list',
                title: '常见类型',
                items: [
                  {
                    name: '全或无思维',
                    desc: '将事物看成非黑即白，没有中间地带。',
                    example: '例如："如果我不能做到完美，那就是彻底失败。"'
                  },
                  {
                    name: '过度概括',
                    desc: '基于单一事件得出普遍性结论。',
                    example: '例如："我这次面试失败了，我永远找不到工作。"'
                  },
                  {
                    name: '心理过滤',
                    desc: '只关注负面细节，忽略积极方面。',
                    example: '例如：收到9条好评和1条差评，却只记得差评。'
                  },
                  {
                    name: '灾难化',
                    desc: '预期最坏的结果，夸大问题的严重性。',
                    example: '例如："如果我在演讲中出错，我的职业生涯就毁了。"'
                  },
                  {
                    name: '情绪推理',
                    desc: '认为自己的感受反映了客观现实。',
                    example: '例如："我感到无能，所以我一定很无能。"'
                  }
                ]
              },
              {
                type: 'exercise',
                title: '如何应对',
                content: '使用"思维记录表"：写下触发情境、自动思维、情绪强度，然后质疑这个想法（有什么证据？有其他解释吗？），最后写下更平衡的想法。'
              },
              {
                type: 'source',
                title: '研究来源',
                content: 'Burns, D. D. (1980). Feeling Good: The New Mood Therapy. 认知行为疗法（CBT）的核心技术，已被数百项随机对照试验证实有效。'
              }
            ]
          },
          {
            id: 'core-beliefs',
            title: '核心信念',
            subtitle: '深层的自我认知如何影响情绪',
            author: {
              name: '朱迪思·贝克',
              title: '贝克认知行为疗法研究所所长'
            },
            isRead: false,
            isCollected: false,
            sections: [
              {
                type: 'concept',
                title: '什么是核心信念',
                content: '核心信念是关于自我、他人和世界的深层、绝对化的观念，通常在童年形成。它们像镜头一样过滤我们对现实的感知，影响自动思维和情绪反应。'
              },
              {
                type: 'list',
                title: '常见的负性核心信念',
                items: [
                  {
                    name: '无助感',
                    desc: '认为自己无力改变处境。',
                    example: '例如："我无法掌控自己的生活。"'
                  },
                  {
                    name: '无价值感',
                    desc: '认为自己不值得被爱或尊重。',
                    example: '例如："我不够好，不值得拥有幸福。"'
                  },
                  {
                    name: '不可爱感',
                    desc: '认为自己注定被拒绝或抛弃。',
                    example: '例如："没有人会真正关心我。"'
                  }
                ]
              },
              {
                type: 'exercise',
                title: '如何识别',
                content: '使用"向下箭头技术"：从一个自动思维开始，不断追问"如果这是真的，那意味着什么？"直到触及核心信念。例如："我搞砸了这个项目"→"我不够能干"→"我是个失败者"。'
              },
              {
                type: 'source',
                title: '研究来源',
                content: 'Beck, J. S. (2011). Cognitive Behavior Therapy: Basics and Beyond. 核心信念理论是CBT的基础，已被广泛应用于抑郁、焦虑等心理问题的治疗。'
              }
            ]
          }
        ]
      },
      {
        id: 'relationship',
        name: '关系心理',
        desc: '理解人际互动的深层机制',
        topics: [
          {
            id: 'attachment-theory',
            title: '依恋理论',
            subtitle: '早期关系如何塑造成年后的情感模式',
            author: {
              name: '约翰·鲍尔比',
              title: '英国精神分析学家'
            },
            isRead: false,
            isCollected: false,
            sections: [
              {
                type: 'concept',
                title: '什么是依恋理论',
                content: '依恋理论认为，婴儿与主要照顾者的早期互动会形成"内部工作模型"，影响其一生的关系模式。这些模式包括对自我价值、他人可靠性和关系本质的核心信念。'
              },
              {
                type: 'list',
                title: '四种依恋类型',
                items: [
                  {
                    name: '安全型',
                    desc: '相信自己值得被爱，相信他人会回应自己的需求。',
                    example: '在关系中感到舒适，能够平衡亲密与独立。'
                  },
                  {
                    name: '焦虑型',
                    desc: '渴望亲密但担心被抛弃，需要持续的确认。',
                    example: '过度关注伴侣的反应，容易感到不安全。'
                  },
                  {
                    name: '回避型',
                    desc: '重视独立，不舒服于情感亲密。',
                    example: '在关系中保持距离，压抑情感需求。'
                  },
                  {
                    name: '混乱型',
                    desc: '既渴望又害怕亲密，行为矛盾。',
                    example: '在关系中表现出不可预测的反应。'
                  }
                ]
              },
              {
                type: 'why',
                title: '为什么它很重要',
                content: '理解自己的依恋类型可以帮助你识别关系中的自动反应模式。研究表明，依恋类型并非固定不变——通过觉察和有意识的练习，可以向更安全的依恋模式转变。'
              },
              {
                type: 'source',
                title: '研究来源',
                content: 'Bowlby, J. (1969). Attachment and Loss. 该理论已被数十年的纵向研究验证，是发展心理学和临床心理学的基石理论之一。'
              }
            ]
          },
          {
            id: 'nonviolent-communication',
            title: '非暴力沟通',
            subtitle: '用同理心化解冲突',
            author: {
              name: '马歇尔·卢森堡',
              title: '非暴力沟通中心创始人'
            },
            isRead: false,
            isCollected: false,
            sections: [
              {
                type: 'concept',
                title: '什么是非暴力沟通',
                content: '非暴力沟通（NVC）是一种沟通方式，强调观察而非评判、表达感受而非指责、识别需求而非要求、提出请求而非命令。它帮助我们在冲突中保持连接和同理心。'
              },
              {
                type: 'list',
                title: '四个步骤',
                items: [
                  {
                    name: '观察',
                    desc: '客观描述发生的事情，不加评判。',
                    example: '例如："你昨天晚上11点才回家"（而非"你总是这么晚回家"）。'
                  },
                  {
                    name: '感受',
                    desc: '表达这件事引发的情绪。',
                    example: '例如："我感到担心和孤独"（而非"你让我很生气"）。'
                  },
                  {
                    name: '需求',
                    desc: '识别感受背后的需求。',
                    example: '例如："因为我需要安全感和陪伴"（而非"因为你不在乎我"）。'
                  },
                  {
                    name: '请求',
                    desc: '提出具体、可行的请求。',
                    example: '例如："你能在晚上9点前告诉我你的计划吗？"（而非"你必须早点回家"）。'
                  }
                ]
              },
              {
                type: 'exercise',
                title: '实践方法',
                content: '下次发生冲突时，暂停并问自己：我观察到了什么？我感受到什么？我需要什么？我可以请求什么？将指责性语言转化为NVC语言需要练习，但会显著改善关系质量。'
              },
              {
                type: 'source',
                title: '研究来源',
                content: 'Rosenberg, M. B. (2003). Nonviolent Communication: A Language of Life. 该方法已被应用于家庭治疗、冲突调解、教育等多个领域。'
              }
            ]
          }
        ]
      }
    ]
  },

  onLoad: function() {
    this.loadUserProgress();
    this.syncEmotionHistory();
  },

  // 加载用户进度
  loadUserProgress: function() {
    var progress = wx.getStorageSync('knowledgeProgress') || {
      readTopics: [],
      collectedTopics: []
    };

    // 更新每个主题的阅读和收藏状态
    var categories = this.data.categories;
    for (var i = 0; i < categories.length; i++) {
      var topics = categories[i].topics;
      for (var j = 0; j < topics.length; j++) {
        var topic = topics[j];
        topic.isRead = progress.readTopics.indexOf(topic.id) !== -1;
        topic.isCollected = progress.collectedTopics.indexOf(topic.id) !== -1;
      }
    }

    this.setData({
      userProgress: progress,
      categories: categories
    });
  },

  // 从情绪库同步情绪历史
  syncEmotionHistory: function() {
    var emotionHistory = wx.getStorageSync('emotionHistory') || [];

    // 分析最近7天的情绪
    var recentEmotions = emotionHistory.slice(-7);
    var emotionCounts = {};

    for (var i = 0; i < recentEmotions.length; i++) {
      var record = recentEmotions[i];
      var emotion = record.emotion || record.name;
      emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
    }

    // 找出最频繁的情绪（前3个）
    var emotionEntries = [];
    for (var key in emotionCounts) {
      if (emotionCounts.hasOwnProperty(key)) {
        emotionEntries.push([key, emotionCounts[key]]);
      }
    }

    emotionEntries.sort(function(a, b) {
      return b[1] - a[1];
    });

    var topEmotions = [];
    for (var j = 0; j < Math.min(3, emotionEntries.length); j++) {
      topEmotions.push(emotionEntries[j][0]);
    }

    this.setData({
      recentEmotions: topEmotions
    });
  },

  // 点击主题卡片
  onTopicTap: function(e) {
    var topicId = e.currentTarget.dataset.topicId;

    // 切换展开/收起
    if (this.data.expandedTopic === topicId) {
      this.setData({ expandedTopic: null });
    } else {
      this.setData({ expandedTopic: topicId });

      // 标记为已读
      this.markAsRead(topicId);
    }
  },

  // 标记为已读
  markAsRead: function(topicId) {
    var progress = this.data.userProgress;
    if (progress.readTopics.indexOf(topicId) === -1) {
      progress.readTopics.push(topicId);
      wx.setStorageSync('knowledgeProgress', progress);

      // 更新UI
      var categories = this.data.categories;
      for (var i = 0; i < categories.length; i++) {
        var topics = categories[i].topics;
        for (var j = 0; j < topics.length; j++) {
          if (topics[j].id === topicId) {
            topics[j].isRead = true;
            break;
          }
        }
      }

      this.setData({
        userProgress: progress,
        categories: categories
      });
    }
  },

  // 切换收藏
  toggleCollect: function(e) {
    var topicId = e.currentTarget.dataset.topicId;
    var progress = this.data.userProgress;
    var index = progress.collectedTopics.indexOf(topicId);

    if (index === -1) {
      progress.collectedTopics.push(topicId);
      wx.showToast({ title: '已收藏', icon: 'success' });
    } else {
      progress.collectedTopics.splice(index, 1);
      wx.showToast({ title: '已取消收藏', icon: 'none' });
    }

    wx.setStorageSync('knowledgeProgress', progress);

    // 更新UI
    var categories = this.data.categories;
    for (var i = 0; i < categories.length; i++) {
      var topics = categories[i].topics;
      for (var j = 0; j < topics.length; j++) {
        if (topics[j].id === topicId) {
          topics[j].isCollected = index === -1;
          break;
        }
      }
    }

    this.setData({
      userProgress: progress,
      categories: categories
    });
  },

  // 跳转到聊天
  goToChat: function(e) {
    var topicId = e.currentTarget.dataset.topicId;

    // 找到主题标题
    var topicTitle = '';
    var categories = this.data.categories;
    for (var i = 0; i < categories.length; i++) {
      var topics = categories[i].topics;
      for (var j = 0; j < topics.length; j++) {
        if (topics[j].id === topicId) {
          topicTitle = topics[j].title;
          break;
        }
      }
    }

    wx.navigateTo({
      url: '/pages/chat/chat?topic=' + encodeURIComponent(topicTitle)
    });
  }
});
