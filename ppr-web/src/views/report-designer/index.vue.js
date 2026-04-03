import { ref, computed, reactive, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import Codemirror from 'vue-codemirror6';
import { json } from '@codemirror/lang-json';
import { oneDark } from '@codemirror/theme-one-dark';
import { listReports, saveReport, getReportMeta } from '@/api/report';
import { listViews } from '@/api/view';
import PprReportViewer from '@/components/PprReportViewer.vue';
import { http } from '@/api/http';
// CodeMirror JSON扩展
const jsonExtensions = [json(), oneDark];
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
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "rd-container" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "rd-sidebar" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "rd-header" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "rd-title" },
});
const __VLS_0 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ...{ 'onClick': {} },
    size: "small",
    type: "primary",
}));
const __VLS_2 = __VLS_1({
    ...{ 'onClick': {} },
    size: "small",
    type: "primary",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_4;
let __VLS_5;
let __VLS_6;
const __VLS_7 = {
    onClick: (__VLS_ctx.newReport)
};
__VLS_3.slots.default;
var __VLS_3;
const __VLS_8 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
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
const __VLS_12 = {}.ElMenu;
/** @type {[typeof __VLS_components.ElMenu, typeof __VLS_components.elMenu, typeof __VLS_components.ElMenu, typeof __VLS_components.elMenu, ]} */ ;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
    ...{ 'onSelect': {} },
    defaultActive: (__VLS_ctx.selectedReportId),
    ...{ style: {} },
}));
const __VLS_14 = __VLS_13({
    ...{ 'onSelect': {} },
    defaultActive: (__VLS_ctx.selectedReportId),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
let __VLS_16;
let __VLS_17;
let __VLS_18;
const __VLS_19 = {
    onSelect: (__VLS_ctx.onSelectReport)
};
__VLS_15.slots.default;
for (const [r] of __VLS_getVForSourceType((__VLS_ctx.filteredReports))) {
    const __VLS_20 = {}.ElMenuItem;
    /** @type {[typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, ]} */ ;
    // @ts-ignore
    const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
        key: (r.id),
        index: (r.id),
    }));
    const __VLS_22 = __VLS_21({
        key: (r.id),
        index: (r.id),
    }, ...__VLS_functionalComponentArgsRest(__VLS_21));
    __VLS_23.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "rd-flex-col" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "rd-truncate" },
    });
    (r.name);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "rd-subtext" },
    });
    (r.id);
    var __VLS_23;
}
var __VLS_15;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "rd-main" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "rd-panel" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "rd-toolbar" },
});
const __VLS_24 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
    modelValue: (__VLS_ctx.form.name),
    placeholder: "报表名称",
    ...{ style: {} },
}));
const __VLS_26 = __VLS_25({
    modelValue: (__VLS_ctx.form.name),
    placeholder: "报表名称",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
const __VLS_28 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
    ...{ 'onClick': {} },
    type: "primary",
}));
const __VLS_30 = __VLS_29({
    ...{ 'onClick': {} },
    type: "primary",
}, ...__VLS_functionalComponentArgsRest(__VLS_29));
let __VLS_32;
let __VLS_33;
let __VLS_34;
const __VLS_35 = {
    onClick: (__VLS_ctx.save)
};
__VLS_31.slots.default;
var __VLS_31;
const __VLS_36 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
    labelWidth: "100px",
    size: "small",
    ...{ style: {} },
}));
const __VLS_38 = __VLS_37({
    labelWidth: "100px",
    size: "small",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
__VLS_39.slots.default;
const __VLS_40 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
    label: "关联视图",
}));
const __VLS_42 = __VLS_41({
    label: "关联视图",
}, ...__VLS_functionalComponentArgsRest(__VLS_41));
__VLS_43.slots.default;
const __VLS_44 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.form.viewId),
    placeholder: "请选择视图",
    ...{ style: {} },
}));
const __VLS_46 = __VLS_45({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.form.viewId),
    placeholder: "请选择视图",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_45));
let __VLS_48;
let __VLS_49;
let __VLS_50;
const __VLS_51 = {
    onChange: (__VLS_ctx.onViewChange)
};
__VLS_47.slots.default;
for (const [v] of __VLS_getVForSourceType((__VLS_ctx.views))) {
    const __VLS_52 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
        key: (v.id),
        label: (v.name),
        value: (v.id),
    }));
    const __VLS_54 = __VLS_53({
        key: (v.id),
        label: (v.name),
        value: (v.id),
    }, ...__VLS_functionalComponentArgsRest(__VLS_53));
}
var __VLS_47;
var __VLS_43;
const __VLS_56 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
    label: "展示类型",
}));
const __VLS_58 = __VLS_57({
    label: "展示类型",
}, ...__VLS_functionalComponentArgsRest(__VLS_57));
__VLS_59.slots.default;
const __VLS_60 = {}.ElRadioGroup;
/** @type {[typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, ]} */ ;
// @ts-ignore
const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
    modelValue: (__VLS_ctx.form.chartType),
}));
const __VLS_62 = __VLS_61({
    modelValue: (__VLS_ctx.form.chartType),
}, ...__VLS_functionalComponentArgsRest(__VLS_61));
__VLS_63.slots.default;
const __VLS_64 = {}.ElRadio;
/** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ ;
// @ts-ignore
const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
    label: "Table",
}));
const __VLS_66 = __VLS_65({
    label: "Table",
}, ...__VLS_functionalComponentArgsRest(__VLS_65));
__VLS_67.slots.default;
var __VLS_67;
const __VLS_68 = {}.ElRadio;
/** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ ;
// @ts-ignore
const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
    label: "EChart",
}));
const __VLS_70 = __VLS_69({
    label: "EChart",
}, ...__VLS_functionalComponentArgsRest(__VLS_69));
__VLS_71.slots.default;
var __VLS_71;
const __VLS_72 = {}.ElRadio;
/** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ ;
// @ts-ignore
const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
    label: "Excel",
}));
const __VLS_74 = __VLS_73({
    label: "Excel",
}, ...__VLS_functionalComponentArgsRest(__VLS_73));
__VLS_75.slots.default;
var __VLS_75;
var __VLS_63;
var __VLS_59;
if (__VLS_ctx.form.chartType === 'Excel') {
    const __VLS_76 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
        label: "Excel模板",
    }));
    const __VLS_78 = __VLS_77({
        label: "Excel模板",
    }, ...__VLS_functionalComponentArgsRest(__VLS_77));
    __VLS_79.slots.default;
    const __VLS_80 = {}.ElSelect;
    /** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
    // @ts-ignore
    const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({
        modelValue: (__VLS_ctx.form.templateId),
        placeholder: "请选择模板",
        ...{ style: {} },
    }));
    const __VLS_82 = __VLS_81({
        modelValue: (__VLS_ctx.form.templateId),
        placeholder: "请选择模板",
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_81));
    __VLS_83.slots.default;
    for (const [t] of __VLS_getVForSourceType((__VLS_ctx.templates))) {
        const __VLS_84 = {}.ElOption;
        /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
        // @ts-ignore
        const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
            key: (t.id),
            label: (t.name),
            value: (t.id),
        }));
        const __VLS_86 = __VLS_85({
            key: (t.id),
            label: (t.name),
            value: (t.id),
        }, ...__VLS_functionalComponentArgsRest(__VLS_85));
    }
    var __VLS_83;
    var __VLS_79;
}
const __VLS_88 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({
    label: "轮询间隔(秒)",
}));
const __VLS_90 = __VLS_89({
    label: "轮询间隔(秒)",
}, ...__VLS_functionalComponentArgsRest(__VLS_89));
__VLS_91.slots.default;
const __VLS_92 = {}.ElInputNumber;
/** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
// @ts-ignore
const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({
    modelValue: (__VLS_ctx.form.pollingInterval),
    min: (0),
    step: (5),
}));
const __VLS_94 = __VLS_93({
    modelValue: (__VLS_ctx.form.pollingInterval),
    min: (0),
    step: (5),
}, ...__VLS_functionalComponentArgsRest(__VLS_93));
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "rd-hint" },
});
var __VLS_91;
var __VLS_39;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "rd-panel-flex" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "rd-subtitle" },
});
if (__VLS_ctx.form.chartType === 'Table') {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ style: {} },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "rd-desc" },
    });
    const __VLS_96 = {}.Codemirror;
    /** @type {[typeof __VLS_components.Codemirror, ]} */ ;
    // @ts-ignore
    const __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({
        modelValue: (__VLS_ctx.form.styleConfig),
        extensions: (__VLS_ctx.jsonExtensions),
        ...{ style: ({ height: '100%' }) },
    }));
    const __VLS_98 = __VLS_97({
        modelValue: (__VLS_ctx.form.styleConfig),
        extensions: (__VLS_ctx.jsonExtensions),
        ...{ style: ({ height: '100%' }) },
    }, ...__VLS_functionalComponentArgsRest(__VLS_97));
}
if (__VLS_ctx.form.chartType === 'EChart') {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ style: {} },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "rd-desc" },
    });
    const __VLS_100 = {}.Codemirror;
    /** @type {[typeof __VLS_components.Codemirror, ]} */ ;
    // @ts-ignore
    const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({
        modelValue: (__VLS_ctx.form.chartConfig),
        extensions: (__VLS_ctx.jsonExtensions),
        ...{ style: ({ height: '100%' }) },
    }));
    const __VLS_102 = __VLS_101({
        modelValue: (__VLS_ctx.form.chartConfig),
        extensions: (__VLS_ctx.jsonExtensions),
        ...{ style: ({ height: '100%' }) },
    }, ...__VLS_functionalComponentArgsRest(__VLS_101));
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "rd-preview" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "rd-header" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "rd-title" },
});
const __VLS_104 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_105 = __VLS_asFunctionalComponent(__VLS_104, new __VLS_104({
    ...{ 'onClick': {} },
    size: "small",
    disabled: (!__VLS_ctx.form.id),
}));
const __VLS_106 = __VLS_105({
    ...{ 'onClick': {} },
    size: "small",
    disabled: (!__VLS_ctx.form.id),
}, ...__VLS_functionalComponentArgsRest(__VLS_105));
let __VLS_108;
let __VLS_109;
let __VLS_110;
const __VLS_111 = {
    onClick: (__VLS_ctx.previewReport)
};
__VLS_107.slots.default;
var __VLS_107;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "rd-preview-content" },
});
if (__VLS_ctx.previewId) {
    /** @type {[typeof PprReportViewer, ]} */ ;
    // @ts-ignore
    const __VLS_112 = __VLS_asFunctionalComponent(PprReportViewer, new PprReportViewer({
        reportId: (__VLS_ctx.previewId),
        key: (__VLS_ctx.previewKey),
    }));
    const __VLS_113 = __VLS_112({
        reportId: (__VLS_ctx.previewId),
        key: (__VLS_ctx.previewKey),
    }, ...__VLS_functionalComponentArgsRest(__VLS_112));
}
else {
    const __VLS_115 = {}.ElEmpty;
    /** @type {[typeof __VLS_components.ElEmpty, typeof __VLS_components.elEmpty, ]} */ ;
    // @ts-ignore
    const __VLS_116 = __VLS_asFunctionalComponent(__VLS_115, new __VLS_115({
        description: "请先保存报表再预览",
    }));
    const __VLS_117 = __VLS_116({
        description: "请先保存报表再预览",
    }, ...__VLS_functionalComponentArgsRest(__VLS_116));
}
/** @type {__VLS_StyleScopedClasses['rd-container']} */ ;
/** @type {__VLS_StyleScopedClasses['rd-sidebar']} */ ;
/** @type {__VLS_StyleScopedClasses['rd-header']} */ ;
/** @type {__VLS_StyleScopedClasses['rd-title']} */ ;
/** @type {__VLS_StyleScopedClasses['rd-flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['rd-truncate']} */ ;
/** @type {__VLS_StyleScopedClasses['rd-subtext']} */ ;
/** @type {__VLS_StyleScopedClasses['rd-main']} */ ;
/** @type {__VLS_StyleScopedClasses['rd-panel']} */ ;
/** @type {__VLS_StyleScopedClasses['rd-toolbar']} */ ;
/** @type {__VLS_StyleScopedClasses['rd-hint']} */ ;
/** @type {__VLS_StyleScopedClasses['rd-panel-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['rd-subtitle']} */ ;
/** @type {__VLS_StyleScopedClasses['rd-desc']} */ ;
/** @type {__VLS_StyleScopedClasses['rd-desc']} */ ;
/** @type {__VLS_StyleScopedClasses['rd-preview']} */ ;
/** @type {__VLS_StyleScopedClasses['rd-header']} */ ;
/** @type {__VLS_StyleScopedClasses['rd-title']} */ ;
/** @type {__VLS_StyleScopedClasses['rd-preview-content']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            Codemirror: Codemirror,
            PprReportViewer: PprReportViewer,
            jsonExtensions: jsonExtensions,
            views: views,
            templates: templates,
            keyword: keyword,
            selectedReportId: selectedReportId,
            previewId: previewId,
            previewKey: previewKey,
            form: form,
            filteredReports: filteredReports,
            newReport: newReport,
            onSelectReport: onSelectReport,
            onViewChange: onViewChange,
            save: save,
            previewReport: previewReport,
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