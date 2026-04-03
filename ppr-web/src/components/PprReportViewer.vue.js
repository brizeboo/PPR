import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue';
import { ElMessage } from 'element-plus';
import * as echarts from 'echarts';
import { getReportMeta, getReportData } from '@/api/report';
import ExcelEditor from '@/components/ExcelEditor/index.vue';
import { http } from '@/api/http';
const props = defineProps();
// 加载状态
const loading = ref(false);
// 报表元数据
const meta = ref(null);
// 查询参数
const queryParams = ref({});
// 表格数据
const tableData = ref({ columns: [], rows: [] });
// 表格列配置
const tableColumns = ref([]);
// ECharts 容器引用
const echartRef = ref(null);
// Excel 编辑器引用
const excelViewerRef = ref(null);
// ECharts 实例
let chartInstance = null;
// 轮询定时器
let pollingTimer = null;
/**
 * 初始化组件，加载元数据和数据
 */
async function init() {
    if (!props.reportId)
        return;
    loading.value = true;
    try {
        const { data } = await getReportMeta(props.reportId);
        meta.value = data;
        // Parse style config for table
        if (data.chartType === 'Table') {
            try {
                const styleConf = data.styleConfig ? JSON.parse(data.styleConfig) : [];
                tableColumns.value = styleConf;
            }
            catch (e) {
                tableColumns.value = [];
            }
        }
        else if (data.chartType === 'EChart') {
            await nextTick();
            if (echartRef.value && !chartInstance) {
                chartInstance = echarts.init(echartRef.value);
            }
        }
        await fetchData();
        if (data.pollingInterval > 0) {
            startPolling(data.pollingInterval);
        }
    }
    catch (error) {
        ElMessage.error('加载报表失败: ' + error.message);
    }
    finally {
        loading.value = false;
    }
}
/**
 * 获取报表数据
 */
async function fetchData() {
    if (!props.reportId || !meta.value)
        return;
    loading.value = true;
    try {
        const { data } = await getReportData(props.reportId, queryParams.value);
        if (meta.value.chartType === 'Table') {
            tableData.value = data;
            // Merge with style config if empty
            if (tableColumns.value.length === 0 && data.columns) {
                tableColumns.value = data.columns.map((c) => ({
                    prop: c,
                    label: c,
                }));
            }
        }
        else if (meta.value.chartType === 'EChart') {
            if (chartInstance && meta.value.chartConfig) {
                try {
                    const optStr = meta.value.chartConfig;
                    const option = new Function('data', `return ${optStr}`)(data);
                    chartInstance.setOption(option, true);
                }
                catch (e) {
                    console.error('Failed to parse ECharts config', e);
                    ElMessage.error('图表配置解析失败');
                }
            }
        }
        else if (meta.value.chartType === 'Excel') {
            if (excelViewerRef.value && meta.value.templateId) {
                try {
                    // 1. Load mapping config
                    const tplRes = await http.get(`/api/v1/template/${meta.value.templateId}`);
                    const mappingConfigStr = tplRes.data.mappingConfig;
                    const mappingConfig = mappingConfigStr ? JSON.parse(mappingConfigStr) : [];
                    // 2. Load Excel File into ArrayBuffer and then into File object
                    const fileRes = await http.get(`/api/v1/template/file/${meta.value.templateId}`, { responseType: 'blob' });
                    const file = new File([fileRes.data], 'template.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                    await excelViewerRef.value.loadExcelFile(file);
                    // 3. Fill data based on mapping rules
                    await nextTick();
                    mappingConfig.forEach((conf) => {
                        const val = data.rows && data.rows.length > 0 ? data.rows[0][conf.field] : '';
                        if (val !== undefined && excelViewerRef.value) {
                            if (conf.type === 'single') {
                                excelViewerRef.value.setCellValue(conf.row, conf.col, String(val));
                            }
                            else if (conf.type === 'row') {
                                // Render lists
                                data.rows.forEach((r, idx) => {
                                    excelViewerRef.value.setCellValue(conf.row + idx, conf.col, String(r[conf.field] || ''));
                                });
                            }
                            else if (conf.type === 'col') {
                                data.rows.forEach((r, idx) => {
                                    excelViewerRef.value.setCellValue(conf.row, conf.col + idx, String(r[conf.field] || ''));
                                });
                            }
                        }
                    });
                }
                catch (e) {
                    console.error('Failed to load or render Excel template', e);
                    ElMessage.error('Excel 模板加载失败');
                }
            }
        }
    }
    catch (error) {
        ElMessage.error('获取数据失败: ' + error.message);
    }
    finally {
        loading.value = false;
    }
}
/**
 * 启动数据轮询
 * @param intervalSec 轮询间隔(秒)
 */
function startPolling(intervalSec) {
    stopPolling();
    pollingTimer = window.setInterval(() => {
        fetchData();
    }, intervalSec * 1000);
}
/**
 * 停止数据轮询
 */
function stopPolling() {
    if (pollingTimer) {
        clearInterval(pollingTimer);
        pollingTimer = null;
    }
}
/**
 * 窗口大小变化时重置图表大小
 */
function handleResize() {
    chartInstance?.resize();
}
// 监听 reportId 变化重新加载
watch(() => props.reportId, () => {
    stopPolling();
    if (chartInstance) {
        chartInstance.dispose();
        chartInstance = null;
    }
    init();
});
onMounted(() => {
    init();
    window.addEventListener('resize', handleResize);
});
onUnmounted(() => {
    stopPolling();
    window.removeEventListener('resize', handleResize);
    if (chartInstance) {
        chartInstance.dispose();
    }
});
const __VLS_ctx = {
    ...{},
    ...{},
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "ppr-report-viewer prv-container" },
});
/** @type {__VLS_StyleScopedClasses['ppr-report-viewer']} */ ;
/** @type {__VLS_StyleScopedClasses['prv-container']} */ ;
if (__VLS_ctx.meta?.params && __VLS_ctx.meta.params.length > 0) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "prv-query-form" },
    });
    /** @type {__VLS_StyleScopedClasses['prv-query-form']} */ ;
    let __VLS_0;
    /** @ts-ignore @type {typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components.elForm | typeof __VLS_components.ElForm} */
    elForm;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
        ...{ 'onSubmit': {} },
        inline: (true),
        model: (__VLS_ctx.queryParams),
    }));
    const __VLS_2 = __VLS_1({
        ...{ 'onSubmit': {} },
        inline: (true),
        model: (__VLS_ctx.queryParams),
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    let __VLS_5;
    const __VLS_6 = ({ submit: {} },
        { onSubmit: (__VLS_ctx.fetchData) });
    const { default: __VLS_7 } = __VLS_3.slots;
    for (const [p] of __VLS_vFor((__VLS_ctx.meta.params))) {
        let __VLS_8;
        /** @ts-ignore @type {typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem} */
        elFormItem;
        // @ts-ignore
        const __VLS_9 = __VLS_asFunctionalComponent1(__VLS_8, new __VLS_8({
            key: (p.paramName),
            label: (p.paramName),
        }));
        const __VLS_10 = __VLS_9({
            key: (p.paramName),
            label: (p.paramName),
        }, ...__VLS_functionalComponentArgsRest(__VLS_9));
        const { default: __VLS_13 } = __VLS_11.slots;
        let __VLS_14;
        /** @ts-ignore @type {typeof __VLS_components.elInput | typeof __VLS_components.ElInput} */
        elInput;
        // @ts-ignore
        const __VLS_15 = __VLS_asFunctionalComponent1(__VLS_14, new __VLS_14({
            modelValue: (__VLS_ctx.queryParams[p.paramName]),
            placeholder: (p.paramType),
            clearable: true,
        }));
        const __VLS_16 = __VLS_15({
            modelValue: (__VLS_ctx.queryParams[p.paramName]),
            placeholder: (p.paramType),
            clearable: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_15));
        // @ts-ignore
        [meta, meta, meta, queryParams, queryParams, fetchData,];
        var __VLS_11;
        // @ts-ignore
        [];
    }
    let __VLS_19;
    /** @ts-ignore @type {typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem} */
    elFormItem;
    // @ts-ignore
    const __VLS_20 = __VLS_asFunctionalComponent1(__VLS_19, new __VLS_19({}));
    const __VLS_21 = __VLS_20({}, ...__VLS_functionalComponentArgsRest(__VLS_20));
    const { default: __VLS_24 } = __VLS_22.slots;
    let __VLS_25;
    /** @ts-ignore @type {typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components.elButton | typeof __VLS_components.ElButton} */
    elButton;
    // @ts-ignore
    const __VLS_26 = __VLS_asFunctionalComponent1(__VLS_25, new __VLS_25({
        ...{ 'onClick': {} },
        type: "primary",
    }));
    const __VLS_27 = __VLS_26({
        ...{ 'onClick': {} },
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_26));
    let __VLS_30;
    const __VLS_31 = ({ click: {} },
        { onClick: (__VLS_ctx.fetchData) });
    const { default: __VLS_32 } = __VLS_28.slots;
    // @ts-ignore
    [fetchData,];
    var __VLS_28;
    var __VLS_29;
    // @ts-ignore
    [];
    var __VLS_22;
    // @ts-ignore
    [];
    var __VLS_3;
    var __VLS_4;
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "prv-content" },
});
__VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
/** @type {__VLS_StyleScopedClasses['prv-content']} */ ;
if (__VLS_ctx.meta?.chartType === 'Table') {
    let __VLS_33;
    /** @ts-ignore @type {typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components.elTable | typeof __VLS_components.ElTable} */
    elTable;
    // @ts-ignore
    const __VLS_34 = __VLS_asFunctionalComponent1(__VLS_33, new __VLS_33({
        data: (__VLS_ctx.tableData.rows),
        border: true,
        height: "100%",
    }));
    const __VLS_35 = __VLS_34({
        data: (__VLS_ctx.tableData.rows),
        border: true,
        height: "100%",
    }, ...__VLS_functionalComponentArgsRest(__VLS_34));
    const { default: __VLS_38 } = __VLS_36.slots;
    for (const [col] of __VLS_vFor((__VLS_ctx.tableColumns))) {
        let __VLS_39;
        /** @ts-ignore @type {typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn} */
        elTableColumn;
        // @ts-ignore
        const __VLS_40 = __VLS_asFunctionalComponent1(__VLS_39, new __VLS_39({
            key: (col.prop),
            prop: (col.prop),
            label: (col.label),
            width: (col.width),
            align: (col.align),
            showOverflowTooltip: true,
        }));
        const __VLS_41 = __VLS_40({
            key: (col.prop),
            prop: (col.prop),
            label: (col.label),
            width: (col.width),
            align: (col.align),
            showOverflowTooltip: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_40));
        // @ts-ignore
        [meta, vLoading, loading, tableData, tableColumns,];
    }
    // @ts-ignore
    [];
    var __VLS_36;
}
else if (__VLS_ctx.meta?.chartType === 'EChart') {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ref: "echartRef",
        ...{ class: "prv-echart" },
    });
    /** @type {__VLS_StyleScopedClasses['prv-echart']} */ ;
}
else if (__VLS_ctx.meta?.chartType === 'Excel') {
    const __VLS_44 = ExcelEditor;
    // @ts-ignore
    const __VLS_45 = __VLS_asFunctionalComponent1(__VLS_44, new __VLS_44({
        ref: "excelViewerRef",
        readonly: true,
    }));
    const __VLS_46 = __VLS_45({
        ref: "excelViewerRef",
        readonly: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_45));
    var __VLS_49 = {};
    var __VLS_47;
}
else {
    let __VLS_51;
    /** @ts-ignore @type {typeof __VLS_components.elEmpty | typeof __VLS_components.ElEmpty} */
    elEmpty;
    // @ts-ignore
    const __VLS_52 = __VLS_asFunctionalComponent1(__VLS_51, new __VLS_51({
        description: "未知的图表类型",
    }));
    const __VLS_53 = __VLS_52({
        description: "未知的图表类型",
    }, ...__VLS_functionalComponentArgsRest(__VLS_52));
}
// @ts-ignore
var __VLS_50 = __VLS_49;
// @ts-ignore
[meta, meta,];
const __VLS_export = (await import('vue')).defineComponent({
    __typeProps: {},
});
export default {};
//# sourceMappingURL=PprReportViewer.vue.js.map