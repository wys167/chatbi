<template>
  <div class="layout-container">
    <!-- 侧边栏导航 -->
    <div class="sidebar-nav">
      <div class="nav-header">
        <h2 class="nav-title">AI经营助手</h2>
        <p class="nav-subtitle">智能商业分析助手</p>
      </div>
      
      <nav class="nav-menu">
        <router-link 
          v-for="page in pageConfigs" 
          :key="page.key"
          :to="page.path"
          class="nav-item"
          :class="{ 'active': $route.meta.pageKey === page.key }"
        >
          <span class="nav-icon">{{ page.icon }}</span>
          <div class="nav-content">
            <span class="nav-label">{{ page.title }}</span>
            <span class="nav-desc">{{ page.description }}</span>
          </div>
        </router-link>
      </nav>
      
      <div class="nav-footer">
        <div class="version-info">
          <span>________</span>
        </div>
      </div>
    </div>
    
    <!-- 主内容区域 -->
    <div class="main-content">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { getAllPageConfigs } from '../config/pageConfig.js'

// 获取当前路由
const route = useRoute()

// 获取所有页面配置
const pageConfigs = computed(() => getAllPageConfigs())
</script>

<style scoped>
/* 布局容器 - 水平布局，占满整个视口 */
.layout-container {
  width: 100%; /* 占满整个宽度 */
  height: 100vh; /* 占满整个视口高度 */
  display: flex; /* 弹性布局 */
  background-color: #f5f5f5; /* 浅灰色背景 */
}

/* 侧边栏导航 - 固定宽度，深色主题 */
.sidebar-nav {
  width: 280px; /* 固定宽度280px */
  height: 100%; /* 占满容器高度 */
  background: linear-gradient(180deg, #0c0c0c 0%, #cfbaba 100%); /* 深色渐变背景 */
  display: flex; /* 弹性布局 */
  flex-direction: column; /* 垂直排列 */
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1); /* 右侧阴影 */
  position: relative; /* 相对定位 */
  z-index: 100; /* 高层级，确保在主内容之上 */
}

/* 导航头部 - 品牌信息区域 */
.nav-header {
  padding: 30px 20px; /* 内边距：上下30px，左右20px */
  border-bottom: 1px solid rgba(255, 255, 255, 0.1); /* 底部分隔线 */
  text-align: center; /* 文本居中 */
}

/* 导航标题 */
.nav-title {
  color: #ffffff; /* 白色文字 */
  font-size: 24px; /* 字体大小24px */
  font-weight: 700; /* 字体粗细为700（粗体） */
  margin: 0 0 8px 0; /* 下边距8px，其他边距为0 */
  letter-spacing: 1px; /* 字母间距1px */
}

/* 导航副标题 */
.nav-subtitle {
  color: #bdc3c7; /* 浅灰色文字 */
  font-size: 14px; /* 字体大小14px */
  margin: 0; /* 无边距 */
  font-weight: 400; /* 正常字体粗细 */
}

/* 导航菜单容器 */
.nav-menu {
  flex: 1; /* 占据剩余空间 */
  padding: 20px 0; /* 上下内边距20px */
  overflow-y: auto; /* 垂直滚动，当菜单项过多时可滚动 */
}

/* 导航菜单项 */
.nav-item {
  display: flex; /* 弹性布局 */
  align-items: center; /* 垂直居中对齐 */
  padding: 16px 20px; /* 内边距：上下16px，左右20px */
  margin: 4px 12px; /* 外边距：上下4px，左右12px */
  border-radius: 12px; /* 圆角12px */
  text-decoration: none; /* 移除下划线 */
  color: #bdc3c7; /* 浅灰色文字 */
  transition: all 0.3s ease; /* 所有属性变化的平滑过渡 */
  position: relative; /* 相对定位，为伪元素提供定位基准 */
  overflow: hidden; /* 隐藏溢出内容 */
}

/* 导航菜单项悬停效果 */
.nav-item:hover {
  background-color: rgba(255, 255, 255, 0.1); /* 半透明白色背景 */
  color: #ffffff; /* 白色文字 */
  transform: translateX(4px); /* 向右移动4px */
}

/* 激活状态的导航菜单项 */
.nav-item.active {
  background: linear-gradient(135deg, #3498db, #2980b9); /* 蓝色渐变背景 */
  color: #ffffff; /* 白色文字 */
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3); /* 蓝色阴影 */
}

/* 激活状态的导航菜单项悬停效果 */
.nav-item.active:hover {
  background: linear-gradient(135deg, #2980b9, #3498db); /* 反向蓝色渐变 */
  transform: translateX(2px); /* 向右移动2px，比普通悬停效果小 */
}

/* 导航图标 */
.nav-icon {
  font-size: 24px; /* 图标大小24px */
  margin-right: 16px; /* 右边距16px */
  width: 32px; /* 固定宽度32px，确保对齐 */
  text-align: center; /* 图标居中 */
  flex-shrink: 0; /* 不收缩，保持固定大小 */
}

/* 导航内容区域 */
.nav-content {
  display: flex; /* 弹性布局 */
  flex-direction: column; /* 垂直排列 */
  flex: 1; /* 占据剩余空间 */
}

/* 导航标签 */
.nav-label {
  font-size: 16px; /* 字体大小16px */
  font-weight: 600; /* 字体粗细为600（半粗体） */
  margin-bottom: 2px; /* 下边距2px */
  line-height: 1.2; /* 行高1.2倍 */
}

/* 导航描述 */
.nav-desc {
  font-size: 12px; /* 字体大小12px */
  opacity: 0.8; /* 透明度80% */
  line-height: 1.3; /* 行高1.3倍 */
  font-weight: 400; /* 正常字体粗细 */
}

/* 导航底部 - 版本信息等 */
.nav-footer {
  padding: 20px; /* 内边距20px */
  border-top: 1px solid rgba(255, 255, 255, 0.1); /* 顶部分隔线 */
}

/* 版本信息 */
.version-info {
  text-align: center; /* 文本居中 */
  color: #7f8c8d; /* 灰色文字 */
  font-size: 12px; /* 字体大小12px */
  font-weight: 400; /* 正常字体粗细 */
}

/* 主内容区域 - 占据剩余空间，白色背景 */
.main-content {
  flex: 1; /* 占据剩余空间（侧边栏外的所有空间） */
  height: 100%; /* 占满容器高度 */
  background-color: #ffffff; /* 白色背景 */
  overflow: hidden; /* 隐藏溢出内容，防止整体滚动 */
}

/* 自定义滚动条样式 - 适用于导航菜单 */
.nav-menu::-webkit-scrollbar {
  width: 6px; /* 滚动条宽度6px */
}

.nav-menu::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1); /* 滚动条轨道背景 */
  border-radius: 3px; /* 圆角3px */
}

.nav-menu::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3); /* 滚动条滑块背景 */
  border-radius: 3px; /* 圆角3px */
}

.nav-menu::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5); /* 滚动条滑块悬停背景 */
}

/* 响应式设计 - 小屏幕适配 */
@media (max-width: 768px) {
  .sidebar-nav {
    width: 240px; /* 小屏幕下减小侧边栏宽度 */
  }
  
  .nav-item {
    padding: 12px 16px; /* 减小内边距 */
    margin: 2px 8px; /* 减小外边距 */
  }
  
  .nav-icon {
    font-size: 20px; /* 减小图标大小 */
    width: 28px; /* 减小图标容器宽度 */
    margin-right: 12px; /* 减小右边距 */
  }
  
  .nav-label {
    font-size: 14px; /* 减小标签字体大小 */
  }
  
  .nav-desc {
    font-size: 11px; /* 减小描述字体大小 */
  }
}
</style>