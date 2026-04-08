<!-- 系统日志组件 -->
<template>
  <div class="log-container">
    <div class="log-header">
      <div class="log-filters">
        <el-input v-model="query.type" placeholder="操作类型" class="log-input-type" clearable @clear="handleSearch" />
        <el-select v-model="query.status" placeholder="执行状态" class="log-select-status" clearable @change="handleSearch">
          <el-option label="成功" value="success" />
          <el-option label="失败" value="error" />
        </el-select>
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          class="log-date-picker"
          @change="handleSearch"
        />
        <el-button type="primary" @click="handleSearch">查询</el-button>
      </div>
    </div>

    <el-table :data="tableData" border stripe class="log-table" v-loading="loading">
      <el-table-column prop="id" label="日志ID" width="280" />
      <el-table-column prop="type" label="操作类型" width="150" />
      <el-table-column prop="method" label="执行方法" show-overflow-tooltip />
      <el-table-column prop="operator" label="操作人" width="100" />
      <el-table-column prop="ip" label="IP地址" width="120" />
      <el-table-column prop="costMs" label="耗时(ms)" width="100">
        <template #default="{ row }">
          <span :class="{ 'log-text-danger': row.costMs > 1000 }">{{ row.costMs }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="time" label="执行时间" width="180">
        <template #default="{ row }">
          {{ formatDate(row.time) }}
        </template>
      </el-table-column>
      <el-table-column label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.errorMsg ? 'danger' : 'success'">
            {{ row.errorMsg ? '失败' : '成功' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" @click="showDetail(row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="log-pagination">
      <el-pagination
        v-model:current-page="page.current"
        v-model:page-size="page.size"
        :total="total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next"
        @size-change="handleSearch"
        @current-change="fetchData"
      />
    </div>

    <el-dialog title="日志详情" v-model="dialogVisible" width="700px">
      <el-descriptions :column="1" border>
        <el-descriptions-item label="操作类型">{{ currentLog.type }}</el-descriptions-item>
        <el-descriptions-item label="执行方法">{{ currentLog.method }}</el-descriptions-item>
        <el-descriptions-item label="请求参数">
          <pre class="log-params">{{ currentLog.params }}</pre>
        </el-descriptions-item>
        <el-descriptions-item label="执行时间">{{ formatDate(currentLog.time) }}</el-descriptions-item>
        <el-descriptions-item label="耗时">{{ currentLog.costMs }} ms</el-descriptions-item>
        <el-descriptions-item label="异常信息" v-if="currentLog.errorMsg">
          <div class="log-error">{{ currentLog.errorMsg }}</div>
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getLogPage } from '@ppr/core'

// 加载状态
const loading = ref(false)
// 表格数据
const tableData = ref<any[]>([])
// 数据总条数
const total = ref(0)

// 查询条件
const query = ref<any>({})
// 日期范围
const dateRange = ref<any>([])
// 分页信息
const page = ref({ current: 1, size: 20 })

// 详情弹窗控制
const dialogVisible = ref(false)
// 当前展示的日志数据
const currentLog = ref<any>({})

onMounted(() => {
  fetchData()
})

/**
 * 触发查询
 */
function handleSearch() {
  page.value.current = 1
  fetchData()
}

/**
 * 获取分页数据
 */
async function fetchData() {
  loading.value = true
  try {
    const params: any = { ...query.value, current: page.value.current, size: page.value.size }
    if (dateRange.value && dateRange.value.length === 2) {
      params.startTime = dateRange.value[0].getTime()
      params.endTime = dateRange.value[1].getTime() + 86400000 - 1
    }
    
    const res: any = await getLogPage(params)
    tableData.value = res.records || (res.data && res.data.records) || []
    total.value = res.total || (res.data && res.data.total) || 0
  } finally {
    loading.value = false
  }
}

/**
 * 展示日志详情
 * @param row 日志行数据
 */
function showDetail(row: any) {
  currentLog.value = row
  dialogVisible.value = true
}

/**
 * 格式化时间戳
 * @param timestamp 时间戳
 */
function formatDate(timestamp: number) {
  if (!timestamp) return ''
  const d = new Date(timestamp)
  return d.toLocaleString()
}
</script>

<style scoped>
/* 整体容器 */
.log-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* 顶部搜索栏 */
.log-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
  gap: 16px;
}

/* 搜索过滤项容器 */
.log-filters {
  display: flex;
  gap: 8px;
  align-items: center;
}

.log-input-type {
  width: 192px;
}

.log-select-status {
  width: 128px;
}

.log-date-picker {
  width: 256px;
}

/* 表格主体占据剩余空间 */
.log-table {
  flex: 1;
}

/* 高亮异常文本 */
.log-text-danger {
  color: #ef4444;
}

/* 底部分页 */
.log-pagination {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}

/* 日志详情参数块 */
.log-params {
  background-color: #f3f4f6;
  padding: 8px;
  border-radius: 4px;
  max-height: 192px;
  overflow: auto;
}

/* 日志详情错误信息 */
.log-error {
  color: #ef4444;
  white-space: pre-wrap;
  max-height: 256px;
  overflow: auto;
}
</style>
