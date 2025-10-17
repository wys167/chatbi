<style scoped>
  /* 消息输入框容器 - 包含输入框和发送按钮的主容器 */
  .messageBox {
    width: 80%; /* 宽度占父容器的80% */
    min-height: 60px; /* 最小高度60px */
    max-height: 120px; /* 最大高度120px，约3行文本 */
    display: flex; /* 弹性布局 */
    align-items: flex-end; /* 内容对齐到底部 */
    justify-content: center; /* 水平居中 */
    background-color: #2d2d2d; /* 深灰色背景 */
    padding: 10px 15px; /* 内边距：上下10px，左右15px */
    border-radius: 10px; /* 圆角10px */
    border: 1px solid rgb(63, 63, 63); /* 深灰色边框 */
    resize: none; /* 禁止调整大小 */
    margin: 0 auto; /* 水平居中 */
  }
  /* 消息框获得焦点时的样式 - 边框高亮 */
  .messageBox:focus-within {
    border: 1px solid rgb(110, 110, 110); /* 焦点时浅灰色边框 */
  }
  /* 文件上传包装器 - 包含文件上传图标的容器（当前已注释） */
  .fileUploadWrapper {
    width: fit-content; /* 宽度自适应内容 */
    height: 100%; /* 高度占满父容器 */
    display: flex; /* 弹性布局 */
    align-items: center; /* 垂直居中 */
    justify-content: center; /* 水平居中 */
    font-family: Arial, Helvetica, sans-serif; /* 字体设置 */
  }

  /* 隐藏原生文件输入框 */
  #file {
    display: none; /* 完全隐藏 */
  }
  /* 文件上传标签样式 - 作为文件输入的可视化触发器 */
  .fileUploadWrapper label {
    cursor: pointer; /* 鼠标指针，表示可点击 */
    width: fit-content; /* 宽度自适应内容 */
    height: fit-content; /* 高度自适应内容 */
    display: flex; /* 弹性布局 */
    align-items: center; /* 垂直居中 */
    justify-content: center; /* 水平居中 */
    position: relative; /* 相对定位，为工具提示提供定位参考 */
  }
  /* 文件上传图标SVG样式 */
  .fileUploadWrapper label svg {
    height: 18px; /* 图标高度18px */
  }
  /* 文件上传图标路径动画 */
  .fileUploadWrapper label svg path {
    transition: all 0.3s; /* 所有属性变化的平滑过渡 */
  }
  /* 文件上传图标圆形动画 */
  .fileUploadWrapper label svg circle {
    transition: all 0.3s; /* 所有属性变化的平滑过渡 */
  }
  /* 文件上传标签悬停时的路径样式 */
  .fileUploadWrapper label:hover svg path {
    stroke: #fff; /* 悬停时白色描边 */
  }
  /* 文件上传标签悬停时的圆形样式 */
  .fileUploadWrapper label:hover svg circle {
    stroke: #fff; /* 悬停时白色描边 */
    fill: #3c3c3c; /* 悬停时深灰色填充 */
  }
  /* 文件上传标签悬停时显示工具提示 */
  .fileUploadWrapper label:hover .tooltip {
    display: block; /* 显示工具提示 */
    opacity: 1; /* 完全不透明 */
  }
  /* 工具提示样式 - 悬停时显示的说明文字 */
  .tooltip {
    position: absolute; /* 绝对定位 */
    top: -40px; /* 位于标签上方40px */
    display: none; /* 默认隐藏 */
    opacity: 0; /* 默认透明 */
    color: white; /* 白色文字 */
    font-size: 10px; /* 字体大小10px */
    text-wrap: nowrap; /* 不换行 */
    background-color: #000; /* 黑色背景 */
    padding: 6px 10px; /* 内边距：上下6px，左右10px */
    border: 1px solid #3c3c3c; /* 深灰色边框 */
    border-radius: 5px; /* 圆角5px */
    box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.596); /* 阴影效果 */
    transition: all 0.3s; /* 所有属性变化的平滑过渡 */
  }
  /* 消息输入框 - 用户输入文本的文本域 */
  #messageInput {
    flex: 1; /* 占据剩余空间 */
    min-height: 40px; /* 最小高度40px */
    max-height: 100px; /* 最大高度100px，约3行文本 */
    background-color: transparent; /* 透明背景 */
    outline: none; /* 移除焦点轮廓 */
    border: none; /* 无边框 */
    padding: 10px; /* 内边距10px */
    color: white; /* 白色文字 */
    font-size: 16px; /* 字体大小16px */
    resize: none; /* 禁止手动调整大小 */
    overflow-y: auto; /* 垂直滚动 */
    line-height: 1.4; /* 行高1.4倍 */
    font-family: inherit; /* 继承父元素字体 */
  }
  /* 输入框获得焦点或有内容时的发送按钮样式 */
  #messageInput:focus ~ #sendButton svg path,
  #messageInput:valid ~ #sendButton svg path {
    fill: #3c3c3c; /* 深灰色填充 */
    stroke: white; /* 白色描边 */
  }
  
  /* 输入框滚动条样式 */
  #messageInput::-webkit-scrollbar {
    width: 4px; /* 滚动条宽度4px */
  }
  
  /* 输入框滚动条轨道样式 */
  #messageInput::-webkit-scrollbar-track {
    background: transparent; /* 透明轨道背景 */
  }
  
  /* 输入框滚动条滑块样式 */
  #messageInput::-webkit-scrollbar-thumb {
    background: #6c6c6c; /* 中灰色滑块背景 */
    border-radius: 2px; /* 圆角2px */
  }
  
  /* 输入框滚动条滑块悬停效果 */
  #messageInput::-webkit-scrollbar-thumb:hover {
    background: #8c8c8c; /* 悬停时浅灰色背景 */
  }

  /* 发送按钮 - 发送消息或停止发送的按钮 */
  #sendButton {
    width: fit-content; /* 宽度自适应内容 */
    height: 100%; /* 高度占满父容器 */
    background-color: transparent; /* 透明背景 */
    outline: none; /* 移除焦点轮廓 */
    border: none; /* 无边框 */
    display: flex; /* 弹性布局 */
    align-items: center; /* 垂直居中 */
    justify-content: center; /* 水平居中 */
    cursor: pointer; /* 鼠标指针，表示可点击 */
    transition: all 0.3s; /* 所有属性变化的平滑过渡 */
    min-width: 40px; /* 最小宽度40px */
  }
  
  /* 发送按钮处于发送状态时的样式 - 显示为停止按钮 */
  #sendButton.sending {
    background-color: #ff4444; /* 红色背景，表示停止 */
    border-radius: 4px; /* 圆角4px */
    padding: 8px; /* 内边距8px */
  }
  
  /* 发送状态下的悬停效果 */
  #sendButton.sending:hover {
    background-color: #ff6666; /* 悬停时浅红色背景 */
  }
  /* 发送按钮图标样式 */
  #sendButton svg {
    height: 18px; /* 图标高度18px */
    transition: all 0.3s; /* 所有属性变化的平滑过渡 */
  }
  /* 发送按钮图标路径样式 */
  #sendButton svg path {
    transition: all 0.3s; /* 所有属性变化的平滑过渡 */
  }
  /* 发送按钮悬停时的图标样式 */
  #sendButton:hover svg path {
    fill: #3c3c3c; /* 悬停时深灰色填充 */
    stroke: white; /* 悬停时白色描边 */
  }
</style>

<script setup>
import { ref } from 'vue'
import GlobalConfig from '../config/globalConfig.js'

const props = defineProps({
  apiToken: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['send', 'stop'])
const messageText = ref('')
const isSending = ref(false)

const sendMessage = () => {
  if (isSending.value) {
    // 停止发送
    stopSending()
  } else {
    // 开始发送
    if (messageText.value.trim()) {
      isSending.value = true
      emit('send', messageText.value.trim())
      messageText.value = ''
      
      // 重置输入框和容器大小
      resetInputSize()
    }
  }
}

const stopSending = async () => {
  try {
    // 发送停止请求
    const response = await fetch(`http://106.75.76.119/v1/chat-messages/${GlobalConfig.getStopTaskId()}/stop`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${props.apiToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user: GlobalConfig.getStopUserId()
      })
    })
    
    if (response.ok) {
      console.log('停止请求发送成功')
    }
  } catch (error) {
    console.error('停止请求失败:', error)
  } finally {
    isSending.value = false
    emit('stop')
  }
}

// 发送快捷问题
const sendQuickMessage = (questionContent) => {
  if (!isSending.value) {
    messageText.value = questionContent
    sendMessage()
  }
}

// 暴露方法给父组件调用
defineExpose({
  setSendingState: (state) => {
    isSending.value = state
  },
  sendQuickMessage,
  get isSending() {
    return isSending.value
  }
})

const handleKeyDown = (event) => {
  if (event.key === 'Enter' && !event.shiftKey && !isSending.value) {
    event.preventDefault()
    sendMessage()
  }
}

const handleInput = (event) => {
  const textarea = event.target
  textarea.style.height = 'auto'
  const scrollHeight = Math.min(textarea.scrollHeight, 100) // 最大高度100px (约3行)
  textarea.style.height = scrollHeight + 'px'
  
  // 调整父容器高度
  const messageBox = textarea.closest('.messageBox')
  if (messageBox) {
    const newHeight = Math.min(Math.max(scrollHeight + 20, 60), 120) // 加上padding，最小60px，最大120px
    messageBox.style.height = newHeight + 'px'
  }
}

// 重置输入框大小
const resetInputSize = () => {
  const textarea = document.getElementById('messageInput')
  const messageBox = document.querySelector('.messageBox')
  
  if (textarea) {
    textarea.style.height = '40px' // 重置为最小高度
  }
  
  if (messageBox) {
    messageBox.style.height = '60px' // 重置为最小容器高度
  }
}
</script>

<template>
  <div class="messageBox">
    <!-- 文件上传图标 -->
    <!-- <div class="fileUploadWrapper">
      <label for="file">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 337 337">
          <circle
            stroke-width="20"
            stroke="#6c6c6c"
            fill="none"
            r="158.5"
            cy="168.5"
            cx="168.5"
          ></circle>
          <path
            stroke-linecap="round"
            stroke-width="25"
            stroke="#6c6c6c"
            d="M167.759 79V259"
          ></path>
          <path
            stroke-linecap="round"
            stroke-width="25"
            stroke="#6c6c6c"
            d="M79 167.138H259"
          ></path>
        </svg>
        <span class="tooltip">Add an image</span>
      </label>
      <input type="file" id="file" name="file" />
    </div> -->
    <textarea 
      v-model="messageText"
      @keydown="handleKeyDown"
      @input="handleInput"
      required="" 
      placeholder="Message..." 
      id="messageInput"
      maxlength="2000"
      rows="1"
    ></textarea>
    <button id="sendButton" :class="{ sending: isSending }" @click="sendMessage">
      <!-- 发送图标 -->
      <svg v-if="!isSending" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 664 663">
        <path
          fill="none"
          d="M646.293 331.888L17.7538 17.6187L155.245 331.888M646.293 331.888L17.753 646.157L155.245 331.888M646.293 331.888L318.735 330.228L155.245 331.888"
        ></path>
        <path
          stroke-linejoin="round"
          stroke-linecap="round"
          stroke-width="33.67"
          stroke="#6c6c6c"
          d="M646.293 331.888L17.7538 17.6187L155.245 331.888M646.293 331.888L17.753 646.157L155.245 331.888M646.293 331.888L318.735 330.228L155.245 331.888"
        ></path>
      </svg>
      <!-- 停止图标 -->
      <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="18" height="18">
        <rect x="6" y="6" width="12" height="12" fill="white" stroke="none"></rect>
      </svg>
    </button>
  </div>
</template>
