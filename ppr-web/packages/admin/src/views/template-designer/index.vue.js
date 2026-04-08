import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import { ExcelEditor } from '@ppr/components';
import { http } from '@ppr/core';
// Excel 编辑器组件引用
const excelEditorRef = ref(null);
// 当前加载的模板数据
const currentTemplate = ref(null);
// 字段映射配置列表
const mappingConfigList = ref([]);
// 选中的查询视图ID
const selectedView = ref('');
// 可用的字段列表
const availableFields = ref([]);
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
const handleUploadSuccess = (response, uploadFile) => {
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
    }
    catch (e) {
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
const addField = (field) => {
    if (excelEditorRef.value) {
        const currentCell = excelEditorRef.value.getCurrentCell();
        onEditorDrop({
            row: currentCell.row,
            col: currentCell.col,
            value: { field: field.prop, label: field.label }
        });
    }
    else {
        ElMessage.warning('请先等待编辑器加载完成');
    }
};
/**
 * 在编辑器内放置字段事件
 * @param payload 包含行列和字段信息的对象
 */
const onEditorDrop = (payload) => {
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
    if (!currentTemplate.value)
        return;
    try {
        await http.post(`/api/v1/admin/template/mapping/${currentTemplate.value.id}`, {
            mappingConfig: JSON.stringify(mappingConfigList.value)
        });
        ElMessage.success('模板保存成功');
    }
    catch (error) {
        ElMessage.error('保存失败');
    }
};
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "td-layout-wrapper" },
});
/** @type {__VLS_StyleScopedClasses['td-layout-wrapper']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "td-sidebar" },
    ...{ style: {} },
});
/** @type {__VLS_StyleScopedClasses['td-sidebar']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "td-sidebar-header" },
});
/** @type {__VLS_StyleScopedClasses['td-sidebar-header']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "td-sidebar-title" },
});
/** @type {__VLS_StyleScopedClasses['td-sidebar-title']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "td-field-list" },
});
/** @type {__VLS_StyleScopedClasses['td-field-list']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "td-empty-text" },
});
/** @type {__VLS_StyleScopedClasses['td-empty-text']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "td-main" },
});
/** @type {__VLS_StyleScopedClasses['td-main']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "td-panel" },
});
/** @type {__VLS_StyleScopedClasses['td-panel']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "td-toolbar" },
});
/** @type {__VLS_StyleScopedClasses['td-toolbar']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "td-toolbar-left" },
});
/** @type {__VLS_StyleScopedClasses['td-toolbar-left']} */ ;
let __VLS_0;
/** @ts-ignore @type {typeof __VLS_components.elUpload | typeof __VLS_components.ElUpload | typeof __VLS_components.elUpload | typeof __VLS_components.ElUpload} */
elUpload;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    ...{ class: "upload-demo" },
    action: "/api/v1/admin/template/upload",
    showFileList: (false),
    onSuccess: (__VLS_ctx.handleUploadSuccess),
}));
const __VLS_2 = __VLS_1({
    ...{ class: "upload-demo" },
    action: "/api/v1/admin/template/upload",
    showFileList: (false),
    onSuccess: (__VLS_ctx.handleUploadSuccess),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
/** @type {__VLS_StyleScopedClasses['upload-demo']} */ ;
const { default: __VLS_5 } = __VLS_3.slots;
let __VLS_6;
/** @ts-ignore @type {typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components.elButton | typeof __VLS_components.ElButton} */
elButton;
// @ts-ignore
const __VLS_7 = __VLS_asFunctionalComponent1(__VLS_6, new __VLS_6({
    type: "primary",
}));
const __VLS_8 = __VLS_7({
    type: "primary",
}, ...__VLS_functionalComponentArgsRest(__VLS_7));
const { default: __VLS_11 } = __VLS_9.slots;
// @ts-ignore
[handleUploadSuccess,];
var __VLS_9;
// @ts-ignore
[];
var __VLS_3;
if (__VLS_ctx.currentTemplate) {
    let __VLS_12;
    /** @ts-ignore @type {typeof __VLS_components.elInput | typeof __VLS_components.ElInput} */
    elInput;
    // @ts-ignore
    const __VLS_13 = __VLS_asFunctionalComponent1(__VLS_12, new __VLS_12({
        modelValue: (__VLS_ctx.currentTemplate.name),
        placeholder: "请输入模板名称",
        ...{ style: {} },
    }));
    const __VLS_14 = __VLS_13({
        modelValue: (__VLS_ctx.currentTemplate.name),
        placeholder: "请输入模板名称",
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_13));
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "td-toolbar-right" },
});
/** @type {__VLS_StyleScopedClasses['td-toolbar-right']} */ ;
let __VLS_17;
/** @ts-ignore @type {typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components.elButton | typeof __VLS_components.ElButton} */
elButton;
// @ts-ignore
const __VLS_18 = __VLS_asFunctionalComponent1(__VLS_17, new __VLS_17({
    ...{ 'onClick': {} },
    type: "default",
}));
const __VLS_19 = __VLS_18({
    ...{ 'onClick': {} },
    type: "default",
}, ...__VLS_functionalComponentArgsRest(__VLS_18));
let __VLS_22;
const __VLS_23 = ({ click: {} },
    { onClick: (__VLS_ctx.openDictSettings) });
const { default: __VLS_24 } = __VLS_20.slots;
// @ts-ignore
[currentTemplate, currentTemplate, openDictSettings,];
var __VLS_20;
var __VLS_21;
let __VLS_25;
/** @ts-ignore @type {typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components.elButton | typeof __VLS_components.ElButton} */
elButton;
// @ts-ignore
const __VLS_26 = __VLS_asFunctionalComponent1(__VLS_25, new __VLS_25({
    ...{ 'onClick': {} },
    type: "default",
    disabled: (!__VLS_ctx.currentTemplate),
}));
const __VLS_27 = __VLS_26({
    ...{ 'onClick': {} },
    type: "default",
    disabled: (!__VLS_ctx.currentTemplate),
}, ...__VLS_functionalComponentArgsRest(__VLS_26));
let __VLS_30;
const __VLS_31 = ({ click: {} },
    { onClick: (__VLS_ctx.openTempDataExport) });
const { default: __VLS_32 } = __VLS_28.slots;
// @ts-ignore
[currentTemplate, openTempDataExport,];
var __VLS_28;
var __VLS_29;
let __VLS_33;
/** @ts-ignore @type {typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components.elButton | typeof __VLS_components.ElButton} */
elButton;
// @ts-ignore
const __VLS_34 = __VLS_asFunctionalComponent1(__VLS_33, new __VLS_33({
    ...{ 'onClick': {} },
    type: "primary",
    disabled: (!__VLS_ctx.currentTemplate),
}));
const __VLS_35 = __VLS_34({
    ...{ 'onClick': {} },
    type: "primary",
    disabled: (!__VLS_ctx.currentTemplate),
}, ...__VLS_functionalComponentArgsRest(__VLS_34));
let __VLS_38;
const __VLS_39 = ({ click: {} },
    { onClick: (__VLS_ctx.exportTemplate) });
const { default: __VLS_40 } = __VLS_36.slots;
// @ts-ignore
[currentTemplate, exportTemplate,];
var __VLS_36;
var __VLS_37;
let __VLS_41;
/** @ts-ignore @type {typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components.elButton | typeof __VLS_components.ElButton} */
elButton;
// @ts-ignore
const __VLS_42 = __VLS_asFunctionalComponent1(__VLS_41, new __VLS_41({
    ...{ 'onClick': {} },
    type: "success",
    disabled: (!__VLS_ctx.currentTemplate),
}));
const __VLS_43 = __VLS_42({
    ...{ 'onClick': {} },
    type: "success",
    disabled: (!__VLS_ctx.currentTemplate),
}, ...__VLS_functionalComponentArgsRest(__VLS_42));
let __VLS_46;
const __VLS_47 = ({ click: {} },
    { onClick: (__VLS_ctx.saveMapping) });
const { default: __VLS_48 } = __VLS_44.slots;
// @ts-ignore
[currentTemplate, saveMapping,];
var __VLS_44;
var __VLS_45;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "td-body" },
});
/** @type {__VLS_StyleScopedClasses['td-body']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "td-main-content" },
});
/** @type {__VLS_StyleScopedClasses['td-main-content']} */ ;
let __VLS_49;
/** @ts-ignore @type {typeof __VLS_components.ExcelEditor} */
ExcelEditor;
// @ts-ignore
const __VLS_50 = __VLS_asFunctionalComponent1(__VLS_49, new __VLS_49({
    ...{ 'onDrop': {} },
    ref: "excelEditorRef",
}));
const __VLS_51 = __VLS_50({
    ...{ 'onDrop': {} },
    ref: "excelEditorRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_50));
let __VLS_54;
const __VLS_55 = ({ drop: {} },
    { onDrop: (__VLS_ctx.onEditorDrop) });
var __VLS_56 = {};
var __VLS_52;
var __VLS_53;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "td-sidebar" },
    ...{ style: {} },
});
/** @type {__VLS_StyleScopedClasses['td-sidebar']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "td-sidebar-header" },
});
/** @type {__VLS_StyleScopedClasses['td-sidebar-header']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "td-sidebar-title" },
});
/** @type {__VLS_StyleScopedClasses['td-sidebar-title']} */ ;
let __VLS_58;
/** @ts-ignore @type {typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect} */
elSelect;
// @ts-ignore
const __VLS_59 = __VLS_asFunctionalComponent1(__VLS_58, new __VLS_58({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.selectedView),
    placeholder: "请选择查询视图",
    ...{ style: {} },
}));
const __VLS_60 = __VLS_59({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.selectedView),
    placeholder: "请选择查询视图",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_59));
let __VLS_63;
const __VLS_64 = ({ change: {} },
    { onChange: (__VLS_ctx.loadViewFields) });
const { default: __VLS_65 } = __VLS_61.slots;
let __VLS_66;
/** @ts-ignore @type {typeof __VLS_components.elOption | typeof __VLS_components.ElOption} */
elOption;
// @ts-ignore
const __VLS_67 = __VLS_asFunctionalComponent1(__VLS_66, new __VLS_66({
    label: "示例查询视图1",
    value: "1",
}));
const __VLS_68 = __VLS_67({
    label: "示例查询视图1",
    value: "1",
}, ...__VLS_functionalComponentArgsRest(__VLS_67));
// @ts-ignore
[onEditorDrop, selectedView, loadViewFields,];
var __VLS_61;
var __VLS_62;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "td-field-list" },
});
/** @type {__VLS_StyleScopedClasses['td-field-list']} */ ;
for (const [field] of __VLS_vFor((__VLS_ctx.availableFields))) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        key: (field.prop),
        ...{ class: "td-field-item" },
    });
    /** @type {__VLS_StyleScopedClasses['td-field-item']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    (field.label);
    (field.prop);
    let __VLS_71;
    /** @ts-ignore @type {typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components.elButton | typeof __VLS_components.ElButton} */
    elButton;
    // @ts-ignore
    const __VLS_72 = __VLS_asFunctionalComponent1(__VLS_71, new __VLS_71({
        ...{ 'onClick': {} },
        type: "primary",
        link: true,
        title: "添加到当前选中单元格",
    }));
    const __VLS_73 = __VLS_72({
        ...{ 'onClick': {} },
        type: "primary",
        link: true,
        title: "添加到当前选中单元格",
    }, ...__VLS_functionalComponentArgsRest(__VLS_72));
    let __VLS_76;
    const __VLS_77 = ({ click: {} },
        { onClick: (...[$event]) => {
                __VLS_ctx.addField(field);
                // @ts-ignore
                [availableFields, addField,];
            } });
    const { default: __VLS_78 } = __VLS_74.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ style: {} },
    });
    // @ts-ignore
    [];
    var __VLS_74;
    var __VLS_75;
    // @ts-ignore
    [];
}
if (__VLS_ctx.availableFields.length === 0) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "td-empty-text" },
    });
    /** @type {__VLS_StyleScopedClasses['td-empty-text']} */ ;
}
let __VLS_79;
/** @ts-ignore @type {typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog} */
elDialog;
// @ts-ignore
const __VLS_80 = __VLS_asFunctionalComponent1(__VLS_79, new __VLS_79({
    modelValue: (__VLS_ctx.dialogVisible),
    title: "配置填充类型",
    width: "400px",
}));
const __VLS_81 = __VLS_80({
    modelValue: (__VLS_ctx.dialogVisible),
    title: "配置填充类型",
    width: "400px",
}, ...__VLS_functionalComponentArgsRest(__VLS_80));
const { default: __VLS_84 } = __VLS_82.slots;
let __VLS_85;
/** @ts-ignore @type {typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components.elForm | typeof __VLS_components.ElForm} */
elForm;
// @ts-ignore
const __VLS_86 = __VLS_asFunctionalComponent1(__VLS_85, new __VLS_85({
    model: (__VLS_ctx.fillConfig),
    labelWidth: "100px",
}));
const __VLS_87 = __VLS_86({
    model: (__VLS_ctx.fillConfig),
    labelWidth: "100px",
}, ...__VLS_functionalComponentArgsRest(__VLS_86));
const { default: __VLS_90 } = __VLS_88.slots;
let __VLS_91;
/** @ts-ignore @type {typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem} */
elFormItem;
// @ts-ignore
const __VLS_92 = __VLS_asFunctionalComponent1(__VLS_91, new __VLS_91({
    label: "字段标识",
}));
const __VLS_93 = __VLS_92({
    label: "字段标识",
}, ...__VLS_functionalComponentArgsRest(__VLS_92));
const { default: __VLS_96 } = __VLS_94.slots;
let __VLS_97;
/** @ts-ignore @type {typeof __VLS_components.elInput | typeof __VLS_components.ElInput} */
elInput;
// @ts-ignore
const __VLS_98 = __VLS_asFunctionalComponent1(__VLS_97, new __VLS_97({
    modelValue: (__VLS_ctx.fillConfig.field),
    disabled: true,
}));
const __VLS_99 = __VLS_98({
    modelValue: (__VLS_ctx.fillConfig.field),
    disabled: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_98));
// @ts-ignore
[availableFields, dialogVisible, fillConfig, fillConfig,];
var __VLS_94;
let __VLS_102;
/** @ts-ignore @type {typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem} */
elFormItem;
// @ts-ignore
const __VLS_103 = __VLS_asFunctionalComponent1(__VLS_102, new __VLS_102({
    label: "填充类型",
}));
const __VLS_104 = __VLS_103({
    label: "填充类型",
}, ...__VLS_functionalComponentArgsRest(__VLS_103));
const { default: __VLS_107 } = __VLS_105.slots;
let __VLS_108;
/** @ts-ignore @type {typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect} */
elSelect;
// @ts-ignore
const __VLS_109 = __VLS_asFunctionalComponent1(__VLS_108, new __VLS_108({
    modelValue: (__VLS_ctx.fillConfig.type),
    ...{ class: "td-select-full" },
}));
const __VLS_110 = __VLS_109({
    modelValue: (__VLS_ctx.fillConfig.type),
    ...{ class: "td-select-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_109));
/** @type {__VLS_StyleScopedClasses['td-select-full']} */ ;
const { default: __VLS_113 } = __VLS_111.slots;
let __VLS_114;
/** @ts-ignore @type {typeof __VLS_components.elOption | typeof __VLS_components.ElOption} */
elOption;
// @ts-ignore
const __VLS_115 = __VLS_asFunctionalComponent1(__VLS_114, new __VLS_114({
    label: "单值变量 (Single)",
    value: "single",
}));
const __VLS_116 = __VLS_115({
    label: "单值变量 (Single)",
    value: "single",
}, ...__VLS_functionalComponentArgsRest(__VLS_115));
let __VLS_119;
/** @ts-ignore @type {typeof __VLS_components.elOption | typeof __VLS_components.ElOption} */
elOption;
// @ts-ignore
const __VLS_120 = __VLS_asFunctionalComponent1(__VLS_119, new __VLS_119({
    label: "列表多行 (Row)",
    value: "row",
}));
const __VLS_121 = __VLS_120({
    label: "列表多行 (Row)",
    value: "row",
}, ...__VLS_functionalComponentArgsRest(__VLS_120));
let __VLS_124;
/** @ts-ignore @type {typeof __VLS_components.elOption | typeof __VLS_components.ElOption} */
elOption;
// @ts-ignore
const __VLS_125 = __VLS_asFunctionalComponent1(__VLS_124, new __VLS_124({
    label: "列表多列 (Col)",
    value: "col",
}));
const __VLS_126 = __VLS_125({
    label: "列表多列 (Col)",
    value: "col",
}, ...__VLS_functionalComponentArgsRest(__VLS_125));
// @ts-ignore
[fillConfig,];
var __VLS_111;
// @ts-ignore
[];
var __VLS_105;
// @ts-ignore
[];
var __VLS_88;
{
    const { footer: __VLS_129 } = __VLS_82.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "dialog-footer" },
    });
    /** @type {__VLS_StyleScopedClasses['dialog-footer']} */ ;
    let __VLS_130;
    /** @ts-ignore @type {typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components.elButton | typeof __VLS_components.ElButton} */
    elButton;
    // @ts-ignore
    const __VLS_131 = __VLS_asFunctionalComponent1(__VLS_130, new __VLS_130({
        ...{ 'onClick': {} },
    }));
    const __VLS_132 = __VLS_131({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_131));
    let __VLS_135;
    const __VLS_136 = ({ click: {} },
        { onClick: (...[$event]) => {
                __VLS_ctx.dialogVisible = false;
                // @ts-ignore
                [dialogVisible,];
            } });
    const { default: __VLS_137 } = __VLS_133.slots;
    // @ts-ignore
    [];
    var __VLS_133;
    var __VLS_134;
    let __VLS_138;
    /** @ts-ignore @type {typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components.elButton | typeof __VLS_components.ElButton} */
    elButton;
    // @ts-ignore
    const __VLS_139 = __VLS_asFunctionalComponent1(__VLS_138, new __VLS_138({
        ...{ 'onClick': {} },
        type: "primary",
    }));
    const __VLS_140 = __VLS_139({
        ...{ 'onClick': {} },
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_139));
    let __VLS_143;
    const __VLS_144 = ({ click: {} },
        { onClick: (__VLS_ctx.confirmFillConfig) });
    const { default: __VLS_145 } = __VLS_141.slots;
    // @ts-ignore
    [confirmFillConfig,];
    var __VLS_141;
    var __VLS_142;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_82;
let __VLS_146;
/** @ts-ignore @type {typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog} */
elDialog;
// @ts-ignore
const __VLS_147 = __VLS_asFunctionalComponent1(__VLS_146, new __VLS_146({
    modelValue: (__VLS_ctx.tempDataDialogVisible),
    title: "临时数据导出",
    width: "500px",
}));
const __VLS_148 = __VLS_147({
    modelValue: (__VLS_ctx.tempDataDialogVisible),
    title: "临时数据导出",
    width: "500px",
}, ...__VLS_functionalComponentArgsRest(__VLS_147));
const { default: __VLS_151 } = __VLS_149.slots;
let __VLS_152;
/** @ts-ignore @type {typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components.elForm | typeof __VLS_components.ElForm} */
elForm;
// @ts-ignore
const __VLS_153 = __VLS_asFunctionalComponent1(__VLS_152, new __VLS_152({
    labelPosition: "top",
}));
const __VLS_154 = __VLS_153({
    labelPosition: "top",
}, ...__VLS_functionalComponentArgsRest(__VLS_153));
const { default: __VLS_157 } = __VLS_155.slots;
let __VLS_158;
/** @ts-ignore @type {typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem} */
elFormItem;
// @ts-ignore
const __VLS_159 = __VLS_asFunctionalComponent1(__VLS_158, new __VLS_158({
    label: "请输入临时数据 (JSON 格式)",
}));
const __VLS_160 = __VLS_159({
    label: "请输入临时数据 (JSON 格式)",
}, ...__VLS_functionalComponentArgsRest(__VLS_159));
const { default: __VLS_163 } = __VLS_161.slots;
let __VLS_164;
/** @ts-ignore @type {typeof __VLS_components.elInput | typeof __VLS_components.ElInput} */
elInput;
// @ts-ignore
const __VLS_165 = __VLS_asFunctionalComponent1(__VLS_164, new __VLS_164({
    modelValue: (__VLS_ctx.tempDataJson),
    type: "textarea",
    rows: (10),
    placeholder: '{"name": "张三", "age": 25, "score": 98}',
}));
const __VLS_166 = __VLS_165({
    modelValue: (__VLS_ctx.tempDataJson),
    type: "textarea",
    rows: (10),
    placeholder: '{"name": "张三", "age": 25, "score": 98}',
}, ...__VLS_functionalComponentArgsRest(__VLS_165));
// @ts-ignore
[tempDataDialogVisible, tempDataJson,];
var __VLS_161;
// @ts-ignore
[];
var __VLS_155;
{
    const { footer: __VLS_169 } = __VLS_149.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "dialog-footer" },
    });
    /** @type {__VLS_StyleScopedClasses['dialog-footer']} */ ;
    let __VLS_170;
    /** @ts-ignore @type {typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components.elButton | typeof __VLS_components.ElButton} */
    elButton;
    // @ts-ignore
    const __VLS_171 = __VLS_asFunctionalComponent1(__VLS_170, new __VLS_170({
        ...{ 'onClick': {} },
    }));
    const __VLS_172 = __VLS_171({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_171));
    let __VLS_175;
    const __VLS_176 = ({ click: {} },
        { onClick: (...[$event]) => {
                __VLS_ctx.tempDataDialogVisible = false;
                // @ts-ignore
                [tempDataDialogVisible,];
            } });
    const { default: __VLS_177 } = __VLS_173.slots;
    // @ts-ignore
    [];
    var __VLS_173;
    var __VLS_174;
    let __VLS_178;
    /** @ts-ignore @type {typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components.elButton | typeof __VLS_components.ElButton} */
    elButton;
    // @ts-ignore
    const __VLS_179 = __VLS_asFunctionalComponent1(__VLS_178, new __VLS_178({
        ...{ 'onClick': {} },
        type: "primary",
    }));
    const __VLS_180 = __VLS_179({
        ...{ 'onClick': {} },
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_179));
    let __VLS_183;
    const __VLS_184 = ({ click: {} },
        { onClick: (__VLS_ctx.confirmTempDataExport) });
    const { default: __VLS_185 } = __VLS_181.slots;
    // @ts-ignore
    [confirmTempDataExport,];
    var __VLS_181;
    var __VLS_182;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_149;
let __VLS_186;
/** @ts-ignore @type {typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog} */
elDialog;
// @ts-ignore
const __VLS_187 = __VLS_asFunctionalComponent1(__VLS_186, new __VLS_186({
    modelValue: (__VLS_ctx.dictSettingsDialogVisible),
    title: "字典设置",
    width: "600px",
}));
const __VLS_188 = __VLS_187({
    modelValue: (__VLS_ctx.dictSettingsDialogVisible),
    title: "字典设置",
    width: "600px",
}, ...__VLS_functionalComponentArgsRest(__VLS_187));
const { default: __VLS_191 } = __VLS_189.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "td-empty-text" },
    ...{ style: {} },
});
/** @type {__VLS_StyleScopedClasses['td-empty-text']} */ ;
{
    const { footer: __VLS_192 } = __VLS_189.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "dialog-footer" },
    });
    /** @type {__VLS_StyleScopedClasses['dialog-footer']} */ ;
    let __VLS_193;
    /** @ts-ignore @type {typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components.elButton | typeof __VLS_components.ElButton} */
    elButton;
    // @ts-ignore
    const __VLS_194 = __VLS_asFunctionalComponent1(__VLS_193, new __VLS_193({
        ...{ 'onClick': {} },
    }));
    const __VLS_195 = __VLS_194({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_194));
    let __VLS_198;
    const __VLS_199 = ({ click: {} },
        { onClick: (...[$event]) => {
                __VLS_ctx.dictSettingsDialogVisible = false;
                // @ts-ignore
                [dictSettingsDialogVisible, dictSettingsDialogVisible,];
            } });
    const { default: __VLS_200 } = __VLS_196.slots;
    // @ts-ignore
    [];
    var __VLS_196;
    var __VLS_197;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_189;
// @ts-ignore
var __VLS_57 = __VLS_56;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
//# sourceMappingURL=index.vue.js.map