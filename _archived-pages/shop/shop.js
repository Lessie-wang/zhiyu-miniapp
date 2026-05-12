Page({
  data: {},

  goToOrders: function() {
    wx.showToast({
      title: '订单功能开发中',
      icon: 'none'
    });
  },

  onShareAppMessage: function() {
    return {
      title: '知愈商店 - 情绪疗愈好物',
      path: '/pages/shop/shop'
    };
  }
});
