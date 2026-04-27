// 我的历史页面
const cloudUtil = require('../../utils/cloud.js');
const aiUtils = require('../../utils/ai.js');

// 情绪颜色映射（莫兰迪色系）
const EMOTION_COLORS = {
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
  '不知道': '#BCBCBC'
};

// 将 Date 对象转为本地时间字符串 "YYYY-MM-DD HH:mm"
function toLocalDateTimeStr(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

Page({
  data: {
    // 用户信息
    userInfo: {
      nickname: '知愈用户',
      avatar: '',
      motto: '',
      useDays: 0,
      recordCount: 0
    },

    // 日历数据
    currentYear: 0,
    currentMonth: 0,
    calendarDays: [],
    selectedDate: '',

    // 统计数据
    timeRange: 'all', // all, week, month
    emotionStats: [],
    totalRecords: 0,

    // AI报告
    aiSummary: '',

    // 记录数据
    records: [],
    selectedDayRecords: [],
    showDayDetail: false,
    showStats: false
  },

  onLoad() {
    this.initUserInfo();
    this.initCalendar();
    this.loadRecords();
  },

  onShow() {
    this.initUserInfo();
    this.loadRecords();
  },

  // 初始化用户信息
  initUserInfo() {
    const firstUseDate = wx.getStorageSync('firstUseDate');

    let useDays = 0;
    if (firstUseDate) {
      const now = new Date();
      const first = new Date(firstUseDate);
      useDays = Math.floor((now - first) / (1000 * 60 * 60 * 24)) + 1;
    }

    const savedUserInfo = wx.getStorageSync('userInfo') || {};

    this.setData({
      'userInfo.nickname': savedUserInfo.nickName || '知愈用户',
      'userInfo.avatar': savedUserInfo.avatarUrl || '',
      'userInfo.motto': savedUserInfo.motto || '',
      'userInfo.useDays': useDays,
      'userInfo.recordCount': 0  // 由 loadRecords 更新为实际总次数
    });
  },

  // 初始化日历
  initCalendar() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    this.setData({
      currentYear: year,
      currentMonth: month
    });

    this.generateCalendar(year, month);
  },

  // 生成日历数据
  generateCalendar(year, month) {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startWeekday = firstDay.getDay();

    const calendarDays = [];
    const records = this.data.records || [];

    // 填充空白日期
    for (let i = 0; i < startWeekday; i++) {
      calendarDays.push({ day: '', isEmpty: true });
    }

    // 填充实际日期
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayRecords = records.filter(r => r.date && r.date.startsWith(dateStr));

      // 获取当天的主要情绪（支持多情绪）
      let emotion = '';
      let emotionIcon = '';
      if (dayRecords.length > 0) {
        const emotionCount = {};
        dayRecords.forEach(r => {
          const emotions = r.emotions || [r.emotion];
          emotions.forEach(e => {
            if (e) emotionCount[e] = (emotionCount[e] || 0) + 1;
          });
        });
        emotion = Object.keys(emotionCount).reduce((a, b) =>
          emotionCount[a] > emotionCount[b] ? a : b
        );
        emotionIcon = this.getEmotionIconType(emotion);
      }

      const isToday = dateStr === this.formatDate(new Date());

      calendarDays.push({
        day,
        dateStr,
        hasRecord: dayRecords.length > 0,
        recordCount: dayRecords.length,
        emotion,
        emotionIcon,
        emotionColor: emotion ? (EMOTION_COLORS[emotion] || '#D4B8A5') : '',
        isToday
      });
    }

    this.setData({ calendarDays });
  },

  // 获取情绪图标类型（用于CSS图标渲染）
  getEmotionIconType(emotion) {
    const iconTypeMap = {
      '开心': 'happy',
      '平静': 'calm',
      '难过': 'sad',
      '累': 'tired',
      '烦躁': 'irritated',
      '焦虑': 'anxious',
      '愤怒': 'angry',
      '感动': 'touched',
      '困惑': 'confused',
      '无聊': 'bored',
      '震惊': 'shocked',
      '不知道': 'unknown'
    };
    return iconTypeMap[emotion] || 'custom';
  },

  // 获取情绪颜色
  getEmotionColor(emotion) {
    return EMOTION_COLORS[emotion] || '#D4B8A5';
  },

  // 切换月份
  changeMonth(e) {
    const direction = e.currentTarget.dataset.direction;
    let { currentYear, currentMonth } = this.data;

    if (direction === 'prev') {
      currentMonth--;
      if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
      }
    } else {
      currentMonth++;
      if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
      }
    }

    this.setData({ currentYear, currentMonth });
    this.generateCalendar(currentYear, currentMonth);
  },

  // 点击日期
  selectDate(e) {
    const { datestr } = e.currentTarget.dataset;
    if (!datestr) return;

    // 重新从最新的 records 中过滤，确保显示最新数据
    const records = this.data.records || [];
    const dayRecords = records.filter(r => r.date && r.date.startsWith(datestr));

    if (dayRecords.length > 0) {
      // 按时间倒序排列，最新的记录在前
      dayRecords.sort((a, b) => {
        const timeA = new Date(a.timestamp || a.date).getTime();
        const timeB = new Date(b.timestamp || b.date).getTime();
        return timeB - timeA;
      });

      this.setData({
        selectedDate: datestr,
        selectedDayRecords: dayRecords,
        showDayDetail: true
      });
    }
  },

  // 关闭日期详情
  closeDayDetail() {
    this.setData({ showDayDetail: false });
  },

  // 阻止弹窗内部点击冒泡关闭
  preventClose() {},

  // 加载记录（优先从云端获取）
  loadRecords() {
    cloudUtil.getEmotionsFromCloud({ limit: 100 }).then(result => {
      // 将云端数据格式转换为页面使用的格式
      const records = result.records.map(r => {
        const bodyFeelings = r.bodyFeelings || [];
        // 用本地时间而非 UTC
        const localDateTime = r.recordDate ? toLocalDateTimeStr(r.recordDate) : '';
        const localTime = localDateTime ? localDateTime.split(' ')[1] : '';
        // 优先用 recordTime（新数据），否则从 recordDate 提取本地时间
        const displayTime = r.recordTime || localTime;
        // 区分新旧数据的强度制式：有 subEmotion 的是新数据(1-6制)，否则是旧数据(1-10制)
        const hasSubEmotion = !!r.subEmotion;

        // 兼容新旧数据：新数据有 emotions 数组，旧数据只有 emotion 字符串
        let emotions = [];
        let emotionIconTypes = [];
        let emotionColors = [];
        if (r.emotions && Array.isArray(r.emotions)) {
          emotions = r.emotions.map(e => e.name || e);
          emotionIconTypes = emotions.map(e => this.getEmotionIconType(e));
          emotionColors = emotions.map(e => this.getEmotionColor(e));
        } else if (r.emotion) {
          emotions = [r.emotion];
          emotionIconTypes = [this.getEmotionIconType(r.emotion)];
          emotionColors = [this.getEmotionColor(r.emotion)];
        }

        return {
          id: r._id,
          emotion: emotions[0] || '',
          emotions: emotions,
          emotionIconType: emotionIconTypes[0] || 'custom',
          emotionIconTypes: emotionIconTypes,
          emotionColors: emotionColors,
          intensity: r.intensity,
          subEmotion: r.subEmotion || '',
          hasSubEmotion: hasSubEmotion,
          note: r.note,
          bodyFeelings: bodyFeelings,
          bodyFeelingsText: bodyFeelings.join('、'),
          conversation: r.conversation || [],
          recordTime: displayTime,
          date: localDateTime,
          timestamp: r.createdAt
        };
      });

      this.setData({
        records,
        totalRecords: result.total || records.length,
        'userInfo.recordCount': result.total || records.length
      });

      // 用云端数据刷新日历和统计
      this.generateCalendar(this.data.currentYear, this.data.currentMonth);
      this.calculateStats();
      this.generateAISummary();
    }).catch(err => {
      console.error('云端加载失败，使用本地数据', err);
      // 降级到本地数据
      const records = wx.getStorageSync('emotionRecords') || [];
      this.setData({
        records,
        totalRecords: records.length,
        'userInfo.recordCount': records.length
      });
    });
  },

  // 展开/收起统计详情
  toggleStats() {
    this.setData({ showStats: !this.data.showStats });
    wx.vibrateShort({ type: 'light' });
  },

  // 切换统计时间范围
  switchTimeRange(e) {
    const range = e.currentTarget.dataset.range;
    this.setData({ timeRange: range });
    this.calculateStats();
  },

  // 计算统计数据
  calculateStats() {
    const { records, timeRange } = this.data;
    let filteredRecords = records;

    // 根据时间范围筛选
    if (timeRange === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      filteredRecords = records.filter(r => new Date(r.date) >= weekAgo);
    } else if (timeRange === 'month') {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      filteredRecords = records.filter(r => new Date(r.date) >= monthAgo);
    }

    // 统计各情绪出现次数（支持多情绪）
    const emotionCount = {};
    filteredRecords.forEach(record => {
      const emotions = record.emotions || [record.emotion];
      emotions.forEach(emotion => {
        if (emotion) {
          emotionCount[emotion] = (emotionCount[emotion] || 0) + 1;
        }
      });
    });

    // 转换为数组并排序
    const emotionStats = Object.keys(emotionCount).map(emotion => ({
      name: emotion,
      iconType: this.getEmotionIconType(emotion),
      color: this.getEmotionColor(emotion),
      count: emotionCount[emotion],
      percentage: Math.round((emotionCount[emotion] / filteredRecords.length) * 100)
    })).sort((a, b) => b.count - a.count);

    this.setData({ emotionStats });
  },

  // 生成AI摘要
  generateAISummary() {
    const { records } = this.data;

    if (records.length === 0) {
      this.setData({
        aiSummary: '开始记录你的情绪，AI 将为你生成个性化的情绪分析报告。'
      });
      return;
    }

    // 获取最近7天的记录
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const recentRecords = records.filter(r => new Date(r.date) >= weekAgo);

    if (recentRecords.length === 0) {
      this.setData({
        aiSummary: '最近7天没有记录，继续保持记录习惯，了解自己的情绪模式。'
      });
      return;
    }

    // 统计主要情绪（支持多情绪）
    const emotionCount = {};
    recentRecords.forEach(r => {
      const emotions = r.emotions || [r.emotion];
      emotions.forEach(e => {
        if (e) emotionCount[e] = (emotionCount[e] || 0) + 1;
      });
    });

    const mainEmotion = Object.keys(emotionCount).reduce((a, b) =>
      emotionCount[a] > emotionCount[b] ? a : b
    );

    const summary = `最近7天您记录了${recentRecords.length}次情绪，主要情绪是"${mainEmotion}"。${this.getEmotionAdvice(mainEmotion)}`;

    this.setData({ aiSummary: summary });
  },

  // 获取情绪建议
  getEmotionAdvice(emotion) {
    const adviceMap = {
      '开心': '保持这份愉悦的心情，可以记录下让你开心的事情。',
      '平静': '内心的平静是很好的状态，继续保持。',
      '难过': '允许自己感受难过，必要时可以寻求支持。',
      '累': '注意休息，适当调整工作和生活节奏。',
      '烦躁': '尝试深呼吸或短暂休息，找到让自己平静的方式。',
      '焦虑': '识别焦虑的来源，可以尝试冥想或运动来缓解。',
      '愤怒': '找到合适的方式表达情绪，避免压抑。',
      '感动': '珍惜这些温暖的时刻，它们是生活的美好。',
      '困惑': '给自己时间思考，必要时可以寻求他人的建议。',
      '无聊': '尝试新的活动或爱好，为生活增添色彩。',
      '震惊': '给自己时间消化和接受，慢慢调整。',
      '不知道': '这很正常，继续记录可以帮助你更好地认识自己。'
    };
    return adviceMap[emotion] || '继续记录，了解自己的情绪模式。';
  },

  // 查看完整报告
  viewFullReport() {
    wx.navigateTo({
      url: '/pages/general-report/general-report'
    });
  },

  // 生成月度AI报告
  generateMonthlyReport() {
    const { currentYear, currentMonth, records } = this.data;
    const monthStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;
    const monthRecords = records.filter(r => r.date && r.date.startsWith(monthStr));

    if (monthRecords.length === 0) {
      wx.showToast({ title: '本月暂无记录', icon: 'none' });
      return;
    }

    // 统计本月情绪分布
    const emotionCount = {};
    monthRecords.forEach(r => {
      const emotions = r.emotions || [r.emotion];
      emotions.forEach(e => {
        if (e) emotionCount[e] = (emotionCount[e] || 0) + 1;
      });
    });

    const emotionSummary = Object.entries(emotionCount)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => `${name}: ${count}次`)
      .join('、');

    wx.showLoading({ title: '生成报告中...' });

    const messages = [{
      role: 'user',
      content: `请基于以下${currentMonth + 1}月的情绪记录数据，生成一份温暖的月度情绪报告（250字以内）：\n\n本月共记录${monthRecords.length}次，情绪分布：${emotionSummary}\n\n请包含：\n1. 本月情绪模式概述\n2. 值得关注的积极/消极趋势\n3. 2-3条针对性的情绪调节建议\n\n语气温暖、不说教，可以用比喻让表达更生动。`
    }];

    aiUtils.callDeepSeekAPI(messages)
      .then(report => {
        wx.hideLoading();
        // 用弹窗展示月度报告
        wx.showModal({
          title: `${currentMonth + 1}月情绪报告`,
          content: report,
          showCancel: false,
          confirmText: '好的'
        });
      })
      .catch(err => {
        wx.hideLoading();
        console.error('月度报告生成失败:', err);
        // 降级为本地简单报告
        const mainEmotion = Object.keys(emotionCount).reduce((a, b) =>
          emotionCount[a] > emotionCount[b] ? a : b
        );
        wx.showModal({
          title: `${currentMonth + 1}月情绪报告`,
          content: `本月共记录${monthRecords.length}次情绪，主要情绪是"${mainEmotion}"。${this.getEmotionAdvice(mainEmotion)}`,
          showCancel: false,
          confirmText: '好的'
        });
      });
  },

  // 导出数据
  exportData() {
    wx.showActionSheet({
      itemList: ['导出全部数据', '导出本月数据', '导出本周数据'],
      success: (res) => {
        let records = this.data.records;
        let filename = '知愈情绪记录';

        switch(res.tapIndex) {
          case 0:
            filename += '_全部';
            break;
          case 1:
            const monthAgo = new Date();
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            records = records.filter(r => new Date(r.date) >= monthAgo);
            filename += '_本月';
            break;
          case 2:
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            records = records.filter(r => new Date(r.date) >= weekAgo);
            filename += '_本周';
            break;
        }

        this.generateCSV(records, filename);
      }
    });
  },

  // 生成CSV
  generateCSV(records, filename) {
    if (records.length === 0) {
      wx.showToast({
        title: '没有可导出的数据',
        icon: 'none'
      });
      return;
    }

    // CSV 表头
    let csv = '日期,时间,情绪,强度,子情绪,身体感受,备注\n';

    // CSV 数据
    records.forEach(record => {
      const [date, time] = record.date.split(' ');
      const note = (record.note || '').replace(/,/g, '，').replace(/\n/g, ' ');
      const subEmotion = (record.subEmotion || '').replace(/,/g, '，');
      const bodyFeelings = (record.bodyFeelingsText || '').replace(/,/g, '，');
      csv += `${date},${time || record.recordTime || ''},${record.emotion},${record.intensity},"${subEmotion}","${bodyFeelings}","${note}"\n`;
    });

    // 保存文件
    const fs = wx.getFileSystemManager();
    const filePath = `${wx.env.USER_DATA_PATH}/${filename}.csv`;

    fs.writeFile({
      filePath,
      data: csv,
      encoding: 'utf8',
      success: () => {
        wx.showModal({
          title: '导出成功',
          content: '数据已保存，是否分享？',
          confirmText: '分享',
          success: (res) => {
            if (res.confirm) {
              wx.shareFileMessage({
                filePath,
                success: () => {
                  wx.showToast({
                    title: '分享成功',
                    icon: 'success'
                  });
                },
                fail: () => {
                  wx.showToast({
                    title: '分享失败',
                    icon: 'none'
                  });
                }
              });
            }
          }
        });
      },
      fail: () => {
        wx.showToast({
          title: '导出失败',
          icon: 'none'
        });
      }
    });
  },

  // 前往设置
  goToSettings() {
    wx.navigateTo({
      url: '/pages/settings/settings'
    });
  },

  // 前往收藏金句
  goToFavoriteQuotes() {
    wx.navigateTo({
      url: '/pages/favorite-quotes/favorite-quotes'
    });
  },

  // 格式化日期
  formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  },

  onShareAppMessage() {
    return {
      title: '知愈 - 我的情绪历史',
      path: '/pages/history/history'
    };
  }
});
