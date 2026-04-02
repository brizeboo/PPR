import { computed, onMounted, reactive, ref } from 'vue';
import { ElMessage } from 'element-plus';
import Codemirror from 'vue-codemirror6';
import { sql } from '@codemirror/lang-sql';
import { oneDark } from '@codemirror/theme-one-dark';
import { listDatasources } from '@/api/datasource';
import { getView, listViews, previewView, saveView } from '@/api/view';
const datasources = ref([]);
const views = ref([]);
const keyword = ref('');
const selectedViewId = ref('');
const viewForm = reactive({
    id: '',
    datasourceId: '',
    name: '',
    sqlContent: 'select 1 as value',
});
const paramDefs = ref([]);
const preview = reactive({
    columns: [],
    rows: [],
});
const editorExtensions = [sql(), oneDark];
const filteredViews = computed(() => {
    const k = keyword.value.trim().toLowerCase();
    if (!k)
        return views.value;
    return views.value.filter((v) => v.name.toLowerCase().includes(k) || v.id.toLowerCase().includes(k));
});
function buildParamsMap() {
    const params = {};
    for (const p of paramDefs.value) {
        if (!p.paramName)
            continue;
        if (p.testValue !== undefined && String(p.testValue).length > 0) {
            params[p.paramName] = p.testValue;
        }
    }
    return params;
}
async function reloadDatasources() {
    const { data } = await listDatasources();
    datasources.value = data;
    if (!viewForm.datasourceId && data.length) {
        viewForm.datasourceId = data[0].id;
    }
}
async function reloadViews() {
    const { data } = await listViews();
    views.value = data;
}
function newView() {
    selectedViewId.value = '';
    viewForm.id = '';
    viewForm.name = '';
    viewForm.sqlContent = 'select 1 as value';
    if (datasources.value.length)
        viewForm.datasourceId = datasources.value[0].id;
    paramDefs.value = [];
    preview.columns = [];
    preview.rows = [];
}
function addParam() {
    paramDefs.value.push({ paramName: '', paramType: 'String', required: false, dictCode: '', testValue: '' });
}
function removeParam(index) {
    paramDefs.value.splice(index, 1);
}
async function onSelectView(id) {
    selectedViewId.value = id;
    const { data } = await getView(id);
    viewForm.id = data.view.id;
    viewForm.datasourceId = data.view.datasourceId;
    viewForm.name = data.view.name;
    viewForm.sqlContent = data.view.sqlContent;
    paramDefs.value =
        data.params?.map((p) => ({
            id: p.id,
            paramName: p.paramName,
            paramType: p.paramType,
            dictCode: p.dictCode || '',
            required: Boolean(p.isRequired),
            testValue: '',
        })) || [];
    preview.columns = [];
    preview.rows = [];
}
async function save() {
    if (!viewForm.name || !viewForm.datasourceId || !viewForm.sqlContent) {
        ElMessage.error('请补全视图名称、数据源与 SQL');
        return;
    }
    const payload = {
        id: viewForm.id,
        name: viewForm.name,
        datasourceId: viewForm.datasourceId,
        sqlContent: viewForm.sqlContent,
        params: paramDefs.value.map((p) => ({
            id: p.id,
            paramName: p.paramName,
            paramType: p.paramType,
            dictCode: p.dictCode,
            required: p.required,
        })),
    };
    const { data } = await saveView(payload);
    viewForm.id = data.id;
    selectedViewId.value = data.id;
    ElMessage.success('保存成功');
    await reloadViews();
}
async function runPreview() {
    if (!viewForm.datasourceId || !viewForm.sqlContent) {
        ElMessage.error('请先选择数据源并输入 SQL');
        return;
    }
    const params = buildParamsMap();
    const req = viewForm.id && String(viewForm.id).length > 0
        ? { viewId: String(viewForm.id), params }
        : {
            datasourceId: String(viewForm.datasourceId),
            sqlContent: String(viewForm.sqlContent),
            paramDefs: paramDefs.value.map((p) => ({
                paramName: p.paramName,
                paramType: p.paramType,
                dictCode: p.dictCode,
                required: p.required,
            })),
            params,
        };
    const { data } = await previewView(req);
    preview.columns = data.columns;
    preview.rows = data.rows;
    ElMessage.success('运行成功');
}
onMounted(async () => {
    await reloadDatasources();
    await reloadViews();
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "grid grid-cols-12 gap-3 h-[calc(100vh-120px)]" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "col-span-3 border border-solid border-gray-200 rounded p-2 overflow-auto" },
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
    onClick: (__VLS_ctx.newView)
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
    defaultActive: (__VLS_ctx.selectedViewId),
    ...{ class: "border-0" },
}));
const __VLS_14 = __VLS_13({
    ...{ 'onSelect': {} },
    defaultActive: (__VLS_ctx.selectedViewId),
    ...{ class: "border-0" },
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
let __VLS_16;
let __VLS_17;
let __VLS_18;
const __VLS_19 = {
    onSelect: (__VLS_ctx.onSelectView)
};
__VLS_15.slots.default;
for (const [v] of __VLS_getVForSourceType((__VLS_ctx.filteredViews))) {
    const __VLS_20 = {}.ElMenuItem;
    /** @type {[typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, ]} */ ;
    // @ts-ignore
    const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
        key: (v.id),
        index: (v.id),
    }));
    const __VLS_22 = __VLS_21({
        key: (v.id),
        index: (v.id),
    }, ...__VLS_functionalComponentArgsRest(__VLS_21));
    __VLS_23.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex flex-col" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "truncate" },
    });
    (v.name);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "text-xs text-gray-500 truncate" },
    });
    (v.id);
    var __VLS_23;
}
var __VLS_15;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "col-span-6 flex flex-col gap-3" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "border border-solid border-gray-200 rounded p-3" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex items-center gap-2 mb-2" },
});
const __VLS_24 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
    modelValue: (__VLS_ctx.viewForm.name),
    placeholder: "视图名称",
    ...{ class: "flex-1" },
}));
const __VLS_26 = __VLS_25({
    modelValue: (__VLS_ctx.viewForm.name),
    placeholder: "视图名称",
    ...{ class: "flex-1" },
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
const __VLS_28 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
    modelValue: (__VLS_ctx.viewForm.datasourceId),
    placeholder: "选择数据源",
    ...{ class: "w-56" },
}));
const __VLS_30 = __VLS_29({
    modelValue: (__VLS_ctx.viewForm.datasourceId),
    placeholder: "选择数据源",
    ...{ class: "w-56" },
}, ...__VLS_functionalComponentArgsRest(__VLS_29));
__VLS_31.slots.default;
for (const [ds] of __VLS_getVForSourceType((__VLS_ctx.datasources))) {
    const __VLS_32 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
        key: (ds.id),
        label: (ds.name),
        value: (ds.id),
    }));
    const __VLS_34 = __VLS_33({
        key: (ds.id),
        label: (ds.name),
        value: (ds.id),
    }, ...__VLS_functionalComponentArgsRest(__VLS_33));
}
var __VLS_31;
const __VLS_36 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
    ...{ 'onClick': {} },
    type: "primary",
}));
const __VLS_38 = __VLS_37({
    ...{ 'onClick': {} },
    type: "primary",
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
let __VLS_40;
let __VLS_41;
let __VLS_42;
const __VLS_43 = {
    onClick: (__VLS_ctx.save)
};
__VLS_39.slots.default;
var __VLS_39;
const __VLS_44 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
    ...{ 'onClick': {} },
}));
const __VLS_46 = __VLS_45({
    ...{ 'onClick': {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_45));
let __VLS_48;
let __VLS_49;
let __VLS_50;
const __VLS_51 = {
    onClick: (__VLS_ctx.runPreview)
};
__VLS_47.slots.default;
var __VLS_47;
const __VLS_52 = {}.Codemirror;
/** @type {[typeof __VLS_components.Codemirror, ]} */ ;
// @ts-ignore
const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
    modelValue: (__VLS_ctx.viewForm.sqlContent),
    extensions: (__VLS_ctx.editorExtensions),
    ...{ style: ({ height: '320px' }) },
}));
const __VLS_54 = __VLS_53({
    modelValue: (__VLS_ctx.viewForm.sqlContent),
    extensions: (__VLS_ctx.editorExtensions),
    ...{ style: ({ height: '320px' }) },
}, ...__VLS_functionalComponentArgsRest(__VLS_53));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "border border-solid border-gray-200 rounded p-3 flex-1 overflow-auto" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex items-center justify-between mb-2" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "font-600" },
});
const __VLS_56 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
    ...{ 'onClick': {} },
    size: "small",
}));
const __VLS_58 = __VLS_57({
    ...{ 'onClick': {} },
    size: "small",
}, ...__VLS_functionalComponentArgsRest(__VLS_57));
let __VLS_60;
let __VLS_61;
let __VLS_62;
const __VLS_63 = {
    onClick: (__VLS_ctx.addParam)
};
__VLS_59.slots.default;
var __VLS_59;
const __VLS_64 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
    data: (__VLS_ctx.paramDefs),
    border: true,
    size: "small",
}));
const __VLS_66 = __VLS_65({
    data: (__VLS_ctx.paramDefs),
    border: true,
    size: "small",
}, ...__VLS_functionalComponentArgsRest(__VLS_65));
__VLS_67.slots.default;
const __VLS_68 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
    label: "参数名",
    width: "150",
}));
const __VLS_70 = __VLS_69({
    label: "参数名",
    width: "150",
}, ...__VLS_functionalComponentArgsRest(__VLS_69));
__VLS_71.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_71.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_72 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
        modelValue: (row.paramName),
        placeholder: "如: id",
    }));
    const __VLS_74 = __VLS_73({
        modelValue: (row.paramName),
        placeholder: "如: id",
    }, ...__VLS_functionalComponentArgsRest(__VLS_73));
}
var __VLS_71;
const __VLS_76 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
    label: "类型",
    width: "140",
}));
const __VLS_78 = __VLS_77({
    label: "类型",
    width: "140",
}, ...__VLS_functionalComponentArgsRest(__VLS_77));
__VLS_79.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_79.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_80 = {}.ElSelect;
    /** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
    // @ts-ignore
    const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({
        modelValue: (row.paramType),
        ...{ class: "w-full" },
    }));
    const __VLS_82 = __VLS_81({
        modelValue: (row.paramType),
        ...{ class: "w-full" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_81));
    __VLS_83.slots.default;
    const __VLS_84 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
        label: "String",
        value: "String",
    }));
    const __VLS_86 = __VLS_85({
        label: "String",
        value: "String",
    }, ...__VLS_functionalComponentArgsRest(__VLS_85));
    const __VLS_88 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({
        label: "Number",
        value: "Number",
    }));
    const __VLS_90 = __VLS_89({
        label: "Number",
        value: "Number",
    }, ...__VLS_functionalComponentArgsRest(__VLS_89));
    const __VLS_92 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({
        label: "Date",
        value: "Date",
    }));
    const __VLS_94 = __VLS_93({
        label: "Date",
        value: "Date",
    }, ...__VLS_functionalComponentArgsRest(__VLS_93));
    var __VLS_83;
}
var __VLS_79;
const __VLS_96 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({
    label: "必填",
    width: "80",
    align: "center",
}));
const __VLS_98 = __VLS_97({
    label: "必填",
    width: "80",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_97));
__VLS_99.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_99.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_100 = {}.ElSwitch;
    /** @type {[typeof __VLS_components.ElSwitch, typeof __VLS_components.elSwitch, ]} */ ;
    // @ts-ignore
    const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({
        modelValue: (row.required),
    }));
    const __VLS_102 = __VLS_101({
        modelValue: (row.required),
    }, ...__VLS_functionalComponentArgsRest(__VLS_101));
}
var __VLS_99;
const __VLS_104 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_105 = __VLS_asFunctionalComponent(__VLS_104, new __VLS_104({
    label: "字典",
    width: "160",
}));
const __VLS_106 = __VLS_105({
    label: "字典",
    width: "160",
}, ...__VLS_functionalComponentArgsRest(__VLS_105));
__VLS_107.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_107.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_108 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({
        modelValue: (row.dictCode),
        placeholder: "可选",
    }));
    const __VLS_110 = __VLS_109({
        modelValue: (row.dictCode),
        placeholder: "可选",
    }, ...__VLS_functionalComponentArgsRest(__VLS_109));
}
var __VLS_107;
const __VLS_112 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_113 = __VLS_asFunctionalComponent(__VLS_112, new __VLS_112({
    label: "测试值",
    minWidth: "160",
}));
const __VLS_114 = __VLS_113({
    label: "测试值",
    minWidth: "160",
}, ...__VLS_functionalComponentArgsRest(__VLS_113));
__VLS_115.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_115.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_116 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_117 = __VLS_asFunctionalComponent(__VLS_116, new __VLS_116({
        modelValue: (row.testValue),
        placeholder: "运行时使用",
    }));
    const __VLS_118 = __VLS_117({
        modelValue: (row.testValue),
        placeholder: "运行时使用",
    }, ...__VLS_functionalComponentArgsRest(__VLS_117));
}
var __VLS_115;
const __VLS_120 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_121 = __VLS_asFunctionalComponent(__VLS_120, new __VLS_120({
    label: "操作",
    width: "90",
    fixed: "right",
    align: "center",
}));
const __VLS_122 = __VLS_121({
    label: "操作",
    width: "90",
    fixed: "right",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_121));
__VLS_123.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_123.slots;
    const [{ $index }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_124 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_125 = __VLS_asFunctionalComponent(__VLS_124, new __VLS_124({
        ...{ 'onClick': {} },
        size: "small",
        type: "danger",
    }));
    const __VLS_126 = __VLS_125({
        ...{ 'onClick': {} },
        size: "small",
        type: "danger",
    }, ...__VLS_functionalComponentArgsRest(__VLS_125));
    let __VLS_128;
    let __VLS_129;
    let __VLS_130;
    const __VLS_131 = {
        onClick: (...[$event]) => {
            __VLS_ctx.removeParam($index);
        }
    };
    __VLS_127.slots.default;
    var __VLS_127;
}
var __VLS_123;
var __VLS_67;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "col-span-3 border border-solid border-gray-200 rounded p-3 overflow-auto" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex items-center justify-between mb-2" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "font-600" },
});
if (__VLS_ctx.preview.columns.length) {
    const __VLS_132 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_133 = __VLS_asFunctionalComponent(__VLS_132, new __VLS_132({
        type: "success",
        size: "small",
    }));
    const __VLS_134 = __VLS_133({
        type: "success",
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_133));
    __VLS_135.slots.default;
    (__VLS_ctx.preview.rows.length);
    var __VLS_135;
}
if (__VLS_ctx.preview.columns.length) {
    const __VLS_136 = {}.ElTable;
    /** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
    // @ts-ignore
    const __VLS_137 = __VLS_asFunctionalComponent(__VLS_136, new __VLS_136({
        data: (__VLS_ctx.preview.rows),
        border: true,
        size: "small",
        height: "calc(100vh - 190px)",
    }));
    const __VLS_138 = __VLS_137({
        data: (__VLS_ctx.preview.rows),
        border: true,
        size: "small",
        height: "calc(100vh - 190px)",
    }, ...__VLS_functionalComponentArgsRest(__VLS_137));
    __VLS_139.slots.default;
    for (const [c] of __VLS_getVForSourceType((__VLS_ctx.preview.columns))) {
        const __VLS_140 = {}.ElTableColumn;
        /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
        // @ts-ignore
        const __VLS_141 = __VLS_asFunctionalComponent(__VLS_140, new __VLS_140({
            key: (c),
            prop: (c),
            label: (c),
            minWidth: "120",
            showOverflowTooltip: true,
        }));
        const __VLS_142 = __VLS_141({
            key: (c),
            prop: (c),
            label: (c),
            minWidth: "120",
            showOverflowTooltip: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_141));
    }
    var __VLS_139;
}
else {
    const __VLS_144 = {}.ElEmpty;
    /** @type {[typeof __VLS_components.ElEmpty, typeof __VLS_components.elEmpty, ]} */ ;
    // @ts-ignore
    const __VLS_145 = __VLS_asFunctionalComponent(__VLS_144, new __VLS_144({
        description: "暂无数据",
    }));
    const __VLS_146 = __VLS_145({
        description: "暂无数据",
    }, ...__VLS_functionalComponentArgsRest(__VLS_145));
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
/** @type {__VLS_StyleScopedClasses['col-span-6']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-solid']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-200']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['p-3']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['w-56']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-solid']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-200']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['p-3']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['font-600']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['col-span-3']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-solid']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-200']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['p-3']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['font-600']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            Codemirror: Codemirror,
            datasources: datasources,
            keyword: keyword,
            selectedViewId: selectedViewId,
            viewForm: viewForm,
            paramDefs: paramDefs,
            preview: preview,
            editorExtensions: editorExtensions,
            filteredViews: filteredViews,
            newView: newView,
            addParam: addParam,
            removeParam: removeParam,
            onSelectView: onSelectView,
            save: save,
            runPreview: runPreview,
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