<!-- 模板设计器组件 -->
<template>
  <div class="td-layout-wrapper">
    <!-- 最左侧：导出模板列表栏 --> 
    <div class="td-sidebar" style="width: 256px;">
      <div class="td-sidebar-header">
        <div class="td-sidebar-title">导出模板列表</div>
      </div>
      <div class="td-field-list">
        <div class="td-empty-text">暂无导出模板</div>
      </div>
    </div>

    <!-- 右侧：设计器主体 -->
    <div class="td-main">
      <!-- 顶部工具栏 -->
      <div class="td-panel">
        <div class="td-toolbar">
          <div class="td-toolbar-left">
            <el-upload
              class="upload-demo"
              action="/api/v1/admin/template/upload"
              :show-file-list="false"
              :on-success="handleUploadSuccess"
            >
              <el-button type="primary">导入本地 Excel 文件</el-button>
            </el-upload>
            <el-input 
              v-if="currentTemplate"
              v-model="currentTemplate.name" 
              placeholder="请输入模板名称" 
              style="width: 200px;" 
            />
          </div>
          <div class="td-toolbar-right">
            <el-button type="default" @click="openDictSettings">字典设置</el-button>
            <el-button type="default" @click="openTempDataExport" :disabled="!currentTemplate">临时数据导出</el-button>
            <el-button type="primary" @click="exportTemplate" :disabled="!currentTemplate">导出</el-button>
            <el-button type="success" :disabled="!currentTemplate" @click="saveMapping">保存模板</el-button>
          </div>
        </div>
      </div>

      <!-- 中间主体内容区 -->
      <div class="td-body">
        <!-- 主设计器区域 -->
        <div class="td-main-content">
          <ExcelEditor ref="excelEditorRef" @drop="onEditorDrop" />
        </div>

        <!-- 右侧视图字段面板 -->
        <div class="td-sidebar" style="width: 256px;">
          <div class="td-sidebar-header">
            <div class="td-sidebar-title">视图字段</div>
          </div>
          <el-select v-model="selectedView" placeholder="请选择查询视图" @change="loadViewFields" style="margin-bottom: 12px; width: 100%;">
            <!-- 假设已有视图列表 -->
            <el-option label="示例查询视图1" value="1" />
          </el-select>
          
          <div class="td-field-list">
            <div 
              v-for="field in availableFields" 
              :key="field.prop"
              class="td-field-item"
            >
              <span>{{ field.label }} ({{ field.prop }})</span>
              <el-button type="primary" link @click="addField(field)" title="添加到当前选中单元格">
                <span style="font-size: 16px; font-weight: bold;">+</span>
              </el-button>
            </div>
            <div v-if="availableFields.length === 0" class="td-empty-text">
              请先选择查询视图加载字段
            </div>
          </div>
        </div>
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
    
    <!-- 临时数据导出弹窗 -->
    <el-dialog v-model="tempDataDialogVisible" title="临时数据导出" width="500px">
      <el-form label-position="top">
        <el-form-item label="请输入临时数据 (JSON 格式)">
          <el-input 
            v-model="tempDataJson" 
            type="textarea" 
            :rows="10" 
            placeholder='{"name": "张三", "age": 25, "score": 98}'
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="tempDataDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmTempDataExport">导出</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 字典设置弹窗 -->
    <el-dialog v-model="dictSettingsDialogVisible" title="字典设置" width="600px">
      <div class="td-empty-text" style="margin: 40px 0;">字典配置功能开发中...</div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dictSettingsDialogVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import { ExcelEditor } from '@ppr/components';
import { http } from '@ppr/core';

// Excel 编辑器组件引用
const excelEditorRef = ref<InstanceType<typeof ExcelEditor> | null>(null);
// 当前加载的模板数据
const currentTemplate = ref<any>(null);
// 字段映射配置列表
const mappingConfigList = ref<any[]>([]);

// 选中的查询视图ID
const selectedView = ref('');
// 可用的字段列表
const availableFields = ref<any[]>([]);

// 弹窗可见性及相关状态
const dialogVisible = ref(false);
const tempDataDialogVisible = ref(false);
const tempDataJson = ref('');
const dictSettingsDialogVisible = ref(false);

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
 * 根据选择的查询视图加载对应字段
 */
const loadViewFields = async () => {
  // Mock 数据，实际应该调用 API 获取视图的列信息
  availableFields.value = [
    { prop: 'name', label: '姓名' },
    { prop: 'age', label: '年龄' },
    { prop: 'score', label: '分数' },
  ];
};

/**
 * 临时数据导出
 */
const openTempDataExport = () => {
  tempDataJson.value = '';
  tempDataDialogVisible.value = true;
};

const confirmTempDataExport = () => {
  try {
    const data = JSON.parse(tempDataJson.value || '{}');
    ElMessage.success('临时数据导出请求已发送 (Mock)');
    tempDataDialogVisible.value = false;
  } catch (e) {
    ElMessage.error('JSON 格式错误，请检查');
  }
};

/**
 * 按照绑定视图导出
 */
const exportTemplate = () => {
  ElMessage.success('按照绑定视图导出请求已发送 (Mock)');
};

/**
 * 打开字典设置
 */
const openDictSettings = () => {
  dictSettingsDialogVisible.value = true;
};

/**
 * 添加字段到当前选中单元格
 * @param field 被添加的字段
 */
const addField = (field: any) => {
  if (excelEditorRef.value) {
    const currentCell = excelEditorRef.value.getCurrentCell();
    onEditorDrop({
      row: currentCell.row,
      col: currentCell.col,
      value: { field: field.prop, label: field.label }
    });
  } else {
    ElMessage.warning('请先等待编辑器加载完成');
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
.td-layout-wrapper {
  display: flex;
  gap: 16px;
  height: calc(100vh - 120px);
}

/* 侧边栏通用样式 */
.td-sidebar {
  display: flex;
  flex-direction: column;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  padding: 12px;
  background-color: #fff;
  flex-shrink: 0;
}

/* 侧边栏头部 */
.td-sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

/* 侧边栏标题 */
.td-sidebar-title {
  font-weight: 600;
}

/* 字段列表容器 */
.td-field-list {
  flex: 1;
  overflow: auto;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  padding: 8px;
}

/* 字段项 */
.td-field-item {
  padding: 8px;
  margin-bottom: 8px;
  background-color: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 4px;
  font-size: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 空状态文本 */
.td-empty-text {
  color: #9ca3af;
  font-size: 14px;
  text-align: center;
  margin-top: 16px;
}

/* 右侧主区域 */
.td-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

/* 面板样式 (如顶部工具栏) */
.td-panel {
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  padding: 12px;
  background-color: #fff;
  margin-bottom: 12px;
}

/* 工具栏样式 */
.td-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.td-toolbar-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.td-toolbar-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* 中间主体内容区 */
.td-body {
  flex: 1;
  display: flex;
  gap: 16px;
  min-height: 0;
}

/* Excel 设计器容器 */
.td-main-content {
  flex: 1;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  background-color: #fff;
  overflow: hidden;
}

/* 占满宽度的选择框 */
.td-select-full {
  width: 100%;
}
</style>