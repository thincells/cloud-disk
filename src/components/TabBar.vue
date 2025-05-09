<template>
  <nav class="tab-bar">
    <div 
      v-for="item in tabs" 
      :key="item.path"
      :class="['tab-item', { active: route.path === item.path }]" 
      @click="go(item.path)"
    >
      <div class="tab-content">
        <svg v-if="item.path === '/home'" class="tab-icon" viewBox="0 0 24 24" fill="none">
          <path d="M3 12l9-9 9 9M5 10v10a1 1 0 001 1h3m-4-11h16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        </svg>
        <svg v-else-if="item.path === '/upload'" class="tab-icon" viewBox="0 0 24 24" fill="none">
          <path d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        </svg>
        <svg v-else class="tab-icon" viewBox="0 0 24 24" fill="none">
          <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        </svg>
        <span class="tab-label">{{ item.label }}</span>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const tabs = [
  { path: '/home', label: '首页' },
  { path: '/upload', label: '分享' },
  { path: '/mine', label: '我的' }
]

function go(path: string) {
  router.push(path)
}
</script>

<style lang="scss" scoped>
.tab-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: 64px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  display: flex;
  justify-content: space-around;
  align-items: center;
  box-shadow: 0 -1px 0 rgba(0, 0, 0, 0.05);
  z-index: 100;
  padding-bottom: env(safe-area-inset-bottom);
}

.tab-item {
  flex: 1;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 3px;
    background: #409eff;
    border-radius: 3px 3px 0 0;
    transition: width 0.3s ease;
  }
  
  &:hover {
    .tab-icon {
      transform: scale(1.1);
    }
  }
  
  &.active {
    &::after {
      width: 24px;
    }
    
    .tab-icon {
      color: #409eff;
      transform: scale(1.1) translateY(-2px);
    }
    
    .tab-label {
      color: #409eff;
      transform: translateY(-2px);
    }
  }
}

.tab-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.tab-icon {
  width: 24px;
  height: 24px;
  color: #666;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &.active {
    color: #409eff;
  }
}

.tab-label {
  font-size: 12px;
  color: #666;
  transition: all 0.3s ease;
}

@media (max-width: 768px) {
  .tab-bar {
    height: 56px;
  }
  
  .tab-icon {
    width: 22px;
    height: 22px;
  }
  
  .tab-label {
    font-size: 11px;
  }
}
</style> 