// 云函数：获取情绪统计数据
const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();
const _ = db.command;

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();

  try {
    const {
      timeRange = 'all', // all, week, month
      startDate,
      endDate
    } = event;

    // 计算日期范围
    let dateQuery = {};
    const now = new Date();

    if (timeRange === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      dateQuery = _.gte(weekAgo);
    } else if (timeRange === 'month') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      dateQuery = _.gte(monthAgo);
    } else if (startDate && endDate) {
      dateQuery = _.gte(new Date(startDate)).and(_.lte(new Date(endDate)));
    }

    // 构建查询条件
    const query = {
      openid: wxContext.OPENID
    };

    if (Object.keys(dateQuery).length > 0) {
      query.recordDate = dateQuery;
    }

    // 获取所有记录
    const result = await db.collection('emotion_records')
      .where(query)
      .get();

    const records = result.data;

    // 统计各情绪出现次数
    const emotionCount = {};
    records.forEach(record => {
      const emotion = record.emotion;
      emotionCount[emotion] = (emotionCount[emotion] || 0) + 1;
    });

    // 转换为数组并排序
    const emotionStats = Object.keys(emotionCount).map(emotion => ({
      name: emotion,
      icon: getEmotionIcon(emotion),
      count: emotionCount[emotion],
      percentage: Math.round((emotionCount[emotion] / records.length) * 100)
    })).sort((a, b) => b.count - a.count);

    // 获取用户统计信息
    const userStats = await getUserStats(wxContext.OPENID);

    // 生成AI摘要
    const aiSummary = generateAISummary(records, timeRange);

    return {
      success: true,
      stats: {
        totalRecords: records.length,
        emotionStats,
        useDays: userStats.useDays,
        recordDays: userStats.recordDays,
        aiSummary
      }
    };
  } catch (error) {
    console.error('获取统计数据失败:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// 获取情绪图标
function getEmotionIcon(emotion) {
  const emotionMap = {
    '开心': '😊',
    '平静': '😐',
    '难过': '😔',
    '累': '😫',
    '烦躁': '😤',
    '焦虑': '😨',
    '愤怒': '😡',
    '感动': '🥰',
    '困惑': '🤔',
    '无聊': '🥱',
    '震惊': '🤯',
    '不知道': '❓'
  };
  return emotionMap[emotion] || '📝';
}

// 获取用户统计信息
async function getUserStats(openid) {
  try {
    const result = await db.collection('user_stats')
      .where({ openid })
      .get();

    if (result.data.length > 0) {
      const stats = result.data[0];
      const firstUseDate = new Date(stats.firstUseDate);
      const now = new Date();
      const useDays = Math.floor((now - firstUseDate) / (1000 * 60 * 60 * 24)) + 1;
      const recordDays = (stats.recordDates || []).length;

      return { useDays, recordDays };
    }
  } catch (error) {
    console.error('获取用户统计失败:', error);
  }

  return { useDays: 0, recordDays: 0 };
}

// 生成AI摘要
function generateAISummary(records, timeRange) {
  if (records.length === 0) {
    return '开始记录你的情绪，AI 将为你生成个性化的情绪分析报告。';
  }

  // 统计主要情绪
  const emotionCount = {};
  records.forEach(r => {
    emotionCount[r.emotion] = (emotionCount[r.emotion] || 0) + 1;
  });

  const mainEmotion = Object.keys(emotionCount).reduce((a, b) =>
    emotionCount[a] > emotionCount[b] ? a : b
  );

  const timeRangeText = timeRange === 'week' ? '最近7天' : timeRange === 'month' ? '最近30天' : '总共';
  const advice = getEmotionAdvice(mainEmotion);

  return `${timeRangeText}您记录了${records.length}次情绪，主要情绪是"${mainEmotion}"。${advice}`;
}

// 获取情绪建议
function getEmotionAdvice(emotion) {
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
}
