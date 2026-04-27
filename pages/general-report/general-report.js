// pages/general-report/general-report.js
const cloudUtil = require('../../utils/cloud.js');

Page({
  data: {
    selectedPeriod: 'month',
    periodOptions: [
      { label: '本周', value: 'week' },
      { label: '本月', value: 'month' },
      { label: '三个月', value: 'quarter' }
    ],
    dateRange: '',
    totalRecords: 0,
    avgMood: '--',
    moodTrend: '--',
    emotionDistribution: [],
    aiSummary: '记录更多情绪数据，AI 将为你生成个性化的情绪分析报告。',
    suggestions: []
  },

  onLoad(options) {
    this.loadReportData();
  },

  // 加载报告数据
  loadReportData() {
    this.calculateDateRange();

    const timeRangeMap = {
      'week': 'week',
      'month': 'month',
      'quarter': 'all'
    };
    const timeRange = timeRangeMap[this.data.selectedPeriod] || 'all';

    // 从云端获取统计数据
    cloudUtil.getEmotionStatsFromCloud(timeRange).then(stats => {
      if (stats) {
        this.setData({
          totalRecords: stats.totalRecords || 0,
          emotionDistribution: stats.emotionStats || [],
          avgMood: this.calcAvgMood(stats.emotionStats),
          aiSummary: stats.aiSummary || '记录更多情绪数据，AI 将为你生成分析报告。'
        });
        this.generateSuggestions(stats.emotionStats);
      }
    }).catch(err => {
      console.error('加载报告数据失败', err);
    });

    // 获取记录用于趋势分析
    cloudUtil.getEmotionsFromCloud({ limit: 100 }).then(result => {
      if (result.records && result.records.length > 0) {
        this.analyzeTrend(result.records);
      }
    }).catch(err => {
      console.error('加载记录失败', err);
    });
  },

  // 计算平均情绪
  calcAvgMood(emotionStats) {
    if (!emotionStats || emotionStats.length === 0) return '--';
    const positiveEmotions = ['开心', '平静', '感动'];
    const negativeEmotions = ['难过', '焦虑', '愤怒', '烦躁'];

    let positiveCount = 0;
    let negativeCount = 0;
    emotionStats.forEach(e => {
      if (positiveEmotions.includes(e.name)) positiveCount += e.count;
      if (negativeEmotions.includes(e.name)) negativeCount += e.count;
    });

    if (positiveCount > negativeCount * 2) return '很好';
    if (positiveCount > negativeCount) return '良好';
    if (positiveCount === negativeCount) return '一般';
    return '需要关注';
  },

  // 分析情绪趋势
  analyzeTrend(records) {
    if (records.length < 2) {
      this.setData({ moodTrend: '--' });
      return;
    }

    const positiveEmotions = ['开心', '平静', '感动'];
    const mid = Math.floor(records.length / 2);
    const recentRecords = records.slice(0, mid);
    const olderRecords = records.slice(mid);

    const recentPositiveRate = recentRecords.filter(r => positiveEmotions.includes(r.emotion)).length / recentRecords.length;
    const olderPositiveRate = olderRecords.filter(r => positiveEmotions.includes(r.emotion)).length / olderRecords.length;

    let trend = '→ 平稳';
    if (recentPositiveRate > olderPositiveRate + 0.1) trend = '↑ 上升';
    else if (recentPositiveRate < olderPositiveRate - 0.1) trend = '↓ 下降';

    this.setData({ moodTrend: trend });
  },

  // 根据情绪分布生成建议
  generateSuggestions(emotionStats) {
    if (!emotionStats || emotionStats.length === 0) return;

    const suggestions = [];
    const topEmotion = emotionStats[0];

    const adviceMap = {
      '开心': { icon: '🌟', title: '保持积极心态', description: '你最近心情不错，可以记录下让你开心的事情，在低落时回顾' },
      '平静': { icon: '🧘', title: '享受内心平静', description: '平静是很好的状态，可以尝试冥想来进一步提升内在觉察' },
      '难过': { icon: '💙', title: '允许自己难过', description: '难过是正常的情绪，试着和信任的人聊聊，或者写下你的感受' },
      '累': { icon: '💤', title: '注意休息', description: '适当调整工作和生活节奏，保证充足的睡眠时间' },
      '烦躁': { icon: '🌿', title: '尝试放松', description: '深呼吸或短暂散步可以帮助缓解烦躁，找到让自己平静的方式' },
      '焦虑': { icon: '🫧', title: '缓解焦虑', description: '识别焦虑的来源，尝试正念冥想或适度运动来缓解' },
      '愤怒': { icon: '🔥', title: '合理表达情绪', description: '找到合适的方式表达愤怒，避免压抑，运动是很好的释放方式' },
      '感动': { icon: '💕', title: '珍惜温暖时刻', description: '记录下这些感动的瞬间，它们是生活中珍贵的部分' },
      '困惑': { icon: '🔍', title: '给自己时间', description: '困惑时不必急于找到答案，可以和他人交流获取新的视角' },
      '无聊': { icon: '🎨', title: '探索新事物', description: '尝试新的活动或爱好，为生活增添色彩和新鲜感' }
    };

    if (topEmotion && adviceMap[topEmotion.name]) {
      suggestions.push({ id: 1, ...adviceMap[topEmotion.name] });
    }

    suggestions.push(
      { id: 2, icon: '📝', title: '坚持记录', description: '持续记录情绪可以帮助你更好地了解自己的情绪模式' },
      { id: 3, icon: '🏃', title: '适度运动', description: '每天30分钟的运动可以有效改善情绪状态' }
    );

    this.setData({ suggestions });
  },

  // 计算日期范围
  calculateDateRange() {
    const now = new Date();
    let startDate;

    switch(this.data.selectedPeriod) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'quarter':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
    }

    const dateRange = `${this.formatDate(startDate)} - ${this.formatDate(now)}`;
    this.setData({ dateRange });
  },

  formatDate(date) {
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  },

  // 选择周期
  selectPeriod(e) {
    const period = e.currentTarget.dataset.value;
    this.setData({ selectedPeriod: period });
    this.loadReportData();
  },

  // 导出报告
  exportReport() {
    wx.showActionSheet({
      itemList: ['保存为图片', '导出为PDF'],
      success: (res) => {
        wx.showToast({ title: '功能开发中', icon: 'none' });
      }
    });
  }
});
