<template>
  <div class="preview-page">
    <component
      :is="previewComponent"
      v-if="file"
      :file="file"
      :fileList="fileList"
      @switch="handleSwitch"
    />
    <Loading v-else />
    <CommentSection v-if="file" :fileId="file.id" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ImagePreview from './ImagePreview.vue'
import VideoPreview from './VideoPreview.vue'
import TxtPreview from './TxtPreview.vue'
import MdPreview from './MdPreview.vue'
import AudioPreview from './AudioPreview.vue'
import CommentSection from './CommentSection.vue'
import Loading from '@/components/Loading.vue'
// @ts-ignore
import { fetchFiles, flattenFiles } from '@/api/fileData'

const files = ref<any[]>([])
const rawFiles = ref<any[]>([])
onMounted(async () => {
  const raw = await fetchFiles()
  files.value = flattenFiles(raw)
  rawFiles.value = raw
})

const route = useRoute()
const type = computed(() => route.params.type)
const id = computed(() => Number(route.params.id))

const router = useRouter()

// 递归查找当前文件及其同级文件
function findFileAndSiblings(filesArr: any[], targetId: number): { file: any, siblings: any[] } | null {
  for (const item of filesArr) {
    if (item.id === targetId) {
      return { file: item, siblings: filesArr }
    }
    if (item.type === 'folder' && Array.isArray(item.children)) {
      const res = findFileAndSiblings(item.children, targetId)
      if (res) return res
    }
  }
  return null
}

const fileAndSiblings = computed(() => findFileAndSiblings(rawFiles.value, id.value))
const file = computed(() => fileAndSiblings.value?.file)
const fileList = computed(() => {
  if (!fileAndSiblings.value) return []
  // 只在同级中筛选同类型图片
  if (type.value === 'image') {
    return fileAndSiblings.value.siblings.filter((f: any) => f.type === 'image')
  }
  if (type.value === 'md') {
    return fileAndSiblings.value.siblings.filter((f: any) => f.ext === 'md')
  }
  return fileAndSiblings.value.siblings.filter((f: any) => f.type === type.value)
})
const previewComponent = computed(() => {
  // 支持type为file且ext为md的情况
  if (type.value === 'md' || (type.value === 'file' && file.value && file.value.ext === 'md')) {
    return MdPreview
  }
  switch (type.value) {
    case 'image': return ImagePreview
    case 'video': return VideoPreview
    case 'txt': return TxtPreview
    case 'audio': return AudioPreview
    default: return null
  }
})

function handleSwitch(newId: number) {
  router.replace({ name: 'preview', params: { type: type.value, id: newId } })
}
</script>

<style scoped>
.preview-page {
  padding: 10px 0px 30px 0px;
  text-align: center;
}
</style> 