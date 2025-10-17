# Chat BI 应用使用说明

## 项目概述

这是一个基于 Vue 3 的聊天应用，支持与 AI 进行实时对话，使用 SSE（Server-Sent Events）流式接收消息，并支持 Markdown 渲染。

## 核心功能

1. **实时聊天**: 支持与 AI 进行实时对话
2. **流式响应**: 使用 SSE 技术实现流式接收 AI 回复
3. **Markdown 渲染**: AI 回复支持 Markdown 格式渲染
4. **响应式设计**: 聊天框占屏幕三分之二宽度，靠右对齐
5. **消息样式**: 用户消息有灰色背景框，AI 消息无背景框

## 项目结构

```
src/
├── components/
│   └── Chat.vue          # 主聊天组件
├── utils/
│   ├── SendMessage.vue   # 消息发送组件
│   └── api.js           # API 工具类
├── App.vue              # 根组件
└── main.js              # 入口文件
```

## API 工具类使用说明

### 1. 基础配置

在 `src/utils/api.js` 中配置了基础的 API 设置：

```javascript
const API_BASE_URL = 'http://106.75.76.119'
const API_TOKEN = 'Bearer app-upQgqetiw4q7jlW75v5KaZvT'
```

### 2. 聊天 API

#### 发送消息

```javascript
import { chatAPI } from '../utils/api.js'

// 发送聊天消息
const response = await chatAPI.sendMessage(
  query,           // 消息内容
  conversationId,  // 会话ID（可选）
  userId,          // 用户ID（默认：'test2'）
  files           // 文件列表（默认：[]）
)
```

#### 停止消息生成

```javascript
// 停止正在生成的消息
await chatAPI.stopMessage(taskId)
```

### 3. SSE 流处理

```javascript
import { sseUtils } from '../utils/api.js'

// 处理 SSE 数据流
await sseUtils.processStream(
  response,        // fetch 响应对象
  onMessage,       // 消息处理函数
  onError,         // 错误处理函数
  onComplete       // 完成处理函数
)
```

### 4. 通用 HTTP 请求

```javascript
import { httpRequest } from '../utils/api.js'

// GET 请求
const response = await httpRequest.get('/api/endpoint')

// POST 请求
const response = await httpRequest.post('/api/endpoint', data)

// PUT 请求
const response = await httpRequest.put('/api/endpoint', data)

// DELETE 请求
const response = await httpRequest.delete('/api/endpoint')

// PATCH 请求
const response = await httpRequest.patch('/api/endpoint', data)
```

## 如何添加新的 HTTP 请求

### 方法一：使用现有的通用请求方法

```javascript
import { httpRequest } from '../utils/api.js'

// 在组件中使用
const fetchUserData = async (userId) => {
  try {
    const response = await httpRequest.get(`/api/users/${userId}`)
    return response.data
  } catch (error) {
    console.error('获取用户数据失败:', error)
    throw error
  }
}
```

### 方法二：在 API 工具类中添加新的专用方法

在 `src/utils/api.js` 中添加新的 API 方法：

```javascript
// 用户管理 API
export const userAPI = {
  // 获取用户信息
  getUserInfo: async (userId) => {
    return await apiClient.get(`/api/users/${userId}`)
  },
  
  // 更新用户信息
  updateUserInfo: async (userId, userData) => {
    return await apiClient.put(`/api/users/${userId}`, userData)
  },
  
  // 删除用户
  deleteUser: async (userId) => {
    return await apiClient.delete(`/api/users/${userId}`)
  }
}
```

然后在组件中使用：

```javascript
import { userAPI } from '../utils/api.js'

const handleUpdateUser = async (userId, userData) => {
  try {
    const response = await userAPI.updateUserInfo(userId, userData)
    console.log('用户更新成功:', response.data)
  } catch (error) {
    console.error('用户更新失败:', error)
  }
}
```

## 如何接收和处理响应

### 1. 普通 HTTP 响应

```javascript
try {
  const response = await httpRequest.get('/api/data')
  
  // 处理成功响应
  console.log('状态码:', response.status)
  console.log('响应数据:', response.data)
  console.log('响应头:', response.headers)
  
} catch (error) {
  // 处理错误响应
  if (error.response) {
    // 服务器返回了错误状态码
    console.error('错误状态码:', error.response.status)
    console.error('错误数据:', error.response.data)
  } else if (error.request) {
    // 请求已发送但没有收到响应
    console.error('网络错误:', error.request)
  } else {
    // 其他错误
    console.error('请求配置错误:', error.message)
  }
}
```

### 2. SSE 流式响应

```javascript
const handleSSEMessage = (data) => {
  // 处理每个 SSE 消息
  console.log('收到 SSE 消息:', data)
  
  if (data.event === 'message') {
    // 处理消息事件
    console.log('消息内容:', data.answer)
  } else if (data.event === 'error') {
    // 处理错误事件
    console.error('SSE 错误:', data.message)
  }
}

const handleSSEError = (error) => {
  console.error('SSE 连接错误:', error)
}

const handleSSEComplete = () => {
  console.log('SSE 连接完成')
}
```

## 如何提取和处理数据

### 1. 提取响应数据

```javascript
const response = await httpRequest.get('/api/data')

// 提取完整响应数据
const fullData = response.data

// 提取特定字段
const { id, name, email } = response.data

// 提取数组数据
const items = response.data.items || []

// 提取分页信息
const { total, page, pageSize } = response.data.pagination || {}
```

### 2. 处理 SSE 数据

```javascript
const handleSSEMessage = (data) => {
  // 提取事件类型
  const eventType = data.event
  
  // 根据事件类型处理数据
  switch (eventType) {
    case 'message':
      // 提取消息内容
      const messageContent = data.answer
      const messageId = data.message_id
      const conversationId = data.conversation_id
      const timestamp = data.created_at
      
      // 处理消息数据
      processMessage(messageContent, messageId, conversationId, timestamp)
      break
      
    case 'error':
      // 提取错误信息
      const errorMessage = data.message
      const errorCode = data.code
      
      // 处理错误数据
      handleError(errorMessage, errorCode)
      break
      
    default:
      console.log('未知事件类型:', eventType, data)
  }
}
```

### 3. 数据验证和转换

```javascript
// 数据验证函数
const validateUserData = (userData) => {
  if (!userData.id || !userData.name) {
    throw new Error('用户数据不完整')
  }
  return true
}

// 数据转换函数
const transformUserData = (rawData) => {
  return {
    id: rawData.user_id,
    name: rawData.user_name,
    email: rawData.user_email,
    createdAt: new Date(rawData.created_at * 1000), // 时间戳转换
    isActive: rawData.status === 'active'
  }
}

// 使用示例
try {
  const response = await httpRequest.get('/api/users/123')
  const rawUserData = response.data
  
  // 验证数据
  validateUserData(rawUserData)
  
  // 转换数据
  const userData = transformUserData(rawUserData)
  
  console.log('处理后的用户数据:', userData)
} catch (error) {
  console.error('数据处理失败:', error)
}
```

## 错误处理最佳实践

1. **统一错误处理**: 在 API 工具类中配置了请求和响应拦截器
2. **错误分类**: 区分网络错误、服务器错误和业务逻辑错误
3. **用户友好提示**: 为不同类型的错误提供合适的用户提示
4. **错误日志**: 记录详细的错误信息用于调试

## 性能优化建议

1. **请求缓存**: 对于不经常变化的数据，可以添加缓存机制
2. **请求去重**: 避免重复发送相同的请求
3. **超时设置**: 为请求设置合理的超时时间（当前设置为 30 秒）
4. **错误重试**: 对于网络错误，可以实现自动重试机制

## 开发和调试

1. **控制台日志**: API 工具类会自动记录请求和响应日志
2. **网络面板**: 使用浏览器开发者工具的网络面板查看请求详情
3. **Vue DevTools**: 使用 Vue 开发者工具调试组件状态

## 部署注意事项

1. **环境变量**: 在生产环境中使用环境变量管理 API 地址和密钥
2. **CORS 配置**: 确保服务器正确配置了 CORS 策略
3. **HTTPS**: 在生产环境中使用 HTTPS 协议
4. **错误监控**: 集成错误监控服务，及时发现和处理问题