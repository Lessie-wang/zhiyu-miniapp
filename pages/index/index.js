// 治愈系名言库
const quotes = [
  "情绪不需要被解决，它们需要被看见。",
  "说出感受，是自我关怀的第一步。",
  "你不必总是坚强，脆弱也是一种勇气。",
  "每一种情绪，都在试图告诉你一些重要的事。",
  "当你能精准说出感受，那个困住你的情绪就失去了一半力量。",
  "情绪表达能力，是可以练习的技能。",
  "允许自己感受，是成长的开始。",
  "你的感受值得被认真对待。",
  "情绪没有对错，只有被理解或被忽视。",
  "学会命名情绪，就是在为内心建立秩序。",
  "表达不是软弱，沉默才是。",
  "情绪是身体的语言，学会倾听它。",
  "你有权利感到悲伤，也有权利寻求快乐。",
  "真实的自己，从诚实面对情绪开始。",
  "情绪觉察，是自我认知的起点。",
  "每一次表达，都是在养育内心的小孩。",
  "情绪不会消失，只会转化。",
  "说出口的痛苦，已经减轻了一半。",
  "你不是你的情绪，但你可以理解它。",
  "情绪表达，是建立亲密关系的桥梁。"
];

// 节日祝福库
const festivals = [
  { month: 1, day: 1, message: "新年快乐，愿你在新的一年里，温柔且坚定。" },
  { month: 2, day: 14, message: "今天是情人节，你本身就值得被爱。" },
  { month: 3, day: 8, message: "玫瑰与钢铁，皆是她。妇女节快乐，愿你永远知道自己的珍贵。" },
  { month: 4, day: 1, message: "愚人节，真实的自己不需要伪装。" },
  { month: 5, day: 1, message: "劳动节快乐，你的努力值得被看见。" },
  { month: 5, day: 20, message: "520，爱自己是一切爱的开始。" },
  { month: 6, day: 1, message: "儿童节快乐，愿你内心的小孩永远被温柔对待。" },
  { month: 10, day: 1, message: "国庆快乐，愿你拥有内心的自由与平静。" },
  { month: 12, day: 25, message: "圣诞快乐，愿你被温暖包围。" }
];

Page({
  data: {
    currentDate: '',
    currentTime: '',
    sealDate: '',
    greetingText: '',
    festivalMessage: '',
    currentQuote: '',
    bgmEnabled: true,
    envelopeOpened: false,
    touchStartY: 0,
    touchMoveY: 0,
    tearProgress: 0
  },

  onLoad: function() {
    this.updateDateTime();
    this.updateGreeting();
    this.updateFestival();
    this.updateQuote();

    const app = getApp();
    this.setData({ bgmEnabled: app.globalData.bgmEnabled });

    console.log('Index 页面加载完成');
  },

  onShow: function() {
    this.updateDateTime();
    this.updateGreeting();
    this.updateFestival();

    const app = getApp();
    this.setData({ bgmEnabled: app.globalData.bgmEnabled });

    this.startTimers();
  },

  onHide: function() {
    this.clearTimers();
  },

  onUnload: function() {
    this.clearTimers();
  },

  // 更新日期时间
  updateDateTime: function() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const weekDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    const weekDay = weekDays[now.getDay()];

    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    this.setData({
      currentDate: `${year}年${month}月${day}日 ${weekDay}`,
      sealDate: `${month}.${day}`,
      currentTime: `${hours}:${minutes}`
    });
  },

  // 更新问候语
  updateGreeting: function() {
    const hour = new Date().getHours();
    let greeting = '';

    if (hour >= 5 && hour < 9) {
      greeting = '早上好，新的一天开始了';
    } else if (hour >= 9 && hour < 12) {
      greeting = '上午好，保持专注';
    } else if (hour >= 12 && hour < 14) {
      greeting = '中午好，记得休息一下';
    } else if (hour >= 14 && hour < 18) {
      greeting = '下午好，继续加油';
    } else if (hour >= 18 && hour < 22) {
      greeting = '晚上好，辛苦了一天';
    } else {
      greeting = '还没睡吗？记得好好休息';
    }

    this.setData({ greetingText: greeting });
  },

  // 更新名言
  updateQuote: function() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    this.setData({ currentQuote: quotes[randomIndex] });
  },

  // 更新节日祝福
  updateFestival: function() {
    const now = new Date();
    const month = now.getMonth() + 1;
    const day = now.getDate();

    const todayFestival = festivals.find(f => f.month === month && f.day === day);

    if (todayFestival) {
      this.setData({ festivalMessage: todayFestival.message });
    } else {
      this.setData({ festivalMessage: '' });
    }
  },

  // 启动定时器
  startTimers: function() {
    this.timeTimer = setInterval(() => {
      this.updateDateTime();
      this.updateGreeting();
    }, 60000);

    this.quoteTimer = setInterval(() => {
      this.updateQuote();
    }, 30000);
  },

  // 清除定时器
  clearTimers: function() {
    if (this.timeTimer) {
      clearInterval(this.timeTimer);
      this.timeTimer = null;
    }
    if (this.quoteTimer) {
      clearInterval(this.quoteTimer);
      this.quoteTimer = null;
    }
  },

  // 触摸开始
  onTouchStart: function(e) {
    this.setData({
      touchStartY: e.touches[0].clientY
    });
  },

  // 触摸移动
  onTouchMove: function(e) {
    const touchMoveY = e.touches[0].clientY;
    const deltaY = this.data.touchStartY - touchMoveY;

    // 向上滑动才有效
    if (deltaY > 0) {
      const progress = Math.min(deltaY / 200, 1);
      this.setData({
        touchMoveY: touchMoveY,
        tearProgress: progress
      });

      // 轻微震动反馈
      if (progress > 0.3 && progress < 0.35) {
        wx.vibrateShort({ type: 'light' });
      }
    }
  },

  // 触摸结束
  onTouchEnd: function(e) {
    const progress = this.data.tearProgress;

    // 滑动超过50%则打开信封并直接跳转
    if (progress > 0.5) {
      this.openEnvelopeAndNavigate();
    } else {
      // 回弹
      this.setData({
        tearProgress: 0,
        touchMoveY: 0
      });
    }
  },

  // 打开信封并直接跳转
  openEnvelopeAndNavigate: function() {
    // 防止重复调用
    if (this.isNavigating) return;
    this.isNavigating = true;

    // 震动反馈
    wx.vibrateShort({ type: 'medium' });

    // 启动BGM
    const app = getApp();
    if (app.globalData.bgmEnabled && !app.globalData.bgmPlaying) {
      app.playBGM();
    }

    // 立即跳转，不等待动画
    this.goToMain();
  },

  // 跳转到主页
  goToMain: function() {
    console.log('goToMain 被调用');

    wx.vibrateShort({ type: 'light' });

    // 使用 switchTab 跳转到 tabBar 页面
    wx.switchTab({
      url: '/pages/main/main',
      success: () => {
        console.log('跳转成功');
        this.isNavigating = false;
      },
      fail: (err) => {
        console.error('跳转失败', err);
        this.isNavigating = false;
        wx.showToast({
          title: '页面跳转失败',
          icon: 'none',
          duration: 2000
        });
      }
    });
  },

  // 切换BGM
  toggleBGM: function() {
    const app = getApp();
    const newState = app.toggleBGM();
    this.setData({ bgmEnabled: newState });
    wx.vibrateShort({ type: 'light' });
  },

  // 点击名言卡片切换下一句
  onQuoteTap: function() {
    wx.vibrateShort({ type: 'light' });
    this.updateQuote();
  },

  // 分享功能
  onShareAppMessage: function() {
    return {
      title: '知愈 - 养育你的情绪',
      path: '/pages/index/index'
    };
  }
});
