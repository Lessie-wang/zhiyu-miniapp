Page({
  data: {
    quotes: [],
    isEmpty: true
  },

  onLoad() {
    this.loadFavoriteQuotes();
  },

  onShow() {
    this.loadFavoriteQuotes();
  },

  // 加载收藏金句
  loadFavoriteQuotes() {
    // 优先从云端加载
    const db = wx.cloud.database();
    db.collection('favorite_quotes').orderBy('createdAt', 'desc').limit(100).get()
      .then(res => {
        const quotes = res.data.map(item => {
          // 格式化时间：云端返回 Date 对象
          let timeStr = '';
          if (item.createdAt) {
            const d = new Date(item.createdAt);
            if (!isNaN(d.getTime())) {
              timeStr = `${d.getMonth() + 1}月${d.getDate()}日 ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
            }
          }
          return {
            id: item.id || item._id,
            _id: item._id,
            content: item.content,
            emotions: item.emotions || [],
            createdAt: timeStr,
            source: item.source || 'chat'
          };
        });
        this.setData({
          quotes,
          isEmpty: quotes.length === 0
        });
        // 同步到本地
        wx.setStorageSync('favoriteQuotes', quotes);
      })
      .catch(err => {
        console.error('云端加载收藏失败:', err);
        // 降级到本地数据
        const quotes = wx.getStorageSync('favoriteQuotes') || [];
        this.setData({
          quotes,
          isEmpty: quotes.length === 0
        });
      });
  },

  // 复制金句
  copyQuote(e) {
    const content = e.currentTarget.dataset.content;
    wx.setClipboardData({
      data: content,
      success: () => {
        wx.showToast({
          title: '已复制',
          icon: 'success',
          duration: 1500
        });
      }
    });
  },

  // 删除收藏
  deleteFavorite(e) {
    const { id, cloudid } = e.currentTarget.dataset;

    wx.showModal({
      title: '取消收藏',
      content: '确定要删除这条收藏吗？',
      confirmText: '删除',
      confirmColor: '#E8A5A5',
      success: (res) => {
        if (!res.confirm) return;

        // 从本地删除
        let quotes = this.data.quotes.filter(q => q.id !== id);
        this.setData({
          quotes,
          isEmpty: quotes.length === 0
        });
        wx.setStorageSync('favoriteQuotes', quotes);

        // 从云端删除
        if (cloudid) {
          const db = wx.cloud.database();
          db.collection('favorite_quotes').doc(cloudid).remove().catch(err => {
            console.error('云端删除收藏失败:', err);
          });
        }

        wx.showToast({
          title: '已删除',
          icon: 'success',
          duration: 1500
        });
      }
    });
  },

  // 格式化时间
  formatTime(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const month = d.getMonth() + 1;
    const day = d.getDate();
    return `${month}月${day}日`;
  }
});
