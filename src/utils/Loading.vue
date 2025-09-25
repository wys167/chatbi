<style scoped>
/* 加载动画容器 - 居中显示的弹跳球动画包装器 */
.wrapper {
  width: 200px; /* 容器宽度200px */
  height: 60px; /* 容器高度60px */
  position: absolute; /* 绝对定位 */
  top: calc(50% - 37px); /* 垂直居中，减去一半高度加偏移 */
  left: 50%; /* 水平居中起点 */
  transform: translate(-50%, -50%); /* 精确居中对齐 */
  z-index: 1000; /* 高层级，确保在其他元素之上 */
  pointer-events: none; /* 不阻挡鼠标事件，允许点击穿透 */
}

/* 弹跳圆球 - 执行弹跳动画的圆形元素 */
.circle {
  width: 20px; /* 圆球宽度20px */
  height: 20px; /* 圆球高度20px */
  position: absolute; /* 绝对定位 */
  border-radius: 50%; /* 圆形形状 */
  background-color: #0b0a0a; /* 深黑色背景 */
  left: 15%; /* 第一个球位于左侧15%位置 */
  transform-origin: 50%; /* 变换原点在中心 */
  animation: circle7124 .5s alternate infinite ease; /* 弹跳动画：0.5秒，交替方向，无限循环，缓动 */
}

/* 圆球弹跳动画关键帧 - 模拟球的弹跳效果 */
@keyframes circle7124 {
  0% {
    top: 60px; /* 起始位置在底部 */
    height: 5px; /* 压扁状态，高度5px */
    border-radius: 50px 50px 25px 25px; /* 椭圆形状，模拟压扁效果 */
    transform: scaleX(1.7); /* 水平拉伸1.7倍 */
  }

  40% {
    height: 20px; /* 恢复正常高度20px */
    border-radius: 50%; /* 恢复圆形 */
    transform: scaleX(1); /* 恢复正常比例 */
  }

  100% {
    top: 0%; /* 最终位置在顶部 */
  }
}

/* 第二个圆球 - 位于中间位置，延迟0.2秒开始动画 */
.circle:nth-child(2) {
  left: 45%; /* 位于中间45%位置 */
  animation-delay: .2s; /* 延迟0.2秒开始动画 */
}

/* 第三个圆球 - 位于右侧位置，延迟0.3秒开始动画 */
.circle:nth-child(3) {
  left: auto; /* 取消左侧定位 */
  right: 15%; /* 位于右侧15%位置 */
  animation-delay: .3s; /* 延迟0.3秒开始动画 */
}

/* 圆球阴影 - 模拟圆球在地面上的投影效果 */
.shadow {
  width: 20px; /* 阴影宽度20px */
  height: 4px; /* 阴影高度4px，扁平状 */
  border-radius: 50%; /* 椭圆形阴影 */
  background-color: rgba(0,0,0,0.9); /* 半透明黑色，透明度90% */
  position: absolute; /* 绝对定位 */
  top: 62px; /* 位于底部62px位置，模拟地面 */
  transform-origin: 50%; /* 变换原点在中心 */
  z-index: -1; /* 负层级，确保在圆球下方 */
  left: 15%; /* 第一个阴影位于左侧15%位置 */
  filter: blur(1px); /* 1px模糊效果，增加真实感 */
  animation: shadow046 .5s alternate infinite ease; /* 阴影动画：0.5秒，交替方向，无限循环，缓动 */
}

/* 阴影变化动画关键帧 - 模拟圆球弹跳时阴影的变化 */
@keyframes shadow046 {
  0% {
    transform: scaleX(1.5); /* 圆球在底部时，阴影水平拉伸1.5倍 */
  }

  40% {
    transform: scaleX(1); /* 圆球上升过程中，阴影恢复正常比例 */
    opacity: .7; /* 透明度70% */
  }

  100% {
    transform: scaleX(.2); /* 圆球在顶部时，阴影缩小到20% */
    opacity: .4; /* 透明度40%，模拟距离地面越远阴影越淡 */
  }
}

/* 第二个阴影 - 对应第二个圆球，延迟0.2秒开始动画 */
.shadow:nth-child(4) {
  left: 45%; /* 位于中间45%位置 */
  animation-delay: .2s; /* 延迟0.2秒开始动画 */
}

/* 第三个阴影 - 对应第三个圆球，延迟0.3秒开始动画 */
.shadow:nth-child(5) {
  left: auto; /* 取消左侧定位 */
  right: 15%; /* 位于右侧15%位置 */
  animation-delay: .3s; /* 延迟0.3秒开始动画 */
}
</style>

<template>
  <div class="wrapper">
      <div class="circle"></div>
      <div class="circle"></div>
      <div class="circle"></div>
      <div class="shadow"></div>
      <div class="shadow"></div>
      <div class="shadow"></div>
  </div>
</template>
