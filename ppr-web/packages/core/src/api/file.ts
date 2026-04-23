import { http } from './http'

export interface DirTreeNode {
  name: string
  path: string
  children: DirTreeNode[]
}

export interface FileInfo {
  name: string
  size: number
  lastModified: number
  path: string
}

export interface FileListResponse {
  records: FileInfo[]
  total: number
  page: number
  size: number
}

// Directory API
export const getDirTree = () => {
  return http.get<DirTreeNode>('/api/v1/admin/file/dir/tree')
}

export const createDir = (path: string, name: string) => {
  return http.post<{ success: boolean }>(`/api/v1/admin/file/dir/create?path=${encodeURIComponent(path)}&name=${encodeURIComponent(name)}`)
}

export const renameDir = (path: string, newName: string) => {
  return http.put<{ success: boolean }>(`/api/v1/admin/file/dir/rename?path=${encodeURIComponent(path)}&newName=${encodeURIComponent(newName)}`)
}

export const deleteDir = (path: string) => {
  return http.delete<{ success: boolean }>(`/api/v1/admin/file/dir/delete?path=${encodeURIComponent(path)}`)
}

// File API
export const listFiles = (path: string, page: number = 1, size: number = 10) => {
  return http.get<FileListResponse>(`/api/v1/admin/file/list?path=${encodeURIComponent(path)}&page=${page}&size=${size}`)
}

export const uploadFile = (file: File, path: string) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('path', path)
  return http.post<{ success: boolean }>('/api/v1/admin/file/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export const downloadFileUrl = (path: string) => {
  return `${http.defaults.baseURL || ''}/api/v1/admin/file/download?path=${encodeURIComponent(path)}`
}

export const deleteFile = (path: string) => {
  return http.delete<{ success: boolean }>(`/api/v1/admin/file/delete?path=${encodeURIComponent(path)}`)
}

export const getFileAccessUrl = (path: string) => {
  const baseUrl = http.defaults.baseURL?.replace('/admin', '') || '/api/v1'
  let p = path;
  if(p.startsWith('/')) {
    p = p.substring(1);
  }
  const isAbsolute = /^https?:\/\//i.test(baseUrl);
  const prefix = isAbsolute ? baseUrl : `${window.location.origin}${baseUrl}`;
  return `${prefix}/file/access/${p}`
}
