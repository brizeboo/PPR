import { computed, onMounted, reactive, ref } from 'vue';
import { ElMessage } from 'element-plus';
import Codemirror from 'vue-codemirror6';
import { sql } from '@codemirror/lang-sql';
import { listDatasources } from '@ppr/core';
import { getView, listViews, previewView, saveView, deleteView } from '@ppr/core';
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
// 抽屉开关
const drawerOpen = ref(false);
// 弹窗开关
const dialogVisible = ref(false);
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
 * 重置 SQL 编辑器内容
 */
function resetSql() {
    viewForm.sqlContent = 'select 1 as value';
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
    dialogVisible.value = true;
}
/**
 * 选中视图处理（表格行点击）
 * @param row 选中的视图对象
 */
async function onSelectViewRow(row) {
    // 只选中不弹窗，如果要编辑请点击编辑按钮
}
/**
 * 编辑视图
 * @param row 选中的视图对象
 */
async function editView(row) {
    selectedViewId.value = row.id;
    const { data } = await getView(row.id);
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
    dialogVisible.value = true;
}
/**
 * 新增参数定义 (在末尾添加)
 */
function addParam() {
    paramDefs.value.push({ paramName: '', paramType: 'String', required: false, dictCode: '', testValue: '' });
}
/**
 * 插入参数定义 (在指定位置插入)
 * @param index 插入位置的索引
 */
function insertParam(index) {
    paramDefs.value.splice(index + 1, 0, { paramName: '', paramType: 'String', required: false, dictCode: '', testValue: '' });
}
/**
 * 移除参数定义
 * @param index 参数索引
 */
function removeParam(index) {
    paramDefs.value.splice(index, 1);
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
    drawerOpen.value = true;
}
/**
 * 在表格中直接运行并预览某行视图
 */
async function runPreviewRow(row) {
    const req = { viewId: String(row.id), params: {} };
    const { data } = await previewView(req);
    preview.columns = data.columns;
    preview.rows = data.rows;
    ElMessage.success('运行成功');
    drawerOpen.value = true;
}
/**
 * 删除视图
 * @param id 视图ID
 */
async function onDelete(id) {
    await deleteView(id);
    ElMessage.success('删除成功');
    await reloadViews();
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
    type: "primary",
}));
const __VLS_2 = __VLS_1({
    ...{ 'onClick': {} },
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
/** @ts-ignore @type {typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components.elTable | typeof __VLS_components.ElTable} */
elTable;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent1(__VLS_8, new __VLS_8({
    data: (__VLS_ctx.filteredViews),
    border: true,
    height: "calc(100vh - 180px)",
}));
const __VLS_10 = __VLS_9({
    data: (__VLS_ctx.filteredViews),
    border: true,
    height: "calc(100vh - 180px)",
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
const { default: __VLS_13 } = __VLS_11.slots;
let __VLS_14;
/** @ts-ignore @type {typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn} */
elTableColumn;
// @ts-ignore
const __VLS_15 = __VLS_asFunctionalComponent1(__VLS_14, new __VLS_14({
    prop: "name",
    label: "视图名称",
    minWidth: "120",
    showOverflowTooltip: true,
}));
const __VLS_16 = __VLS_15({
    prop: "name",
    label: "视图名称",
    minWidth: "120",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_15));
let __VLS_19;
/** @ts-ignore @type {typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn} */
elTableColumn;
// @ts-ignore
const __VLS_20 = __VLS_asFunctionalComponent1(__VLS_19, new __VLS_19({
    label: "操作",
    width: "220",
    fixed: "right",
}));
const __VLS_21 = __VLS_20({
    label: "操作",
    width: "220",
    fixed: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_20));
const { default: __VLS_24 } = __VLS_22.slots;
{
    const { default: __VLS_25 } = __VLS_22.slots;
    const [{ row }] = __VLS_vSlot(__VLS_25);
    let __VLS_26;
    /** @ts-ignore @type {typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components.elButton | typeof __VLS_components.ElButton} */
    elButton;
    // @ts-ignore
    const __VLS_27 = __VLS_asFunctionalComponent1(__VLS_26, new __VLS_26({
        ...{ 'onClick': {} },
        size: "small",
    }));
    const __VLS_28 = __VLS_27({
        ...{ 'onClick': {} },
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_27));
    let __VLS_31;
    const __VLS_32 = ({ click: {} },
        { onClick: (...[$event]) => {
                __VLS_ctx.editView(row);
                // @ts-ignore
                [filteredViews, editView,];
            } });
    const { default: __VLS_33 } = __VLS_29.slots;
    // @ts-ignore
    [];
    var __VLS_29;
    var __VLS_30;
    let __VLS_34;
    /** @ts-ignore @type {typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components.elButton | typeof __VLS_components.ElButton} */
    elButton;
    // @ts-ignore
    const __VLS_35 = __VLS_asFunctionalComponent1(__VLS_34, new __VLS_34({
        ...{ 'onClick': {} },
        size: "small",
    }));
    const __VLS_36 = __VLS_35({
        ...{ 'onClick': {} },
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_35));
    let __VLS_39;
    const __VLS_40 = ({ click: {} },
        { onClick: (...[$event]) => {
                __VLS_ctx.runPreviewRow(row);
                // @ts-ignore
                [runPreviewRow,];
            } });
    const { default: __VLS_41 } = __VLS_37.slots;
    // @ts-ignore
    [];
    var __VLS_37;
    var __VLS_38;
    let __VLS_42;
    /** @ts-ignore @type {typeof __VLS_components.elPopconfirm | typeof __VLS_components.ElPopconfirm | typeof __VLS_components.elPopconfirm | typeof __VLS_components.ElPopconfirm} */
    elPopconfirm;
    // @ts-ignore
    const __VLS_43 = __VLS_asFunctionalComponent1(__VLS_42, new __VLS_42({
        ...{ 'onConfirm': {} },
        title: "确认删除该视图？",
    }));
    const __VLS_44 = __VLS_43({
        ...{ 'onConfirm': {} },
        title: "确认删除该视图？",
    }, ...__VLS_functionalComponentArgsRest(__VLS_43));
    let __VLS_47;
    const __VLS_48 = ({ confirm: {} },
        { onConfirm: (...[$event]) => {
                __VLS_ctx.onDelete(row.id);
                // @ts-ignore
                [onDelete,];
            } });
    const { default: __VLS_49 } = __VLS_45.slots;
    {
        const { reference: __VLS_50 } = __VLS_45.slots;
        let __VLS_51;
        /** @ts-ignore @type {typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components.elButton | typeof __VLS_components.ElButton} */
        elButton;
        // @ts-ignore
        const __VLS_52 = __VLS_asFunctionalComponent1(__VLS_51, new __VLS_51({
            ...{ 'onClick': {} },
            size: "small",
            type: "danger",
        }));
        const __VLS_53 = __VLS_52({
            ...{ 'onClick': {} },
            size: "small",
            type: "danger",
        }, ...__VLS_functionalComponentArgsRest(__VLS_52));
        let __VLS_56;
        const __VLS_57 = ({ click: {} },
            { onClick: () => { } });
        const { default: __VLS_58 } = __VLS_54.slots;
        // @ts-ignore
        [];
        var __VLS_54;
        var __VLS_55;
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
    var __VLS_45;
    var __VLS_46;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_22;
// @ts-ignore
[];
var __VLS_11;
let __VLS_59;
/** @ts-ignore @type {typeof __VLS_components.elDrawer | typeof __VLS_components.ElDrawer | typeof __VLS_components.elDrawer | typeof __VLS_components.ElDrawer} */
elDrawer;
// @ts-ignore
const __VLS_60 = __VLS_asFunctionalComponent1(__VLS_59, new __VLS_59({
    modelValue: (__VLS_ctx.dialogVisible),
    title: (__VLS_ctx.viewForm.id ? '编辑视图' : '新建视图'),
    size: "80%",
    destroyOnClose: true,
}));
const __VLS_61 = __VLS_60({
    modelValue: (__VLS_ctx.dialogVisible),
    title: (__VLS_ctx.viewForm.id ? '编辑视图' : '新建视图'),
    size: "80%",
    destroyOnClose: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_60));
const { default: __VLS_64 } = __VLS_62.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "vd-main" },
    ...{ style: {} },
});
/** @type {__VLS_StyleScopedClasses['vd-main']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "vd-panel" },
    ...{ style: {} },
});
/** @type {__VLS_StyleScopedClasses['vd-panel']} */ ;
let __VLS_65;
/** @ts-ignore @type {typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components.elForm | typeof __VLS_components.ElForm} */
elForm;
// @ts-ignore
const __VLS_66 = __VLS_asFunctionalComponent1(__VLS_65, new __VLS_65({
    model: (__VLS_ctx.viewForm),
    labelWidth: "100px",
    ...{ class: "vd-form" },
}));
const __VLS_67 = __VLS_66({
    model: (__VLS_ctx.viewForm),
    labelWidth: "100px",
    ...{ class: "vd-form" },
}, ...__VLS_functionalComponentArgsRest(__VLS_66));
/** @type {__VLS_StyleScopedClasses['vd-form']} */ ;
const { default: __VLS_70 } = __VLS_68.slots;
let __VLS_71;
/** @ts-ignore @type {typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem} */
elFormItem;
// @ts-ignore
const __VLS_72 = __VLS_asFunctionalComponent1(__VLS_71, new __VLS_71({
    label: "视图名称",
}));
const __VLS_73 = __VLS_72({
    label: "视图名称",
}, ...__VLS_functionalComponentArgsRest(__VLS_72));
const { default: __VLS_76 } = __VLS_74.slots;
let __VLS_77;
/** @ts-ignore @type {typeof __VLS_components.elInput | typeof __VLS_components.ElInput} */
elInput;
// @ts-ignore
const __VLS_78 = __VLS_asFunctionalComponent1(__VLS_77, new __VLS_77({
    modelValue: (__VLS_ctx.viewForm.name),
    placeholder: "请输入视图名称",
}));
const __VLS_79 = __VLS_78({
    modelValue: (__VLS_ctx.viewForm.name),
    placeholder: "请输入视图名称",
}, ...__VLS_functionalComponentArgsRest(__VLS_78));
// @ts-ignore
[dialogVisible, viewForm, viewForm, viewForm,];
var __VLS_74;
let __VLS_82;
/** @ts-ignore @type {typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem} */
elFormItem;
// @ts-ignore
const __VLS_83 = __VLS_asFunctionalComponent1(__VLS_82, new __VLS_82({
    label: "选择数据源",
}));
const __VLS_84 = __VLS_83({
    label: "选择数据源",
}, ...__VLS_functionalComponentArgsRest(__VLS_83));
const { default: __VLS_87 } = __VLS_85.slots;
let __VLS_88;
/** @ts-ignore @type {typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect} */
elSelect;
// @ts-ignore
const __VLS_89 = __VLS_asFunctionalComponent1(__VLS_88, new __VLS_88({
    modelValue: (__VLS_ctx.viewForm.datasourceId),
    placeholder: "请选择数据源",
    ...{ style: {} },
}));
const __VLS_90 = __VLS_89({
    modelValue: (__VLS_ctx.viewForm.datasourceId),
    placeholder: "请选择数据源",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_89));
const { default: __VLS_93 } = __VLS_91.slots;
for (const [ds] of __VLS_vFor((__VLS_ctx.datasources))) {
    let __VLS_94;
    /** @ts-ignore @type {typeof __VLS_components.elOption | typeof __VLS_components.ElOption} */
    elOption;
    // @ts-ignore
    const __VLS_95 = __VLS_asFunctionalComponent1(__VLS_94, new __VLS_94({
        key: (ds.id),
        label: (ds.name),
        value: (ds.id),
    }));
    const __VLS_96 = __VLS_95({
        key: (ds.id),
        label: (ds.name),
        value: (ds.id),
    }, ...__VLS_functionalComponentArgsRest(__VLS_95));
    // @ts-ignore
    [viewForm, datasources,];
}
// @ts-ignore
[];
var __VLS_91;
// @ts-ignore
[];
var __VLS_85;
// @ts-ignore
[];
var __VLS_68;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "vd-panel" },
    ...{ style: {} },
});
/** @type {__VLS_StyleScopedClasses['vd-panel']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "vd-header" },
});
/** @type {__VLS_StyleScopedClasses['vd-header']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "vd-title" },
});
/** @type {__VLS_StyleScopedClasses['vd-title']} */ ;
let __VLS_99;
/** @ts-ignore @type {typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components.elButton | typeof __VLS_components.ElButton} */
elButton;
// @ts-ignore
const __VLS_100 = __VLS_asFunctionalComponent1(__VLS_99, new __VLS_99({
    ...{ 'onClick': {} },
    size: "small",
}));
const __VLS_101 = __VLS_100({
    ...{ 'onClick': {} },
    size: "small",
}, ...__VLS_functionalComponentArgsRest(__VLS_100));
let __VLS_104;
const __VLS_105 = ({ click: {} },
    { onClick: (__VLS_ctx.resetSql) });
const { default: __VLS_106 } = __VLS_102.slots;
// @ts-ignore
[resetSql,];
var __VLS_102;
var __VLS_103;
let __VLS_107;
/** @ts-ignore @type {typeof __VLS_components.Codemirror} */
Codemirror;
// @ts-ignore
const __VLS_108 = __VLS_asFunctionalComponent1(__VLS_107, new __VLS_107({
    modelValue: (__VLS_ctx.viewForm.sqlContent),
    extensions: (__VLS_ctx.editorExtensions),
    ...{ style: ({ height: '240px', border: '1px solid #e5e7eb', borderRadius: '4px', overflow: 'hidden' }) },
}));
const __VLS_109 = __VLS_108({
    modelValue: (__VLS_ctx.viewForm.sqlContent),
    extensions: (__VLS_ctx.editorExtensions),
    ...{ style: ({ height: '240px', border: '1px solid #e5e7eb', borderRadius: '4px', overflow: 'hidden' }) },
}, ...__VLS_functionalComponentArgsRest(__VLS_108));
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "vd-panel-flex" },
    ...{ style: {} },
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
let __VLS_112;
/** @ts-ignore @type {typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components.elButton | typeof __VLS_components.ElButton} */
elButton;
// @ts-ignore
const __VLS_113 = __VLS_asFunctionalComponent1(__VLS_112, new __VLS_112({
    ...{ 'onClick': {} },
    size: "small",
}));
const __VLS_114 = __VLS_113({
    ...{ 'onClick': {} },
    size: "small",
}, ...__VLS_functionalComponentArgsRest(__VLS_113));
let __VLS_117;
const __VLS_118 = ({ click: {} },
    { onClick: (__VLS_ctx.addParam) });
const { default: __VLS_119 } = __VLS_115.slots;
// @ts-ignore
[viewForm, editorExtensions, addParam,];
var __VLS_115;
var __VLS_116;
let __VLS_120;
/** @ts-ignore @type {typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components.elTable | typeof __VLS_components.ElTable} */
elTable;
// @ts-ignore
const __VLS_121 = __VLS_asFunctionalComponent1(__VLS_120, new __VLS_120({
    data: (__VLS_ctx.paramDefs),
    border: true,
    size: "small",
}));
const __VLS_122 = __VLS_121({
    data: (__VLS_ctx.paramDefs),
    border: true,
    size: "small",
}, ...__VLS_functionalComponentArgsRest(__VLS_121));
const { default: __VLS_125 } = __VLS_123.slots;
let __VLS_126;
/** @ts-ignore @type {typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn} */
elTableColumn;
// @ts-ignore
const __VLS_127 = __VLS_asFunctionalComponent1(__VLS_126, new __VLS_126({
    label: "参数名",
    width: "150",
}));
const __VLS_128 = __VLS_127({
    label: "参数名",
    width: "150",
}, ...__VLS_functionalComponentArgsRest(__VLS_127));
const { default: __VLS_131 } = __VLS_129.slots;
{
    const { default: __VLS_132 } = __VLS_129.slots;
    const [{ row }] = __VLS_vSlot(__VLS_132);
    let __VLS_133;
    /** @ts-ignore @type {typeof __VLS_components.elInput | typeof __VLS_components.ElInput} */
    elInput;
    // @ts-ignore
    const __VLS_134 = __VLS_asFunctionalComponent1(__VLS_133, new __VLS_133({
        modelValue: (row.paramName),
        placeholder: "如: id",
    }));
    const __VLS_135 = __VLS_134({
        modelValue: (row.paramName),
        placeholder: "如: id",
    }, ...__VLS_functionalComponentArgsRest(__VLS_134));
    // @ts-ignore
    [paramDefs,];
}
// @ts-ignore
[];
var __VLS_129;
let __VLS_138;
/** @ts-ignore @type {typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn} */
elTableColumn;
// @ts-ignore
const __VLS_139 = __VLS_asFunctionalComponent1(__VLS_138, new __VLS_138({
    label: "类型",
    width: "140",
}));
const __VLS_140 = __VLS_139({
    label: "类型",
    width: "140",
}, ...__VLS_functionalComponentArgsRest(__VLS_139));
const { default: __VLS_143 } = __VLS_141.slots;
{
    const { default: __VLS_144 } = __VLS_141.slots;
    const [{ row }] = __VLS_vSlot(__VLS_144);
    let __VLS_145;
    /** @ts-ignore @type {typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect} */
    elSelect;
    // @ts-ignore
    const __VLS_146 = __VLS_asFunctionalComponent1(__VLS_145, new __VLS_145({
        modelValue: (row.paramType),
        ...{ style: {} },
    }));
    const __VLS_147 = __VLS_146({
        modelValue: (row.paramType),
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_146));
    const { default: __VLS_150 } = __VLS_148.slots;
    let __VLS_151;
    /** @ts-ignore @type {typeof __VLS_components.elOption | typeof __VLS_components.ElOption} */
    elOption;
    // @ts-ignore
    const __VLS_152 = __VLS_asFunctionalComponent1(__VLS_151, new __VLS_151({
        label: "String",
        value: "String",
    }));
    const __VLS_153 = __VLS_152({
        label: "String",
        value: "String",
    }, ...__VLS_functionalComponentArgsRest(__VLS_152));
    let __VLS_156;
    /** @ts-ignore @type {typeof __VLS_components.elOption | typeof __VLS_components.ElOption} */
    elOption;
    // @ts-ignore
    const __VLS_157 = __VLS_asFunctionalComponent1(__VLS_156, new __VLS_156({
        label: "Number",
        value: "Number",
    }));
    const __VLS_158 = __VLS_157({
        label: "Number",
        value: "Number",
    }, ...__VLS_functionalComponentArgsRest(__VLS_157));
    let __VLS_161;
    /** @ts-ignore @type {typeof __VLS_components.elOption | typeof __VLS_components.ElOption} */
    elOption;
    // @ts-ignore
    const __VLS_162 = __VLS_asFunctionalComponent1(__VLS_161, new __VLS_161({
        label: "Date",
        value: "Date",
    }));
    const __VLS_163 = __VLS_162({
        label: "Date",
        value: "Date",
    }, ...__VLS_functionalComponentArgsRest(__VLS_162));
    // @ts-ignore
    [];
    var __VLS_148;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_141;
let __VLS_166;
/** @ts-ignore @type {typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn} */
elTableColumn;
// @ts-ignore
const __VLS_167 = __VLS_asFunctionalComponent1(__VLS_166, new __VLS_166({
    label: "必填",
    width: "80",
    align: "center",
}));
const __VLS_168 = __VLS_167({
    label: "必填",
    width: "80",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_167));
const { default: __VLS_171 } = __VLS_169.slots;
{
    const { default: __VLS_172 } = __VLS_169.slots;
    const [{ row }] = __VLS_vSlot(__VLS_172);
    let __VLS_173;
    /** @ts-ignore @type {typeof __VLS_components.elSwitch | typeof __VLS_components.ElSwitch} */
    elSwitch;
    // @ts-ignore
    const __VLS_174 = __VLS_asFunctionalComponent1(__VLS_173, new __VLS_173({
        modelValue: (row.required),
    }));
    const __VLS_175 = __VLS_174({
        modelValue: (row.required),
    }, ...__VLS_functionalComponentArgsRest(__VLS_174));
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_169;
let __VLS_178;
/** @ts-ignore @type {typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn} */
elTableColumn;
// @ts-ignore
const __VLS_179 = __VLS_asFunctionalComponent1(__VLS_178, new __VLS_178({
    label: "测试值",
    minWidth: "160",
}));
const __VLS_180 = __VLS_179({
    label: "测试值",
    minWidth: "160",
}, ...__VLS_functionalComponentArgsRest(__VLS_179));
const { default: __VLS_183 } = __VLS_181.slots;
{
    const { default: __VLS_184 } = __VLS_181.slots;
    const [{ row }] = __VLS_vSlot(__VLS_184);
    let __VLS_185;
    /** @ts-ignore @type {typeof __VLS_components.elInput | typeof __VLS_components.ElInput} */
    elInput;
    // @ts-ignore
    const __VLS_186 = __VLS_asFunctionalComponent1(__VLS_185, new __VLS_185({
        modelValue: (row.testValue),
        placeholder: "运行时使用",
    }));
    const __VLS_187 = __VLS_186({
        modelValue: (row.testValue),
        placeholder: "运行时使用",
    }, ...__VLS_functionalComponentArgsRest(__VLS_186));
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_181;
let __VLS_190;
/** @ts-ignore @type {typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn} */
elTableColumn;
// @ts-ignore
const __VLS_191 = __VLS_asFunctionalComponent1(__VLS_190, new __VLS_190({
    label: "操作",
    width: "140",
    fixed: "right",
    align: "center",
}));
const __VLS_192 = __VLS_191({
    label: "操作",
    width: "140",
    fixed: "right",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_191));
const { default: __VLS_195 } = __VLS_193.slots;
{
    const { default: __VLS_196 } = __VLS_193.slots;
    const [{ $index }] = __VLS_vSlot(__VLS_196);
    let __VLS_197;
    /** @ts-ignore @type {typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components.elButton | typeof __VLS_components.ElButton} */
    elButton;
    // @ts-ignore
    const __VLS_198 = __VLS_asFunctionalComponent1(__VLS_197, new __VLS_197({
        ...{ 'onClick': {} },
        size: "small",
        type: "primary",
    }));
    const __VLS_199 = __VLS_198({
        ...{ 'onClick': {} },
        size: "small",
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_198));
    let __VLS_202;
    const __VLS_203 = ({ click: {} },
        { onClick: (...[$event]) => {
                __VLS_ctx.insertParam($index);
                // @ts-ignore
                [insertParam,];
            } });
    const { default: __VLS_204 } = __VLS_200.slots;
    // @ts-ignore
    [];
    var __VLS_200;
    var __VLS_201;
    let __VLS_205;
    /** @ts-ignore @type {typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components.elButton | typeof __VLS_components.ElButton} */
    elButton;
    // @ts-ignore
    const __VLS_206 = __VLS_asFunctionalComponent1(__VLS_205, new __VLS_205({
        ...{ 'onClick': {} },
        size: "small",
        type: "danger",
    }));
    const __VLS_207 = __VLS_206({
        ...{ 'onClick': {} },
        size: "small",
        type: "danger",
    }, ...__VLS_functionalComponentArgsRest(__VLS_206));
    let __VLS_210;
    const __VLS_211 = ({ click: {} },
        { onClick: (...[$event]) => {
                __VLS_ctx.removeParam($index);
                // @ts-ignore
                [removeParam,];
            } });
    const { default: __VLS_212 } = __VLS_208.slots;
    // @ts-ignore
    [];
    var __VLS_208;
    var __VLS_209;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_193;
// @ts-ignore
[];
var __VLS_123;
{
    const { footer: __VLS_213 } = __VLS_62.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "vd-drawer-footer" },
    });
    /** @type {__VLS_StyleScopedClasses['vd-drawer-footer']} */ ;
    let __VLS_214;
    /** @ts-ignore @type {typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components.elButton | typeof __VLS_components.ElButton} */
    elButton;
    // @ts-ignore
    const __VLS_215 = __VLS_asFunctionalComponent1(__VLS_214, new __VLS_214({
        ...{ 'onClick': {} },
    }));
    const __VLS_216 = __VLS_215({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_215));
    let __VLS_219;
    const __VLS_220 = ({ click: {} },
        { onClick: (__VLS_ctx.runPreview) });
    const { default: __VLS_221 } = __VLS_217.slots;
    // @ts-ignore
    [runPreview,];
    var __VLS_217;
    var __VLS_218;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "vd-drawer-actions" },
    });
    /** @type {__VLS_StyleScopedClasses['vd-drawer-actions']} */ ;
    let __VLS_222;
    /** @ts-ignore @type {typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components.elButton | typeof __VLS_components.ElButton} */
    elButton;
    // @ts-ignore
    const __VLS_223 = __VLS_asFunctionalComponent1(__VLS_222, new __VLS_222({
        ...{ 'onClick': {} },
    }));
    const __VLS_224 = __VLS_223({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_223));
    let __VLS_227;
    const __VLS_228 = ({ click: {} },
        { onClick: (...[$event]) => {
                __VLS_ctx.dialogVisible = false;
                // @ts-ignore
                [dialogVisible,];
            } });
    const { default: __VLS_229 } = __VLS_225.slots;
    // @ts-ignore
    [];
    var __VLS_225;
    var __VLS_226;
    let __VLS_230;
    /** @ts-ignore @type {typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components.elButton | typeof __VLS_components.ElButton} */
    elButton;
    // @ts-ignore
    const __VLS_231 = __VLS_asFunctionalComponent1(__VLS_230, new __VLS_230({
        ...{ 'onClick': {} },
        type: "primary",
    }));
    const __VLS_232 = __VLS_231({
        ...{ 'onClick': {} },
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_231));
    let __VLS_235;
    const __VLS_236 = ({ click: {} },
        { onClick: (__VLS_ctx.save) });
    const { default: __VLS_237 } = __VLS_233.slots;
    // @ts-ignore
    [save,];
    var __VLS_233;
    var __VLS_234;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_62;
let __VLS_238;
/** @ts-ignore @type {typeof __VLS_components.elDrawer | typeof __VLS_components.ElDrawer | typeof __VLS_components.elDrawer | typeof __VLS_components.ElDrawer} */
elDrawer;
// @ts-ignore
const __VLS_239 = __VLS_asFunctionalComponent1(__VLS_238, new __VLS_238({
    modelValue: (__VLS_ctx.drawerOpen),
    title: "预览结果",
    size: "50%",
    destroyOnClose: true,
}));
const __VLS_240 = __VLS_239({
    modelValue: (__VLS_ctx.drawerOpen),
    title: "预览结果",
    size: "50%",
    destroyOnClose: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_239));
const { default: __VLS_243 } = __VLS_241.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "vd-preview-content" },
});
/** @type {__VLS_StyleScopedClasses['vd-preview-content']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "vd-header" },
    ...{ style: {} },
});
/** @type {__VLS_StyleScopedClasses['vd-header']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "vd-title" },
});
/** @type {__VLS_StyleScopedClasses['vd-title']} */ ;
if (__VLS_ctx.preview.columns.length) {
    let __VLS_244;
    /** @ts-ignore @type {typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components.elTag | typeof __VLS_components.ElTag} */
    elTag;
    // @ts-ignore
    const __VLS_245 = __VLS_asFunctionalComponent1(__VLS_244, new __VLS_244({
        type: "success",
        size: "small",
    }));
    const __VLS_246 = __VLS_245({
        type: "success",
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_245));
    const { default: __VLS_249 } = __VLS_247.slots;
    (__VLS_ctx.preview.rows.length);
    // @ts-ignore
    [drawerOpen, preview, preview,];
    var __VLS_247;
}
if (__VLS_ctx.preview.columns.length) {
    let __VLS_250;
    /** @ts-ignore @type {typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components.elTable | typeof __VLS_components.ElTable} */
    elTable;
    // @ts-ignore
    const __VLS_251 = __VLS_asFunctionalComponent1(__VLS_250, new __VLS_250({
        data: (__VLS_ctx.preview.rows),
        border: true,
        size: "small",
        ...{ style: {} },
    }));
    const __VLS_252 = __VLS_251({
        data: (__VLS_ctx.preview.rows),
        border: true,
        size: "small",
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_251));
    const { default: __VLS_255 } = __VLS_253.slots;
    for (const [c] of __VLS_vFor((__VLS_ctx.preview.columns))) {
        let __VLS_256;
        /** @ts-ignore @type {typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn} */
        elTableColumn;
        // @ts-ignore
        const __VLS_257 = __VLS_asFunctionalComponent1(__VLS_256, new __VLS_256({
            key: (c),
            prop: (c),
            label: (c),
            minWidth: "120",
            showOverflowTooltip: true,
        }));
        const __VLS_258 = __VLS_257({
            key: (c),
            prop: (c),
            label: (c),
            minWidth: "120",
            showOverflowTooltip: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_257));
        // @ts-ignore
        [preview, preview, preview,];
    }
    // @ts-ignore
    [];
    var __VLS_253;
}
else {
    let __VLS_261;
    /** @ts-ignore @type {typeof __VLS_components.elEmpty | typeof __VLS_components.ElEmpty} */
    elEmpty;
    // @ts-ignore
    const __VLS_262 = __VLS_asFunctionalComponent1(__VLS_261, new __VLS_261({
        description: "暂无数据",
    }));
    const __VLS_263 = __VLS_262({
        description: "暂无数据",
    }, ...__VLS_functionalComponentArgsRest(__VLS_262));
}
// @ts-ignore
[];
var __VLS_241;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
//# sourceMappingURL=index.vue.js.map