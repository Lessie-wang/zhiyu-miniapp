# 知愈小程序 - 并行优化项目总览

> 生成时间：2026-05-03 13:55
> 项目路径：`d:\Obsidian\10-Projects\知愈 FeelingMosaic\知愈 微信小程序\`

---

## 📊 项目概览

### 总体目标
对知愈微信小程序的4个核心模块进行并行优化，提升用户体验和视觉一致性。

### 并行策略
- **分支数量**: 4个
- **预估总耗时（串行）**: 8小时
- **预估总耗时（并行）**: 2.5小时
- **效率提升**: 3.2x

---

## 🎯 分支列表

### 分支1: Index 页面修缮
- **文档**: `branch-1-index.md`
- **提示词**: `prompt-1-index.txt`
- **工作量**: 中等（2h）
- **负责页面**: `pages/index/`
- **主要任务**:
  - 优化欢迎页面布局
  - 统一 Morandi 色系
  - 添加流畅的过渡动画
  - 修复导航逻辑

### 分支2: AI对话页面修复
- **文档**: `branch-2-chat.md`
- **提示词**: `prompt-2-chat.txt`
- **工作量**: 较大（3h）
- **负责页面**: `pages/chat/`
- **主要任务**:
  - 重新设计对话界面UI
  - 优化小知头像和介绍展示
  - 改进历史记录交互
  - 实现保存功能优化

### 分支3: 知识库页面优化
- **文档**: `branch-3-knowledge.md`
- **提示词**: `prompt-3-knowledge.txt`
- **工作量**: 中等（2h）
- **负责页面**: `pages/knowledge/`, `pages/psych-knowledge/`
- **主要任务**:
  - 优化知识库内容展示
  - 改进搜索和筛选功能
  - 统一卡片设计
  - 提升阅读体验

### 分支4: UI设计系统统一
- **文档**: [`branch-4-ui-design.md`](branch-4-ui-design.md)
- **提示词**: [`prompt-4-ui-design.txt`](prompt-4-ui-design.txt)
- **工作量**: 较小（1.5h）
- **负责范围**: 全局样式、设计系统
- **主要任务**:
  - 建立全局色系变量系统
  - 统一玻璃态效果
  - 创建可复用卡片样式
  - 统一动画效果
  - 优化全局字体和排版
  - 建立设计规范文档

---

## 🔗 分支依赖关系

```
分支1 (Index) ────┐
分支2 (Chat)  ────┼──→ 分支4 (UI设计) ──→ 最终集成测试
分支3 (Knowledge)─┘
```

**说明**:
- 分支1、2、3 完全独立，可以同时进行
- 分支4 需要等待其他分支完成后，进行全局一致性检查
- 所有分支完成后进行集成测试

---

## 🚀 使用方法

### 步骤1: 开启4个对话
1. **对话1** - 复制 `prompt-1-index.txt` 内容到新对话
2. **对话2** - 复制 `prompt-2-chat.txt` 内容到新对话
3. **对话3** - 复制 `prompt-3-knowledge.txt` 内容到新对话
4. **对话4** - 等待前3个分支完成后，复制 `prompt-4-ui-design.txt`

### 步骤2: 并行工作
- 每个对话独立完成各自的任务
- 不要跨分支修改文件
- 遵守接口约定

### 步骤3: 集成
- 所有分支完成后，参考 `integration-guide.md` 进行集成
- 运行完整测试
- 验证视觉一致性

---

## 📁 文件分配

### 分支1 可修改
- `pages/index/index.js`
- `pages/index/index.wxml`
- `pages/index/index.wxss`
- `pages/index/index.json`

### 分支2 可修改
- `pages/chat/chat.js`
- `pages/chat/chat.wxml`
- `pages/chat/chat.wxss`
- `pages/chat/chat.json`

### 分支3 可修改
- `pages/knowledge/knowledge.*`
- `pages/psych-knowledge/psych-knowledge.*`

### 分支4 可修改
- `styles/*.wxss` (全局样式)
- `app.wxss`
- 设计规范文档

### 共享资源（需协调）
- `utils/*.js` (工具函数)
- `assets/images/` (图片资源)
- `app.json` (页面配置)

---

## ⚠️ 重要约定

### 设计规范
- **色系**: Morandi 色系（#F5C6CB, #D4B8A5, #C4B5D8, #C4D4B5, #E8D4B8）
- **字体**: 系统默认字体
- **圆角**: 统一使用 16rpx
- **阴影**: `box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.08)`
- **动画**: 使用 `transition: all 0.3s ease`

### 性能要求
- 保持 60fps 流畅度
- 避免过度使用 `setData`
- 图片使用懒加载
- 动画使用 CSS transform

### 代码规范
- 使用 ES6+ 语法
- 函数命名使用驼峰命名
- 添加必要的注释
- 保持代码整洁

---

## 📞 集成联系点

### 接口约定
所有分支完成后，分支4负责：
1. 检查色系一致性
2. 统一动画效果
3. 规范组件样式
4. 生成设计规范文档

### 冲突预防
- 不要修改其他分支负责的文件
- 共享资源修改需要在分支文档中注明
- 使用独立的 git 分支

---

## ✅ 完成标准

### 各分支完成标准
- [ ] 所有任务完成
- [ ] 页面在微信开发者工具中正常显示
- [ ] 无 console 错误
- [ ] 符合设计规范
- [ ] 代码已提交到独立分支

### 集成完成标准
- [ ] 所有页面视觉一致
- [ ] 全局样式统一
- [ ] 动画流畅（60fps）
- [ ] 无功能回归问题
- [ ] 设计规范文档完成

---

## 📋 进度追踪

| 分支 | 状态 | 开始时间 | 完成时间 | 备注 |
|------|------|---------|---------|------|
| 分支1 (Index) | ⏳ 待开始 | - | - | - |
| 分支2 (Chat) | ⏳ 待开始 | - | - | - |
| 分支3 (Knowledge) | ⏳ 待开始 | - | - | - |
| 分支4 (UI Design) | ⏳ 待开始 | - | - | 等待前3个分支 |

---

## 🔧 技术栈

- **框架**: 微信小程序原生框架
- **语言**: JavaScript (ES6+)
- **样式**: WXSS (类 CSS)
- **模板**: WXML (类 HTML)
- **工具**: 微信开发者工具

---

## 📚 参考资料

- **分支文档**:
  - [分支1: Index 页面修缮](branch-1-index.md)
  - [分支2: AI对话页面修复](branch-2-chat.md)
  - [分支3: 知识库页面优化](branch-3-knowledge.md)
  - [分支4: UI设计系统统一](branch-4-ui-design.md)
- **集成指南**: [`integration-guide.md`](integration-guide.md)
- **设计规范**: 待分支4生成 `DESIGN_SYSTEM.md`
- **微信小程序官方文档**: https://developers.weixin.qq.com/miniprogram/dev/framework/

---

**生成工具**: Claude Code - Parallel Handoff Skill v1.0
**文档版本**: v1.0
**生成时间**: 2026-05-03 13:55
