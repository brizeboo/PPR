<template>
  <el-container class="h-screen">
    <el-aside width="220px" class="border-r border-solid border-gray-200">
      <div class="h-14 flex items-center px-4 text-lg font-600">PPR Admin</div>
      <el-menu :default-active="activePath" @select="onSelect" class="border-0">
        <el-menu-item index="/datasource">数据源管理</el-menu-item>
        <el-menu-item index="/view-designer">视图设计器</el-menu-item>
        <el-menu-item index="/report-designer">报表设计器</el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header class="h-14 flex items-center justify-between border-b border-solid border-gray-200">
        <div class="px-4 font-500">{{ title }}</div>
        <div class="px-4 text-sm text-gray-500">M2</div>
      </el-header>
      <el-main class="p-4 overflow-auto">
        <RouterView />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const activePath = computed(() => route.path)

const title = computed(() => {
  if (route.path.startsWith('/datasource')) return '数据源管理'
  if (route.path.startsWith('/view-designer')) return '视图设计器'
  if (route.path.startsWith('/report-designer')) return '报表设计器'
  return 'PPR'
})

function onSelect(index: string) {
  router.push(index)
}
</script>

