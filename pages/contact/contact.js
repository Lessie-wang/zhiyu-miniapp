Page({
  data: {
    hasNewUpdate: true // 是否有新版本更新提示
  },

  // 更新日志
  goToChangelog: function() {
    wx.showModal({
      title: '更新日志 v1.0.0',
      content: '🎉 知愈正式上线！\n\n· 12种核心情绪识别\n· AI情绪引导对话\n· 五感写作训练\n· 情绪日历与统计\n· 她的时间（经期关怀）\n· 表达训练场景对话',
      showCancel: false,
      confirmText: '知道了',
      confirmColor: '#D4B8A5'
    });
  },

  // 重要提醒
  goToNotices: function() {
    wx.showModal({
      title: '重要提醒',
      content: '· 知愈不是心理咨询平台，如遇紧急心理危机，请拨打24小时心理援助热线：400-161-9995\n\n· AI对话内容仅供参考，不构成专业心理建议\n\n· 请定期保存你的情绪记录',
      showCancel: false,
      confirmText: '我知道了',
      confirmColor: '#D4B8A5'
    });
  },

  // 数据隐私
  goToPrivacy: function() {
    wx.showModal({
      title: '数据隐私声明',
      content: '知愈非常重视你的隐私：\n\n· 情绪记录仅存储在你的设备和个人云端\n· 我们不会将你的数据分享给第三方\n· AI对话内容不会被用于训练模型\n· 你可以随时导出或删除所有数据\n· 注销账号后所有数据将被永久删除',
      showCancel: false,
      confirmText: '我了解了',
      confirmColor: '#D4B8A5'
    });
  },

  // 添加到桌面
  addToDesktop: function() {
    wx.showModal({
      title: '添加到桌面',
      content: '点击右上角「···」菜单，选择「添加到桌面」，即可在手机桌面快速打开知愈。',
      showCancel: false,
      confirmText: '好的',
      confirmColor: '#D4B8A5'
    });
  },

  // 个性化设置
  goToPersonalize: function() {
    wx.navigateTo({
      url: '/pages/settings/settings'
    });
  },

  // 退出登录
  logout: function() {
    wx.showModal({
      title: '退出登录',
      content: '退出后需要重新登录，本地未同步的数据可能丢失。确定退出吗？',
      confirmText: '确定退出',
      cancelText: '取消',
      confirmColor: '#E8836B',
      success: function(res) {
        if (res.confirm) {
          wx.clearStorageSync();
          wx.reLaunch({
            url: '/pages/onboarding/onboarding'
          });
        }
      }
    });
  },

  // 注销账号
  deleteAccount: function() {
    wx.showModal({
      title: '注销账号',
      content: '注销后你的所有数据将被永久删除，且无法恢复。确定要注销吗？',
      confirmText: '确定注销',
      cancelText: '我再想想',
      confirmColor: '#E8836B',
      success: function(res) {
        if (res.confirm) {
          // 二次确认
          wx.showModal({
            title: '再次确认',
            content: '这是不可逆操作，所有情绪记录、对话历史都将被永久删除。',
            confirmText: '确认注销',
            cancelText: '取消',
            confirmColor: '#E8836B',
            success: function(res2) {
              if (res2.confirm) {
                wx.clearStorageSync();
                wx.showToast({
                  title: '账号已注销',
                  icon: 'success',
                  duration: 2000
                });
                setTimeout(function() {
                  wx.reLaunch({
                    url: '/pages/onboarding/onboarding'
                  });
                }, 2000);
              }
            }
          });
        }
      }
    });
  },

  onShareAppMessage: function() {
    return {
      title: '知愈 - 养育你的情绪，从学会表达开始',
      path: '/pages/index/index',
      imageUrl: '/image/share-cover.png'
    };
  }
})
