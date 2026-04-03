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
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "td-container" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "td-header" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "td-header-left" },
});
const __VLS_0 = {}.ElUpload;
/** @type {[typeof __VLS_components.ElUpload, typeof __VLS_components.elUpload, typeof __VLS_components.ElUpload, typeof __VLS_components.elUpload, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
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
__VLS_3.slots.default;
const __VLS_4 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
    type: "primary",
}));
const __VLS_6 = __VLS_5({
    type: "primary",
}, ...__VLS_functionalComponentArgsRest(__VLS_5));
__VLS_7.slots.default;
var __VLS_7;
var __VLS_3;
if (__VLS_ctx.currentTemplate) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "td-text-muted" },
    });
    (__VLS_ctx.currentTemplate.name);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
const __VLS_8 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
    ...{ 'onClick': {} },
    type: "success",
    disabled: (!__VLS_ctx.currentTemplate),
}));
const __VLS_10 = __VLS_9({
    ...{ 'onClick': {} },
    type: "success",
    disabled: (!__VLS_ctx.currentTemplate),
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
let __VLS_12;
let __VLS_13;
let __VLS_14;
const __VLS_15 = {
    onClick: (__VLS_ctx.saveMapping)
};
__VLS_11.slots.default;
var __VLS_11;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "td-body" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "td-sidebar" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "td-sidebar-title" },
});
const __VLS_16 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.selectedReport),
    placeholder: "请选择报表",
    ...{ style: {} },
}));
const __VLS_18 = __VLS_17({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.selectedReport),
    placeholder: "请选择报表",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
let __VLS_20;
let __VLS_21;
let __VLS_22;
const __VLS_23 = {
    onChange: (__VLS_ctx.loadReportFields)
};
__VLS_19.slots.default;
const __VLS_24 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
    label: "示例报表1",
    value: "1",
}));
const __VLS_26 = __VLS_25({
    label: "示例报表1",
    value: "1",
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
var __VLS_19;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "td-field-list" },
});
for (const [field] of __VLS_getVForSourceType((__VLS_ctx.availableFields))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ onDragstart: (...[$event]) => {
                __VLS_ctx.onDragStart($event, field);
            } },
        key: (field.prop),
        ...{ class: "td-field-item" },
        draggable: "true",
    });
    (field.label);
    (field.prop);
}
if (__VLS_ctx.availableFields.length === 0) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "td-empty-text" },
    });
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "td-main" },
});
/** @type {[typeof ExcelEditor, ]} */ ;
// @ts-ignore
const __VLS_28 = __VLS_asFunctionalComponent(ExcelEditor, new ExcelEditor({
    ...{ 'onDrop': {} },
    ref: "excelEditorRef",
}));
const __VLS_29 = __VLS_28({
    ...{ 'onDrop': {} },
    ref: "excelEditorRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_28));
let __VLS_31;
let __VLS_32;
let __VLS_33;
const __VLS_34 = {
    onDrop: (__VLS_ctx.onEditorDrop)
};
/** @type {typeof __VLS_ctx.excelEditorRef} */ ;
var __VLS_35 = {};
var __VLS_30;
const __VLS_37 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_38 = __VLS_asFunctionalComponent(__VLS_37, new __VLS_37({
    modelValue: (__VLS_ctx.dialogVisible),
    title: "配置填充类型",
    width: "400px",
}));
const __VLS_39 = __VLS_38({
    modelValue: (__VLS_ctx.dialogVisible),
    title: "配置填充类型",
    width: "400px",
}, ...__VLS_functionalComponentArgsRest(__VLS_38));
__VLS_40.slots.default;
const __VLS_41 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_42 = __VLS_asFunctionalComponent(__VLS_41, new __VLS_41({
    model: (__VLS_ctx.fillConfig),
    labelWidth: "100px",
}));
const __VLS_43 = __VLS_42({
    model: (__VLS_ctx.fillConfig),
    labelWidth: "100px",
}, ...__VLS_functionalComponentArgsRest(__VLS_42));
__VLS_44.slots.default;
const __VLS_45 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_46 = __VLS_asFunctionalComponent(__VLS_45, new __VLS_45({
    label: "字段标识",
}));
const __VLS_47 = __VLS_46({
    label: "字段标识",
}, ...__VLS_functionalComponentArgsRest(__VLS_46));
__VLS_48.slots.default;
const __VLS_49 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_50 = __VLS_asFunctionalComponent(__VLS_49, new __VLS_49({
    modelValue: (__VLS_ctx.fillConfig.field),
    disabled: true,
}));
const __VLS_51 = __VLS_50({
    modelValue: (__VLS_ctx.fillConfig.field),
    disabled: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_50));
var __VLS_48;
const __VLS_53 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_54 = __VLS_asFunctionalComponent(__VLS_53, new __VLS_53({
    label: "填充类型",
}));
const __VLS_55 = __VLS_54({
    label: "填充类型",
}, ...__VLS_functionalComponentArgsRest(__VLS_54));
__VLS_56.slots.default;
const __VLS_57 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_58 = __VLS_asFunctionalComponent(__VLS_57, new __VLS_57({
    modelValue: (__VLS_ctx.fillConfig.type),
    ...{ class: "td-select-full" },
}));
const __VLS_59 = __VLS_58({
    modelValue: (__VLS_ctx.fillConfig.type),
    ...{ class: "td-select-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_58));
__VLS_60.slots.default;
const __VLS_61 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_62 = __VLS_asFunctionalComponent(__VLS_61, new __VLS_61({
    label: "单值变量 (Single)",
    value: "single",
}));
const __VLS_63 = __VLS_62({
    label: "单值变量 (Single)",
    value: "single",
}, ...__VLS_functionalComponentArgsRest(__VLS_62));
const __VLS_65 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_66 = __VLS_asFunctionalComponent(__VLS_65, new __VLS_65({
    label: "列表多行 (Row)",
    value: "row",
}));
const __VLS_67 = __VLS_66({
    label: "列表多行 (Row)",
    value: "row",
}, ...__VLS_functionalComponentArgsRest(__VLS_66));
const __VLS_69 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_70 = __VLS_asFunctionalComponent(__VLS_69, new __VLS_69({
    label: "列表多列 (Col)",
    value: "col",
}));
const __VLS_71 = __VLS_70({
    label: "列表多列 (Col)",
    value: "col",
}, ...__VLS_functionalComponentArgsRest(__VLS_70));
var __VLS_60;
var __VLS_56;
var __VLS_44;
{
    const { footer: __VLS_thisSlot } = __VLS_40.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "dialog-footer" },
    });
    const __VLS_73 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_74 = __VLS_asFunctionalComponent(__VLS_73, new __VLS_73({
        ...{ 'onClick': {} },
    }));
    const __VLS_75 = __VLS_74({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_74));
    let __VLS_77;
    let __VLS_78;
    let __VLS_79;
    const __VLS_80 = {
        onClick: (...[$event]) => {
            __VLS_ctx.dialogVisible = false;
        }
    };
    __VLS_76.slots.default;
    var __VLS_76;
    const __VLS_81 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_82 = __VLS_asFunctionalComponent(__VLS_81, new __VLS_81({
        ...{ 'onClick': {} },
        type: "primary",
    }));
    const __VLS_83 = __VLS_82({
        ...{ 'onClick': {} },
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_82));
    let __VLS_85;
    let __VLS_86;
    let __VLS_87;
    const __VLS_88 = {
        onClick: (__VLS_ctx.confirmFillConfig)
    };
    __VLS_84.slots.default;
    var __VLS_84;
}
var __VLS_40;
/** @type {__VLS_StyleScopedClasses['td-container']} */ ;
/** @type {__VLS_StyleScopedClasses['td-header']} */ ;
/** @type {__VLS_StyleScopedClasses['td-header-left']} */ ;
/** @type {__VLS_StyleScopedClasses['upload-demo']} */ ;
/** @type {__VLS_StyleScopedClasses['td-text-muted']} */ ;
/** @type {__VLS_StyleScopedClasses['td-body']} */ ;
/** @type {__VLS_StyleScopedClasses['td-sidebar']} */ ;
/** @type {__VLS_StyleScopedClasses['td-sidebar-title']} */ ;
/** @type {__VLS_StyleScopedClasses['td-field-list']} */ ;
/** @type {__VLS_StyleScopedClasses['td-field-item']} */ ;
/** @type {__VLS_StyleScopedClasses['td-empty-text']} */ ;
/** @type {__VLS_StyleScopedClasses['td-main']} */ ;
/** @type {__VLS_StyleScopedClasses['td-select-full']} */ ;
/** @type {__VLS_StyleScopedClasses['dialog-footer']} */ ;
// @ts-ignore
var __VLS_36 = __VLS_35;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            ExcelEditor: ExcelEditor,
            excelEditorRef: excelEditorRef,
            currentTemplate: currentTemplate,
            selectedReport: selectedReport,
            availableFields: availableFields,
            dialogVisible: dialogVisible,
            fillConfig: fillConfig,
            handleUploadSuccess: handleUploadSuccess,
            loadReportFields: loadReportFields,
            onDragStart: onDragStart,
            onEditorDrop: onEditorDrop,
            confirmFillConfig: confirmFillConfig,
            saveMapping: saveMapping,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=index.vue.js.map