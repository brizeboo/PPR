<template>
  <div class="grid grid-cols-12 gap-3 h-[calc(100vh-120px)]">
    <!-- Left panel: Report list -->
    <div class="col-span-3 border border-solid border-gray-200 rounded p-2 overflow-auto bg-white">
      <div class="flex items-center justify-between mb-2">
        <div class="font-600">报表列表</div>
        <el-button size="small" type="primary" @click="newReport">新建</el-button>
      </div>
      <el-input v-model="keyword" placeholder="搜索" size="small" class="mb-2" clearable />
      <el-menu :default-active="selectedReportId" @select="onSelectReport" class="border-0">
        <el-menu-item v-for="r in filteredReports" :key="r.id" :index="r.id">
          <div class="flex flex-col">
            <span class="truncate">{{ r.name }}</span>
            <span class="text-xs text-gray-500 truncate">{{ r.id }}</span>
          </div>
        </el-menu-item>
      </el-menu>
    </div>

    <!-- Center panel: Configuration -->
    <div class="col-span-4 flex flex-col gap-3">
      <div class="border border-solid border-gray-200 rounded p-3 bg-white">
        <div class="flex items-center gap-2 mb-2">
          <el-input v-model="form.name" placeholder="报表名称" class="flex-1" />
          <el-button type="primary" @click="save">保存</el-button>
        </div>

        <el-form label-width="100px" size="small" class="mt-4">
          <el-form-item label="关联视图">
            <el-select v-model="form.viewId" placeholder="请选择视图" class="w-full" @change="onViewChange">
              <el-option v-for="v in views" :key="v.id" :label="v.name" :value="v.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="展示类型">
            <el-radio-group v-model="form.chartType">
              <el-radio label="Table">表格</el-radio>
              <el-radio label="EChart">ECharts图表</el-radio>
              <el-radio label="Excel">Excel网格</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="form.chartType === 'Excel'" label="Excel模板">
            <el-select v-model="form.templateId" placeholder="请选择模板" class="w-full">
              <el-option v-for="t in templates" :key="t.id" :label="t.name" :value="t.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="轮询间隔(秒)">
            <el-input-number v-model="form.pollingInterval" :min="0" :step="5" />
            <span class="ml-2 text-xs text-gray-400">0表示不轮询</span>
          </el-form-item>
        </el-form>
      </div>

      <div class="border border-solid border-gray-200 rounded p-3 flex-1 overflow-auto bg-white flex flex-col">
        <div class="font-600 mb-2">样式配置</div>
        
        <div v-if="form.chartType === 'Table'" class="flex-1">
          <div class="text-xs text-gray-500 mb-2">配置表格列 (JSON数组)</div>
          <Codemirror v-model="form.styleConfig" :extensions="jsonExtensions" :style="{ height: '100%' }" />
        </div>

        <div v-if="form.chartType === 'EChart'" class="flex-1">
          <div class="text-xs text-gray-500 mb-2">ECharts Option (返回包含 option 的 JS 代码字符串，注入变量 `data`)</div>
          <Codemirror v-model="form.chartConfig" :extensions="jsonExtensions" :style="{ height: '100%' }" />
        </div>
      </div>
    </div>

    <!-- Right panel: Preview -->
    <div class="col-span-5 border border-solid border-gray-200 rounded p-3 overflow-auto bg-gray-50 relative">
      <div class="flex items-center justify-between mb-2">
        <div class="font-600">实时预览</div>
        <el-button size="small" @click="previewReport" :disabled="!form.id">刷新</el-button>
      </div>
      
      <div class="h-[calc(100%-40px)] w-full bg-white relative">
        <PprReportViewer v-if="previewId" :report-id="previewId" :key="previewKey" />
        <el-empty v-else description="请先保存报表再预览" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import Codemirror from 'vue-codemirror6'
import { json } from '@codemirror/lang-json'
import { oneDark } from '@codemirror/theme-one-dark'

import { listReports, saveReport, getReportMeta, type Report } from '@/api/report'
import { listViews, type View } from '@/api/view'
import PprReportViewer from '@/components/PprReportViewer.vue'
import { http } from '@/api/http'

const jsonExtensions = [json(), oneDark]

const reports = ref<Report[]>([])
const views = ref<View[]>([])
const templates = ref<any[]>([])
const keyword = ref('')
const selectedReportId = ref('')

const previewId = ref('')
const previewKey = ref(0)

const form = reactive<Partial<Report>>({
  id: '',
  name: '',
  viewId: '',
  templateId: '',
  chartType: 'Table',
  pollingInterval: 0,
  styleConfig: '[]',
  chartConfig: '{}'
})

const filteredReports = computed(() => {
  const k = keyword.value.trim().toLowerCase()
  if (!k) return reports.value
  return reports.value.filter((r) => r.name.toLowerCase().includes(k) || r.id.toLowerCase().includes(k))
})

async function reloadData() {
  const [resReports, resViews, resTemplates] = await Promise.all([listReports(), listViews(), http.get('/api/v1/admin/template/list')])
  reports.value = resReports.data
  views.value = resViews.data
  templates.value = resTemplates.data
}

function newReport() {
  selectedReportId.value = ''
  form.id = ''
  form.name = '新建报表'
  form.viewId = views.value.length ? views.value[0].id : ''
  form.templateId = ''
  form.chartType = 'Table'
  form.pollingInterval = 0
  form.styleConfig = '[\n  {\n    "prop": "name",\n    "label": "名称"\n  }\n]'
  form.chartConfig = '{\n  xAxis: {\n    type: "category",\n    data: data.rows.map(r => r.name)\n  },\n  yAxis: {\n    type: "value"\n  },\n  series: [\n    {\n      data: data.rows.map(r => r.value),\n      type: "bar"\n    }\n  ]\n}'
  previewId.value = ''
}

async function onSelectReport(id: string) {
  selectedReportId.value = id
  const { data } = await getReportMeta(id)
  form.id = data.id
  form.name = data.name
  form.viewId = data.viewId
  form.templateId = data.templateId || ''
  form.chartType = data.chartType
  form.pollingInterval = data.pollingInterval
  form.styleConfig = data.styleConfig || '[]'
  form.chartConfig = data.chartConfig || '{}'
  previewReport()
}

function onViewChange() {
  // Automatically load default config or refresh mapping
  if (form.chartType === 'Table') {
    // We can preview directly if saved
  }
}

async function save() {
  if (!form.name || !form.viewId) {
    ElMessage.error('请填写名称并选择视图')
    return
  }
  try {
    const { data } = await saveReport(form)
    form.id = data
    selectedReportId.value = data
    ElMessage.success('保存成功')
    await reloadData()
    previewReport()
  } catch (e: any) {
    ElMessage.error('保存失败: ' + e.message)
  }
}

function previewReport() {
  if (form.id) {
    previewId.value = form.id
    previewKey.value++ // force re-render
  }
}

onMounted(() => {
  reloadData()
})
</script>
