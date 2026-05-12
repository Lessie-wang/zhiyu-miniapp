/**
 * 知愈小程序 - 情绪标签组件
 */
Component({
  options: {
    addGlobalClass: true
  },

  properties: {
    // 情绪名称
    name: {
      type: String,
      value: ''
    },
    // 情绪图标路径
    icon: {
      type: String,
      value: ''
    },
    // 背景颜色
    bgColor: {
      type: String,
      value: 'rgba(255, 255, 255, 0.9)'
    },
    // 文字颜色
    textColor: {
      type: String,
      value: '#6D6A65'
    },
    // 尺寸: small, medium, large
    size: {
      type: String,
      value: 'medium'
    },
    // 是否可点击
    clickable: {
      type: Boolean,
      value: false
    },
    // 是否可关闭
    closable: {
      type: Boolean,
      value: false
    },
    // 自定义类名
    customClass: {
      type: String,
      value: ''
    }
  },

  methods: {
    handleTap(e) {
      if (this.data.clickable) {
        this.triggerEvent('tap', e);
      }
    },

    handleClose(e) {
      this.triggerEvent('close', e);
    }
  }
});
