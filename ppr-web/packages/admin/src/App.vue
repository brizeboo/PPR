<template>
  <RouterView />

  <!-- 管理员密钥验证弹窗 -->
  <el-dialog
    v-model="authDialogVisible"
    title="管理员身份验证"
    width="400px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
  >
    <el-form @submit.prevent="verifyAdminKey">
      <el-form-item>
        <el-input
          v-model="adminKeyInput"
          placeholder="请输入控制台打印的管理员密钥"
          type="password"
          show-password
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="verifyAdminKey" :loading="verifying" style="width: 100%">
        验证并登录
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { http } from '@ppr/core';
import { ElMessage } from 'element-plus';

const authDialogVisible = ref(false);
const adminKeyInput = ref('');
const verifying = ref(false);

const checkAuthStatus = async () => {
  try {
    const { data } = await http.get('/api/v1/admin/auth/status');
    if (data && data.enabled) {
      // 检查 URL 参数
      const urlParams = new URLSearchParams(window.location.search);
      const urlKey = urlParams.get('adminkey');
      
      if (urlKey) {
        adminKeyInput.value = urlKey;
        await verifyAdminKey();
        
        // 验证成功后，清理 URL 上的参数，保持地址栏干净
        urlParams.delete('adminkey');
        const newUrl = window.location.pathname + (urlParams.toString() ? '?' + urlParams.toString() : '') + window.location.hash;
        window.history.replaceState({}, '', newUrl);
      }
    }
  } catch (error) {
    console.error('Failed to check auth status', error);
  }
};

const verifyAdminKey = async () => {
  if (!adminKeyInput.value) {
    ElMessage.warning('请输入管理员密钥');
    return;
  }
  
  verifying.value = true;
  try {
    const { data } = await http.post('/api/v1/admin/auth/verify', {
      adminKey: adminKeyInput.value
    });
    
    if (data.success) {
      ElMessage.success('验证成功');
      localStorage.setItem('satoken', data.token);
      authDialogVisible.value = false;
      // 触发页面重载或重新获取数据，以更新之前 401 失败的请求
      window.dispatchEvent(new CustomEvent('ppr-authorized'));
    } else {
      ElMessage.error(data.message || '密钥无效');
    }
  } catch (error) {
    ElMessage.error('验证请求失败');
  } finally {
    verifying.value = false;
  }
};

const handleUnauthorized = () => {
  authDialogVisible.value = true;
};

onMounted(() => {
  window.addEventListener('ppr-unauthorized', handleUnauthorized);
  checkAuthStatus();
});

onUnmounted(() => {
  window.removeEventListener('ppr-unauthorized', handleUnauthorized);
});
</script>

