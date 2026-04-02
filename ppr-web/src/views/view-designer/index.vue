<template>
  <div class="grid grid-cols-12 gap-3 h-[calc(100vh-120px)]">
    <div class="col-span-3 border border-solid border-gray-200 rounded p-2 overflow-auto">
      <div class="flex items-center justify-between mb-2">
        <div class="font-600">视图列表</div>
        <el-button size="small" type="primary" @click="newView">新建</el-button>
      </div>
      <el-input v-model="keyword" placeholder="搜索" size="small" class="mb-2" clearable />
      <el-menu :default-active="selectedViewId" @select="onSelectView" class="border-0">
        <el-menu-item v-for="v in filteredViews" :key="v.id" :index="v.id">
          <div class="flex flex-col">
            <span class="truncate">{{ v.name }}</span>
            <span class="text-xs text-gray-500 truncate">{{ v.id }}</span>
          </div>
        </el-menu-item>
      </el-menu>
    </div>

    <div class="col-span-6 flex flex-col gap-3">
      <div class="border border-solid border-gray-200 rounded p-3">
        <div class="flex items-center gap-2 mb-2">
          <el-input v-model="viewForm.name" placeholder="视图名称" class="flex-1" />
          <el-select v-model="viewForm.datasourceId" placeholder="选择数据源" class="w-56">
            <el-option v-for="ds in datasources" :key="ds.id" :label="ds.name" :value="ds.id" />
          </el-select>
          <el-button type="primary" @click="save">保存</el-button>
          <el-button @click="runPreview">运行</el-button>
        </div>

        <Codemirror v-model="viewForm.sqlContent" :extensions="editorExtensions" :style="{ height: '320px' }" />
      </div>

      <div class="border border-solid border-gray-200 rounded p-3 flex-1 overflow-auto">
        <div class="flex items-center justify-between mb-2">
          <div class="font-600">参数配置</div>
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
              <el-select v-model="row.paramType" class="w-full">
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

    <div class="col-span-3 border border-solid border-gray-200 rounded p-3 overflow-auto">
      <div class="flex items-center justify-between mb-2">
        <div class="font-600">预览结果</div>
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

type ViewParamDraft = ViewParam & { testValue?: string }

const datasources = ref<Datasource[]>([])
const views = ref<View[]>([])
const keyword = ref('')
const selectedViewId = ref('')

const viewForm = reactive<Partial<View>>({
  id: '',
  datasourceId: '',
  name: '',
  sqlContent: 'select 1 as value',
})

const paramDefs = ref<ViewParamDraft[]>([])

const preview = reactive<ViewExecutionResult>({
  columns: [],
  rows: [],
})

const editorExtensions = [sql(), oneDark]

const filteredViews = computed(() => {
  const k = keyword.value.trim().toLowerCase()
  if (!k) return views.value
  return views.value.filter((v) => v.name.toLowerCase().includes(k) || v.id.toLowerCase().includes(k))
})

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

async function reloadDatasources() {
  const { data } = await listDatasources()
  datasources.value = data
  if (!viewForm.datasourceId && data.length) {
    viewForm.datasourceId = data[0].id
  }
}

async function reloadViews() {
  const { data } = await listViews()
  views.value = data
}

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

function addParam() {
  paramDefs.value.push({ paramName: '', paramType: 'String', required: false, dictCode: '', testValue: '' })
}

function removeParam(index: number) {
  paramDefs.value.splice(index, 1)
}

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
