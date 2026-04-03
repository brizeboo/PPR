<!-- 模板设计器组件 -->
<template>
  <div class="td-container">
    <div class="td-header">
      <div class="td-header-left">
        <el-upload
          class="upload-demo"
          action="/api/v1/admin/template/upload"
          :show-file-list="false"
          :on-success="handleUploadSuccess"
        >
          <el-button type="primary">导入本地 Excel 文件</el-button>
        </el-upload>
        <span v-if="currentTemplate" class="td-text-muted">
          当前模板：{{ currentTemplate.name }}
        </span>
      </div>
      <div>
        <el-button type="success" :disabled="!currentTemplate" @click="saveMapping">保存模板</el-button>
      </div>
    </div>

    <div class="td-body">
      <!-- 左侧数据源面板 -->
      <div class="td-sidebar">
        <div class="td-sidebar-title">数据源字段</div>
        <el-select v-model="selectedReport" placeholder="请选择报表" @change="loadReportFields" style="margin-bottom: 16px;">
          <!-- 假设已有报表列表 -->
          <el-option label="示例报表1" value="1" />
        </el-select>
        
        <div class="td-field-list">
          <div 
            v-for="field in availableFields" 
            :key="field.prop"
            class="td-field-item"
            draggable="true"
            @dragstart="onDragStart($event, field)"
          >
            {{ field.label }} ({{ field.prop }})
          </div>
          <div v-if="availableFields.length === 0" class="td-empty-text">
            请先选择报表加载字段
          </div>
        </div>
      </div>

      <!-- 右侧 Excel 设计器 -->
      <div class="td-main">
        <ExcelEditor ref="excelEditorRef" @drop="onEditorDrop" />
      </div>
    </div>

    <!-- 填充类型配置弹窗 -->
    <el-dialog v-model="dialogVisible" title="配置填充类型" width="400px">
      <el-form :model="fillConfig" label-width="100px">
        <el-form-item label="字段标识">
          <el-input v-model="fillConfig.field" disabled />
        </el-form-item>
        <el-form-item label="填充类型">
          <el-select v-model="fillConfig.type" class="td-select-full">
            <el-option label="单值变量 (Single)" value="single" />
            <el-option label="列表多行 (Row)" value="row" />
            <el-option label="列表多列 (Col)" value="col" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmFillConfig">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import ExcelEditor from '@/components/ExcelEditor/index.vue';
import { http } from '@/api/http';

// Excel 编辑器组件引用
const excelEditorRef = ref<InstanceType<typeof ExcelEditor> | null>(null);
// 当前加载的模板数据
const currentTemplate = ref<any>(null);
// 字段映射配置列表
const mappingConfigList = ref<any[]>([]);

// 选中的报表ID
const selectedReport = ref('');
// 可用的字段列表
const availableFields = ref<any[]>([]);

// 配置弹窗可见性
const dialogVisible = ref(false);
// 字段填充配置
const fillConfig = ref({
  field: '',
  type: 'single',
  row: 0,
  col: 0
});

/**
 * 模板文件上传成功回调
 * @param response 服务端响应
 * @param uploadFile 上传的文件对象
 */
const handleUploadSuccess = (response: any, uploadFile: any) => {
  currentTemplate.value = response;
  mappingConfigList.value = response.mappingConfig ? JSON.parse(response.mappingConfig) : [];
  ElMessage.success('上传成功');
  
  if (excelEditorRef.value && uploadFile.raw) {
    excelEditorRef.value.loadExcelFile(uploadFile.raw);
  }
};

/**
 * 根据选择的报表加载对应字段
 */
const loadReportFields = async () => {
  // Mock 数据，实际应该调用 API 获取报表的列信息
  availableFields.value = [
    { prop: 'name', label: '姓名' },
    { prop: 'age', label: '年龄' },
    { prop: 'score', label: '分数' },
  ];
};

/**
 * 拖拽开始事件，设置拖拽数据
 * @param e 拖拽事件对象
 * @param field 被拖拽的字段
 */
const onDragStart = (e: DragEvent, field: any) => {
  if (e.dataTransfer) {
    e.dataTransfer.setData('text/plain', JSON.stringify({
      field: field.prop,
      label: field.label
    }));
  }
};

/**
 * 在编辑器内放置字段事件
 * @param payload 包含行列和字段信息的对象
 */
const onEditorDrop = (payload: { row: number, col: number, value: any }) => {
  fillConfig.value = {
    field: payload.value.field,
    type: 'single',
    row: payload.row,
    col: payload.col
  };
  dialogVisible.value = true;
};

/**
 * 确认填充配置，将标记写入单元格
 */
const confirmFillConfig = () => {
  mappingConfigList.value.push({ ...fillConfig.value });
  
  if (excelEditorRef.value) {
    const displayTag = `#{${fillConfig.value.field}:${fillConfig.value.type}}`;
    excelEditorRef.value.setCellValue(fillConfig.value.row, fillConfig.value.col, displayTag);
  }
  
  dialogVisible.value = false;
  ElMessage.success('已绑定字段');
};

/**
 * 保存模板的映射配置到服务端
 */
const saveMapping = async () => {
  if (!currentTemplate.value) return;
  
  try {
    await http.post(`/api/v1/admin/template/mapping/${currentTemplate.value.id}`, {
      mappingConfig: JSON.stringify(mappingConfigList.value)
    });
    ElMessage.success('模板保存成功');
  } catch (error) {
    ElMessage.error('保存失败');
  }
};
</script>

<style scoped>
/* 整体容器 */
.td-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* 顶部操作区 */
.td-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 16px;
  border-radius: 4px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}

/* 顶部左侧区域 */
.td-header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

/* 次要文本 */
.td-text-muted {
  font-size: 14px;
  color: #6b7280;
}

/* 中间主体区域 */
.td-body {
  flex: 1;
  display: flex;
  gap: 16px;
  overflow: hidden;
}

/* 左侧边栏 */
.td-sidebar {
  width: 256px;
  background: white;
  padding: 16px;
  border-radius: 4px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
}

/* 侧边栏标题 */
.td-sidebar-title {
  font-weight: bold;
  margin-bottom: 16px;
}

/* 字段列表容器 */
.td-field-list {
  flex: 1;
  overflow: auto;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  padding: 8px;
}

/* 可拖拽的字段项 */
.td-field-item {
  padding: 8px;
  margin-bottom: 8px;
  background-color: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 4px;
  cursor: move;
  font-size: 14px;
}

/* 空状态文本 */
.td-empty-text {
  color: #9ca3af;
  font-size: 14px;
  text-align: center;
  margin-top: 16px;
}

/* 右侧主设计器区域 */
.td-main {
  flex: 1;
  background: white;
  border-radius: 4px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
  overflow: hidden;
  border: 1px solid #e5e7eb;
}

/* 占满宽度的选择框 */
.td-select-full {
  width: 100%;
}
</style>