import { computed, onMounted, reactive, ref } from 'vue';
import { ElMessage } from 'element-plus';
import Codemirror from 'vue-codemirror6';
import { sql } from '@codemirror/lang-sql';
import { listDatasources } from '@ppr/core';
import { getView, listViews, previewView, saveView } from '@ppr/core';
// 数据源列表
const datasources = ref([]);
// 视图列表
const views = ref([]);
// 搜索关键字
const keyword = ref('');
// 选中的视图ID
const selectedViewId = ref('');
// 视图表单数据
const viewForm = reactive({
    id: '',
    datasourceId: '',
    name: '',
    sqlContent: 'select 1 as value',
});
// 参数定义列表
const paramDefs = ref([]);
// 预览结果数据
const preview = reactive({
    columns: [],
    rows: [],
});
// CodeMirror 编辑器扩展
const editorExtensions = [sql()];
// 过滤后的视图列表
const filteredViews = computed(() => {
    const k = keyword.value.trim().toLowerCase();
    if (!k)
        return views.value;
    return views.value.filter((v) => v.name.toLowerCase().includes(k) || v.id.toLowerCase().includes(k));
});
/**
 * 构建参数映射对象
 */
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
/**
 * 重新加载数据源列表
 */
async function reloadDatasources() {
    const { data } = await listDatasources();
    datasources.value = data;
    if (!viewForm.datasourceId && data.length) {
        viewForm.datasourceId = data[0].id;
    }
}
/**
 * 重新加载视图列表
 */
async function reloadViews() {
    const { data } = await listViews();
    views.value = data;
}
/**
 * 新建视图
 */
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
/**
 * 新增参数定义
 */
function addParam() {
    paramDefs.value.push({ paramName: '', paramType: 'String', required: false, dictCode: '', testValue: '' });
}
/**
 * 移除参数定义
 * @param index 参数索引
 */
function removeParam(index) {
    paramDefs.value.splice(index, 1);
}
/**
 * 选中视图处理
 * @param id 视图ID
 */
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
/**
 * 保存视图
 */
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
/**
 * 运行并预览视图结果
 */
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
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "vd-container" },
});
/** @type {__VLS_StyleScopedClasses['vd-container']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "vd-sidebar" },
});
/** @type {__VLS_StyleScopedClasses['vd-sidebar']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "vd-header" },
});
/** @type {__VLS_StyleScopedClasses['vd-header']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "vd-title" },
});
/** @type {__VLS_StyleScopedClasses['vd-title']} */ ;
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
    { onClick: (__VLS_ctx.newView) });
const { default: __VLS_7 } = __VLS_3.slots;
// @ts-ignore
[newView,];
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
    defaultActive: (__VLS_ctx.selectedViewId),
    ...{ style: {} },
}));
const __VLS_15 = __VLS_14({
    ...{ 'onSelect': {} },
    defaultActive: (__VLS_ctx.selectedViewId),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_14));
let __VLS_18;
const __VLS_19 = ({ select: {} },
    { onSelect: (__VLS_ctx.onSelectView) });
const { default: __VLS_20 } = __VLS_16.slots;
for (const [v] of __VLS_vFor((__VLS_ctx.filteredViews))) {
    let __VLS_21;
    /** @ts-ignore @type {typeof __VLS_components.elMenuItem | typeof __VLS_components.ElMenuItem | typeof __VLS_components.elMenuItem | typeof __VLS_components.ElMenuItem} */
    elMenuItem;
    // @ts-ignore
    const __VLS_22 = __VLS_asFunctionalComponent1(__VLS_21, new __VLS_21({
        key: (v.id),
        index: (v.id),
    }));
    const __VLS_23 = __VLS_22({
        key: (v.id),
        index: (v.id),
    }, ...__VLS_functionalComponentArgsRest(__VLS_22));
    const { default: __VLS_26 } = __VLS_24.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "vd-flex-col" },
    });
    /** @type {__VLS_StyleScopedClasses['vd-flex-col']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "vd-truncate" },
    });
    /** @type {__VLS_StyleScopedClasses['vd-truncate']} */ ;
    (v.name);
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "vd-subtext" },
    });
    /** @type {__VLS_StyleScopedClasses['vd-subtext']} */ ;
    (v.id);
    // @ts-ignore
    [keyword, selectedViewId, onSelectView, filteredViews,];
    var __VLS_24;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_16;
var __VLS_17;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "vd-main" },
});
/** @type {__VLS_StyleScopedClasses['vd-main']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "vd-panel" },
});
/** @type {__VLS_StyleScopedClasses['vd-panel']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "vd-toolbar" },
});
/** @type {__VLS_StyleScopedClasses['vd-toolbar']} */ ;
let __VLS_27;
/** @ts-ignore @type {typeof __VLS_components.elInput | typeof __VLS_components.ElInput} */
elInput;
// @ts-ignore
const __VLS_28 = __VLS_asFunctionalComponent1(__VLS_27, new __VLS_27({
    modelValue: (__VLS_ctx.viewForm.name),
    placeholder: "视图名称",
    ...{ style: {} },
}));
const __VLS_29 = __VLS_28({
    modelValue: (__VLS_ctx.viewForm.name),
    placeholder: "视图名称",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_28));
let __VLS_32;
/** @ts-ignore @type {typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect} */
elSelect;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent1(__VLS_32, new __VLS_32({
    modelValue: (__VLS_ctx.viewForm.datasourceId),
    placeholder: "选择数据源",
    ...{ style: {} },
}));
const __VLS_34 = __VLS_33({
    modelValue: (__VLS_ctx.viewForm.datasourceId),
    placeholder: "选择数据源",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_33));
const { default: __VLS_37 } = __VLS_35.slots;
for (const [ds] of __VLS_vFor((__VLS_ctx.datasources))) {
    let __VLS_38;
    /** @ts-ignore @type {typeof __VLS_components.elOption | typeof __VLS_components.ElOption} */
    elOption;
    // @ts-ignore
    const __VLS_39 = __VLS_asFunctionalComponent1(__VLS_38, new __VLS_38({
        key: (ds.id),
        label: (ds.name),
        value: (ds.id),
    }));
    const __VLS_40 = __VLS_39({
        key: (ds.id),
        label: (ds.name),
        value: (ds.id),
    }, ...__VLS_functionalComponentArgsRest(__VLS_39));
    // @ts-ignore
    [viewForm, viewForm, datasources,];
}
// @ts-ignore
[];
var __VLS_35;
let __VLS_43;
/** @ts-ignore @type {typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components.elButton | typeof __VLS_components.ElButton} */
elButton;
// @ts-ignore
const __VLS_44 = __VLS_asFunctionalComponent1(__VLS_43, new __VLS_43({
    ...{ 'onClick': {} },
    type: "primary",
}));
const __VLS_45 = __VLS_44({
    ...{ 'onClick': {} },
    type: "primary",
}, ...__VLS_functionalComponentArgsRest(__VLS_44));
let __VLS_48;
const __VLS_49 = ({ click: {} },
    { onClick: (__VLS_ctx.save) });
const { default: __VLS_50 } = __VLS_46.slots;
// @ts-ignore
[save,];
var __VLS_46;
var __VLS_47;
let __VLS_51;
/** @ts-ignore @type {typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components.elButton | typeof __VLS_components.ElButton} */
elButton;
// @ts-ignore
const __VLS_52 = __VLS_asFunctionalComponent1(__VLS_51, new __VLS_51({
    ...{ 'onClick': {} },
}));
const __VLS_53 = __VLS_52({
    ...{ 'onClick': {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_52));
let __VLS_56;
const __VLS_57 = ({ click: {} },
    { onClick: (__VLS_ctx.runPreview) });
const { default: __VLS_58 } = __VLS_54.slots;
// @ts-ignore
[runPreview,];
var __VLS_54;
var __VLS_55;
let __VLS_59;
/** @ts-ignore @type {typeof __VLS_components.Codemirror} */
Codemirror;
// @ts-ignore
const __VLS_60 = __VLS_asFunctionalComponent1(__VLS_59, new __VLS_59({
    modelValue: (__VLS_ctx.viewForm.sqlContent),
    extensions: (__VLS_ctx.editorExtensions),
    ...{ style: ({ height: '320px' }) },
}));
const __VLS_61 = __VLS_60({
    modelValue: (__VLS_ctx.viewForm.sqlContent),
    extensions: (__VLS_ctx.editorExtensions),
    ...{ style: ({ height: '320px' }) },
}, ...__VLS_functionalComponentArgsRest(__VLS_60));
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "vd-panel-flex" },
});
/** @type {__VLS_StyleScopedClasses['vd-panel-flex']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "vd-header" },
});
/** @type {__VLS_StyleScopedClasses['vd-header']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "vd-title" },
});
/** @type {__VLS_StyleScopedClasses['vd-title']} */ ;
let __VLS_64;
/** @ts-ignore @type {typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components.elButton | typeof __VLS_components.ElButton} */
elButton;
// @ts-ignore
const __VLS_65 = __VLS_asFunctionalComponent1(__VLS_64, new __VLS_64({
    ...{ 'onClick': {} },
    size: "small",
}));
const __VLS_66 = __VLS_65({
    ...{ 'onClick': {} },
    size: "small",
}, ...__VLS_functionalComponentArgsRest(__VLS_65));
let __VLS_69;
const __VLS_70 = ({ click: {} },
    { onClick: (__VLS_ctx.addParam) });
const { default: __VLS_71 } = __VLS_67.slots;
// @ts-ignore
[viewForm, editorExtensions, addParam,];
var __VLS_67;
var __VLS_68;
let __VLS_72;
/** @ts-ignore @type {typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components.elTable | typeof __VLS_components.ElTable} */
elTable;
// @ts-ignore
const __VLS_73 = __VLS_asFunctionalComponent1(__VLS_72, new __VLS_72({
    data: (__VLS_ctx.paramDefs),
    border: true,
    size: "small",
}));
const __VLS_74 = __VLS_73({
    data: (__VLS_ctx.paramDefs),
    border: true,
    size: "small",
}, ...__VLS_functionalComponentArgsRest(__VLS_73));
const { default: __VLS_77 } = __VLS_75.slots;
let __VLS_78;
/** @ts-ignore @type {typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn} */
elTableColumn;
// @ts-ignore
const __VLS_79 = __VLS_asFunctionalComponent1(__VLS_78, new __VLS_78({
    label: "参数名",
    width: "150",
}));
const __VLS_80 = __VLS_79({
    label: "参数名",
    width: "150",
}, ...__VLS_functionalComponentArgsRest(__VLS_79));
const { default: __VLS_83 } = __VLS_81.slots;
{
    const { default: __VLS_84 } = __VLS_81.slots;
    const [{ row }] = __VLS_vSlot(__VLS_84);
    let __VLS_85;
    /** @ts-ignore @type {typeof __VLS_components.elInput | typeof __VLS_components.ElInput} */
    elInput;
    // @ts-ignore
    const __VLS_86 = __VLS_asFunctionalComponent1(__VLS_85, new __VLS_85({
        modelValue: (row.paramName),
        placeholder: "如: id",
    }));
    const __VLS_87 = __VLS_86({
        modelValue: (row.paramName),
        placeholder: "如: id",
    }, ...__VLS_functionalComponentArgsRest(__VLS_86));
    // @ts-ignore
    [paramDefs,];
}
// @ts-ignore
[];
var __VLS_81;
let __VLS_90;
/** @ts-ignore @type {typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn} */
elTableColumn;
// @ts-ignore
const __VLS_91 = __VLS_asFunctionalComponent1(__VLS_90, new __VLS_90({
    label: "类型",
    width: "140",
}));
const __VLS_92 = __VLS_91({
    label: "类型",
    width: "140",
}, ...__VLS_functionalComponentArgsRest(__VLS_91));
const { default: __VLS_95 } = __VLS_93.slots;
{
    const { default: __VLS_96 } = __VLS_93.slots;
    const [{ row }] = __VLS_vSlot(__VLS_96);
    let __VLS_97;
    /** @ts-ignore @type {typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect} */
    elSelect;
    // @ts-ignore
    const __VLS_98 = __VLS_asFunctionalComponent1(__VLS_97, new __VLS_97({
        modelValue: (row.paramType),
        ...{ style: {} },
    }));
    const __VLS_99 = __VLS_98({
        modelValue: (row.paramType),
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_98));
    const { default: __VLS_102 } = __VLS_100.slots;
    let __VLS_103;
    /** @ts-ignore @type {typeof __VLS_components.elOption | typeof __VLS_components.ElOption} */
    elOption;
    // @ts-ignore
    const __VLS_104 = __VLS_asFunctionalComponent1(__VLS_103, new __VLS_103({
        label: "String",
        value: "String",
    }));
    const __VLS_105 = __VLS_104({
        label: "String",
        value: "String",
    }, ...__VLS_functionalComponentArgsRest(__VLS_104));
    let __VLS_108;
    /** @ts-ignore @type {typeof __VLS_components.elOption | typeof __VLS_components.ElOption} */
    elOption;
    // @ts-ignore
    const __VLS_109 = __VLS_asFunctionalComponent1(__VLS_108, new __VLS_108({
        label: "Number",
        value: "Number",
    }));
    const __VLS_110 = __VLS_109({
        label: "Number",
        value: "Number",
    }, ...__VLS_functionalComponentArgsRest(__VLS_109));
    let __VLS_113;
    /** @ts-ignore @type {typeof __VLS_components.elOption | typeof __VLS_components.ElOption} */
    elOption;
    // @ts-ignore
    const __VLS_114 = __VLS_asFunctionalComponent1(__VLS_113, new __VLS_113({
        label: "Date",
        value: "Date",
    }));
    const __VLS_115 = __VLS_114({
        label: "Date",
        value: "Date",
    }, ...__VLS_functionalComponentArgsRest(__VLS_114));
    // @ts-ignore
    [];
    var __VLS_100;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_93;
let __VLS_118;
/** @ts-ignore @type {typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn} */
elTableColumn;
// @ts-ignore
const __VLS_119 = __VLS_asFunctionalComponent1(__VLS_118, new __VLS_118({
    label: "必填",
    width: "80",
    align: "center",
}));
const __VLS_120 = __VLS_119({
    label: "必填",
    width: "80",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_119));
const { default: __VLS_123 } = __VLS_121.slots;
{
    const { default: __VLS_124 } = __VLS_121.slots;
    const [{ row }] = __VLS_vSlot(__VLS_124);
    let __VLS_125;
    /** @ts-ignore @type {typeof __VLS_components.elSwitch | typeof __VLS_components.ElSwitch} */
    elSwitch;
    // @ts-ignore
    const __VLS_126 = __VLS_asFunctionalComponent1(__VLS_125, new __VLS_125({
        modelValue: (row.required),
    }));
    const __VLS_127 = __VLS_126({
        modelValue: (row.required),
    }, ...__VLS_functionalComponentArgsRest(__VLS_126));
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_121;
let __VLS_130;
/** @ts-ignore @type {typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn} */
elTableColumn;
// @ts-ignore
const __VLS_131 = __VLS_asFunctionalComponent1(__VLS_130, new __VLS_130({
    label: "字典",
    width: "160",
}));
const __VLS_132 = __VLS_131({
    label: "字典",
    width: "160",
}, ...__VLS_functionalComponentArgsRest(__VLS_131));
const { default: __VLS_135 } = __VLS_133.slots;
{
    const { default: __VLS_136 } = __VLS_133.slots;
    const [{ row }] = __VLS_vSlot(__VLS_136);
    let __VLS_137;
    /** @ts-ignore @type {typeof __VLS_components.elInput | typeof __VLS_components.ElInput} */
    elInput;
    // @ts-ignore
    const __VLS_138 = __VLS_asFunctionalComponent1(__VLS_137, new __VLS_137({
        modelValue: (row.dictCode),
        placeholder: "可选",
    }));
    const __VLS_139 = __VLS_138({
        modelValue: (row.dictCode),
        placeholder: "可选",
    }, ...__VLS_functionalComponentArgsRest(__VLS_138));
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_133;
let __VLS_142;
/** @ts-ignore @type {typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn} */
elTableColumn;
// @ts-ignore
const __VLS_143 = __VLS_asFunctionalComponent1(__VLS_142, new __VLS_142({
    label: "测试值",
    minWidth: "160",
}));
const __VLS_144 = __VLS_143({
    label: "测试值",
    minWidth: "160",
}, ...__VLS_functionalComponentArgsRest(__VLS_143));
const { default: __VLS_147 } = __VLS_145.slots;
{
    const { default: __VLS_148 } = __VLS_145.slots;
    const [{ row }] = __VLS_vSlot(__VLS_148);
    let __VLS_149;
    /** @ts-ignore @type {typeof __VLS_components.elInput | typeof __VLS_components.ElInput} */
    elInput;
    // @ts-ignore
    const __VLS_150 = __VLS_asFunctionalComponent1(__VLS_149, new __VLS_149({
        modelValue: (row.testValue),
        placeholder: "运行时使用",
    }));
    const __VLS_151 = __VLS_150({
        modelValue: (row.testValue),
        placeholder: "运行时使用",
    }, ...__VLS_functionalComponentArgsRest(__VLS_150));
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_145;
let __VLS_154;
/** @ts-ignore @type {typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn} */
elTableColumn;
// @ts-ignore
const __VLS_155 = __VLS_asFunctionalComponent1(__VLS_154, new __VLS_154({
    label: "操作",
    width: "90",
    fixed: "right",
    align: "center",
}));
const __VLS_156 = __VLS_155({
    label: "操作",
    width: "90",
    fixed: "right",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_155));
const { default: __VLS_159 } = __VLS_157.slots;
{
    const { default: __VLS_160 } = __VLS_157.slots;
    const [{ $index }] = __VLS_vSlot(__VLS_160);
    let __VLS_161;
    /** @ts-ignore @type {typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components.elButton | typeof __VLS_components.ElButton} */
    elButton;
    // @ts-ignore
    const __VLS_162 = __VLS_asFunctionalComponent1(__VLS_161, new __VLS_161({
        ...{ 'onClick': {} },
        size: "small",
        type: "danger",
    }));
    const __VLS_163 = __VLS_162({
        ...{ 'onClick': {} },
        size: "small",
        type: "danger",
    }, ...__VLS_functionalComponentArgsRest(__VLS_162));
    let __VLS_166;
    const __VLS_167 = ({ click: {} },
        { onClick: (...[$event]) => {
                __VLS_ctx.removeParam($index);
                // @ts-ignore
                [removeParam,];
            } });
    const { default: __VLS_168 } = __VLS_164.slots;
    // @ts-ignore
    [];
    var __VLS_164;
    var __VLS_165;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_157;
// @ts-ignore
[];
var __VLS_75;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "vd-preview" },
});
/** @type {__VLS_StyleScopedClasses['vd-preview']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "vd-header" },
});
/** @type {__VLS_StyleScopedClasses['vd-header']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "vd-title" },
});
/** @type {__VLS_StyleScopedClasses['vd-title']} */ ;
if (__VLS_ctx.preview.columns.length) {
    let __VLS_169;
    /** @ts-ignore @type {typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components.elTag | typeof __VLS_components.ElTag} */
    elTag;
    // @ts-ignore
    const __VLS_170 = __VLS_asFunctionalComponent1(__VLS_169, new __VLS_169({
        type: "success",
        size: "small",
    }));
    const __VLS_171 = __VLS_170({
        type: "success",
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_170));
    const { default: __VLS_174 } = __VLS_172.slots;
    (__VLS_ctx.preview.rows.length);
    // @ts-ignore
    [preview, preview,];
    var __VLS_172;
}
if (__VLS_ctx.preview.columns.length) {
    let __VLS_175;
    /** @ts-ignore @type {typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components.elTable | typeof __VLS_components.ElTable} */
    elTable;
    // @ts-ignore
    const __VLS_176 = __VLS_asFunctionalComponent1(__VLS_175, new __VLS_175({
        data: (__VLS_ctx.preview.rows),
        border: true,
        size: "small",
        height: "calc(100vh - 190px)",
    }));
    const __VLS_177 = __VLS_176({
        data: (__VLS_ctx.preview.rows),
        border: true,
        size: "small",
        height: "calc(100vh - 190px)",
    }, ...__VLS_functionalComponentArgsRest(__VLS_176));
    const { default: __VLS_180 } = __VLS_178.slots;
    for (const [c] of __VLS_vFor((__VLS_ctx.preview.columns))) {
        let __VLS_181;
        /** @ts-ignore @type {typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn} */
        elTableColumn;
        // @ts-ignore
        const __VLS_182 = __VLS_asFunctionalComponent1(__VLS_181, new __VLS_181({
            key: (c),
            prop: (c),
            label: (c),
            minWidth: "120",
            showOverflowTooltip: true,
        }));
        const __VLS_183 = __VLS_182({
            key: (c),
            prop: (c),
            label: (c),
            minWidth: "120",
            showOverflowTooltip: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_182));
        // @ts-ignore
        [preview, preview, preview,];
    }
    // @ts-ignore
    [];
    var __VLS_178;
}
else {
    let __VLS_186;
    /** @ts-ignore @type {typeof __VLS_components.elEmpty | typeof __VLS_components.ElEmpty} */
    elEmpty;
    // @ts-ignore
    const __VLS_187 = __VLS_asFunctionalComponent1(__VLS_186, new __VLS_186({
        description: "暂无数据",
    }));
    const __VLS_188 = __VLS_187({
        description: "暂无数据",
    }, ...__VLS_functionalComponentArgsRest(__VLS_187));
}
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
//# sourceMappingURL=index.vue.js.map