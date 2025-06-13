import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { createApp, ComponentPublicInstance } from 'vue'

import App from './App.vue'
import router from './router'
import './style.css'

// 创建应用实例
const app = createApp(App)

// 全局错误处理
app.config.errorHandler = (
  err: unknown,
  instance: ComponentPublicInstance | null,
  info: string
) => {
  console.error('全局错误:', err)
  console.error('错误组件:', instance)
  console.error('错误信息:', info)
  // 这里可以添加错误上报逻辑
}

// 全局配置
app.config.globalProperties.$appConfig = {
  title: 'Vue3 Vite App',
  version: '1.0.0',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || '/api'
}

// 注册路由
app.use(router)
// 注册 Element Plus
app.use(ElementPlus)

// 挂载应用
app.mount('#app')
