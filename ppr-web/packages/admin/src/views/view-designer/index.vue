<!-- 视图设计器组件 -->
<template>
  <div class="vd-header">
    <div class="vd-title">视图列表</div>
    <el-button type="primary" @click="newView">新增</el-button>
  </div>

  <el-table :data="filteredViews" border height="calc(100vh - 180px)">
    <el-table-column prop="name" label="视图名称" min-width="120" show-overflow-tooltip />
    <el-table-column label="操作" width="220" fixed="right">
      <template #default="{ row }">
        <el-button size="small" @click.stop="editView(row)">编辑</el-button>
        <el-button size="small" @click.stop="runPreviewRow(row)">预览</el-button>
        <el-popconfirm title="确认删除该视图？" @confirm="onDelete(row.id)">
          <template #reference>
            <el-button size="small" type="danger" @click.stop>删除</el-button>
          </template>
        </el-popconfirm>
      </template>
    </el-table-column>
  </el-table>

  <!-- 编辑视图的弹窗 -->
  <el-drawer v-model="dialogVisible" :title="viewForm.id ? '编辑视图' : '新建视图'" size="80%" destroy-on-close>
    <div class="vd-main" style="height: 100%;">
      <div class="vd-panel" style="margin-bottom: 12px;">
        <el-form :model="viewForm" label-width="100px" class="vd-form">
          <el-form-item label="视图名称">
            <el-input v-model="viewForm.name" placeholder="请输入视图名称" />
          </el-form-item>
          <el-form-item label="选择数据源">
            <el-select v-model="viewForm.datasourceId" placeholder="请选择数据源" style="width: 100%;">
              <el-option v-for="ds in datasources" :key="ds.id" :label="ds.name" :value="ds.id" />
            </el-select>
          </el-form-item>
        </el-form>
      </div>

      <div class="vd-panel" style="margin-bottom: 12px;">
        <div class="vd-header">
          <div class="vd-title">SQL编辑器</div>
          <el-button size="small" @click="resetSql">重置</el-button>
        </div>
        <Codemirror v-model="viewForm.sqlContent" :extensions="editorExtensions" :style="{ height: '240px', border: '1px solid #e5e7eb', borderRadius: '4px', overflow: 'hidden' }" />
      </div>

      <div class="vd-panel-flex" style="margin-bottom: 16px;">
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
          <el-table-column label="测试值" min-width="160">
            <template #default="{ row }">
              <el-input v-model="row.testValue" placeholder="运行时使用" />
            </template>
          </el-table-column>
          <el-table-column label="操作" width="140" fixed="right" align="center">
            <template #default="{ $index }">
              <el-button size="small" type="primary" @click="insertParam($index)">插入</el-button>
              <el-button size="small" type="danger" @click="removeParam($index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <template #footer>
      <div class="vd-drawer-footer">
        <el-button @click="runPreview">运行预览</el-button>
        <div class="vd-drawer-actions">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="save">保存</el-button>
        </div>
      </div>
    </template>
  </el-drawer>

    <!-- 右侧抽屉：预览结果 -->
    <el-drawer v-model="drawerOpen" title="预览结果" size="50%" destroy-on-close>
      <div class="vd-preview-content">
        <div class="vd-header" style="margin-bottom: 16px;">
          <div class="vd-title">数据详情</div>
          <el-tag v-if="preview.columns.length" type="success" size="small">{{ preview.rows.length }} 行</el-tag>
        </div>
        <el-table v-if="preview.columns.length" :data="preview.rows" border size="small" style="flex: 1;">
          <el-table-column v-for="c in preview.columns" :key="c" :prop="c" :label="c" min-width="120" show-overflow-tooltip />
        </el-table>
        <el-empty v-else description="暂无数据" />
      </div>
    </el-drawer>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import Codemirror from 'vue-codemirror6'
import { sql } from '@codemirror/lang-sql'

import { listDatasources, type Datasource } from '@ppr/core'
import { getView, listViews, previewView, saveView, deleteView, type View, type ViewExecutionResult, type ViewParam } from '@ppr/core'

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

// 抽屉开关
const drawerOpen = ref(false)

// 弹窗开关
const dialogVisible = ref(false)

// 预览结果数据
const preview = reactive<ViewExecutionResult>({
  columns: [],
  rows: [],
})

// CodeMirror 编辑器扩展
const editorExtensions = [sql()]

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
 * 重置 SQL 编辑器内容
 */
function resetSql() {
  viewForm.sqlContent = 'select 1 as value'
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
  dialogVisible.value = true
}

/**
 * 选中视图处理（表格行点击）
 * @param row 选中的视图对象
 */
async function onSelectViewRow(row: View) {
  // 只选中不弹窗，如果要编辑请点击编辑按钮
}

/**
 * 编辑视图
 * @param row 选中的视图对象
 */
async function editView(row: View) {
  selectedViewId.value = row.id
  const { data } = await getView(row.id)
  viewForm.id = data.view.id
  viewForm.datasourceId = data.view.datasourceId
  viewForm.name = data.view.name
  viewForm.sqlContent = data.view.sqlContent
  paramDefs.value =
    data.params?.map((p: any) => ({
      id: p.id,
      paramName: p.paramName,
      paramType: p.paramType,
      dictCode: p.dictCode || '',
      required: Boolean(p.isRequired),
      testValue: '',
    })) || []
  preview.columns = []
  preview.rows = []
  dialogVisible.value = true
}

/**
 * 新增参数定义 (在末尾添加)
 */
function addParam() {
  paramDefs.value.push({ paramName: '', paramType: 'String', required: false, dictCode: '', testValue: '' })
}

/**
 * 插入参数定义 (在指定位置插入)
 * @param index 插入位置的索引
 */
function insertParam(index: number) {
  paramDefs.value.splice(index + 1, 0, { paramName: '', paramType: 'String', required: false, dictCode: '', testValue: '' })
}

/**
 * 移除参数定义
 * @param index 参数索引
 */
function removeParam(index: number) {
  paramDefs.value.splice(index, 1)
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
  drawerOpen.value = true
}

/**
 * 在表格中直接运行并预览某行视图
 */
async function runPreviewRow(row: View) {
  const req = { viewId: String(row.id), params: {} }
  const { data } = await previewView(req)
  preview.columns = data.columns
  preview.rows = data.rows
  ElMessage.success('运行成功')
  drawerOpen.value = true
}

/**
 * 删除视图
 * @param id 视图ID
 */
async function onDelete(id: string) {
  await deleteView(id)
  ElMessage.success('删除成功')
  await reloadViews()
}

onMounted(async () => {
  await reloadDatasources()
  await reloadViews()
})
</script>

<style scoped>
/* 头部样式 */
.vd-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

/* 标题样式 */
.vd-title {
  font-size: 1.125rem;
  font-weight: 600;
}

/* 中间主编辑区 */
.vd-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

/* 面板样式 */
.vd-panel {
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  padding: 12px;
  background-color: #fff;
  margin-bottom: 12px;
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
}

/* 表单内部项 */
.vd-form {
  padding-right: 24px;
}

/* 抽屉底部容器样式 */
.vd-drawer-footer {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

/* 抽屉底部操作按钮容器样式 */
.vd-drawer-actions {
  display: flex;
  gap: 8px;
}

/* 抽屉内预览区容器 */
.vd-preview-content {
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
