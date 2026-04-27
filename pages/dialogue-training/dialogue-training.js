// 沉浸式模拟对话训练页面
const aiUtils = require('../../utils/ai.js');

// 预设场景数据（精简版，剧情由AI驱动）
const scenarioData = {
  1: {
    title: '日常沟通',
    difficulty: '初级',
    background: '你的好朋友小林最近情绪低落，约你出来喝咖啡，坐下后叹了口气。',
    npcName: '小林',
    npcAvatar: '😔',
    firstLine: '最近工作压力好大，每天加班到很晚，感觉自己快撑不住了……',
    focus: '倾听与共情表达'
  },
  2: {
    title: '表达拒绝',
    difficulty: '中级',
    background: '同事小王经常让你帮忙做额外工作，今天下班前你已经很累了，小王又走过来。',
    npcName: '小王',
    npcAvatar: '😊',
    firstLine: '嘿，这个报告明天要交，我今晚有约，你能帮我做一下吗？就跟上次一样。',
    focus: '温和而坚定的边界表达'
  },
  3: {
    title: '处理冲突',
    difficulty: '中级',
    background: '你和室友因为卫生问题产生了矛盾，你决定找TA谈谈。',
    npcName: '室友',
    npcAvatar: '😤',
    firstLine: '又怎么了？你是不是又要说卫生的事？',
    focus: '非暴力沟通与冲突化解'
  },
  4: {
    title: '安慰他人',
    difficulty: '初级',
    background: '你的朋友刚刚经历了分手，深夜给你发消息。',
    npcName: '朋友',
    npcAvatar: '😢',
    firstLine: '我们分手了……我不知道该怎么办……',
    focus: '陪伴与情感支持'
  }
};

Page({
  data: {
    scenario: null,
    currentPhase: 'intro', // intro, dialogue, summary
    currentRound: 0,
    messages: [],       // 对话气泡列表 [{role:'npc'|'user'|'coach', text:'', name:''}]
    roundData: [],      // 每轮数据 [{npc:'', user:'', score:0, coach:''}]
    inputText: '',
    isAIThinking: false,
    isCustom: false,
    // 总结数据
    summary: null,
    isSummaryLoading: false
  },

  onLoad: function(options) {
    var userProfile = wx.getStorageSync('userProfile') || null;
    this.setData({ userProfile: userProfile });

    if (options.scenarioId) {
      // 预设场景
      var id = parseInt(options.scenarioId);
      var scenario = scenarioData[id];
      if (scenario) {
        this.setData({ scenario: scenario });
      }
    } else if (options.customScene) {
      // 自定义场景 — 先展示加载，再由AI生成
      var desc = decodeURIComponent(options.customScene);
      this.setData({
        isCustom: true,
        currentPhase: 'loading'
      });
      this._generateCustomScene(desc);
    }
  },

  // AI 生成自定义场景
  _generateCustomScene: function(description) {
    var that = this;
    var prompt = aiUtils.generateCustomScenePrompt(description);
    aiUtils.callDeepSeekAPIWithSystemPrompt(prompt, [
      { role: 'user', content: description }
    ]).then(function(reply) {
      try {
        var data = JSON.parse(reply.replace(/```json\n?|\n?```/g, '').trim());
        var scenario = {
          title: data.title || '自定义场景',
          difficulty: data.difficulty || '中级',
          background: data.background || description,
          npcName: data.npcName || '对方',
          npcAvatar: data.npcAvatar || '🗣️',
          firstLine: data.firstLine || '……',
          focus: data.focus || '情绪表达与沟通'
        };
        that.setData({
          scenario: scenario,
          currentPhase: 'intro'
        });
      } catch (e) {
        console.error('解析自定义场景失败:', e);
        // 降级使用默认数据
        that.setData({
          scenario: {
            title: '自定义练习',
            difficulty: '中级',
            background: description,
            npcName: '对方',
            npcAvatar: '🗣️',
            firstLine: '……',
            focus: '情绪表达与沟通'
          },
          currentPhase: 'intro'
        });
      }
    }).catch(function(err) {
      console.error('生成自定义场景失败:', err);
      wx.showToast({ title: '场景生成失败', icon: 'none' });
      that.setData({
        scenario: {
          title: '自定义练习',
          difficulty: '中级',
          background: description,
          npcName: '对方',
          npcAvatar: '🗣️',
          firstLine: '请开始对话吧。',
          focus: '情绪表达与沟通'
        },
        currentPhase: 'intro'
      });
    });
  },

  // 开始训练
  startTraining: function() {
    var scenario = this.data.scenario;
    // 显示NPC第一句话
    var firstMessage = {
      role: 'npc',
      text: scenario.firstLine,
      name: scenario.npcName
    };
    this.setData({
      currentPhase: 'dialogue',
      currentRound: 1,
      messages: [firstMessage],
      roundData: [],
      inputText: ''
    });
    wx.vibrateShort({ type: 'medium' });
    this._scrollToBottom();
  },

  // 输入变化
  onInputChange: function(e) {
    this._inputValue = e.detail.value;
  },

  // 发送用户回复
  sendResponse: function() {
    var text = (this._inputValue !== undefined ? this._inputValue : this.data.inputText).trim();
    if (!text || this.data.isAIThinking) return;

    var messages = this.data.messages;

    // 添加用户气泡
    messages.push({ role: 'user', text: text });

    this._inputValue = '';
    this.setData({
      messages: messages,
      inputText: '',
      isAIThinking: true
    });

    wx.vibrateShort({ type: 'light' });
    this._scrollToBottom();

    // 调用AI获取NPC回应和教练点评
    this._getAIResponse(text);
  },

  // 调用AI
  _getAIResponse: function(userText) {
    var that = this;
    var scenario = this.data.scenario;
    var systemPrompt = aiUtils.generateTrainingPrompt(scenario, this.data.userProfile);
    // 把 NPC 开场白写进 system prompt（混元要求第一条消息必须是 user）
    systemPrompt += '\n\n你（' + scenario.npcName + '）的开场白是："' + scenario.firstLine + '"，用户已经看到了这句话，现在轮到用户回复你。请根据用户的回复继续对话。';

    // 构建对话历史（给AI看的）
    var historyMessages = [];
    // 历史对话
    var roundData = this.data.roundData;
    for (var i = 0; i < roundData.length; i++) {
      historyMessages.push({ role: 'user', content: roundData[i].user });
      historyMessages.push({ role: 'ai', content: roundData[i].npc });
    }
    // 当前用户回复
    historyMessages.push({ role: 'user', content: userText });

    aiUtils.callDeepSeekAPIWithSystemPrompt(systemPrompt, historyMessages)
      .then(function(reply) {
        that._handleAIResponse(reply, userText);
      })
      .catch(function(err) {
        console.error('AI回复失败:', err);
        // 降级：使用本地简单回复继续训练
        that._handleLocalFallback(userText);
      });
  },

  // 解析AI回复
  _handleAIResponse: function(reply, userText) {
    var messages = this.data.messages;
    var roundData = this.data.roundData;

    try {
      // 清理可能的 markdown 代码块包裹
      var cleaned = reply.replace(/```json\n?|\n?```/g, '').trim();
      // 尝试从混合文本中提取 JSON（AI 有时会在 JSON 前后添加文字）
      var jsonMatch = cleaned.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        cleaned = jsonMatch[0];
      }
      var data = JSON.parse(cleaned);

      var npcText = data.npc || '……';
      var coachText = data.coach || '';
      var score = data.score || 3;
      var isEnd = data.end || false;

      // 添加教练旁白
      if (coachText) {
        messages.push({ role: 'coach', text: coachText });
      }

      // 记录本轮数据
      roundData.push({
        npc: npcText,
        user: userText,
        score: score,
        coach: coachText
      });

      if (isEnd) {
        // 场景结束，NPC最后一句话后进入总结
        messages.push({ role: 'npc', text: npcText, name: this.data.scenario.npcName });
        this.setData({
          messages: messages,
          roundData: roundData,
          isAIThinking: false,
          currentRound: this.data.currentRound + 1
        });
        this._scrollToBottom();
        // 延迟一下再进入总结
        var that = this;
        setTimeout(function() {
          that._generateSummary();
        }, 1500);
      } else {
        // 添加NPC回应气泡
        messages.push({ role: 'npc', text: npcText, name: this.data.scenario.npcName });
        this.setData({
          messages: messages,
          roundData: roundData,
          isAIThinking: false,
          currentRound: this.data.currentRound + 1
        });
        this._scrollToBottom();
      }
    } catch (e) {
      console.error('解析AI回复失败:', e, reply);
      // 降级处理：把整个回复当NPC台词
      messages.push({ role: 'npc', text: reply, name: this.data.scenario.npcName });
      roundData.push({ npc: reply, user: userText, score: 3, coach: '' });
      this.setData({
        messages: messages,
        roundData: roundData,
        isAIThinking: false,
        currentRound: this.data.currentRound + 1
      });
      this._scrollToBottom();
    }
  },

  // API 失败时的本地降级回复
  _handleLocalFallback: function(userText) {
    var messages = this.data.messages;
    var roundData = this.data.roundData;
    var round = this.data.currentRound;
    var scenario = this.data.scenario;

    // 简单的本地NPC回复库
    var fallbackReplies = [
      { npc: '嗯……我听到你说的了。', coach: '不错的尝试，继续保持。' },
      { npc: '你真的这么想吗？', coach: '试试用"我感到……因为……"的句式表达。' },
      { npc: '好吧，我需要想想。', coach: '你表达了自己的立场，这很重要。' },
      { npc: '我没想到你会这么说。', coach: '注意观察对方的情绪变化。' },
      { npc: '也许你说得有道理……', coach: '沟通在起作用，继续。' }
    ];

    var idx = (round - 1) % fallbackReplies.length;
    var fallback = fallbackReplies[idx];
    var isEnd = round >= 4;

    messages.push({ role: 'coach', text: fallback.coach + '（AI暂时不可用，使用简化模式）' });
    roundData.push({ npc: fallback.npc, user: userText, score: 3, coach: fallback.coach });

    if (isEnd) {
      messages.push({ role: 'npc', text: '好，我们今天就聊到这里吧。', name: scenario.npcName });
      this.setData({
        messages: messages,
        roundData: roundData,
        isAIThinking: false,
        currentRound: round + 1
      });
      this._scrollToBottom();
      var that = this;
      setTimeout(function() { that._generateLocalSummary(); }, 1000);
    } else {
      messages.push({ role: 'npc', text: fallback.npc, name: scenario.npcName });
      this.setData({
        messages: messages,
        roundData: roundData,
        isAIThinking: false,
        currentRound: round + 1
      });
      this._scrollToBottom();
    }
  },

  // 本地生成简化总结（API不可用时）
  _generateLocalSummary: function() {
    var roundData = this.data.roundData;
    var totalRounds = roundData.length;
    var avgScore = 3;
    if (totalRounds > 0) {
      var sum = 0;
      for (var i = 0; i < roundData.length; i++) sum += roundData[i].score;
      avgScore = sum / totalRounds;
    }
    var totalScore = Math.round(avgScore * 20);
    var rating = totalScore >= 90 ? '共情达人' : totalScore >= 70 ? '稳步成长' : '初学探索';

    this.setData({
      currentPhase: 'summary',
      isSummaryLoading: false,
      summary: {
        totalScore: totalScore,
        rating: rating,
        highlights: ['完成了整个训练场景', '勇敢地表达了自己的想法'],
        improvements: ['下次可以尝试用"我感到…因为…我希望…"的表达方式'],
        insight: '',
        tip: '每一次练习都在进步。AI恢复后再试一次，会获得更详细的个性化反馈。'
      }
    });
  },

  // 手动结束训练
  endTrainingEarly: function() {
    var that = this;
    wx.showModal({
      title: '结束训练',
      content: '确定要结束当前场景吗？小知会为你生成训练总结。',
      confirmText: '结束',
      cancelText: '继续',
      success: function(res) {
        if (res.confirm) {
          that._generateSummary();
        }
      }
    });
  },

  // 生成训练总结
  _generateSummary: function() {
    var that = this;
    this.setData({
      currentPhase: 'summary',
      isSummaryLoading: true
    });

    var scenario = this.data.scenario;
    var roundData = this.data.roundData;
    var userProfile = this.data.userProfile;

    var summaryPrompt = aiUtils.generateTrainingSummaryPrompt(scenario, roundData, userProfile);
    aiUtils.callDeepSeekAPIWithSystemPrompt(summaryPrompt, [
      { role: 'user', content: '请生成训练总结' }
    ]).then(function(reply) {
      try {
        var cleaned = reply.replace(/```json\n?|\n?```/g, '').trim();
        var summary = JSON.parse(cleaned);
        that.setData({
          summary: summary,
          isSummaryLoading: false
        });
        // 存入 userInsights
        if (summary.insight) {
          that._saveInsight(summary.insight);
        }
        // 保存训练记录
        that._saveTrainingRecord();
      } catch (e) {
        console.error('解析总结失败:', e);
        that.setData({
          summary: {
            totalScore: 70,
            rating: '稳步成长',
            highlights: ['完成了整个训练场景'],
            improvements: ['继续练习，提升表达技巧'],
            insight: '',
            tip: '每一次练习都是进步，继续加油。'
          },
          isSummaryLoading: false
        });
        that._saveTrainingRecord();
      }
    }).catch(function(err) {
      console.error('生成总结失败:', err);
      that.setData({
        summary: {
          totalScore: 70,
          rating: '稳步成长',
          highlights: ['完成了整个训练场景'],
          improvements: ['继续练习'],
          insight: '',
          tip: '每一次练习都是进步。'
        },
        isSummaryLoading: false
      });
      that._saveTrainingRecord();
    });
  },

  // 存入用户洞察
  _saveInsight: function(insightText) {
    try {
      var insights = wx.getStorageSync('userInsights') || [];
      var now = new Date();
      var dateStr = now.getFullYear() + '-' +
        String(now.getMonth() + 1).padStart(2, '0') + '-' +
        String(now.getDate()).padStart(2, '0');
      insights.push({
        date: dateStr,
        text: '[表达训练] ' + insightText,
        source: 'training'
      });
      // 最多保留30条
      if (insights.length > 30) {
        insights = insights.slice(-30);
      }
      wx.setStorageSync('userInsights', insights);
    } catch (e) {
      console.error('保存洞察失败:', e);
    }
  },

  // 保存训练记录到本地
  _saveTrainingRecord: function() {
    try {
      var scenario = this.data.scenario;
      var record = {
        id: Date.now(),
        scenarioTitle: scenario.title,
        scenarioDifficulty: scenario.difficulty,
        scenarioFocus: scenario.focus,
        npcName: scenario.npcName,
        npcAvatar: scenario.npcAvatar,
        isCustom: this.data.isCustom,
        roundData: this.data.roundData,
        summary: this.data.summary,
        createdAt: new Date().toISOString().split('T')[0]
      };
      var records = wx.getStorageSync('trainingRecords') || [];
      records.unshift(record);
      if (records.length > 50) records = records.slice(0, 50);
      wx.setStorageSync('trainingRecords', records);
    } catch (e) {
      console.error('保存训练记录失败:', e);
    }
  },

  // 重新开始
  restartTraining: function() {
    this.setData({
      currentPhase: 'intro',
      currentRound: 0,
      messages: [],
      roundData: [],
      inputText: '',
      summary: null,
      isAIThinking: false,
      isSummaryLoading: false
    });
  },

  // 返回
  goBack: function() {
    wx.navigateBack();
  },

  // 滚动到底部
  _scrollToBottom: function() {
    var that = this;
    setTimeout(function() {
      that.setData({ scrollToView: 'msg-bottom' });
    }, 100);
  },

  onShareAppMessage: function() {
    var title = '知愈 · 表达训练';
    if (this.data.summary) {
      title = '知愈 · ' + this.data.scenario.title + ' — ' + this.data.summary.rating;
    }
    return {
      title: title,
      path: '/pages/training/training'
    };
  }
});
