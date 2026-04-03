<template>
  <div class="ppr-report-viewer w-full h-full flex flex-col">
    <!-- Query Form -->
    <div v-if="meta?.params && meta.params.length > 0" class="mb-4 border border-solid border-gray-200 p-3 rounded bg-white">
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
    <div class="flex-1 overflow-hidden bg-white border border-solid border-gray-200 rounded p-3 relative" v-loading="loading">
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
        <div ref="echartRef" class="w-full h-full"></div>
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
import { getReportMeta, getReportData, type ReportMetaResponse } from '@/api/report'
import ExcelEditor from '@/components/ExcelEditor/index.vue'
import { http } from '@/api/http'

const props = defineProps<{
  reportId: string
}>()

const loading = ref(false)
const meta = ref<ReportMetaResponse | null>(null)
const queryParams = ref<Record<string, any>>({})
const tableData = ref<{ columns: string[]; rows: any[] }>({ columns: [], rows: [] })
const tableColumns = ref<any[]>([])

const echartRef = ref<HTMLElement | null>(null)
const excelViewerRef = ref<InstanceType<typeof ExcelEditor> | null>(null)
let chartInstance: echarts.ECharts | null = null
let pollingTimer: number | null = null

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
    ElMessage.error('加载报表失败: ' + error.message)
  } finally {
    loading.value = false
  }
}

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
    ElMessage.error('获取数据失败: ' + error.message)
  } finally {
    loading.value = false
  }
}

function startPolling(intervalSec: number) {
  stopPolling()
  pollingTimer = window.setInterval(() => {
    fetchData()
  }, intervalSec * 1000)
}

function stopPolling() {
  if (pollingTimer) {
    clearInterval(pollingTimer)
    pollingTimer = null
  }
}

function handleResize() {
  chartInstance?.resize()
}

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
