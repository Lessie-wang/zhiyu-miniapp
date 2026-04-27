// 感官写作训练页面
const aiUtils = require('../../utils/ai.js');

// 情绪场景
const scenarios = [
  { id: 'rainy_sadness', title: '雨天的忧伤', iconType: 'rain', description: '窗外下着雨，心里有些沉重' },
  { id: 'good_news_joy', title: '收到好消息', iconType: 'star', description: '期待已久的好消息终于来了' },
  { id: 'late_night_lonely', title: '深夜的孤独', iconType: 'moon', description: '夜深了，只有自己还醒着' },
  { id: 'spring_hope', title: '春天的期待', iconType: 'flower', description: '万物复苏，心中涌起希望' },
  { id: 'anger_moment', title: '被误解的愤怒', iconType: 'flame', description: '明明不是那样，却没人理解' },
  { id: 'peaceful_morning', title: '安静的早晨', iconType: 'sun', description: '一个人的清晨，世界很安静' },
  { id: 'custom', title: '自定义场景', iconType: 'pen', description: '写下你此刻的状态', isCustom: true }
];

// 五感定义
const senses = [
  { key: 'sight', label: '视觉', iconType: 'eye', hint: '描述你看到的画面...' },
  { key: 'hearing', label: '听觉', iconType: 'ear', hint: '描述你听到的声音...' },
  { key: 'touch', label: '触觉', iconType: 'hand', hint: '描述你触碰到的感觉...' },
  { key: 'smell', label: '嗅觉', iconType: 'nose', hint: '描述你闻到的气味...' },
  { key: 'taste', label: '味觉', iconType: 'drop', hint: '描述你尝到的味道...' }
];

// 本地 fallback 引导语（更实操、降低文艺感）
const localGuides = {
  sight: (title) => `想象"${title}"的画面——你看到了什么？比如光线是明是暗、周围有什么颜色、远处近处各有什么。`,
  hearing: (title) => `在"${title}"的场景里，你听到了什么？可以是人声、风声、雨声，甚至是安静本身。`,
  touch: (title) => `"${title}"的时候，你的身体有什么感觉？比如手心的温度、衣服的触感、风吹过皮肤。`,
  smell: (title) => `"${title}"的空气里有什么味道？比如雨后的泥土味、咖啡香、或者某个熟悉的气味。`,
  taste: (title) => `"${title}"的时候嘴里有什么味道？可以是刚喝的水、嘴唇的干涩、或者某种说不清的滋味。`
};

// 词语卡片池：按场景×感官预置词语
const senseChips = {
  rainy_sadness: {
    sight: ['灰蒙蒙的天', '窗上的水珠', '昏黄的路灯', '模糊的远方', '积水的倒影', '撑伞的行人'],
    hearing: ['雨滴敲窗', '远处的雷声', '屋檐滴水', '车轮溅水声', '风穿过巷子', '安静的叹息'],
    touch: ['冰凉的玻璃', '潮湿的空气', '湿透的衣角', '手心的温热', '冷风拂面', '被子的温暖'],
    smell: ['泥土的清新', '潮湿的味道', '雨后青草味', '混着灰尘的水汽', '窗台的霉味', '咖啡的香气'],
    taste: ['嘴唇的涩', '热茶的苦甘', '眼泪的咸', '雨水的清淡', '喉咙的干涩', '糖果的甜']
  },
  good_news_joy: {
    sight: ['手机屏幕的光', '模糊的文字', '窗外的阳光', '眼眶的泪花', '嘴角上扬', '周围的色彩'],
    hearing: ['心跳加速', '自己的笑声', '消息提示音', '耳边的风声', '远处的音乐', '朋友的祝贺'],
    touch: ['心口的悸动', '紧握的拳头', '发烫的脸颊', '手心的汗', '拥抱的温度', '跳跃的双脚'],
    smell: ['空气变甜了', '花香飘来了', '阳光的味道', '新书的墨香', '蛋糕的甜香', '清晨的空气'],
    taste: ['嘴里发甜', '庆祝的饮料', '开心的巧克力', '微笑的味道', '嘴唇抿着的笑', '甜甜的口水']
  },
  late_night_lonely: {
    sight: ['台灯的光晕', '手机的蓝光', '天花板的阴影', '空荡的房间', '窗外的夜色', '时钟的指针'],
    hearing: ['时钟的滴答', '冰箱的嗡鸣', '远处的车声', '自己的呼吸', '楼上的脚步', '风吹过窗缝'],
    touch: ['冰凉的床单', '枕头的柔软', '蜷缩的身体', '手机的余温', '被子裹紧', '眼皮的沉重'],
    smell: ['夜的清冷', '洗衣液的残香', '泡面的味道', '枕头上的味道', '深夜的空气', '指尖的烟味'],
    taste: ['嘴里的干涩', '最后一口水', '夜宵的残味', '牙膏的薄荷', '说不出的苦', '深夜的空']
  },
  spring_hope: {
    sight: ['嫩绿的芽', '湛蓝的天', '粉色的花瓣', '飞舞的蝴蝶', '拉长的影子', '透过叶的光'],
    hearing: ['鸟鸣声', '风吹树叶', '孩子的笑', '流水声', '远处的歌', '蜜蜂的嗡嗡'],
    touch: ['暖风拂面', '草地的柔软', '花瓣的丝滑', '阳光的温热', '泥土的松软', '微凉的风'],
    smell: ['花香阵阵', '青草味', '泥土的芬芳', '春雨的气息', '新鲜的空气', '树木的清香'],
    taste: ['春茶的清甜', '草莓的酸甜', '嘴唇的润', '清风的味道', '新芽的清苦', '蜂蜜的甜']
  },
  anger_moment: {
    sight: ['发红的眼眶', '攥紧的手', '模糊的视线', '对方的表情', '桌上的杯子', '颤抖的手指'],
    hearing: ['心跳擂鼓', '刺耳的话语', '嗡嗡的耳鸣', '自己的喘息', '摔门的声响', '沉默更响'],
    touch: ['发烫的脸', '绷紧的肩膀', '咬紧的牙', '手心掐的痛', '胸口的压迫', '后背的僵硬'],
    smell: ['空气在燃烧', '呛人的气氛', '汗水的味道', '冲上头的血腥', '烟的刺鼻', '闷热的空气'],
    taste: ['嘴里发苦', '咬破的嘴唇', '咽下去的话', '铁锈的味道', '喉咙的哽', '不甘的酸']
  },
  peaceful_morning: {
    sight: ['窗帘缝的光', '杯中的热气', '安静的街道', '书页的纹理', '绿植的叶子', '桌上的摆设'],
    hearing: ['鸟叫声', '水壶的咕噜', '翻书的沙沙', '远处的晨钟', '猫咪的呼噜', '自己的呼吸'],
    touch: ['温热的杯子', '柔软的拖鞋', '微凉的空气', '头发蓬松', '伸懒腰的舒展', '阳光晒手背'],
    smell: ['咖啡的香', '面包的焦香', '清晨的空气', '牙膏的清凉', '窗外的草味', '干净衣服的味'],
    taste: ['第一口水', '牙膏的薄荷', '早餐的温热', '咖啡的微苦', '嘴唇的干', '蜂蜜的甜润']
  }
};

// 每个感官的示例模板（帮助用户上手）
const senseExamples = {
  sight: '例如：窗外的天灰蒙蒙的，路灯发出昏黄的光，行人撑着各色的伞匆匆走过。',
  hearing: '例如：雨滴打在窗户上噼啪作响，远处偶尔传来一声汽车喇叭，屋里的时钟在滴答走。',
  touch: '例如：手里捧着一杯热茶，杯壁有点烫，毛毯裹在身上软软的，脚趾有点凉。',
  smell: '例如：空气里有雨后泥土的清新味道，混着隔壁飘来的饭菜香，还有一点点潮湿的味道。',
  taste: '例如：嘴里还留着刚才那口茶的回甘，有点涩又有点甜，嘴唇因为干燥微微发紧。'
};

Page({
  data: {
    currentPhase: 'select',
    scenarios: scenarios,
    selectedScenario: null,

    senses: senses,
    currentSenseIndex: 0,
    currentInput: '',
    senseWritings: { sight: '', hearing: '', touch: '', smell: '', taste: '' },
    aiGuideText: '',
    isAIThinking: false,

    combinedPiece: '',
    isSaved: false,

    // 写作模式：quick（选3感）/ full（5感）
    writeMode: 'quick',
    selectedSenses: [],
    selectedSensesMap: {},
    activeSenses: senses, // 当前激活的感官列表

    // 词语卡片
    currentChips: [],
    usedChips: {},

    // 历史作品
    historyWritings: [],
    viewingWriting: null
  },

  onLoad(options) {
    this.loadHistory();

    // 检查是否有自定义场景参数
    if (options.customTitle && options.customDesc) {
      const customScenario = {
        id: 'custom_' + Date.now(),
        title: decodeURIComponent(options.customTitle),
        iconType: 'star',
        description: decodeURIComponent(options.customDesc)
      };

      // 直接设置场景并开始写作（自定义场景默认完整模式）
      this.setData({
        selectedScenario: customScenario,
        currentPhase: 'writing',
        currentSenseIndex: 0,
        currentInput: '',
        writeMode: 'full',
        activeSenses: senses,
        senseExample: senseExamples[senses[0].key] || '',
        currentChips: [],
        usedChips: {}
      });

      // 获取 AI 引导
      this.fetchAIGuide(0);
    }
  },

  onShow() {
    this.loadHistory();
  },

  loadHistory() {
    const writings = wx.getStorageSync('sensoryWritings') || [];
    this.setData({ historyWritings: writings });
  },

  // === Phase 1: 选择场景 ===
  selectScenario(e) {
    const id = e.currentTarget.dataset.id;
    const scenario = scenarios.find(s => s.id === id);

    if (scenario.isCustom) {
      wx.showModal({
        title: '自定义场景',
        editable: true,
        placeholderText: '描述你此刻的状态或场景...',
        success: (res) => {
          if (res.confirm && res.content && res.content.trim()) {
            const customScenario = {
              id: 'custom_' + Date.now(),
              title: res.content.trim().substring(0, 10),
              iconType: 'star',
              description: res.content.trim()
            };
            // 直接开始写作，不需要再点击"开始写作"按钮（自定义场景默认完整模式）
            const senseKey = senses[0].key;
            this.setData({
              selectedScenario: customScenario,
              currentPhase: 'writing',
              currentSenseIndex: 0,
              currentInput: '',
              writeMode: 'full',
              activeSenses: senses,
              senseExample: senseExamples[senseKey] || '',
              currentChips: [],
              usedChips: {}
            });
            wx.vibrateShort({ type: 'medium' });
            this.fetchAIGuide(0);
          }
        }
      });
    } else {
      this.setData({ selectedScenario: scenario });
    }
    wx.vibrateShort({ type: 'light' });
  },

  // 模式切换
  switchMode(e) {
    const mode = e.currentTarget.dataset.mode;
    this.setData({ writeMode: mode, selectedSenses: [], selectedSensesMap: {} });
    wx.vibrateShort({ type: 'light' });
  },

  // 快速模式：选择/取消感官
  toggleSense(e) {
    const key = e.currentTarget.dataset.key;
    let { selectedSenses } = this.data;
    const idx = selectedSenses.indexOf(key);
    if (idx > -1) {
      selectedSenses.splice(idx, 1);
    } else if (selectedSenses.length < 3) {
      selectedSenses.push(key);
    } else {
      wx.showToast({ title: '最多选3个感官', icon: 'none' });
      return;
    }
    // 构建 map 供 WXML 判断选中状态
    const map = {};
    selectedSenses.forEach(k => { map[k] = true; });
    this.setData({ selectedSenses: [...selectedSenses], selectedSensesMap: map });
    wx.vibrateShort({ type: 'light' });
  },

  startWriting() {
    if (!this.data.selectedScenario) {
      wx.showToast({ title: '请先选择一个场景', icon: 'none' });
      return;
    }

    const { writeMode, selectedSenses } = this.data;
    let activeSenses;
    if (writeMode === 'quick') {
      if (selectedSenses.length < 3) {
        wx.showToast({ title: '请选择3个感官', icon: 'none' });
        return;
      }
      activeSenses = senses.filter(s => selectedSenses.includes(s.key));
    } else {
      activeSenses = senses;
    }

    const senseKey = activeSenses[0].key;
    const scenarioId = this.data.selectedScenario.id;
    const chipPool = senseChips[scenarioId];
    const chips = chipPool ? (chipPool[senseKey] || []) : [];

    this.setData({
      currentPhase: 'writing',
      activeSenses: activeSenses,
      currentSenseIndex: 0,
      currentInput: '',
      senseExample: senseExamples[senseKey] || '',
      currentChips: chips,
      usedChips: {}
    });
    wx.vibrateShort({ type: 'medium' });
    this.fetchAIGuide(0);
  },

  // 词语卡片点击
  tapChip(e) {
    const chip = e.currentTarget.dataset.chip;
    const { currentInput, usedChips } = this.data;
    if (usedChips[chip]) return;

    const separator = currentInput.trim() ? '，' : '';
    const newInput = currentInput + separator + chip;
    usedChips[chip] = true;

    this.setData({ currentInput: newInput, usedChips: { ...usedChips } });
    wx.vibrateShort({ type: 'light' });
  },

  // 更新当前感官的卡片
  _updateChips(senseKey) {
    const scenarioId = this.data.selectedScenario.id;
    const chipPool = senseChips[scenarioId];
    const chips = chipPool ? (chipPool[senseKey] || []) : [];
    this.setData({ currentChips: chips, usedChips: {} });
  },

  // === Phase 2: 五感写作 ===
  fetchAIGuide(senseIndex) {
    const sense = this.data.activeSenses[senseIndex];
    const scenario = this.data.selectedScenario;
    this.setData({ isAIThinking: true, aiGuideText: '' });

    const systemPrompt = `你是知愈的感官写作引导师，一位温暖的写作教练。

角色：用富有画面感的问题引导用户通过感官描述来具象化情绪。
当前场景：${scenario.title} — ${scenario.description}
当前感官：${sense.label}

要求：
- 用一个具体的、与场景紧密相关的问题引导用户
- 回复控制在30-50字
- 语气温暖亲近，用"你"而非"您"
- 可以给一个小小的示例片段来启发用户`;

    const messages = [{ role: 'user', content: `请为"${scenario.title}"的${sense.label}维度生成引导` }];

    aiUtils.callDeepSeekAPIWithSystemPrompt(systemPrompt, messages)
      .then(reply => {
        this.setData({ aiGuideText: reply, isAIThinking: false });
      })
      .catch(() => {
        this.setData({
          aiGuideText: localGuides[sense.key](scenario.title),
          isAIThinking: false
        });
      });
  },

  onInputChange(e) {
    this.setData({ currentInput: e.detail.value });
  },

  nextSense() {
    const { currentSenseIndex, currentInput, senseWritings, activeSenses } = this.data;
    const currentKey = activeSenses[currentSenseIndex].key;
    const lastIndex = activeSenses.length - 1;

    if (!currentInput.trim()) {
      wx.showToast({ title: '写点什么再继续吧', icon: 'none' });
      return;
    }

    senseWritings[currentKey] = currentInput.trim();

    if (currentSenseIndex < lastIndex) {
      const nextIndex = currentSenseIndex + 1;
      const nextKey = activeSenses[nextIndex].key;
      this.setData({
        senseWritings,
        currentSenseIndex: nextIndex,
        currentInput: senseWritings[nextKey] || '',
        senseExample: senseExamples[nextKey] || ''
      });
      this._updateChips(nextKey);
      this.fetchAIGuide(nextIndex);
    } else {
      this.setData({ senseWritings, currentPhase: 'generating' });
      this.generateCombinedPiece();
    }

    wx.vibrateShort({ type: 'light' });
  },

  prevSense() {
    const { currentSenseIndex, currentInput, senseWritings, activeSenses } = this.data;
    if (currentSenseIndex === 0) return;

    const currentKey = activeSenses[currentSenseIndex].key;
    senseWritings[currentKey] = currentInput.trim();

    const prevIndex = currentSenseIndex - 1;
    const prevKey = activeSenses[prevIndex].key;
    this.setData({
      senseWritings,
      currentSenseIndex: prevIndex,
      currentInput: senseWritings[prevKey] || '',
      senseExample: senseExamples[prevKey] || ''
    });
    this._updateChips(prevKey);
    this.fetchAIGuide(prevIndex);
  },

  // === Phase 3: 生成融合作品 ===
  generateCombinedPiece() {
    const { selectedScenario, senseWritings, activeSenses } = this.data;

    const senseLabels = { sight: '视觉', hearing: '听觉', touch: '触觉', smell: '嗅觉', taste: '味觉' };
    const senseDescriptions = activeSenses
      .map(s => `${senseLabels[s.key]}：${senseWritings[s.key] || ''}`)
      .filter(line => !line.endsWith('：'))
      .join('\n');

    const senseCount = activeSenses.length === 5 ? '五感' : `${activeSenses.length}感`;

    const systemPrompt = `你是知愈的感官写作引导师。用户刚完成了一次感官写作训练。

场景：${selectedScenario.title} — ${selectedScenario.description}

用户的${senseCount}描述：
${senseDescriptions}

请将以上感官描述融合成一段完整的、优美的情绪描写文字。要求：
- 保留用户原始表达的精华和个人风格
- 自然地将感官串联，不要机械罗列
- 控制在150-250字
- 文字温暖、有文学感
- 在结尾处轻轻点明情绪的本质
- 不要添加用户没有表达过的内容`;

    const messages = [{ role: 'user', content: '请将我的感官描述融合成一段完整的文字' }];

    aiUtils.callDeepSeekAPIWithSystemPrompt(systemPrompt, messages)
      .then(reply => {
        this.setData({ combinedPiece: reply, currentPhase: 'complete' });
      })
      .catch(() => {
        const fallback = activeSenses.map(s => senseWritings[s.key] || '').filter(Boolean).join(' ');
        this.setData({ combinedPiece: fallback, currentPhase: 'complete' });
      });
  },

  // === Phase 4: 保存 ===
  saveWriting() {
    const session = {
      id: Date.now(),
      scenarioId: this.data.selectedScenario.id,
      scenarioTitle: this.data.selectedScenario.title,
      scenarioIcon: this.data.selectedScenario.iconType,
      senseWritings: this.data.senseWritings,
      combinedPiece: this.data.combinedPiece,
      createdAt: new Date().toISOString()
    };

    let writings = wx.getStorageSync('sensoryWritings') || [];
    writings.unshift(session);
    wx.setStorageSync('sensoryWritings', writings);

    this.setData({ isSaved: true, historyWritings: writings });
    wx.vibrateShort({ type: 'medium' });
    wx.showToast({ title: '作品已保存', icon: 'success' });
  },

  // === 历史作品 ===
  viewHistory() {
    this.setData({ currentPhase: 'history' });
  },

  viewWritingDetail(e) {
    const id = e.currentTarget.dataset.id;
    const writing = this.data.historyWritings.find(w => w.id === id);
    if (writing) {
      this.setData({ viewingWriting: writing, currentPhase: 'detail' });
    }
  },

  backFromDetail() {
    this.setData({ currentPhase: 'history', viewingWriting: null });
  },

  backFromHistory() {
    this.setData({ currentPhase: 'select' });
  },

  deleteWriting(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '删除作品',
      content: '确定要删除这篇作品吗？',
      confirmText: '删除',
      success: (res) => {
        if (res.confirm) {
          let writings = this.data.historyWritings.filter(w => w.id !== id);
          wx.setStorageSync('sensoryWritings', writings);
          this.setData({ historyWritings: writings, currentPhase: 'history', viewingWriting: null });
          wx.showToast({ title: '已删除', icon: 'success' });
        }
      }
    });
  },

  startOver() {
    this.setData({
      currentPhase: 'select',
      selectedScenario: null,
      currentSenseIndex: 0,
      currentInput: '',
      senseWritings: { sight: '', hearing: '', touch: '', smell: '', taste: '' },
      aiGuideText: '',
      combinedPiece: '',
      isSaved: false,
      writeMode: 'quick',
      selectedSenses: [],
      selectedSensesMap: {},
      activeSenses: senses,
      currentChips: [],
      usedChips: {}
    });
  },

  goBack() {
    wx.navigateBack();
  },

  onShareAppMessage() {
    return {
      title: `知愈 · ${this.data.selectedScenario ? this.data.selectedScenario.title : '感官写作训练'}`,
      path: '/pages/training/training'
    };
  }
});
