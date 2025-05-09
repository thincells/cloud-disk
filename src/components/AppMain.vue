<template>
  <router-view v-slot="{ Component }">
    <transition :name="transitionName" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, provide } from 'vue'
import { useRouter } from 'vue-router'
import { onErrorCaptured } from 'vue'

const router = useRouter()
let startX = 0, startY = 0, moveX = 0, moveY = 0, touching = false
const minSwipeDistance = 60 // 右滑最小距离
const maxVerticalOffset = 40 // 允许的最大垂直偏移
const swiping = ref(false)
const transitionName = ref('fade')
provide('swiping', swiping)

function isMobile() {
  return window.innerWidth <= 700
}

function handleTouchStart(e: TouchEvent) {
  if (!isMobile()) return
  if (e.touches.length !== 1) return
  const t = e.touches[0]
  startX = t.clientX
  startY = t.clientY
  touching = true
  swiping.value = false
}
function handleTouchMove(e: TouchEvent) {
  if (!touching) return
  const t = e.touches[0]
  moveX = t.clientX
  moveY = t.clientY
  const dx = moveX - startX
  const dy = Math.abs(moveY - startY)
  if (startX < 40 && dx > 10 && dy < maxVerticalOffset) {
    swiping.value = true
  } else {
    swiping.value = false
  }
}
function handleTouchEnd() {
  if (!touching) return
  const dx = moveX - startX
  const dy = Math.abs(moveY - startY)
  if (startX < 40 && dx > minSwipeDistance && dy < maxVerticalOffset) {
    transitionName.value = 'swipe-right'
    router.back()
    setTimeout(() => { transitionName.value = 'fade' }, 400)
  }
  touching = false
  swiping.value = false
}
onMounted(() => {
  window.addEventListener('touchstart', handleTouchStart, { passive: true })
  window.addEventListener('touchmove', handleTouchMove, { passive: true })  
  window.addEventListener('touchend', handleTouchEnd, { passive: true })
})
onUnmounted(() => {
  window.removeEventListener('touchstart', handleTouchStart)
  window.removeEventListener('touchmove', handleTouchMove)
  window.removeEventListener('touchend', handleTouchEnd)
})

// 全局错误处理
onErrorCaptured((err, instance, info) => {
  console.error('全局错误:', err)
  console.error('错误组件:', instance)
  console.error('错误信息:', info)
  // 这里可以添加错误上报逻辑
  return false // 阻止错误继续传播
})
</script>

<style lang="scss" scoped>
// 全局过渡动画
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.swipe-right-enter-active {
  animation: swipeRightIn 0.4s cubic-bezier(.4,1.4,.6,1) both;
}
.swipe-right-leave-active {
  animation: swipeRightOut 0.4s cubic-bezier(.4,1.4,.6,1) both;
}
@keyframes swipeRightIn {
  0% { opacity: 0; transform: translateX(-40px); }
  100% { opacity: 1; transform: none; }
}
@keyframes swipeRightOut {
  0% { opacity: 1; transform: none; }
  100% { opacity: 0; transform: translateX(80px); }
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
.slide-enter-from {
  transform: translateX(100%);
}
.slide-leave-to {
  transform: translateX(100%);
}
/* 增加弹性效果 */
.slide-enter-active {
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1.2);
}
.slide-leave-active {
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
</style> 