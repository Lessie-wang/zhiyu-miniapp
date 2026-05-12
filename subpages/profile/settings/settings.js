Page({
  data: {
    avatarUrl: '',
    nickName: '',
    motto: '',
    showWomenModule: true,
    bgmEnabled: true
  },

  onLoad() {
    this.loadProfile();
  },

  // 加载已保存的用户资料
  loadProfile() {
    const savedUserInfo = wx.getStorageSync('userInfo') || {};
    const showWomenModule = wx.getStorageSync('showWomenModule');
    const app = getApp();
    this.setData({
      avatarUrl: savedUserInfo.avatarUrl || '',
      nickName: savedUserInfo.nickName || '',
      motto: savedUserInfo.motto || '',
      showWomenModule: showWomenModule !== false,  // 默认开启
      bgmEnabled: app.globalData.bgmEnabled
    });
  },

  // 选择头像（从相册）
  chooseAvatar() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album'],
      success: (res) => {
        const tempFilePath = res.tempFiles[0].tempFilePath;
        this.setData({
          avatarUrl: tempFilePath
        });
      }
    });
  },

  // 名字输入
  onNickNameInput(e) {
    this.setData({
      nickName: e.detail.value
    });
  },

  // 座右铭输入
  onMottoInput(e) {
    this.setData({
      motto: e.detail.value
    });
  },

  // 保存用户资料
  saveProfile() {
    const { nickName, avatarUrl, motto } = this.data;

    if (!nickName.trim()) {
      wx.showToast({
        title: '请输入名字',
        icon: 'none'
      });
      return;
    }

    // 如果选了新头像（临时路径），保存到本地永久路径
    if (avatarUrl && avatarUrl.startsWith('http://tmp') || avatarUrl && avatarUrl.startsWith('wxfile://')) {
      const fs = wx.getFileSystemManager();
      const ext = avatarUrl.split('.').pop() || 'png';
      const savedPath = `${wx.env.USER_DATA_PATH}/avatar.${ext}`;

      try {
        fs.saveFileSync(avatarUrl, savedPath);
        this.doSave(savedPath, nickName.trim(), motto.trim());
      } catch (e) {
        // 保存失败就用临时路径
        this.doSave(avatarUrl, nickName.trim(), motto.trim());
      }
    } else {
      this.doSave(avatarUrl, nickName.trim(), motto.trim());
    }
  },

  // 执行保存
  doSave(avatarUrl, nickName, motto) {
    const savedUserInfo = wx.getStorageSync('userInfo') || {};
    savedUserInfo.avatarUrl = avatarUrl;
    savedUserInfo.nickName = nickName;
    savedUserInfo.motto = motto;
    wx.setStorageSync('userInfo', savedUserInfo);

    wx.vibrateShort({ type: 'medium' });

    wx.showToast({
      title: '保存成功',
      icon: 'success',
      duration: 1500
    });

    // 延迟返回上一页，让用户看到保存成功提示
    setTimeout(() => {
      wx.navigateBack();
    }, 1500);
  },

  // 她的时间开关
  toggleWomenModule(e) {
    const show = e.detail.value;
    this.setData({ showWomenModule: show });
    wx.setStorageSync('showWomenModule', show);
    wx.vibrateShort({ type: 'light' });
  },

  // 背景音乐开关
  toggleBGM(e) {
    const app = getApp();
    const newState = app.toggleBGM();
    this.setData({ bgmEnabled: newState });
    wx.vibrateShort({ type: 'light' });
  },

  // 添加到桌面
  addToDesktop() {
    wx.showModal({
      title: '添加到桌面',
      content: '点击右上角「···」菜单，选择「添加到桌面」，即可在手机桌面快速打开知愈。',
      showCancel: false,
      confirmText: '好的',
      confirmColor: '#D4B8A5'
    });
  },

  onShareAppMessage() {
    return {
      title: '知愈 - 个人设置',
      path: '/pages/settings/settings'
    };
  }
});
