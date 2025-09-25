import axios from 'axios'

// API基础配置
const API_BASE_URL = 'http://106.75.76.119'
/* const API_TOKEN = 'Bearer app-upQgqetiw4q7jlW75v5KaZvT' */
const API_TOKEN = 'Bearer app-HCDo84avfUjmuc1mtsUeEclx'

// 创建axios实例
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': API_TOKEN
  },
  timeout: 30000 // 30秒超时
})

// 请求拦截器
apiClient.interceptors.request.use(
  (config) => {
    console.log('发送请求:', config.method?.toUpperCase(), config.url, config.data)
    return config
  },
  (error) => {
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
apiClient.interceptors.response.use(
  (response) => {
    console.log('收到响应:', response.status, response.data)
    return response
  },
  (error) => {
    console.error('响应错误:', error.response?.status, error.response?.data || error.message)
    return Promise.reject(error)
  }
)

// 聊天消息API
export const chatAPI = {
  // 发送聊天消息（SSE流式）
  sendMessage: async (query, conversationId = '', userId = '123456', files = []) => {
    const requestBody = {
      inputs: {},
      query: query,
      response_mode: "streaming",
      conversation_id: conversationId,
      user: userId,
      files: files
    }

    // 创建AbortController用于中断请求
    const abortController = new AbortController()

    // 使用fetch发送SSE请求
    const response = await fetch(`${API_BASE_URL}/v1/chat-messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': API_TOKEN,
        'Accept': 'text/event-stream'
      },
      body: JSON.stringify(requestBody),
      signal: abortController.signal
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    // 将abortController附加到response对象上
    response.abortController = abortController
    return response
  },

  // 停止消息生成
  stopMessage: async (taskId) => {
    return await apiClient.post(`/v1/chat-messages/${taskId}/stop`)
  }
}

// 历史消息API
export const historyAPI = {
  // 获取历史对话列表
  getConversations: async (userId = '123456', limit = 50) => {
    const response = await apiClient.get(`/v1/conversations`, {
      params: {
        user: userId,
        limit: limit
      }
    })
    return response.data
  },

  // 获取对话详情
  getMessages: async (conversationId, userId = '123456') => {
    const response = await apiClient.get(`/v1/messages`, {
      params: {
        user: userId,
        conversation_id: conversationId
      }
    })
    return response.data
  }
}

// 通用HTTP请求方法
export const httpRequest = {
  get: (url, config = {}) => apiClient.get(url, config),
  post: (url, data = {}, config = {}) => apiClient.post(url, data, config),
  put: (url, data = {}, config = {}) => apiClient.put(url, data, config),
  delete: (url, config = {}) => apiClient.delete(url, config),
  patch: (url, data = {}, config = {}) => apiClient.patch(url, data, config)
}

// SSE处理工具
export const sseUtils = {
  // 处理SSE数据流
  processStream: async (response, onMessage, onError, onComplete) => {
    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let buffer = '' // 用于累积不完整的数据
    
    try {
      while (true) {
        const { done, value } = await reader.read()
        
        if (done) {
          // 处理缓冲区中剩余的数据
          if (buffer.trim()) {
            processBufferedData(buffer, onMessage)
          }
          onComplete && onComplete()
          break
        }
        
        const chunk = decoder.decode(value, { stream: true })
        buffer += chunk
        
        // 按行分割，但保留最后一行（可能不完整）
        const lines = buffer.split('\n')
        buffer = lines.pop() || '' // 保留最后一行作为缓冲
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const jsonStr = line.substring(6).trim()
            if (jsonStr) {
              try {
                const data = JSON.parse(jsonStr)
                onMessage && onMessage(data)
              } catch (error) {
                console.error('解析SSE数据失败:', error, 'JSON字符串:', jsonStr)
              }
            }
          }
        }
      }
    } catch (error) {
      // 检查是否是用户主动中断
      if (error.name === 'AbortError') {
        console.log('SSE连接已被用户中断')
        onComplete && onComplete()
      } else {
        onError && onError(error)
      }
    }
    
    // 处理缓冲区数据的辅助函数
    function processBufferedData(buffer, onMessage) {
      const lines = buffer.split('\n')
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const jsonStr = line.substring(6).trim()
          if (jsonStr) {
            try {
              const data = JSON.parse(jsonStr)
              onMessage && onMessage(data)
            } catch (error) {
              console.error('解析缓冲区SSE数据失败:', error, 'JSON字符串:', jsonStr)
            }
          }
        }
      }
    }
  },
  
  // 中断SSE连接
  abortStream: (response) => {
    if (response && response.abortController) {
      response.abortController.abort()
    }
  }
}

export default apiClient