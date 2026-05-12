// pages/companion-invite/companion-invite.js
const cloudUtil = require('../../../utils/cloud.js');

Page({
  data: {
    inviteCode: '',
    inviteInfo: null,
    accepting: false,
    verifying: false
  },

  onLoad(options) {
    // 从分享链接或扫码获取邀请码
    if (options.inviteCode) {
      this.setData({ inviteCode: options.inviteCode });
      this.verifyCode();
    }
  },

  // 输入邀请码
  onCodeInput(e) {
    this.setData({
      inviteCode: e.detail.value.toUpperCase()
    });
  },

  // 验证邀请码
  verifyCode() {
    const code = this.data.inviteCode.trim();
    if (!code) {
      wx.showToast({ title: '请输入邀请码', icon: 'none' });
      return;
    }

    this.setData({ verifying: true });

    // 调用云函数验证邀请码
    wx.cloud.callFunction({
      name: 'verifyCompanionInvite',
      data: { inviteCode: code }
    }).then(res => {
      this.setData({ verifying: false });

      if (res.result.success) {
        this.setData({
          inviteInfo: {
            userName: res.result.userName,
            userId: res.result.userId,
            companionId: res.result.companionId
          }
        });
      } else {
        wx.showModal({
          title: '验证失败',
          content: res.result.message || '邀请码无效或已过期',
          showCancel: false
        });
      }
    }).catch(err => {
      this.setData({ verifying: false });
      console.error('验证邀请码失败:', err);
      wx.showToast({ title: '验证失败，请重试', icon: 'none' });
    });
  },

  // 接受邀请
  acceptInvite() {
    if (!this.data.inviteInfo) return;

    this.setData({ accepting: true });

    // 调用云函数接受邀请
    wx.cloud.callFunction({
      name: 'acceptCompanionInvite',
      data: {
        inviteCode: this.data.inviteCode,
        companionId: this.data.inviteInfo.companionId,
        userId: this.data.inviteInfo.userId
      }
    }).then(res => {
      this.setData({ accepting: false });

      if (res.result.success) {
        wx.showModal({
          title: '绑定成功',
          content: `你已成为 ${this.data.inviteInfo.userName} 的陪伴者`,
          showCancel: false,
          success: () => {
            // 跳转到陪伴者视图页面
            wx.redirectTo({
              url: `/pages/companion-view/companion-view?userId=${this.data.inviteInfo.userId}`
            });
          }
        });
      } else {
        wx.showModal({
          title: '绑定失败',
          content: res.result.message || '请稍后重试',
          showCancel: false
        });
      }
    }).catch(err => {
      this.setData({ accepting: false });
      console.error('接受邀请失败:', err);
      wx.showToast({ title: '绑定失败，请重试', icon: 'none' });
    });
  },

  // 拒绝邀请
  declineInvite() {
    wx.showModal({
      title: '确认拒绝',
      content: '确定不接受这个邀请吗？',
      success: (res) => {
        if (res.confirm) {
          wx.navigateBack();
        }
      }
    });
  }
});
