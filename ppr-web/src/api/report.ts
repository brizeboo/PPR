import { http } from './http'
import type { ViewParam } from './view'

export interface Report {
  id: string
  viewId: string
  templateId?: string
  name: string
  chartType: string
  pollingInterval: number
  styleConfig?: string
  chartConfig?: string
}

export interface ReportMetaResponse extends Report {
  params: ViewParam[]
}

export function listReports() {
  return http.get<Report[]>('/api/v1/admin/report/list')
}

export function getReportMeta(reportId: string) {
  return http.get<ReportMetaResponse>(`/api/v1/report/meta/${reportId}`)
}

export function saveReport(report: Partial<Report>) {
  return http.post<string>('/api/v1/admin/report/upsert', report)
}

export function deleteReport(reportId: string) {
  return http.delete(`/api/v1/admin/report/${reportId}`)
}

export function getReportData(reportId: string, params?: Record<string, any>) {
  return http.post<any>(`/api/v1/report/data/${reportId}`, params)
}

