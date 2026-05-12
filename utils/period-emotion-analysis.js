// 经期情绪分析工具函数

/**
 * 关联经期数据和情绪数据
 * @param {Object} periodData - 经期数据
 * @param {Array} emotionRecords - 情绪记录列表
 * @returns {Object} 关联分析结果
 */
function correlatePeriodAndEmotion(periodData, emotionRecords) {
  if (!periodData || !periodData.lastPeriodDate || emotionRecords.length === 0) {
    return null;
  }

  const cycleLength = periodData.cycleLength || 28;
  const periodLength = periodData.periodLength || 5;

  // 按经期阶段分组情绪
  const emotionsByPhase = {
    before: [], // 经前期（经期前3天）
    during: [], // 经期中
    after: [],  // 经后期（经期后3天）
    normal: []  // 平稳期
  };

  emotionRecords.forEach(record => {
    const phase = calculatePhaseForDate(
      record.recordDate,
      periodData.lastPeriodDate,
      cycleLength,
      periodLength
    );
    if (phase && emotionsByPhase[phase]) {
      emotionsByPhase[phase].push(record);
    }
  });

  // 计算各阶段情绪统计
  const phaseStats = {};
  Object.keys(emotionsByPhase).forEach(phase => {
    phaseStats[phase] = analyzeEmotions(emotionsByPhase[phase]);
  });

  return {
    emotionsByPhase,
    phaseStats,
    insights: generateInsights(phaseStats)
  };
}

/**
 * 计算某个日期属于哪个经期阶段
 * @param {string} date - 日期
 * @param {string} lastPeriodDate - 上次经期开始日期
 * @param {number} cycleLength - 周期长度
 * @param {number} periodLength - 经期长度
 * @returns {string|null} 阶段名称
 */
function calculatePhaseForDate(date, lastPeriodDate, cycleLength, periodLength) {
  const targetDate = new Date(date);
  const lastDate = new Date(lastPeriodDate);

  // 计算目标日期距离上次经期的天数
  const daysSinceLastPeriod = Math.floor((targetDate - lastDate) / (1000 * 60 * 60 * 24));

  // 计算在当前周期中的位置
  const dayInCycle = daysSinceLastPeriod % cycleLength;

  if (dayInCycle < periodLength) {
    return 'during'; // 经期中
  } else if (dayInCycle < periodLength + 3) {
    return 'after'; // 经后期
  } else if (dayInCycle >= cycleLength - 3) {
    return 'before'; // 经前期
  } else {
    return 'normal'; // 平稳期
  }
}

/**
 * 分析情绪列表的统计数据
 * @param {Array} emotions - 情绪记录列表
 * @returns {Object} 统计结果
 */
function analyzeEmotions(emotions) {
  if (emotions.length === 0) {
    return {
      count: 0,
      avgIntensity: 0,
      topEmotions: [],
      negativeRatio: 0
    };
  }

  // 统计情绪类型
  const emotionCounts = {};
  let totalIntensity = 0;
  let negativeCount = 0;

  const negativeEmotions = ['难过', '焦虑', '愤怒', '沮丧', '孤独', '恐惧', '内疚', '羞愧'];

  emotions.forEach(record => {
    // 统计情绪类型
    const emotion = record.emotion || record.emotions?.[0];
    if (emotion) {
      emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;

      // 判断是否为负面情绪
      if (negativeEmotions.includes(emotion)) {
        negativeCount++;
      }
    }

    // 累计强度
    totalIntensity += record.intensity || 3;
  });

  // 排序获取最常见的情绪
  const topEmotions = Object.entries(emotionCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([emotion, count]) => ({ emotion, count }));

  return {
    count: emotions.length,
    avgIntensity: (totalIntensity / emotions.length).toFixed(1),
    topEmotions,
    negativeRatio: (negativeCount / emotions.length * 100).toFixed(0)
  };
}

/**
 * 生成洞察建议
 * @param {Object} phaseStats - 各阶段统计数据
 * @returns {Array} 洞察列表
 */
function generateInsights(phaseStats) {
  const insights = [];

  // 经前期情绪波动分析
  if (phaseStats.before.count > 0) {
    if (phaseStats.before.negativeRatio > 60) {
      insights.push({
        type: 'warning',
        phase: 'before',
        title: '经前期情绪波动较大',
        content: `经前期负面情绪占比 ${phaseStats.before.negativeRatio}%，建议提前做好情绪管理准备。`,
        suggestions: [
          '提前3天开始调整作息，保证充足睡眠',
          '减少咖啡因摄入，避免情绪更加波动',
          '安排一些放松活动，如瑜伽、冥想'
        ]
      });
    }
  }

  // 经期中情绪分析
  if (phaseStats.during.count > 0) {
    if (parseFloat(phaseStats.during.avgIntensity) > 4) {
      insights.push({
        type: 'info',
        phase: 'during',
        title: '经期情绪强度较高',
        content: `经期平均情绪强度 ${phaseStats.during.avgIntensity}/5，需要更多关怀和支持。`,
        suggestions: [
          '允许自己慢下来，减少工作压力',
          '多喝温水，注意保暖',
          '和信任的人聊聊，表达你的感受'
        ]
      });
    }
  }

  // 对比分析
  if (phaseStats.before.count > 0 && phaseStats.normal.count > 0) {
    const beforeNegative = parseFloat(phaseStats.before.negativeRatio);
    const normalNegative = parseFloat(phaseStats.normal.negativeRatio);

    if (beforeNegative - normalNegative > 30) {
      insights.push({
        type: 'pattern',
        phase: 'comparison',
        title: '发现明显的周期性情绪模式',
        content: `经前期负面情绪比平稳期高 ${(beforeNegative - normalNegative).toFixed(0)}%，这是激素变化的正常反应。`,
        suggestions: [
          '记录你的情绪周期，了解自己的模式',
          '在经前期给自己更多耐心和理解',
          '可以和陪伴者分享这个模式，获得更好的支持'
        ]
      });
    }
  }

  return insights;
}

/**
 * 生成经期情绪报告
 * @param {Object} periodData - 经期数据
 * @param {Array} emotionRecords - 情绪记录（最近3个月）
 * @returns {Object} 报告数据
 */
function generatePeriodEmotionReport(periodData, emotionRecords) {
  const correlation = correlatePeriodAndEmotion(periodData, emotionRecords);

  if (!correlation) {
    return {
      hasData: false,
      message: '数据不足，请继续记录经期和情绪'
    };
  }

  return {
    hasData: true,
    summary: {
      totalRecords: emotionRecords.length,
      cycleLength: periodData.cycleLength,
      avgPainLevel: periodData.painLevel || 0
    },
    phaseStats: correlation.phaseStats,
    insights: correlation.insights,
    recommendations: generateRecommendations(correlation)
  };
}

/**
 * 生成个性化建议
 * @param {Object} correlation - 关联分析结果
 * @returns {Array} 建议列表
 */
function generateRecommendations(correlation) {
  const recommendations = [];

  // 基于经前期情绪的建议
  if (correlation.phaseStats.before.negativeRatio > 50) {
    recommendations.push({
      category: '经前期管理',
      items: [
        '提前调整日程，避免在经前期安排重要会议或决策',
        '准备一些让自己开心的小事物（喜欢的零食、电影等）',
        '和陪伴者提前沟通，让TA知道你可能需要更多支持'
      ]
    });
  }

  // 基于经期中情绪的建议
  if (correlation.phaseStats.during.avgIntensity > 3.5) {
    recommendations.push({
      category: '经期护理',
      items: [
        '使用热水袋或暖宝宝缓解不适',
        '适当运动（如散步、轻柔瑜伽）促进血液循环',
        '补充铁质和维生素B，帮助身体恢复'
      ]
    });
  }

  // 通用建议
  recommendations.push({
    category: '长期管理',
    items: [
      '坚持记录经期和情绪，了解自己的身体节律',
      '建立规律的作息和运动习惯',
      '如果痛经严重或情绪波动影响生活，建议咨询医生'
    ]
  });

  return recommendations;
}

module.exports = {
  correlatePeriodAndEmotion,
  calculatePhaseForDate,
  analyzeEmotions,
  generateInsights,
  generatePeriodEmotionReport,
  generateRecommendations
};
