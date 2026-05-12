// pages/period-tracker/period-tracker.js
Page({
  data: {
    // 经期状态
    periodStatus: {
      title: '安全期',
      desc: '距离下次经期还有一段时间',
      daysLeft: 12
    },

    // 周期信息
    cycleLength: 28,
    periodLength: 5,
    lastPeriodDate: '11/25',

    // 日历数据
    currentMonth: '2026年5月',
    weekdays: ['日', '一', '二', '三', '四', '五', '六'],
    calendarDays: [],

    // 情绪统计
    emotionStats: [
      { name: '焦虑', percentage: 65, count: 8, phase: 'period' },
      { name: '烦躁', percentage: 55, count: 6, phase: 'pre-period' },
      { name: '疲惫', percentage: 70, count: 9, phase: 'period' },
      { name: '平静', percentage: 40, count: 5, phase: 'normal' },
      { name: '开心', percentage: 30, count: 3, phase: 'normal' }
    ],

    // 添加症状弹窗
    showAddSymptomModal: false,
    addSymptomInput: '',

    // 常见症状
    commonSymptoms: [
      { id: 1, icon: '😣', name: '痛经', selected: false },
      { id: 2, icon: '😫', name: '腰酸', selected: false },
      { id: 3, icon: '😴', name: '嗜睡', selected: false },
      { id: 4, icon: '😤', name: '易怒', selected: false },
      { id: 5, icon: '🍔', name: '食欲增加', selected: false },
      { id: 6, icon: '🤕', name: '头痛', selected: false }
    ],

    // 健康建议
    healthTips: [
      '经期前后注意保暖，避免受凉',
      '适量运动可以缓解经期不适',
      '保持充足睡眠，有助于情绪稳定',
      '多吃富含铁质的食物，补充营养',
      '记录情绪变化，了解自己的周期规律'
    ]
  },

  onLoad(options) {
    this.initCalendar();
    this.loadPeriodData();
  },

  onShow() {
    this.refreshData();
  },

  // 初始化日历
  initCalendar() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    this.setData({
      currentMonth: `${year}年${month + 1}月`
    });

    this.generateCalendarDays(year, month);
  },

  // 生成日历天数
  generateCalendarDays(year, month) {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const firstDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    const days = [];
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;

    // 上个月的日期
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      days.push({
        day: prevMonthLastDay - i,
        date: `${year}-${month}-${prevMonthLastDay - i}`,
        isOtherMonth: true,
        isPeriod: false,
        hasEmotion: false,
        isToday: false
      });
    }

    // 当月日期
    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${year}-${month + 1}-${i}`;
      const isPeriod = this.isPeriodDay(year, month + 1, i);
      const emotionData = this.getEmotionForDay(year, month + 1, i);

      days.push({
        day: i,
        date: dateStr,
        isOtherMonth: false,
        isPeriod: isPeriod,
        hasEmotion: emotionData.hasEmotion,
        emotionColor: emotionData.color,
        isToday: dateStr === todayStr
      });
    }

    // 下个月的日期（补齐6行）
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        day: i,
        date: `${year}-${month + 2}-${i}`,
        isOtherMonth: true,
        isPeriod: false,
        hasEmotion: false,
        isToday: false
      });
    }

    this.setData({ calendarDays: days });
  },

  // 判断是否为经期
  isPeriodDay(year, month, day) {
    // 示例：假设上次经期是11月25日，周期28天
    // 这里应该从本地存储读取实际数据
    const periodDays = [
      '2026-5-1', '2026-5-2', '2026-5-3', '2026-5-4', '2026-5-5'
    ];
    const dateStr = `${year}-${month}-${day}`;
    return periodDays.includes(dateStr);
  },

  // 获取当天情绪数据
  getEmotionForDay(year, month, day) {
    // 从本地存储或云端获取情绪数据
    // 这里返回示例数据
    const emotions = wx.getStorageSync('emotions') || [];
    const dateStr = `${year}-${month}-${day}`;

    const dayEmotions = emotions.filter(e => e.date === dateStr);

    if (dayEmotions.length > 0) {
      return {
        hasEmotion: true,
        color: this.getEmotionColor(dayEmotions[0].type)
      };
    }

    return { hasEmotion: false, color: '' };
  },

  // 获取情绪颜色
  getEmotionColor(emotionType) {
    const colorMap = {
      '开心': '#F5C6CB',
      '平静': '#C4D4B5',
      '难过': '#A8C8E1',
      '焦虑': '#C4B5D8',
      '烦躁': '#FFB6C1'
    };
    return colorMap[emotionType] || '#D4B8A5';
  },

  // 加载经期数据
  loadPeriodData() {
    const periodData = wx.getStorageSync('periodData') || {
      cycleLength: 28,
      periodLength: 5,
      lastPeriodDate: '2026-04-25',
      records: []
    };

    // 计算距离下次经期的天数
    const lastDate = new Date(periodData.lastPeriodDate);
    const nextDate = new Date(lastDate.getTime() + periodData.cycleLength * 24 * 60 * 60 * 1000);
    const today = new Date();
    const daysLeft = Math.ceil((nextDate - today) / (24 * 60 * 60 * 1000));

    let status = {};
    if (daysLeft <= 0) {
      status = { title: '经期中', desc: '注意休息，关爱自己', daysLeft: 0 };
    } else if (daysLeft <= 7) {
      status = { title: '经期将至', desc: '做好准备，保持心情愉悦', daysLeft };
    } else {
      status = { title: '安全期', desc: '距离下次经期还有一段时间', daysLeft };
    }

    this.setData({
      cycleLength: periodData.cycleLength,
      periodLength: periodData.periodLength,
      lastPeriodDate: this.formatDate(periodData.lastPeriodDate),
      periodStatus: status
    });
  },

  // 刷新数据
  refreshData() {
    this.loadPeriodData();
    this.loadEmotionStats();
  },

  // 加载情绪统计
  loadEmotionStats() {
    // 从情绪记录中统计经期前后的情绪分布
    // 这里使用示例数据
  },

  // 格式化日期
  formatDate(dateStr) {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  },

  // 上一月
  prevMonth() {
    const [year, month] = this.data.currentMonth.match(/\d+/g);
    const newMonth = parseInt(month) - 1;
    const newYear = newMonth === 0 ? parseInt(year) - 1 : parseInt(year);
    const finalMonth = newMonth === 0 ? 12 : newMonth;

    this.setData({
      currentMonth: `${newYear}年${finalMonth}月`
    });

    this.generateCalendarDays(newYear, finalMonth - 1);
  },

  // 下一月
  nextMonth() {
    const [year, month] = this.data.currentMonth.match(/\d+/g);
    const newMonth = parseInt(month) + 1;
    const newYear = newMonth === 13 ? parseInt(year) + 1 : parseInt(year);
    const finalMonth = newMonth === 13 ? 1 : newMonth;

    this.setData({
      currentMonth: `${newYear}年${finalMonth}月`
    });

    this.generateCalendarDays(newYear, finalMonth - 1);
  },

  // 点击日期
  onDayTap(e) {
    const date = e.currentTarget.dataset.date;
    console.log('选中日期:', date);

    // 可以弹出详情或记录界面
    wx.showModal({
      title: '日期详情',
      content: `选中日期：${date}\n\n功能开发中...`,
      showCancel: false
    });
  },

  // 切换症状
  toggleSymptom(e) {
    const id = e.currentTarget.dataset.id;
    const symptoms = this.data.commonSymptoms.map(s => {
      if (s.id === id) {
        return { ...s, selected: !s.selected };
      }
      return s;
    });

    this.setData({ commonSymptoms: symptoms });

    // 保存到本地
    const selectedSymptoms = symptoms.filter(s => s.selected);
    wx.setStorageSync('todaySymptoms', selectedSymptoms);
  },

  // 添加症状
  addSymptom() {
    this.setData({
      showAddSymptomModal: true,
      addSymptomInput: ''
    });
    wx.vibrateShort({ type: 'light' });
  },

  // 输入症状描述
  onAddSymptomInput(e) {
    this.setData({
      addSymptomInput: e.detail.value
    });
  },

  // 关闭添加症状弹窗
  closeAddSymptomModal() {
    this.setData({
      showAddSymptomModal: false,
      addSymptomInput: ''
    });
  },

  // 确认添加症状
  confirmAddSymptom() {
    const symptom = this.data.addSymptomInput.trim();

    if (!symptom) {
      wx.showToast({
        title: '请输入症状描述',
        icon: 'none',
        duration: 2000
      });
      return;
    }

    this.setData({
      showAddSymptomModal: false,
      addSymptomInput: ''
    });

    wx.showToast({
      title: '已记录',
      icon: 'success'
    });
  },

  // 记录经期
  recordPeriod() {
    wx.showModal({
      title: '记录经期',
      content: '今天是经期第一天吗？',
      confirmText: '是的',
      cancelText: '选择日期',
      success: (res) => {
        if (res.confirm) {
          this.savePeriodRecord(new Date());
        } else if (res.cancel) {
          // 打开日期选择器
          wx.showToast({
            title: '日期选择功能开发中',
            icon: 'none'
          });
        }
      }
    });
  },

  // 保存经期记录
  savePeriodRecord(date) {
    const periodData = wx.getStorageSync('periodData') || {
      cycleLength: 28,
      periodLength: 5,
      records: []
    };

    const dateStr = date.toISOString().split('T')[0];
    periodData.lastPeriodDate = dateStr;
    periodData.records.push({
      startDate: dateStr,
      symptoms: this.data.commonSymptoms.filter(s => s.selected)
    });

    wx.setStorageSync('periodData', periodData);

    wx.showToast({
      title: '记录成功',
      icon: 'success'
    });

    this.refreshData();
    this.initCalendar();
  },

  // 查看历史记录
  viewHistory() {
    wx.showToast({
      title: '历史记录功能开发中',
      icon: 'none'
    });
  }
});
