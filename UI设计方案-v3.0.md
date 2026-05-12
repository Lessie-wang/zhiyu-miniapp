# 知愈小程序 UI 设计方案 v3.0 - 高级精致版

## 设计理念

**核心定位**: 高端情绪健康工具，融合东方禅意与现代设计美学

**设计关键词**: 
- 流动 (Flowing) - 情绪如水，自然流淌
- 呼吸 (Breathing) - 动态节奏，生命律动
- 治愈 (Healing) - 温暖包容，心灵港湾
- 精致 (Refined) - 细节考究，品质感

---

## 一、视觉风格系统

### 1.1 色彩系统升级

**主色调 - 温暖大地色系**
```
主色: #D4B8A5 (暖棕) - 温暖、包容、稳定
辅色: #C4A893 (深棕) - 深沉、可靠
强调色: #E8C4A8 (蜜桃金) - 温暖、希望
```

**情绪色彩 - 扩展Morandi色系**
```
开心: #F5C6CB → #FFD4D8 (更明亮的粉)
平静: #B8D4E8 → #C8E0F0 (更柔和的蓝)
难过: #9BA8BC → #A8B5C8 (更温柔的灰蓝)
累: #D4C5B0 → #E0D5C0 (更温暖的米)
烦躁: #E8A5A5 → #F0B8B8 (更柔和的珊瑚)
焦虑: #C4B5D8 → #D4C5E8 (更淡的紫)
愤怒: #D89B9B → #E8B0B0 (更柔和的砖红)
感动: #F5D4C4 → #FFE0D0 (更温暖的桃)
困惑: #C4D4B5 → #D4E0C8 (更明亮的绿)
无聊: #D0CFC4 → #E0DFD4 (更亮的灰米)
震惊: #E8C4D8 → #F0D4E8 (更柔和的粉紫)
不知道: #BCBCBC → #D0D0D0 (更亮的灰)
```

**背景渐变系统**
```css
/* 主背景 - 三维渐变 */
background: radial-gradient(ellipse at top left, #FAF9F7 0%, #F5F0EB 40%, #F2E6DF 100%);

/* 卡片背景 - 动态渐变 */
background: linear-gradient(135deg, 
  rgba(255, 255, 255, 0.95) 0%, 
  rgba(255, 253, 248, 0.9) 50%,
  rgba(250, 245, 240, 0.85) 100%
);

/* 情绪卡片选中 - 流动渐变 */
background: linear-gradient(135deg, 
  var(--emotion-color) 0%, 
  var(--emotion-color-light) 50%,
  var(--emotion-color) 100%
);
background-size: 200% 200%;
animation: gradientFlow 3s ease infinite;
```

### 1.2 字体系统

**中文字体**
```css
/* 主标题 - 优雅衬线 */
font-family: "Source Han Serif CN", "思源宋体", "Noto Serif SC", serif;
font-weight: 600;
letter-spacing: 2rpx;

/* 正文 - 现代无衬线 */
font-family: "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
font-weight: 400;
letter-spacing: 0.5rpx;

/* 数字/时间 - 等宽优雅 */
font-family: "SF Pro Display", "Helvetica Neue", -apple-system, sans-serif;
font-weight: 200;
font-variant-numeric: tabular-nums;
```

**字号层级**
```
超大标题: 88rpx (时间显示)
大标题: 48rpx (页面标题)
中标题: 36rpx (区块标题)
小标题: 28rpx (卡片标题)
正文: 26rpx (正文内容)
辅助文字: 22rpx (提示文字)
```

### 1.3 间距系统

**8px基础网格**
```
微间距: 8rpx, 12rpx, 16rpx
标准间距: 24rpx, 32rpx, 40rpx
大间距: 48rpx, 64rpx, 80rpx
超大间距: 96rpx, 128rpx
```

### 1.4 圆角系统

**层次化圆角**
```
微圆角: 12rpx (小标签)
小圆角: 20rpx (按钮)
中圆角: 32rpx (卡片)
大圆角: 48rpx (大卡片)
超大圆角: 64rpx (特殊容器)
完全圆角: 50% (圆形元素)
```

---

## 二、动画系统

### 2.1 呼吸动画 (Breathing Animation)

**用途**: 情绪卡片、引导元素

```css
@keyframes breathe {
  0%, 100% {
    transform: scale(1);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.05);
    opacity: 1;
  }
}

.breathing-element {
  animation: breathe 4s ease-in-out infinite;
}
```

### 2.2 流动渐变 (Flowing Gradient)

**用途**: 选中状态、强调元素

```css
@keyframes gradientFlow {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.flowing-gradient {
  background-size: 200% 200%;
  animation: gradientFlow 3s ease infinite;
}
```

### 2.3 浮动效果 (Floating)

**用途**: 装饰元素、图标

```css
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-12rpx);
  }
}

.floating-element {
  animation: float 3s ease-in-out infinite;
}
```

### 2.4 波纹扩散 (Ripple)

**用途**: 点击反馈、情绪传播

```css
@keyframes ripple {
  0% {
    transform: scale(0);
    opacity: 1;
  }
  100% {
    transform: scale(4);
    opacity: 0;
  }
}

.ripple-effect {
  animation: ripple 0.6s ease-out;
}
```

### 2.5 粒子漂浮 (Particle Float)

**用途**: 背景装饰

```css
@keyframes particleFloat {
  0% {
    transform: translate(0, 0) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 0.6;
  }
  90% {
    opacity: 0.6;
  }
  100% {
    transform: translate(100rpx, -200rpx) rotate(360deg);
    opacity: 0;
  }
}

.particle {
  animation: particleFloat 8s ease-in-out infinite;
}
```

### 2.6 光晕脉冲 (Glow Pulse)

**用途**: 选中状态、焦点元素

```css
@keyframes glowPulse {
  0%, 100% {
    box-shadow: 0 0 20rpx rgba(212, 184, 165, 0.3);
  }
  50% {
    box-shadow: 0 0 40rpx rgba(212, 184, 165, 0.6);
  }
}

.glow-element {
  animation: glowPulse 2s ease-in-out infinite;
}
```

---

## 三、组件设计

### 3.1 情绪卡片 v3.0

**设计特点**:
- 毛玻璃背景 + 动态渐变边框
- 图标呼吸动画
- 选中时流动渐变 + 光晕脉冲
- 3D悬浮效果

```css
.emotion-card {
  /* 基础样式 */
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.95) 0%, 
    rgba(255, 253, 248, 0.9) 100%
  );
  backdrop-filter: blur(30rpx) saturate(180%);
  border-radius: 32rpx;
  border: 2rpx solid rgba(255, 255, 255, 0.8);
  box-shadow: 
    0 8rpx 32rpx rgba(212, 184, 165, 0.12),
    0 2rpx 8rpx rgba(212, 184, 165, 0.08),
    inset 0 1rpx 0 rgba(255, 255, 255, 0.9);
  
  /* 3D效果 */
  transform-style: preserve-3d;
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.emotion-card:hover {
  transform: translateY(-8rpx) rotateX(5deg);
  box-shadow: 
    0 16rpx 48rpx rgba(212, 184, 165, 0.2),
    0 4rpx 16rpx rgba(212, 184, 165, 0.12);
}

.emotion-card.selected {
  background: linear-gradient(135deg, 
    var(--emotion-color) 0%, 
    var(--emotion-color-light) 50%,
    var(--emotion-color) 100%
  );
  background-size: 200% 200%;
  animation: gradientFlow 3s ease infinite, glowPulse 2s ease-in-out infinite;
  transform: translateY(-12rpx) scale(1.05);
  border-color: var(--emotion-color);
}

.emotion-icon {
  width: 72rpx;
  height: 72rpx;
  filter: drop-shadow(0 4rpx 12rpx rgba(212, 184, 165, 0.2));
  animation: breathe 4s ease-in-out infinite;
  transition: all 0.4s ease;
}

.emotion-card.selected .emotion-icon {
  filter: drop-shadow(0 8rpx 24rpx rgba(255, 255, 255, 0.9));
  animation: breathe 4s ease-in-out infinite, float 3s ease-in-out infinite;
}
```

### 3.2 按钮系统

**主按钮 (Primary)**
```css
.btn-primary {
  background: linear-gradient(135deg, #D4B8A5 0%, #C4A893 100%);
  border-radius: 48rpx;
  padding: 24rpx 48rpx;
  font-size: 32rpx;
  font-weight: 600;
  color: white;
  letter-spacing: 2rpx;
  box-shadow: 
    0 8rpx 24rpx rgba(212, 184, 165, 0.3),
    0 2rpx 8rpx rgba(212, 184, 165, 0.15);
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  overflow: hidden;
}

.btn-primary::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, 
    transparent, 
    rgba(255, 255, 255, 0.3), 
    transparent
  );
  transition: left 0.5s;
}

.btn-primary:active::before {
  left: 100%;
}

.btn-primary:active {
  transform: scale(0.96);
  box-shadow: 
    0 4rpx 16rpx rgba(212, 184, 165, 0.4),
    0 1rpx 4rpx rgba(212, 184, 165, 0.2);
}
```

**次按钮 (Secondary)**
```css
.btn-secondary {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20rpx);
  border: 2rpx solid rgba(212, 184, 165, 0.4);
  border-radius: 48rpx;
  padding: 24rpx 48rpx;
  font-size: 32rpx;
  font-weight: 600;
  color: #8C8780;
  letter-spacing: 2rpx;
  box-shadow: 0 4rpx 16rpx rgba(212, 184, 165, 0.1);
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.btn-secondary:active {
  background: rgba(242, 230, 223, 0.98);
  border-color: rgba(212, 184, 165, 0.6);
  transform: scale(0.96);
}
```

### 3.3 输入框系统

**信纸风格输入框**
```css
.letter-input {
  background: linear-gradient(135deg, #FFFDF8 0%, #FFF9F3 100%);
  border-radius: 32rpx;
  padding: 32rpx 28rpx;
  border: 2rpx solid rgba(212, 184, 165, 0.2);
  box-shadow: 
    0 4rpx 20rpx rgba(212, 184, 165, 0.12),
    inset 0 1rpx 0 rgba(255, 255, 255, 0.9);
  position: relative;
  overflow: hidden;
}

.letter-input::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 12rpx;
  background: linear-gradient(90deg, 
    #D4B8A5 0%, 
    #E8D4C4 25%,
    #D4B8A5 50%,
    #E8D4C4 75%,
    #D4B8A5 100%
  );
  background-size: 200% 100%;
  animation: shimmer 3s linear infinite;
  opacity: 0.6;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.letter-input textarea {
  background: transparent;
  font-size: 28rpx;
  line-height: 56rpx;
  color: #6D6A65;
  letter-spacing: 0.5rpx;
}
```

---

## 四、页面布局

### 4.1 主页布局

**顶部区域 - 时间与日期**
```
- 超大时间显示 (88rpx, 极细字重)
- 日期与星期 (28rpx)
- 节日祝福卡片 (动态渐变背景)
- 呼吸动画装饰圆点
```

**情绪选择区域**
```
- 标题 + 副标题
- 4列网格布局，间距20rpx
- 每个卡片带呼吸动画
- 选中时流动渐变 + 光晕脉冲
```

**身体感受区域**
```
- 流式布局，自适应换行
- 标签带悬浮效果
- 选中时弹性动画
```

**快速记录区域**
```
- 信纸风格容器
- 顶部装饰条带闪光动画
- 横线背景
- 自动高度调整
```

**操作按钮区域**
```
- 两按钮并排
- 主按钮带光泽扫过效果
- 次按钮毛玻璃效果
```

### 4.2 背景装饰系统

**粒子层**
```html
<view class="particle-container">
  <view class="particle" wx:for="{{20}}" style="
    left: {{item * 5}}%;
    animation-delay: {{item * 0.3}}s;
  "></view>
</view>
```

**光晕层**
```html
<view class="glow-orb glow-orb-1"></view>
<view class="glow-orb glow-orb-2"></view>
<view class="glow-orb glow-orb-3"></view>
```

```css
.glow-orb {
  position: fixed;
  width: 400rpx;
  height: 400rpx;
  border-radius: 50%;
  filter: blur(100rpx);
  opacity: 0.3;
  pointer-events: none;
  animation: orbFloat 20s ease-in-out infinite;
}

.glow-orb-1 {
  background: radial-gradient(circle, #F5C6CB, transparent);
  top: 10%;
  left: -10%;
}

.glow-orb-2 {
  background: radial-gradient(circle, #B8D4E8, transparent);
  bottom: 20%;
  right: -10%;
  animation-delay: -7s;
}

.glow-orb-3 {
  background: radial-gradient(circle, #E8D4C4, transparent);
  top: 50%;
  left: 50%;
  animation-delay: -14s;
}

@keyframes orbFloat {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(50rpx, -80rpx) scale(1.1);
  }
  66% {
    transform: translate(-50rpx, 80rpx) scale(0.9);
  }
}
```

---

## 五、微交互设计

### 5.1 点击反馈

**波纹效果**
```javascript
// 在点击位置生成波纹
function createRipple(e) {
  const ripple = document.createElement('view');
  ripple.className = 'ripple-effect';
  ripple.style.left = e.touches[0].clientX + 'px';
  ripple.style.top = e.touches[0].clientY + 'px';
  e.currentTarget.appendChild(ripple);
  
  setTimeout(() => ripple.remove(), 600);
}
```

### 5.2 加载状态

**呼吸圆环**
```css
.loading-ring {
  width: 80rpx;
  height: 80rpx;
  border: 4rpx solid rgba(212, 184, 165, 0.2);
  border-top-color: #D4B8A5;
  border-radius: 50%;
  animation: spin 1s linear infinite, breathe 2s ease-in-out infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
```

### 5.3 滚动效果

**视差滚动**
```javascript
// 背景元素随滚动移动
onPageScroll(e) {
  const scrollTop = e.scrollTop;
  this.setData({
    parallaxY: scrollTop * 0.5
  });
}
```

---

## 六、性能优化

### 6.1 动画性能

```css
/* 使用GPU加速 */
.animated-element {
  will-change: transform, opacity;
  transform: translateZ(0);
}

/* 避免重排 */
.no-reflow {
  position: absolute;
  transform: translate3d(0, 0, 0);
}
```

### 6.2 图片优化

```
- 背景图使用WebP格式
- 装饰元素使用SVG
- 情绪图标已优化为透明PNG
- 懒加载非首屏图片
```

---

## 七、实施计划

### Phase 1: 基础重构 (Day 1-2)
- [ ] 更新色彩系统
- [ ] 实现新字体系统
- [ ] 重构间距和圆角
- [ ] 更新背景渐变

### Phase 2: 动画系统 (Day 2-3)
- [ ] 实现呼吸动画
- [ ] 实现流动渐变
- [ ] 实现浮动效果
- [ ] 实现波纹反馈

### Phase 3: 组件升级 (Day 3-4)
- [ ] 重构情绪卡片
- [ ] 重构按钮系统
- [ ] 重构输入框
- [ ] 添加装饰元素

### Phase 4: 背景装饰 (Day 4-5)
- [ ] 集成AI生成的背景图
- [ ] 实现粒子系统
- [ ] 实现光晕层
- [ ] 优化性能

### Phase 5: 测试优化 (Day 5-7)
- [ ] 真机测试
- [ ] 性能优化
- [ ] 动画调优
- [ ] 细节打磨

---

**设计版本**: v3.0  
**创建时间**: 2026年4月29日  
**设计师**: Claude (Auto-v2)  
**状态**: 设计方案完成，待实施
