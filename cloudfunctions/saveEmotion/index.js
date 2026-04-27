// 云函数：保存情绪记录
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
      emotion,
      emotions,
      emotionIcon,
      intensity,
      subEmotion,
      note,
      bodyFeelings,
      conversation,
      recordDate,
      recordTime
    } = event;

    // 验证必填字段
    if (!emotion || !recordDate) {
      return {
        success: false,
        error: '缺少必填字段'
      };
    }

    // 保存到数据库
    const result = await db.collection('emotion_records').add({
      data: {
        openid: wxContext.OPENID,
        emotion,
        emotions: emotions || [],
        emotionIcon,
        intensity: intensity || 5,
        subEmotion: subEmotion || '',
        note: note || '',
        bodyFeelings: bodyFeelings || [],
        conversation: conversation || [],
        recordDate: new Date(recordDate),
        recordTime: recordTime || '',
        createdAt: db.serverDate()
      }
    });

    // 更新记录日期列表（用于统计记录天数）
    const dateStr = new Date(recordDate).toISOString().split('T')[0];
    await updateRecordDates(wxContext.OPENID, dateStr);

    return {
      success: true,
      id: result._id,
      message: '保存成功'
    };
  } catch (error) {
    console.error('保存情绪记录失败:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// 更新用户记录日期列表和记录次数
async function updateRecordDates(openid, dateStr) {
  try {
    const userDoc = await db.collection('user_stats')
      .where({ openid })
      .get();

    if (userDoc.data.length === 0) {
      // 创建新的统计记录
      await db.collection('user_stats').add({
        data: {
          openid,
          recordDates: [dateStr],
          recordCount: 1,
          firstUseDate: db.serverDate(),
          createdAt: db.serverDate()
        }
      });
    } else {
      const doc = userDoc.data[0];
      const recordDates = doc.recordDates || [];
      const updateData = {
        recordCount: _.inc(1)  // 每次记录都递增
      };

      // 只在新日期时添加日期记录
      if (!recordDates.includes(dateStr)) {
        updateData.recordDates = _.push(dateStr);
      }

      await db.collection('user_stats')
        .doc(doc._id)
        .update({ data: updateData });
    }
  } catch (error) {
    console.error('更新记录日期失败:', error);
  }
}
