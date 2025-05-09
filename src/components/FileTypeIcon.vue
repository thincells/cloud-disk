<template>
  <div v-if="file.type === 'image'" class="file-img-preview">
    <img :src="file.url" alt="img" class="img-preview" />
  </div>
  <div v-else-if="file.type === 'video'" class="file-video-preview">
    <template v-if="file.url">
      <video :src="file.url" class="video-preview" preload="metadata"></video>
      <div class="video-icon-bg video-icon-abs">
        <svg class="video-play-icon" viewBox="0 0 48 48">
          <circle cx="24" cy="24" r="24" fill="#e3f0ff"/>
          <polygon points="20,16 36,24 20,32" fill="#409eff"/>
        </svg>
      </div>
    </template>
    <template v-else>
      <div class="video-icon-bg">
        <svg class="video-play-icon" viewBox="0 0 48 48">
          <circle cx="24" cy="24" r="24" fill="#e3f0ff"/>
          <polygon points="20,16 36,24 20,32" fill="#409eff"/>
        </svg>
      </div>
    </template>
  </div>
  <div v-else class="file-icon">
    <svg v-if="file.ext === 'mp3' || file.ext === 'wav'" class="icon-svg audio" viewBox="0 0 32 32">
      <circle cx="16" cy="16" r="16" fill="#e6f7ff"/>
      <path d="M10 24V8h4l8-4v24l-8-4h-4z" fill="#409eff"/>
      <circle cx="24" cy="24" r="2" fill="#91d5ff"/>
    </svg>
    <svg v-else-if="file.ext === 'xlsx' || file.ext === 'xls'" class="icon-svg excel" viewBox="0 0 32 32">
      <rect width="32" height="32" rx="8" fill="#e6fffb"/>
      <text x="16" y="21" text-anchor="middle" fill="#13c2c2" font-size="12" font-weight="bold">XLSX</text>
    </svg>
    <svg v-else-if="file.ext === 'pdf'" class="icon-svg pdf" viewBox="0 0 32 32">
      <rect width="32" height="32" rx="8" fill="#fff1f0"/>
      <text x="16" y="21" text-anchor="middle" fill="#f5222d" font-size="12" font-weight="bold">PDF</text>
    </svg>
    <svg v-else-if="file.ext === 'md'" class="icon-svg md" viewBox="0 0 32 32">
      <rect width="32" height="32" rx="8" fill="#f0f5ff"/>
      <text x="16" y="21" text-anchor="middle" fill="#2f54eb" font-size="12" font-weight="bold">MD</text>
    </svg>
    <svg v-else-if="file.ext === 'txt'" class="icon-svg txt" viewBox="0 0 32 32">
      <rect width="32" height="32" rx="8" fill="#fafafa"/>
      <text x="16" y="21" text-anchor="middle" fill="#8c8c8c" font-size="12" font-weight="bold">TXT</text>
    </svg>
    <svg v-else-if="file.type === 'folder'" class="icon-svg folder" viewBox="0 0 32 32">
      <rect width="32" height="32" rx="8" fill="#fffbe6"/>
      <path d="M10 18h12v6H10z" fill="#ffe58f"/>
      <path d="M10 8h6l1.5 3H22v4H10z" fill="#ffd666"/>
    </svg>
    <svg v-else class="icon-svg other" viewBox="0 0 32 32">
      <rect width="32" height="32" rx="8" fill="#f5f7fa"/>
      <text x="16" y="21" text-anchor="middle" fill="#409eff" font-size="12">{{ file.ext }}</text>
    </svg>
  </div>
</template>
<script setup>
defineProps({ file: Object })
</script> 