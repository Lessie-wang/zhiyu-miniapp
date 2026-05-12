# 自定义情绪输入框重设计

## 改进概述

将原本使用微信原生 `wx.showModal` 的单行输入框，重新设计为符合知愈品牌调性的多行文本输入弹窗。

---

## 🎨 设计改进

### Before（原设计）
- ❌ 使用微信原生 `wx.showModal`
- ❌ 单行输入框，限制表达
- ❌ 系统默认样式，与知愈品牌不符
- ❌ 视觉体验割裂

### After（新设计）
- ✅ 自定义弹窗，完全控制样式
- ✅ 多行 textarea，支持更丰富的情绪描述
- ✅ 信纸风格设计，与知愈"心之笺语"主题呼应
- ✅ 莫兰迪色系，温柔细腻的视觉体验
- ✅ 字数统计（50字限制）
- ✅ 自动聚焦，流畅的交互体验

---

## 📐 设计细节

### 1. 信纸风格输入区域
```css
/* 温暖的米黄色背景 */
background: linear-gradient(to bottom, #FFFEF9 0%, #FFFCF5 100%);

/* 横线背景，模拟信纸 */
background-image: repeating-linear-gradient(
  transparent,
  transparent 79rpx,
  rgba(212, 184, 165, 0.15) 79rpx,
  rgba(212, 184, 165, 0.15) 80rpx
);
```

### 2. 多行文本输入
- **行高**: 80rpx（与信纸横线对齐）
- **字体大小**: 30rpx
- **最小高度**: 200rpx
- **最大高度**: 400rpx（自动扩展）
- **字数限制**: 50字

### 3. 视觉层次
- 玻璃态弹窗背景
- 柔和的阴影系统
- 知愈主色调边框（#D4B8A5）
- 字数统计右下角显示

---

## 🔧 技术实现

### 文件修改

#### 1. `main.wxml`
添加自定义情绪弹窗结构：
```xml
<view class="custom-emotion-modal" wx:if="{{showCustomEmotionModal}}">
  <view class="modal-mask" bindtap="closeCustomEmotionModal"></view>
  <view class="modal-content custom-emotion-content">
    <view class="modal-header">
      <text class="modal-title">自定义情绪</text>
      <text class="modal-subtitle">用你自己的语言描述此刻的感受</text>
    </view>
    
    <view class="custom-emotion-paper">
      <view class="paper-lines">
        <textarea
          class="custom-emotion-textarea"
          placeholder="描述你的情绪感受..."
          value="{{customEmotionInput}}"
          bindinput="onCustomEmotionInput"
          maxlength="50"
          auto-height
          auto-focus
        />
      </view>
      <view class="char-count">{{customEmotionInput.length}}/50</view>
    </view>
    
    <view class="modal-buttons">
      <button class="modal-button modal-button-cancel" bindtap="closeCustomEmotionModal">取消</button>
      <button class="modal-button modal-button-confirm" bindtap="confirmCustomEmotion">确认</button>
    </view>
  </view>
</view>
```

#### 2. `main.js`
替换原有的 `wx.showModal` 逻辑：

**新增 data 字段：**
```javascript
data: {
  // ...
  showCustomEmotionModal: false,
  customEmotionInput: ''
}
```

**新增方法：**
- `showCustomEmotionInput()` - 打开弹窗
- `onCustomEmotionInput()` - 处理输入
- `closeCustomEmotionModal()` - 关闭弹窗
- `confirmCustomEmotion()` - 确认添加自定义情绪

**改进点：**
- 自动设置强度为中等（intensity: 2）
- 添加后自动滚动到身体感受区域
- 触觉反馈优化

#### 3. `main.wxss`
新增样式模块：
- `.custom-emotion-modal` - 弹窗容器
- `.custom-emotion-paper` - 信纸风格背景
- `.paper-lines` - 横线背景
- `.custom-emotion-textarea` - 多行输入框
- `.char-count` - 字数统计

---

## 🎯 用户体验提升

### 交互流程
1. 点击"自定义"卡片
2. 弹出信纸风格输入框（自动聚焦）
3. 输入情绪描述（最多50字）
4. 实时显示字数统计
5. 点击"确认"添加到情绪列表
6. 自动滚动到身体感受区域

### 视觉体验
- 🎨 莫兰迪色系，温柔细腻
- 📝 信纸横线，仪式感十足
- ✨ 玻璃态设计，现代精致
- 🌸 与知愈整体风格完美融合

### 功能增强
- 📏 50字限制，足够表达复杂情绪
- 🔢 实时字数统计，清晰反馈
- 📱 自动高度调整，适配内容
- ⚡ 自动聚焦，减少操作步骤

---

## 📊 对比总结

| 维度 | 原设计 | 新设计 |
|------|--------|--------|
| **输入方式** | 单行输入 | 多行 textarea |
| **字数限制** | 无明确提示 | 50字，实时统计 |
| **视觉风格** | 系统默认 | 知愈信纸风格 |
| **品牌一致性** | ❌ 割裂 | ✅ 统一 |
| **用户体验** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **情绪表达** | 受限 | 丰富 |

---

## 🚀 后续优化建议

1. **动画增强**
   - 添加弹窗进入/退出动画
   - 字数接近上限时的视觉提示

2. **智能提示**
   - 根据已选情绪推荐相关词汇
   - 情绪词库联想输入

3. **历史记录**
   - 保存用户常用的自定义情绪
   - 快速选择历史输入

---

## ✅ 完成状态

- [x] WXML 结构重构
- [x] JS 逻辑重写
- [x] WXSS 样式设计
- [x] 字数统计功能
- [x] 自动聚焦优化
- [x] 触觉反馈集成
- [x] 品牌色系统一

**状态**: ✨ 已完成，可直接使用
