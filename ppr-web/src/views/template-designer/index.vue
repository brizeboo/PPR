<template>
  <div class="h-full flex flex-col gap-4">
    <div class="flex justify-between items-center bg-white p-4 rounded shadow-sm">
      <div class="flex items-center gap-4">
        <el-upload
          class="upload-demo"
          action="/api/v1/admin/template/upload"
          :show-file-list="false"
          :on-success="handleUploadSuccess"
        >
          <el-button type="primary">导入本地 Excel 文件</el-button>
        </el-upload>
        <span v-if="currentTemplate" class="text-sm text-gray-500">
          当前模板：{{ currentTemplate.name }}
        </span>
      </div>
      <div>
        <el-button type="success" :disabled="!currentTemplate" @click="saveMapping">保存模板</el-button>
      </div>
    </div>

    <div class="flex-1 flex gap-4 overflow-hidden">
      <!-- 左侧数据源面板 -->
      <div class="w-64 bg-white p-4 rounded shadow-sm flex flex-col">
        <div class="font-bold mb-4">数据源字段</div>
        <el-select v-model="selectedReport" placeholder="请选择报表" @change="loadReportFields" class="mb-4">
          <!-- 假设已有报表列表 -->
          <el-option label="示例报表1" value="1" />
        </el-select>
        
        <div class="flex-1 overflow-auto border rounded p-2">
          <div 
            v-for="field in availableFields" 
            :key="field.prop"
            class="p-2 mb-2 bg-blue-50 border border-blue-200 rounded cursor-move text-sm"
            draggable="true"
            @dragstart="onDragStart($event, field)"
          >
            {{ field.label }} ({{ field.prop }})
          </div>
          <div v-if="availableFields.length === 0" class="text-gray-400 text-sm text-center mt-4">
            请先选择报表加载字段
          </div>
        </div>
      </div>

      <!-- 右侧 Excel 设计器 -->
      <div class="flex-1 bg-white rounded shadow-sm overflow-hidden border">
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
          <el-select v-model="fillConfig.type" class="w-full">
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

const excelEditorRef = ref<InstanceType<typeof ExcelEditor> | null>(null);
const currentTemplate = ref<any>(null);
const mappingConfigList = ref<any[]>([]);

const selectedReport = ref('');
const availableFields = ref<any[]>([]);

const dialogVisible = ref(false);
const fillConfig = ref({
  field: '',
  type: 'single',
  row: 0,
  col: 0
});

const handleUploadSuccess = (response: any, uploadFile: any) => {
  currentTemplate.value = response;
  mappingConfigList.value = response.mappingConfig ? JSON.parse(response.mappingConfig) : [];
  ElMessage.success('上传成功');
  
  if (excelEditorRef.value && uploadFile.raw) {
    excelEditorRef.value.loadExcelFile(uploadFile.raw);
  }
};

const loadReportFields = async () => {
  // Mock 数据，实际应该调用 API 获取报表的列信息
  availableFields.value = [
    { prop: 'name', label: '姓名' },
    { prop: 'age', label: '年龄' },
    { prop: 'score', label: '分数' },
  ];
};

const onDragStart = (e: DragEvent, field: any) => {
  if (e.dataTransfer) {
    e.dataTransfer.setData('text/plain', JSON.stringify({
      field: field.prop,
      label: field.label
    }));
  }
};

const onEditorDrop = (payload: { row: number, col: number, value: any }) => {
  fillConfig.value = {
    field: payload.value.field,
    type: 'single',
    row: payload.row,
    col: payload.col
  };
  dialogVisible.value = true;
};

const confirmFillConfig = () => {
  mappingConfigList.value.push({ ...fillConfig.value });
  
  if (excelEditorRef.value) {
    const displayTag = `#{${fillConfig.value.field}:${fillConfig.value.type}}`;
    excelEditorRef.value.setCellValue(fillConfig.value.row, fillConfig.value.col, displayTag);
  }
  
  dialogVisible.value = false;
  ElMessage.success('已绑定字段');
};

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