<template>
  <div class="loading-fullscreen">
    <div class="loading-spinner"></div>
  </div>
</template>
<style scoped>
.loading-fullscreen {
  position: fixed;
  left: 0; top: 0; right: 0; bottom: 0;
  z-index: 9999;
  background: rgba(255,255,255,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
}
.loading-spinner {
  width: 48px;
  height: 48px;
  border: 5px solid #e5eaf3;
  border-top: 5px solid #409eff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style> 