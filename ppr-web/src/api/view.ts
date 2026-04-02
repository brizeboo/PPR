import { http } from './http'

export interface View {
  id: string
  datasourceId: string
  name: string
  sqlContent: string
}

export interface ViewParam {
  id?: string
  paramName: string
  paramType: string
  dictCode?: string
  required?: boolean
}

export interface ViewParamEntity {
  id: string
  viewId: string
  paramName: string
  paramType: string
  dictCode?: string
  isRequired?: boolean
}

export interface ViewExecutionResult {
  columns: string[]
  rows: Record<string, unknown>[]
}

export function listViews() {
  return http.get<View[]>('/api/v1/admin/view/list')
}

export function getView(id: string) {
  return http.get<{ view: View; params: ViewParamEntity[] }>(`/api/v1/admin/view/get/${id}`)
}

export function saveView(payload: Partial<View> & { params?: ViewParam[] }) {
  return http.post<View>('/api/v1/admin/view/save', payload)
}

export function deleteView(id: string) {
  return http.delete<{ success: boolean }>(`/api/v1/admin/view/delete/${id}`)
}

export function previewView(payload: {
  viewId?: string
  datasourceId?: string
  sqlContent?: string
  paramDefs?: ViewParam[]
  params?: Record<string, unknown>
  translateDict?: boolean
}) {
  return http.post<ViewExecutionResult>('/api/v1/admin/view/preview', payload)
}
