# 归档页面说明

本目录存放暂时移出的小程序页面，以便聚焦核心功能。

## 已归档的功能模块

### 1. 商城功能 (shop)
- 路径: `pages/shop/shop`
- 移出时间: 2026-05-09
- 移出原因: 非核心功能，暂时隐藏以聚焦情绪健康核心体验

### 2. 经期追踪 (period-tracker)
- 路径: `pages/period-tracker/period-tracker`
- 移出时间: 2026-05-09
- 移出原因: 扩展功能，暂时隐藏以简化用户体验

### 3. 知识库 (knowledge)
- 路径: `pages/knowledge/knowledge`
- 移出时间: 2026-05-09
- 移出原因: 内容型功能，暂时隐藏以聚焦核心交互

### 4. 心理知识 (psych-knowledge)
- 路径: `pages/psych-knowledge/psych-knowledge`
- 移出时间: 2026-05-09
- 移出原因: 内容型功能，暂时隐藏以聚焦核心交互

## 如何恢复

如需恢复某个功能：
1. 将对应文件夹从 `_archived-pages` 移回 `pages` 目录
2. 在 `app.json` 的 `pages` 数组中添加对应路径
3. 重新编译小程序

## 当前活跃页面数

移出前: 32个页面
移出后: 28个页面
精简比例: 12.5%
