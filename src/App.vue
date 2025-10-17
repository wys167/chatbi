<script setup>
// 移除Chat组件的直接引用，改为使用路由
</script>

<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style>
/* 全局样式重置 - 移除所有元素的默认边距和内边距 */
* {
  margin: 0; /* 移除默认外边距 */
  padding: 0; /* 移除默认内边距 */
  box-sizing: border-box; /* 边框盒模型，包含边框和内边距在内的总宽度 */
}

/* 页面主体样式 - 设置全局字体 */
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; /* 系统字体栈，优先使用系统默认字体 */
}

/* 应用根容器 - 占满整个视口 */
#app {
  width: 100vw; /* 宽度占满视口宽度 */
  height: 100vh; /* 高度占满视口高度 */
  overflow: hidden; /* 隐藏溢出内容，防止页面滚动 */
}
</style>
