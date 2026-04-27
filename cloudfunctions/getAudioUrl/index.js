// 云函数：获取音频文件临时下载链接
// 云函数有管理员权限，不受存储权限限制
const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

exports.main = async (event, context) => {
  try {
    const { fileID } = event;

    if (!fileID) {
      return { success: false, error: '缺少 fileID 参数' };
    }

    const result = await cloud.getTempFileURL({
      fileList: [fileID]
    });

    const file = result.fileList && result.fileList[0];
    if (file && file.status === 0 && file.tempFileURL) {
      return {
        success: true,
        url: file.tempFileURL
      };
    }

    return { success: false, error: '文件不存在或无法访问' };
  } catch (error) {
    console.error('获取音频 URL 失败:', error);
    return { success: false, error: error.message };
  }
};
