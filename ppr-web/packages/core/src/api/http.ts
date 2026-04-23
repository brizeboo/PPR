import axios from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'

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

/**
 * 是否正在显示网络错误弹窗，防止并发请求时弹出多个模态框
 */
let isNetworkErrorShowing = false

// 添加响应拦截器，处理未登录或 token 失效 (401 及 ADMIN_KEY_INVALID)
http.interceptors.response.use(
  (response) => {
    // 处理后端返回 200，但标识管理员密钥失效的情况
    if (response.data && response.data.success === false && response.data.code === 'ADMIN_KEY_INVALID') {
      // 触发全局未登录事件，弹出管理员密钥输入框
      window.dispatchEvent(new CustomEvent('ppr-unauthorized'))
      return Promise.reject(new Error(response.data.message || '管理员密钥验证失败'))
    }
    return response;
  },
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        // 触发全局未登录事件，由应用层决定弹窗
        window.dispatchEvent(new CustomEvent('ppr-unauthorized'))
      } else if (error.response.status === 502 || error.response.status === 504 || error.response.status === 503) {
        // 开发环境下 Vite 代理连不上后台会返回 502/504
        if (!isNetworkErrorShowing) {
          isNetworkErrorShowing = true
          ElMessageBox.alert('无法连接后台接口，请检查网络或后台服务状态。', '系统提示', {
            confirmButtonText: '确定',
            type: 'error',
          }).finally(() => {
            isNetworkErrorShowing = false
          })
        }
      }
    } else {
      // 无法连接后台接口 (如网断了、生产环境无代理时后台服务没起等)
      if (!isNetworkErrorShowing) {
        isNetworkErrorShowing = true
        ElMessageBox.alert('无法连接后台接口，请检查网络或后台服务状态。', '系统提示', {
          confirmButtonText: '确定',
          type: 'error',
        }).finally(() => {
          isNetworkErrorShowing = false
        })
      }
    }
    return Promise.reject(error)
  }
)

