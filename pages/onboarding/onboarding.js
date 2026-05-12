const cloudUtil = require('../../utils/cloud.js');

Page({
  data: {
    currentStep: 1, // 当前步骤：1-欢迎页, 2-授权页, 3-问卷页
    today: '', // 今天的日期（用于限制生日选择）
    privacyAgreed: false, // 是否同意隐私政策

    // 表单数据
    formData: {
      birthday: '',
      gender: '',
      occupation: ''
    },

    // 情绪表达困扰选项
    concerns: [
      { label: '有时候说不清自己的感受', value: 'describe', checked: false },
      { label: '想说但不确定怎么开口', value: 'misunderstood', checked: false },
      { label: '想更精准地表达感受', value: 'vocabulary', checked: false },
      { label: '不确定什么时候适合表达', value: 'timing', checked: false },
      { label: '表达之后有时会反复想', value: 'regret', checked: false }
    ],

    // 使用目的选项
    goals: [
      { label: '更好地表达自己的感受', value: 'express', checked: false },
      { label: '记录和了解情绪变化', value: 'track', checked: false },
      { label: '让沟通更顺畅', value: 'relationship', checked: false },
      { label: '更了解自己', value: 'awareness', checked: false },
      { label: '找到放松的方式', value: 'relief', checked: false }
    ],

    // 情绪触发场景选项
    triggers: [
      { label: '工作/学业压力', value: 'work', checked: false },
      { label: '人际关系', value: 'social', checked: false },
      { label: '亲密关系/家庭', value: 'family', checked: false },
      { label: '自我认同/成长', value: 'identity', checked: false },
      { label: '身体健康', value: 'health', checked: false }
    ],

    // 情绪应对方式选项
    copingStyles: [
      { label: '习惯自己消化', value: 'suppress', checked: false },
      { label: '找人倾诉', value: 'talk', checked: false },
      { label: '转移注意力（刷手机/吃东西等）', value: 'distract', checked: false },
      { label: '运动/写日记等方式释放', value: 'release', checked: false },
      { label: '还在探索适合自己的方式', value: 'confused', checked: false }
    ],

    // 对话期待（多选）
    expectations: [
      { label: '有人听我说就好', value: 'listen', checked: false },
      { label: '帮我理清思路', value: 'clarify', checked: false },
      { label: '给我实际的建议', value: 'advice', checked: false },
      { label: '帮我学会表达情绪', value: 'learn', checked: false }
    ],

    // 用户信息
    userInfo: null,
    avatarUrl: '',
    nickname: ''
  },

  onLoad: function(options) {
    // 设置今天的日期
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    this.setData({
      today: `${year}-${month}-${day}`
    });

    // 检查是否已同意隐私政策
    const privacyPolicyAgreed = wx.getStorageSync('privacyPolicyAgreed');
    if (privacyPolicyAgreed) {
      this.setData({ privacyAgreed: true });
    }

    // 支持从首页直接跳转到问卷步骤（?step=3）
    if (options.step) {
      const step = parseInt(options.step, 10);
      if (step >= 1 && step <= 3) {
        this.setData({ currentStep: step, fromIndex: true });
        return;
      }
    }

    // 检查是否已经完成引导（正常入口）
    const hasOnboarded = wx.getStorageSync('hasOnboarded');
    if (hasOnboarded) {
      // 已完成引导，直接跳转到首页
      wx.reLaunch({
        url: '/pages/index/index'
      });
    }
  },

  // 切换隐私协议同意状态
  togglePrivacyAgreement: function() {
    this.setData({
      privacyAgreed: !this.data.privacyAgreed
    });
    wx.vibrateShort({ type: 'light' });
  },

  // 查看隐私政策
  viewPrivacyPolicy: function() {
    wx.navigateTo({
      url: '/pages/privacy-policy/privacy-policy?from=onboarding'
    });
  },

  // 下一步
  nextStep: function() {
    // 第一步需要先同意隐私政策
    if (this.data.currentStep === 1 && !this.data.privacyAgreed) {
      wx.showToast({
        title: '请先同意隐私政策',
        icon: 'none',
        duration: 2000
      });
      return;
    }

    // 保存隐私政策同意记录
    if (this.data.currentStep === 1 && this.data.privacyAgreed) {
      wx.setStorageSync('privacyPolicyAgreed', true);
      wx.setStorageSync('privacyPolicyAgreedTime', new Date().toISOString());
    }

    this.setData({
      currentStep: this.data.currentStep + 1
    });

    // 触觉反馈
    wx.vibrateShort({
      type: 'light'
    });
  },

  // 上一步
  prevStep: function() {
    if (this.data.currentStep > 1) {
      this.setData({
        currentStep: this.data.currentStep - 1
      });

      // 触觉反馈
      wx.vibrateShort({
        type: 'light'
      });
    }
  },

  // 选择头像
  onChooseAvatar: function(e) {
    const avatarUrl = e.detail.avatarUrl;
    this.setData({ avatarUrl });
  },

  // 输入昵称
  onInputNickname: function(e) {
    this.setData({ nickname: e.detail.value });
  },

  // 确认头像和昵称
  onConfirmProfile: function() {
    const { avatarUrl, nickname } = this.data;

    // 至少需要填写昵称
    if (!nickname || nickname.trim() === '') {
      wx.showToast({
        title: '请填写昵称',
        icon: 'none',
        duration: 2000
      });
      return;
    }

    const userInfo = {
      avatarUrl: avatarUrl || '',
      nickName: nickname.trim()
    };

    this.setData({ userInfo });
    wx.setStorageSync('userInfo', userInfo);

    this.nextStep();
  },

  // 跳过授权
  skipAuth: function() {
    this.nextStep();
  },

  // 生日选择
  onBirthdayChange: function(e) {
    this.setData({
      'formData.birthday': e.detail.value
    });
  },

  // 选择性别
  selectGender: function(e) {
    const value = e.currentTarget.dataset.value;
    this.setData({
      'formData.gender': value
    });

    // 触觉反馈
    wx.vibrateShort({
      type: 'light'
    });
  },

  // 选择职业
  selectOccupation: function(e) {
    const value = e.currentTarget.dataset.value;
    this.setData({
      'formData.occupation': value
    });

    // 触觉反馈
    wx.vibrateShort({
      type: 'light'
    });
  },

  // 切换困扰选项
  toggleConcern: function(e) {
    const index = e.currentTarget.dataset.index;
    const concerns = this.data.concerns;
    concerns[index].checked = !concerns[index].checked;

    this.setData({
      concerns: concerns
    });

    // 触觉反馈
    wx.vibrateShort({
      type: 'light'
    });
  },

  // 切换目标选项
  toggleGoal: function(e) {
    const index = e.currentTarget.dataset.index;
    const goals = this.data.goals;
    goals[index].checked = !goals[index].checked;

    this.setData({
      goals: goals
    });

    // 触觉反馈
    wx.vibrateShort({
      type: 'light'
    });
  },

  // 切换情绪触发场景
  toggleTrigger: function(e) {
    const index = e.currentTarget.dataset.index;
    const triggers = this.data.triggers;
    triggers[index].checked = !triggers[index].checked;

    this.setData({
      triggers: triggers
    });

    wx.vibrateShort({ type: 'light' });
  },

  // 切换应对方式
  toggleCoping: function(e) {
    const index = e.currentTarget.dataset.index;
    const copingStyles = this.data.copingStyles;
    copingStyles[index].checked = !copingStyles[index].checked;

    this.setData({
      copingStyles: copingStyles
    });

    wx.vibrateShort({ type: 'light' });
  },

  // 切换对话期待（多选）
  toggleExpectation: function(e) {
    const index = e.currentTarget.dataset.index;
    const expectations = this.data.expectations;
    expectations[index].checked = !expectations[index].checked;

    this.setData({
      expectations: expectations
    });

    wx.vibrateShort({ type: 'light' });
  },

  // 提交问卷
  submitSurvey: function() {
    const { formData, concerns, goals, triggers, copingStyles, expectations } = this.data;

    // 收集选中项
    const selectedConcerns = concerns.filter(item => item.checked).map(item => item.value);
    const selectedGoals = goals.filter(item => item.checked).map(item => item.value);
    const selectedTriggers = triggers.filter(item => item.checked).map(item => item.value);
    const selectedCoping = copingStyles.filter(item => item.checked).map(item => item.value);
    const selectedExpectations = expectations.filter(item => item.checked).map(item => item.value);

    // 验证：至少选择一项（任意类别）
    const hasAnySelection = selectedConcerns.length > 0 ||
                           selectedGoals.length > 0 ||
                           selectedTriggers.length > 0 ||
                           selectedCoping.length > 0 ||
                           selectedExpectations.length > 0;

    if (!hasAnySelection) {
      wx.showToast({
        title: '请至少选择一项，帮助小知了解你',
        icon: 'none',
        duration: 2500
      });
      return;
    }

    // 构建用户画像数据
    const userProfile = {
      ...formData,
      concerns: selectedConcerns,
      goals: selectedGoals,
      triggers: selectedTriggers,
      copingStyles: selectedCoping,
      expectations: selectedExpectations,
      createdAt: new Date().toISOString()
    };

    // 保存用户画像
    wx.setStorageSync('userProfile', userProfile);

    // 同步到云端（异步，不阻塞页面跳转）
    cloudUtil.saveUserProfileToCloud(userProfile).then(() => {
      console.log('用户画像已同步到云端');
    }).catch(err => {
      console.error('用户画像云端同步失败，已保存到本地', err);
    });

    // 标记已完成引导
    wx.setStorageSync('hasOnboarded', true);

    // 触觉反馈
    wx.vibrateShort({
      type: 'medium'
    });

    // 显示欢迎提示
    wx.showToast({
      title: this.data.fromIndex ? '画像已完善' : '欢迎来到知愈',
      icon: 'success',
      duration: 2000
    });

    // 填写完问卷后统一进入首页
    setTimeout(() => {
      wx.reLaunch({ url: '/pages/index/index' });
    }, 2000);
  },

  // 跳过问卷
  skipSurvey: function() {
    // 标记已完成引导（即使跳过）
    wx.setStorageSync('hasOnboarded', true);

    // 统一跳转到首页
    wx.reLaunch({ url: '/pages/index/index' });
  }
})
