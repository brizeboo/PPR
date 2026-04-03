<template>
  <div class="h-full flex flex-col">
    <div class="flex justify-between mb-4 gap-4">
      <div class="flex gap-2 items-center">
        <el-input v-model="query.type" placeholder="操作类型" class="w-48" clearable @clear="handleSearch" />
        <el-select v-model="query.status" placeholder="执行状态" class="w-32" clearable @change="handleSearch">
          <el-option label="成功" value="success" />
          <el-option label="失败" value="error" />
        </el-select>
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          class="w-64"
          @change="handleSearch"
        />
        <el-button type="primary" @click="handleSearch">查询</el-button>
      </div>
    </div>

    <el-table :data="tableData" border stripe class="flex-1" v-loading="loading">
      <el-table-column prop="id" label="日志ID" width="280" />
      <el-table-column prop="type" label="操作类型" width="150" />
      <el-table-column prop="method" label="执行方法" show-overflow-tooltip />
      <el-table-column prop="operator" label="操作人" width="100" />
      <el-table-column prop="ip" label="IP地址" width="120" />
      <el-table-column prop="costMs" label="耗时(ms)" width="100">
        <template #default="{ row }">
          <span :class="row.costMs > 1000 ? 'text-red-500' : ''">{{ row.costMs }}</span>
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

    <div class="mt-4 flex justify-end">
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
          <pre class="bg-gray-100 p-2 rounded max-h-48 overflow-auto">{{ currentLog.params }}</pre>
        </el-descriptions-item>
        <el-descriptions-item label="执行时间">{{ formatDate(currentLog.time) }}</el-descriptions-item>
        <el-descriptions-item label="耗时">{{ currentLog.costMs }} ms</el-descriptions-item>
        <el-descriptions-item label="异常信息" v-if="currentLog.errorMsg">
          <div class="text-red-500 whitespace-pre-wrap max-h-64 overflow-auto">{{ currentLog.errorMsg }}</div>
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getLogPage } from '@/api/log'

const loading = ref(false)
const tableData = ref<any[]>([])
const total = ref(0)

const query = ref<any>({})
const dateRange = ref<any>([])
const page = ref({ current: 1, size: 20 })

const dialogVisible = ref(false)
const currentLog = ref<any>({})

onMounted(() => {
  fetchData()
})

function handleSearch() {
  page.value.current = 1
  fetchData()
}

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

function showDetail(row: any) {
  currentLog.value = row
  dialogVisible.value = true
}

function formatDate(timestamp: number) {
  if (!timestamp) return ''
  const d = new Date(timestamp)
  return d.toLocaleString()
}
</script>
