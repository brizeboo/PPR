<!-- 定时任务管理组件 -->
<template>
  <div class="schedule-container">
    <div class="schedule-header">
      <div>
        <el-button type="primary" @click="handleCreate">新增定时任务</el-button>
        <el-button @click="handleMailConfig">全局 SMTP 配置</el-button>
      </div>
    </div>

    <el-table :data="tableData" border stripe class="schedule-table" v-loading="loading">
      <el-table-column prop="id" label="任务ID" width="280" />
      <el-table-column prop="reportId" label="关联报表ID" />
      <el-table-column prop="cron" label="Cron表达式" />
      <el-table-column prop="receivers" label="收件人" show-overflow-tooltip />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-switch
            :model-value="row.status"
            :active-value="1"
            :inactive-value="0"
            @change="(val: any) => handleStatusChange(row, val as number)"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="220" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
          <el-button link type="primary" @click="handleExecute(row)">立即执行一次</el-button>
          <el-popconfirm title="确定要删除该任务吗？" @confirm="handleDelete(row)">
            <template #reference>
              <el-button link type="danger">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <!-- 任务弹窗 -->
    <el-dialog :title="dialogTitle" v-model="dialogVisible" width="600px">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="120px">
        <el-form-item label="关联报表" prop="reportId">
          <el-select v-model="form.reportId" placeholder="请选择报表" class="schedule-select-full">
            <el-option
              v-for="item in reports"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Cron表达式" prop="cron">
          <el-input v-model="form.cron" placeholder="例如：0 0/5 * * * ?" />
        </el-form-item>
        <el-form-item label="收件人" prop="receivers">
          <el-input v-model="form.receivers" placeholder="多个用逗号分隔" />
        </el-form-item>
        <el-form-item label="抄送人" prop="ccReceivers">
          <el-input v-model="form.ccReceivers" placeholder="多个用逗号分隔" />
        </el-form-item>
        <el-form-item label="邮件主题" prop="emailSubject">
          <el-input v-model="form.emailSubject" placeholder="自定义邮件主题" />
        </el-form-item>
        <el-form-item label="邮件正文" prop="emailContent">
          <el-input v-model="form.emailContent" type="textarea" :rows="4" placeholder="自定义邮件正文(支持HTML)" />
        </el-form-item>
        <el-form-item label="启用状态" prop="status">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="0" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm" :loading="submitLoading">保存</el-button>
      </template>
    </el-dialog>

    <!-- SMTP 弹窗 -->
    <el-dialog title="全局 SMTP 配置" v-model="mailDialogVisible" width="500px">
      <el-form :model="mailForm" :rules="mailRules" ref="mailFormRef" label-width="100px">
        <el-form-item label="SMTP 服务器" prop="host">
          <el-input v-model="mailForm.host" placeholder="例如：smtp.qq.com" />
        </el-form-item>
        <el-form-item label="端口" prop="port">
          <el-input-number v-model="mailForm.port" :min="1" :max="65535" />
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="mailForm.username" placeholder="发件人邮箱账号" />
        </el-form-item>
        <el-form-item label="密码/授权码" prop="password">
          <el-input v-model="mailForm.password" type="password" show-password />
        </el-form-item>
        <el-form-item label="协议" prop="protocol">
          <el-input v-model="mailForm.protocol" placeholder="smtp" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="schedule-dialog-footer">
          <div>
            <el-button type="success" @click="testMail" :loading="testLoading">测试发信</el-button>
          </div>
          <div>
            <el-button @click="mailDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="submitMailForm" :loading="mailSubmitLoading">保存</el-button>
          </div>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getScheduleList, saveSchedule, changeScheduleStatus, deleteSchedule } from '@/api/schedule'
import { getMailConfig, saveMailConfig, testMailSend } from '@/api/mail'
import { listReports, type Report } from '@/api/report'

// 表格加载状态
const loading = ref(false)
// 定时任务数据列表
const tableData = ref<any[]>([])
// 报表数据列表
const reports = ref<Report[]>([])

// 任务表单弹窗可见性
const dialogVisible = ref(false)
// 任务表单标题
const dialogTitle = ref('新增任务')
// 提交按钮加载状态
const submitLoading = ref(false)
// 任务表单引用
const formRef = ref()
// 任务表单数据
const form = ref<any>({
  status: 1
})

// SMTP配置弹窗可见性
const mailDialogVisible = ref(false)
// SMTP表单引用
const mailFormRef = ref()
// SMTP表单数据
const mailForm = ref<any>({
  port: 465,
  protocol: 'smtp'
})
// SMTP提交按钮加载状态
const mailSubmitLoading = ref(false)
// 测试邮件发送按钮加载状态
const testLoading = ref(false)

// 任务表单验证规则
const rules = {
  reportId: [{ required: true, message: '请选择报表', trigger: 'change' }],
  cron: [{ required: true, message: '请输入Cron表达式', trigger: 'blur' }],
  receivers: [{ required: true, message: '请输入收件人', trigger: 'blur' }]
}

// SMTP表单验证规则
const mailRules = {
  host: [{ required: true, message: '请输入服务器地址', trigger: 'blur' }],
  port: [{ required: true, message: '请输入端口', trigger: 'blur' }],
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码/授权码', trigger: 'blur' }]
}

onMounted(async () => {
  fetchData()
  try {
    const res = await listReports()
    reports.value = res.data || res
  } catch (e) {}
})

/**
 * 获取定时任务列表
 */
async function fetchData() {
  loading.value = true
  try {
    const res = await getScheduleList()
    tableData.value = res.data || res
  } finally {
    loading.value = false
  }
}

/**
 * 打开新增任务弹窗
 */
function handleCreate() {
  dialogTitle.value = '新增任务'
  form.value = { status: 1 }
  dialogVisible.value = true
}

/**
 * 打开编辑任务弹窗
 * @param row 当前任务数据
 */
function handleEdit(row: any) {
  dialogTitle.value = '编辑任务'
  form.value = { ...row }
  dialogVisible.value = true
}

/**
 * 修改任务状态
 * @param row 当前任务数据
 * @param val 新状态值
 */
async function handleStatusChange(row: any, val: number) {
  try {
    await changeScheduleStatus(row.id, val)
    ElMessage.success('状态修改成功')
    row.status = val
  } catch (e) {
    ElMessage.error('状态修改失败')
  }
}

/**
 * 删除任务
 * @param row 当前任务数据
 */
async function handleDelete(row: any) {
  try {
    await deleteSchedule(row.id)
    ElMessage.success('删除成功')
    fetchData()
  } catch (e) {
    ElMessage.error('删除失败')
  }
}

/**
 * 立即执行任务
 * @param row 当前任务数据
 */
function handleExecute(row: any) {
  ElMessageBox.prompt('请输入临时接收邮箱（如果不输入则发给配置的收件人）', '立即执行', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
  }).then(async ({ value }) => {
    // TODO: 实现手动触发接口
    ElMessage.success('触发指令已发送')
  }).catch(() => {})
}

/**
 * 提交任务表单
 */
async function submitForm() {
  await formRef.value.validate()
  submitLoading.value = true
  try {
    await saveSchedule(form.value)
    ElMessage.success('保存成功')
    dialogVisible.value = false
    fetchData()
  } finally {
    submitLoading.value = false
  }
}

/**
 * 打开全局SMTP配置弹窗
 */
async function handleMailConfig() {
  try {
    const res = await getMailConfig()
    if (res && res.data) {
      mailForm.value = res.data
    } else if (res && (res as any).id) {
      mailForm.value = res
    } else {
      mailForm.value = { port: 465, protocol: 'smtp' }
    }
  } catch (e) {}
  mailDialogVisible.value = true
}

/**
 * 提交SMTP配置表单
 */
async function submitMailForm() {
  await mailFormRef.value.validate()
  mailSubmitLoading.value = true
  try {
    await saveMailConfig(mailForm.value)
    ElMessage.success('保存成功')
    mailDialogVisible.value = false
  } finally {
    mailSubmitLoading.value = false
  }
}

/**
 * 测试发送邮件
 */
async function testMail() {
  await mailFormRef.value.validate()
  ElMessageBox.prompt('请输入测试接收邮箱', '测试发信', {
    confirmButtonText: '发送',
    cancelButtonText: '取消',
    inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
    inputErrorMessage: '邮箱格式不正确'
  }).then(async ({ value }) => {
    testLoading.value = true
    try {
      await testMailSend(value)
      ElMessage.success('测试邮件发送成功，请查收')
    } catch (e: any) {
      ElMessage.error('发送失败: ' + (e.message || '未知错误'))
    } finally {
      testLoading.value = false
    }
  }).catch(() => {})
}
</script>

<style scoped>
/* 整体容器 */
.schedule-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* 顶部操作区 */
.schedule-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
}

/* 表格主体 */
.schedule-table {
  flex: 1;
  overflow: hidden;
}

/* 充满宽度的选择框 */
.schedule-select-full {
  width: 100%;
}

/* 弹窗底部操作区 */
.schedule-dialog-footer {
  display: flex;
  justify-content: space-between;
}
</style>
