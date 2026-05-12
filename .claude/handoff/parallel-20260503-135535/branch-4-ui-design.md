# 分支4: UI设计系统统一

> 项目：知愈微信小程序并行优化
> 分支：branch-4-ui-design
> 预估工作量：3小时

---

## 🎯 分支目标

建立统一的UI设计系统，提取全局样式变量，创建可复用的组件样式，确保整个小程序的视觉一致性。

### 核心任务
1. 建立全局色系变量系统
2. 统一玻璃态效果样式
3. 创建可复用的卡片组件样式
4. 统一动画和过渡效果
5. 优化全局字体和排版
6. 创建设计规范文档

---

## 📁 文件范围

### ✅ 可以修改的文件
- `app.wxss` — 全局样式文件
- `styles/` 目录下的所有文件
  - `styles/variables.wxss` — 色系变量（可能需要创建）
  - `styles/components.wxss` — 组件样式（可能需要创建）
  - `styles/animations.wxss` — 动画效果（可能需要创建）
  - `styles/gamification.wxss` — 游戏化样式（已存在）
- `components/` 目录下的组件样式文件（如果有）

### ❌ 不能修改的文件（其他分支负责）
- `pages/index/*` — 由分支1负责
- `pages/chat/*` — 由分支2负责
- `pages/knowledge/*` — 由分支3负责
- `pages/psych-knowledge/*` — 由分支3负责

### ⚠️ 需要协调的共享资源
- 各页面的 `.wxss` 文件 — 可以读取分析，但不要直接修改
- 提取共同样式后，在完成报告中说明哪些页面可以迁移到全局样式

---

## 🔧 技术上下文

### 项目信息
- **项目名称**: 知愈 (FeelingMosaic)
- **项目类型**: 微信小程序
- **技术栈**: 原生小程序框架 (WXML + WXSS + JS)
- **项目路径**: `d:\Obsidian\10-Projects\知愈 FeelingMosaic\知愈 微信小程序\`

### 当前设计系统状态
**Morandi 色系**（已在使用，但未统一定义）:
- 粉色: `#F5C6CB`
- 米驼色: `#D4B8A5`
- 薰衣草色: `#C4B5D8`
- 鼠尾草绿: `#C4D4B5`
- 金色: `#E8D4B8`
- 背景色: `#FAF9F7`

**设计原则**（已在使用，但未统一）:
- 玻璃态效果 (glass morphism)
- 柔和的水彩质感
- 流畅的动画过渡 (0.3s ease)
- 圆角统一 16rpx
- 阴影: `0 4rpx 12rpx rgba(0,0,0,0.08)`

**已知问题**:
- 色值在各页面中重复定义
- 玻璃态效果代码重复
- 卡片样式不统一
- 动画效果分散定义
- 缺少全局变量系统

---

## 📝 执行计划

### 任务1: 分析现有样式系统
- [ ] 读取 `app.wxss` 了解当前全局样式
- [ ] 读取 `styles/` 目录下的所有文件
- [ ] 扫描所有页面的 `.wxss` 文件，识别重复样式
- [ ] 统计色值使用情况
- [ ] 识别玻璃态效果的不同实现
- [ ] 识别卡片样式的变体

### 任务2: 建立全局色系变量
- [ ] 创建 `styles/variables.wxss`
- [ ] 定义 Morandi 色系变量
- [ ] 定义渐变色变量
- [ ] 定义透明度变量
- [ ] 定义阴影变量
- [ ] 在 `app.wxss` 中引入

### 任务3: 统一玻璃态效果
- [ ] 创建标准玻璃态 class
- [ ] 定义不同透明度的变体
- [ ] 定义不同模糊度的变体
- [ ] 添加浏览器兼容性处理

### 任务4: 创建可复用卡片样式
- [ ] 定义基础卡片 class
- [ ] 定义卡片变体（大/中/小）
- [ ] 定义卡片状态（hover/active/disabled）
- [ ] 统一卡片内部元素样式

### 任务5: 统一动画效果
- [ ] 创建 `styles/animations.wxss`
- [ ] 定义标准过渡时间
- [ ] 定义常用动画（fade/slide/scale/float）
- [ ] 定义缓动函数
- [ ] 优化性能（使用 transform）

### 任务6: 优化全局字体和排版
- [ ] 定义字体大小体系
- [ ] 定义行高体系
- [ ] 定义字重体系
- [ ] 定义间距体系
- [ ] 统一文本省略样式

### 任务7: 整合游戏化样式
- [ ] 检查 `styles/gamification.wxss`
- [ ] 提取可复用的样式到全局
- [ ] 保留游戏化特有的样式
- [ ] 确保与全局样式兼容

### 任务8: 创建设计规范文档
- [ ] 编写 `DESIGN_SYSTEM.md`
- [ ] 记录色系使用规范
- [ ] 记录组件样式使用方法
- [ ] 记录动画使用规范
- [ ] 提供代码示例

---

## 🎨 设计系统结构

### 文件组织
```
styles/
├── variables.wxss      # 色系、尺寸、阴影变量
├── components.wxss     # 可复用组件样式
├── animations.wxss     # 动画和过渡效果
├── typography.wxss     # 字体和排版
└── gamification.wxss   # 游戏化样式（已存在）

app.wxss                # 引入所有全局样式
```

### 变量命名规范
```css
/* 色系变量 */
--color-primary: #F5C6CB;
--color-secondary: #D4B8A5;
--color-accent: #C4B5D8;
--color-success: #C4D4B5;
--color-warning: #E8D4B8;
--color-bg: #FAF9F7;

/* 渐变变量 */
--gradient-pink: linear-gradient(135deg, #F5C6CB, #FFE0E5);
--gradient-lavender: linear-gradient(135deg, #C4B5D8, #E8D4F0);

/* 透明度变量 */
--opacity-glass: 0.7;
--opacity-overlay: 0.5;

/* 阴影变量 */
--shadow-sm: 0 2rpx 8rpx rgba(0,0,0,0.06);
--shadow-md: 0 4rpx 12rpx rgba(0,0,0,0.08);
--shadow-lg: 0 8rpx 24rpx rgba(0,0,0,0.12);

/* 圆角变量 */
--radius-sm: 8rpx;
--radius-md: 16rpx;
--radius-lg: 24rpx;

/* 间距变量 */
--spacing-xs: 8rpx;
--spacing-sm: 16rpx;
--spacing-md: 24rpx;
--spacing-lg: 32rpx;
--spacing-xl: 48rpx;
```

### 组件样式规范
```css
/* 玻璃态卡片 */
.glass-card {
  background: rgba(255, 255, 255, var(--opacity-glass));
  backdrop-filter: blur(20rpx);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  transition: all 0.3s ease;
}

.glass-card-hover:active {
  transform: scale(0.98);
  box-shadow: var(--shadow-sm);
}

/* 标准卡片 */
.card {
  background: #fff;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  padding: var(--spacing-md);
}

.card-sm { padding: var(--spacing-sm); }
.card-lg { padding: var(--spacing-lg); }
```

### 动画规范
```css
/* 标准过渡 */
.transition-fast { transition: all 0.15s ease; }
.transition-normal { transition: all 0.3s ease; }
.transition-slow { transition: all 0.5s ease; }

/* 常用动画 */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { transform: translateY(20rpx); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10rpx); }
}
```

---

## 🔗 与其他分支的接口约定

### 与分支1（Index页面）的接口
- **接口点**: 全局色系变量、卡片样式
- **约定**: 分支1可以使用全局样式，但不要修改
- **迁移建议**: 在完成报告中说明 Index 页面哪些样式可以迁移到全局

### 与分支2（Chat页面）的接口
- **接口点**: 玻璃态消息气泡样式
- **约定**: 提供标准玻璃态 class，分支2可以直接使用
- **迁移建议**: Chat 页面的玻璃态效果可以使用全局 class

### 与分支3（知识库页面）的接口
- **接口点**: 卡片样式、搜索框样式
- **约定**: 提供标准卡片 class，分支3可以直接使用
- **迁移建议**: 知识库卡片可以使用全局卡片样式

### 全局协调
- **变量优先**: 所有分支应优先使用全局变量，而不是硬编码色值
- **组件复用**: 鼓励使用全局组件样式，减少重复代码
- **动画统一**: 使用全局定义的动画效果，确保一致性

---

## ✅ 完成标准

### 功能完成标准
- [ ] 全局色系变量系统建立
- [ ] 玻璃态效果统一
- [ ] 可复用卡片样式创建
- [ ] 动画效果统一
- [ ] 字体和排版优化
- [ ] 设计规范文档完成

### 代码质量标准
- [ ] 变量命名清晰一致
- [ ] 代码整洁，有必要的注释
- [ ] 符合 CSS 最佳实践
- [ ] 性能优化（避免重绘重排）

### 视觉标准
- [ ] 色系应用一致
- [ ] 玻璃态效果统一
- [ ] 卡片样式统一
- [ ] 动画过渡自然
- [ ] 在不同设备上显示正常

### 文档标准
- [ ] 设计规范文档完整
- [ ] 代码示例清晰
- [ ] 使用说明详细
- [ ] 迁移指南明确

### 提交标准
- [ ] 代码已提交到分支 `feature/ui-design-system`
- [ ] 提交信息清晰
- [ ] 完成报告已编写

---

## 🚀 快速启动指令

参考 `prompt-4-ui-design.txt` 文件，复制其内容到新的 Claude Code 对话中。

---

## 📌 重要提醒

### ⚠️ 注意事项
1. **不要破坏现有样式** — 只添加全局样式，不要修改页面特定样式
2. **向后兼容** — 确保新的全局样式不会影响现有页面
3. **性能优先** — 避免过度使用 backdrop-filter（性能开销大）
4. **浏览器兼容** — 考虑微信小程序的兼容性
5. **文档完善** — 提供清晰的使用说明和示例

### 💡 优化建议
- **CSS变量**: 使用 CSS 自定义属性（`--variable-name`）
- **BEM命名**: 使用 BEM 命名规范（`.block__element--modifier`）
- **原子化**: 提供原子化的工具类（`.text-center`, `.mt-16` 等）
- **响应式**: 考虑不同屏幕尺寸的适配
- **暗色模式**: 预留暗色模式的变量（可选）

### 🔍 样式提取清单
从现有页面中提取以下样式：
- [ ] 色值使用（统计频率）
- [ ] 玻璃态效果（不同实现）
- [ ] 卡片样式（不同变体）
- [ ] 按钮样式（不同状态）
- [ ] 输入框样式
- [ ] 标签样式
- [ ] 动画效果
- [ ] 字体大小和行高

---

## 📊 预期成果

### 优化前 vs 优化后

| 维度 | 优化前 | 优化后 |
|------|-------|-------|
| 色值定义 | 分散在各页面 | 统一全局变量 |
| 玻璃态效果 | 代码重复 | 统一 class |
| 卡片样式 | 不一致 | 统一可复用 |
| 动画效果 | 分散定义 | 统一动画库 |
| 代码复用 | 低 | 高 |
| 维护成本 | 高 | 低 |

### 设计系统收益
- **一致性**: 整个小程序视觉统一
- **效率**: 新页面开发更快
- **维护**: 样式修改只需改一处
- **质量**: 减少样式 bug
- **协作**: 团队协作更顺畅

---

## 📞 完成后报告模板

```markdown
## UI设计系统统一完成报告

### 完成的任务
- [x] 任务1: 建立全局色系变量系统
- [x] 任务2: 统一玻璃态效果样式
- [x] 任务3: 创建可复用卡片样式
- [x] 任务4: 统一动画和过渡效果
- [x] 任务5: 优化全局字体和排版
- [x] 任务6: 创建设计规范文档

### 主要改动
1. **全局变量**: 创建 `styles/variables.wxss`，定义色系、尺寸、阴影变量
2. **组件样式**: 创建 `styles/components.wxss`，提供可复用的卡片、按钮、输入框样式
3. **动画效果**: 创建 `styles/animations.wxss`，统一动画和过渡效果
4. **字体排版**: 创建 `styles/typography.wxss`，统一字体大小、行高、字重
5. **设计文档**: 创建 `DESIGN_SYSTEM.md`，记录设计规范和使用方法

### 新增/修改的文件
- `styles/variables.wxss` — 新增，全局变量定义
- `styles/components.wxss` — 新增，可复用组件样式
- `styles/animations.wxss` — 新增，动画效果库
- `styles/typography.wxss` — 新增，字体排版系统
- `app.wxss` — 修改，引入所有全局样式
- `DESIGN_SYSTEM.md` — 新增，设计规范文档

### 全局样式清单
**色系变量** (10个):
- 主色、辅色、强调色、成功色、警告色
- 背景色、文本色、边框色
- 渐变色（2个）

**组件样式** (15个):
- 玻璃态卡片（3个变体）
- 标准卡片（3个尺寸）
- 按钮（4个状态）
- 输入框（2个状态）
- 标签（3个变体）

**动画效果** (8个):
- fadeIn, fadeOut, slideUp, slideDown
- scaleIn, scaleOut, float, pulse

**字体排版** (12个):
- 字体大小（6个级别）
- 行高（3个级别）
- 字重（3个级别）

### 样式迁移建议
**分支1（Index页面）**:
- 可以使用 `.glass-card` 替换自定义玻璃态效果
- 可以使用全局色系变量替换硬编码色值

**分支2（Chat页面）**:
- 消息气泡可以使用 `.glass-card` 和 `.card`
- 动画可以使用全局动画效果

**分支3（知识库页面）**:
- 知识卡片可以使用 `.card` 和 `.card-lg`
- 搜索框可以使用全局输入框样式

### 需要其他分支注意的点
- 所有分支应优先使用全局变量，而不是硬编码色值
- 玻璃态效果统一使用 `.glass-card` class
- 动画效果统一使用全局定义的动画
- 新增组件样式应考虑添加到全局

### 测试结果
- [x] 全局样式在微信开发者工具中正常显示
- [x] 变量系统工作正常
- [x] 组件样式可复用
- [x] 动画效果流畅
- [x] 无样式冲突
- [x] 性能良好

### 设计规范文档
详见 `DESIGN_SYSTEM.md`，包含：
- 色系使用规范
- 组件样式使用方法
- 动画使用规范
- 代码示例
- 最佳实践

### 遗留问题（如有）
- 部分页面仍使用硬编码色值，建议后续迁移

### 建议
- 建议所有新页面都使用全局样式系统
- 建议定期审查页面样式，提取可复用的部分
- 建议建立样式审查流程，确保一致性
```

---

**文档版本**: v1.0
**生成时间**: 2026-05-03 13:55
