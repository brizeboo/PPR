import { ref, onMounted } from 'vue';
import { getLogPage } from '@/api/log';
// 加载状态
const loading = ref(false);
// 表格数据
const tableData = ref([]);
// 数据总条数
const total = ref(0);
// 查询条件
const query = ref({});
// 日期范围
const dateRange = ref([]);
// 分页信息
const page = ref({ current: 1, size: 20 });
// 详情弹窗控制
const dialogVisible = ref(false);
// 当前展示的日志数据
const currentLog = ref({});
onMounted(() => {
    fetchData();
});
/**
 * 触发查询
 */
function handleSearch() {
    page.value.current = 1;
    fetchData();
}
/**
 * 获取分页数据
 */
async function fetchData() {
    loading.value = true;
    try {
        const params = { ...query.value, current: page.value.current, size: page.value.size };
        if (dateRange.value && dateRange.value.length === 2) {
            params.startTime = dateRange.value[0].getTime();
            params.endTime = dateRange.value[1].getTime() + 86400000 - 1;
        }
        const res = await getLogPage(params);
        tableData.value = res.records || (res.data && res.data.records) || [];
        total.value = res.total || (res.data && res.data.total) || 0;
    }
    finally {
        loading.value = false;
    }
}
/**
 * 展示日志详情
 * @param row 日志行数据
 */
function showDetail(row) {
    currentLog.value = row;
    dialogVisible.value = true;
}
/**
 * 格式化时间戳
 * @param timestamp 时间戳
 */
function formatDate(timestamp) {
    if (!timestamp)
        return '';
    const d = new Date(timestamp);
    return d.toLocaleString();
}
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "log-container" },
});
/** @type {__VLS_StyleScopedClasses['log-container']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "log-header" },
});
/** @type {__VLS_StyleScopedClasses['log-header']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "log-filters" },
});
/** @type {__VLS_StyleScopedClasses['log-filters']} */ ;
let __VLS_0;
/** @ts-ignore @type {typeof __VLS_components.elInput | typeof __VLS_components.ElInput} */
elInput;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    ...{ 'onClear': {} },
    modelValue: (__VLS_ctx.query.type),
    placeholder: "操作类型",
    ...{ class: "log-input-type" },
    clearable: true,
}));
const __VLS_2 = __VLS_1({
    ...{ 'onClear': {} },
    modelValue: (__VLS_ctx.query.type),
    placeholder: "操作类型",
    ...{ class: "log-input-type" },
    clearable: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_5;
const __VLS_6 = ({ clear: {} },
    { onClear: (__VLS_ctx.handleSearch) });
/** @type {__VLS_StyleScopedClasses['log-input-type']} */ ;
var __VLS_3;
var __VLS_4;
let __VLS_7;
/** @ts-ignore @type {typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect} */
elSelect;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.query.status),
    placeholder: "执行状态",
    ...{ class: "log-select-status" },
    clearable: true,
}));
const __VLS_9 = __VLS_8({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.query.status),
    placeholder: "执行状态",
    ...{ class: "log-select-status" },
    clearable: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_8));
let __VLS_12;
const __VLS_13 = ({ change: {} },
    { onChange: (__VLS_ctx.handleSearch) });
/** @type {__VLS_StyleScopedClasses['log-select-status']} */ ;
const { default: __VLS_14 } = __VLS_10.slots;
let __VLS_15;
/** @ts-ignore @type {typeof __VLS_components.elOption | typeof __VLS_components.ElOption} */
elOption;
// @ts-ignore
const __VLS_16 = __VLS_asFunctionalComponent1(__VLS_15, new __VLS_15({
    label: "成功",
    value: "success",
}));
const __VLS_17 = __VLS_16({
    label: "成功",
    value: "success",
}, ...__VLS_functionalComponentArgsRest(__VLS_16));
let __VLS_20;
/** @ts-ignore @type {typeof __VLS_components.elOption | typeof __VLS_components.ElOption} */
elOption;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent1(__VLS_20, new __VLS_20({
    label: "失败",
    value: "error",
}));
const __VLS_22 = __VLS_21({
    label: "失败",
    value: "error",
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
// @ts-ignore
[query, query, handleSearch, handleSearch,];
var __VLS_10;
var __VLS_11;
let __VLS_25;
/** @ts-ignore @type {typeof __VLS_components.elDatePicker | typeof __VLS_components.ElDatePicker} */
elDatePicker;
// @ts-ignore
const __VLS_26 = __VLS_asFunctionalComponent1(__VLS_25, new __VLS_25({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.dateRange),
    type: "daterange",
    rangeSeparator: "至",
    startPlaceholder: "开始日期",
    endPlaceholder: "结束日期",
    ...{ class: "log-date-picker" },
}));
const __VLS_27 = __VLS_26({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.dateRange),
    type: "daterange",
    rangeSeparator: "至",
    startPlaceholder: "开始日期",
    endPlaceholder: "结束日期",
    ...{ class: "log-date-picker" },
}, ...__VLS_functionalComponentArgsRest(__VLS_26));
let __VLS_30;
const __VLS_31 = ({ change: {} },
    { onChange: (__VLS_ctx.handleSearch) });
/** @type {__VLS_StyleScopedClasses['log-date-picker']} */ ;
var __VLS_28;
var __VLS_29;
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
    { onClick: (__VLS_ctx.handleSearch) });
const { default: __VLS_39 } = __VLS_35.slots;
// @ts-ignore
[handleSearch, handleSearch, dateRange,];
var __VLS_35;
var __VLS_36;
let __VLS_40;
/** @ts-ignore @type {typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components.elTable | typeof __VLS_components.ElTable} */
elTable;
// @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent1(__VLS_40, new __VLS_40({
    data: (__VLS_ctx.tableData),
    border: true,
    stripe: true,
    ...{ class: "log-table" },
}));
const __VLS_42 = __VLS_41({
    data: (__VLS_ctx.tableData),
    border: true,
    stripe: true,
    ...{ class: "log-table" },
}, ...__VLS_functionalComponentArgsRest(__VLS_41));
__VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
/** @type {__VLS_StyleScopedClasses['log-table']} */ ;
const { default: __VLS_45 } = __VLS_43.slots;
let __VLS_46;
/** @ts-ignore @type {typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn} */
elTableColumn;
// @ts-ignore
const __VLS_47 = __VLS_asFunctionalComponent1(__VLS_46, new __VLS_46({
    prop: "id",
    label: "日志ID",
    width: "280",
}));
const __VLS_48 = __VLS_47({
    prop: "id",
    label: "日志ID",
    width: "280",
}, ...__VLS_functionalComponentArgsRest(__VLS_47));
let __VLS_51;
/** @ts-ignore @type {typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn} */
elTableColumn;
// @ts-ignore
const __VLS_52 = __VLS_asFunctionalComponent1(__VLS_51, new __VLS_51({
    prop: "type",
    label: "操作类型",
    width: "150",
}));
const __VLS_53 = __VLS_52({
    prop: "type",
    label: "操作类型",
    width: "150",
}, ...__VLS_functionalComponentArgsRest(__VLS_52));
let __VLS_56;
/** @ts-ignore @type {typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn} */
elTableColumn;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent1(__VLS_56, new __VLS_56({
    prop: "method",
    label: "执行方法",
    showOverflowTooltip: true,
}));
const __VLS_58 = __VLS_57({
    prop: "method",
    label: "执行方法",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_57));
let __VLS_61;
/** @ts-ignore @type {typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn} */
elTableColumn;
// @ts-ignore
const __VLS_62 = __VLS_asFunctionalComponent1(__VLS_61, new __VLS_61({
    prop: "operator",
    label: "操作人",
    width: "100",
}));
const __VLS_63 = __VLS_62({
    prop: "operator",
    label: "操作人",
    width: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_62));
let __VLS_66;
/** @ts-ignore @type {typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn} */
elTableColumn;
// @ts-ignore
const __VLS_67 = __VLS_asFunctionalComponent1(__VLS_66, new __VLS_66({
    prop: "ip",
    label: "IP地址",
    width: "120",
}));
const __VLS_68 = __VLS_67({
    prop: "ip",
    label: "IP地址",
    width: "120",
}, ...__VLS_functionalComponentArgsRest(__VLS_67));
let __VLS_71;
/** @ts-ignore @type {typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn} */
elTableColumn;
// @ts-ignore
const __VLS_72 = __VLS_asFunctionalComponent1(__VLS_71, new __VLS_71({
    prop: "costMs",
    label: "耗时(ms)",
    width: "100",
}));
const __VLS_73 = __VLS_72({
    prop: "costMs",
    label: "耗时(ms)",
    width: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_72));
const { default: __VLS_76 } = __VLS_74.slots;
{
    const { default: __VLS_77 } = __VLS_74.slots;
    const [{ row }] = __VLS_vSlot(__VLS_77);
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: ({ 'log-text-danger': row.costMs > 1000 }) },
    });
    /** @type {__VLS_StyleScopedClasses['log-text-danger']} */ ;
    (row.costMs);
    // @ts-ignore
    [tableData, vLoading, loading,];
}
// @ts-ignore
[];
var __VLS_74;
let __VLS_78;
/** @ts-ignore @type {typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn} */
elTableColumn;
// @ts-ignore
const __VLS_79 = __VLS_asFunctionalComponent1(__VLS_78, new __VLS_78({
    prop: "time",
    label: "执行时间",
    width: "180",
}));
const __VLS_80 = __VLS_79({
    prop: "time",
    label: "执行时间",
    width: "180",
}, ...__VLS_functionalComponentArgsRest(__VLS_79));
const { default: __VLS_83 } = __VLS_81.slots;
{
    const { default: __VLS_84 } = __VLS_81.slots;
    const [{ row }] = __VLS_vSlot(__VLS_84);
    (__VLS_ctx.formatDate(row.time));
    // @ts-ignore
    [formatDate,];
}
// @ts-ignore
[];
var __VLS_81;
let __VLS_85;
/** @ts-ignore @type {typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn} */
elTableColumn;
// @ts-ignore
const __VLS_86 = __VLS_asFunctionalComponent1(__VLS_85, new __VLS_85({
    label: "状态",
    width: "100",
}));
const __VLS_87 = __VLS_86({
    label: "状态",
    width: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_86));
const { default: __VLS_90 } = __VLS_88.slots;
{
    const { default: __VLS_91 } = __VLS_88.slots;
    const [{ row }] = __VLS_vSlot(__VLS_91);
    let __VLS_92;
    /** @ts-ignore @type {typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components.elTag | typeof __VLS_components.ElTag} */
    elTag;
    // @ts-ignore
    const __VLS_93 = __VLS_asFunctionalComponent1(__VLS_92, new __VLS_92({
        type: (row.errorMsg ? 'danger' : 'success'),
    }));
    const __VLS_94 = __VLS_93({
        type: (row.errorMsg ? 'danger' : 'success'),
    }, ...__VLS_functionalComponentArgsRest(__VLS_93));
    const { default: __VLS_97 } = __VLS_95.slots;
    (row.errorMsg ? '失败' : '成功');
    // @ts-ignore
    [];
    var __VLS_95;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_88;
let __VLS_98;
/** @ts-ignore @type {typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn} */
elTableColumn;
// @ts-ignore
const __VLS_99 = __VLS_asFunctionalComponent1(__VLS_98, new __VLS_98({
    label: "操作",
    width: "100",
    fixed: "right",
}));
const __VLS_100 = __VLS_99({
    label: "操作",
    width: "100",
    fixed: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_99));
const { default: __VLS_103 } = __VLS_101.slots;
{
    const { default: __VLS_104 } = __VLS_101.slots;
    const [{ row }] = __VLS_vSlot(__VLS_104);
    let __VLS_105;
    /** @ts-ignore @type {typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components.elButton | typeof __VLS_components.ElButton} */
    elButton;
    // @ts-ignore
    const __VLS_106 = __VLS_asFunctionalComponent1(__VLS_105, new __VLS_105({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }));
    const __VLS_107 = __VLS_106({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_106));
    let __VLS_110;
    const __VLS_111 = ({ click: {} },
        { onClick: (...[$event]) => {
                __VLS_ctx.showDetail(row);
                // @ts-ignore
                [showDetail,];
            } });
    const { default: __VLS_112 } = __VLS_108.slots;
    // @ts-ignore
    [];
    var __VLS_108;
    var __VLS_109;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_101;
// @ts-ignore
[];
var __VLS_43;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "log-pagination" },
});
/** @type {__VLS_StyleScopedClasses['log-pagination']} */ ;
let __VLS_113;
/** @ts-ignore @type {typeof __VLS_components.elPagination | typeof __VLS_components.ElPagination} */
elPagination;
// @ts-ignore
const __VLS_114 = __VLS_asFunctionalComponent1(__VLS_113, new __VLS_113({
    ...{ 'onSizeChange': {} },
    ...{ 'onCurrentChange': {} },
    currentPage: (__VLS_ctx.page.current),
    pageSize: (__VLS_ctx.page.size),
    total: (__VLS_ctx.total),
    pageSizes: ([10, 20, 50, 100]),
    layout: "total, sizes, prev, pager, next",
}));
const __VLS_115 = __VLS_114({
    ...{ 'onSizeChange': {} },
    ...{ 'onCurrentChange': {} },
    currentPage: (__VLS_ctx.page.current),
    pageSize: (__VLS_ctx.page.size),
    total: (__VLS_ctx.total),
    pageSizes: ([10, 20, 50, 100]),
    layout: "total, sizes, prev, pager, next",
}, ...__VLS_functionalComponentArgsRest(__VLS_114));
let __VLS_118;
const __VLS_119 = ({ sizeChange: {} },
    { onSizeChange: (__VLS_ctx.handleSearch) });
const __VLS_120 = ({ currentChange: {} },
    { onCurrentChange: (__VLS_ctx.fetchData) });
var __VLS_116;
var __VLS_117;
let __VLS_121;
/** @ts-ignore @type {typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog} */
elDialog;
// @ts-ignore
const __VLS_122 = __VLS_asFunctionalComponent1(__VLS_121, new __VLS_121({
    title: "日志详情",
    modelValue: (__VLS_ctx.dialogVisible),
    width: "700px",
}));
const __VLS_123 = __VLS_122({
    title: "日志详情",
    modelValue: (__VLS_ctx.dialogVisible),
    width: "700px",
}, ...__VLS_functionalComponentArgsRest(__VLS_122));
const { default: __VLS_126 } = __VLS_124.slots;
let __VLS_127;
/** @ts-ignore @type {typeof __VLS_components.elDescriptions | typeof __VLS_components.ElDescriptions | typeof __VLS_components.elDescriptions | typeof __VLS_components.ElDescriptions} */
elDescriptions;
// @ts-ignore
const __VLS_128 = __VLS_asFunctionalComponent1(__VLS_127, new __VLS_127({
    column: (1),
    border: true,
}));
const __VLS_129 = __VLS_128({
    column: (1),
    border: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_128));
const { default: __VLS_132 } = __VLS_130.slots;
let __VLS_133;
/** @ts-ignore @type {typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem} */
elDescriptionsItem;
// @ts-ignore
const __VLS_134 = __VLS_asFunctionalComponent1(__VLS_133, new __VLS_133({
    label: "操作类型",
}));
const __VLS_135 = __VLS_134({
    label: "操作类型",
}, ...__VLS_functionalComponentArgsRest(__VLS_134));
const { default: __VLS_138 } = __VLS_136.slots;
(__VLS_ctx.currentLog.type);
// @ts-ignore
[handleSearch, page, page, total, fetchData, dialogVisible, currentLog,];
var __VLS_136;
let __VLS_139;
/** @ts-ignore @type {typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem} */
elDescriptionsItem;
// @ts-ignore
const __VLS_140 = __VLS_asFunctionalComponent1(__VLS_139, new __VLS_139({
    label: "执行方法",
}));
const __VLS_141 = __VLS_140({
    label: "执行方法",
}, ...__VLS_functionalComponentArgsRest(__VLS_140));
const { default: __VLS_144 } = __VLS_142.slots;
(__VLS_ctx.currentLog.method);
// @ts-ignore
[currentLog,];
var __VLS_142;
let __VLS_145;
/** @ts-ignore @type {typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem} */
elDescriptionsItem;
// @ts-ignore
const __VLS_146 = __VLS_asFunctionalComponent1(__VLS_145, new __VLS_145({
    label: "请求参数",
}));
const __VLS_147 = __VLS_146({
    label: "请求参数",
}, ...__VLS_functionalComponentArgsRest(__VLS_146));
const { default: __VLS_150 } = __VLS_148.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.pre, __VLS_intrinsics.pre)({
    ...{ class: "log-params" },
});
/** @type {__VLS_StyleScopedClasses['log-params']} */ ;
(__VLS_ctx.currentLog.params);
// @ts-ignore
[currentLog,];
var __VLS_148;
let __VLS_151;
/** @ts-ignore @type {typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem} */
elDescriptionsItem;
// @ts-ignore
const __VLS_152 = __VLS_asFunctionalComponent1(__VLS_151, new __VLS_151({
    label: "执行时间",
}));
const __VLS_153 = __VLS_152({
    label: "执行时间",
}, ...__VLS_functionalComponentArgsRest(__VLS_152));
const { default: __VLS_156 } = __VLS_154.slots;
(__VLS_ctx.formatDate(__VLS_ctx.currentLog.time));
// @ts-ignore
[formatDate, currentLog,];
var __VLS_154;
let __VLS_157;
/** @ts-ignore @type {typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem} */
elDescriptionsItem;
// @ts-ignore
const __VLS_158 = __VLS_asFunctionalComponent1(__VLS_157, new __VLS_157({
    label: "耗时",
}));
const __VLS_159 = __VLS_158({
    label: "耗时",
}, ...__VLS_functionalComponentArgsRest(__VLS_158));
const { default: __VLS_162 } = __VLS_160.slots;
(__VLS_ctx.currentLog.costMs);
// @ts-ignore
[currentLog,];
var __VLS_160;
if (__VLS_ctx.currentLog.errorMsg) {
    let __VLS_163;
    /** @ts-ignore @type {typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem} */
    elDescriptionsItem;
    // @ts-ignore
    const __VLS_164 = __VLS_asFunctionalComponent1(__VLS_163, new __VLS_163({
        label: "异常信息",
    }));
    const __VLS_165 = __VLS_164({
        label: "异常信息",
    }, ...__VLS_functionalComponentArgsRest(__VLS_164));
    const { default: __VLS_168 } = __VLS_166.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "log-error" },
    });
    /** @type {__VLS_StyleScopedClasses['log-error']} */ ;
    (__VLS_ctx.currentLog.errorMsg);
    // @ts-ignore
    [currentLog, currentLog,];
    var __VLS_166;
}
// @ts-ignore
[];
var __VLS_130;
// @ts-ignore
[];
var __VLS_124;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
//# sourceMappingURL=index.vue.js.map