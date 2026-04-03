<!-- 报表设计器组件 -->
<template>
  <div class="rd-container">
    <!-- 左侧面板：报表列表 -->
    <div class="rd-sidebar">
      <div class="rd-header">
        <div class="rd-title">报表列表</div>
        <el-button size="small" type="primary" @click="newReport">新建</el-button>
      </div>
      <el-input v-model="keyword" placeholder="搜索" size="small" style="margin-bottom: 8px;" clearable />
      <el-menu :default-active="selectedReportId" @select="onSelectReport" style="border: 0;">
        <el-menu-item v-for="r in filteredReports" :key="r.id" :index="r.id">
          <div class="rd-flex-col">
            <span class="rd-truncate">{{ r.name }}</span>
            <span class="rd-subtext">{{ r.id }}</span>
          </div>
        </el-menu-item>
      </el-menu>
    </div>

    <!-- 中间面板：配置信息 -->
    <div class="rd-main">
      <div class="rd-panel">
        <div class="rd-toolbar">
          <el-input v-model="form.name" placeholder="报表名称" style="flex: 1;" />
          <el-button type="primary" @click="save">保存</el-button>
        </div>

        <el-form label-width="100px" size="small" style="margin-top: 16px;">
          <el-form-item label="关联视图">
            <el-select v-model="form.viewId" placeholder="请选择视图" style="width: 100%;" @change="onViewChange">
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
            <el-select v-model="form.templateId" placeholder="请选择模板" style="width: 100%;">
              <el-option v-for="t in templates" :key="t.id" :label="t.name" :value="t.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="轮询间隔(秒)">
            <el-input-number v-model="form.pollingInterval" :min="0" :step="5" />
            <span class="rd-hint">0表示不轮询</span>
          </el-form-item>
        </el-form>
      </div>

      <div class="rd-panel-flex">
        <div class="rd-subtitle">样式配置</div>
        
        <div v-if="form.chartType === 'Table'" style="flex: 1;">
          <div class="rd-desc">配置表格列 (JSON数组)</div>
          <Codemirror v-model="form.styleConfig" :extensions="jsonExtensions" :style="{ height: '100%' }" />
        </div>

        <div v-if="form.chartType === 'EChart'" style="flex: 1;">
          <div class="rd-desc">ECharts Option (返回包含 option 的 JS 代码字符串，注入变量 `data`)</div>
          <Codemirror v-model="form.chartConfig" :extensions="jsonExtensions" :style="{ height: '100%' }" />
        </div>
      </div>
    </div>

    <!-- 右侧面板：实时预览 -->
    <div class="rd-preview">
      <div class="rd-header">
        <div class="rd-title">实时预览</div>
        <el-button size="small" @click="previewReport" :disabled="!form.id">刷新</el-button>
      </div>
      
      <div class="rd-preview-content">
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

import { listReports, saveReport, getReportMeta, type Report } from '@/api/report'
import { listViews, type View } from '@/api/view'
import PprReportViewer from '@/components/PprReportViewer.vue'
import { http } from '@/api/http'

// CodeMirror JSON扩展
const jsonExtensions = [json()]

// 报表列表
const reports = ref<Report[]>([])
// 视图列表
const views = ref<View[]>([])
// 模板列表
const templates = ref<any[]>([])
// 搜索关键字
const keyword = ref('')
// 选中的报表ID
const selectedReportId = ref('')

// 当前预览的报表ID
const previewId = ref('')
// 预览组件的 Key，用于强制刷新
const previewKey = ref(0)

// 报表表单数据
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

// 根据关键字过滤后的报表列表
const filteredReports = computed(() => {
  const k = keyword.value.trim().toLowerCase()
  if (!k) return reports.value
  return reports.value.filter((r) => r.name.toLowerCase().includes(k) || r.id.toLowerCase().includes(k))
})

/**
 * 重新加载各类列表数据
 */
async function reloadData() {
  const [resReports, resViews, resTemplates] = await Promise.all([listReports(), listViews(), http.get('/api/v1/admin/template/list')])
  reports.value = resReports.data
  views.value = resViews.data
  templates.value = resTemplates.data
}

/**
 * 新建报表
 */
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

/**
 * 选中报表
 * @param id 报表ID
 */
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

/**
 * 视图切换回调
 */
function onViewChange() {
  // Automatically load default config or refresh mapping
  if (form.chartType === 'Table') {
    // We can preview directly if saved
  }
}

/**
 * 保存报表配置
 */
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

/**
 * 触发报表预览刷新
 */
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

<style scoped>
/* 整体栅格容器 */
.rd-container {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: 12px;
  height: calc(100vh - 120px);
}

/* 左侧边栏 */
.rd-sidebar {
  grid-column: span 3 / span 3;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  padding: 8px;
  overflow: auto;
  background-color: #fff;
}

/* 头部样式 */
.rd-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

/* 标题样式 */
.rd-title {
  font-weight: 600;
}

/* 垂直弹性布局 */
.rd-flex-col {
  display: flex;
  flex-direction: column;
}

/* 截断文本 */
.rd-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 次要截断文本 */
.rd-subtext {
  font-size: 12px;
  color: #6b7280;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 中间主编辑区 */
.rd-main {
  grid-column: span 4 / span 4;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* 面板样式 */
.rd-panel {
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  padding: 12px;
  background-color: #fff;
}

/* 工具栏样式 */
.rd-toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

/* 提示文本 */
.rd-hint {
  margin-left: 8px;
  font-size: 12px;
  color: #9ca3af;
}

/* 弹性面板样式 */
.rd-panel-flex {
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  padding: 12px;
  flex: 1;
  overflow: auto;
  background-color: #fff;
  display: flex;
  flex-direction: column;
}

/* 子标题 */
.rd-subtitle {
  font-weight: 600;
  margin-bottom: 8px;
}

/* 描述文本 */
.rd-desc {
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 8px;
}

/* 右侧预览区 */
.rd-preview {
  grid-column: span 5 / span 5;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  padding: 12px;
  overflow: auto;
  background-color: #f9fafb;
  position: relative;
}

/* 预览内容区 */
.rd-preview-content {
  height: calc(100% - 40px);
  width: 100%;
  background-color: #fff;
  position: relative;
}
</style>
