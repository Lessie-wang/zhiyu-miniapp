/**
 * 知愈小程序 - 加载组件
 */
Component({
  options: {
    addGlobalClass: true
  },

  properties: {
    // 加载类型: spinner, dots, wave
    type: {
      type: String,
      value: 'spinner'
    },
    // 加载颜色
    color: {
      type: String,
      value: '#C8B8A8'
    },
    // 加载文字
    text: {
      type: String,
      value: ''
    },
    // 自定义类名
    customClass: {
      type: String,
      value: ''
    }
  }
});
