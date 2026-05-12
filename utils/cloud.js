// 云开发工具函数封装
const cloud = wx.cloud;

/**
 * 保存情绪记录到云端
 * @param {Object} emotionData - 情绪数据
 * @returns {Promise<string>} 记录ID
 */
async function saveEmotionToCloud(emotionData) {
  try {
    const res = await cloud.callFunction({
      name: 'saveEmotion',
      data: {
        emotion: emotionData.emotion,
        emotions: emotionData.emotions || [],
        emotionIcon: emotionData.emotionIcon,
        intensity: emotionData.intensity,
        subEmotion: emotionData.subEmotion || '',
        note: emotionData.note,
        bodyFeelings: emotionData.bodyFeelings || [],
        conversation: emotionData.conversation || [],
        recordDate: emotionData.recordDate || new Date().toISOString(),
        recordTime: emotionData.recordTime || ''
      }
    });

    if (res.result.success) {
      console.log('保存成功:', res.result.id);
      return res.result.id;
    } else {
      throw new Error(res.result.error);
    }
  } catch (error) {
    console.error('保存情绪记录失败:', error);
    throw error;
  }
}

/**
 * 从云端获取情绪记录
 * @param {Object} options - 查询选项
 * @returns {Promise<Array>} 记录列表
 */
async function getEmotionsFromCloud(options = {}) {
  try {
    const res = await cloud.callFunction({
      name: 'getEmotions',
      data: {
        startDate: options.startDate,
        endDate: options.endDate,
        limit: options.limit || 100,
        skip: options.skip || 0,
        emotion: options.emotion
      }
    });

    if (res.result.success) {
      return {
        records: res.result.records,
        total: res.result.total,
        hasMore: res.result.hasMore
      };
    } else {
      throw new Error(res.result.error);
    }
  } catch (error) {
    console.error('获取情绪记录失败:', error);
    return { records: [], total: 0, hasMore: false };
  }
}

/**
 * 获取情绪统计数据
 * @param {string} timeRange - 时间范围: all, week, month
 * @returns {Promise<Object>} 统计数据
 */
async function getEmotionStatsFromCloud(timeRange = 'all') {
  try {
    const res = await cloud.callFunction({
      name: 'getEmotionStats',
      data: { timeRange }
    });

    if (res.result.success) {
      return res.result.stats;
    } else {
      throw new Error(res.result.error);
    }
  } catch (error) {
    console.error('获取统计数据失败:', error);
    return null;
  }
}

/**
 * 同步本地数据到云端
 * @returns {Promise<boolean>} 是否成功
 */
async function syncLocalDataToCloud() {
  try {
    // 获取本地存储的记录
    const localRecords = wx.getStorageSync('emotionRecords') || [];

    if (localRecords.length === 0) {
      console.log('没有本地数据需要同步');
      return true;
    }

    // 逐条上传到云端
    let successCount = 0;
    for (const record of localRecords) {
      try {
        await saveEmotionToCloud({
          emotion: record.emotion,
          emotionIcon: record.icon,
          intensity: record.intensity,
          note: record.note,
          bodyFeelings: record.bodyFeelings || [],
          recordDate: record.date
        });
        successCount++;
      } catch (error) {
        console.error('同步单条记录失败:', error);
      }
    }

    console.log(`同步完成: ${successCount}/${localRecords.length}`);

    // 同步成功后清空本地数据（可选）
    // wx.removeStorageSync('emotionRecords');

    return successCount === localRecords.length;
  } catch (error) {
    console.error('同步数据失败:', error);
    return false;
  }
}

/**
 * 保存经期数据到云端
 * @param {Object} periodData - 经期数据
 * @returns {Promise<boolean>} 是否成功
 */
async function savePeriodDataToCloud(periodData) {
  try {
    const db = cloud.database();
    // 先查询是否已有记录
    const existing = await db.collection('period_records').where({
      _openid: '{openid}'
    }).get();

    if (existing.data.length > 0) {
      // 更新已有记录
      await db.collection('period_records').doc(existing.data[0]._id).update({
        data: {
          lastPeriodDate: periodData.lastPeriodDate,
          cycleLength: periodData.cycleLength,
          periodLength: periodData.periodLength,
          painLevel: periodData.painLevel,
          updatedAt: db.serverDate()
        }
      });
    } else {
      // 新建记录
      await db.collection('period_records').add({
        data: {
          lastPeriodDate: periodData.lastPeriodDate,
          cycleLength: periodData.cycleLength,
          periodLength: periodData.periodLength,
          painLevel: periodData.painLevel,
          createdAt: db.serverDate(),
          updatedAt: db.serverDate()
        }
      });
    }
    console.log('经期数据云端保存成功');
    return true;
  } catch (error) {
    console.error('经期数据云端保存失败:', error);
    return false;
  }
}

/**
 * 从云端获取经期数据
 * @returns {Promise<Object|null>} 经期数据
 */
async function getPeriodDataFromCloud() {
  try {
    const db = cloud.database();
    const result = await db.collection('period_records').where({
      _openid: '{openid}'
    }).get();

    if (result.data.length > 0) {
      return result.data[0];
    }
    return null;
  } catch (error) {
    console.error('获取云端经期数据失败:', error);
    return null;
  }
}

/**
 * 保存用户画像到云端
 * @param {Object} profileData - 用户画像数据
 * @returns {Promise<string>} 记录ID
 */
async function saveUserProfileToCloud(profileData) {
  try {
    const res = await cloud.callFunction({
      name: 'saveUserProfile',
      data: {
        birthday: profileData.birthday,
        gender: profileData.gender,
        occupation: profileData.occupation,
        concerns: profileData.concerns || [],
        goals: profileData.goals || [],
        triggers: profileData.triggers || [],
        copingStyles: profileData.copingStyles || [],
        expectations: profileData.expectations || []
      }
    });

    if (res.result.success) {
      console.log('用户画像云端保存成功:', res.result.id);
      return res.result.id;
    } else {
      throw new Error(res.result.error);
    }
  } catch (error) {
    console.error('用户画像云端保存失败:', error);
    throw error;
  }
}

/**
 * 从云端获取用户画像
 * @returns {Promise<Object|null>} 用户画像数据
 */
async function getUserProfileFromCloud() {
  try {
    const res = await cloud.callFunction({
      name: 'getUserProfile'
    });

    if (res.result.success) {
      console.log('云端画像获取成功');
      return res.result.profile;
    } else {
      return null;
    }
  } catch (error) {
    console.error('获取云端用户画像失败:', error);
    return null;
  }
}

/**
 * 保存陪伴者关系到云端
 * @param {Object} companionData - 陪伴者数据
 * @returns {Promise<boolean>} 是否成功
 */
async function saveCompanionToCloud(companionData) {
  try {
    const db = cloud.database();
    await db.collection('companions').add({
      data: {
        ...companionData,
        createdAt: db.serverDate(),
        updatedAt: db.serverDate()
      }
    });
    console.log('陪伴者关系云端保存成功');
    return true;
  } catch (error) {
    console.error('陪伴者关系云端保存失败:', error);
    return false;
  }
}

/**
 * 从云端获取陪伴者列表
 * @returns {Promise<Array>} 陪伴者列表
 */
async function getCompanionsFromCloud() {
  try {
    const db = cloud.database();
    const result = await db.collection('companions').where({
      _openid: '{openid}',
      status: 'active'
    }).get();

    return result.data || [];
  } catch (error) {
    console.error('获取云端陪伴者列表失败:', error);
    return [];
  }
}

/**
 * 生成经期情绪报告
 * @param {Object} options - 报告选项
 * @returns {Promise<Object>} 报告数据
 */
async function generatePeriodEmotionReport(options = {}) {
  try {
    const res = await cloud.callFunction({
      name: 'generatePeriodEmotionReport',
      data: {
        months: options.months || 3
      }
    });

    if (res.result.success) {
      return res.result.report;
    } else {
      throw new Error(res.result.error);
    }
  } catch (error) {
    console.error('生成经期情绪报告失败:', error);
    return null;
  }
}

module.exports = {
  saveEmotionToCloud,
  getEmotionsFromCloud,
  getEmotionStatsFromCloud,
  syncLocalDataToCloud,
  savePeriodDataToCloud,
  getPeriodDataFromCloud,
  saveUserProfileToCloud,
  getUserProfileFromCloud,
  saveCompanionToCloud,
  getCompanionsFromCloud,
  generatePeriodEmotionReport
};
