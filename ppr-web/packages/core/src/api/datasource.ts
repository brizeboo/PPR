import { http } from './http'

export interface Datasource {
  id: string
  name: string
  type: string
  jdbcUrl: string
  username?: string
  password?: string
}

export function listDatasources() {
  return http.get<Datasource[]>('/api/v1/admin/datasource/list')
}

export function saveDatasource(payload: Partial<Datasource>) {
  return http.post<Datasource>('/api/v1/admin/datasource/save', payload)
}

export function deleteDatasource(id: string) {
  return http.delete<{ success: boolean }>(`/api/v1/admin/datasource/delete/${id}`)
}

export function testDatasource(payload: { jdbcUrl: string; username?: string; password?: string }) {
  return http.post<{ success: boolean }>('/api/v1/admin/datasource/test', payload)
}

