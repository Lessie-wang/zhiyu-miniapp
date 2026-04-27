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
    ]
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
    wx.showModal({
      title: '添加陪伴者',
      content: '请输入陪伴者的姓名',
      editable: true,
      placeholderText: '例如：妈妈、小明',
      success: (res) => {
        if (res.confirm && res.content) {
          const name = res.content.trim();
          if (name) {
            this.showRelationPicker(name);
          }
        }
      }
    });
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
    setTimeout(() => {
      wx.showModal({
        title: '邀请陪伴者',
        content: `已为 ${companion.name} 生成邀请。你可以通过分享小程序邀请 TA 成为你的陪伴者。`,
        confirmText: '分享邀请',
        cancelText: '稍后',
        success: (res) => {
          if (res.confirm) {
            // 触发分享
            wx.showShareMenu({
              withShareTicket: true,
              menus: ['shareAppMessage', 'shareTimeline']
            });
          }
        }
      });
    }, 500);
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
    wx.showModal({
      title: '修改备注',
      content: '请输入新的备注名称',
      editable: true,
      placeholderText: companion.name,
      success: (res) => {
        if (res.confirm && res.content) {
          const newName = res.content.trim();
          if (newName) {
            const companions = this.data.companions.map(c =>
              c.id === companion.id ? {...c, name: newName} : c
            );
            wx.setStorageSync('companions', companions);
            this.setData({ companions });
            wx.showToast({ title: '修改成功', icon: 'success' });
          }
        }
      }
    });
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
