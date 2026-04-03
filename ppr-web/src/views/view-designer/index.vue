<!-- 视图设计器组件 -->
<template>
  <div class="vd-container">
    <div class="vd-sidebar">
      <div class="vd-header">
        <div class="vd-title">视图列表</div>
        <el-button size="small" type="primary" @click="newView">新建</el-button>
      </div>
      <el-input v-model="keyword" placeholder="搜索" size="small" style="margin-bottom: 8px;" clearable />
      <el-menu :default-active="selectedViewId" @select="onSelectView" style="border: 0;">
        <el-menu-item v-for="v in filteredViews" :key="v.id" :index="v.id">
          <div class="vd-flex-col">
            <span class="vd-truncate">{{ v.name }}</span>
            <span class="vd-subtext">{{ v.id }}</span>
          </div>
        </el-menu-item>
      </el-menu>
    </div>

    <div class="vd-main">
      <div class="vd-panel">
        <div class="vd-toolbar">
          <el-input v-model="viewForm.name" placeholder="视图名称" style="flex: 1;" />
          <el-select v-model="viewForm.datasourceId" placeholder="选择数据源" style="width: 224px;">
            <el-option v-for="ds in datasources" :key="ds.id" :label="ds.name" :value="ds.id" />
          </el-select>
          <el-button type="primary" @click="save">保存</el-button>
          <el-button @click="runPreview">运行</el-button>
        </div>

        <Codemirror v-model="viewForm.sqlContent" :extensions="editorExtensions" :style="{ height: '320px' }" />
      </div>

      <div class="vd-panel-flex">
        <div class="vd-header">
          <div class="vd-title">参数配置</div>
          <el-button size="small" @click="addParam">新增参数</el-button>
        </div>

        <el-table :data="paramDefs" border size="small">
          <el-table-column label="参数名" width="150">
            <template #default="{ row }">
              <el-input v-model="row.paramName" placeholder="如: id" />
            </template>
          </el-table-column>
          <el-table-column label="类型" width="140">
            <template #default="{ row }">
              <el-select v-model="row.paramType" style="width: 100%;">
                <el-option label="String" value="String" />
                <el-option label="Number" value="Number" />
                <el-option label="Date" value="Date" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="必填" width="80" align="center">
            <template #default="{ row }">
              <el-switch v-model="row.required" />
            </template>
          </el-table-column>
          <el-table-column label="字典" width="160">
            <template #default="{ row }">
              <el-input v-model="row.dictCode" placeholder="可选" />
            </template>
          </el-table-column>
          <el-table-column label="测试值" min-width="160">
            <template #default="{ row }">
              <el-input v-model="row.testValue" placeholder="运行时使用" />
            </template>
          </el-table-column>
          <el-table-column label="操作" width="90" fixed="right" align="center">
            <template #default="{ $index }">
              <el-button size="small" type="danger" @click="removeParam($index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <div class="vd-preview">
      <div class="vd-header">
        <div class="vd-title">预览结果</div>
        <el-tag v-if="preview.columns.length" type="success" size="small">{{ preview.rows.length }} 行</el-tag>
      </div>
      <el-table v-if="preview.columns.length" :data="preview.rows" border size="small" height="calc(100vh - 190px)">
        <el-table-column v-for="c in preview.columns" :key="c" :prop="c" :label="c" min-width="120" show-overflow-tooltip />
      </el-table>
      <el-empty v-else description="暂无数据" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import Codemirror from 'vue-codemirror6'
import { sql } from '@codemirror/lang-sql'
import { oneDark } from '@codemirror/theme-one-dark'

import { listDatasources, type Datasource } from '@/api/datasource'
import { getView, listViews, previewView, saveView, type View, type ViewExecutionResult, type ViewParam } from '@/api/view'

// 视图参数草稿类型定义
type ViewParamDraft = ViewParam & { testValue?: string }

// 数据源列表
const datasources = ref<Datasource[]>([])
// 视图列表
const views = ref<View[]>([])
// 搜索关键字
const keyword = ref('')
// 选中的视图ID
const selectedViewId = ref('')

// 视图表单数据
const viewForm = reactive<Partial<View>>({
  id: '',
  datasourceId: '',
  name: '',
  sqlContent: 'select 1 as value',
})

// 参数定义列表
const paramDefs = ref<ViewParamDraft[]>([])

// 预览结果数据
const preview = reactive<ViewExecutionResult>({
  columns: [],
  rows: [],
})

// CodeMirror 编辑器扩展
const editorExtensions = [sql(), oneDark]

// 过滤后的视图列表
const filteredViews = computed(() => {
  const k = keyword.value.trim().toLowerCase()
  if (!k) return views.value
  return views.value.filter((v) => v.name.toLowerCase().includes(k) || v.id.toLowerCase().includes(k))
})

/**
 * 构建参数映射对象
 */
function buildParamsMap() {
  const params: Record<string, unknown> = {}
  for (const p of paramDefs.value) {
    if (!p.paramName) continue
    if (p.testValue !== undefined && String(p.testValue).length > 0) {
      params[p.paramName] = p.testValue
    }
  }
  return params
}

/**
 * 重新加载数据源列表
 */
async function reloadDatasources() {
  const { data } = await listDatasources()
  datasources.value = data
  if (!viewForm.datasourceId && data.length) {
    viewForm.datasourceId = data[0].id
  }
}

/**
 * 重新加载视图列表
 */
async function reloadViews() {
  const { data } = await listViews()
  views.value = data
}

/**
 * 新建视图
 */
function newView() {
  selectedViewId.value = ''
  viewForm.id = ''
  viewForm.name = ''
  viewForm.sqlContent = 'select 1 as value'
  if (datasources.value.length) viewForm.datasourceId = datasources.value[0].id
  paramDefs.value = []
  preview.columns = []
  preview.rows = []
}

/**
 * 新增参数定义
 */
function addParam() {
  paramDefs.value.push({ paramName: '', paramType: 'String', required: false, dictCode: '', testValue: '' })
}

/**
 * 移除参数定义
 * @param index 参数索引
 */
function removeParam(index: number) {
  paramDefs.value.splice(index, 1)
}

/**
 * 选中视图处理
 * @param id 视图ID
 */
async function onSelectView(id: string) {
  selectedViewId.value = id
  const { data } = await getView(id)
  viewForm.id = data.view.id
  viewForm.datasourceId = data.view.datasourceId
  viewForm.name = data.view.name
  viewForm.sqlContent = data.view.sqlContent
  paramDefs.value =
    data.params?.map((p) => ({
      id: p.id,
      paramName: p.paramName,
      paramType: p.paramType,
      dictCode: p.dictCode || '',
      required: Boolean(p.isRequired),
      testValue: '',
    })) || []
  preview.columns = []
  preview.rows = []
}

/**
 * 保存视图
 */
async function save() {
  if (!viewForm.name || !viewForm.datasourceId || !viewForm.sqlContent) {
    ElMessage.error('请补全视图名称、数据源与 SQL')
    return
  }
  const payload = {
    id: viewForm.id,
    name: viewForm.name,
    datasourceId: viewForm.datasourceId,
    sqlContent: viewForm.sqlContent,
    params: paramDefs.value.map((p) => ({
      id: p.id,
      paramName: p.paramName,
      paramType: p.paramType,
      dictCode: p.dictCode,
      required: p.required,
    })),
  }
  const { data } = await saveView(payload)
  viewForm.id = data.id
  selectedViewId.value = data.id
  ElMessage.success('保存成功')
  await reloadViews()
}

/**
 * 运行并预览视图结果
 */
async function runPreview() {
  if (!viewForm.datasourceId || !viewForm.sqlContent) {
    ElMessage.error('请先选择数据源并输入 SQL')
    return
  }
  const params = buildParamsMap()
  const req =
    viewForm.id && String(viewForm.id).length > 0
      ? { viewId: String(viewForm.id), params }
      : {
          datasourceId: String(viewForm.datasourceId),
          sqlContent: String(viewForm.sqlContent),
          paramDefs: paramDefs.value.map((p) => ({
            paramName: p.paramName,
            paramType: p.paramType,
            dictCode: p.dictCode,
            required: p.required,
          })),
          params,
        }
  const { data } = await previewView(req)
  preview.columns = data.columns
  preview.rows = data.rows
  ElMessage.success('运行成功')
}

onMounted(async () => {
  await reloadDatasources()
  await reloadViews()
})
</script>

<style scoped>
/* 整体栅格容器 */
.vd-container {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: 12px;
  height: calc(100vh - 120px);
}

/* 左侧边栏 */
.vd-sidebar {
  grid-column: span 3 / span 3;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  padding: 8px;
  overflow: auto;
  background-color: #fff;
}

/* 头部样式 */
.vd-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

/* 标题样式 */
.vd-title {
  font-weight: 600;
}

/* 垂直弹性布局 */
.vd-flex-col {
  display: flex;
  flex-direction: column;
}

/* 截断文本 */
.vd-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 次要截断文本 */
.vd-subtext {
  font-size: 12px;
  color: #6b7280;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 中间主编辑区 */
.vd-main {
  grid-column: span 6 / span 6;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* 面板样式 */
.vd-panel {
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  padding: 12px;
  background-color: #fff;
}

/* 弹性面板样式 */
.vd-panel-flex {
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  padding: 12px;
  flex: 1;
  overflow: auto;
  background-color: #fff;
}

/* 工具栏样式 */
.vd-toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

/* 右侧预览区 */
.vd-preview {
  grid-column: span 3 / span 3;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  padding: 12px;
  overflow: auto;
  background-color: #fff;
}
</style>
