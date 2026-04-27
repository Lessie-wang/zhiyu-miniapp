// 云函数：调用腾讯混元大模型
const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

exports.main = async (event, context) => {
  try {
    const { messages } = event;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return { success: false, error: '缺少 messages 参数' };
    }

    const result = await cloud.openapi.hunyuan.chatCompletions({
      model: 'hunyuan-lite',
      messages: messages,
      stream: false
    });

    if (result && result.choices && result.choices.length > 0) {
      return {
        success: true,
        reply: result.choices[0].message.content
      };
    }

    console.error('[混元] 响应格式异常:', JSON.stringify(result));
    return { success: false, error: '混元 API 响应格式异常' };
  } catch (err) {
    console.error('[混元] 调用失败:', JSON.stringify(err));
    return {
      success: false,
      error: err.message || '混元 API 调用失败',
      errCode: err.errCode || '',
      detail: JSON.stringify(err)
    };
  }
};
