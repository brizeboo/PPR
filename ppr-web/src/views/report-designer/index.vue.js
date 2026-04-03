import { ref, computed, reactive, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import Codemirror from 'vue-codemirror6';
import { json } from '@codemirror/lang-json';
import { oneDark } from '@codemirror/theme-one-dark';
import { listReports, saveReport, getReportMeta } from '@/api/report';
import { listViews } from '@/api/view';
import PprReportViewer from '@/components/PprReportViewer.vue';
const jsonExtensions = [json(), oneDark];
const reports = ref([]);
const views = ref([]);
const keyword = ref('');
const selectedReportId = ref('');
const previewId = ref('');
const previewKey = ref(0);
const form = reactive({
    id: '',
    name: '',
    viewId: '',
    chartType: 'Table',
    pollingInterval: 0,
    styleConfig: '[]',
    chartConfig: '{}'
});
const filteredReports = computed(() => {
    const k = keyword.value.trim().toLowerCase();
    if (!k)
        return reports.value;
    return reports.value.filter((r) => r.name.toLowerCase().includes(k) || r.id.toLowerCase().includes(k));
});
async function reloadData() {
    const [resReports, resViews] = await Promise.all([listReports(), listViews()]);
    reports.value = resReports.data;
    views.value = resViews.data;
}
function newReport() {
    selectedReportId.value = '';
    form.id = '';
    form.name = '新建报表';
    form.viewId = views.value.length ? views.value[0].id : '';
    form.chartType = 'Table';
    form.pollingInterval = 0;
    form.styleConfig = '[\n  {\n    "prop": "name",\n    "label": "名称"\n  }\n]';
    form.chartConfig = '{\n  xAxis: {\n    type: "category",\n    data: data.rows.map(r => r.name)\n  },\n  yAxis: {\n    type: "value"\n  },\n  series: [\n    {\n      data: data.rows.map(r => r.value),\n      type: "bar"\n    }\n  ]\n}';
    previewId.value = '';
}
async function onSelectReport(id) {
    selectedReportId.value = id;
    const { data } = await getReportMeta(id);
    form.id = data.id;
    form.name = data.name;
    form.viewId = data.viewId;
    form.chartType = data.chartType;
    form.pollingInterval = data.pollingInterval;
    form.styleConfig = data.styleConfig || '[]';
    form.chartConfig = data.chartConfig || '{}';
    previewReport();
}
function onViewChange() {
    // Automatically load default config or refresh mapping
    if (form.chartType === 'Table') {
        // We can preview directly if saved
    }
}
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
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "grid grid-cols-12 gap-3 h-[calc(100vh-120px)]" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "col-span-3 border border-solid border-gray-200 rounded p-2 overflow-auto bg-white" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex items-center justify-between mb-2" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "font-600" },
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
    ...{ class: "mb-2" },
    clearable: true,
}));
const __VLS_10 = __VLS_9({
    modelValue: (__VLS_ctx.keyword),
    placeholder: "搜索",
    size: "small",
    ...{ class: "mb-2" },
    clearable: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
const __VLS_12 = {}.ElMenu;
/** @type {[typeof __VLS_components.ElMenu, typeof __VLS_components.elMenu, typeof __VLS_components.ElMenu, typeof __VLS_components.elMenu, ]} */ ;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
    ...{ 'onSelect': {} },
    defaultActive: (__VLS_ctx.selectedReportId),
    ...{ class: "border-0" },
}));
const __VLS_14 = __VLS_13({
    ...{ 'onSelect': {} },
    defaultActive: (__VLS_ctx.selectedReportId),
    ...{ class: "border-0" },
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
        ...{ class: "flex flex-col" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "truncate" },
    });
    (r.name);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "text-xs text-gray-500 truncate" },
    });
    (r.id);
    var __VLS_23;
}
var __VLS_15;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "col-span-4 flex flex-col gap-3" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "border border-solid border-gray-200 rounded p-3 bg-white" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex items-center gap-2 mb-2" },
});
const __VLS_24 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
    modelValue: (__VLS_ctx.form.name),
    placeholder: "报表名称",
    ...{ class: "flex-1" },
}));
const __VLS_26 = __VLS_25({
    modelValue: (__VLS_ctx.form.name),
    placeholder: "报表名称",
    ...{ class: "flex-1" },
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
    ...{ class: "mt-4" },
}));
const __VLS_38 = __VLS_37({
    labelWidth: "100px",
    size: "small",
    ...{ class: "mt-4" },
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
    ...{ class: "w-full" },
}));
const __VLS_46 = __VLS_45({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.form.viewId),
    placeholder: "请选择视图",
    ...{ class: "w-full" },
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
const __VLS_76 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
    label: "轮询间隔(秒)",
}));
const __VLS_78 = __VLS_77({
    label: "轮询间隔(秒)",
}, ...__VLS_functionalComponentArgsRest(__VLS_77));
__VLS_79.slots.default;
const __VLS_80 = {}.ElInputNumber;
/** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
// @ts-ignore
const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({
    modelValue: (__VLS_ctx.form.pollingInterval),
    min: (0),
    step: (5),
}));
const __VLS_82 = __VLS_81({
    modelValue: (__VLS_ctx.form.pollingInterval),
    min: (0),
    step: (5),
}, ...__VLS_functionalComponentArgsRest(__VLS_81));
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "ml-2 text-xs text-gray-400" },
});
var __VLS_79;
var __VLS_39;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "border border-solid border-gray-200 rounded p-3 flex-1 overflow-auto bg-white flex flex-col" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "font-600 mb-2" },
});
if (__VLS_ctx.form.chartType === 'Table') {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex-1" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "text-xs text-gray-500 mb-2" },
    });
    const __VLS_84 = {}.Codemirror;
    /** @type {[typeof __VLS_components.Codemirror, ]} */ ;
    // @ts-ignore
    const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
        modelValue: (__VLS_ctx.form.styleConfig),
        extensions: (__VLS_ctx.jsonExtensions),
        ...{ style: ({ height: '100%' }) },
    }));
    const __VLS_86 = __VLS_85({
        modelValue: (__VLS_ctx.form.styleConfig),
        extensions: (__VLS_ctx.jsonExtensions),
        ...{ style: ({ height: '100%' }) },
    }, ...__VLS_functionalComponentArgsRest(__VLS_85));
}
if (__VLS_ctx.form.chartType === 'EChart') {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex-1" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "text-xs text-gray-500 mb-2" },
    });
    const __VLS_88 = {}.Codemirror;
    /** @type {[typeof __VLS_components.Codemirror, ]} */ ;
    // @ts-ignore
    const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({
        modelValue: (__VLS_ctx.form.chartConfig),
        extensions: (__VLS_ctx.jsonExtensions),
        ...{ style: ({ height: '100%' }) },
    }));
    const __VLS_90 = __VLS_89({
        modelValue: (__VLS_ctx.form.chartConfig),
        extensions: (__VLS_ctx.jsonExtensions),
        ...{ style: ({ height: '100%' }) },
    }, ...__VLS_functionalComponentArgsRest(__VLS_89));
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "col-span-5 border border-solid border-gray-200 rounded p-3 overflow-auto bg-gray-50 relative" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex items-center justify-between mb-2" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "font-600" },
});
const __VLS_92 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({
    ...{ 'onClick': {} },
    size: "small",
    disabled: (!__VLS_ctx.form.id),
}));
const __VLS_94 = __VLS_93({
    ...{ 'onClick': {} },
    size: "small",
    disabled: (!__VLS_ctx.form.id),
}, ...__VLS_functionalComponentArgsRest(__VLS_93));
let __VLS_96;
let __VLS_97;
let __VLS_98;
const __VLS_99 = {
    onClick: (__VLS_ctx.previewReport)
};
__VLS_95.slots.default;
var __VLS_95;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "h-[calc(100%-40px)] w-full bg-white relative" },
});
if (__VLS_ctx.previewId) {
    /** @type {[typeof PprReportViewer, ]} */ ;
    // @ts-ignore
    const __VLS_100 = __VLS_asFunctionalComponent(PprReportViewer, new PprReportViewer({
        reportId: (__VLS_ctx.previewId),
        key: (__VLS_ctx.previewKey),
    }));
    const __VLS_101 = __VLS_100({
        reportId: (__VLS_ctx.previewId),
        key: (__VLS_ctx.previewKey),
    }, ...__VLS_functionalComponentArgsRest(__VLS_100));
}
else {
    const __VLS_103 = {}.ElEmpty;
    /** @type {[typeof __VLS_components.ElEmpty, typeof __VLS_components.elEmpty, ]} */ ;
    // @ts-ignore
    const __VLS_104 = __VLS_asFunctionalComponent(__VLS_103, new __VLS_103({
        description: "请先保存报表再预览",
    }));
    const __VLS_105 = __VLS_104({
        description: "请先保存报表再预览",
    }, ...__VLS_functionalComponentArgsRest(__VLS_104));
}
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-12']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
/** @type {__VLS_StyleScopedClasses['h-[calc(100vh-120px)]']} */ ;
/** @type {__VLS_StyleScopedClasses['col-span-3']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-solid']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-200']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['p-2']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['font-600']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['border-0']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['truncate']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['truncate']} */ ;
/** @type {__VLS_StyleScopedClasses['col-span-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-solid']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-200']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['p-3']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-solid']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-200']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['p-3']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['font-600']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['col-span-5']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-solid']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-200']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['p-3']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-50']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['font-600']} */ ;
/** @type {__VLS_StyleScopedClasses['h-[calc(100%-40px)]']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            Codemirror: Codemirror,
            PprReportViewer: PprReportViewer,
            jsonExtensions: jsonExtensions,
            views: views,
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