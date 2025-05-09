<template>
  <BackIcon />
  <div class="image-preview">
    <div class="file-name">{{ file.name }}</div>
    <transition name="fade-img" mode="out-in">
      <img
        :src="file.url"
        class="main-img"
        @touchstart="onTouchStart"
        @touchmove="onTouchMove"
        @touchend="onTouchEnd"
        @mousedown="onMouseDown"
        :key="file.url"
        @click="openViewer"
        style="cursor: zoom-in;"
      />
    </transition>
    <div class="thumb-list" ref="thumbListRef">
      <img
        v-for="img in fileList"
        :key="img.id"
        :src="img.url"
        :class="{active: img.id === file.id}"
        @click="$emit('switch', img.id)"
      />
    </div>
    <teleport to="body">
      <transition name="fade-img">
        <div v-if="showViewer" class="img-viewer-mask" @click.self="closeViewer">
          <img
            :src="file.url"
            class="img-viewer-img"
            :style="{
              transform: `translate(${translate.x}px,${translate.y}px) scale(${scale})`,
              cursor: scale > 1 ? 'grab' : 'zoom-out'
            }"
            @wheel="onWheel"
            @mousedown="onViewerMouseDown"
            @touchstart="onTouchStartViewer"
            @touchmove="onTouchMoveViewer"
          />
          <span class="img-viewer-close" @click="closeViewer">×</span>
        </div>
      </transition>
    </teleport>
  </div>
</template>
<script setup>
import { defineEmits, onBeforeUnmount, ref, onMounted, nextTick, watch } from 'vue'
import BackIcon from '@/components/BackIcon.vue'

const props = defineProps({ file: Object, fileList: Array })
const emit = defineEmits(['switch'])

let startX = 0
let dragging = false
let moved = false

// 全屏预览相关
const showViewer = ref(false)
const scale = ref(1)
const translate = ref({ x: 0, y: 0 })
let lastTouchDist = 0
let lastCenter = { x: 0, y: 0 }
let lastPos = { x: 0, y: 0 }

const thumbListRef = ref(null)

function onTouchStart(e) {
  dragging = true
  startX = e.touches ? e.touches[0].clientX : e.clientX
  moved = false
}
function onTouchMove(e) {
  if (!dragging) return
  const currX = e.touches ? e.touches[0].clientX : e.clientX
  if (Math.abs(currX - startX) > 10) moved = true
}
function onTouchEnd(e) {
  if (!dragging) return
  const endX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX
  const dx = endX - startX
  if (moved && Math.abs(dx) > 40) {
    if (dx < 0) emit('switch', getNextId())
    else emit('switch', getPrevId())
  }
  dragging = false
  moved = false
}
// PC端全局监听
function onMouseDown(e) {
  dragging = true
  startX = e.clientX
  moved = false
  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mouseup', onMouseUp)
}
function onMouseMove(e) {
  if (!dragging) return
  if (Math.abs(e.clientX - startX) > 10) moved = true
}
function onMouseUp(e) {
  if (!dragging) return
  const dx = e.clientX - startX
  if (moved && Math.abs(dx) > 40) {
    if (dx < 0) emit('switch', getNextId())
    else emit('switch', getPrevId())
  }
  dragging = false
  moved = false
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('mouseup', onMouseUp)
}
function getNextId() {
  const idx = props.fileList.findIndex(img => img.id === props.file.id)
  if (idx < props.fileList.length - 1) return props.fileList[idx + 1].id
  return props.fileList[0].id
}
function getPrevId() {
  const idx = props.fileList.findIndex(img => img.id === props.file.id)
  if (idx > 0) return props.fileList[idx - 1].id
  return props.fileList[props.fileList.length - 1].id
}

function openViewer() {
  showViewer.value = true
  scale.value = 1
  translate.value = { x: 0, y: 0 }
  nextTick(() => {
    document.addEventListener('keydown', onKeyDown)
  })
}
function closeViewer() {
  showViewer.value = false
  document.removeEventListener('keydown', onKeyDown)
}
function onKeyDown(e) {
  if (e.key === 'Escape') closeViewer()
}
// PC端缩放
function onWheel(e) {
  e.preventDefault()
  let next = scale.value + (e.deltaY < 0 ? 0.15 : -0.15)
  next = Math.max(0.3, Math.min(4, next))
  scale.value = next
}
// PC端拖动
let dragStart = null
function onViewerMouseDown(e) {
  dragStart = { x: e.clientX, y: e.clientY, tx: translate.value.x, ty: translate.value.y }
  window.addEventListener('mousemove', onViewerMouseMove)
  window.addEventListener('mouseup', onViewerMouseUp)
}
function onViewerMouseMove(e) {
  if (!dragStart) return
  translate.value = {
    x: dragStart.tx + (e.clientX - dragStart.x),
    y: dragStart.ty + (e.clientY - dragStart.y)
  }
}
function onViewerMouseUp() {
  dragStart = null
  window.removeEventListener('mousemove', onViewerMouseMove)
  window.removeEventListener('mouseup', onViewerMouseUp)
}
// 移动端双指缩放
function onTouchStartViewer(e) {
  if (e.touches.length === 2) {
    lastTouchDist = getTouchDist(e)
    lastCenter = getTouchCenter(e)
    lastPos = { ...translate.value }
  }
}
function onTouchMoveViewer(e) {
  if (e.touches.length === 2) {
    const dist = getTouchDist(e)
    const center = getTouchCenter(e)
    let nextScale = scale.value * (dist / lastTouchDist)
    nextScale = Math.max(0.3, Math.min(4, nextScale))
    scale.value = nextScale
    translate.value = {
      x: lastPos.x + (center.x - lastCenter.x),
      y: lastPos.y + (center.y - lastCenter.y)
    }
  }
}
function getTouchDist(e) {
  const [a, b] = e.touches
  return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY)
}
function getTouchCenter(e) {
  const [a, b] = e.touches
  return { x: (a.clientX + b.clientX) / 2, y: (a.clientY + b.clientY) / 2 }
}

// 自动滚动到当前缩略图
watch(() => props.file.id, (id) => {
  nextTick(() => {
    const list = thumbListRef.value
    if (!list) return
    const imgs = list.querySelectorAll('img')
    const idx = props.fileList.findIndex(img => img.id === id)
    if (imgs[idx]) {
      const img = imgs[idx]
      const listRect = list.getBoundingClientRect()
      const imgRect = img.getBoundingClientRect()
      // 如果当前图片不在可视区域则滚动
      if (imgRect.left < listRect.left || imgRect.right > listRect.right) {
        list.scrollTo({
          left: img.offsetLeft - list.clientWidth / 2 + img.clientWidth / 2,
          behavior: 'smooth'
        })
      }
    }
  })
})

onBeforeUnmount(() => {
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('mouseup', onMouseUp)
  document.removeEventListener('keydown', onKeyDown)
  window.removeEventListener('mousemove', onViewerMouseMove)
  window.removeEventListener('mouseup', onViewerMouseUp)
})
</script>
<style scoped>
.image-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.main-img {
  max-width: 90vw;
  max-height: 60vh;
  border-radius: 12px;
  margin-bottom: 16px;
  box-shadow: 0 2px 12px #0002;
}
.thumb-list {
  display: flex;
  overflow-x: auto;
  gap: 10px;
  padding: 8px 0 0 0;
  justify-content: flex-start;
  align-items: center;
  max-width: 340px;
  margin: 0 auto 8px auto;
  scrollbar-width: none;
}
.thumb-list::-webkit-scrollbar {
  display: none;
}
.thumb-list img {
  width: 70px;
  height: 48px;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
  border: 2px solid transparent;
  transition: border 0.2s;
}
.thumb-list img.active {
  border: 2px solid #409eff;
}
.file-name {
  margin-top: 12px;
  margin-bottom: 8px;
  font-size: 18px;
  font-weight: 500;
  color: #333;
  text-align: center;
  word-break: break-all;
}
.fade-img-enter-active, .fade-img-leave-active {
  transition: opacity 0.35s cubic-bezier(.4,0,.2,1);
}
.fade-img-enter-from, .fade-img-leave-to {
  opacity: 0;
}
.img-viewer-mask {
  position: fixed;
  z-index: 9999;
  left: 0; top: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.92);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}
.img-viewer-img {
  max-width: 96vw;
  max-height: 92vh;
  user-select: none;
  box-shadow: 0 4px 32px #0008;
  border-radius: 12px;
  transition: transform 0.25s cubic-bezier(.4,0,.2,1);
}
.img-viewer-close {
  position: fixed;
  top: 32px;
  right: 40px;
  font-size: 38px;
  color: #fff;
  cursor: pointer;
  z-index: 10000;
  font-weight: bold;
  text-shadow: 0 2px 8px #000a;
  transition: color 0.2s;
}
.img-viewer-close:hover {
  color: #409eff;
}
</style> 