/**
 * 知愈小程序 - 卡片组件
 */
Component({
  options: {
    addGlobalClass: true,
    multipleSlots: true
  },

  properties: {
    // 卡片类型: default, glass, elevated
    type: {
      type: String,
      value: 'default'
    },
    // 标题
    title: {
      type: String,
      value: ''
    },
    // 右侧额外内容
    extra: {
      type: String,
      value: ''
    },
    // 是否显示底部
    footer: {
      type: Boolean,
      value: false
    },
    // 是否显示阴影
    shadow: {
      type: Boolean,
      value: true
    },
    // 是否启用悬停效果
    hover: {
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
      this.triggerEvent('tap', e);
    }
  }
});
