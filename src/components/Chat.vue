<template>
  <div class="chat-container">
    <!-- 侧边栏 -->
    <div class="sidebar">
      <div class="quick-questions">
        <h3>快捷问题</h3>
        <div class="questions-list">
          <div 
            v-for="question in displayedQuestions" 
            :key="question.id"
            class="question-item"
            @click="sendQuickQuestion(question.content)"
          >
            {{ question.content }}
          </div>
        </div>
        <div class="refresh-container">
          <Refresh @click="refreshQuestions" />
        </div>
      </div>
      <!-- 3D文件夹组件 -->
      <div class="folder-container">
        <Folder @loadConversation="loadHistoryConversation" />
      </div>
    </div>
    
    <!-- 聊天框 -->
    <div class="chat-box">
      <div class="messages" ref="messagesContainer" @scroll="handleScroll">
        <div v-for="(message, index) in messages" :key="index" :class="['message', message.type]">
          <div v-if="message.type === 'user'" class="user-message">
            {{ message.content }}
          </div>
          <div v-else class="ai-message">
            <template v-if="message.parts && message.parts.length > 0">
              <div v-for="(part, partIndex) in message.parts" :key="partIndex" class="message-part">
                <div v-if="part.type === 'text'" v-html="md.render(part.content)"></div>
                <div v-else-if="part.type === 'echarts'" class="chart-container">
                  <div :ref="el => { if (el) initChart(el, part.content) }" style="height: 400px; width: 100%;"></div>
                </div>
              </div>
            </template>
            <div v-else v-html="md.render(message.content)"></div>
          </div>
        </div>
        <!-- AI响应时的加载动画 -->
        <div v-if="isLoading" class="loading2-container">
          <Loading2 />
        </div>
      </div>
      <div v-if="isLoading" class="loading-container">
        <Loading />
      </div>
      <div class="input-area">
        <SendMessage ref="sendMessageRef" @send="handleSendMessage" @stop="handleStopMessage" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted, onUnmounted } from 'vue'
import MarkdownIt from 'markdown-it'
import SendMessage from '../utils/SendMessage.vue'
import Loading from '../utils/Loading.vue'
import Loading2 from '../utils/Loading2.vue'
import Refresh from '../utils/Refresh.vue'
import Folder from '../utils/Folder.vue'
import { chatAPI, sseUtils } from '../utils/api.js'
import * as echarts from 'echarts'

// 快捷问题数组
const quickQuestions = ref([
  { id: 1, content: '请帮我分析销售数据趋势' },
  { id: 2, content: '生成一个饼图显示产品分类占比' },
  { id: 3, content: '创建柱状图展示月度收入' },
  { id: 4, content: '分析用户行为数据' },
  { id: 5, content: '制作折线图显示增长趋势' },
  { id: 6, content: '统计各地区销售情况' },
  { id: 7, content: '生成散点图分析相关性' },
  { id: 8, content: '创建雷达图对比多维数据' },
  { id: 9, content: '制作热力图显示数据分布' }
])

// 当前显示的问题（随机选择3个）
const displayedQuestions = ref([])

// 随机选择3个问题
const getRandomQuestions = () => {
  const shuffled = [...quickQuestions.value].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, 5)
}

// 刷新问题
const refreshQuestions = () => {
  displayedQuestions.value = getRandomQuestions()
}

// 发送快捷问题
const sendQuickQuestion = (questionContent) => {
  if (sendMessageRef.value) {
    sendMessageRef.value.sendQuickMessage(questionContent)
  }
}

// 初始化图表的方法
const initChart = (container, option) => {
  // 确保容器已经渲染到DOM中
  nextTick(() => {
    const chart = echarts.init(container)
    chart.setOption(option)
    
    // 监听窗口大小变化，自动调整图表大小
    window.addEventListener('resize', () => {
      chart.resize()
    })
  })
}

const messages = ref([])
const messagesContainer = ref(null)
const sendMessageRef = ref(null)
let currentEventSource = null

// 用户滚动控制
const isUserScrolling = ref(false)
let scrollTimeout = null
const md = new MarkdownIt({
  html: true,        // 启用HTML标签
  linkify: true,     // 自动识别链接
  typographer: true, // 启用一些语言中性的替换 + 引号美化
  breaks: true       // 转换段落里的 '\n' 到 <br>
}).enable(['table'])  // 启用表格功能

// 自定义表格渲染规则，添加滚动容器
const defaultTableRender = md.renderer.rules.table_open || function(tokens, idx, options, env, renderer) {
  return renderer.renderToken(tokens, idx, options)
}

md.renderer.rules.table_open = function(tokens, idx, options, env, renderer) {
  return '<div class="table-container">' + defaultTableRender(tokens, idx, options, env, renderer)
}

const defaultTableCloseRender = md.renderer.rules.table_close || function(tokens, idx, options, env, renderer) {
  return renderer.renderToken(tokens, idx, options)
}

md.renderer.rules.table_close = function(tokens, idx, options, env, renderer) {
  return defaultTableCloseRender(tokens, idx, options, env, renderer) + '</div>'
}
const isLoading = ref(false)
let currentConversationId = ''
let currentAiMessage = ''
let currentMessageIndex = -1

// 解析消息内容，识别echarts格式
const parseMessageContent = (content) => {
  const echartsRegex = /```echarts\s*\n([\s\S]*?)\n```/g
  const parts = []
  let lastIndex = 0
  let match

  while ((match = echartsRegex.exec(content)) !== null) {
    // 添加echarts之前的文本内容
    if (match.index > lastIndex) {
      let textContent = content.slice(lastIndex, match.index).trim()
      // 处理文件路径，添加前缀
      textContent = textContent.replace(/\[([^\]]+)\]\(\/files\/([^)]+)\)/g, '[$1](http://106.75.76.119/files/$2)')
      if (textContent) {
        parts.push({
          type: 'text',
          content: textContent
        })
      }
    }

    // 添加echarts图表
    try {
      const chartConfig = JSON.parse(match[1])
      parts.push({
        type: 'echarts',
        content: chartConfig
      })
    } catch (error) {
      console.error('解析ECharts配置失败:', error)
      parts.push({
        type: 'text',
        content: match[0] // 如果解析失败，显示原始内容
      })
    }

    lastIndex = match.index + match[0].length
  }

  // 添加剩余的文本内容
  if (lastIndex < content.length) {
    let textContent = content.slice(lastIndex).trim()
    // 处理文件路径，添加前缀
    textContent = textContent.replace(/\[([^\]]+)\]\(\/files\/([^)]+)\)/g, '[$1](http://106.75.76.119/files/$2)')
    if (textContent) {
      parts.push({
        type: 'text',
        content: textContent
      })
    }
  }

  // 如果没有找到echarts，返回纯文本
  if (parts.length === 0) {
    let processedContent = content
    // 处理文件路径，添加前缀
    processedContent = processedContent.replace(/\[([^\]]+)\]\(\/files\/([^)]+)\)/g, '[$1](http://106.75.76.119/files/$2)')
    parts.push({
      type: 'text',
      content: processedContent
    })
  }

  return parts
}

// 滚动到底部（只在用户没有主动滚动时）
const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value && !isUserScrolling.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

// 检测用户是否在底部
const isAtBottom = () => {
  if (!messagesContainer.value) return true
  const { scrollTop, scrollHeight, clientHeight } = messagesContainer.value
  return scrollTop + clientHeight >= scrollHeight - 10 // 10px的容差
}

// 处理用户滚动
const handleScroll = () => {
  if (!messagesContainer.value) return
  
  // 如果用户滚动到底部，重置用户滚动状态
  if (isAtBottom()) {
    isUserScrolling.value = false
  } else {
    // 用户主动滚动了
    isUserScrolling.value = true
  }
  
  // 清除之前的定时器
  if (scrollTimeout) {
    clearTimeout(scrollTimeout)
  }
  
  // 设置定时器，如果用户停止滚动3秒后重置状态
  scrollTimeout = setTimeout(() => {
    if (isAtBottom()) {
      isUserScrolling.value = false
    }
  }, 3000)
}

// 处理发送消息
const handleSendMessage = async (messageText) => {
  if (!messageText.trim()) return
  
  // 设置加载状态
  isLoading.value = true
  
  // 添加用户消息，前后加三个换行
  messages.value.push({
    type: 'user',
    content: messageText
  })
  
  // 添加AI消息占位符
  messages.value.push({
    type: 'ai',
    content: '',
    parts: []
  })
  
  currentMessageIndex = messages.value.length - 1
  currentAiMessage = ''
  
  scrollToBottom()
  
  try {
    // 使用API工具发送SSE请求
    const response = await chatAPI.sendMessage(messageText, currentConversationId)
    
    // 保存当前的EventSource引用
    currentEventSource = response
    
    // 处理SSE流
    await sseUtils.processStream(
      response,
      handleSSEMessage,
      handleSSEError,
      handleSSEComplete
    )
  } catch (error) {
    console.error('发送消息失败:', error)
    messages.value[currentMessageIndex].content = '发送消息失败，请重试。'
    isLoading.value = false
    // 重置发送状态
    if (sendMessageRef.value) {
      sendMessageRef.value.setSendingState(false)
    }
  }
}

// 处理停止消息
const handleStopMessage = () => {
  // 使用abortStream方法中断SSE连接
  if (currentEventSource) {
    sseUtils.abortStream(currentEventSource)
    currentEventSource = null
  }
  
  // 停止加载状态
  isLoading.value = false
  
  // 在当前AI消息后添加停止标识
  if (currentMessageIndex >= 0 && messages.value[currentMessageIndex]) {
    const currentContent = messages.value[currentMessageIndex].content || ''
    if (currentContent.trim()) {
      messages.value[currentMessageIndex].content = currentContent + '\n\n[消息已停止]'
      // 重新解析内容
      const parsedParts = parseMessageContent(messages.value[currentMessageIndex].content)
      messages.value[currentMessageIndex].parts = parsedParts
    } else {
      messages.value[currentMessageIndex].content = '[消息已停止]'
      messages.value[currentMessageIndex].parts = [{
        type: 'text',
        content: '[消息已停止]'
      }]
    }
  }
  
  console.log('消息发送已停止')
}

// 处理SSE消息
const handleSSEMessage = (data) => {
  if (data.event === 'message' && data.answer) {
    // 更新会话ID
    if (data.conversation_id) {
      currentConversationId = data.conversation_id
    }
    
    // 累积AI回答内容
    currentAiMessage += data.answer
    
    // 解析消息内容，识别echarts和普通文本
    const parsedParts = parseMessageContent(currentAiMessage)
    
    // 更新消息的parts和content
    messages.value[currentMessageIndex].parts = parsedParts
    messages.value[currentMessageIndex].content = currentAiMessage
    
    scrollToBottom()
  }
}



// 处理SSE完成
const handleSSEComplete = () => {
  console.log('SSE流处理完成')
  isLoading.value = false
  currentEventSource = null
  // 重置发送状态
  if (sendMessageRef.value) {
    sendMessageRef.value.setSendingState(false)
  }
}

// 处理SSE错误时也要重置状态
const handleSSEError = (error) => {
  console.error('SSE流处理错误:', error)
  messages.value[currentMessageIndex].content = '接收消息时发生错误，请重试。'
  isLoading.value = false
  currentEventSource = null
  // 重置发送状态
  if (sendMessageRef.value) {
    sendMessageRef.value.setSendingState(false)
  }
}

// 加载历史对话
const loadHistoryConversation = async (historyMessages) => {
  // 清空当前消息
  messages.value = []
  
  // 异步逐条加载历史消息，模拟实时对话的渲染方式
  for (let i = 0; i < historyMessages.length; i++) {
    const message = historyMessages[i]
    
    if (message.type === 'ai') {
      // AI消息需要解析内容，识别echarts和普通文本
      const parsedParts = parseMessageContent(message.content)
      messages.value.push({
        ...message,
        parts: parsedParts
      })
    } else {
      // 用户消息直接添加
      messages.value.push(message)
    }
    
    // 添加小延迟，让DOM有时间更新和渲染echarts
    await new Promise(resolve => setTimeout(resolve, 50))
    
    // 滚动到底部
    scrollToBottom()
  }
  
  console.log('已加载历史对话:', historyMessages.length, '条消息')
}

onMounted(() => {
  scrollToBottom()
  // 初始化显示的快捷问题
  displayedQuestions.value = getRandomQuestions()
})

onUnmounted(() => {
  // 清理定时器
  if (scrollTimeout) {
    clearTimeout(scrollTimeout)
  }
})
</script>

<style scoped>
/* 聊天容器 - 占满整个视口，白色背景，水平布局 */
.chat-container {
  width: 100%; /* 占满整个宽度 */
  height: 100vh; /* 占满整个视口高度 */
  background-color: white; /* 白色背景 */
  display: flex; /* 弹性布局 */
  box-sizing: border-box; /* 边框盒模型 */
}

/* 侧边栏 - 占容器宽度的30%，包含快捷问题和3D文件夹 */
.sidebar {
  width: 30%; /* 占容器宽度的30% */
  height: 100%; /* 占满容器高度 */
  border-right: 1px solid #e0e0e0; /* 右边框分隔线 */
  padding: 20px; /* 内边距20px */
  box-sizing: border-box; /* 边框盒模型，包含padding和border */
  background-color: #f9f9f9; /* 浅灰色背景 */
  display: flex; /* 弹性布局 */
  flex-direction: column; /* 垂直方向排列子元素 */
}

/* 可拖动分割线 - 用于调整侧边栏和聊天区域的宽度比例 */
.resizer {
  width: 4px; /* 分割线宽度4px */
  height: 100%; /* 占满容器高度 */
  background-color: #e0e0e0; /* 默认分割线颜色（浅灰色） */
  cursor: col-resize; /* 显示列调整大小光标 */
  transition: background-color 0.2s ease; /* 背景色变化的平滑过渡效果 */
}

/* 分割线悬停状态 */
.resizer:hover {
  background-color: #2d8cf0; /* 悬停时变为蓝色，提示可交互 */
}

/* 快捷问题容器 - 侧边栏上部分，显示预设问题 */
.quick-questions {
  flex: 0 0 auto; /* 不伸缩，保持固定大小 */
  display: flex; /* 弹性布局 */
  flex-direction: column; /* 垂直排列 */
}

/* 快捷问题标题样式 */
.quick-questions h3 {
  margin: 0 0 20px 0; /* 下边距20px，其他边距为0 */
  color: #333; /* 深灰色文字 */
  font-size: 16px; /* 字体大小16px */
  font-weight: 600; /* 字体粗细为600（半粗体） */
}

/* 问题列表容器 */
.questions-list {
  flex: 1; /* 占据剩余空间 */
  display: flex; /* 弹性布局 */
  flex-direction: column; /* 垂直排列问题项 */
  gap: 10px; /* 问题项之间的间距10px */
}

/* 单个问题项样式 */
.question-item {
  padding: 12px 16px; /* 内边距：上下12px，左右16px */
  background-color: white; /* 白色背景 */
  border: 1px solid #e0e0e0; /* 浅灰色边框 */
  border-radius: 8px; /* 圆角8px */
  cursor: pointer; /* 鼠标指针，表示可点击 */
  transition: all 0.3s ease; /* 所有属性变化的平滑过渡 */
  font-size: 14px; /* 字体大小14px */
  line-height: 1.4; /* 行高1.4倍，提高可读性 */
}

/* 问题项悬停效果 */
.question-item:hover {
  background-color: #f0f8ff; /* 悬停时背景变为淡蓝色 */
  border-color: #2d8cf0; /* 边框变为蓝色 */
  transform: translateY(-2px); /* 向上移动2px，产生浮起效果 */
  box-shadow: 0 2px 8px rgba(45, 140, 240, 0.2); /* 添加蓝色阴影 */
}

/* 刷新按钮容器 - 用于放置刷新快捷问题的按钮 */
.refresh-container {
  margin-top: 15px; /* 上边距15px */
  display: flex; /* 弹性布局 */
  justify-content: center; /* 水平居中对齐 */
}

/* 聊天框 - 占据剩余空间，垂直布局，包含消息列表和输入区域 */
.chat-box {
  flex: 1; /* 占据剩余空间（侧边栏外的所有空间） */
  height: 100%; /* 占满容器高度 */
  display: flex; /* 弹性布局 */
  flex-direction: column; /* 垂直方向排列（消息区域在上，输入区域在下） */
  overflow: hidden; /* 隐藏溢出内容，防止整体滚动 */
}

/* 消息列表容器 - 可滚动，垂直排列，显示所有聊天消息 */
.messages {
  flex: 1; /* 占据剩余空间（输入区域外的所有空间） */
  overflow-y: auto; /* 垂直滚动，当消息过多时可滚动查看 */
  padding: 20px; /* 内边距20px，为消息提供呼吸空间 */
  display: flex; /* 弹性布局 */
  flex-direction: column; /* 垂直方向排列消息 */
  gap: 15px; /* 消息之间的间距15px */
}

/* 消息基础样式 - 自动换行，防止长文本溢出 */
.message {
  max-width: 100%; /* 最大宽度100%，不超出容器 */
  word-wrap: break-word; /* 长单词自动换行 */
  word-break: break-word; /* 在单词内部断行，处理超长单词 */
}

/* 用户消息样式 - 灰色背景，靠右对齐，模拟聊天气泡 */
.user-message {
  background-color: #f0f0f0; /* 浅灰色背景，区别于AI消息 */
  padding: 12px 16px; /* 内边距：上下12px，左右16px */
  border-radius: 10px; /* 圆角10px，营造气泡效果 */
  margin-left: auto; /* 左边距自动，实现右对齐 */
  margin-right: 0; /* 右边距为0，确保紧贴右边 */
  margin-top: 40px; /* 上边距40px，增加与上方消息的间隔 */
  margin-bottom: 40px; /* 下边距40px，增加与下方消息的间隔 */
  max-width: 80%; /* 最大宽度80%，避免过长消息占满整行 */
  min-width: fit-content; /* 最小宽度适应内容，短消息不会过宽 */
  width: fit-content; /* 宽度适应内容，实现紧凑布局 */
  color: #333; /* 深灰色文字，保证可读性 */
  display: block; /* 块级元素，更好的右对齐效果 */
  text-align: left; /* 文本左对齐，即使整体右对齐 */
}

/* AI消息样式 - 无背景，靠左对齐，支持富文本内容 */
.ai-message {
  color: #333; /* 深灰色文字，保证可读性 */
  line-height: 1.6; /* 行高1.6倍，提高长文本可读性 */
  max-width: 100%; /* 最大宽度100%，充分利用空间 */
  text-align: left; /* 文本左对齐 */
  margin-right: auto; /* 右边距自动，确保左对齐 */
}

/* AI消息中的段落样式 */
.ai-message :deep(p) {
  margin: 0 0 10px 0; /* 段落下边距10px */
  text-align: left; /* 段落文本左对齐 */
}

/* AI消息中的代码块样式 */
.ai-message :deep(pre) {
  background-color: #f5f5f5; /* 浅灰色背景 */
  padding: 10px; /* 内边距 */
  border-radius: 5px; /* 圆角 */
  overflow-x: auto; /* 水平滚动 */
  margin: 10px 0; /* 上下边距 */
  text-align: left; /* 代码左对齐 */
}

/* AI消息中的行内代码样式 */
.ai-message :deep(code) {
  background-color: #f5f5f5; /* 浅灰色背景 */
  padding: 2px 4px; /* 内边距 */
  border-radius: 3px; /* 圆角 */
  font-family: 'Courier New', monospace; /* 等宽字体 */
}

/* AI消息中的列表样式 */
.ai-message :deep(ul), .ai-message :deep(ol) {
  margin: 10px 0; /* 上下边距 */
  padding-left: 20px; /* 左内边距，用于缩进 */
  text-align: left; /* 列表左对齐 */
}

/* AI消息中的引用块样式 */
.ai-message :deep(blockquote) {
  border-left: 4px solid #ddd; /* 左边框 */
  margin: 10px 0; /* 上下边距 */
  padding-left: 15px; /* 左内边距 */
  color: #666; /* 灰色文字 */
  text-align: left; /* 引用左对齐 */
}

/* AI消息中的标题样式 */
.ai-message :deep(h1), .ai-message :deep(h2), .ai-message :deep(h3), 
.ai-message :deep(h4), .ai-message :deep(h5), .ai-message :deep(h6) {
  text-align: left; /* 标题左对齐 */
  margin: 15px 0 10px 0; /* 标题边距 */
}

/* 输入区域样式 - 底部固定，浅色背景 */
.input-area {
  padding: 20px; /* 内边距 */
  border-top: 1px solid #e0e0e0; /* 顶部边框 */
  background-color: #fafafa; /* 浅灰色背景 */
}

/* Loading组件容器 - 不占用空间的浮动显示 */
.loading-container {
  position: relative; /* 相对定位作为Loading组件的定位参考 */
  height: 0; /* 不占用高度 */
  width: 100%; /* 占满宽度以提供定位参考 */
  pointer-events: none; /* 不阻挡鼠标事件 */
}

/* 消息部分容器 */
.message-part {
  margin-bottom: 10px; /* 部分间距 */
}

/* 图表容器样式 */
.chart-container {
  margin: 15px 0; /* 上下边距 */
  padding: 10px; /* 内边距 */
  border: 1px solid #e0e0e0; /* 边框 */
  border-radius: 8px; /* 圆角 */
  background-color: #fafafa; /* 浅色背景 */
}

/* 滚动条整体样式 */
.messages::-webkit-scrollbar {
  width: 20px; /* 滚动条宽度 */
}

/* 滚动条轨道样式 */
.messages::-webkit-scrollbar-track {
  background: #f1f1f1; /* 轨道背景色 */
  border-radius: 3px; /* 轨道圆角 */
}

/* 滚动条滑块样式 */
.messages::-webkit-scrollbar-thumb {
  background: #c1c1c1; /* 滑块背景色 */
  border-radius: 3px; /* 滑块圆角 */
}

/* 滚动条滑块悬停样式 */
.messages::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8; /* 悬停时的滑块颜色 */
}

/* Markdown表格样式 */
.ai-message :deep(table) {
  border-collapse: collapse;
  width: 100%;
  margin: 15px 0;
  font-size: 14px;
  text-align: left;
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.ai-message :deep(th),
.ai-message :deep(td) {
  border: 1px solid #e0e0e0;
  padding: 12px 15px;
  text-align: left;
}

.ai-message :deep(th) {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #333;
}

.ai-message :deep(tr:nth-child(even)) {
  background-color: #f8f9fa;
}

.ai-message :deep(tr:hover) {
  background-color: #e8f4f8;
}

/* 表格容器 - 支持横向滚动 */
.ai-message :deep(.table-container) {
  overflow-x: auto;
  margin: 15px 0;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 代码块样式 */
.ai-message :deep(pre) {
  background-color: #f6f8fa;
  border: 1px solid #e1e4e8;
  border-radius: 6px;
  padding: 16px;
  overflow-x: auto;
  margin: 15px 0;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.45;
}

.ai-message :deep(code) {
  background-color: #f6f8fa;
  border-radius: 3px;
  padding: 2px 4px;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 13px;
}

.ai-message :deep(pre code) {
  background-color: transparent;
  padding: 0;
}

/* 强调文本样式 */
.ai-message :deep(strong) {
  font-weight: 600;
  color: #333;
}

.ai-message :deep(em) {
  font-style: italic;
  color: #555;
}

/* 分割线样式 */
.ai-message :deep(hr) {
  border: none;
  border-top: 2px solid #e1e4e8;
  margin: 20px 0;
}

/* 链接样式 */
.ai-message :deep(a) {
  color: #0366d6;
  text-decoration: none;
}

.ai-message :deep(a:hover) {
  text-decoration: underline;
}

/* 标题样式增强 */
.ai-message :deep(h1) {
  font-size: 24px;
  font-weight: 600;
  border-bottom: 2px solid #e1e4e8;
  padding-bottom: 8px;
}

.ai-message :deep(h2) {
  font-size: 20px;
  font-weight: 600;
  border-bottom: 1px solid #e1e4e8;
  padding-bottom: 6px;
}

.ai-message :deep(h3) {
  font-size: 18px;
  font-weight: 600;
}

.ai-message :deep(h4) {
  font-size: 16px;
  font-weight: 600;
}

.ai-message :deep(h5) {
  font-size: 14px;
  font-weight: 600;
}

.ai-message :deep(h6) {
  font-size: 13px;
  font-weight: 600;
  color: #666;
}

/* Loading2组件容器样式 */
.loading2-container {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 10px 0;
  margin-left: 0;
}

/* Folder组件容器样式 */
.folder-container {
  margin-top: auto;
  padding: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 180px;
}
</style>