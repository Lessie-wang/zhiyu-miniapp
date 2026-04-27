// 云函数：保存/更新用户画像
const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const openid = wxContext.OPENID;

  try {
    const { birthday, gender, occupation, concerns, goals, triggers, copingStyles, expectations } = event;

    if (!birthday || !gender || !occupation) {
      return { success: false, error: '缺少必填字段' };
    }

    const profileData = {
      birthday,
      gender,
      occupation,
      concerns: concerns || [],
      goals: goals || [],
      triggers: triggers || [],
      copingStyles: copingStyles || [],
      expectations: expectations || [],
      updatedAt: db.serverDate()
    };

    // 查询是否已有画像
    const existing = await db.collection('user_profiles').where({ openid }).get();

    if (existing.data.length > 0) {
      await db.collection('user_profiles').doc(existing.data[0]._id).update({
        data: profileData
      });
      return { success: true, id: existing.data[0]._id, message: '画像已更新' };
    } else {
      const result = await db.collection('user_profiles').add({
        data: {
          openid,
          ...profileData,
          createdAt: db.serverDate()
        }
      });
      return { success: true, id: result._id, message: '画像已保存' };
    }
  } catch (error) {
    console.error('保存用户画像失败:', error);
    return { success: false, error: error.message };
  }
};
