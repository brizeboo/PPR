<!-- 后台管理布局主组件 -->
<template>
  <el-container class="admin-container">
    <el-header class="admin-header">
      <div class="header-left">
        <div class="header-logo">PPR</div>
        <el-menu 
          :default-active="activePath" 
          @select="onSelect" 
          mode="horizontal" 
          class="header-menu"
          :ellipsis="false"
        >
          <el-menu-item index="/datasource">数据库</el-menu-item>
          <el-menu-item index="/view-designer">视图</el-menu-item>
          <el-menu-item index="/report-designer">报表</el-menu-item>
          <el-menu-item index="/template-designer">模板</el-menu-item>
          <el-menu-item index="/file">文件</el-menu-item>
          <el-menu-item index="/log">日志</el-menu-item>
          <el-menu-item index="/setting">设置</el-menu-item>
        </el-menu>
      </div>
      <div class="header-right">
        <div class="header-user">M3</div>
      </div>
    </el-header>
    <el-main class="admin-main">
      <RouterView />
    </el-main>
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
const activePath = computed(() => {
  // 如果路径以某些前缀开头，可以高亮特定的菜单项
  const path = route.path;
  if (path.startsWith('/datasource')) return '/datasource';
  if (path.startsWith('/view-designer')) return '/view-designer';
  if (path.startsWith('/report-designer')) return '/report-designer';
  if (path.startsWith('/template-designer')) return '/template-designer';
  if (path.startsWith('/file')) return '/file';
  if (path.startsWith('/log')) return '/log';
  if (path.startsWith('/setting')) return '/setting';
  return path;
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
  display: flex;
  flex-direction: column;
}

/* 顶部导航栏样式 */
.admin-header {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #e5e7eb;
  background-color: #fff;
  padding: 0 20px;
  flex-shrink: 0;
}

/* 顶部左侧区域 */
.header-left {
  display: flex;
  align-items: center;
  height: 100%;
}

/* 顶部 Logo 样式 */
.header-logo {
  font-size: 1.25rem;
  font-weight: 700;
  color: #409eff;
  margin-right: 32px;
  white-space: nowrap;
}

/* 顶部菜单样式 */
.header-menu {
  border-bottom: 0;
  height: 60px;
  background-color: transparent;
}
.header-menu .el-menu-item {
  height: 60px;
  line-height: 60px;
  font-size: 15px;
}

/* 顶部右侧区域 */
.header-right {
  display: flex;
  align-items: center;
}

/* 顶部用户信息样式 */
.header-user {
  font-size: 0.875rem;
  color: #6b7280;
  cursor: pointer;
}

/* 主内容区域样式 */
.admin-main {
  padding: 16px;
  overflow: auto;
  background-color: #f3f4f6; /* 添加背景色以区分内容 */
  flex: 1;
}
</style>

