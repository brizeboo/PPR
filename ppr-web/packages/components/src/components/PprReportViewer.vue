<!-- 报表预览/查看组件 -->
<template>
  <div class="ppr-report-viewer prv-container">
    <!-- Query Form -->
    <div v-if="meta?.params && meta.params.length > 0" class="prv-query-form">
      <el-form :inline="true" :model="queryParams" @submit.prevent="fetchData">
        <el-form-item v-for="p in meta.params" :key="p.paramName" :label="p.paramName">
          <el-input v-model="queryParams[p.paramName]" :placeholder="p.paramType" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="fetchData">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- Chart / Table -->
    <div class="prv-content" v-loading="loading">
      <template v-if="meta?.chartType === 'Table'">
        <el-table :data="tableData.rows" border height="100%">
          <el-table-column
            v-for="col in tableColumns"
            :key="col.prop"
            :prop="col.prop"
            :label="col.label"
            :width="col.width"
            :align="col.align"
            show-overflow-tooltip
          />
        </el-table>
      </template>

      <template v-else-if="meta?.chartType === 'EChart'">
        <div ref="echartRef" class="prv-echart"></div>
      </template>

      <template v-else-if="meta?.chartType === 'Excel'">
        <ExcelEditor ref="excelViewerRef" readonly />
      </template>
      
      <template v-else>
        <el-empty description="未知的图表类型" />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'
import { getReportMeta, getReportData, type ReportMetaResponse } from '@ppr/core'
import ExcelEditor from './ExcelEditor/index.vue'
import { http } from '@ppr/core'

// 组件入参
const props = defineProps<{
  reportId: string
}>()

// 加载状态
const loading = ref(false)
// 报表元数据
const meta = ref<ReportMetaResponse | null>(null)
// 查询参数
const queryParams = ref<Record<string, any>>({})
// 表格数据
const tableData = ref<{ columns: string[]; rows: any[] }>({ columns: [], rows: [] })
// 表格列配置
const tableColumns = ref<any[]>([])

// ECharts 容器引用
const echartRef = ref<HTMLElement | null>(null)
// Excel 编辑器引用
const excelViewerRef = ref<InstanceType<typeof ExcelEditor> | null>(null)

// ECharts 实例
let chartInstance: echarts.ECharts | null = null
// 轮询定时器
let pollingTimer: number | null = null

/**
 * 初始化组件，加载元数据和数据
 */
async function init() {
  if (!props.reportId) return
  loading.value = true
  try {
    const { data } = await getReportMeta(props.reportId)
    meta.value = data
    
    // Parse style config for table
    if (data.chartType === 'Table') {
      try {
        const styleConf = data.styleConfig ? JSON.parse(data.styleConfig) : []
        tableColumns.value = styleConf
      } catch (e) {
        tableColumns.value = []
      }
    } else if (data.chartType === 'EChart') {
      await nextTick()
      if (echartRef.value && !chartInstance) {
        chartInstance = echarts.init(echartRef.value)
      }
    }

    await fetchData()

    if (data.pollingInterval > 0) {
      startPolling(data.pollingInterval)
    }
  } catch (error: any) {
    const msg = error.response?.data?.message || error.message || '';
    if (msg.includes('SQL 解析失败')) {
      ElMessage.error('SQL 语法错误，请检查您的 SQL 语句');
    } else {
      ElMessage.error('加载报表失败: ' + msg);
    }
  } finally {
    loading.value = false
  }
}

/**
 * 获取报表数据
 */
async function fetchData() {
  if (!props.reportId || !meta.value) return
  loading.value = true
  try {
    const { data } = await getReportData(props.reportId, queryParams.value)
    
    if (meta.value.chartType === 'Table') {
      tableData.value = data
      // Merge with style config if empty
      if (tableColumns.value.length === 0 && data.columns) {
        tableColumns.value = data.columns.map((c: string) => ({
          prop: c,
          label: c,
        }))
      }
    } else if (meta.value.chartType === 'EChart') {
      if (chartInstance && meta.value.chartConfig) {
        try {
          const optStr = meta.value.chartConfig
          const option = new Function('data', `return ${optStr}`)(data)
          chartInstance.setOption(option, true)
        } catch (e) {
          console.error('Failed to parse ECharts config', e)
          ElMessage.error('图表配置解析失败')
        }
      }
    } else if (meta.value.chartType === 'Excel') {
      if (excelViewerRef.value && meta.value.templateId) {
        try {
          // 1. Load mapping config
          const tplRes = await http.get(`/api/v1/template/${meta.value.templateId}`)
          const mappingConfigStr = tplRes.data.mappingConfig
          const mappingConfig = mappingConfigStr ? JSON.parse(mappingConfigStr) : []

          // 2. Load Excel File into ArrayBuffer and then into File object
          const fileRes = await http.get(`/api/v1/template/file/${meta.value.templateId}`, { responseType: 'blob' })
          const file = new File([fileRes.data], 'template.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
          
          await excelViewerRef.value.loadExcelFile(file)

          // 3. Fill data based on mapping rules
          await nextTick()
          
          mappingConfig.forEach((conf: any) => {
             const val = data.rows && data.rows.length > 0 ? data.rows[0][conf.field] : ''
             if (val !== undefined && excelViewerRef.value) {
                if (conf.type === 'single') {
                   excelViewerRef.value.setCellValue(conf.row, conf.col, String(val))
                } else if (conf.type === 'row') {
                   // Render lists
                   data.rows.forEach((r: any, idx: number) => {
                      excelViewerRef.value!.setCellValue(conf.row + idx, conf.col, String(r[conf.field] || ''))
                   })
                } else if (conf.type === 'col') {
                   data.rows.forEach((r: any, idx: number) => {
                      excelViewerRef.value!.setCellValue(conf.row, conf.col + idx, String(r[conf.field] || ''))
                   })
                }
             }
          })
        } catch (e) {
          console.error('Failed to load or render Excel template', e)
          ElMessage.error('Excel 模板加载失败')
        }
      }
    }
  } catch (error: any) {
    const msg = error.response?.data?.message || error.message || '';
    if (msg.includes('SQL 解析失败')) {
      ElMessage.error('SQL 语法错误，请检查您的 SQL 语句');
    } else {
      ElMessage.error('获取数据失败: ' + msg);
    }
  } finally {
    loading.value = false
  }
}

/**
 * 启动数据轮询
 * @param intervalSec 轮询间隔(秒)
 */
function startPolling(intervalSec: number) {
  stopPolling()
  pollingTimer = window.setInterval(() => {
    fetchData()
  }, intervalSec * 1000)
}

/**
 * 停止数据轮询
 */
function stopPolling() {
  if (pollingTimer) {
    clearInterval(pollingTimer)
    pollingTimer = null
  }
}

/**
 * 窗口大小变化时重置图表大小
 */
function handleResize() {
  chartInstance?.resize()
}

// 监听 reportId 变化重新加载
watch(() => props.reportId, () => {
  stopPolling()
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
  init()
})

onMounted(() => {
  init()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  stopPolling()
  window.removeEventListener('resize', handleResize)
  if (chartInstance) {
    chartInstance.dispose()
  }
})
</script>

<style scoped>
/* 报表查看器主容器 */
.prv-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* 顶部查询表单区域 */
.prv-query-form {
  margin-bottom: 16px;
  border: 1px solid #e5e7eb;
  padding: 12px;
  border-radius: 4px;
  background-color: #fff;
}

/* 主体图表/表格展示区域 */
.prv-content {
  flex: 1;
  overflow: hidden;
  background-color: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  padding: 12px;
  position: relative;
}

/* ECharts 图表容器 */
.prv-echart {
  width: 100%;
  height: 100%;
}
</style>
