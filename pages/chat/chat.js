const aiUtils = require('../../utils/ai.js');
const cloudUtil = require('../../utils/cloud.js');
const markdown = require('../../utils/markdown.js');

// 语音录音管理器（使用微信原生 RecorderManager）
let recorderManager = null;

Page({
  data: {
    emotions: [],
    bodyFeelings: [],
    emotionIntensities: {},
    messages: [],
    inputText: '',
    quickNote: '',
    isAIThinking: false,
    scrollToView: '',
    userProfile: null,
    hasSavedConversation: false,
    conversationId: '',  // 云端会话ID，用于自动保存更新
    editingIndex: -1,  // 正在编辑的消息索引
    editingText: '',  // 编辑中的文本
    messageVersions: {},  // 存储每条消息的历史版本 {messageIndex: [{content, timestamp, branchMessages}]}
    currentVersionIndex: {},  // 当前显示的版本索引 {messageIndex: versionIndex}
    conversationBranches: {},  // 对话分支树 {messageIndex: {versionIndex: [后续消息数组]}}
    showHistorySidebar: false,  // 显示历史对话侧边栏
    conversationHistory: [],  // 对话历史列表
    isVoiceMode: false,  // 是否为语音输入模式
    isRecording: false,   // 是否正在录音
    favoriteMessages: {},  // 收藏的消息 {messageId: true}
    showEndModal: false  // 显示结束对话弹窗
  },

  onLoad: function(options) {
    const emotions = options.emotions ? JSON.parse(decodeURIComponent(options.emotions)) : [];
    const bodyFeelings = options.bodyFeelings ? JSON.parse(decodeURIComponent(options.bodyFeelings)) : [];
    const emotionIntensities = options.intensities ? JSON.parse(decodeURIComponent(options.intensities)) : {};
    const userProfile = wx.getStorageSync('userProfile') || null;

    // 读取快速记录（通过 localStorage 传递）
    const quickNote = wx.getStorageSync('tempQuickNote') || '';
    wx.removeStorageSync('tempQuickNote');

    // 读取知识库话题（从情绪知识库跳转过来）
    const knowledgeTopic = wx.getStorageSync('tempKnowledgeTopic') || null;
    wx.removeStorageSync('tempKnowledgeTopic');

    this.setData({
      emotions: emotions,
      bodyFeelings: bodyFeelings,
      emotionIntensities: emotionIntensities,
      userProfile: userProfile,
      quickNote: quickNote
    });

    // 如果有情绪数据，说明是从情绪记录页面进来的，发送初始消息
    // 如果有知识库话题，说明是从知识库跳转过来的，发送话题引导消息
    // 如果没有情绪数据，说明是从导航栏直接进来的，只显示欢迎词
    if (emotions.length > 0) {
      this.sendInitialMessage();
    } else if (knowledgeTopic) {
      this.sendKnowledgeTopicMessage(knowledgeTopic);
    } else {
      this.showWelcomeMessage();
    }
  },

  onShow: function() {
    // 加载对话历史列表
    this.loadConversationHistory();
  },

  onHide: function() {
    // 页面隐藏时自动保存对话状态
    const { messages, hasSavedConversation } = this.data;

    // 过滤掉欢迎消息
    const validMessages = messages.filter(m => !m.isWelcome);

    if (validMessages.length >= 2 && !hasSavedConversation) {
      // 自动保存到 pending，下次可以继续
      this._autoSaveConversation();
    }
  },

  // 检查未完成对话
  _checkPendingConversation: function() {
    const pending = wx.getStorageSync('pendingConversation');
    if (pending && pending.messages && pending.messages.length >= 2) {
      wx.showModal({
        title: '检测到未完成的对话',
        content: '是否继续上次的对话？',
        confirmText: '继续',
        cancelText: '新对话',
        success: (res) => {
          if (res.confirm) {
            // 恢复对话
            const messages = pending.messages.map(m => ({
              ...m,
              formattedContent: this.formatMarkdown(m.content)
            }));
            this.setData({
              messages: messages,
              emotions: pending.emotions || this.data.emotions,
              bodyFeelings: pending.bodyFeelings || this.data.bodyFeelings,
              conversationId: pending.conversationId || ''
            });
            this.scrollToBottom();
          } else {
            // 开始新对话
            wx.removeStorageSync('pendingConversation');
            this.sendInitialMessage();
          }
        }
      });
    } else {
      this.sendInitialMessage();
    }
  },

  // 自动保存对话到云端（每轮AI回复后调用）
  _autoSaveConversation: function() {
    const { emotions, bodyFeelings, messages, conversationId } = this.data;

    // 过滤掉欢迎消息
    const validMessages = messages.filter(m => !m.isWelcome);

    if (validMessages.length < 2) return;

    // 记录最后对话时间，供下次开场白使用
    try { wx.setStorageSync('lastChatTime', Date.now()); } catch (e) { /* ignore */ }

    const conversation = validMessages.map(m => ({
      role: m.role === 'ai' ? 'ai' : 'user',
      content: m.content
    }));
    const now = new Date();
    const recordTime = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');

    const db = wx.cloud.database();

    if (conversationId) {
      // 更新已有记录
      db.collection('ai_conversations').doc(conversationId).update({
        data: {
          conversation: conversation,
          updatedAt: db.serverDate()
        }
      }).catch(err => {
        console.error('自动更新对话失败:', err);
      });
    } else {
      // 首次保存，创建新记录
      db.collection('ai_conversations').add({
        data: {
          emotions: emotions,
          bodyFeelings: bodyFeelings,
          conversation: conversation,
          summary: '(对话进行中)',
          isCompleted: false,
          recordDate: now.toISOString(),
          recordTime: recordTime,
          createdAt: db.serverDate()
        }
      }).then(res => {
        this.setData({ conversationId: res._id });
      }).catch(err => {
        console.error('自动保存对话失败:', err);
      });
    }

    // 同时保存到本地，用于继续对话
    wx.setStorageSync('pendingConversation', {
      emotions: emotions,
      bodyFeelings: bodyFeelings,
      messages: conversation,
      conversationId: this.data.conversationId,
      updatedAt: now.toISOString()
    });
  },

  onUnload: function() {
    // 如果对话已保存，清除pending状态
    if (this.data.hasSavedConversation) {
      wx.removeStorageSync('pendingConversation');
      return;
    }

    // 对话未保存且有内容，保存到pending供下次继续
    const { messages } = this.data;

    // 过滤掉欢迎消息
    const validMessages = messages.filter(m => !m.isWelcome);

    if (validMessages.length >= 2) {
      this._autoSaveConversation();
      console.log('对话已自动保存，下次可继续');
    }
  },

  // 结束对话
  endConversation: function() {
    console.log('endConversation 被调用');

    const messages = this.data.messages;
    // 过滤掉欢迎消息
    const validMessages = messages.filter(m => !m.isWelcome);

    console.log('validMessages.length:', validMessages.length);
    console.log('hasSavedConversation:', this.data.hasSavedConversation);

    if (validMessages.length < 2) {
      wx.showToast({ title: '对话太短，再聊聊吧', icon: 'none' });
      return;
    }

    if (this.data.hasSavedConversation) {
      // 已保存过，直接返回
      wx.navigateBack();
      return;
    }

    // 显示自定义弹窗
    this.setData({
      showEndModal: true
    });
  },

  // 关闭弹窗
  closeEndModal: function() {
    this.setData({
      showEndModal: false
    });
  },

  // 退出不保存
  exitWithoutSave: function() {
    this.setData({
      showEndModal: false
    });
    wx.navigateBack();
  },

  // 保存并退出
  saveAndExit: function() {
    this.setData({
      showEndModal: false
    });
    this._saveAndExit();
  },

  // 整理并保存对话
  _saveAndExit: function() {
    wx.showLoading({ title: '小知正在整理中' });

    // 过滤掉欢迎消息
    const validMessages = this.data.messages.filter(m => !m.isWelcome);

    // 根据是否有情绪数据，调整提示词
    const hasEmotions = this.data.emotions && this.data.emotions.length > 0;

    if (!hasEmotions) {
      // 没有情绪数据，先让 AI 分析情绪
      this._analyzeEmotionsAndSave(validMessages);
    } else {
      // 有情绪数据，直接生成总结
      this._generateSummaryAndSave(validMessages, hasEmotions);
    }
  },

  // 分析情绪并保存
  _analyzeEmotionsAndSave: function(validMessages) {
    const emotionAnalysisMessages = validMessages.slice();
    emotionAnalysisMessages.push({
      id: Date.now(),
      role: 'user',
      content: `请分析这次对话中用户的主要情绪，从以下12种情绪中选择1-3个最匹配的：
开心、平静、难过、累、烦躁、焦虑、愤怒、感动、困惑、无聊、震惊、不知道

要求：
1. 只返回情绪名称，用顿号分隔（如：焦虑、累）
2. 最多选3个，按重要程度排序
3. 如果12种都不匹配，可以用一个自定义情绪词（不超过4个字）
4. 不要有任何解释，只返回情绪名称`
    });

    aiUtils.callDeepSeekAPI(emotionAnalysisMessages, this.data.userProfile)
      .then(emotionResult => {
        // 解析情绪结果
        const analyzedEmotions = emotionResult.trim().split('、').map(e => e.trim()).filter(e => e);

        // 将分析出的情绪设置到 data 中
        this.setData({
          emotions: analyzedEmotions,
          emotionIntensities: {}
        });

        // 继续生成总结
        this._generateSummaryAndSave(validMessages, false);
      })
      .catch(err => {
        console.error('情绪分析失败:', err);
        // 失败时使用默认情绪
        this.setData({
          emotions: ['对话记录'],
          emotionIntensities: {}
        });
        this._generateSummaryAndSave(validMessages, false);
      });
  },

  // 生成总结并保存
  _generateSummaryAndSave: function(validMessages, hasEmotions) {
    const summaryMessages = validMessages.slice();
    const summaryPrompt = hasEmotions
      ? `请用第三人称为这次对话生成一份情绪分析总结，包含以下内容：
1. 情绪解析：用简洁生动的语言拆解TA的情绪（如"表面是X，实际是Y+Z的组合"）
2. 情绪强度：1-10分
3. 建议行动：2-3条具体可行的建议

要求：
- 用"TA"代替"你"
- 语气温暖但不说教
- 总结控制在150字以内
- 可以用比喻或emoji让表达更生动
- 每次总结的框架可以稍有变化，不要太模板化

示例格式（可灵活调整）：
检测到TA的情绪为：表面是"烦"，拆开看其实是"不被尊重的愤怒"+ "无力改变的憋屈"+ "怕丢工作的焦虑"三重奏🎵。
情绪强度 6分
建议行动：1) xxx 2) xxx`
      : `请用第三人称为这次对话生成一份总结，包含以下内容：
1. 核心主题：TA主要在聊什么（用简洁生动的语言概括）
2. 情绪状态：从对话中感受到的情绪（1-10分）
3. 建议行动：2-3条具体可行的建议

要求：
- 用"TA"代替"你"
- 语气温暖但不说教
- 总结控制在150字以内
- 可以用比喻或emoji让表达更生动
- 每次总结的框架可以稍有变化，不要太模板化

示例格式（可灵活调整）：
TA今天主要在聊工作上的困扰。从对话中感受到TA有些疲惫和迷茫，情绪强度 5分。
建议行动：1) xxx 2) xxx`;

    summaryMessages.push({
      id: Date.now(),
      role: 'user',
      content: summaryPrompt
    });

    // 同时发起：生成总结 + 提取用户洞察（并行，不阻塞）
    const summaryPromise = aiUtils.callDeepSeekAPI(summaryMessages, this.data.userProfile);
    const insightPromise = this._extractUserInsights(validMessages);

    summaryPromise
      .then(summary => {
        this._doSave(summary);
        setTimeout(() => { wx.navigateBack(); }, 1500);
      })
      .catch(err => {
        console.error('总结生成失败:', err);
        const emotionText = this.data.emotions && this.data.emotions.length > 0
          ? this.data.emotions.join('、')
          : '对话记录';
        const fallback = `情绪：${emotionText}\n` +
          `强度：${this._getAverageIntensity()}/6\n` +
          `建议：${validMessages.filter(m => m.role === 'ai').slice(-1).map(m => m.content.substring(0, 100)).join('')}`;
        this._doSave(fallback);
        setTimeout(() => { wx.navigateBack(); }, 1500);
      });

    // 洞察提取在后台完成，不影响主流程
    insightPromise.catch(err => {
      console.error('洞察提取失败（不影响保存）:', err);
    });
  },

  // 从对话中提取用户长期洞察，存入本地情绪档案
  _extractUserInsights: function(validMessages) {
    const insightMessages = validMessages.slice();
    insightMessages.push({
      id: Date.now(),
      role: 'user',
      content: `基于这段对话，提取2-3条关于这位用户的长期有价值的洞察。

要求：
- 只提取有长期参考价值的信息（性格特征、反复出现的模式、重要的人际关系、有效的应对方式等）
- 忽略临时性、一次性的内容（如"今天下雨了"）
- 每条洞察用一句简短陈述句（不超过30字）
- 直接返回JSON数组格式：["洞察1", "洞察2"]
- 如果这次对话没有值得提取的长期洞察，返回空数组：[]
- 只返回JSON，不要任何其他文字`
    });

    return aiUtils.callDeepSeekAPI(insightMessages, this.data.userProfile)
      .then(result => {
        let newInsights = [];
        try {
          // 尝试从返回文本中提取 JSON 数组
          const jsonMatch = result.match(/\[[\s\S]*?\]/);
          if (jsonMatch) {
            newInsights = JSON.parse(jsonMatch[0]);
          }
        } catch (e) {
          console.warn('洞察解析失败:', e, '原始返回:', result);
          return;
        }

        if (!Array.isArray(newInsights) || newInsights.length === 0) return;

        // 读取已有洞察
        let insights = wx.getStorageSync('userInsights') || [];
        const today = new Date().toLocaleDateString('zh-CN');
        const emotionText = this.data.emotions.length > 0 ? this.data.emotions.join('、') : '';

        // 追加新洞察
        newInsights.forEach(text => {
          if (typeof text === 'string' && text.trim()) {
            insights.push({
              date: today,
              text: text.trim(),
              emotion: emotionText
            });
          }
        });

        // 保留最近 30 条
        if (insights.length > 30) {
          insights = insights.slice(-30);
        }

        // 存入本地
        wx.setStorageSync('userInsights', insights);
        console.log('[情绪档案] 已保存洞察，当前共', insights.length, '条');

        // 异步备份到云端（不阻塞）
        const db = wx.cloud.database();
        db.collection('user_profiles').where({
          _openid: '{openid}'
        }).update({
          data: { userInsights: insights }
        }).catch(() => {
          // 云端更新失败不影响本地
        });
      });
  },

  // 计算平均情绪强度
  _getAverageIntensity: function() {
    const intensities = Object.values(this.data.emotionIntensities);
    if (intensities.length === 0) return 3;
    const sum = intensities.reduce((acc, item) => acc + (item.intensity || 2), 0);
    return Math.round(sum / intensities.length) + 1;
  },

  sendInitialMessage: function() {
    const emotionText = this.data.emotions.join('、');
    const bodyText = this.data.bodyFeelings.length > 0
      ? `，身体感受：${this.data.bodyFeelings.join('、')}`
      : '';
    const quickNote = this.data.quickNote;
    const noteText = quickNote ? `\n\n我想说的是：${quickNote}` : '';

    const contextMessage = `我现在感受到了${emotionText}${bodyText}。${noteText}`;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: contextMessage,
      formattedContent: this.formatMarkdown(contextMessage)
    };

    this.setData({ messages: [userMessage] });
    this.getAIResponse();
  },

  // 显示欢迎消息（从导航栏直接进入时）
  showWelcomeMessage: function() {
    const loadingId = 'welcome-loading-' + Date.now();
    const loadingMessage = {
      id: loadingId,
      role: 'ai',
      content: '',
      formattedContent: '',
      isWelcome: true,
      isLoading: true
    };
    this.setData({ messages: [loadingMessage] });
    this.scrollToBottom();

    // 构建上下文信息，让 AI 自己决定怎么开口
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    let timeDesc = '';
    if (hour >= 0 && hour < 6) timeDesc = '凌晨' + hour + '点' + (minute > 0 ? minute + '分' : '');
    else if (hour < 9) timeDesc = '早上' + hour + '点' + (minute > 0 ? minute + '分' : '');
    else if (hour < 12) timeDesc = '上午' + hour + '点' + (minute > 0 ? minute + '分' : '');
    else if (hour < 14) timeDesc = '中午' + (hour > 12 ? hour - 12 : hour) + '点' + (minute > 0 ? minute + '分' : '');
    else if (hour < 18) timeDesc = '下午' + (hour - 12) + '点' + (minute > 0 ? minute + '分' : '');
    else if (hour < 22) timeDesc = '晚上' + (hour - 12) + '点' + (minute > 0 ? minute + '分' : '');
    else timeDesc = '深夜' + (hour - 12) + '点' + (minute > 0 ? minute + '分' : '');

    // 计算距离上次对话的间隔
    let intervalDesc = '';
    try {
      const lastChatTime = wx.getStorageSync('lastChatTime');
      if (lastChatTime) {
        const diffMs = now.getTime() - lastChatTime;
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        if (diffDays >= 7) intervalDesc = '距离上次对话已经过去' + diffDays + '天了';
        else if (diffDays >= 1) intervalDesc = '距离上次对话过去了' + diffDays + '天';
        else if (diffHours >= 1) intervalDesc = '距离上次对话过去了' + diffHours + '小时';
        else intervalDesc = '刚刚才聊过不久';
      } else {
        intervalDesc = '这是TA第一次来找你';
      }
    } catch (e) {
      // ignore
    }

    const contextHint = '[系统提示：用户刚刚打开了对话，没有说任何话。当前时间是' + timeDesc + '。' + intervalDesc + '。请你作为小知，自然地说第一句话。根据时间和间隔感受TA的状态，1-2句话就好，不要太长。不要用"你说，我在听"这种模板。]';

    const userProfile = this.data.userProfile;
    const { callDeepSeekAPIWithSystemPrompt, generateSystemPrompt } = require('../../utils/ai');
    const systemPrompt = generateSystemPrompt(userProfile);

    const that = this;
    const applyWelcomeMessage = function(content) {
      const welcomeMessage = {
        id: 'welcome-' + Date.now(),
        role: 'ai',
        content: content,
        formattedContent: that.formatMarkdown(content),
        isWelcome: true
      };

      const currentMessages = that.data.messages || [];
      const loadingIndex = currentMessages.findIndex(m => m.id === loadingId);
      let nextMessages = currentMessages.filter(m => !(m.isWelcome && m.isLoading));

      if (loadingIndex >= 0) {
        nextMessages.splice(loadingIndex, 0, welcomeMessage);
      } else if (!nextMessages.some(m => m.isWelcome)) {
        nextMessages.unshift(welcomeMessage);
      }

      that.setData({ messages: nextMessages.length > 0 ? nextMessages : [welcomeMessage] });
      that.scrollToBottom();
    };

    callDeepSeekAPIWithSystemPrompt(systemPrompt, [{ role: 'user', content: contextHint }])
      .then(function(reply) {
        applyWelcomeMessage(reply);
      })
      .catch(function() {
        const fallbacks = [
          '嗯，我在。',
          '（看着你）来了。',
          '（靠过来一点）嗯？'
        ];
        const fallback = fallbacks[Math.floor(Math.random() * fallbacks.length)];
        applyWelcomeMessage(fallback);
      });
  },

  // 从知识库话题跳转过来，自动发送话题引导消息
  sendKnowledgeTopicMessage: function(topic) {
    const userContent = '我刚刚在知识库里看了「' + topic.title + '」的内容，想和你聊聊这个话题。';
    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: userContent,
      formattedContent: this.formatMarkdown(userContent)
    };

    this.setData({ messages: [userMessage] });
    this.scrollToBottom();
    this.getAIResponse();
  },

  onInputChange: function(e) {
    // 直接记录值，不用 setData 回写（避免键盘语音输入时因高频触发导致重复）
    this._inputValue = e.detail.value;
  },

  sendMessage: function() {
    // 使用缓存值（避免键盘语音输入重复）
    const text = (this._inputValue || '').trim();
    if (!text) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: text,
      formattedContent: this.formatMarkdown(text)
    };

    // 使用函数式更新减少 setData 调用
    const messages = [...this.data.messages, userMessage];

    this._inputValue = '';
    this.setData({
      messages: messages
    });

    wx.vibrateShort({ type: 'light' });
    this.scrollToBottom();
    this.getAIResponse();
  },

  getAIResponse: function() {
    this.setData({ isAIThinking: true });
    this.scrollToBottom();

    aiUtils.callDeepSeekAPI(this.data.messages, this.data.userProfile)
      .then(reply => {
        const aiMessage = {
          id: Date.now(),
          role: 'ai',
          content: reply,
          formattedContent: this.formatMarkdown(reply)
        };

        // 使用函数式更新减少 setData 调用
        const messages = [...this.data.messages, aiMessage];

        this.setData({
          messages: messages,
          isAIThinking: false
        });

        this.scrollToBottom();
        this._autoSaveConversation();
      })
      .catch(err => {
        console.error('AI API 调用失败:', err);
        this.simulateAIResponse();
        this.setData({ isAIThinking: false });

        wx.showToast({
          title: 'AI 暂时无法回复',
          icon: 'none',
          duration: 2000
        });
      });
  },

  simulateAIResponse: function() {
    const responses = [
      '嗯，我在。',
      '没关系，我先陪你待一会儿。',
      '不想说也没关系，我就在这儿。',
      '感觉你有点低下去了……先不用急着回答我。',
      '你慢慢来，我听着。'
    ];

    const randomResponse = responses[Math.floor(Math.random() * responses.length)];

    const aiMessage = {
      id: Date.now(),
      role: 'ai',
      content: randomResponse,
      formattedContent: this.formatMarkdown(randomResponse)
    };

    const messages = this.data.messages;
    messages.push(aiMessage);

    this.setData({ messages: messages });
    this.scrollToBottom();
  },

  // 格式化Markdown为HTML
  formatMarkdown: function(text) {
    return markdown.toHtml(text);
  },

  // 重新生成AI回复
  regenerateResponse: function() {
    const messages = this.data.messages;
    if (messages.length === 0) return;

    // 移除最后一条AI消息
    const lastMsg = messages[messages.length - 1];
    if (lastMsg.role !== 'ai') return;

    messages.pop();
    this.setData({ messages: messages });

    wx.vibrateShort({ type: 'light' });
    this.getAIResponse();
  },

  scrollToBottom: function() {
    const messages = this.data.messages;
    if (this.data.isAIThinking) {
      this.setData({ scrollToView: 'thinking' });
    } else if (messages.length > 0) {
      // 使用 requestAnimationFrame 优化滚动性能
      if (typeof wx.nextTick === 'function') {
        wx.nextTick(() => {
          this.setData({ scrollToView: 'msg-' + messages[messages.length - 1].id });
        });
      } else {
        this.setData({ scrollToView: 'msg-' + messages[messages.length - 1].id });
      }
    }
  },

  // 保存今日记录：让 AI 总结对话，保存到本地和云端（已废弃，改为退出时触发）
  saveRecord: function() {
    const messages = this.data.messages;
    // 过滤掉欢迎消息
    const validMessages = messages.filter(m => !m.isWelcome);

    if (validMessages.length < 2) {
      wx.showToast({ title: '对话太短，再聊聊吧', icon: 'none' });
      return;
    }

    this._saveAndExit();
  },

  _doSave: function(summary) {
    const { emotions, bodyFeelings, emotionIntensities, messages } = this.data;
    const now = new Date();
    const recordTime = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');

    // 过滤掉欢迎消息
    const validMessages = messages.filter(m => !m.isWelcome);

    const conversation = validMessages.map(m => ({
      role: m.role === 'ai' ? 'ai' : 'user',
      content: m.content
    }));

    // 如果没有情绪数据，使用默认值
    const finalEmotions = emotions && emotions.length > 0 ? emotions : ['对话记录'];
    const finalBodyFeelings = bodyFeelings || [];
    const finalEmotionIntensities = emotionIntensities || {};

    // 情绪颜色映射（与 main.js 中的 emotionsData 保持一致）
    const emotionColorMap = {
      '开心': '#F5C6CB',
      '平静': '#B8D4E8',
      '难过': '#9BA8BC',
      '累': '#D4C5B0',
      '烦躁': '#E8A5A5',
      '焦虑': '#C4B5D8',
      '愤怒': '#D89B9B',
      '感动': '#F5D4C4',
      '困惑': '#C4D4B5',
      '无聊': '#D0CFC4',
      '震惊': '#E8C4D8',
      '不知道': '#BCBCBC',
      '对话记录': '#BCBCBC'
    };

    // 为每个情绪添加颜色信息
    const emotionsWithColor = finalEmotions.map(emotion => {
      return {
        name: emotion,
        color: emotionColorMap[emotion] || '#C4B5D8' // 默认使用紫色
      };
    });

    // 日历记录 - 保存快速记录原文 + AI总结
    const quickNote = this.data.quickNote || '';
    const fullNote = quickNote.trim()
      ? `【我的记录】${quickNote.trim()}\n\n【小知整理】${summary}`
      : summary;

    const record = {
      id: Date.now(),
      date: now.toISOString(),
      recordTime: recordTime,
      emotions: finalEmotions,
      emotionsWithColor: emotionsWithColor, // 新增：带颜色的情绪数据
      emotionIntensities: finalEmotionIntensities,
      bodyFeelings: finalBodyFeelings,
      note: fullNote,  // 快速记录原文 + AI总结
      timestamp: now.toLocaleString('zh-CN')
    };

    // 保存到本地日历记录
    let records = wx.getStorageSync('dailyRecords') || [];
    records.unshift(record);
    wx.setStorageSync('dailyRecords', records);

    // 保存完整对话到左侧栏历史（用于继续对话）
    let chatHistory = wx.getStorageSync('chatHistory') || [];
    chatHistory.unshift({
      id: record.id,
      date: record.date,
      recordTime: recordTime,
      emotions: finalEmotions,
      emotionsWithColor: emotionsWithColor,
      conversation: conversation,  // 完整对话
      summary: summary
    });
    // 最多保留100条历史
    if (chatHistory.length > 100) chatHistory = chatHistory.slice(0, 100);
    wx.setStorageSync('chatHistory', chatHistory);

    // 保存完整对话到 ai_conversations 集合（云端备份）
    this.setData({ hasSavedConversation: true });
    wx.removeStorageSync('pendingConversation');

    const db = wx.cloud.database();
    const conversationId = this.data.conversationId;

    if (conversationId) {
      // 更新已有的自动保存记录
      db.collection('ai_conversations').doc(conversationId).update({
        data: {
          conversation: conversation,
          summary: summary,
          emotions: finalEmotions,
          emotionsWithColor: emotionsWithColor,
          isCompleted: true,
          updatedAt: db.serverDate()
        }
      }).catch(err => {
        console.error('ai_conversations 更新失败:', err);
      });
    } else {
      // 没有自动保存记录，新建一条
      db.collection('ai_conversations').add({
        data: {
          emotions: finalEmotions,
          emotionsWithColor: emotionsWithColor,
          bodyFeelings: finalBodyFeelings,
          conversation: conversation,
          summary: summary,
          isCompleted: true,
          recordDate: now.toISOString(),
          recordTime: recordTime,
          createdAt: db.serverDate()
        }
      }).catch(err => {
        console.error('ai_conversations 保存失败:', err);
      });
    }

    // 保存到云端情绪记录（只保存总结）
    // 如果有情绪数据才保存到云端
    if (emotions && emotions.length > 0 && emotions[0] !== '对话记录') {
      const emotionsWithIntensity = emotions.map(emotion => {
        const intensityInfo = finalEmotionIntensities[emotion] || {};
        return {
          name: emotion,
          color: emotionColorMap[emotion] || '#C4B5D8',
          intensity: intensityInfo.intensity !== undefined ? intensityInfo.intensity + 1 : 5,
          subEmotion: intensityInfo.subEmotion || ''
        };
      });

      cloudUtil.saveEmotionToCloud({
        emotions: emotionsWithIntensity,
        emotion: emotions[0],
        emotionIcon: '',
        intensity: emotionsWithIntensity[0] ? emotionsWithIntensity[0].intensity : 5,
        subEmotion: emotionsWithIntensity[0] ? emotionsWithIntensity[0].subEmotion : '',
        note: fullNote,  // 快速记录原文 + AI总结
        bodyFeelings: finalBodyFeelings,
        recordDate: now.toISOString(),
        recordTime: recordTime
      }).catch(err => {
        console.error('云端保存失败:', err);
      });
    }

    wx.hideLoading();
    wx.vibrateShort({ type: 'medium' });

    wx.showToast({
      title: '记录已保存',
      icon: 'success',
      duration: 2000
    });
  },

  // 编辑用户消息
  editMessage: function(e) {
    const index = e.currentTarget.dataset.index;
    const message = this.data.messages[index];

    if (!message || message.role !== 'user') return;

    // 进入编辑模式
    this.setData({
      editingIndex: index,
      editingText: message.content
    });

    // 滚动到编辑位置
    this.setData({ scrollToView: 'msg-' + message.id });
  },

  // 编辑框输入
  onEditInput: function(e) {
    this.setData({ editingText: e.detail.value });
  },

  // 取消编辑
  cancelEdit: function() {
    this.setData({
      editingIndex: -1,
      editingText: ''
    });
  },

  // 确认编辑并重新发送
  confirmEdit: function() {
    const { editingIndex, editingText, messages, messageVersions, conversationBranches, currentVersionIndex } = this.data;
    const newContent = editingText.trim();

    if (!newContent) {
      wx.showToast({ title: '内容不能为空', icon: 'none' });
      return;
    }

    // 保存当前版本到历史
    const oldMessage = messages[editingIndex];
    const versions = messageVersions[editingIndex] || [];
    const branches = conversationBranches[editingIndex] || {};

    // 第一次编辑时，保存原始内容和后续对话
    if (versions.length === 0) {
      versions.push({
        content: oldMessage.content,
        timestamp: Date.now()
      });
      // 保存原始版本的后续对话分支
      branches[0] = messages.slice(editingIndex + 1);
    } else {
      // 保存当前版本的后续对话分支
      const currentVersionIdx = currentVersionIndex[editingIndex] !== undefined
        ? currentVersionIndex[editingIndex]
        : versions.length - 1;
      branches[currentVersionIdx] = messages.slice(editingIndex + 1);
    }

    // 保存新编辑的内容
    versions.push({
      content: newContent,
      timestamp: Date.now()
    });

    // 新版本索引
    const newVersionIdx = versions.length - 1;

    // 截断从该消息之后的所有对话（新分支从空开始）
    const newMessages = messages.slice(0, editingIndex);

    // 更新该消息内容
    newMessages.push({
      id: Date.now(),
      role: 'user',
      content: newContent,
      formattedContent: this.formatMarkdown(newContent),
      versionCount: versions.length,  // 总版本数
      originalContent: oldMessage.originalContent || oldMessage.content  // 保存原始内容
    });

    // 更新版本历史和分支树
    const newVersions = { ...messageVersions };
    newVersions[editingIndex] = versions;

    const newBranches = { ...conversationBranches };
    newBranches[editingIndex] = branches;

    // 更新当前版本索引
    const newCurrentVersionIndex = { ...currentVersionIndex };
    newCurrentVersionIndex[editingIndex] = newVersionIdx;

    this.setData({
      messages: newMessages,
      messageVersions: newVersions,
      conversationBranches: newBranches,
      currentVersionIndex: newCurrentVersionIndex,
      editingIndex: -1,
      editingText: ''
    });

    wx.vibrateShort({ type: 'light' });
    this.scrollToBottom();

    // 重新生成AI回复
    this.getAIResponse();
  },

  // 复制消息内容
  copyMessage: function(e) {
    const content = e.currentTarget.dataset.content;
    wx.setClipboardData({
      data: content,
      success: () => {
        wx.showToast({
          title: '已复制',
          icon: 'success',
          duration: 1500
        });
      }
    });
  },

  // 切换收藏状态
  toggleFavorite: function(e) {
    const { id, content, index } = e.currentTarget.dataset;
    const { favoriteMessages, emotions } = this.data;

    const isFavorited = favoriteMessages[id];

    if (isFavorited) {
      // 取消收藏
      delete favoriteMessages[id];
      this._removeFavoriteQuote(id);
      wx.showToast({
        title: '已取消收藏',
        icon: 'none',
        duration: 1500
      });
    } else {
      // 添加收藏
      favoriteMessages[id] = true;
      this._saveFavoriteQuote({
        id: id,
        content: content,
        emotions: emotions,
        createdAt: new Date().toISOString(),
        source: 'chat'
      });
      wx.showToast({
        title: '已收藏',
        icon: 'success',
        duration: 1500
      });
    }

    this.setData({ favoriteMessages });
    wx.vibrateShort({ type: 'light' });
  },

  // 长按消息
  onLongPressMessage: function(e) {
    const { index, content } = e.currentTarget.dataset;
    const { messages } = this.data;
    const message = messages[index];

    // 只对AI消息有效
    if (message.role !== 'ai') return;

    // 检查是否有选中文本
    wx.getSelectedTextRange({
      success: (res) => {
        const { start, end } = res;
        if (start !== -1 && end !== -1 && start !== end) {
          // 有选中文本，提取选中内容
          const selectedText = content.substring(start, end);

          wx.showActionSheet({
            itemList: ['复制选中内容', '收藏选中内容到金句夹', '收藏整条回复'],
            success: (actionRes) => {
              if (actionRes.tapIndex === 0) {
                // 复制选中内容
                wx.setClipboardData({
                  data: selectedText,
                  success: () => {
                    wx.showToast({ title: '已复制', icon: 'success', duration: 1500 });
                  }
                });
              } else if (actionRes.tapIndex === 1) {
                // 收藏选中内容
                this._saveFavoriteQuote({
                  id: message.id + '-' + Date.now(),
                  content: selectedText,
                  emotions: this.data.emotions,
                  createdAt: new Date().toISOString(),
                  source: 'chat-partial'
                });
                wx.showToast({ title: '已收藏', icon: 'success', duration: 1500 });
                wx.vibrateShort({ type: 'light' });
              } else if (actionRes.tapIndex === 2) {
                // 收藏整条回复
                this.toggleFavorite({
                  currentTarget: {
                    dataset: {
                      id: message.id,
                      content: content,
                      index: index
                    }
                  }
                });
              }
            }
          });
        } else {
          // 没有选中文本，显示原有菜单
          wx.showActionSheet({
            itemList: ['复制', '收藏到金句夹'],
            success: (actionRes) => {
              if (actionRes.tapIndex === 0) {
                // 复制
                this.copyMessage(e);
              } else if (actionRes.tapIndex === 1) {
                // 收藏
                this.toggleFavorite({
                  currentTarget: {
                    dataset: {
                      id: message.id,
                      content: content,
                      index: index
                    }
                  }
                });
              }
            }
          });
        }
      },
      fail: () => {
        // API不支持或失败，显示原有菜单
        wx.showActionSheet({
          itemList: ['复制', '收藏到金句夹'],
          success: (actionRes) => {
            if (actionRes.tapIndex === 0) {
              // 复制
              this.copyMessage(e);
            } else if (actionRes.tapIndex === 1) {
              // 收藏
              this.toggleFavorite({
                currentTarget: {
                  dataset: {
                    id: message.id,
                    content: content,
                    index: index
                  }
                }
              });
            }
          }
        });
      }
    });
  },

  // 保存收藏金句到本地和云端
  _saveFavoriteQuote: function(quote) {
    // 保存到本地
    let favoriteQuotes = wx.getStorageSync('favoriteQuotes') || [];
    favoriteQuotes.unshift(quote);
    wx.setStorageSync('favoriteQuotes', favoriteQuotes);

    // 保存到云端
    const db = wx.cloud.database();
    db.collection('favorite_quotes').add({
      data: {
        ...quote,
        createdAt: db.serverDate()
      }
    }).catch(err => {
      console.error('云端保存收藏失败:', err);
    });
  },

  // 从本地和云端删除收藏
  _removeFavoriteQuote: function(quoteId) {
    // 从本地删除
    let favoriteQuotes = wx.getStorageSync('favoriteQuotes') || [];
    favoriteQuotes = favoriteQuotes.filter(q => q.id !== quoteId);
    wx.setStorageSync('favoriteQuotes', favoriteQuotes);

    // 从云端删除
    const db = wx.cloud.database();
    db.collection('favorite_quotes').where({
      id: quoteId
    }).remove().catch(err => {
      console.error('云端删除收藏失败:', err);
    });
  },

  // 切换到上一个版本
  previousVersion: function(e) {
    const index = e.currentTarget.dataset.index;
    const { messages, messageVersions, currentVersionIndex, conversationBranches } = this.data;
    const versions = messageVersions[index] || [];

    if (versions.length === 0) return;

    const currentIdx = currentVersionIndex[index] !== undefined ? currentVersionIndex[index] : versions.length - 1;
    const newIdx = Math.max(0, currentIdx - 1);

    // 更新显示的内容
    const newMessages = [...messages];
    newMessages[index] = {
      ...newMessages[index],
      content: versions[newIdx].content,
      formattedContent: this.formatMarkdown(versions[newIdx].content)
    };

    // 恢复该版本的后续对话分支
    const branches = conversationBranches[index] || {};
    const branchMessages = branches[newIdx] || [];

    // 截断到当前消息，然后添加该版本的后续对话
    const restoredMessages = newMessages.slice(0, index + 1).concat(branchMessages);

    const newCurrentVersionIndex = { ...currentVersionIndex };
    newCurrentVersionIndex[index] = newIdx;

    this.setData({
      messages: restoredMessages,
      currentVersionIndex: newCurrentVersionIndex
    });

    wx.vibrateShort({ type: 'light' });
    this.scrollToBottom();
  },

  // 切换到下一个版本
  nextVersion: function(e) {
    const index = e.currentTarget.dataset.index;
    const { messages, messageVersions, currentVersionIndex, conversationBranches } = this.data;
    const versions = messageVersions[index] || [];

    if (versions.length === 0) return;

    const currentIdx = currentVersionIndex[index] !== undefined ? currentVersionIndex[index] : versions.length - 1;
    const newIdx = Math.min(versions.length - 1, currentIdx + 1);

    // 更新显示的内容
    const newMessages = [...messages];
    newMessages[index] = {
      ...newMessages[index],
      content: versions[newIdx].content,
      formattedContent: this.formatMarkdown(versions[newIdx].content)
    };

    // 恢复该版本的后续对话分支
    const branches = conversationBranches[index] || {};
    const branchMessages = branches[newIdx] || [];

    // 截断到当前消息，然后添加该版本的后续对话
    const restoredMessages = newMessages.slice(0, index + 1).concat(branchMessages);

    const newCurrentVersionIndex = { ...currentVersionIndex };
    newCurrentVersionIndex[index] = newIdx;

    this.setData({
      messages: restoredMessages,
      currentVersionIndex: newCurrentVersionIndex
    });

    wx.vibrateShort({ type: 'light' });
    this.scrollToBottom();
  },

  // 查看历史对话 - 打开侧边栏
  viewHistory: function() {
    this.loadConversationHistory();
    this.setData({ showHistorySidebar: true });
  },

  // 关闭侧边栏
  closeSidebar: function() {
    this.setData({ showHistorySidebar: false });
  },

  // 加载对话历史列表
  loadConversationHistory: function() {
    const db = wx.cloud.database();
    db.collection('ai_conversations')
      .orderBy('createdAt', 'desc')
      .limit(50)
      .get()
      .then(res => {
        const history = res.data.map(item => {
          // 生成预览文本（取第一条用户消息）
          const firstUserMsg = item.conversation.find(m => m.role === 'user');
          const preview = firstUserMsg ? firstUserMsg.content.substring(0, 30) : '对话记录';

          return {
            _id: item._id,
            emotions: item.emotions || [],
            preview: preview,
            recordTime: item.recordTime || '',
            recordDate: item.recordDate || item.createdAt,
            isCompleted: item.isCompleted || false,
            conversation: item.conversation || []
          };
        });
        this.setData({ conversationHistory: history });
      })
      .catch(err => {
        console.error('加载对话历史失败:', err);
      });
  },

  // 切换到历史对话
  switchToConversation: function(e) {
    const id = e.currentTarget.dataset.id;
    const conversation = this.data.conversationHistory.find(c => c._id === id);

    if (!conversation) return;

    // 恢复对话
    const messages = conversation.conversation.map(m => ({
      id: Date.now() + Math.random(),
      role: m.role,
      content: m.content,
      formattedContent: this.formatMarkdown(m.content)
    }));

    this.setData({
      messages: messages,
      emotions: conversation.emotions || this.data.emotions,
      conversationId: id,
      showHistorySidebar: false,
      hasSavedConversation: conversation.isCompleted
    });

    this.scrollToBottom();
    wx.vibrateShort({ type: 'light' });
  },

  // 开始新对话
  startNewConversation: function() {
    this.setData({
      messages: [],
      conversationId: '',
      hasSavedConversation: false,
      showHistorySidebar: false,
      messageVersions: {},
      currentVersionIndex: {}
    });

    if (this.data.emotions && this.data.emotions.length > 0) {
      this.sendInitialMessage();
    } else {
      this.showWelcomeMessage();
    }
    wx.vibrateShort({ type: 'light' });
  },

  // ==================== 语音输入功能 ====================

  // 切换语音/键盘模式
  toggleVoiceMode: function() {
    const isVoiceMode = !this.data.isVoiceMode;

    if (isVoiceMode) {
      // 切换到语音模式前，先检查录音权限
      wx.authorize({
        scope: 'scope.record',
        success: () => {
          this.setData({ isVoiceMode: true });
          this._initVoiceRecognition();
        },
        fail: () => {
          wx.showModal({
            title: '需要录音权限',
            content: '语音输入需要使用麦克风，请在设置中开启录音权限',
            confirmText: '去设置',
            success: (res) => {
              if (res.confirm) {
                wx.openSetting();
              }
            }
          });
        }
      });
    } else {
      this.setData({ isVoiceMode: false });
    }

    wx.vibrateShort({ type: 'light' });
  },

  // 初始化语音录音管理器（使用微信原生 RecorderManager）
  _initVoiceRecognition: function() {
    if (recorderManager) return; // 已初始化

    recorderManager = wx.getRecorderManager();

    // 录音结束回调
    recorderManager.onStop((res) => {
      this.setData({ isRecording: false });

      if (res.tempFilePath) {
        // 使用微信原生语音识别（插件接口）
        // 由于没有同声传译插件，改为提示用户使用键盘自带语音输入
        wx.showToast({ title: '录音完成，请使用键盘语音输入', icon: 'none', duration: 2000 });
      }
    });

    // 错误回调
    recorderManager.onError((res) => {
      console.error('录音错误:', res);
      this.setData({ isRecording: false });
      wx.showToast({ title: '录音失败，请重试', icon: 'none' });
    });

    // 开始录音回调
    recorderManager.onStart(() => {
      this.setData({ isRecording: true });
    });
  },

  // 开始录音
  startRecording: function(e) {
    this._initVoiceRecognition();

    if (!recorderManager) {
      wx.showToast({ title: '录音功能初始化失败', icon: 'none' });
      return;
    }

    this._touchStartY = e.touches[0].clientY;

    // 清空之前的文本
    this.setData({ inputText: '' });

    recorderManager.start({
      format: 'mp3',
      lang: 'zh_CN'
    });

    wx.vibrateShort({ type: 'medium' });
  },

  // 停止录音（松开手指）
  stopRecording: function(e) {
    if (!this.data.isRecording || !recorderManager) return;

    // 检查是否上滑取消
    const touchEndY = e.changedTouches[0].clientY;
    if (this._touchStartY - touchEndY > 60) {
      // 上滑超过60px，取消录音
      this.cancelRecording();
      return;
    }

    recorderManager.stop();
  },

  // 取消录音
  cancelRecording: function() {
    if (!recorderManager) return;

    recorderManager.stop();
    this.setData({
      isRecording: false,
      inputText: ''
    });

    wx.showToast({ title: '已取消', icon: 'none', duration: 1000 });
  }
})
