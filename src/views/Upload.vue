<template>
  <div class="upload-container">
    <h2>文件上传</h2>
    <div class="upload-area">
      <el-upload
        class="upload-dragger"
        drag
        action="/api/upload"
        :on-success="handleSuccess"
        :on-error="handleError"
        :before-upload="beforeUpload"
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">
          将文件拖到此处，或<em>点击上传</em>
        </div>
      </el-upload>
    </div>
  </div>
</template>

<script setup lang="ts">
import { UploadFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const handleSuccess = (response: any) => {
  ElMessage.success('上传成功')
}

const handleError = () => {
  ElMessage.error('上传失败')
}

const beforeUpload = (file: File) => {
  // 这里可以添加文件类型、大小等验证
  return true
}
</script>

<style scoped>
.upload-container {
  padding: 20px;
}

.upload-area {
  margin-top: 20px;
}

.upload-dragger {
  width: 100%;
}
</style> 