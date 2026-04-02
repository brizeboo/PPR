<template>
  <div class="flex items-center justify-between mb-3">
    <div class="text-lg font-600">数据源管理</div>
    <el-button type="primary" @click="openCreate">新增</el-button>
  </div>

  <el-table :data="list" border height="calc(100vh - 180px)">
    <el-table-column prop="name" label="名称" width="180" />
    <el-table-column prop="type" label="类型" width="120" />
    <el-table-column prop="jdbcUrl" label="JDBC URL" min-width="360" show-overflow-tooltip />
    <el-table-column prop="username" label="账号" width="160" />
    <el-table-column label="操作" width="260" fixed="right">
      <template #default="{ row }">
        <el-button size="small" @click="openEdit(row)">编辑</el-button>
        <el-button size="small" @click="onTestRow(row)">测试连接</el-button>
        <el-popconfirm title="确认删除该数据源？" @confirm="onDelete(row.id)">
          <template #reference>
            <el-button size="small" type="danger">删除</el-button>
          </template>
        </el-popconfirm>
      </template>
    </el-table-column>
  </el-table>

  <el-drawer v-model="drawerOpen" :title="drawerTitle" size="520px" destroy-on-close>
    <el-form ref="formRef" :model="form" :rules="rules" label-width="90px">
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-select v-model="form.type" class="w-full">
          <el-option label="MySQL" value="MySQL" />
          <el-option label="PostgreSQL" value="PostgreSQL" />
          <el-option label="SQLServer" value="SQLServer" />
          <el-option label="SQLite" value="SQLite" />
        </el-select>
      </el-form-item>
      <el-form-item label="JDBC URL" prop="jdbcUrl">
        <el-input v-model="form.jdbcUrl" />
      </el-form-item>
      <el-form-item label="账号">
        <el-input v-model="form.username" />
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="form.password" type="password" show-password />
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="flex justify-between w-full">
        <el-button @click="onTestForm">测试连接</el-button>
        <div class="flex gap-2">
          <el-button @click="drawerOpen = false">取消</el-button>
          <el-button type="primary" @click="onSave">保存</el-button>
        </div>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, computed } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { deleteDatasource, listDatasources, saveDatasource, testDatasource, type Datasource } from '@/api/datasource'

const list = ref<Datasource[]>([])
const drawerOpen = ref(false)
const formRef = ref<FormInstance>()

const form = reactive<Partial<Datasource>>({
  id: '',
  name: '',
  type: 'MySQL',
  jdbcUrl: '',
  username: '',
  password: '',
})

const rules: FormRules = {
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
  type: [{ required: true, message: '请选择类型', trigger: 'change' }],
  jdbcUrl: [{ required: true, message: '请输入 JDBC URL', trigger: 'blur' }],
}

const drawerTitle = computed(() => (form.id ? '编辑数据源' : '新增数据源'))

async function reload() {
  const { data } = await listDatasources()
  list.value = data
}

function openCreate() {
  form.id = ''
  form.name = ''
  form.type = 'MySQL'
  form.jdbcUrl = ''
  form.username = ''
  form.password = ''
  drawerOpen.value = true
}

function openEdit(row: Datasource) {
  form.id = row.id
  form.name = row.name
  form.type = row.type
  form.jdbcUrl = row.jdbcUrl
  form.username = row.username || ''
  form.password = row.password || ''
  drawerOpen.value = true
}

async function onSave() {
  const ok = await formRef.value?.validate().catch(() => false)
  if (!ok) return

  await saveDatasource(form)
  ElMessage.success('保存成功')
  drawerOpen.value = false
  await reload()
}

async function onDelete(id: string) {
  await deleteDatasource(id)
  ElMessage.success('删除成功')
  await reload()
}

async function onTestRow(row: Datasource) {
  const { data } = await testDatasource({ jdbcUrl: row.jdbcUrl, username: row.username, password: row.password })
  data.success ? ElMessage.success('连接成功') : ElMessage.error('连接失败')
}

async function onTestForm() {
  const ok = await formRef.value?.validate().catch(() => false)
  if (!ok) return
  const { data } = await testDatasource({ jdbcUrl: String(form.jdbcUrl), username: form.username, password: form.password })
  data.success ? ElMessage.success('连接成功') : ElMessage.error('连接失败')
}

onMounted(() => {
  reload()
})
</script>

