// 云函数：获取用户画像
const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const openid = wxContext.OPENID;

  try {
    const result = await db.collection('user_profiles').where({ openid }).get();

    if (result.data.length > 0) {
      const profile = result.data[0];
      return {
        success: true,
        profile: {
          birthday: profile.birthday,
          gender: profile.gender,
          occupation: profile.occupation,
          concerns: profile.concerns || [],
          goals: profile.goals || [],
          triggers: profile.triggers || [],
          copingStyles: profile.copingStyles || [],
          expectations: profile.expectations || [],
          createdAt: profile.createdAt,
          updatedAt: profile.updatedAt
        }
      };
    } else {
      return { success: false, error: '未找到用户画像' };
    }
  } catch (error) {
    console.error('获取用户画像失败:', error);
    return { success: false, error: error.message };
  }
};
