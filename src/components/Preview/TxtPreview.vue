<template>
  <BackIcon />
  <Loading v-if="!content" />
  <pre v-else class="txt-preview">{{ content }}</pre>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import Loading from '@/components/Loading.vue'
import BackIcon from '@/components/BackIcon.vue'
const props = defineProps({ file: Object })
const content = ref('')
onMounted(async () => {
  content.value = await fetch(props.file.url).then(r => r.text())
})
</script>
<style scoped>
.txt-preview {
  max-width: 90vw;
  max-height: 60vh;
  background: #f8f8f8;
  border-radius: 8px;
  padding: 16px;
  overflow: auto;
  font-size: 15px;
  color: #222;
  white-space: pre-wrap;
  margin:auto;
}
</style> 