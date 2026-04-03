import { createApp } from 'vue'
import PprReportViewer from '@/components/PprReportViewer.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'virtual:uno.css'

export interface RenderOptions {
  reportId: string
  chartType?: string
  pollingInterval?: number
  requestInterceptor?: (config: any) => any
  responseInterceptor?: (response: any) => any
  onLoad?: () => void
}

export function render(selector: string | HTMLElement, options: RenderOptions) {
  const container = typeof selector === 'string' ? document.querySelector(selector) : selector
  if (!container) {
    throw new Error(`[PPR] Cannot find container element: ${selector}`)
  }

  // Interceptors logic here if needed (e.g., updating axios/http config)

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
