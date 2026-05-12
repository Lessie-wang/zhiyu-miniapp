// pages/companion/companion.js
Page({
  data: {
    companions: [
      // 示例数据
      // {
      //   id: 1,
      //   name: '妈妈',
      //   relation: '家人',
      //   status: 'active', // active | pending
      //   avatar: ''
      // }
    ],
    // 添加陪伴者弹窗
    showAddCompanionModal: false,
    addCompanionInput: '',
    // 修改备注弹窗
    showEditNameModal: false,
    editNameInput: '',
    editingCompanion: null
  },

  onLoad(options) {
    this.loadCompanions();
  },

  onShow() {
    // 每次显示页面时刷新数据
    this.loadCompanions();
  },

  // 加载陪伴者列表
  loadCompanions() {
    // 从本地存储加载陪伴者数据
    const companions = wx.getStorageSync('companions') || [];
    this.setData({ companions });
  },

  // 添加陪伴者
  addCompanion() {
    this.setData({
      showAddCompanionModal: true,
      addCompanionInput: ''
    });
    wx.vibrateShort({ type: 'light' });
  },

  // 输入陪伴者姓名
  onAddCompanionInput(e) {
    this.setData({
      addCompanionInput: e.detail.value
    });
  },

  // 关闭添加陪伴者弹窗
  closeAddCompanionModal() {
    this.setData({
      showAddCompanionModal: false,
      addCompanionInput: ''
    });
  },

  // 确认添加陪伴者
  confirmAddCompanion() {
    const name = this.data.addCompanionInput.trim();

    if (!name) {
      wx.showToast({
        title: '请输入陪伴者姓名',
        icon: 'none',
        duration: 2000
      });
      return;
    }

    this.setData({
      showAddCompanionModal: false,
      addCompanionInput: ''
    });

    // 选择关系
    this.showRelationPicker(name);
  },

  // 选择关系
  showRelationPicker(name) {
    const relations = ['家人', '朋友', '伴侣', '其他'];
    wx.showActionSheet({
      itemList: relations,
      success: (res) => {
        const relation = relations[res.tapIndex];
        this.createCompanion(name, relation);
      }
    });
  },

  // 创建陪伴者
  createCompanion(name, relation) {
    const newCompanion = {
      id: Date.now(),
      name: name,
      relation: relation,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    const companions = [...this.data.companions, newCompanion];

    // 保存到本地存储
    wx.setStorageSync('companions', companions);

    this.setData({ companions });

    wx.showToast({
      title: '添加成功',
      icon: 'success'
    });

    // 这里可以生成邀请链接或二维码
    this.generateInvitation(newCompanion);
  },

  // 生成邀请
  generateInvitation(companion) {
    // 生成邀请码
    const inviteCode = this.generateInviteCode(companion.id);

    setTimeout(() => {
      wx.showModal({
        title: '邀请陪伴者',
        content: `已为 ${companion.name} 生成邀请码：${inviteCode}\n\n你可以通过以下方式邀请：\n1. 点击"分享给TA"发送小程序卡片\n2. 让TA在小程序中输入邀请码\n3. 生成二维码让TA扫描`,
        confirmText: '分享给TA',
        cancelText: '复制邀请码',
        success: (res) => {
          if (res.confirm) {
            // 触发分享
            this.shareToCompanion(companion, inviteCode);
          } else if (res.cancel) {
            // 复制邀请码
            wx.setClipboardData({
              data: inviteCode,
              success: () => {
                wx.showToast({
                  title: '邀请码已复制',
                  icon: 'success'
                });
              }
            });
          }
        }
      });
    }, 500);
  },

  // 生成邀请码
  generateInviteCode(companionId) {
    const userId = wx.getStorageSync('userId') || 'USER' + Date.now();
    const code = `ZY${userId.slice(-4)}${companionId.toString().slice(-4)}`;
    return code.toUpperCase();
  },

  // 分享给陪伴者
  shareToCompanion(companion, inviteCode) {
    // 保存分享信息到全局
    getApp().globalData.shareInfo = {
      type: 'companion_invite',
      companionId: companion.id,
      companionName: companion.name,
      inviteCode: inviteCode
    };

    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });

    wx.showToast({
      title: '请点击右上角分享',
      icon: 'none',
      duration: 2000
    });
  },

  // 页面分享配置
  onShareAppMessage() {
    const shareInfo = getApp().globalData.shareInfo;
    if (shareInfo && shareInfo.type === 'companion_invite') {
      return {
        title: `我想邀请你成为我的情绪陪伴者`,
        path: `/pages/companion-invite/companion-invite?inviteCode=${shareInfo.inviteCode}`,
        imageUrl: '/images/share-companion.png'
      };
    }
    return {
      title: '知愈 - 情绪健康陪伴',
      path: '/pages/index/index'
    };
  },

  // 编辑陪伴者
  editCompanion(e) {
    const id = e.currentTarget.dataset.id;
    const companion = this.data.companions.find(c => c.id === id);

    if (!companion) return;

    const items = ['修改备注', '调整权限', '重新发送邀请'];
    wx.showActionSheet({
      itemList: items,
      success: (res) => {
        switch(res.tapIndex) {
          case 0:
            this.editCompanionName(companion);
            break;
          case 1:
            this.editPermissions(companion);
            break;
          case 2:
            this.resendInvitation(companion);
            break;
        }
      }
    });
  },

  // 修改备注
  editCompanionName(companion) {
    this.setData({
      showEditNameModal: true,
      editNameInput: companion.name,
      editingCompanion: companion
    });
    wx.vibrateShort({ type: 'light' });
  },

  // 输入新备注
  onEditNameInput(e) {
    this.setData({
      editNameInput: e.detail.value
    });
  },

  // 关闭修改备注弹窗
  closeEditNameModal() {
    this.setData({
      showEditNameModal: false,
      editNameInput: '',
      editingCompanion: null
    });
  },

  // 确认修改备注
  confirmEditName() {
    const newName = this.data.editNameInput.trim();

    if (!newName) {
      wx.showToast({
        title: '请输入备注名称',
        icon: 'none',
        duration: 2000
      });
      return;
    }

    const companion = this.data.editingCompanion;
    const companions = this.data.companions.map(c =>
      c.id === companion.id ? {...c, name: newName} : c
    );

    wx.setStorageSync('companions', companions);
    this.setData({
      companions,
      showEditNameModal: false,
      editNameInput: '',
      editingCompanion: null
    });

    wx.showToast({ title: '修改成功', icon: 'success' });
  },

  // 调整权限
  editPermissions(companion) {
    wx.showModal({
      title: '调整权限',
      content: `设置 ${companion.name} 可以查看的内容范围`,
      confirmText: '前往设置',
      success: (res) => {
        if (res.confirm) {
          // 跳转到权限设置页面
          wx.showToast({
            title: '功能开发中',
            icon: 'none'
          });
        }
      }
    });
  },

  // 重新发送邀请
  resendInvitation(companion) {
    wx.showModal({
      title: '重新发送邀请',
      content: `向 ${companion.name} 重新发送邀请链接`,
      confirmText: '发送',
      success: (res) => {
        if (res.confirm) {
          this.generateInvitation(companion);
        }
      }
    });
  },

  // 移除陪伴者
  removeCompanion(e) {
    const id = e.currentTarget.dataset.id;
    const companion = this.data.companions.find(c => c.id === id);

    if (!companion) return;

    wx.showModal({
      title: '移除陪伴者',
      content: `确定要移除 ${companion.name} 吗？TA 将无法再查看你的情绪记录。`,
      confirmText: '确定移除',
      confirmColor: '#E74C3C',
      success: (res) => {
        if (res.confirm) {
          const companions = this.data.companions.filter(c => c.id !== id);
          wx.setStorageSync('companions', companions);
          this.setData({ companions });
          wx.showToast({
            title: '已移除',
            icon: 'success'
          });
        }
      }
    });
  }
});
