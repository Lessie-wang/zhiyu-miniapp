Component({
  properties: {
    visible: {
      type: Boolean,
      value: false
    },
    steps: {
      type: Array,
      value: []
    },
    showSkip: {
      type: Boolean,
      value: true
    }
  },

  data: {
    currentStepIndex: 0,
    currentStep: {},
    spotlightStyle: '',
    cardStyle: '',
    fingerStyle: '',
    arrowDirection: 'top',
    isLastStep: false,
    cardAnimation: null
  },

  lifetimes: {
    attached() {
      this.initGuide();
    }
  },

  observers: {
    'visible, steps': function(visible, steps) {
      if (visible && steps && steps.length > 0) {
        this.initGuide();
      }
    },
    'currentStepIndex': function(index) {
      this.updateStep(index);
    }
  },

  methods: {
    // 初始化引导
    initGuide() {
      if (this.data.steps.length > 0) {
        this.setData({
          currentStepIndex: 0,
          isLastStep: this.data.steps.length === 1
        });
        this.updateStep(0);
      }
    },

    // 更新当前步骤
    updateStep(index) {
      const step = this.data.steps[index];
      if (!step) return;

      this.setData({
        currentStep: step,
        isLastStep: index === this.data.steps.length - 1
      });

      // 延迟计算位置，确保DOM已渲染
      setTimeout(() => {
        this.calculatePositions(step);
        this.playCardAnimation();
      }, 100);
    },

    // 计算高亮区域和卡片位置
    calculatePositions(step) {
      const query = this.createSelectorQuery();

      // 获取目标元素位置
      query.select(step.target).boundingClientRect();
      query.selectViewport().scrollOffset();

      query.exec((res) => {
        if (!res[0]) {
          console.warn('目标元素未找到:', step.target);
          return;
        }

        const rect = res[0];
        const scrollTop = res[1].scrollTop;

        // 计算高亮区域样式（镂空效果）
        const padding = step.padding || 10;
        const spotlightStyle = this.getSpotlightStyle(rect, padding);

        // 计算卡片位置
        const cardPosition = this.getCardPosition(rect, step.cardPosition);

        // 计算箭头方向
        const arrowDirection = this.getArrowDirection(rect, cardPosition);

        // 计算手指动画位置（如果需要）
        const fingerStyle = step.requireAction ? this.getFingerStyle(rect) : '';

        this.setData({
          spotlightStyle,
          cardStyle: cardPosition,
          arrowDirection,
          fingerStyle
        });
      });
    },

    // 获取镂空高亮样式
    getSpotlightStyle(rect, padding) {
      const { left, top, width, height } = rect;
      return `
        left: ${left - padding}px;
        top: ${top - padding}px;
        width: ${width + padding * 2}px;
        height: ${height + padding * 2}px;
        border-radius: ${this.data.currentStep.borderRadius || '12px'};
      `;
    },

    // 获取卡片位置
    getCardPosition(rect, preferredPosition = 'bottom') {
      const query = wx.createSelectorQuery();
      const systemInfo = wx.getSystemInfoSync();
      const screenHeight = systemInfo.windowHeight;
      const screenWidth = systemInfo.windowWidth;

      const cardWidth = 300; // 卡片宽度
      const cardMargin = 20; // 边距
      const arrowHeight = 12; // 箭头高度

      let left = (screenWidth - cardWidth) / 2;
      let top = 0;

      // 根据目标位置和屏幕空间决定卡片位置
      if (preferredPosition === 'bottom' && rect.bottom + 100 < screenHeight) {
        // 在目标下方
        top = rect.bottom + arrowHeight + 20;
      } else if (preferredPosition === 'top' && rect.top > 150) {
        // 在目标上方
        top = rect.top - 150 - arrowHeight;
      } else if (rect.bottom + 100 < screenHeight) {
        // 默认在下方
        top = rect.bottom + arrowHeight + 20;
      } else {
        // 空间不足，放在上方
        top = rect.top - 150 - arrowHeight;
      }

      return `left: ${left}px; top: ${top}px; width: ${cardWidth}px;`;
    },

    // 获取箭头方向
    getArrowDirection(rect, cardPosition) {
      const cardTop = parseInt(cardPosition.match(/top:\s*(\d+)px/)[1]);

      if (cardTop < rect.top) {
        return 'bottom'; // 卡片在上方，箭头朝下
      } else {
        return 'top'; // 卡片在下方，箭头朝上
      }
    },

    // 获取手指动画位置
    getFingerStyle(rect) {
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      return `left: ${centerX - 20}px; top: ${centerY - 20}px;`;
    },

    // 播放卡片入场动画
    playCardAnimation() {
      const animation = wx.createAnimation({
        duration: 400,
        timingFunction: 'ease-out'
      });

      animation.scale(0.8).opacity(0).step({ duration: 0 });
      animation.scale(1).opacity(1).step({ duration: 400 });

      this.setData({
        cardAnimation: animation.export()
      });
    },

    // 下一步
    onNext() {
      const nextIndex = this.data.currentStepIndex + 1;

      if (nextIndex < this.data.steps.length) {
        this.setData({
          currentStepIndex: nextIndex
        });

        // 触觉反馈
        wx.vibrateShort({ type: 'light' });
      } else {
        // 完成引导
        this.onComplete();
      }
    },

    // 跳过引导
    onSkip() {
      wx.showModal({
        title: '确定跳过引导？',
        content: '你可以随时在设置中重新查看引导',
        confirmText: '跳过',
        cancelText: '继续',
        success: (res) => {
          if (res.confirm) {
            this.onComplete(true);
          }
        }
      });
    },

    // 点击遮罩
    onMaskTap() {
      // 如果当前步骤不需要用户操作，点击遮罩可以继续
      if (!this.data.currentStep.requireAction) {
        this.onNext();
      }
    },

    // 完成引导
    onComplete(skipped = false) {
      this.triggerEvent('complete', { skipped });

      // 保存引导完成状态
      wx.setStorageSync('hasCompletedGuide', true);

      // 触觉反馈
      wx.vibrateShort({ type: 'medium' });
    },

    // 处理目标元素点击（由父组件调用）
    handleTargetClick() {
      if (this.data.currentStep.requireAction) {
        this.onNext();
      }
    }
  }
});
