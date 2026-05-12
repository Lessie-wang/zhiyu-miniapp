# 知愈小程序用户输入场景审计报告

## 发现的 wx.showModal 输入场景

### 1. companion.js - 陪伴者管理
**场景 1: 添加陪伴者**
- 位置: `pages/companion/companion.js:34-47`
- 用途: 输入陪伴者姓名
- 当前实现: `wx.showModal` 单行输入
- placeholder: "例如：妈妈、小明"
- 输入类型: 短文本（姓名）

**场景 2: 修改备注**
- 位置: `pages/companion/companion.js:192-212`
- 用途: 修改陪伴者备注名称
- 当前实现: `wx.showModal` 单行输入
- placeholder: 原有名称
- 输入类型: 短文本（姓名）

### 2. period-tracker.js - 经期追踪
**场景: 添加症状**
- 位置: `pages/period-tracker/period-tracker.js:280-295`
- 用途: 输入经期症状描述
- 当前实现: `wx.showModal` 单行输入
- placeholder: "例如：轻微头痛"
- 输入类型: 短文本（症状描述）

### 3. sensory-writing.js - 感官写作
**场景: 自定义场景**
- 位置: `pages/sensory-writing/sensory-writing.js:164-189`
- 用途: 描述自定义写作场景
- 当前实现: `wx.showModal` 单行输入
- placeholder: "描述你此刻的状态或场景..."
- 输入类型: 中等长度文本（场景描述）
- **建议**: 应该使用多行输入

### 4. women.js - 女性健康
**场景: 设置周期长度**
- 位置: `pages/women/women.js:298-324`
- 用途: 输入月经周期天数
- 当前实现: `wx.showModal` 单行输入
- placeholder: "28"
- 输入类型: 数字（21-35）
- **建议**: 可以使用数字选择器（picker）

### 5. main.js - 主页（已完成）
**场景: 自定义情绪**
- 位置: `pages/main/main.js:482-515`
- 用途: 输入自定义情绪词
- **状态**: ✅ 已改造为知愈风格多行输入

---

## 输入场景分类

### A类：短文本输入（姓名、标签）
- companion.js - 添加陪伴者
- companion.js - 修改备注
- **建议方案**: 单行知愈风格输入框

### B类：中等长度文本（描述、症状）
- period-tracker.js - 添加症状
- sensory-writing.js - 自定义场景
- **建议方案**: 多行知愈风格输入框（类似 main.js 自定义情绪）

### C类：数字输入（周期、天数）
- women.js - 设置周期长度
- **建议方案**: 数字选择器或知愈风格数字输入

---

## 设计方案

### 方案 A: 创建通用输入组件
创建 `components/zh-input-modal/` 组件，支持：
- 单行/多行模式切换
- 信纸风格背景
- 字数统计
- 自动聚焦
- 知愈色系

**优点**:
- 高度复用
- 统一维护
- 一致的用户体验

**缺点**:
- 需要重构现有代码
- 组件化工作量较大

### 方案 B: 复制粘贴模式
将 main.js 的自定义情绪输入模式复制到其他页面

**优点**:
- 快速实现
- 不需要组件化

**缺点**:
- 代码重复
- 维护成本高
- 不利于后续迭代

### 方案 C: 混合方案（推荐）
1. 先用复制粘贴快速统一视觉
2. 后续重构为组件

**优点**:
- 快速见效
- 渐进式优化
- 平衡开发成本

---

## 推荐执行顺序

1. **高优先级**（用户高频使用）
   - sensory-writing.js - 自定义场景（多行）
   - companion.js - 添加陪伴者（单行）

2. **中优先级**
   - period-tracker.js - 添加症状（单行）
   - companion.js - 修改备注（单行）

3. **低优先级**（可用 picker 替代）
   - women.js - 设置周期长度（数字选择器）

---

## 下一步行动

✅ 已完成: main.js 自定义情绪输入
⏭️ 待执行: 
1. 为 sensory-writing.js 创建多行输入
2. 为 companion.js 创建单行输入
3. 为 period-tracker.js 创建单行输入
4. 考虑组件化重构
