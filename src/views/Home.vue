<template>
  <div class="home-container">
    <header class="header">
      <div class="header-content">
        <div class="nav-path">
          <span v-for="(item, idx) in breadcrumb" :key="item.path">
            <span v-if="idx !== 0" class="separator">/</span>
            <a href="#" @click.prevent="goToPath(idx)">{{ item.name }}</a>
          </span>
        </div>
        <div class="header-actions">
          <div class="search-wrapper">
            <i class="search-icon"></i>
            <input v-model="search" class="search-input" placeholder="搜索文件..." />
          </div>
          <button class="action-btn" @click="goUpload">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 16V4m0 0l-4 4m4-4l4 4M4 20h16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </header>

    <main class="content">
      <Loading v-if="files.length === 0" />
      <div class="file-grid" v-else>
        <FileCard
          v-for="item in filteredFiles"
          :key="item.id"
          :file="item"
          :onDblClick="enter"
          @move="() => startMove(item.id)"
          @moveFile="handleMoveFile"
          :movingFileId="movingFileId"
          @cancelMove="cancelMove"
        />
      </div>
    </main>

    <button class="add-button" @click="selectFiles">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 5V19M5 12H19" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>

    <input
      ref="fileInput"
      type="file"
      multiple
      class="hidden-input"
      @change="handleFiles"
    />
    <TabBar />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import TabBar from '@/components/TabBar.vue'
import FileCard from '@/components/FileCard.vue'
import Loading from '@/components/Loading.vue'
import { ElMessage } from 'element-plus'
import '@/styles/Home.scss'
// @ts-ignore
import { fetchFiles, moveFile } from '@/api/fileData'
import { ref as vueRef } from 'vue'
import { onMounted as vueOnMounted } from 'vue'

const router = useRouter()
const search = ref('')
const breadcrumb = ref([{ name: '全部文件', path: '/' }])
const currentPath = ref('/')

const files = ref<any[]>([])
const stack = ref<any[][]>([])
const dragHint = vueRef(false)
const movingFileId = ref<number|null>(null)

onMounted(async () => {
  files.value = await fetchFiles()
  stack.value = [files.value]
})

const filteredFiles = computed(() => {
  const list = stack.value[stack.value.length - 1] || []
  if (!search.value) return list
  return list.filter(item => item.name.includes(search.value))
})

function enter(item: any) {
  if (item.type === 'folder') {
    stack.value.push(item.children || [])
    breadcrumb.value.push({ name: item.name, path: '' })
  }
}
function goToPath(idx: number) {
  if (idx === breadcrumb.value.length - 1) return
  stack.value = stack.value.slice(0, idx + 1)
  breadcrumb.value = breadcrumb.value.slice(0, idx + 1)
}
function goBack() {
  if (stack.value.length > 1) {
    stack.value.pop()
    breadcrumb.value.pop()
  }
}
function goUpload() {
  router.push('/upload')
}
const fileInput = ref<HTMLInputElement | null>(null)
function selectFiles() {
  fileInput.value?.click()
}
function handleFiles(e: Event) {
  const files = (e.target as HTMLInputElement).files
  if (files && files.length) {
    const fileList = Array.from(files).map(file => ({
      name: file.name,
      size: file.size,
      type: file.type
    }))
    router.push({ path: '/upload', state: { files: fileList } })
  }
}
function showDragHint() {
  (window as any).dragHint = true
  ElMessage({
    message: '拖动到文件夹夹以迁移',
    duration: 2000,
    type: 'success'
  })
}
function closeDragBar() {
  (window as any).dragHint = false
}

function startMove(id: number) {
  movingFileId.value = id
  showDragHint()
}

async function handleMoveFile({ file, target }: { file: any, target: any }) {
  const res = await moveFile({ fileId: file.id, targetFolderId: target.id })
  if (res.code === 0) {
    files.value = await fetchFiles()
    stack.value = [files.value]
    let cur = files.value
    for (let i = 1; i < breadcrumb.value.length; i++) {
      const name = breadcrumb.value[i].name
      const next = cur.find((f: any) => f.name === name && f.type === 'folder')
      if (next && Array.isArray(next.children)) {
        stack.value.push(next.children)
        cur = next.children
      } else {
        break
      }
    }
    movingFileId.value = null // 迁移完成后重置
  }
}

function cancelMove() {
  movingFileId.value = null;
  (window as any).dragHint = false;
}
</script>