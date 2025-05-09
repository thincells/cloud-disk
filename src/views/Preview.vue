<template>
  <div style="position:relative;">
    <BackButton />
    <Loading v-if="!file.value" />
    <component
      :is="previewComponent"
      :file="file.value"
      :fileList="fileList.value"
      @switch="handleSwitch"
    />
    <CommentSection v-if="file.value" :fileId="file.value.id" />
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ImagePreview from '@/components/Preview/ImagePreview.vue'
import VideoPreview from '@/components/Preview/VideoPreview.vue'
import TxtPreview from '@/components/Preview/TxtPreview.vue'
import MdPreview from '@/components/Preview/MdPreview.vue'
import AudioPreview from '@/components/Preview/AudioPreview.vue'
import CommentSection from '@/components/Preview/CommentSection.vue'
import BackButton from '@/components/BackButton.vue'
import Loading from '@/components/Loading.vue'
// @ts-ignore
import { fetchFiles, flattenFiles } from '@/api/fileData'
const route = useRoute()
const router = useRouter()
const type = computed(() => route.params.type)
const id = computed(() => Number(route.params.id))
const fileList = computed(() => {
  if (type.value === 'md') {
    return files.value.filter(f => f.ext === 'md')
  }
  return files.value.filter(f => f.type === type.value)
})
const file = computed(() => fileList.value.find(f => Number(f.id) === id.value))
const previewComponent = computed(() => {
  switch (type.value) {
    case 'image': return ImagePreview
    case 'video': return VideoPreview
    case 'txt': return TxtPreview
    case 'md': return MdPreview
    case 'audio': return AudioPreview
    case 'excel':
      if (file.value && file.value.url) window.open(file.value.url, '_blank')
      router.back()
      return null
    default: return null
  }
})
function handleSwitch(newId) {
  router.replace({ name: 'preview', params: { type: type.value, id: newId } })
}
const files = ref([])
onMounted(async () => {
  const raw = await fetchFiles()
  files.value = flattenFiles(raw)
})
</script> 