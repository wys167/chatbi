<style scoped>
/* 加载器容器 - 水平排列的脉冲圆点加载动画 */
.loader3 {
  display: flex; /* 弹性布局 */
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
}

/* 脉冲圆点 - 执行缩放和透明度变化的圆形元素 */
.circle1 {
  width: 20px; /* 圆点宽度20px */
  height: 20px; /* 圆点高度20px */
  border-radius: 50%; /* 圆形形状 */
  margin: 0 10px; /* 左右间距10px，上下无间距 */
  background-color: #333; /* 深灰色背景 */
  animation: circle1 1s ease-in-out infinite; /* 脉冲动画：1秒，缓入缓出，无限循环 */
}

/* 第二个圆点 - 延迟0.2秒开始动画 */
.circle1:nth-child(2) {
  animation-delay: 0.2s; /* 延迟0.2秒开始动画 */
}

/* 第三个圆点 - 延迟0.4秒开始动画 */
.circle1:nth-child(3) {
  animation-delay: 0.4s; /* 延迟0.4秒开始动画 */
}

/* 第四个圆点 - 延迟0.6秒开始动画 */
.circle1:nth-child(4) {
  animation-delay: 0.6s; /* 延迟0.6秒开始动画 */
}

/* 第五个圆点 - 延迟0.8秒开始动画 */
.circle1:nth-child(5) {
  animation-delay: 0.8s; /* 延迟0.8秒开始动画 */
}

/* 圆点脉冲动画关键帧 - 缩放和透明度变化效果 */
@keyframes circle1 {
  0% {
    transform: scale(1); /* 起始状态：正常大小 */
    opacity: 1; /* 起始状态：完全不透明 */
  }

  50% {
    transform: scale(1.5); /* 中间状态：放大1.5倍 */
    opacity: 0.5; /* 中间状态：半透明 */
  }

  100% {
    transform: scale(1); /* 结束状态：恢复正常大小 */
    opacity: 1; /* 结束状态：完全不透明 */
  }
}
</style>

<template>
  <div class="loader3">
    <div class="circle1"></div>
    <div class="circle1"></div>
    <div class="circle1"></div>
    <div class="circle1"></div>
    <div class="circle1"></div>
  </div>
</template>
