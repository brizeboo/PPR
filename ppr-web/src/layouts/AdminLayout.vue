<!-- 后台管理布局主组件 -->
<template>
  <el-container class="admin-container">
    <el-aside width="220px" class="admin-aside">
      <div class="aside-logo">PPR Admin</div>
      <el-menu :default-active="activePath" @select="onSelect" class="aside-menu">
        <el-menu-item index="/datasource">数据源管理</el-menu-item>
        <el-menu-item index="/view-designer">视图设计器</el-menu-item>
        <el-menu-item index="/report-designer">报表设计器</el-menu-item>
        <el-menu-item index="/template-designer">模板设计器</el-menu-item>
        <el-menu-item index="/schedule">定时发送</el-menu-item>
        <el-menu-item index="/log">系统日志</el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header class="admin-header">
        <div class="header-title">{{ title }}</div>
        <div class="header-user">M3</div>
      </el-header>
      <el-main class="admin-main">
        <RouterView />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// 当前路由实例
const route = useRoute()
// 路由导航实例
const router = useRouter()

// 计算当前激活的菜单路径
const activePath = computed(() => route.path)

// 根据当前路径计算顶部标题
const title = computed(() => {
  if (route.path.startsWith('/datasource')) return '数据源管理'
  if (route.path.startsWith('/view-designer')) return '视图设计器'
  if (route.path.startsWith('/report-designer')) return '报表设计器'
  if (route.path.startsWith('/template-designer')) return '模板设计器'
  if (route.path.startsWith('/schedule')) return '定时发送'
  if (route.path.startsWith('/log')) return '系统日志'
  return 'PPR'
})

/**
 * 菜单选中事件处理
 * @param index 选中的菜单索引（路径）
 */
function onSelect(index: string) {
  router.push(index)
}
</script>

<style scoped>
/* 管理后台整体容器样式 */
.admin-container {
  height: 100vh;
}

/* 侧边栏样式 */
.admin-aside {
  border-right: 1px solid #e5e7eb;
}

/* 侧边栏顶部Logo样式 */
.aside-logo {
  height: 56px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  font-size: 1.125rem;
  font-weight: 600;
}

/* 侧边栏菜单样式 */
.aside-menu {
  border: 0;
}

/* 顶部请求头样式 */
.admin-header {
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #e5e7eb;
}

/* 顶部标题样式 */
.header-title {
  padding: 0 16px;
  font-weight: 500;
}

/* 顶部用户信息样式 */
.header-user {
  padding: 0 16px;
  font-size: 0.875rem;
  color: #6b7280;
}

/* 主内容区域样式 */
.admin-main {
  padding: 16px;
  overflow: auto;
  background-color: #f3f4f6; /* 添加背景色以区分内容 */
}
</style>

