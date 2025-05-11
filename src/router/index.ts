import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

// 路由配置
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'login',
    component: () => import('../views/Login.vue'),
    meta: {
      title: '登录',
      requiresAuth: false
    }
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('../views/Home.vue'),
    meta: {
      title: '首页',
      requiresAuth: true
    }
  },
  {
    path: '/preview/:type/:id',
    name: 'preview',
    component: () => import('../components/Preview/Preview.vue'),
    meta: {
      title: '文件预览',
      requiresAuth: true
    }
  },
  {
    path: '/upload',
    name: 'upload',
    component: () => import('../views/Upload.vue'),
    meta: {
      title: '上传',
      requiresAuth: true
    }
  }
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// 全局前置守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = `${to.meta.title || 'Vue3 Vite App'}`

  // 检查是否需要登录
  if (to.meta.requiresAuth) {
    // 这里可以添加登录状态检查
    // const isAuthenticated = checkAuth()
    // if (!isAuthenticated) {
    //   next({ name: 'login' })
    //   return
    // }
  }

  next()
})

// 全局后置守卫
router.afterEach((to, from) => {
  // 这里可以添加页面访问统计等逻辑
})

export default router 