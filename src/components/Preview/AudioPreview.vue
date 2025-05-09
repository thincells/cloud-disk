<template>
  <BackIcon />
  <div class="audio-preview">
    <audio :src="file.url" controls style="width:100%"></audio>
  </div>
</template>
<script setup>
import BackIcon from '@/components/BackIcon.vue'

defineProps({ file: Object })
</script> 