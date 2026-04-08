<template>
  <div class="file-container">
    <div class="file-sidebar td-sidebar">
      <div class="sidebar-header">
        <span>目录结构</span>
      </div>
      <el-tree
        :data="treeData"
        :props="defaultProps"
        node-key="path"
        :current-node-key="currentPath"
        @node-click="handleNodeClick"
        highlight-current
        default-expand-all
      />
    </div>

    <div class="file-content td-panel">
      <div class="content-header">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item v-for="(item, index) in breadcrumbs" :key="index">
            {{ item }}
          </el-breadcrumb-item>
        </el-breadcrumb>

        <div class="actions">
          <el-button size="small" @click="openCreateDir">新建目录</el-button>
          <el-button size="small" @click="openRenameDir" :disabled="currentPath === '/'">重命名目录</el-button>
          <el-popconfirm title="确认删除该目录？" @confirm="onDeleteDir">
            <template #reference>
              <el-button size="small" type="danger" :disabled="currentPath === '/'">删除目录</el-button>
            </template>
          </el-popconfirm>
          <el-upload
            class="upload-btn"
            action=""
            :show-file-list="false"
            :http-request="customUpload"
          >
            <el-button size="small" type="primary">文件上传</el-button>
          </el-upload>
        </div>
      </div>

      <el-table :data="fileList" border height="calc(100vh - 220px)">
        <el-table-column prop="name" label="文件名" min-width="200" />
        <el-table-column prop="size" label="大小" width="120">
          <template #default="{ row }">
            {{ formatSize(row.size) }}
          </template>
        </el-table-column>
        <el-table-column prop="lastModified" label="修改时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.lastModified) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="{ row }">
            <el-button size="small" @click="onDownload(row)">下载</el-button>
            <el-button size="small" @click="onCopyLink(row)">复制直链</el-button>
            <el-popconfirm title="确认删除该文件？" @confirm="onDeleteFile(row.path)">
              <template #reference>
                <el-button size="small" type="danger">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          v-model:current-page="page"
          v-model:page-size="size"
          :total="total"
          layout="total, prev, pager, next, sizes"
          @size-change="loadFiles"
          @current-change="loadFiles"
        />
      </div>
    </div>

    <!-- 目录弹窗 -->
    <el-dialog v-model="dirDialogVisible" :title="dirDialogTitle" width="400px" destroy-on-close>
      <el-form ref="dirFormRef" :model="dirForm" :rules="dirRules" label-width="80px" @submit.prevent="onDirSave">
        <el-form-item label="目录名称" prop="name">
          <el-input v-model="dirForm.name" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dirDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="onDirSave">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import {
  getDirTree,
  createDir,
  renameDir,
  deleteDir,
  listFiles,
  uploadFile,
  downloadFileUrl,
  deleteFile,
  getFileAccessUrl,
  type DirTreeNode,
  type FileInfo
} from '@ppr/core'

const treeData = ref<DirTreeNode[]>([])
const defaultProps = {
  children: 'children',
  label: 'name'
}

const currentPath = ref('/')
const fileList = ref<FileInfo[]>([])
const page = ref(1)
const size = ref(10)
const total = ref(0)

const breadcrumbs = computed(() => {
  if (currentPath.value === '/') return ['/']
  return ['/'].concat(currentPath.value.split('/').filter(Boolean))
})

const loadTree = async () => {
  const { data } = await getDirTree()
  treeData.value = [data]
}

const loadFiles = async () => {
  const { data } = await listFiles(currentPath.value, page.value, size.value)
  fileList.value = data.records
  total.value = data.total
}

const handleNodeClick = (node: DirTreeNode) => {
  currentPath.value = node.path
  page.value = 1
  loadFiles()
}

// 目录操作
const dirDialogVisible = ref(false)
const dirDialogType = ref<'create' | 'rename'>('create')
const dirDialogTitle = computed(() => dirDialogType.value === 'create' ? '新建目录' : '重命名目录')
const dirFormRef = ref<FormInstance>()
const dirForm = reactive({ name: '' })
const dirRules: FormRules = {
  name: [{ required: true, message: '请输入目录名称', trigger: 'blur' }]
}

const openCreateDir = () => {
  dirDialogType.value = 'create'
  dirForm.name = ''
  dirDialogVisible.value = true
}

const openRenameDir = () => {
  if (currentPath.value === '/') return
  dirDialogType.value = 'rename'
  const parts = currentPath.value.split('/')
  dirForm.name = parts[parts.length - 1]
  dirDialogVisible.value = true
}

const onDirSave = async () => {
  const valid = await dirFormRef.value?.validate().catch(() => false)
  if (!valid) return
  
  if (dirDialogType.value === 'create') {
    await createDir(currentPath.value, dirForm.name)
    ElMessage.success('新建目录成功')
  } else {
    await renameDir(currentPath.value, dirForm.name)
    ElMessage.success('重命名目录成功')
    // 返回上一级
    const parts = currentPath.value.split('/')
    parts.pop()
    currentPath.value = parts.join('/') || '/'
  }
  dirDialogVisible.value = false
  await loadTree()
  await loadFiles()
}

const onDeleteDir = async () => {
  if (currentPath.value === '/') return
  try {
    await deleteDir(currentPath.value)
    ElMessage.success('删除目录成功')
    const parts = currentPath.value.split('/')
    parts.pop()
    currentPath.value = parts.join('/') || '/'
    await loadTree()
    await loadFiles()
  } catch (e: any) {
    ElMessage.error(e.response?.data?.message || '删除目录失败，可能目录不为空')
  }
}

// 文件操作
const customUpload = async (options: any) => {
  try {
    await uploadFile(options.file, currentPath.value)
    ElMessage.success('上传成功')
    loadFiles()
  } catch (e) {
    ElMessage.error('上传失败')
  }
}

const onDownload = (row: FileInfo) => {
  window.open(downloadFileUrl(row.path))
}

const onCopyLink = async (row: FileInfo) => {
  const url = getFileAccessUrl(row.path)
  try {
    await navigator.clipboard.writeText(url)
    ElMessage.success('直链已复制到剪贴板')
  } catch (e) {
    ElMessage.error('复制失败，请手动复制: ' + url)
  }
}

const onDeleteFile = async (path: string) => {
  await deleteFile(path)
  ElMessage.success('删除文件成功')
  loadFiles()
}

// Utils
const formatSize = (size: number) => {
  if (size < 1024) return size + ' B'
  if (size < 1024 * 1024) return (size / 1024).toFixed(2) + ' KB'
  return (size / (1024 * 1024)).toFixed(2) + ' MB'
}

const formatDate = (ms: number) => {
  const date = new Date(ms)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`
}

onMounted(() => {
  loadTree()
  loadFiles()
})
</script>

<style scoped>
.file-container {
  display: flex;
  gap: 16px;
  height: 100%;
}

.file-sidebar {
  width: 260px;
  background: #fff;
  border-radius: 8px;
  border: 1px solid var(--el-border-color-light);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.sidebar-header {
  padding: 16px;
  font-weight: 600;
  border-bottom: 1px solid var(--el-border-color-light);
}

.file-sidebar .el-tree {
  flex: 1;
  overflow: auto;
  padding: 8px;
}

.file-content {
  flex: 1;
  background: #fff;
  border-radius: 8px;
  border: 1px solid var(--el-border-color-light);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.content-header {
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--el-border-color-light);
}

.actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.upload-btn {
  display: inline-block;
}

.file-content .el-table {
  flex: 1;
  border-left: none;
  border-right: none;
}

.pagination {
  padding: 12px 16px;
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid var(--el-border-color-light);
}
</style>
