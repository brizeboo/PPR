import { ref, computed, reactive, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import Codemirror from 'vue-codemirror6';
import { json } from '@codemirror/lang-json';
import { listReports, saveReport, getReportMeta } from '@ppr/core';
import { listViews } from '@ppr/core';
import { PprReportViewer } from '@ppr/components';
import { http } from '@ppr/core';
// CodeMirror JSON扩展
const jsonExtensions = [json()];
// 报表列表
const reports = ref([]);
// 视图列表
const views = ref([]);
// 模板列表
const templates = ref([]);
// 搜索关键字
const keyword = ref('');
// 选中的报表ID
const selectedReportId = ref('');
// 当前预览的报表ID
const previewId = ref('');
// 预览组件的 Key，用于强制刷新
const previewKey = ref(0);
// 报表表单数据
const form = reactive({
    id: '',
    name: '',
    viewId: '',
    templateId: '',
    chartType: 'Table',
    pollingInterval: 0,
    styleConfig: '[]',
    chartConfig: '{}'
});
// 根据关键字过滤后的报表列表
const filteredReports = computed(() => {
    const k = keyword.value.trim().toLowerCase();
    if (!k)
        return reports.value;
    return reports.value.filter((r) => r.name.toLowerCase().includes(k) || r.id.toLowerCase().includes(k));
});
/**
 * 重新加载各类列表数据
 */
async function reloadData() {
    const [resReports, resViews, resTemplates] = await Promise.all([listReports(), listViews(), http.get('/api/v1/admin/template/list')]);
    reports.value = resReports.data;
    views.value = resViews.data;
    templates.value = resTemplates.data;
}
/**
 * 新建报表
 */
function newReport() {
    selectedReportId.value = '';
    form.id = '';
    form.name = '新建报表';
    form.viewId = views.value.length ? views.value[0].id : '';
    form.templateId = '';
    form.chartType = 'Table';
    form.pollingInterval = 0;
    form.styleConfig = '[\n  {\n    "prop": "name",\n    "label": "名称"\n  }\n]';
    form.chartConfig = '{\n  xAxis: {\n    type: "category",\n    data: data.rows.map(r => r.name)\n  },\n  yAxis: {\n    type: "value"\n  },\n  series: [\n    {\n      data: data.rows.map(r => r.value),\n      type: "bar"\n    }\n  ]\n}';
    previewId.value = '';
}
/**
 * 选中报表
 * @param id 报表ID
 */
async function onSelectReport(id) {
    selectedReportId.value = id;
    const { data } = await getReportMeta(id);
    form.id = data.id;
    form.name = data.name;
    form.viewId = data.viewId;
    form.templateId = data.templateId || '';
    form.chartType = data.chartType;
    form.pollingInterval = data.pollingInterval;
    form.styleConfig = data.styleConfig || '[]';
    form.chartConfig = data.chartConfig || '{}';
    previewReport();
}
/**
 * 视图切换回调
 */
function onViewChange() {
    // Automatically load default config or refresh mapping
    if (form.chartType === 'Table') {
        // We can preview directly if saved
    }
}
/**
 * 保存报表配置
 */
async function save() {
    if (!form.name || !form.viewId) {
        ElMessage.error('请填写名称并选择视图');
        return;
    }
    try {
        const { data } = await saveReport(form);
        form.id = data;
        selectedReportId.value = data;
        ElMessage.success('保存成功');
        await reloadData();
        previewReport();
    }
    catch (e) {
        ElMessage.error('保存失败: ' + e.message);
    }
}
/**
 * 触发报表预览刷新
 */
function previewReport() {
    if (form.id) {
        previewId.value = form.id;
        previewKey.value++; // force re-render
    }
}
onMounted(() => {
    reloadData();
});
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "rd-container" },
});
/** @type {__VLS_StyleScopedClasses['rd-container']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "rd-sidebar" },
});
/** @type {__VLS_StyleScopedClasses['rd-sidebar']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "rd-header" },
});
/** @type {__VLS_StyleScopedClasses['rd-header']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "rd-title" },
});
/** @type {__VLS_StyleScopedClasses['rd-title']} */ ;
let __VLS_0;
/** @ts-ignore @type {typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components.elButton | typeof __VLS_components.ElButton} */
elButton;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    ...{ 'onClick': {} },
    size: "small",
    type: "primary",
}));
const __VLS_2 = __VLS_1({
    ...{ 'onClick': {} },
    size: "small",
    type: "primary",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_5;
const __VLS_6 = ({ click: {} },
    { onClick: (__VLS_ctx.newReport) });
const { default: __VLS_7 } = __VLS_3.slots;
// @ts-ignore
[newReport,];
var __VLS_3;
var __VLS_4;
let __VLS_8;
/** @ts-ignore @type {typeof __VLS_components.elInput | typeof __VLS_components.ElInput} */
elInput;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent1(__VLS_8, new __VLS_8({
    modelValue: (__VLS_ctx.keyword),
    placeholder: "搜索",
    size: "small",
    ...{ style: {} },
    clearable: true,
}));
const __VLS_10 = __VLS_9({
    modelValue: (__VLS_ctx.keyword),
    placeholder: "搜索",
    size: "small",
    ...{ style: {} },
    clearable: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
let __VLS_13;
/** @ts-ignore @type {typeof __VLS_components.elMenu | typeof __VLS_components.ElMenu | typeof __VLS_components.elMenu | typeof __VLS_components.ElMenu} */
elMenu;
// @ts-ignore
const __VLS_14 = __VLS_asFunctionalComponent1(__VLS_13, new __VLS_13({
    ...{ 'onSelect': {} },
    defaultActive: (__VLS_ctx.selectedReportId),
    ...{ style: {} },
}));
const __VLS_15 = __VLS_14({
    ...{ 'onSelect': {} },
    defaultActive: (__VLS_ctx.selectedReportId),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_14));
let __VLS_18;
const __VLS_19 = ({ select: {} },
    { onSelect: (__VLS_ctx.onSelectReport) });
const { default: __VLS_20 } = __VLS_16.slots;
for (const [r] of __VLS_vFor((__VLS_ctx.filteredReports))) {
    let __VLS_21;
    /** @ts-ignore @type {typeof __VLS_components.elMenuItem | typeof __VLS_components.ElMenuItem | typeof __VLS_components.elMenuItem | typeof __VLS_components.ElMenuItem} */
    elMenuItem;
    // @ts-ignore
    const __VLS_22 = __VLS_asFunctionalComponent1(__VLS_21, new __VLS_21({
        key: (r.id),
        index: (r.id),
    }));
    const __VLS_23 = __VLS_22({
        key: (r.id),
        index: (r.id),
    }, ...__VLS_functionalComponentArgsRest(__VLS_22));
    const { default: __VLS_26 } = __VLS_24.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "rd-flex-col" },
    });
    /** @type {__VLS_StyleScopedClasses['rd-flex-col']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "rd-truncate" },
    });
    /** @type {__VLS_StyleScopedClasses['rd-truncate']} */ ;
    (r.name);
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "rd-subtext" },
    });
    /** @type {__VLS_StyleScopedClasses['rd-subtext']} */ ;
    (r.id);
    // @ts-ignore
    [keyword, selectedReportId, onSelectReport, filteredReports,];
    var __VLS_24;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_16;
var __VLS_17;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "rd-main" },
});
/** @type {__VLS_StyleScopedClasses['rd-main']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "rd-panel" },
});
/** @type {__VLS_StyleScopedClasses['rd-panel']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "rd-toolbar" },
});
/** @type {__VLS_StyleScopedClasses['rd-toolbar']} */ ;
let __VLS_27;
/** @ts-ignore @type {typeof __VLS_components.elInput | typeof __VLS_components.ElInput} */
elInput;
// @ts-ignore
const __VLS_28 = __VLS_asFunctionalComponent1(__VLS_27, new __VLS_27({
    modelValue: (__VLS_ctx.form.name),
    placeholder: "报表名称",
    ...{ style: {} },
}));
const __VLS_29 = __VLS_28({
    modelValue: (__VLS_ctx.form.name),
    placeholder: "报表名称",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_28));
let __VLS_32;
/** @ts-ignore @type {typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components.elButton | typeof __VLS_components.ElButton} */
elButton;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent1(__VLS_32, new __VLS_32({
    ...{ 'onClick': {} },
    type: "primary",
}));
const __VLS_34 = __VLS_33({
    ...{ 'onClick': {} },
    type: "primary",
}, ...__VLS_functionalComponentArgsRest(__VLS_33));
let __VLS_37;
const __VLS_38 = ({ click: {} },
    { onClick: (__VLS_ctx.save) });
const { default: __VLS_39 } = __VLS_35.slots;
// @ts-ignore
[form, save,];
var __VLS_35;
var __VLS_36;
let __VLS_40;
/** @ts-ignore @type {typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components.elForm | typeof __VLS_components.ElForm} */
elForm;
// @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent1(__VLS_40, new __VLS_40({
    labelWidth: "100px",
    size: "small",
    ...{ style: {} },
}));
const __VLS_42 = __VLS_41({
    labelWidth: "100px",
    size: "small",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_41));
const { default: __VLS_45 } = __VLS_43.slots;
let __VLS_46;
/** @ts-ignore @type {typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem} */
elFormItem;
// @ts-ignore
const __VLS_47 = __VLS_asFunctionalComponent1(__VLS_46, new __VLS_46({
    label: "关联视图",
}));
const __VLS_48 = __VLS_47({
    label: "关联视图",
}, ...__VLS_functionalComponentArgsRest(__VLS_47));
const { default: __VLS_51 } = __VLS_49.slots;
let __VLS_52;
/** @ts-ignore @type {typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect} */
elSelect;
// @ts-ignore
const __VLS_53 = __VLS_asFunctionalComponent1(__VLS_52, new __VLS_52({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.form.viewId),
    placeholder: "请选择视图",
    ...{ style: {} },
}));
const __VLS_54 = __VLS_53({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.form.viewId),
    placeholder: "请选择视图",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_53));
let __VLS_57;
const __VLS_58 = ({ change: {} },
    { onChange: (__VLS_ctx.onViewChange) });
const { default: __VLS_59 } = __VLS_55.slots;
for (const [v] of __VLS_vFor((__VLS_ctx.views))) {
    let __VLS_60;
    /** @ts-ignore @type {typeof __VLS_components.elOption | typeof __VLS_components.ElOption} */
    elOption;
    // @ts-ignore
    const __VLS_61 = __VLS_asFunctionalComponent1(__VLS_60, new __VLS_60({
        key: (v.id),
        label: (v.name),
        value: (v.id),
    }));
    const __VLS_62 = __VLS_61({
        key: (v.id),
        label: (v.name),
        value: (v.id),
    }, ...__VLS_functionalComponentArgsRest(__VLS_61));
    // @ts-ignore
    [form, onViewChange, views,];
}
// @ts-ignore
[];
var __VLS_55;
var __VLS_56;
// @ts-ignore
[];
var __VLS_49;
let __VLS_65;
/** @ts-ignore @type {typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem} */
elFormItem;
// @ts-ignore
const __VLS_66 = __VLS_asFunctionalComponent1(__VLS_65, new __VLS_65({
    label: "展示类型",
}));
const __VLS_67 = __VLS_66({
    label: "展示类型",
}, ...__VLS_functionalComponentArgsRest(__VLS_66));
const { default: __VLS_70 } = __VLS_68.slots;
let __VLS_71;
/** @ts-ignore @type {typeof __VLS_components.elRadioGroup | typeof __VLS_components.ElRadioGroup | typeof __VLS_components.elRadioGroup | typeof __VLS_components.ElRadioGroup} */
elRadioGroup;
// @ts-ignore
const __VLS_72 = __VLS_asFunctionalComponent1(__VLS_71, new __VLS_71({
    modelValue: (__VLS_ctx.form.chartType),
}));
const __VLS_73 = __VLS_72({
    modelValue: (__VLS_ctx.form.chartType),
}, ...__VLS_functionalComponentArgsRest(__VLS_72));
const { default: __VLS_76 } = __VLS_74.slots;
let __VLS_77;
/** @ts-ignore @type {typeof __VLS_components.elRadio | typeof __VLS_components.ElRadio | typeof __VLS_components.elRadio | typeof __VLS_components.ElRadio} */
elRadio;
// @ts-ignore
const __VLS_78 = __VLS_asFunctionalComponent1(__VLS_77, new __VLS_77({
    label: "Table",
}));
const __VLS_79 = __VLS_78({
    label: "Table",
}, ...__VLS_functionalComponentArgsRest(__VLS_78));
const { default: __VLS_82 } = __VLS_80.slots;
// @ts-ignore
[form,];
var __VLS_80;
let __VLS_83;
/** @ts-ignore @type {typeof __VLS_components.elRadio | typeof __VLS_components.ElRadio | typeof __VLS_components.elRadio | typeof __VLS_components.ElRadio} */
elRadio;
// @ts-ignore
const __VLS_84 = __VLS_asFunctionalComponent1(__VLS_83, new __VLS_83({
    label: "EChart",
}));
const __VLS_85 = __VLS_84({
    label: "EChart",
}, ...__VLS_functionalComponentArgsRest(__VLS_84));
const { default: __VLS_88 } = __VLS_86.slots;
// @ts-ignore
[];
var __VLS_86;
let __VLS_89;
/** @ts-ignore @type {typeof __VLS_components.elRadio | typeof __VLS_components.ElRadio | typeof __VLS_components.elRadio | typeof __VLS_components.ElRadio} */
elRadio;
// @ts-ignore
const __VLS_90 = __VLS_asFunctionalComponent1(__VLS_89, new __VLS_89({
    label: "Excel",
}));
const __VLS_91 = __VLS_90({
    label: "Excel",
}, ...__VLS_functionalComponentArgsRest(__VLS_90));
const { default: __VLS_94 } = __VLS_92.slots;
// @ts-ignore
[];
var __VLS_92;
// @ts-ignore
[];
var __VLS_74;
// @ts-ignore
[];
var __VLS_68;
if (__VLS_ctx.form.chartType === 'Excel') {
    let __VLS_95;
    /** @ts-ignore @type {typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem} */
    elFormItem;
    // @ts-ignore
    const __VLS_96 = __VLS_asFunctionalComponent1(__VLS_95, new __VLS_95({
        label: "Excel模板",
    }));
    const __VLS_97 = __VLS_96({
        label: "Excel模板",
    }, ...__VLS_functionalComponentArgsRest(__VLS_96));
    const { default: __VLS_100 } = __VLS_98.slots;
    let __VLS_101;
    /** @ts-ignore @type {typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect} */
    elSelect;
    // @ts-ignore
    const __VLS_102 = __VLS_asFunctionalComponent1(__VLS_101, new __VLS_101({
        modelValue: (__VLS_ctx.form.templateId),
        placeholder: "请选择模板",
        ...{ style: {} },
    }));
    const __VLS_103 = __VLS_102({
        modelValue: (__VLS_ctx.form.templateId),
        placeholder: "请选择模板",
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_102));
    const { default: __VLS_106 } = __VLS_104.slots;
    for (const [t] of __VLS_vFor((__VLS_ctx.templates))) {
        let __VLS_107;
        /** @ts-ignore @type {typeof __VLS_components.elOption | typeof __VLS_components.ElOption} */
        elOption;
        // @ts-ignore
        const __VLS_108 = __VLS_asFunctionalComponent1(__VLS_107, new __VLS_107({
            key: (t.id),
            label: (t.name),
            value: (t.id),
        }));
        const __VLS_109 = __VLS_108({
            key: (t.id),
            label: (t.name),
            value: (t.id),
        }, ...__VLS_functionalComponentArgsRest(__VLS_108));
        // @ts-ignore
        [form, form, templates,];
    }
    // @ts-ignore
    [];
    var __VLS_104;
    // @ts-ignore
    [];
    var __VLS_98;
}
let __VLS_112;
/** @ts-ignore @type {typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem} */
elFormItem;
// @ts-ignore
const __VLS_113 = __VLS_asFunctionalComponent1(__VLS_112, new __VLS_112({
    label: "轮询间隔(秒)",
}));
const __VLS_114 = __VLS_113({
    label: "轮询间隔(秒)",
}, ...__VLS_functionalComponentArgsRest(__VLS_113));
const { default: __VLS_117 } = __VLS_115.slots;
let __VLS_118;
/** @ts-ignore @type {typeof __VLS_components.elInputNumber | typeof __VLS_components.ElInputNumber} */
elInputNumber;
// @ts-ignore
const __VLS_119 = __VLS_asFunctionalComponent1(__VLS_118, new __VLS_118({
    modelValue: (__VLS_ctx.form.pollingInterval),
    min: (0),
    step: (5),
}));
const __VLS_120 = __VLS_119({
    modelValue: (__VLS_ctx.form.pollingInterval),
    min: (0),
    step: (5),
}, ...__VLS_functionalComponentArgsRest(__VLS_119));
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "rd-hint" },
});
/** @type {__VLS_StyleScopedClasses['rd-hint']} */ ;
// @ts-ignore
[form,];
var __VLS_115;
// @ts-ignore
[];
var __VLS_43;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "rd-panel-flex" },
});
/** @type {__VLS_StyleScopedClasses['rd-panel-flex']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "rd-subtitle" },
});
/** @type {__VLS_StyleScopedClasses['rd-subtitle']} */ ;
if (__VLS_ctx.form.chartType === 'Table') {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ style: {} },
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "rd-desc" },
    });
    /** @type {__VLS_StyleScopedClasses['rd-desc']} */ ;
    let __VLS_123;
    /** @ts-ignore @type {typeof __VLS_components.Codemirror} */
    Codemirror;
    // @ts-ignore
    const __VLS_124 = __VLS_asFunctionalComponent1(__VLS_123, new __VLS_123({
        modelValue: (__VLS_ctx.form.styleConfig),
        extensions: (__VLS_ctx.jsonExtensions),
        ...{ style: ({ height: '100%' }) },
    }));
    const __VLS_125 = __VLS_124({
        modelValue: (__VLS_ctx.form.styleConfig),
        extensions: (__VLS_ctx.jsonExtensions),
        ...{ style: ({ height: '100%' }) },
    }, ...__VLS_functionalComponentArgsRest(__VLS_124));
}
if (__VLS_ctx.form.chartType === 'EChart') {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ style: {} },
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "rd-desc" },
    });
    /** @type {__VLS_StyleScopedClasses['rd-desc']} */ ;
    let __VLS_128;
    /** @ts-ignore @type {typeof __VLS_components.Codemirror} */
    Codemirror;
    // @ts-ignore
    const __VLS_129 = __VLS_asFunctionalComponent1(__VLS_128, new __VLS_128({
        modelValue: (__VLS_ctx.form.chartConfig),
        extensions: (__VLS_ctx.jsonExtensions),
        ...{ style: ({ height: '100%' }) },
    }));
    const __VLS_130 = __VLS_129({
        modelValue: (__VLS_ctx.form.chartConfig),
        extensions: (__VLS_ctx.jsonExtensions),
        ...{ style: ({ height: '100%' }) },
    }, ...__VLS_functionalComponentArgsRest(__VLS_129));
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "rd-preview" },
});
/** @type {__VLS_StyleScopedClasses['rd-preview']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "rd-header" },
});
/** @type {__VLS_StyleScopedClasses['rd-header']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "rd-title" },
});
/** @type {__VLS_StyleScopedClasses['rd-title']} */ ;
let __VLS_133;
/** @ts-ignore @type {typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components.elButton | typeof __VLS_components.ElButton} */
elButton;
// @ts-ignore
const __VLS_134 = __VLS_asFunctionalComponent1(__VLS_133, new __VLS_133({
    ...{ 'onClick': {} },
    size: "small",
    disabled: (!__VLS_ctx.form.id),
}));
const __VLS_135 = __VLS_134({
    ...{ 'onClick': {} },
    size: "small",
    disabled: (!__VLS_ctx.form.id),
}, ...__VLS_functionalComponentArgsRest(__VLS_134));
let __VLS_138;
const __VLS_139 = ({ click: {} },
    { onClick: (__VLS_ctx.previewReport) });
const { default: __VLS_140 } = __VLS_136.slots;
// @ts-ignore
[form, form, form, form, form, jsonExtensions, jsonExtensions, previewReport,];
var __VLS_136;
var __VLS_137;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "rd-preview-content" },
});
/** @type {__VLS_StyleScopedClasses['rd-preview-content']} */ ;
if (__VLS_ctx.previewId) {
    let __VLS_141;
    /** @ts-ignore @type {typeof __VLS_components.PprReportViewer} */
    PprReportViewer;
    // @ts-ignore
    const __VLS_142 = __VLS_asFunctionalComponent1(__VLS_141, new __VLS_141({
        reportId: (__VLS_ctx.previewId),
        key: (__VLS_ctx.previewKey),
    }));
    const __VLS_143 = __VLS_142({
        reportId: (__VLS_ctx.previewId),
        key: (__VLS_ctx.previewKey),
    }, ...__VLS_functionalComponentArgsRest(__VLS_142));
}
else {
    let __VLS_146;
    /** @ts-ignore @type {typeof __VLS_components.elEmpty | typeof __VLS_components.ElEmpty} */
    elEmpty;
    // @ts-ignore
    const __VLS_147 = __VLS_asFunctionalComponent1(__VLS_146, new __VLS_146({
        description: "请先保存报表再预览",
    }));
    const __VLS_148 = __VLS_147({
        description: "请先保存报表再预览",
    }, ...__VLS_functionalComponentArgsRest(__VLS_147));
}
// @ts-ignore
[previewId, previewId, previewKey,];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
//# sourceMappingURL=index.vue.js.map