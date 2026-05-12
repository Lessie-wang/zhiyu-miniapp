Page({
  data: {
    quotes: [],
    isEmpty: true,
    editingContent: {} // 存储编辑中的内容
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
            source: item.source || 'chat',
            isEditing: false
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

  // 进入编辑模式
  editQuote(e) {
    const id = e.currentTarget.dataset.id;
    const quotes = this.data.quotes.map(q => {
      if (q.id === id) {
        // 保存原始内容
        this.setData({
          [`editingContent.${id}`]: q.content
        });
        return { ...q, isEditing: true };
      }
      return { ...q, isEditing: false }; // 关闭其他编辑
    });
    this.setData({ quotes });
    wx.vibrateShort({ type: 'light' });
  },

  // 输入内容
  onQuoteInput(e) {
    const id = e.currentTarget.dataset.id;
    const value = e.detail.value;
    const quotes = this.data.quotes.map(q => {
      if (q.id === id) {
        return { ...q, content: value };
      }
      return q;
    });
    this.setData({ quotes });
  },

  // 保存编辑
  saveEdit(e) {
    const id = e.currentTarget.dataset.id;
    const quote = this.data.quotes.find(q => q.id === id);

    if (!quote || !quote.content.trim()) {
      wx.showToast({
        title: '内容不能为空',
        icon: 'none',
        duration: 1500
      });
      return;
    }

    // 更新本地
    const quotes = this.data.quotes.map(q => {
      if (q.id === id) {
        return { ...q, isEditing: false };
      }
      return q;
    });
    this.setData({ quotes });
    wx.setStorageSync('favoriteQuotes', quotes);

    // 更新云端
    if (quote._id) {
      const db = wx.cloud.database();
      db.collection('favorite_quotes').doc(quote._id).update({
        data: {
          content: quote.content
        }
      }).then(() => {
        wx.showToast({
          title: '保存成功',
          icon: 'success',
          duration: 1500
        });
        wx.vibrateShort({ type: 'success' });
      }).catch(err => {
        console.error('云端更新失败:', err);
        wx.showToast({
          title: '保存失败',
          icon: 'none',
          duration: 1500
        });
      });
    } else {
      wx.showToast({
        title: '保存成功',
        icon: 'success',
        duration: 1500
      });
      wx.vibrateShort({ type: 'success' });
    }

    // 清除编辑缓存
    delete this.data.editingContent[id];
  },

  // 取消编辑
  cancelEdit(e) {
    const id = e.currentTarget.dataset.id;
    const originalContent = this.data.editingContent[id];

    const quotes = this.data.quotes.map(q => {
      if (q.id === id) {
        return {
          ...q,
          content: originalContent || q.content, // 恢复原始内容
          isEditing: false
        };
      }
      return q;
    });
    this.setData({ quotes });

    // 清除编辑缓存
    delete this.data.editingContent[id];
    wx.vibrateShort({ type: 'light' });
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
