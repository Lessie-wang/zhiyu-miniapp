/**
 * 知愈小程序 - 按钮组件
 */
Component({
  options: {
    addGlobalClass: true,
    multipleSlots: true
  },

  properties: {
    // 按钮类型: primary, secondary, ghost, text, glass
    type: {
      type: String,
      value: 'primary'
    },
    // 按钮尺寸: small, medium, large
    size: {
      type: String,
      value: 'medium'
    },
    // 按钮文字
    text: {
      type: String,
      value: ''
    },
    // 图标路径
    icon: {
      type: String,
      value: ''
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      value: false
    },
    // 是否加载中
    loading: {
      type: Boolean,
      value: false
    },
    // 是否块级按钮
    block: {
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
      if (this.data.disabled || this.data.loading) {
        return;
      }
      this.triggerEvent('tap', e);
    }
  }
});
