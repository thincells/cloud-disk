<template>
  <BackIcon />
  <div class="video-preview">
    <template v-if="file">
      <div class="file-name">{{ file.name }}</div>
      <div ref="dplayerContainer" class="dplayer-container"></div>
    </template>
    <Loading v-else />
  </div>
</template>
<script setup>
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import Loading from '@/components/Loading.vue'
import BackIcon from '@/components/BackIcon.vue'
let DPlayer = null
const props = defineProps({ file: Object })
const dplayerContainer = ref(null)
let dp = null

async function initDPlayer() {
  if (!props.file || !props.file.url) return
  if (!DPlayer) {
    DPlayer = (await import('dplayer')).default
  }
  if (dp) {
    dp.destroy()
    dp = null
  }
  dp = new DPlayer({
    container: dplayerContainer.value,
    video: {
      url: props.file.url,
      pic: '',
      type: 'auto',
    },
    autoplay: false,
    theme: '#409eff',
    loop: false,
    lang: 'zh-cn',
    screenshot: true,
    hotkey: true,
    preload: 'auto',
    volume: 0.7,
    mutex: true,
    subtitle: {
      url: '',
      type: 'webvtt',
      fontSize: '25px',
      bottom: '10%',
      color: '#fff',
    },
    contextmenu: [
      {
        text: 'DPlayer官网',
        link: 'https://dplayer.diygod.dev/'
      }
    ]
  })
  // 关键：初始化后主动触发resize，确保首次进入自适应
  nextTick(() => {
    setTimeout(() => {
      if (dp && typeof dp.resize === 'function') {
        dp.resize()
      }
    }, 100)
  })
}

onMounted(() => {
  initDPlayer()
})

onBeforeUnmount(() => {
  if (dp) {
    dp.destroy()
    dp = null
  }
})

watch(() => props.file && props.file.url, () => {
  initDPlayer()
})
</script>
<style scoped>
.video-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
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
.dplayer-container {
  width: 100%;
  max-width: 600px;
  min-width: 320px;
  min-height: 320px;
  margin: 0 auto;
  border-radius: 12px;
  overflow: hidden;
  background: #000;
  box-sizing: border-box;
}
@media (max-width: 700px) {
  .dplayer-container {
    max-width: 98vw;
    min-width: 0;
    border-radius: 8px;
  }
}
/* DPlayer 设置菜单自定义样式 */
:deep(.dplayer-setting-item) {
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
}
:deep(.dplayer-setting-item-label) {
  flex: 1 1 auto;
  text-align: left;
  font-size: 15px;
}
:deep(.dplayer-setting-item .dplayer-setting-speed-detail),
:deep(.dplayer-setting-item .dplayer-icon),
:deep(.dplayer-setting-item .dplayer-toggle) {
  flex-shrink: 0;
  margin-left: 8px;
}
.file-error {
  color: #f56c6c;
  font-size: 16px;
  margin: 40px 0;
  text-align: center;
}
/* 只调整 DPlayer 相机按钮位置 */
:deep(.dplayer-camera-icon) {
  transform: translateY(-10px);
}
</style> 