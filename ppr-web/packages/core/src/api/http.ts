import axios from 'axios'
import { ElMessage } from 'element-plus'

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
})

// 添加请求拦截器，携带可能存在的 token (sa-token 默认使用 satoken header)
http.interceptors.request.use((config) => {
  const token = localStorage.getItem('satoken')
  if (token) {
    config.headers['satoken'] = token
  }
  return config
})

// 添加响应拦截器，处理未登录或 token 失效 (401)
http.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // 触发全局未登录事件，由应用层决定弹窗
      window.dispatchEvent(new CustomEvent('ppr-unauthorized'))
    }
    return Promise.reject(error)
  }
)

