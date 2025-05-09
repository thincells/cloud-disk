<template>
  <button class="back-icon-btn" @click="goBack" aria-label="返回上一页">
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <path d="M18 6L10 14L18 22" stroke="#222" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  </button>
</template>
<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
function goBack() {
  router.back()
}
</script>
<style scoped>
.back-icon-btn {
  position: absolute;
  left: 12px;
  /* top: 16px; */
  z-index: 20;
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  border-radius: 50%;
  transition: background 0.18s;
  outline: none;
  box-shadow: none;
  display: flex;
  align-items: center;
  justify-content: center;
}
.back-icon-btn:hover {
  background: #f2f3f5;
}
svg {
  display: block;
}
</style> 