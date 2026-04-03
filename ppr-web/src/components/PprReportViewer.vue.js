import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue';
import { ElMessage } from 'element-plus';
import * as echarts from 'echarts';
import { getReportMeta, getReportData } from '@/api/report';
import ExcelEditor from '@/components/ExcelEditor/index.vue';
import { http } from '@/api/http';
const props = defineProps();
const loading = ref(false);
const meta = ref(null);
const queryParams = ref({});
const tableData = ref({ columns: [], rows: [] });
const tableColumns = ref([]);
const echartRef = ref(null);
const excelViewerRef = ref(null);
let chartInstance = null;
let pollingTimer = null;
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
function startPolling(intervalSec) {
    stopPolling();
    pollingTimer = window.setInterval(() => {
        fetchData();
    }, intervalSec * 1000);
}
function stopPolling() {
    if (pollingTimer) {
        clearInterval(pollingTimer);
        pollingTimer = null;
    }
}
function handleResize() {
    chartInstance?.resize();
}
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
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "ppr-report-viewer w-full h-full flex flex-col" },
});
if (__VLS_ctx.meta?.params && __VLS_ctx.meta.params.length > 0) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "mb-4 border border-solid border-gray-200 p-3 rounded bg-white" },
    });
    const __VLS_0 = {}.ElForm;
    /** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
        ...{ 'onSubmit': {} },
        inline: (true),
        model: (__VLS_ctx.queryParams),
    }));
    const __VLS_2 = __VLS_1({
        ...{ 'onSubmit': {} },
        inline: (true),
        model: (__VLS_ctx.queryParams),
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    let __VLS_4;
    let __VLS_5;
    let __VLS_6;
    const __VLS_7 = {
        onSubmit: (__VLS_ctx.fetchData)
    };
    __VLS_3.slots.default;
    for (const [p] of __VLS_getVForSourceType((__VLS_ctx.meta.params))) {
        const __VLS_8 = {}.ElFormItem;
        /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
        // @ts-ignore
        const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
            key: (p.paramName),
            label: (p.paramName),
        }));
        const __VLS_10 = __VLS_9({
            key: (p.paramName),
            label: (p.paramName),
        }, ...__VLS_functionalComponentArgsRest(__VLS_9));
        __VLS_11.slots.default;
        const __VLS_12 = {}.ElInput;
        /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
        // @ts-ignore
        const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
            modelValue: (__VLS_ctx.queryParams[p.paramName]),
            placeholder: (p.paramType),
            clearable: true,
        }));
        const __VLS_14 = __VLS_13({
            modelValue: (__VLS_ctx.queryParams[p.paramName]),
            placeholder: (p.paramType),
            clearable: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_13));
        var __VLS_11;
    }
    const __VLS_16 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({}));
    const __VLS_18 = __VLS_17({}, ...__VLS_functionalComponentArgsRest(__VLS_17));
    __VLS_19.slots.default;
    const __VLS_20 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
        ...{ 'onClick': {} },
        type: "primary",
    }));
    const __VLS_22 = __VLS_21({
        ...{ 'onClick': {} },
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_21));
    let __VLS_24;
    let __VLS_25;
    let __VLS_26;
    const __VLS_27 = {
        onClick: (__VLS_ctx.fetchData)
    };
    __VLS_23.slots.default;
    var __VLS_23;
    var __VLS_19;
    var __VLS_3;
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex-1 overflow-hidden bg-white border border-solid border-gray-200 rounded p-3 relative" },
});
__VLS_asFunctionalDirective(__VLS_directives.vLoading)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
if (__VLS_ctx.meta?.chartType === 'Table') {
    const __VLS_28 = {}.ElTable;
    /** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
    // @ts-ignore
    const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
        data: (__VLS_ctx.tableData.rows),
        border: true,
        height: "100%",
    }));
    const __VLS_30 = __VLS_29({
        data: (__VLS_ctx.tableData.rows),
        border: true,
        height: "100%",
    }, ...__VLS_functionalComponentArgsRest(__VLS_29));
    __VLS_31.slots.default;
    for (const [col] of __VLS_getVForSourceType((__VLS_ctx.tableColumns))) {
        const __VLS_32 = {}.ElTableColumn;
        /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
        // @ts-ignore
        const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
            key: (col.prop),
            prop: (col.prop),
            label: (col.label),
            width: (col.width),
            align: (col.align),
            showOverflowTooltip: true,
        }));
        const __VLS_34 = __VLS_33({
            key: (col.prop),
            prop: (col.prop),
            label: (col.label),
            width: (col.width),
            align: (col.align),
            showOverflowTooltip: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_33));
    }
    var __VLS_31;
}
else if (__VLS_ctx.meta?.chartType === 'EChart') {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ref: "echartRef",
        ...{ class: "w-full h-full" },
    });
    /** @type {typeof __VLS_ctx.echartRef} */ ;
}
else if (__VLS_ctx.meta?.chartType === 'Excel') {
    /** @type {[typeof ExcelEditor, ]} */ ;
    // @ts-ignore
    const __VLS_36 = __VLS_asFunctionalComponent(ExcelEditor, new ExcelEditor({
        ref: "excelViewerRef",
        readonly: true,
    }));
    const __VLS_37 = __VLS_36({
        ref: "excelViewerRef",
        readonly: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_36));
    /** @type {typeof __VLS_ctx.excelViewerRef} */ ;
    var __VLS_39 = {};
    var __VLS_38;
}
else {
    const __VLS_41 = {}.ElEmpty;
    /** @type {[typeof __VLS_components.ElEmpty, typeof __VLS_components.elEmpty, ]} */ ;
    // @ts-ignore
    const __VLS_42 = __VLS_asFunctionalComponent(__VLS_41, new __VLS_41({
        description: "未知的图表类型",
    }));
    const __VLS_43 = __VLS_42({
        description: "未知的图表类型",
    }, ...__VLS_functionalComponentArgsRest(__VLS_42));
}
/** @type {__VLS_StyleScopedClasses['ppr-report-viewer']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['h-full']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-solid']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-200']} */ ;
/** @type {__VLS_StyleScopedClasses['p-3']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-solid']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-200']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['p-3']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['h-full']} */ ;
// @ts-ignore
var __VLS_40 = __VLS_39;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            ExcelEditor: ExcelEditor,
            loading: loading,
            meta: meta,
            queryParams: queryParams,
            tableData: tableData,
            tableColumns: tableColumns,
            echartRef: echartRef,
            excelViewerRef: excelViewerRef,
            fetchData: fetchData,
        };
    },
    __typeProps: {},
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    __typeProps: {},
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=PprReportViewer.vue.js.map