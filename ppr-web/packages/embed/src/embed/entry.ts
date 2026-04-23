import { createApp } from 'vue'
import { PprReportViewer } from '@ppr/components'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { http } from '@ppr/core'

export interface RenderOptions {
  reportId: string
  chartType?: string
  pollingInterval?: number
  token?: string
  requestInterceptor?: (config: any) => any
  responseInterceptor?: (response: any) => any
  onLoad?: () => void
}

export function render(selector: string | HTMLElement, options: RenderOptions) {
  const container = typeof selector === 'string' ? document.querySelector(selector) : selector
  if (!container) {
    throw new Error(`[PPR] Cannot find container element: ${selector}`)
  }

  if (options.requestInterceptor) {
    http.interceptors.request.use(options.requestInterceptor)
  } else if (options.token) {
    http.interceptors.request.use((config) => {
      config.headers['Authorization'] = `Bearer ${options.token}`
      return config
    })
  }

  if (options.responseInterceptor) {
    http.interceptors.response.use(options.responseInterceptor)
  }

  const app = createApp(PprReportViewer, {
    reportId: options.reportId,
    // Add more props if necessary based on options
  })

  app.use(ElementPlus)
  app.mount(container)

  if (options.onLoad) {
    options.onLoad()
  }

  return {
    unmount: () => app.unmount()
  }
}
