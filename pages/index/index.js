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

// 节日祝福库 - 格式：{ month: 月份, day: 日期, message: 祝福语 }
const festivals = [
  // 1月
  { month: 1, day: 1, message: "新年快乐，愿你在新的一年里，温柔且坚定。" },

  // 2月
  { month: 2, day: 14, message: "今天是情人节，你本身就值得被爱。" },
  { month: 2, day: 16, message: "除夕夜，愿你与温暖相伴，与爱同行。" },
  { month: 2, day: 17, message: "春节快乐，愿你在新的一年里，心有所栖，情有所依。" },

  // 3月
  { month: 3, day: 3, message: "元宵节快乐，愿你的生活如汤圆般圆满甜蜜。" },
  { month: 3, day: 8, message: "玫瑰与钢铁，皆是她。妇女节快乐，愿你永远知道自己的珍贵。" },
  { month: 3, day: 12, message: "植树节，愿你悲伤有岸，疲惫有靠。" },

  // 4月
  { month: 4, day: 1, message: "愚人节，真实的自己不需要伪装。" },
  { month: 4, day: 4, message: "清明时节，允许自己怀念，也允许自己释怀。" },
  { month: 4, day: 5, message: "清明时节，允许自己怀念，也允许自己释怀。" },

  // 5月
  { month: 5, day: 1, message: "劳动节快乐，你的努力值得被看见。" },
  { month: 5, day: 4, message: "青年节，愿你永远保持对生活的好奇。" },
  { month: 5, day: 12, message: "母亲节，感谢那些养育我们的温柔时刻。" },
  { month: 5, day: 20, message: "520，爱自己是一切爱的开始。" },

  // 6月
  { month: 6, day: 1, message: "儿童节快乐，愿你内心的小孩永远被温柔对待。" },
  { month: 6, day: 16, message: "父亲节，感谢那些沉默却坚定的支持。" },
  { month: 6, day: 19, message: "端午安康，愿你平安喜乐。" },

  // 7月
  { month: 7, day: 7, message: "七夕，愿你遇见懂得你情绪的人。" },

  // 8月
  { month: 8, day: 15, message: "中秋节，月圆人圆，心安即是归处。" },

  // 9月
  { month: 9, day: 10, message: "教师节，感谢那些教会我们表达的人。" },

  // 10月
  { month: 10, day: 1, message: "国庆快乐，愿你拥有内心的自由与平静。" },
  { month: 10, day: 31, message: "万圣节，不必害怕展现真实的自己。" },

  // 11月
  { month: 11, day: 11, message: "双十一，对自己好一点，你值得。" },

  // 12月
  { month: 12, day: 24, message: "平安夜，愿你的心找到安放之处。" },
  { month: 12, day: 25, message: "圣诞快乐，愿你被温暖包围。" },
  { month: 12, day: 31, message: "辞旧迎新，感谢这一年的自己。" }
];

Page({
  data: {
    currentDate: '',
    currentTime: '',
    greetingText: '',
    festivalMessage: '',
    currentQuote: '',
    quoteIndex: 0,
    bgmEnabled: true,
    particles: []
  },

  onLoad: function() {
    // 生成闪光粒子
    this.generateParticles();
    // 初始化日期时间
    this.updateDateTime();
    // 初始化问候语
    this.updateGreeting();
    // 初始化节日祝福
    this.updateFestival();
    // 初始化名言
    this.updateQuote();
    // 同步 BGM 状态
    const app = getApp();
    this.setData({ bgmEnabled: app.globalData.bgmEnabled });
  },

  onShow: function() {
    // 页面显示时更新时间
    this.updateDateTime();
    this.updateGreeting();
    this.updateFestival();

    // 同步 BGM 状态
    const app = getApp();
    this.setData({ bgmEnabled: app.globalData.bgmEnabled });

    // 启动定时器
    this.startTimers();
  },

  onHide: function() {
    // 清除定时器
    this.clearTimers();
  },

  onUnload: function() {
    // 清除定时器
    this.clearTimers();
  },

  // 生成随机闪光粒子
  generateParticles: function() {
    var particles = [];
    for (var i = 0; i < 25; i++) {
      particles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 8 + 4,
        delay: Math.random() * 6,
        duration: Math.random() * 5 + 4,
        opacity: Math.random() * 0.5 + 0.15
      });
    }
    this.setData({ particles: particles });
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

    this.setData({
      greetingText: greeting
    });
  },

  // 更新名言
  updateQuote: function() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    this.setData({
      currentQuote: quotes[randomIndex],
      quoteIndex: randomIndex
    });
  },

  // 更新节日祝福
  updateFestival: function() {
    const now = new Date();
    const month = now.getMonth() + 1; // 月份从0开始，需要+1
    const day = now.getDate();

    // 查找今天是否有节日
    const todayFestival = festivals.find(f => f.month === month && f.day === day);

    if (todayFestival) {
      this.setData({
        festivalMessage: todayFestival.message
      });
    } else {
      this.setData({
        festivalMessage: ''
      });
    }
  },

  // 启动定时器
  startTimers: function() {
    // 每分钟更新一次时间
    this.timeTimer = setInterval(() => {
      this.updateDateTime();
      this.updateGreeting();
    }, 60000);

    // 每30秒切换一次名言
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

  // 跳转到主页（检查用户画像）
  goToMain: function() {
    wx.vibrateShort({ type: 'medium' });

    // 用户首次点击时自动启动 BGM
    var app = getApp();
    if (app.globalData.bgmEnabled && !app.globalData.bgmPlaying) {
      app.playBGM();
    }

    // 检查是否已填写用户画像
    var userProfile = wx.getStorageSync('userProfile');
    if (userProfile && userProfile.gender && userProfile.occupation) {
      // 已有画像，直接进入主页
      wx.navigateTo({ url: '/pages/main/main' });
    } else {
      // 未填写画像，引导填写问卷
      wx.showModal({
        title: '完善你的画像',
        content: '填写简单问卷，让知愈AI更懂你',
        confirmText: '去填写',
        cancelText: '先跳过',
        success: function(res) {
          if (res.confirm) {
            wx.navigateTo({ url: '/pages/onboarding/onboarding?step=3' });
          } else {
            wx.navigateTo({ url: '/pages/main/main' });
          }
        }
      });
    }
  },

  // 切换 BGM
  toggleBGM: function() {
    const app = getApp();
    const newState = app.toggleBGM();
    this.setData({ bgmEnabled: newState });
    wx.vibrateShort({ type: 'light' });
  },

  // 分享功能
  onShareAppMessage: function() {
    return {
      title: '知愈 - 养育你的情绪',
      path: '/pages/index/index',
      imageUrl: '' // 可以添加分享图片
    };
  }
})
