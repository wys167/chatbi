<template>
  <div class="folder-wrapper">
    <div class="folder-container" @click="toggleHistoryModal">
      <div class="folder-back"></div>
      <div class="folder-layer folder-layer-4"></div>
      <div class="folder-layer folder-layer-3"></div>
      <div class="folder-layer folder-layer-2"></div>
      <div class="folder-front">
        <div class="folder-tab"></div>
        <div class="folder-tab-corner"></div>
      </div>
    </div>
    
    <!-- 历史记录弹出框 -->
    <div v-if="showHistoryModal" class="history-modal" @click.stop>
      <div class="modal-header">
        <h3>聊天记录</h3>
        <button class="close-btn" @click="closeHistoryModal">×</button>
      </div>
      <div class="modal-content">
        <div v-if="loading" class="loading-text">加载中...</div>
        <div v-else-if="conversations.length === 0" class="empty-text">暂无聊天记录</div>
        <div v-else class="conversation-list">
          <div 
            v-for="conversation in conversations" 
            :key="conversation.id"
            class="conversation-item"
            @click="loadConversationMessages(conversation.id)"
          >
            <div class="conversation-name">{{ conversation.name }}</div>
            <div class="conversation-time">{{ formatTime(conversation.updated_at) }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { historyAPI } from './api.js'
import MarkdownIt from 'markdown-it'

// 响应式数据
const showHistoryModal = ref(false)
const loading = ref(false)
const conversations = ref([])

// Markdown渲染器
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  breaks: true
}).enable(['table'])

// 定义事件
const emit = defineEmits(['loadConversation'])

// 切换历史记录弹出框
const toggleHistoryModal = async () => {
  showHistoryModal.value = !showHistoryModal.value
  if (showHistoryModal.value) {
    await loadConversations()
  }
}

// 关闭历史记录弹出框
const closeHistoryModal = () => {
  showHistoryModal.value = false
}

// 加载对话列表
const loadConversations = async () => {
  loading.value = true
  try {
    const response = await historyAPI.getConversations()
    conversations.value = response.data || []
  } catch (error) {
    console.error('加载对话列表失败:', error)
    conversations.value = []
  } finally {
    loading.value = false
  }
}

// 加载对话消息并渲染到Chat组件
const loadConversationMessages = async (conversationId) => {
  try {
    const response = await historyAPI.getMessages(conversationId)
    const messages = response.data || []
    
    // 转换消息格式为Chat组件需要的格式
    const formattedMessages = []
    messages.forEach(message => {
      // 添加用户消息
      if (message.query) {
        formattedMessages.push({
          type: 'user',
          content: message.query
        })
      }
      
      // 添加AI回复
      if (message.answer) {
        formattedMessages.push({
          type: 'ai',
          content: message.answer,
          parts: [{
            type: 'text',
            content: message.answer
          }]
        })
      }
    })
    
    // 发送事件到父组件，让Chat组件加载这些消息
    emit('loadConversation', formattedMessages)
    
    // 关闭弹出框
    closeHistoryModal()
  } catch (error) {
    console.error('加载对话消息失败:', error)
  }
}

// 格式化时间
const formatTime = (timestamp) => {
  const date = new Date(timestamp * 1000)
  const now = new Date()
  const diff = now - date
  
  if (diff < 24 * 60 * 60 * 1000) {
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  } else if (diff < 7 * 24 * 60 * 60 * 1000) {
    return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
  } else {
    return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'short', day: 'numeric' })
  }
}
</script>

<style scoped>
/* 3D文件夹外层包装器 - 提供3D透视效果的容器 */
.folder-wrapper {
  display: flex; /* 弹性布局 */
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  width: 100%; /* 占满容器宽度 */
  height: 100%; /* 占满容器高度 */
  perspective: 1500px; /* 3D透视距离，数值越大透视效果越弱 */
}

/* 3D文件夹主容器 - 包含所有文件夹层级的容器 */
.folder-container {
  position: relative; /* 相对定位，为子元素提供定位参考 */
  width: 240px; /* 文件夹宽度240px */
  height: 160px; /* 文件夹高度160px */
  cursor: pointer; /* 鼠标指针，表示可点击 */
  transform-style: preserve-3d; /* 保持3D变换样式，让子元素也能3D变换 */
  transition: all 0.3s ease; /* 所有属性变化的平滑过渡 */
}

/* 文件夹悬停效果 - 轻微的3D旋转 */
.folder-container:hover {
  transform: rotateX(-10deg) rotateY(5deg); /* X轴向后旋转10度，Y轴向右旋转5度 */
}

/* 文件夹背景层 - 最底层，提供主要的颜色和阴影 */
.folder-back {
  position: absolute; /* 绝对定位 */
  top: 0; /* 顶部对齐 */
  left: 0; /* 左侧对齐 */
  width: 100%; /* 占满容器宽度 */
  height: 100%; /* 占满容器高度 */
  background: linear-gradient(135deg, #f59e0b, #d97706); /* 橙色渐变背景 */
  border-radius: 16px; /* 圆角16px */
  border-top-left-radius: 4px; /* 左上角小圆角，模拟文件夹缺口 */
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2); /* 底部阴影，增加立体感 */
  transform-origin: bottom; /* 变换原点在底部，旋转时以底边为轴 */
  transition: all 0.3s ease; /* 所有属性变化的平滑过渡 */
}

/* 文件夹背景层悬停效果 - 增强阴影 */
.folder-container:hover .folder-back {
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.3); /* 悬停时阴影更深更大 */
}

/* 文件夹中间层基础样式 - 用于创建层叠效果 */
.folder-layer {
  position: absolute; /* 绝对定位 */
  top: 4px; /* 距离顶部4px */
  left: 4px; /* 距离左侧4px */
  right: 4px; /* 距离右侧4px */
  bottom: 4px; /* 距离底部4px */
  border-radius: 16px; /* 圆角16px */
  transform-origin: bottom; /* 变换原点在底部 */
  transition: all 0.3s ease; /* 所有属性变化的平滑过渡 */
}

/* 文件夹第4层（最深层） - 深灰色 */
.folder-layer-4 {
  background-color: #a1a1aa; /* 深灰色背景 */
}

/* 文件夹第3层 - 中灰色 */
.folder-layer-3 {
  background-color: #d4d4d8; /* 中灰色背景 */
}

/* 文件夹第2层 - 浅灰色 */
.folder-layer-2 {
  background-color: #e4e4e7; /* 浅灰色背景 */
}

/* 文件夹各层悬停时的3D旋转效果 - 创建层次感 */
.folder-container:hover .folder-layer-4 {
  transform: rotateX(-20deg); /* 第4层向后旋转20度 */
}

.folder-container:hover .folder-layer-3 {
  transform: rotateX(-30deg); /* 第3层向后旋转30度 */
}

.folder-container:hover .folder-layer-2 {
  transform: rotateX(-38deg); /* 第2层向后旋转38度 */
}

/* 文件夹前面板 - 最顶层，模拟文件夹的开口部分 */
.folder-front {
  position: absolute; /* 绝对定位 */
  bottom: 0; /* 底部对齐 */
  left: 0; /* 左侧对齐 */
  width: 100%; /* 占满容器宽度 */
  height: 156px; /* 高度156px，略小于容器高度 */
  background: linear-gradient(to top, #f59e0b, #fbbf24); /* 从下到上的橙色渐变 */
  border-radius: 16px; /* 圆角16px */
  border-top-right-radius: 4px; /* 右上角小圆角，模拟文件夹缺口 */
  transform-origin: bottom; /* 变换原点在底部 */
  transition: all 0.3s ease; /* 所有属性变化的平滑过渡 */
  display: flex; /* 弹性布局 */
  align-items: flex-end; /* 内容对齐到底部 */
}

/* 文件夹前面板悬停效果 - 打开文件夹的动画 */
.folder-container:hover .folder-front {
  transform: rotateX(-46deg) translateY(1px); /* 向后旋转46度并向下移动1px */
  box-shadow: 
    inset 0 20px 40px #fbbf24, /* 内部顶部阴影，模拟内部光照 */
    inset 0 -20px 40px #d97706; /* 内部底部阴影，增加深度感 */
}

/* 文件夹标签页 - 模拟真实文件夹的标签 */
.folder-tab {
  position: absolute; /* 绝对定位 */
  top: -16px; /* 位于文件夹顶部上方16px */
  right: 0; /* 右侧对齐 */
  width: 146px; /* 标签宽度146px */
  height: 16px; /* 标签高度16px */
  background-color: #fbbf24; /* 与文件夹前面板相同的颜色 */
  border-radius: 16px 16px 0 0; /* 上方圆角，下方直角 */
}

/* 文件夹标签页圆角过渡 - 创建自然的连接效果 */
.folder-tab-corner {
  position: absolute; /* 绝对定位 */
  top: -10px; /* 位于标签页下方 */
  right: 142px; /* 位于标签页左侧边缘 */
  width: 12px; /* 宽度12px */
  height: 12px; /* 高度12px */
  background-color: #fbbf24; /* 与标签页相同的颜色 */
  clip-path: polygon(100% 14%, 50% 100%, 100% 100%); /* 裁剪成三角形，创建圆角过渡 */
}

/* 历史记录弹出框样式 - 点击文件夹时显示的对话历史列表 */
.history-modal {
  position: absolute; /* 绝对定位 */
  bottom: 180px; /* 距离底部160px，与文件夹高度对齐 */
  left: 150px; /* 左侧对齐 */
  width: 340px; /* 宽度340px，与文件夹宽度相同 */
  height: 360px; /* 高度360px，是宽度的1.5倍 */
  background: white; /* 白色背景 */
  border-radius: 12px; /* 圆角12px */
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3); /* 深度阴影，增加层次感 */
  z-index: 1000; /* 高层级，确保在其他元素之上 */
  display: flex; /* 弹性布局 */
  flex-direction: column; /* 垂直排列 */
  animation: modalSlideUp 0.3s ease-out; /* 弹出动画 */
  border: 1px solid #e0e0e0; /* 浅灰色边框 */
}

/* 弹出框出现动画 - 从下方滑入并缩放 */
@keyframes modalSlideUp {
  from {
    opacity: 0; /* 初始透明 */
    transform: translateY(20px) scale(0.95); /* 向下偏移20px并缩小到95% */
  }
  to {
    opacity: 1; /* 完全不透明 */
    transform: translateY(0) scale(1); /* 回到原位并恢复原始大小 */
  }
}

/* 模态框头部 - 包含标题和关闭按钮 */
.modal-header {
  display: flex; /* 弹性布局 */
  justify-content: space-between; /* 两端对齐 */
  align-items: center; /* 垂直居中 */
  padding: 16px 20px; /* 内边距：上下16px，左右20px */
  border-bottom: 1px solid #e0e0e0; /* 底部边框分隔线 */
  background: #f8f9fa; /* 浅灰色背景 */
  border-radius: 12px 12px 0 0; /* 顶部圆角，与模态框圆角匹配 */
}

/* 模态框标题样式 */
.modal-header h3 {
  margin: 0; /* 移除默认外边距 */
  font-size: 16px; /* 字体大小16px */
  font-weight: 600; /* 字体粗细600 */
  color: #333; /* 深灰色文字 */
}

/* 关闭按钮样式 */
.close-btn {
  background: none; /* 无背景 */
  border: none; /* 无边框 */
  font-size: 24px; /* 字体大小24px */
  color: #666; /* 中灰色 */
  cursor: pointer; /* 鼠标指针 */
  padding: 0; /* 无内边距 */
  width: 24px; /* 宽度24px */
  height: 24px; /* 高度24px */
  display: flex; /* 弹性布局 */
  align-items: center; /* 垂直居中 */
  justify-content: center; /* 水平居中 */
  border-radius: 4px; /* 小圆角4px */
  transition: all 0.2s ease; /* 所有属性变化的平滑过渡 */
}

/* 关闭按钮悬停效果 */
.close-btn:hover {
  background-color: #f0f0f0; /* 悬停时浅灰色背景 */
  color: #333; /* 悬停时深灰色文字 */
}

/* 模态框内容区域 - 可滚动的对话列表容器 */
.modal-content {
  flex: 1; /* 占据剩余空间 */
  overflow-y: auto; /* 垂直滚动 */
  padding: 0; /* 无内边距 */
}

/* 加载和空状态文本样式 */
.loading-text, .empty-text {
  text-align: center; /* 文本居中 */
  padding: 40px 20px; /* 内边距：上下40px，左右20px */
  color: #666; /* 中灰色文字 */
  font-size: 14px; /* 字体大小14px */
}

/* 对话列表容器 */
.conversation-list {
  padding: 8px 0; /* 内边距：上下8px，左右0 */
}

/* 单个对话项样式 */
.conversation-item {
  padding: 12px 20px; /* 内边距：上下12px，左右20px */
  cursor: pointer; /* 鼠标指针，表示可点击 */
  border-bottom: 1px solid #f0f0f0; /* 底部分隔线 */
  transition: background-color 0.2s ease; /* 背景色变化的平滑过渡 */
}

/* 对话项悬停效果 */
.conversation-item:hover {
  background-color: #f8f9fa; /* 悬停时浅灰色背景 */
}

/* 最后一个对话项移除底部边框 */
.conversation-item:last-child {
  border-bottom: none; /* 移除底部边框 */
}

/* 对话名称样式 */
.conversation-name {
  font-size: 14px; /* 字体大小14px */
  font-weight: 500; /* 字体粗细500 */
  color: #333; /* 深灰色文字 */
  margin-bottom: 4px; /* 底部外边距4px */
  overflow: hidden; /* 隐藏溢出内容 */
  text-overflow: ellipsis; /* 文本溢出时显示省略号 */
  white-space: nowrap; /* 不换行 */
}

/* 对话时间样式 */
.conversation-time {
  font-size: 12px; /* 字体大小12px */
  color: #999; /* 浅灰色文字 */
}

/* 自定义滚动条样式 - 美化模态框内容区域的滚动条 */
.modal-content::-webkit-scrollbar {
  width: 6px; /* 滚动条宽度6px */
}

/* 滚动条轨道样式 */
.modal-content::-webkit-scrollbar-track {
  background: #f1f1f1; /* 浅灰色轨道背景 */
  border-radius: 3px; /* 圆角3px */
}

/* 滚动条滑块样式 */
.modal-content::-webkit-scrollbar-thumb {
  background: #c1c1c1; /* 中灰色滑块背景 */
  border-radius: 3px; /* 圆角3px */
}

/* 滚动条滑块悬停效果 */
.modal-content::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8; /* 悬停时深灰色背景 */
}
</style>
