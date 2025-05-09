import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'

const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 8000
})

// 请求拦截器：自动携带 token
request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers = config.headers || {}
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器：自动解包、全局错误处理
request.interceptors.response.use(
  (response: AxiosResponse) => {
    // 假设后端返回 { code, msg, data }
    const res = response.data
    if (res.code !== 0) {
      // 这里可以用全局弹窗/Toast
      console.error(res.msg || '请求失败')
      return Promise.reject(res)
    }
    return res.data
  },
  (error) => {
    // 这里可以用全局弹窗/Toast
    console.error(error?.response?.data?.msg || error.message || '网络错误')
    return Promise.reject(error)
  }
)

// 常用方法封装
export const get = <T = any>(url: string, params?: any, config?: AxiosRequestConfig) =>
  request.get<T>(url, { params, ...config })

export const post = <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
  request.post<T>(url, data, config)

export const put = <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
  request.put<T>(url, data, config)

export const del = <T = any>(url: string, config?: AxiosRequestConfig) =>
  request.delete<T>(url, config)

export default request
