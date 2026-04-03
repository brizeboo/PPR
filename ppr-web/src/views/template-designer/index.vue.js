import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import ExcelEditor from '@/components/ExcelEditor/index.vue';
import { http } from '@/api/http';
// Excel 编辑器组件引用
const excelEditorRef = ref(null);
// 当前加载的模板数据
const currentTemplate = ref(null);
// 字段映射配置列表
const mappingConfigList = ref([]);
// 选中的报表ID
const selectedReport = ref('');
// 可用的字段列表
const availableFields = ref([]);
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
const handleUploadSuccess = (response, uploadFile) => {
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
const onDragStart = (e, field) => {
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
    ...{ class: "td-container" },
});
/** @type {__VLS_StyleScopedClasses['td-container']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "td-header" },
});
/** @type {__VLS_StyleScopedClasses['td-header']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "td-header-left" },
});
/** @type {__VLS_StyleScopedClasses['td-header-left']} */ ;
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
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "td-text-muted" },
    });
    /** @type {__VLS_StyleScopedClasses['td-text-muted']} */ ;
    (__VLS_ctx.currentTemplate.name);
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
let __VLS_12;
/** @ts-ignore @type {typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components.elButton | typeof __VLS_components.ElButton} */
elButton;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent1(__VLS_12, new __VLS_12({
    ...{ 'onClick': {} },
    type: "success",
    disabled: (!__VLS_ctx.currentTemplate),
}));
const __VLS_14 = __VLS_13({
    ...{ 'onClick': {} },
    type: "success",
    disabled: (!__VLS_ctx.currentTemplate),
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
let __VLS_17;
const __VLS_18 = ({ click: {} },
    { onClick: (__VLS_ctx.saveMapping) });
const { default: __VLS_19 } = __VLS_15.slots;
// @ts-ignore
[currentTemplate, currentTemplate, currentTemplate, saveMapping,];
var __VLS_15;
var __VLS_16;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "td-body" },
});
/** @type {__VLS_StyleScopedClasses['td-body']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "td-sidebar" },
});
/** @type {__VLS_StyleScopedClasses['td-sidebar']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "td-sidebar-title" },
});
/** @type {__VLS_StyleScopedClasses['td-sidebar-title']} */ ;
let __VLS_20;
/** @ts-ignore @type {typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect} */
elSelect;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent1(__VLS_20, new __VLS_20({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.selectedReport),
    placeholder: "请选择报表",
    ...{ style: {} },
}));
const __VLS_22 = __VLS_21({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.selectedReport),
    placeholder: "请选择报表",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
let __VLS_25;
const __VLS_26 = ({ change: {} },
    { onChange: (__VLS_ctx.loadReportFields) });
const { default: __VLS_27 } = __VLS_23.slots;
let __VLS_28;
/** @ts-ignore @type {typeof __VLS_components.elOption | typeof __VLS_components.ElOption} */
elOption;
// @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent1(__VLS_28, new __VLS_28({
    label: "示例报表1",
    value: "1",
}));
const __VLS_30 = __VLS_29({
    label: "示例报表1",
    value: "1",
}, ...__VLS_functionalComponentArgsRest(__VLS_29));
// @ts-ignore
[selectedReport, loadReportFields,];
var __VLS_23;
var __VLS_24;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "td-field-list" },
});
/** @type {__VLS_StyleScopedClasses['td-field-list']} */ ;
for (const [field] of __VLS_vFor((__VLS_ctx.availableFields))) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ onDragstart: (...[$event]) => {
                __VLS_ctx.onDragStart($event, field);
                // @ts-ignore
                [availableFields, onDragStart,];
            } },
        key: (field.prop),
        ...{ class: "td-field-item" },
        draggable: "true",
    });
    /** @type {__VLS_StyleScopedClasses['td-field-item']} */ ;
    (field.label);
    (field.prop);
    // @ts-ignore
    [];
}
if (__VLS_ctx.availableFields.length === 0) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "td-empty-text" },
    });
    /** @type {__VLS_StyleScopedClasses['td-empty-text']} */ ;
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "td-main" },
});
/** @type {__VLS_StyleScopedClasses['td-main']} */ ;
const __VLS_33 = ExcelEditor;
// @ts-ignore
const __VLS_34 = __VLS_asFunctionalComponent1(__VLS_33, new __VLS_33({
    ...{ 'onDrop': {} },
    ref: "excelEditorRef",
}));
const __VLS_35 = __VLS_34({
    ...{ 'onDrop': {} },
    ref: "excelEditorRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_34));
let __VLS_38;
const __VLS_39 = ({ drop: {} },
    { onDrop: (__VLS_ctx.onEditorDrop) });
var __VLS_40 = {};
var __VLS_36;
var __VLS_37;
let __VLS_42;
/** @ts-ignore @type {typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog} */
elDialog;
// @ts-ignore
const __VLS_43 = __VLS_asFunctionalComponent1(__VLS_42, new __VLS_42({
    modelValue: (__VLS_ctx.dialogVisible),
    title: "配置填充类型",
    width: "400px",
}));
const __VLS_44 = __VLS_43({
    modelValue: (__VLS_ctx.dialogVisible),
    title: "配置填充类型",
    width: "400px",
}, ...__VLS_functionalComponentArgsRest(__VLS_43));
const { default: __VLS_47 } = __VLS_45.slots;
let __VLS_48;
/** @ts-ignore @type {typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components.elForm | typeof __VLS_components.ElForm} */
elForm;
// @ts-ignore
const __VLS_49 = __VLS_asFunctionalComponent1(__VLS_48, new __VLS_48({
    model: (__VLS_ctx.fillConfig),
    labelWidth: "100px",
}));
const __VLS_50 = __VLS_49({
    model: (__VLS_ctx.fillConfig),
    labelWidth: "100px",
}, ...__VLS_functionalComponentArgsRest(__VLS_49));
const { default: __VLS_53 } = __VLS_51.slots;
let __VLS_54;
/** @ts-ignore @type {typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem} */
elFormItem;
// @ts-ignore
const __VLS_55 = __VLS_asFunctionalComponent1(__VLS_54, new __VLS_54({
    label: "字段标识",
}));
const __VLS_56 = __VLS_55({
    label: "字段标识",
}, ...__VLS_functionalComponentArgsRest(__VLS_55));
const { default: __VLS_59 } = __VLS_57.slots;
let __VLS_60;
/** @ts-ignore @type {typeof __VLS_components.elInput | typeof __VLS_components.ElInput} */
elInput;
// @ts-ignore
const __VLS_61 = __VLS_asFunctionalComponent1(__VLS_60, new __VLS_60({
    modelValue: (__VLS_ctx.fillConfig.field),
    disabled: true,
}));
const __VLS_62 = __VLS_61({
    modelValue: (__VLS_ctx.fillConfig.field),
    disabled: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_61));
// @ts-ignore
[availableFields, onEditorDrop, dialogVisible, fillConfig, fillConfig,];
var __VLS_57;
let __VLS_65;
/** @ts-ignore @type {typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem} */
elFormItem;
// @ts-ignore
const __VLS_66 = __VLS_asFunctionalComponent1(__VLS_65, new __VLS_65({
    label: "填充类型",
}));
const __VLS_67 = __VLS_66({
    label: "填充类型",
}, ...__VLS_functionalComponentArgsRest(__VLS_66));
const { default: __VLS_70 } = __VLS_68.slots;
let __VLS_71;
/** @ts-ignore @type {typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect} */
elSelect;
// @ts-ignore
const __VLS_72 = __VLS_asFunctionalComponent1(__VLS_71, new __VLS_71({
    modelValue: (__VLS_ctx.fillConfig.type),
    ...{ class: "td-select-full" },
}));
const __VLS_73 = __VLS_72({
    modelValue: (__VLS_ctx.fillConfig.type),
    ...{ class: "td-select-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_72));
/** @type {__VLS_StyleScopedClasses['td-select-full']} */ ;
const { default: __VLS_76 } = __VLS_74.slots;
let __VLS_77;
/** @ts-ignore @type {typeof __VLS_components.elOption | typeof __VLS_components.ElOption} */
elOption;
// @ts-ignore
const __VLS_78 = __VLS_asFunctionalComponent1(__VLS_77, new __VLS_77({
    label: "单值变量 (Single)",
    value: "single",
}));
const __VLS_79 = __VLS_78({
    label: "单值变量 (Single)",
    value: "single",
}, ...__VLS_functionalComponentArgsRest(__VLS_78));
let __VLS_82;
/** @ts-ignore @type {typeof __VLS_components.elOption | typeof __VLS_components.ElOption} */
elOption;
// @ts-ignore
const __VLS_83 = __VLS_asFunctionalComponent1(__VLS_82, new __VLS_82({
    label: "列表多行 (Row)",
    value: "row",
}));
const __VLS_84 = __VLS_83({
    label: "列表多行 (Row)",
    value: "row",
}, ...__VLS_functionalComponentArgsRest(__VLS_83));
let __VLS_87;
/** @ts-ignore @type {typeof __VLS_components.elOption | typeof __VLS_components.ElOption} */
elOption;
// @ts-ignore
const __VLS_88 = __VLS_asFunctionalComponent1(__VLS_87, new __VLS_87({
    label: "列表多列 (Col)",
    value: "col",
}));
const __VLS_89 = __VLS_88({
    label: "列表多列 (Col)",
    value: "col",
}, ...__VLS_functionalComponentArgsRest(__VLS_88));
// @ts-ignore
[fillConfig,];
var __VLS_74;
// @ts-ignore
[];
var __VLS_68;
// @ts-ignore
[];
var __VLS_51;
{
    const { footer: __VLS_92 } = __VLS_45.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "dialog-footer" },
    });
    /** @type {__VLS_StyleScopedClasses['dialog-footer']} */ ;
    let __VLS_93;
    /** @ts-ignore @type {typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components.elButton | typeof __VLS_components.ElButton} */
    elButton;
    // @ts-ignore
    const __VLS_94 = __VLS_asFunctionalComponent1(__VLS_93, new __VLS_93({
        ...{ 'onClick': {} },
    }));
    const __VLS_95 = __VLS_94({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_94));
    let __VLS_98;
    const __VLS_99 = ({ click: {} },
        { onClick: (...[$event]) => {
                __VLS_ctx.dialogVisible = false;
                // @ts-ignore
                [dialogVisible,];
            } });
    const { default: __VLS_100 } = __VLS_96.slots;
    // @ts-ignore
    [];
    var __VLS_96;
    var __VLS_97;
    let __VLS_101;
    /** @ts-ignore @type {typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components.elButton | typeof __VLS_components.ElButton} */
    elButton;
    // @ts-ignore
    const __VLS_102 = __VLS_asFunctionalComponent1(__VLS_101, new __VLS_101({
        ...{ 'onClick': {} },
        type: "primary",
    }));
    const __VLS_103 = __VLS_102({
        ...{ 'onClick': {} },
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_102));
    let __VLS_106;
    const __VLS_107 = ({ click: {} },
        { onClick: (__VLS_ctx.confirmFillConfig) });
    const { default: __VLS_108 } = __VLS_104.slots;
    // @ts-ignore
    [confirmFillConfig,];
    var __VLS_104;
    var __VLS_105;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_45;
// @ts-ignore
var __VLS_41 = __VLS_40;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
//# sourceMappingURL=index.vue.js.map