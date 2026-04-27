// 心理学知识库数据与逻辑

// 知识库内容（首批5个主题）
const knowledgeData = {
  categories: [
    {
      id: 'awareness',
      name: '认识情绪',
      desc: '从"不舒服"到"我知道这是什么"',
      color: '#B8D4E8',
      topics: [
        {
          id: 'granularity',
          title: '情绪颗粒度',
          subtitle: '为什么"不舒服"不够用',
          iconType: 'magnifier',
          isFree: true,
          sections: [
            {
              type: 'concept',
              title: '什么是情绪颗粒度？',
              content: '心理学家丽莎·费尔德曼·巴瑞特提出了"情绪颗粒度"（Emotional Granularity）的概念：它指的是一个人区分和描述不同情绪的精细程度。\n\n情绪颗粒度低的人倾向于用笼统的词描述感受："不舒服""烦""还行"。而情绪颗粒度高的人能区分"失望""委屈""不甘心""被忽视"之间的细微差别。'
            },
            {
              type: 'why',
              title: '为什么颗粒度很重要？',
              content: '研究表明，能精确命名情绪的人：\n\n- 情绪调节能力更强（因为你知道自己在应对什么）\n- 更少冲动行为（"我很愤怒"比"我不爽"更容易被理性处理）\n- 人际沟通更有效（"我感到被忽视"比"你烦死了"更容易得到回应）\n\n简单说：你越能说清楚自己怎么了，就越能照顾好自己。'
            },
            {
              type: 'exercise',
              title: '试一试',
              content: '下次你觉得"不舒服"的时候，试着问自己三个问题：\n\n1. 这个不舒服，更接近身体的还是心理的？\n2. 如果是心理的，它更像愤怒、悲伤、还是恐惧？\n3. 再精确一点——是"委屈"还是"失望"？是"紧张"还是"害怕"？\n\n不需要找到"正确答案"，尝试区分本身就是在训练你的情绪颗粒度。'
            },
            {
              type: 'source',
              title: '延伸阅读',
              content: '丽莎·费尔德曼·巴瑞特《情绪》（How Emotions Are Made）'
            }
          ]
        }
      ]
    },
    {
      id: 'patterns',
      name: '理解模式',
      desc: '看见思维和情绪背后的规律',
      color: '#C4B5D8',
      topics: [
        {
          id: 'cognitive-distortion',
          title: '认知扭曲',
          subtitle: '你的大脑在骗你的6种方式',
          iconType: 'brain',
          isFree: true,
          sections: [
            {
              type: 'concept',
              title: '什么是认知扭曲？',
              content: '认知行为疗法（CBT）的创始人阿伦·贝克发现，人的情绪不是由事件直接引发的，而是由我们对事件的"解读"引发的。而很多时候，这些解读是扭曲的、不准确的。\n\n认知扭曲不是"想太多"，它是大脑的自动化捷径——为了快速判断，大脑会走捷径，但捷径有时会带你走偏。'
            },
            {
              type: 'list',
              title: '6种常见的认知扭曲',
              items: [
                {
                  name: '灾难化',
                  desc: '把事情往最坏的方向想',
                  example: '"面试没表现好 → 肯定没戏 → 我找不到工作 → 我这辈子完了"'
                },
                {
                  name: '非黑即白',
                  desc: '只看两个极端，没有中间地带',
                  example: '"这次没考满分，我就是个失败者"'
                },
                {
                  name: '情绪推理',
                  desc: '因为我感觉很糟，所以事情一定很糟',
                  example: '"我感觉自己很没用 → 所以我确实没用"'
                },
                {
                  name: '读心术',
                  desc: '不问就觉得自己知道别人在想什么',
                  example: '"他没回我消息，一定是讨厌我了"'
                },
                {
                  name: '过度概括',
                  desc: '从一件事推出一个普遍结论',
                  example: '"这次恋爱失败了 → 我永远不会被爱"'
                },
                {
                  name: 'Should思维',
                  desc: '用"应该"来绑架自己或别人',
                  example: '"我应该更坚强" "他应该理解我"'
                }
              ]
            },
            {
              type: 'exercise',
              title: '试一试',
              content: '下次你心情很差的时候，把脑子里的想法写下来，然后问自己：\n\n1. 这个想法是事实，还是我的推测？\n2. 如果我最好的朋友这样想，我会怎么对TA说？\n3. 有没有我忽略的、不支持这个想法的证据？\n\n你不需要"纠正"自己的想法，只需要看见它，它的力量就会减弱。'
            },
            {
              type: 'source',
              title: '延伸阅读',
              content: '大卫·伯恩斯《伯恩斯新情绪疗法》（Feeling Good）\n阿伦·贝克《认知疗法》'
            }
          ]
        },
        {
          id: 'attachment',
          title: '依恋理论',
          subtitle: '你的关系模式从哪来',
          iconType: 'link',
          isFree: true,
          sections: [
            {
              type: 'concept',
              title: '什么是依恋理论？',
              content: '心理学家约翰·鲍尔比和玛丽·安斯沃斯发现，我们在婴儿期和主要照顾者（通常是父母）之间形成的情感纽带，会深刻影响我们成年后的亲密关系模式。\n\n简单说：你小时候被爱的方式，决定了你长大后爱人和被爱的方式。'
            },
            {
              type: 'list',
              title: '4种依恋风格',
              items: [
                {
                  name: '安全型',
                  desc: '信任亲密关系，能自在地表达需求',
                  example: '觉得"我值得被爱，别人也是可以信赖的"'
                },
                {
                  name: '焦虑型',
                  desc: '渴望亲密但总担心被抛弃',
                  example: '"TA为什么没秒回？是不是不爱我了？"反复确认对方的感情'
                },
                {
                  name: '回避型',
                  desc: '害怕亲密，倾向于保持距离',
                  example: '"我一个人挺好的"但内心其实渴望连接，只是不敢靠近'
                },
                {
                  name: '混乱型',
                  desc: '既渴望又恐惧亲密关系',
                  example: '推开又拉回来，想要靠近又想逃跑，关系中充满矛盾和戏剧性'
                }
              ]
            },
            {
              type: 'why',
              title: '知道自己的依恋风格有什么用？',
              content: '依恋风格不是标签，也不是宿命。了解它的价值在于：\n\n- 理解"为什么我总是这样"——你的行为模式有来源，不是你的错\n- 在关系冲突中多一个视角——"TA不是不爱我，TA可能是回避型"\n- 最重要的：依恋风格是可以改变的。通过安全的关系体验（包括和小知的对话），你可以慢慢走向更安全的依恋。'
            },
            {
              type: 'source',
              title: '延伸阅读',
              content: '阿米尔·莱文《关系的重建》（Attached）'
            }
          ]
        },
        {
          id: 'rumination',
          title: '反刍思维',
          subtitle: '为什么你总是想个不停',
          iconType: 'loop',
          isFree: true,
          sections: [
            {
              type: 'concept',
              title: '什么是反刍思维？',
              content: '反刍（Rumination）是指反复、被动地思考负面事件的原因和后果，像牛反刍食物一样，把同一件事嚼了又嚼。\n\n它和"反思"的区别在于：\n- 反思是有方向的思考，目标是解决问题：发生了什么→我能做什么\n- 反刍是原地打转的思考，只问"为什么"却永远没有答案：为什么是我→我怎么这么差→为什么总是这样'
            },
            {
              type: 'why',
              title: '反刍为什么危险？',
              content: '研究表明，反刍思维是抑郁和焦虑的核心维持机制之一。它会：\n\n- 放大负面情绪（越想越难过）\n- 削弱问题解决能力（大脑忙着纠结，没有余力想办法）\n- 损害人际关系（反复向别人诉说同一件事，对方也会疲惫）\n\n诺兰-霍克西玛的研究发现，女性比男性更容易陷入反刍，这可能是女性抑郁发病率更高的原因之一。'
            },
            {
              type: 'exercise',
              title: '打断反刍的3个方法',
              content: '1. "2分钟规则"：允许自己想这件事，但只给2分钟。计时器响了就停，转做一件需要集中注意力的事（洗碗、运动、数学题）\n\n2. 问自己一个问题："我现在的想法，能帮我解决问题吗？"如果答案是不能，那就是在反刍，温柔地把注意力拉回来\n\n3. 身体感知锚定：摸一下桌面的纹理，感受脚踩在地面的压力。把注意力从脑子里拉回到身体上。这不是逃避，是给大脑按暂停键'
            },
            {
              type: 'source',
              title: '延伸阅读',
              content: '苏珊·诺兰-霍克西玛 反刍思维研究\n马克·威廉姆斯《正念》'
            }
          ]
        }
      ]
    },
    {
      id: 'practice',
      name: '场景应对',
      desc: '把知识用在真实生活里',
      color: '#F5D4C4',
      topics: [
        {
          id: 'nvc',
          title: '非暴力沟通',
          subtitle: '怎么把情绪变成对话',
          iconType: 'bubble',
          isFree: true,
          sections: [
            {
              type: 'concept',
              title: '什么是非暴力沟通？',
              content: '马歇尔·卢森堡提出的非暴力沟通（NVC）是一套把感受转化为有效对话的方法。它的核心很简单——用四个步骤说话：\n\n观察 → 感受 → 需要 → 请求\n\n不用"你总是...""你为什么不..."这类攻击性语言，而是用"我看到...我感到...因为我需要...我希望你能..."的方式表达。'
            },
            {
              type: 'list',
              title: '四步表达法',
              items: [
                {
                  name: '1. 观察（不评判）',
                  desc: '说事实，不说评价',
                  example: '"你这周三天没回我消息"（事实） vs "你根本不在乎我"（评价）'
                },
                {
                  name: '2. 感受（不指责）',
                  desc: '说"我"的感受，不说"你"的问题',
                  example: '"我感到被忽视和不安"（感受） vs "你太冷漠了"（指责）'
                },
                {
                  name: '3. 需要（找根源）',
                  desc: '感受背后一定有未被满足的需要',
                  example: '"因为我需要感受到在这段关系里被重视"'
                },
                {
                  name: '4. 请求（可执行）',
                  desc: '具体的、对方能做到的请求',
                  example: '"你忙的时候能不能发一条消息告诉我？哪怕就两个字也好"'
                }
              ]
            },
            {
              type: 'exercise',
              title: '试一试',
              content: '想一件最近让你不舒服的人际互动，用四步法重新表达：\n\n"当______（观察：对方的具体行为）\n我感到______（感受：你的真实情绪）\n因为我需要______（需要：你内心渴望什么）\n我希望______（请求：对方可以做什么）"\n\n写不出来也没关系，你可以来和小知聊聊，TA会帮你一步步理清楚。'
            },
            {
              type: 'source',
              title: '延伸阅读',
              content: '马歇尔·卢森堡《非暴力沟通》'
            }
          ]
        }
      ]
    }
  ]
};

Page({
  data: {
    categories: knowledgeData.categories,
    activeCategory: 'awareness',
    expandedTopic: null,
    activeSectionIndex: 0
  },

  onLoad: function() {
    // 默认展开第一个分类
    this.setData({
      activeCategory: knowledgeData.categories[0].id
    });
  },

  // 切换分类
  switchCategory: function(e) {
    const categoryId = e.currentTarget.dataset.id;
    this.setData({
      activeCategory: categoryId,
      expandedTopic: null,
      activeSectionIndex: 0
    });
    wx.vibrateShort({ type: 'light' });
  },

  // 展开/收起主题
  toggleTopic: function(e) {
    const topicId = e.currentTarget.dataset.id;
    const current = this.data.expandedTopic;
    this.setData({
      expandedTopic: current === topicId ? null : topicId,
      activeSectionIndex: 0
    });
    wx.vibrateShort({ type: 'light' });
  },

  // 切换知识卡片内的 section
  switchSection: function(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({ activeSectionIndex: index });
    wx.vibrateShort({ type: 'light' });
  },

  // 跳转到小知对话，携带当前话题内容
  goToChat: function(e) {
    const topicId = e.currentTarget.dataset.topicId;
    // 找到当前话题数据
    let topicData = null;
    const categories = this.data.categories;
    for (let i = 0; i < categories.length; i++) {
      const topics = categories[i].topics;
      for (let j = 0; j < topics.length; j++) {
        if (topics[j].id === topicId) {
          topicData = topics[j];
          break;
        }
      }
      if (topicData) break;
    }

    if (topicData) {
      // 通过临时存储传递话题信息
      wx.setStorageSync('tempKnowledgeTopic', {
        title: topicData.title,
        subtitle: topicData.subtitle,
        id: topicData.id
      });
    }

    wx.navigateTo({ url: '/pages/chat/chat' });
  }
});
