<template>
  <div
    class="file-item file-item-row"
    :class="{ shaking: isShaking, dragging: isDragging, 'drag-origin': isDragging }"
    @click="handlePreview"
    @dblclick="onDblClick && onDblClick(props.file)"
    @mousedown="canDrag() ? onDragStart($event) : null"
    @touchstart="canDrag() ? onDragStart($event) : null"
    draggable="false"
  >
    <FileTypeIcon :file="props.file" />
    <div class="file-info file-info-row">
      <div class="file-name">{{ props.file.name }}</div>
      <div class="file-meta-row">
        <span class="file-date">{{ props.file.createdAt }}</span>
        <span class="file-size" v-if="props.file.type !== 'folder'">{{ (props.file.size / 1024).toFixed(1) }} KB</span>
      </div>
    </div>
    <div class="card-menu-btn" @click.stop="toggleMenu">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="5" cy="12" r="2" fill="#bbb"/>
        <circle cx="12" cy="12" r="2" fill="#bbb"/>
        <circle cx="19" cy="12" r="2" fill="#bbb"/>
      </svg>
      <div v-if="showMenu" :class="['card-menu', menuPos]" ref="menuRef">
        <div class="card-menu-item" @click.stop="onShare">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M15 8.5V6a3 3 0 0 0-6 0v2.5" stroke="#409eff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 16v-7.5" stroke="#409eff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><rect x="5" y="16" width="14" height="4" rx="2" stroke="#409eff" stroke-width="2"/></svg>
          分享
        </div>
        <div class="card-menu-item" @click.stop="onDelete">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M6 7h12M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m2 0v12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V7h12z" stroke="#f56c6c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          删除
        </div>
        <div class="card-menu-item" @click.stop="onMove">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M5 12h14" stroke="#67c23a" stroke-width="2" stroke-linecap="round"/><path d="M12 5l7 7-7 7" stroke="#67c23a" stroke-width="2" stroke-linecap="round"/></svg>
          迁移至
        </div>
      </div>
    </div>
    <!-- 迁移模式下显示取消按钮 -->
    <span
      v-if="props.movingFileId === props.file.id"
      class="move-cancel-btn"
      @mousedown.stop.prevent="onCancelMove"
      @touchstart.stop.prevent="onCancelMove"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" fill="#f8d7da"/><path d="M9 9l6 6M15 9l-6 6" stroke="#f56c6c" stroke-width="2" stroke-linecap="round"/></svg>
    </span>
    <!-- 拖动提示条已移到页面顶层 -->
  </div>
</template>
<script setup>
import FileTypeIcon from './FileTypeIcon.vue'
import { useRouter } from 'vue-router'
import { ref, nextTick, onMounted, onBeforeUnmount, watch } from 'vue'
import { ElMessage } from 'element-plus'
const props = defineProps({ file: Object, onDblClick: Function, movingFileId: Number })
const emit = defineEmits(['move', 'moveFile', 'cancelMove'])
const router = useRouter()
const showMenu = ref(false)
const menuRef = ref(null)
const menuPos = ref('menu-bottom')
const isShaking = ref(false)
const isDragging = ref(false)
const dragHint = ref(false)
let dragClone = null
let dragStartX = 0, dragStartY = 0
let dragOffsetX = 0, dragOffsetY = 0
let dragTarget = null
function toggleMenu(e) {
  showMenu.value = !showMenu.value
  if (showMenu.value) {
    nextTick(() => {
      const btn = e?.target?.closest('.card-menu-btn')
      const menu = menuRef.value
      if (btn && menu) {
        const btnRect = btn.getBoundingClientRect()
        const menuRect = menu.getBoundingClientRect()
        if (btnRect.bottom + menuRect.height > window.innerHeight - 8) {
          menuPos.value = 'menu-top'
        } else {
          menuPos.value = 'menu-bottom'
        }
      }
    })
  }
}
function onDelete() {
  showMenu.value = false
  alert('删除功能')
}
function onShare() {
  showMenu.value = false
  alert('分享功能')
}
function onMove() {
  showMenu.value = false
  isShaking.value = true
  emit('move')
}
function handleClickOutside(e) {
  if (showMenu.value && menuRef.value && !menuRef.value.contains(e.target)) {
    showMenu.value = false
  }
}
function handlePreview() {
  if (props.file.type === 'folder' && props.onDblClick) {
    props.onDblClick(props.file)
    return
  }
  let type = props.file.type
  if (props.file.ext === 'md') type = 'md'
  if (props.file.ext === 'txt') type = 'txt'
  if (props.file.ext === 'mp3' || props.file.ext === 'wav') type = 'audio'
  if (props.file.ext === 'xlsx' || props.file.ext === 'xls') {
    if (props.file.url) {
      window.open(props.file.url, '_blank')
    }
    return
  }
  if (props.file.ext === 'pdf') {
    if (props.file.url) {
      window.open(props.file.url, '_blank')
    }
    return
  }
  if (["image", "video", "txt", "md", "audio", "excel"].includes(type)) {
    router.push({ name: 'preview', params: { type, id: props.file.id } })
  }
}
// 拖拽相关
function onDragStart(e) {
  if (!canDrag()) return
  isDragging.value = true
  isShaking.value = false
  dragTarget = e.currentTarget
  const rect = dragTarget.getBoundingClientRect()
  dragStartX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX
  dragStartY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY
  dragOffsetX = dragStartX - rect.left
  dragOffsetY = dragStartY - rect.top
  dragClone = dragTarget.cloneNode(true)
  dragClone.classList.add('drag-clone')
  dragClone.style.position = 'fixed'
  dragClone.style.left = rect.left + 'px'
  dragClone.style.top = rect.top + 'px'
  dragClone.style.width = rect.width + 'px'
  dragClone.style.zIndex = 9999
  dragClone.style.pointerEvents = 'none'
  document.body.appendChild(dragClone)
  document.body.classList.add('dragging-file')
  window.addEventListener('mousemove', onDragMove)
  window.addEventListener('mouseup', onDragEnd)
  window.addEventListener('touchmove', onDragMove, { passive: false })
  window.addEventListener('touchend', onDragEnd)
}
function onDragMove(e) {
  if (!isDragging.value || !dragClone) return
  const x = e.type.startsWith('touch') ? e.touches[0].clientX : e.clientX
  const y = e.type.startsWith('touch') ? e.touches[0].clientY : e.clientY
  dragClone.style.left = (x - dragOffsetX) + 'px'
  dragClone.style.top = (y - dragOffsetY) + 'px'
  // 高亮吸附文件夹
  document.querySelectorAll('.file-item').forEach(el => {
    el.classList.remove('drag-hover')
    const rect = el.getBoundingClientRect()
    if (props.file.type !== 'folder' && el !== dragTarget &&
      x > rect.left && x < rect.right && y > rect.top && y < rect.bottom &&
      el.__vueParentComponent?.props?.file?.type === 'folder') {
      el.classList.add('drag-hover')
    }
  })
  e.preventDefault && e.preventDefault()
}
function onDragEnd(e) {
  isDragging.value = false
  if (dragClone) {
    dragClone.remove()
    dragClone = null
  }
  document.body.classList.remove('dragging-file')
  // 检查是否拖到文件夹
  const x = e.type.startsWith('touch') ? (e.changedTouches?.[0]?.clientX ?? 0) : e.clientX
  const y = e.type.startsWith('touch') ? (e.changedTouches?.[0]?.clientY ?? 0) : e.clientY
  let moved = false
  document.querySelectorAll('.file-item').forEach(el => {
    if (el.classList.contains('drag-hover')) {
      el.classList.remove('drag-hover')
      // 目标文件夹校验
      const targetFile = el.__vueParentComponent?.props?.file
      if (!targetFile || targetFile.type !== 'folder') {
        ElMessage({ message: '只能迁移到文件夹', type: 'error' })
        moved = true
        return
      }
      if (props.file.type === 'folder') {
        ElMessage({ message: '文件夹不能迁移到其他文件夹', type: 'warning' })
        moved = true
        return
      }
      // 不能迁移到自己
      if (targetFile.id === props.file.id) {
        ElMessage({ message: '不能迁移到自身', type: 'warning' })
        moved = true
        return
      }
      // 迁移成功
      ElMessage({ message: `已迁移到"${targetFile.name}"`, type: 'success' })
      moved = true
      emit('moveFile', { file: props.file, target: targetFile })
      // TODO: 这里可补充实际迁移逻辑
    }
  })
  if (!moved) {
    ElMessage({ message: '请拖动到目标文件夹', type: 'info' })
  }
  window.removeEventListener('mousemove', onDragMove)
  window.removeEventListener('mouseup', onDragEnd)
  window.removeEventListener('touchmove', onDragMove)
  window.removeEventListener('touchend', onDragEnd)
}
function canDrag() {
  // 只有当前 movingFileId 才能拖动
  return (window.dragHint === true || isShaking.value) && props.movingFileId === props.file.id
}
function onCancelMove(e) {
  e && e.stopPropagation && e.stopPropagation();
  e && e.preventDefault && e.preventDefault();
  emit('cancelMove');
}
// 监听 movingFileId 变化，取消抖动动画
watch(() => props.movingFileId, (val) => {
  if (val !== props.file.id) {
    isShaking.value = false
  }
})
onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
  document.addEventListener('touchstart', handleClickOutside)
})
onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleClickOutside)
  document.removeEventListener('touchstart', handleClickOutside)
})
</script>
<style scoped>
.file-item {
  position: relative;
}
.card-menu-btn {
  position: absolute;
  right: 10px;
  bottom: 10px;
  z-index: 2;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  border-radius: 50%;
  transition: background 0.18s;
  outline: none;
  box-shadow: none;
  display: flex;
  align-items: center;
  justify-content: center;
}
.card-menu-btn:hover {
  background: #f2f3f5;
}
.card-menu {
  position: absolute;
  right: 0;
  min-width: 110px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 24px #0002;
  padding: 6px 0;
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 2px;
  animation: fadeInMenu 0.18s;
}
.menu-bottom {
  bottom: 36px;
}
.menu-top {
  top: -90px;
}
@keyframes fadeInMenu {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: none; }
}
.card-menu-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 18px 8px 14px;
  font-size: 15px;
  color: #333;
  background: none;
  border: none;
  cursor: pointer;
  transition: background 0.16s;
  border-radius: 8px;
}
.card-menu-item:hover {
  background: #f5f7fa;
}
.shaking {
  animation: shake 0.4s linear infinite;
}
@keyframes shake {
  0% { transform: translateX(0); }
  20% { transform: translateX(-3px); }
  40% { transform: translateX(3px); }
  60% { transform: translateX(-3px); }
  80% { transform: translateX(3px); }
  100% { transform: translateX(0); }
}
.drag-clone {
  opacity: 0.85;
  box-shadow: 0 8px 32px #409eff33, 0 2px 8px #0002;
  transform: scale(1.04);
  pointer-events: none;
  transition: box-shadow 0.18s, transform 0.18s;
}
.drag-hover {
  box-shadow: 0 0 0 3px #409eff55;
  border-radius: 14px;
  transition: box-shadow 0.18s;
}
body.dragging-file {
  cursor: grabbing !important;
  user-select: none;
}
.drag-hint-bar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  background: #409eff;
  color: #fff;
  text-align: center;
  font-size: 16px;
  padding: 8px 0 6px 0;
  z-index: 9999;
  letter-spacing: 1px;
  box-shadow: 0 2px 8px #409eff22;
  animation: fadeInMenu 0.18s;
}
.drag-origin {
  opacity: 0.15 !important;
  pointer-events: none !important;
}
.drag-hint-bar.drag-hint-success {
  background: #eafaf1;
  color: #52c41a;
  border: 1.5px solid #d3f5e1;
  border-radius: 6px;
  font-weight: 500;
  box-shadow: 0 2px 8px #52c41a11;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 420px;
  max-width: 90vw;
  left: 50%;
  transform: translateX(-50%);
  top: 18px;
  font-size: 16px;
  padding: 10px 18px 10px 12px;
}
.move-cancel-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 3;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  border-radius: 50%;
  transition: background 0.18s;
  outline: none;
  box-shadow: none;
  display: flex;
  align-items: center;
  justify-content: center;
}
.move-cancel-btn:hover {
  background: #f8d7da;
}
</style> 