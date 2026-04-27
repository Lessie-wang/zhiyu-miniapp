// 云函数：获取情绪记录列表
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
      startDate,
      endDate,
      limit = 100,
      skip = 0,
      emotion // 可选：按情绪类型筛选
    } = event;

    // 构建查询条件
    let query = {
      openid: wxContext.OPENID
    };

    // 日期范围筛选
    if (startDate && endDate) {
      query.recordDate = _.gte(new Date(startDate)).and(_.lte(new Date(endDate)));
    } else if (startDate) {
      query.recordDate = _.gte(new Date(startDate));
    } else if (endDate) {
      query.recordDate = _.lte(new Date(endDate));
    }

    // 情绪类型筛选
    if (emotion) {
      query.emotion = emotion;
    }

    // 查询数据
    const result = await db.collection('emotion_records')
      .where(query)
      .orderBy('recordDate', 'desc')
      .skip(skip)
      .limit(limit)
      .get();

    // 获取总数
    const countResult = await db.collection('emotion_records')
      .where(query)
      .count();

    return {
      success: true,
      records: result.data,
      total: countResult.total,
      hasMore: skip + limit < countResult.total
    };
  } catch (error) {
    console.error('获取情绪记录失败:', error);
    return {
      success: false,
      error: error.message,
      records: []
    };
  }
};
