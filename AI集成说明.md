# 知愈小程序 - DeepSeek AI 集成说明

## 📋 功能概述

知愈小程序已成功集成 DeepSeek AI，为用户提供智能情绪陪伴对话功能。

## 🎯 核心功能

### 1. AI 智能对话
- **个性化引导**：根据用户选择的情绪，AI 提供针对性的引导问题
- **用户画像定制**：基于用户的性别、职业、困扰和目标，定制对话风格
- **温暖共情**：AI 使用温暖、不评判的语言，帮助用户探索情绪
- **简短回复**：每次回复控制在 50 字以内，避免说教

### 2. 双模式运行
- **AI 模式**：配置 API Key 后，使用 DeepSeek AI 进行智能对话
- **本地模式**：未配置 API Key 时，使用本地预设回复（备用方案）

### 3. API Key 管理
- **安全存储**：API Key 仅保存在用户设备本地，不上传服务器
- **可见性切换**：支持显示/隐藏 API Key
- **连接测试**：保存前可测试 API 连接是否正常

## 🚀 使用步骤

### 步骤 1：获取 DeepSeek API Key

1. 访问 DeepSeek 官网：https://platform.deepseek.com
2. 注册并登录账号
3. 进入控制台，创建新的 API Key
4. 复制生成的 API Key（格式：sk-xxxxxxxx）

### 步骤 2：配置 API Key

1. 打开知愈小程序
2. 进入主页（情绪记录页面）
3. 点击右上角的 ⚙️ 设置按钮
4. 在 "DeepSeek API Key" 输入框中粘贴您的 API Key
5. 点击 "测试连接" 验证 API Key 是否有效
6. 点击 "保存配置" 完成设置

### 步骤 3：开始使用

1. 返回主页
2. 选择您当前的情绪（可多选）
3. AI 会自动根据您的情绪提供引导问题
4. 在对话框中输入您的感受
5. AI 会基于您的用户画像和对话历史，提供个性化回复

## 📁 文件结构

```
知愈 微信小程序/
├── utils/
│   └── ai.js                    # AI 工具函数（API 调用、提示词生成）
├── pages/
│   ├── main/                    # 主页（情绪记录 + AI 对话）
│   │   ├── main.wxml
│   │   ├── main.wxss
│   │   ├── main.js             # 集成 AI 对话逻辑
│   │   └── main.json
│   └── settings/                # AI 设置页面
│       ├── settings.wxml
│       ├── settings.wxss
│       ├── settings.js
│       └── settings.json
└── app.json                     # 应用配置
```

## 🔧 技术实现

### AI 工具函数 (utils/ai.js)

**核心功能：**
- `callDeepSeekAPI(messages, userProfile)` - 调用 DeepSeek API
- `generateSystemPrompt(userProfile)` - 根据用户画像生成系统提示词
- `generateLocalPrompt(emotions, bodyFeelings)` - 生成本地引导问题（备用）
- `setAPIKey(apiKey)` - 保存 API Key 到本地存储
- `loadAPIKey()` - 从本地存储加载 API Key

**系统提示词设计：**
```
你是知愈的情绪陪伴助手，一个温暖、专业的情绪表达教练。

任务：
1. 帮助用户识别和命名情绪
2. 引导用户探索情绪背后的需求
3. 提供情绪表达的建议和方法
4. 保持温暖、共情、不评判的态度

对话原则：
- 使用简短、温暖的语言（每次回复控制在50字以内）
- 多用开放式问题引导用户表达
- 避免说教和建议，多倾听和确认
- 关注用户的感受，而不是事件本身
- 帮助用户将模糊的感受具象化
```

### 主页集成 (pages/main/main.js)

**新增功能：**
- 加载用户画像数据
- 检查 API Key 配置状态
- AI 对话时显示"思考中"动画
- API 调用失败时自动降级到本地模式
- 跳转到设置页面

**关键代码：**
```javascript
// 获取 AI 回复
getAIResponse: function() {
  if (this.data.useAI) {
    this.setData({ isAIThinking: true });

    aiUtils.callDeepSeekAPI(this.data.messages, this.data.userProfile)
      .then(reply => {
        // 添加 AI 回复到对话
      })
      .catch(err => {
        // 降级到本地模式
        this.simulateAIResponse();
      });
  } else {
    // 使用本地模拟回复
    this.simulateAIResponse();
  }
}
```

### 设置页面 (pages/settings/)

**功能：**
- API Key 输入和保存
- 显示/隐藏 API Key
- 测试 API 连接
- 使用说明和功能介绍

## 💡 使用建议

### 1. API Key 安全
- 不要将 API Key 分享给他人
- 定期更换 API Key
- 如果 API Key 泄露，立即在 DeepSeek 控制台删除

### 2. 成本控制
- DeepSeek API 按使用量计费
- 建议设置每月使用额度上限
- 在 DeepSeek 控制台查看使用情况

### 3. 对话质量
- 完善用户画像信息（在引导页填写）
- 详细描述您的感受，AI 会提供更精准的回复
- 如果 AI 回复不理想，可以继续追问

## 🐛 常见问题

### Q1: API Key 保存后无法使用？
**A:**
1. 检查 API Key 格式是否正确（应以 sk- 开头）
2. 点击"测试连接"验证 API Key 是否有效
3. 确认 DeepSeek 账户余额充足

### Q2: AI 回复速度慢？
**A:**
- DeepSeek API 响应时间通常在 1-3 秒
- 网络状况会影响响应速度
- 如果超时，会自动降级到本地模式

### Q3: 如何关闭 AI 功能？
**A:**
- 进入设置页面
- 清空 API Key 输入框
- 点击保存
- 系统会自动切换到本地模式

### Q4: 本地模式和 AI 模式有什么区别？
**A:**
- **本地模式**：使用预设的引导问题，回复较为固定
- **AI 模式**：根据对话上下文和用户画像，提供个性化回复

## 📊 数据隐私

- ✅ API Key 仅保存在用户设备本地
- ✅ 对话内容通过 HTTPS 加密传输到 DeepSeek
- ✅ 用户画像数据仅用于生成系统提示词
- ✅ 所有情绪记录仅保存在本地，不上传服务器

## 🔄 后续优化方向

1. **流式输出**：支持 AI 回复逐字显示，提升体验
2. **对话历史**：保存完整对话记录，支持回顾
3. **情绪分析**：AI 自动分析用户情绪趋势
4. **多模型支持**：支持切换不同的 AI 模型
5. **语音输入**：支持语音转文字，方便表达

## 📞 技术支持

如有问题，请联系：
- 邮箱：yinji_aito@yeah.net
- 微信小程序：知愈 FeelingMosaic

---

**版本：** v1.0.0
**更新日期：** 2025年1月
