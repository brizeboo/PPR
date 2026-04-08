import { ref, computed, onMounted, reactive } from 'vue';
import { ElMessage } from 'element-plus';
import { getDirTree, createDir, renameDir, deleteDir, listFiles, uploadFile, downloadFileUrl, deleteFile, getFileAccessUrl } from '@ppr/core';
const treeData = ref([]);
const defaultProps = {
    children: 'children',
    label: 'name'
};
const currentPath = ref('/');
const fileList = ref([]);
const page = ref(1);
const size = ref(10);
const total = ref(0);
const breadcrumbs = computed(() => {
    if (currentPath.value === '/')
        return ['/'];
    return ['/'].concat(currentPath.value.split('/').filter(Boolean));
});
const loadTree = async () => {
    const { data } = await getDirTree();
    treeData.value = [data];
};
const loadFiles = async () => {
    const { data } = await listFiles(currentPath.value, page.value, size.value);
    fileList.value = data.records;
    total.value = data.total;
};
const handleNodeClick = (node) => {
    currentPath.value = node.path;
    page.value = 1;
    loadFiles();
};
// 目录操作
const dirDialogVisible = ref(false);
const dirDialogType = ref('create');
const dirDialogTitle = computed(() => dirDialogType.value === 'create' ? '新建目录' : '重命名目录');
const dirFormRef = ref();
const dirForm = reactive({ name: '' });
const dirRules = {
    name: [{ required: true, message: '请输入目录名称', trigger: 'blur' }]
};
const openCreateDir = () => {
    dirDialogType.value = 'create';
    dirForm.name = '';
    dirDialogVisible.value = true;
};
const openRenameDir = () => {
    if (currentPath.value === '/')
        return;
    dirDialogType.value = 'rename';
    const parts = currentPath.value.split('/');
    dirForm.name = parts[parts.length - 1];
    dirDialogVisible.value = true;
};
const onDirSave = async () => {
    const valid = await dirFormRef.value?.validate().catch(() => false);
    if (!valid)
        return;
    if (dirDialogType.value === 'create') {
        await createDir(currentPath.value, dirForm.name);
        ElMessage.success('新建目录成功');
    }
    else {
        await renameDir(currentPath.value, dirForm.name);
        ElMessage.success('重命名目录成功');
        // 返回上一级
        const parts = currentPath.value.split('/');
        parts.pop();
        currentPath.value = parts.join('/') || '/';
    }
    dirDialogVisible.value = false;
    await loadTree();
    await loadFiles();
};
const onDeleteDir = async () => {
    if (currentPath.value === '/')
        return;
    try {
        await deleteDir(currentPath.value);
        ElMessage.success('删除目录成功');
        const parts = currentPath.value.split('/');
        parts.pop();
        currentPath.value = parts.join('/') || '/';
        await loadTree();
        await loadFiles();
    }
    catch (e) {
        ElMessage.error(e.response?.data?.message || '删除目录失败，可能目录不为空');
    }
};
// 文件操作
const customUpload = async (options) => {
    try {
        await uploadFile(options.file, currentPath.value);
        ElMessage.success('上传成功');
        loadFiles();
    }
    catch (e) {
        ElMessage.error('上传失败');
    }
};
const onDownload = (row) => {
    window.open(downloadFileUrl(row.path));
};
const onCopyLink = async (row) => {
    const url = getFileAccessUrl(row.path);
    try {
        await navigator.clipboard.writeText(url);
        ElMessage.success('直链已复制到剪贴板');
    }
    catch (e) {
        ElMessage.error('复制失败，请手动复制: ' + url);
    }
};
const onDeleteFile = async (path) => {
    await deleteFile(path);
    ElMessage.success('删除文件成功');
    loadFiles();
};
// Utils
const formatSize = (size) => {
    if (size < 1024)
        return size + ' B';
    if (size < 1024 * 1024)
        return (size / 1024).toFixed(2) + ' KB';
    return (size / (1024 * 1024)).toFixed(2) + ' MB';
};
const formatDate = (ms) => {
    const date = new Date(ms);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
};
onMounted(() => {
    loadTree();
    loadFiles();
});
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['file-sidebar']} */ ;
/** @type {__VLS_StyleScopedClasses['file-content']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "file-container" },
});
/** @type {__VLS_StyleScopedClasses['file-container']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "file-sidebar td-sidebar" },
});
/** @type {__VLS_StyleScopedClasses['file-sidebar']} */ ;
/** @type {__VLS_StyleScopedClasses['td-sidebar']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "sidebar-header" },
});
/** @type {__VLS_StyleScopedClasses['sidebar-header']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
let __VLS_0;
/** @ts-ignore @type {typeof __VLS_components.elTree | typeof __VLS_components.ElTree} */
elTree;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    ...{ 'onNodeClick': {} },
    data: (__VLS_ctx.treeData),
    props: (__VLS_ctx.defaultProps),
    nodeKey: "path",
    currentNodeKey: (__VLS_ctx.currentPath),
    highlightCurrent: true,
    defaultExpandAll: true,
}));
const __VLS_2 = __VLS_1({
    ...{ 'onNodeClick': {} },
    data: (__VLS_ctx.treeData),
    props: (__VLS_ctx.defaultProps),
    nodeKey: "path",
    currentNodeKey: (__VLS_ctx.currentPath),
    highlightCurrent: true,
    defaultExpandAll: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_5;
const __VLS_6 = ({ nodeClick: {} },
    { onNodeClick: (__VLS_ctx.handleNodeClick) });
var __VLS_3;
var __VLS_4;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "file-content td-panel" },
});
/** @type {__VLS_StyleScopedClasses['file-content']} */ ;
/** @type {__VLS_StyleScopedClasses['td-panel']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "content-header" },
});
/** @type {__VLS_StyleScopedClasses['content-header']} */ ;
let __VLS_7;
/** @ts-ignore @type {typeof __VLS_components.elBreadcrumb | typeof __VLS_components.ElBreadcrumb | typeof __VLS_components.elBreadcrumb | typeof __VLS_components.ElBreadcrumb} */
elBreadcrumb;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
    separator: "/",
}));
const __VLS_9 = __VLS_8({
    separator: "/",
}, ...__VLS_functionalComponentArgsRest(__VLS_8));
const { default: __VLS_12 } = __VLS_10.slots;
for (const [item, index] of __VLS_vFor((__VLS_ctx.breadcrumbs))) {
    let __VLS_13;
    /** @ts-ignore @type {typeof __VLS_components.elBreadcrumbItem | typeof __VLS_components.ElBreadcrumbItem | typeof __VLS_components.elBreadcrumbItem | typeof __VLS_components.ElBreadcrumbItem} */
    elBreadcrumbItem;
    // @ts-ignore
    const __VLS_14 = __VLS_asFunctionalComponent1(__VLS_13, new __VLS_13({
        key: (index),
    }));
    const __VLS_15 = __VLS_14({
        key: (index),
    }, ...__VLS_functionalComponentArgsRest(__VLS_14));
    const { default: __VLS_18 } = __VLS_16.slots;
    (item);
    // @ts-ignore
    [treeData, defaultProps, currentPath, handleNodeClick, breadcrumbs,];
    var __VLS_16;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_10;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "actions" },
});
/** @type {__VLS_StyleScopedClasses['actions']} */ ;
let __VLS_19;
/** @ts-ignore @type {typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components.elButton | typeof __VLS_components.ElButton} */
elButton;
// @ts-ignore
const __VLS_20 = __VLS_asFunctionalComponent1(__VLS_19, new __VLS_19({
    ...{ 'onClick': {} },
    size: "small",
}));
const __VLS_21 = __VLS_20({
    ...{ 'onClick': {} },
    size: "small",
}, ...__VLS_functionalComponentArgsRest(__VLS_20));
let __VLS_24;
const __VLS_25 = ({ click: {} },
    { onClick: (__VLS_ctx.openCreateDir) });
const { default: __VLS_26 } = __VLS_22.slots;
// @ts-ignore
[openCreateDir,];
var __VLS_22;
var __VLS_23;
let __VLS_27;
/** @ts-ignore @type {typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components.elButton | typeof __VLS_components.ElButton} */
elButton;
// @ts-ignore
const __VLS_28 = __VLS_asFunctionalComponent1(__VLS_27, new __VLS_27({
    ...{ 'onClick': {} },
    size: "small",
    disabled: (__VLS_ctx.currentPath === '/'),
}));
const __VLS_29 = __VLS_28({
    ...{ 'onClick': {} },
    size: "small",
    disabled: (__VLS_ctx.currentPath === '/'),
}, ...__VLS_functionalComponentArgsRest(__VLS_28));
let __VLS_32;
const __VLS_33 = ({ click: {} },
    { onClick: (__VLS_ctx.openRenameDir) });
const { default: __VLS_34 } = __VLS_30.slots;
// @ts-ignore
[currentPath, openRenameDir,];
var __VLS_30;
var __VLS_31;
let __VLS_35;
/** @ts-ignore @type {typeof __VLS_components.elPopconfirm | typeof __VLS_components.ElPopconfirm | typeof __VLS_components.elPopconfirm | typeof __VLS_components.ElPopconfirm} */
elPopconfirm;
// @ts-ignore
const __VLS_36 = __VLS_asFunctionalComponent1(__VLS_35, new __VLS_35({
    ...{ 'onConfirm': {} },
    title: "确认删除该目录？",
}));
const __VLS_37 = __VLS_36({
    ...{ 'onConfirm': {} },
    title: "确认删除该目录？",
}, ...__VLS_functionalComponentArgsRest(__VLS_36));
let __VLS_40;
const __VLS_41 = ({ confirm: {} },
    { onConfirm: (__VLS_ctx.onDeleteDir) });
const { default: __VLS_42 } = __VLS_38.slots;
{
    const { reference: __VLS_43 } = __VLS_38.slots;
    let __VLS_44;
    /** @ts-ignore @type {typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components.elButton | typeof __VLS_components.ElButton} */
    elButton;
    // @ts-ignore
    const __VLS_45 = __VLS_asFunctionalComponent1(__VLS_44, new __VLS_44({
        size: "small",
        type: "danger",
        disabled: (__VLS_ctx.currentPath === '/'),
    }));
    const __VLS_46 = __VLS_45({
        size: "small",
        type: "danger",
        disabled: (__VLS_ctx.currentPath === '/'),
    }, ...__VLS_functionalComponentArgsRest(__VLS_45));
    const { default: __VLS_49 } = __VLS_47.slots;
    // @ts-ignore
    [currentPath, onDeleteDir,];
    var __VLS_47;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_38;
var __VLS_39;
let __VLS_50;
/** @ts-ignore @type {typeof __VLS_components.elUpload | typeof __VLS_components.ElUpload | typeof __VLS_components.elUpload | typeof __VLS_components.ElUpload} */
elUpload;
// @ts-ignore
const __VLS_51 = __VLS_asFunctionalComponent1(__VLS_50, new __VLS_50({
    ...{ class: "upload-btn" },
    action: "",
    showFileList: (false),
    httpRequest: (__VLS_ctx.customUpload),
}));
const __VLS_52 = __VLS_51({
    ...{ class: "upload-btn" },
    action: "",
    showFileList: (false),
    httpRequest: (__VLS_ctx.customUpload),
}, ...__VLS_functionalComponentArgsRest(__VLS_51));
/** @type {__VLS_StyleScopedClasses['upload-btn']} */ ;
const { default: __VLS_55 } = __VLS_53.slots;
let __VLS_56;
/** @ts-ignore @type {typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components.elButton | typeof __VLS_components.ElButton} */
elButton;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent1(__VLS_56, new __VLS_56({
    size: "small",
    type: "primary",
}));
const __VLS_58 = __VLS_57({
    size: "small",
    type: "primary",
}, ...__VLS_functionalComponentArgsRest(__VLS_57));
const { default: __VLS_61 } = __VLS_59.slots;
// @ts-ignore
[customUpload,];
var __VLS_59;
// @ts-ignore
[];
var __VLS_53;
let __VLS_62;
/** @ts-ignore @type {typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components.elTable | typeof __VLS_components.ElTable} */
elTable;
// @ts-ignore
const __VLS_63 = __VLS_asFunctionalComponent1(__VLS_62, new __VLS_62({
    data: (__VLS_ctx.fileList),
    border: true,
    height: "calc(100vh - 220px)",
}));
const __VLS_64 = __VLS_63({
    data: (__VLS_ctx.fileList),
    border: true,
    height: "calc(100vh - 220px)",
}, ...__VLS_functionalComponentArgsRest(__VLS_63));
const { default: __VLS_67 } = __VLS_65.slots;
let __VLS_68;
/** @ts-ignore @type {typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn} */
elTableColumn;
// @ts-ignore
const __VLS_69 = __VLS_asFunctionalComponent1(__VLS_68, new __VLS_68({
    prop: "name",
    label: "文件名",
    minWidth: "200",
}));
const __VLS_70 = __VLS_69({
    prop: "name",
    label: "文件名",
    minWidth: "200",
}, ...__VLS_functionalComponentArgsRest(__VLS_69));
let __VLS_73;
/** @ts-ignore @type {typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn} */
elTableColumn;
// @ts-ignore
const __VLS_74 = __VLS_asFunctionalComponent1(__VLS_73, new __VLS_73({
    prop: "size",
    label: "大小",
    width: "120",
}));
const __VLS_75 = __VLS_74({
    prop: "size",
    label: "大小",
    width: "120",
}, ...__VLS_functionalComponentArgsRest(__VLS_74));
const { default: __VLS_78 } = __VLS_76.slots;
{
    const { default: __VLS_79 } = __VLS_76.slots;
    const [{ row }] = __VLS_vSlot(__VLS_79);
    (__VLS_ctx.formatSize(row.size));
    // @ts-ignore
    [fileList, formatSize,];
}
// @ts-ignore
[];
var __VLS_76;
let __VLS_80;
/** @ts-ignore @type {typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn} */
elTableColumn;
// @ts-ignore
const __VLS_81 = __VLS_asFunctionalComponent1(__VLS_80, new __VLS_80({
    prop: "lastModified",
    label: "修改时间",
    width: "180",
}));
const __VLS_82 = __VLS_81({
    prop: "lastModified",
    label: "修改时间",
    width: "180",
}, ...__VLS_functionalComponentArgsRest(__VLS_81));
const { default: __VLS_85 } = __VLS_83.slots;
{
    const { default: __VLS_86 } = __VLS_83.slots;
    const [{ row }] = __VLS_vSlot(__VLS_86);
    (__VLS_ctx.formatDate(row.lastModified));
    // @ts-ignore
    [formatDate,];
}
// @ts-ignore
[];
var __VLS_83;
let __VLS_87;
/** @ts-ignore @type {typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn} */
elTableColumn;
// @ts-ignore
const __VLS_88 = __VLS_asFunctionalComponent1(__VLS_87, new __VLS_87({
    label: "操作",
    width: "220",
    fixed: "right",
}));
const __VLS_89 = __VLS_88({
    label: "操作",
    width: "220",
    fixed: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_88));
const { default: __VLS_92 } = __VLS_90.slots;
{
    const { default: __VLS_93 } = __VLS_90.slots;
    const [{ row }] = __VLS_vSlot(__VLS_93);
    let __VLS_94;
    /** @ts-ignore @type {typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components.elButton | typeof __VLS_components.ElButton} */
    elButton;
    // @ts-ignore
    const __VLS_95 = __VLS_asFunctionalComponent1(__VLS_94, new __VLS_94({
        ...{ 'onClick': {} },
        size: "small",
    }));
    const __VLS_96 = __VLS_95({
        ...{ 'onClick': {} },
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_95));
    let __VLS_99;
    const __VLS_100 = ({ click: {} },
        { onClick: (...[$event]) => {
                __VLS_ctx.onDownload(row);
                // @ts-ignore
                [onDownload,];
            } });
    const { default: __VLS_101 } = __VLS_97.slots;
    // @ts-ignore
    [];
    var __VLS_97;
    var __VLS_98;
    let __VLS_102;
    /** @ts-ignore @type {typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components.elButton | typeof __VLS_components.ElButton} */
    elButton;
    // @ts-ignore
    const __VLS_103 = __VLS_asFunctionalComponent1(__VLS_102, new __VLS_102({
        ...{ 'onClick': {} },
        size: "small",
    }));
    const __VLS_104 = __VLS_103({
        ...{ 'onClick': {} },
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_103));
    let __VLS_107;
    const __VLS_108 = ({ click: {} },
        { onClick: (...[$event]) => {
                __VLS_ctx.onCopyLink(row);
                // @ts-ignore
                [onCopyLink,];
            } });
    const { default: __VLS_109 } = __VLS_105.slots;
    // @ts-ignore
    [];
    var __VLS_105;
    var __VLS_106;
    let __VLS_110;
    /** @ts-ignore @type {typeof __VLS_components.elPopconfirm | typeof __VLS_components.ElPopconfirm | typeof __VLS_components.elPopconfirm | typeof __VLS_components.ElPopconfirm} */
    elPopconfirm;
    // @ts-ignore
    const __VLS_111 = __VLS_asFunctionalComponent1(__VLS_110, new __VLS_110({
        ...{ 'onConfirm': {} },
        title: "确认删除该文件？",
    }));
    const __VLS_112 = __VLS_111({
        ...{ 'onConfirm': {} },
        title: "确认删除该文件？",
    }, ...__VLS_functionalComponentArgsRest(__VLS_111));
    let __VLS_115;
    const __VLS_116 = ({ confirm: {} },
        { onConfirm: (...[$event]) => {
                __VLS_ctx.onDeleteFile(row.path);
                // @ts-ignore
                [onDeleteFile,];
            } });
    const { default: __VLS_117 } = __VLS_113.slots;
    {
        const { reference: __VLS_118 } = __VLS_113.slots;
        let __VLS_119;
        /** @ts-ignore @type {typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components.elButton | typeof __VLS_components.ElButton} */
        elButton;
        // @ts-ignore
        const __VLS_120 = __VLS_asFunctionalComponent1(__VLS_119, new __VLS_119({
            size: "small",
            type: "danger",
        }));
        const __VLS_121 = __VLS_120({
            size: "small",
            type: "danger",
        }, ...__VLS_functionalComponentArgsRest(__VLS_120));
        const { default: __VLS_124 } = __VLS_122.slots;
        // @ts-ignore
        [];
        var __VLS_122;
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
    var __VLS_113;
    var __VLS_114;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_90;
// @ts-ignore
[];
var __VLS_65;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "pagination" },
});
/** @type {__VLS_StyleScopedClasses['pagination']} */ ;
let __VLS_125;
/** @ts-ignore @type {typeof __VLS_components.elPagination | typeof __VLS_components.ElPagination} */
elPagination;
// @ts-ignore
const __VLS_126 = __VLS_asFunctionalComponent1(__VLS_125, new __VLS_125({
    ...{ 'onSizeChange': {} },
    ...{ 'onCurrentChange': {} },
    currentPage: (__VLS_ctx.page),
    pageSize: (__VLS_ctx.size),
    total: (__VLS_ctx.total),
    layout: "total, prev, pager, next, sizes",
}));
const __VLS_127 = __VLS_126({
    ...{ 'onSizeChange': {} },
    ...{ 'onCurrentChange': {} },
    currentPage: (__VLS_ctx.page),
    pageSize: (__VLS_ctx.size),
    total: (__VLS_ctx.total),
    layout: "total, prev, pager, next, sizes",
}, ...__VLS_functionalComponentArgsRest(__VLS_126));
let __VLS_130;
const __VLS_131 = ({ sizeChange: {} },
    { onSizeChange: (__VLS_ctx.loadFiles) });
const __VLS_132 = ({ currentChange: {} },
    { onCurrentChange: (__VLS_ctx.loadFiles) });
var __VLS_128;
var __VLS_129;
let __VLS_133;
/** @ts-ignore @type {typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog} */
elDialog;
// @ts-ignore
const __VLS_134 = __VLS_asFunctionalComponent1(__VLS_133, new __VLS_133({
    modelValue: (__VLS_ctx.dirDialogVisible),
    title: (__VLS_ctx.dirDialogTitle),
    width: "400px",
    destroyOnClose: true,
}));
const __VLS_135 = __VLS_134({
    modelValue: (__VLS_ctx.dirDialogVisible),
    title: (__VLS_ctx.dirDialogTitle),
    width: "400px",
    destroyOnClose: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_134));
const { default: __VLS_138 } = __VLS_136.slots;
let __VLS_139;
/** @ts-ignore @type {typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components.elForm | typeof __VLS_components.ElForm} */
elForm;
// @ts-ignore
const __VLS_140 = __VLS_asFunctionalComponent1(__VLS_139, new __VLS_139({
    ...{ 'onSubmit': {} },
    ref: "dirFormRef",
    model: (__VLS_ctx.dirForm),
    rules: (__VLS_ctx.dirRules),
    labelWidth: "80px",
}));
const __VLS_141 = __VLS_140({
    ...{ 'onSubmit': {} },
    ref: "dirFormRef",
    model: (__VLS_ctx.dirForm),
    rules: (__VLS_ctx.dirRules),
    labelWidth: "80px",
}, ...__VLS_functionalComponentArgsRest(__VLS_140));
let __VLS_144;
const __VLS_145 = ({ submit: {} },
    { onSubmit: (__VLS_ctx.onDirSave) });
var __VLS_146 = {};
const { default: __VLS_148 } = __VLS_142.slots;
let __VLS_149;
/** @ts-ignore @type {typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem} */
elFormItem;
// @ts-ignore
const __VLS_150 = __VLS_asFunctionalComponent1(__VLS_149, new __VLS_149({
    label: "目录名称",
    prop: "name",
}));
const __VLS_151 = __VLS_150({
    label: "目录名称",
    prop: "name",
}, ...__VLS_functionalComponentArgsRest(__VLS_150));
const { default: __VLS_154 } = __VLS_152.slots;
let __VLS_155;
/** @ts-ignore @type {typeof __VLS_components.elInput | typeof __VLS_components.ElInput} */
elInput;
// @ts-ignore
const __VLS_156 = __VLS_asFunctionalComponent1(__VLS_155, new __VLS_155({
    modelValue: (__VLS_ctx.dirForm.name),
}));
const __VLS_157 = __VLS_156({
    modelValue: (__VLS_ctx.dirForm.name),
}, ...__VLS_functionalComponentArgsRest(__VLS_156));
// @ts-ignore
[page, size, total, loadFiles, loadFiles, dirDialogVisible, dirDialogTitle, dirForm, dirForm, dirRules, onDirSave,];
var __VLS_152;
// @ts-ignore
[];
var __VLS_142;
var __VLS_143;
{
    const { footer: __VLS_160 } = __VLS_136.slots;
    let __VLS_161;
    /** @ts-ignore @type {typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components.elButton | typeof __VLS_components.ElButton} */
    elButton;
    // @ts-ignore
    const __VLS_162 = __VLS_asFunctionalComponent1(__VLS_161, new __VLS_161({
        ...{ 'onClick': {} },
    }));
    const __VLS_163 = __VLS_162({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_162));
    let __VLS_166;
    const __VLS_167 = ({ click: {} },
        { onClick: (...[$event]) => {
                __VLS_ctx.dirDialogVisible = false;
                // @ts-ignore
                [dirDialogVisible,];
            } });
    const { default: __VLS_168 } = __VLS_164.slots;
    // @ts-ignore
    [];
    var __VLS_164;
    var __VLS_165;
    let __VLS_169;
    /** @ts-ignore @type {typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components.elButton | typeof __VLS_components.ElButton} */
    elButton;
    // @ts-ignore
    const __VLS_170 = __VLS_asFunctionalComponent1(__VLS_169, new __VLS_169({
        ...{ 'onClick': {} },
        type: "primary",
    }));
    const __VLS_171 = __VLS_170({
        ...{ 'onClick': {} },
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_170));
    let __VLS_174;
    const __VLS_175 = ({ click: {} },
        { onClick: (__VLS_ctx.onDirSave) });
    const { default: __VLS_176 } = __VLS_172.slots;
    // @ts-ignore
    [onDirSave,];
    var __VLS_172;
    var __VLS_173;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_136;
// @ts-ignore
var __VLS_147 = __VLS_146;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
//# sourceMappingURL=index.vue.js.map