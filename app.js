// app.js
// BGM 云存储 fileID
const BGM_CLOUD_FILE_ID = 'cloud://cloud1-7g2wu7as9a592655.636c-cloud1-7g2wu7as9a592655-1405184369/pd-5b82bfece32a296.mp3';

App({
  onLaunch() {
    // 初始化云开发环境
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        env: 'cloud1-7g2wu7as9a592655',
        traceUser: true
      });
    }

    // 记录首次使用日期
    const firstUseDate = wx.getStorageSync('firstUseDate');
    if (!firstUseDate) {
      wx.setStorageSync('firstUseDate', new Date().toISOString());
    }

    // 预加载 BGM
    this.prepareBGM();

    // 智能路由：根据用户状态决定落地页
    this.routeByUserState();
  },

  // 根据用户状态智能路由
  routeByUserState: function() {
    const hasOnboarded = wx.getStorageSync('hasOnboarded');

    if (!hasOnboarded) {
      // 新用户：留在 onboarding（app.json 首页已是 onboarding）
      return;
    }

    // 老用户：进入首页（首页会根据是否有画像决定后续引导）
    wx.reLaunch({ url: '/pages/index/index' });
  },

  // 通过云函数获取音频 URL 并预加载
  prepareBGM: function() {
    var that = this;
    var stored = wx.getStorageSync('bgmEnabled');
    this.globalData.bgmEnabled = stored === '' ? true : stored;

    // 创建音频实例
    var audio = wx.createInnerAudioContext();
    audio.loop = true;
    audio.volume = 0.3;
    audio.obeyMuteSwitch = false;
    this.globalData.bgmAudio = audio;

    audio.onError(function(err) {
      console.error('BGM 播放错误:', err.errCode, err.errMsg);
    });

    // 通过云函数获取临时 URL（绕过存储权限限制）
    wx.cloud.callFunction({
      name: 'getAudioUrl',
      data: { fileID: BGM_CLOUD_FILE_ID },
      success: function(res) {
        if (res.result && res.result.success) {
          that.globalData.bgmUrl = res.result.url;
          console.log('BGM URL 获取成功');
        } else {
          console.error('BGM URL 获取失败:', res.result);
        }
      },
      fail: function(err) {
        console.error('云函数调用失败:', err);
      }
    });
  },

  // 播放 BGM（必须在用户交互事件中调用）
  playBGM: function() {
    var audio = this.globalData.bgmAudio;
    var url = this.globalData.bgmUrl;
    if (!audio || !url) {
      console.warn('BGM 尚未加载完成');
      return;
    }
    audio.src = url;
    audio.play();
    this.globalData.bgmPlaying = true;
  },

  // 切换 BGM 开关（由用户点击按钮触发）
  toggleBGM: function() {
    var audio = this.globalData.bgmAudio;
    var newState = !this.globalData.bgmEnabled;
    this.globalData.bgmEnabled = newState;
    wx.setStorageSync('bgmEnabled', newState);

    if (newState) {
      this.playBGM();
    } else if (audio && this.globalData.bgmPlaying) {
      audio.pause();
      this.globalData.bgmPlaying = false;
    }
    return newState;
  },

  globalData: {
    userInfo: null,
    openid: null,
    bgmAudio: null,
    bgmEnabled: true,
    bgmUrl: '',
    bgmPlaying: false
  }
});
