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

/**
 * 保存数据源信息，包含新增和修改逻辑
 * 
 * @param payload 数据源请求载荷
 * @returns 请求结果，包含新增或更新后的数据源对象
 */
export function saveDatasource(payload: Partial<Datasource>) {
  if (payload.id) {
    return http.post<Datasource>('/api/v1/admin/datasource/update', payload)
  } else {
    return http.post<Datasource>('/api/v1/admin/datasource/add', payload)
  }
}

export function deleteDatasource(id: string) {
  return http.delete<{ success: boolean }>(`/api/v1/admin/datasource/delete/${id}`)
}

export function testDatasource(payload: { jdbcUrl: string; username?: string; password?: string }) {
  return http.post<{ success: boolean }>('/api/v1/admin/datasource/test', payload)
}

