// pages/emotion-report/emotion-report.js - 经期情绪监测报告
const cloudUtil = require('../../../utils/cloud.js');
const periodEmotionAnalysis = require('../../../utils/period-emotion-analysis.js');

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
    periodInsight: '记录更多情绪和经期数据，AI 将为你生成经期情绪关联分析。',
    phaseEmotions: [
      { phase: '经期前', icon: '🌙', emotions: [] },
      { phase: '经期中', icon: '🌸', emotions: [] },
      { phase: '经期后', icon: '☀️', emotions: [] }
    ],
    suggestions: [
      {
        id: 1, icon: '🧘', title: '尝试冥想练习',
        description: '每天10分钟的正念冥想可以帮助你更好地管理经期前的焦虑情绪'
      },
      {
        id: 2, icon: '💤', title: '保证充足睡眠',
        description: '经期前后保持7-8小时睡眠，有助于稳定情绪和缓解疲劳'
      },
      {
        id: 3, icon: '🥗', title: '调整饮食结构',
        description: '增加富含维生素B6和镁的食物，如香蕉、坚果，有助于改善情绪'
      },
      {
        id: 4, icon: '📝', title: '继续记录情绪',
        description: '持续记录可以帮助你更好地了解经期情绪模式，提前做好准备'
      }
    ],
    triggers: []
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

    // 从云端获取情绪统计
    cloudUtil.getEmotionStatsFromCloud(timeRange).then(stats => {
      if (stats) {
        this.setData({
          totalRecords: stats.totalRecords || 0,
          emotionDistribution: stats.emotionStats || [],
          avgMood: this.calcAvgMood(stats.emotionStats)
        });
      }
    }).catch(err => {
      console.error('加载情绪统计失败', err);
    });

    // 获取情绪记录 + 经期数据，做经期情绪关联分析
    Promise.all([
      cloudUtil.getEmotionsFromCloud({ limit: 100 }),
      cloudUtil.getPeriodDataFromCloud()
    ]).then(([emotionResult, periodData]) => {
      const records = emotionResult.records || [];

      if (records.length > 0) {
        this.analyzeTrend(records);
      }

      if (periodData && periodData.lastPeriodDate && records.length > 0) {
        this.analyzePeriodEmotions(records, periodData);
      } else {
        this.setData({
          periodInsight: '需要同时有经期记录和情绪记录才能生成经期情绪关联分析。请先在"她的时间"中记录经期，并持续记录情绪。'
        });
      }
    }).catch(err => {
      console.error('加载数据失败', err);
    });
  },

  // 分析经期与情绪的关联（使用新的分析工具）
  analyzePeriodEmotions(records, periodData) {
    // 使用新的分析工具生成完整报告
    const report = periodEmotionAnalysis.generatePeriodEmotionReport(periodData, records);

    if (!report.hasData) {
      this.setData({
        periodInsight: report.message
      });
      return;
    }

    // 提取各阶段的主要情绪
    const phaseEmotions = [];
    const phases = [
      { key: 'before', name: '经期前', icon: '🌙' },
      { key: 'during', name: '经期中', icon: '🌸' },
      { key: 'after', name: '经期后', icon: '☀️' }
    ];

    phases.forEach(phase => {
      const stats = report.phaseStats[phase.key];
      const emotions = stats.topEmotions.length > 0
        ? stats.topEmotions.map(e => e.emotion)
        : ['暂无数据'];

      phaseEmotions.push({
        phase: phase.name,
        icon: phase.icon,
        emotions: emotions,
        count: stats.count,
        avgIntensity: stats.avgIntensity,
        negativeRatio: stats.negativeRatio
      });
    });

    this.setData({
      phaseEmotions: phaseEmotions
    });

    // 生成洞察文本
    let insight = '';
    if (report.insights.length > 0) {
      insight = report.insights[0].content;
    } else {
      insight = '你的经期情绪相对稳定，继续保持良好的自我关怀习惯。';
    }

    // 更新建议列表
    const suggestions = [];
    report.insights.forEach((item, index) => {
      if (item.suggestions && item.suggestions.length > 0) {
        item.suggestions.forEach((suggestion, idx) => {
          suggestions.push({
            id: index * 10 + idx,
            icon: this.getSuggestionIcon(item.phase),
            title: suggestion.split('，')[0],
            description: suggestion
          });
        });
      }
    });

    // 添加通用建议
    if (report.recommendations && report.recommendations.length > 0) {
      report.recommendations.forEach((rec, index) => {
        rec.items.forEach((item, idx) => {
          suggestions.push({
            id: 100 + index * 10 + idx,
            icon: '💡',
            title: rec.category,
            description: item
          });
        });
      });
    }

    this.setData({
      periodInsight: insight,
      suggestions: suggestions.length > 0 ? suggestions : this.data.suggestions
    });
  },

  // 根据阶段获取建议图标
  getSuggestionIcon(phase) {
    const iconMap = {
      'before': '🌙',
      'during': '🌸',
      'after': '☀️',
      'comparison': '📊',
      'pattern': '🔄'
    };
    return iconMap[phase] || '💡';
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
      itemList: ['保存为图片', '分享给陪伴者', '导出为PDF'],
      success: (res) => {
        switch(res.tapIndex) {
          case 0:
          case 2:
            wx.showToast({ title: '功能开发中', icon: 'none' });
            break;
          case 1:
            this.shareToCompanion();
            break;
        }
      }
    });
  },

  shareToCompanion() {
    const companions = wx.getStorageSync('companions') || [];
    if (companions.length === 0) {
      wx.showModal({
        title: '还没有陪伴者',
        content: '是否要添加陪伴者？',
        confirmText: '去添加',
        success: (res) => {
          if (res.confirm) {
            wx.navigateTo({ url: '/pages/companion/companion' });
          }
        }
      });
      return;
    }
    wx.showModal({
      title: '分享报告',
      content: `将报告分享给你的 ${companions.length} 位陪伴者？`,
      confirmText: '分享',
      success: (res) => {
        if (res.confirm) {
          wx.showToast({ title: '分享成功', icon: 'success' });
        }
      }
    });
  }
});
