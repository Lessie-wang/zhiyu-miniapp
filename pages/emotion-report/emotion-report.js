// pages/emotion-report/emotion-report.js - 经期情绪监测报告
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

  // 分析经期与情绪的关联
  analyzePeriodEmotions(records, periodData) {
    const cycleLength = periodData.cycleLength || 28;
    const periodLength = periodData.periodLength || 5;
    const lastPeriodDate = new Date(periodData.lastPeriodDate);

    const beforeEmotions = {};
    const duringEmotions = {};
    const afterEmotions = {};

    records.forEach(r => {
      const recordDate = new Date(r.recordDate || r.createdAt);
      // 计算该记录距离最近一次经期开始的天数
      const daysDiff = Math.floor((recordDate - lastPeriodDate) / (1000 * 60 * 60 * 24));
      // 归一化到一个周期内
      const dayInCycle = ((daysDiff % cycleLength) + cycleLength) % cycleLength;

      const emotion = r.emotion;
      if (!emotion) return;

      if (dayInCycle >= cycleLength - 3 || dayInCycle < 0) {
        // 经期前3天
        beforeEmotions[emotion] = (beforeEmotions[emotion] || 0) + 1;
      } else if (dayInCycle < periodLength) {
        // 经期中
        duringEmotions[emotion] = (duringEmotions[emotion] || 0) + 1;
      } else if (dayInCycle < periodLength + 3) {
        // 经期后3天
        afterEmotions[emotion] = (afterEmotions[emotion] || 0) + 1;
      }
    });

    const getTopEmotions = (emotionMap) => {
      return Object.entries(emotionMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([name]) => name);
    };

    const beforeList = getTopEmotions(beforeEmotions);
    const duringList = getTopEmotions(duringEmotions);
    const afterList = getTopEmotions(afterEmotions);

    this.setData({
      phaseEmotions: [
        { phase: '经期前', icon: '🌙', emotions: beforeList.length > 0 ? beforeList : ['暂无数据'] },
        { phase: '经期中', icon: '🌸', emotions: duringList.length > 0 ? duringList : ['暂无数据'] },
        { phase: '经期后', icon: '☀️', emotions: afterList.length > 0 ? afterList : ['暂无数据'] }
      ]
    });

    // 生成经期情绪洞察
    let insight = '';
    if (beforeList.length > 0) {
      insight += `经期前你的主要情绪是${beforeList.join('、')}。`;
    }
    if (duringList.length > 0) {
      insight += `经期中主要感受到${duringList.join('、')}。`;
    }
    if (afterList.length > 0) {
      insight += `经期后情绪转为${afterList.join('、')}。`;
    }
    if (!insight) {
      insight = '数据还不够多，继续记录情绪可以获得更准确的经期情绪分析。';
    } else {
      insight += '建议在情绪波动较大的时期增加自我关怀，适当调整作息。';
    }

    this.setData({ periodInsight: insight });
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
