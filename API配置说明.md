# 知愈小程序 - API 配置说明

## 🔧 DeepSeek API 配置步骤

### 1. 微信小程序后台配置

为了让小程序能够调用 DeepSeek API，需要在微信小程序后台配置合法域名：

#### 步骤：
1. 登录 [微信公众平台](https://mp.weixin.qq.com/)
2. 进入「开发」→「开发管理」→「开发设置」
3. 找到「服务器域名」部分
4. 在「request 合法域名」中添加：
   ```
   https://api.deepseek.com
   ```
5. 点击「保存并提交」

**注意**：
- 每月只能修改 5 次服务器域名
- 域名必须是 HTTPS 协议
- 配置后需要等待几分钟生效

### 2. 开发工具临时配置（仅用于开发测试）

如果暂时无法配置服务器域名，可以在开发工具中临时跳过域名校验：

1. 打开微信开发者工具
2. 点击右上角「详情」
3. 勾选「不校验合法域名、web-view（业务域名）、TLS 版本以及 HTTPS 证书」

**警告**：此方法仅用于开发测试，正式发布前必须配置合法域名！

---

## 📝 API Key 说明

### 当前配置
- **API Key**：已内置在 `utils/ai.js` 中
- **模型**：deepseek-chat
- **所有用户共享**：无需单独配置

### API Key 位置
文件：`utils/ai.js`
```javascript
const API_CONFIG = {
  baseURL: 'https://api.deepseek.com/v1/chat/completions',
  apiKey: 'sk-bf6217ebd6a542f5869c327abfc60348',
  model: 'deepseek-chat',
  timeout: 30000,
  maxTokens: 1000,
  temperature: 0.7
};
```

---

## 🐛 常见问题排查

### 问题 1：AI 无法回复
**可能原因**：
1. 未配置合法域名
2. API Key 无效或额度用完
3. 网络连接问题

**解决方法**：
1. 检查微信小程序后台是否已配置 `https://api.deepseek.com`
2. 在开发工具控制台查看错误信息
3. 检查 API Key 是否有效

### 问题 2：开发工具中可以调用，真机无法调用
**原因**：开发工具跳过了域名校验，但真机需要配置合法域名

**解决方法**：必须在微信小程序后台配置合法域名

### 问题 3：提示"request:fail url not in domain list"
**原因**：未配置合法域名

**解决方法**：按照上述步骤 1 配置服务器域名

---

## 🔍 调试方法

### 查看 API 调用日志
在微信开发者工具的控制台中，可以看到：
- API 请求详情
- 返回的错误信息
- 网络请求状态

### 测试 API 是否正常
1. 选择情绪后点击"开始 AI 引导"
2. 观察是否显示"AI 正在思考"动画
3. 查看控制台是否有错误信息
4. 如果 API 失败，会自动降级到本地模式并提示"AI 暂时无法回复"

---

## ✅ 配置检查清单

- [ ] 微信小程序后台已添加 `https://api.deepseek.com` 到 request 合法域名
- [ ] API Key 已正确配置在 `utils/ai.js` 中
- [ ] 开发工具中可以正常调用 API
- [ ] 真机预览时可以正常调用 API
- [ ] 错误时能正常降级到本地模式

---

## 📞 技术支持

如果配置后仍然无法使用，请检查：
1. DeepSeek API 官网：https://platform.deepseek.com/
2. 微信小程序开发文档：https://developers.weixin.qq.com/miniprogram/dev/
3. 查看控制台的详细错误信息
