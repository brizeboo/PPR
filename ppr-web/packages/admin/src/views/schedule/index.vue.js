import { ref, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { getScheduleList, saveSchedule, changeScheduleStatus, deleteSchedule } from '@ppr/core';
import { getMailConfig, saveMailConfig, testMailSend } from '@ppr/core';
import { listReports } from '@ppr/core';
// 表格加载状态
const loading = ref(false);
// 定时任务数据列表
const tableData = ref([]);
// 报表数据列表
const reports = ref([]);
// 任务表单弹窗可见性
const dialogVisible = ref(false);
// 任务表单标题
const dialogTitle = ref('新增任务');
// 提交按钮加载状态
const submitLoading = ref(false);
// 任务表单引用
const formRef = ref();
// 任务表单数据
const form = ref({
    status: 1
});
// SMTP配置弹窗可见性
const mailDialogVisible = ref(false);
// SMTP表单引用
const mailFormRef = ref();
// SMTP表单数据
const mailForm = ref({
    port: 465,
    protocol: 'smtp'
});
// SMTP提交按钮加载状态
const mailSubmitLoading = ref(false);
// 测试邮件发送按钮加载状态
const testLoading = ref(false);
// 任务表单验证规则
const rules = {
    reportId: [{ required: true, message: '请选择报表', trigger: 'change' }],
    cron: [{ required: true, message: '请输入Cron表达式', trigger: 'blur' }],
    receivers: [{ required: true, message: '请输入收件人', trigger: 'blur' }]
};
// SMTP表单验证规则
const mailRules = {
    host: [{ required: true, message: '请输入服务器地址', trigger: 'blur' }],
    port: [{ required: true, message: '请输入端口', trigger: 'blur' }],
    username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
    password: [{ required: true, message: '请输入密码/授权码', trigger: 'blur' }]
};
onMounted(async () => {
    fetchData();
    try {
        const res = await listReports();
        reports.value = res.data || res;
    }
    catch (e) { }
});
/**
 * 获取定时任务列表
 */
async function fetchData() {
    loading.value = true;
    try {
        const res = await getScheduleList();
        tableData.value = res.data || res;
    }
    finally {
        loading.value = false;
    }
}
/**
 * 打开新增任务弹窗
 */
function handleCreate() {
    dialogTitle.value = '新增任务';
    form.value = { status: 1 };
    dialogVisible.value = true;
}
/**
 * 打开编辑任务弹窗
 * @param row 当前任务数据
 */
function handleEdit(row) {
    dialogTitle.value = '编辑任务';
    form.value = { ...row };
    dialogVisible.value = true;
}
/**
 * 修改任务状态
 * @param row 当前任务数据
 * @param val 新状态值
 */
async function handleStatusChange(row, val) {
    try {
        await changeScheduleStatus(row.id, val);
        ElMessage.success('状态修改成功');
        row.status = val;
    }
    catch (e) {
        ElMessage.error('状态修改失败');
    }
}
/**
 * 删除任务
 * @param row 当前任务数据
 */
async function handleDelete(row) {
    try {
        await deleteSchedule(row.id);
        ElMessage.success('删除成功');
        fetchData();
    }
    catch (e) {
        ElMessage.error('删除失败');
    }
}
/**
 * 立即执行任务
 * @param row 当前任务数据
 */
function handleExecute(row) {
    ElMessageBox.prompt('请输入临时接收邮箱（如果不输入则发给配置的收件人）', '立即执行', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
    }).then(async ({ value }) => {
        // TODO: 实现手动触发接口
        ElMessage.success('触发指令已发送');
    }).catch(() => { });
}
/**
 * 提交任务表单
 */
async function submitForm() {
    await formRef.value.validate();
    submitLoading.value = true;
    try {
        await saveSchedule(form.value);
        ElMessage.success('保存成功');
        dialogVisible.value = false;
        fetchData();
    }
    finally {
        submitLoading.value = false;
    }
}
/**
 * 打开全局SMTP配置弹窗
 */
async function handleMailConfig() {
    try {
        const res = await getMailConfig();
        if (res && res.data) {
            mailForm.value = res.data;
        }
        else if (res && res.id) {
            mailForm.value = res;
        }
        else {
            mailForm.value = { port: 465, protocol: 'smtp' };
        }
    }
    catch (e) { }
    mailDialogVisible.value = true;
}
/**
 * 提交SMTP配置表单
 */
async function submitMailForm() {
    await mailFormRef.value.validate();
    mailSubmitLoading.value = true;
    try {
        await saveMailConfig(mailForm.value);
        ElMessage.success('保存成功');
        mailDialogVisible.value = false;
    }
    finally {
        mailSubmitLoading.value = false;
    }
}
/**
 * 测试发送邮件
 */
async function testMail() {
    await mailFormRef.value.validate();
    ElMessageBox.prompt('请输入测试接收邮箱', '测试发信', {
        confirmButtonText: '发送',
        cancelButtonText: '取消',
        inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
        inputErrorMessage: '邮箱格式不正确'
    }).then(async ({ value }) => {
        testLoading.value = true;
        try {
            await testMailSend(value);
            ElMessage.success('测试邮件发送成功，请查收');
        }
        catch (e) {
            ElMessage.error('发送失败: ' + (e.message || '未知错误'));
        }
        finally {
            testLoading.value = false;
        }
    }).catch(() => { });
}
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "schedule-container" },
});
/** @type {__VLS_StyleScopedClasses['schedule-container']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "schedule-header" },
});
/** @type {__VLS_StyleScopedClasses['schedule-header']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
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
    { onClick: (__VLS_ctx.handleCreate) });
const { default: __VLS_7 } = __VLS_3.slots;
// @ts-ignore
[handleCreate,];
var __VLS_3;
var __VLS_4;
let __VLS_8;
/** @ts-ignore @type {typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components.elButton | typeof __VLS_components.ElButton} */
elButton;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent1(__VLS_8, new __VLS_8({
    ...{ 'onClick': {} },
}));
const __VLS_10 = __VLS_9({
    ...{ 'onClick': {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
let __VLS_13;
const __VLS_14 = ({ click: {} },
    { onClick: (__VLS_ctx.handleMailConfig) });
const { default: __VLS_15 } = __VLS_11.slots;
// @ts-ignore
[handleMailConfig,];
var __VLS_11;
var __VLS_12;
let __VLS_16;
/** @ts-ignore @type {typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components.elTable | typeof __VLS_components.ElTable} */
elTable;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent1(__VLS_16, new __VLS_16({
    data: (__VLS_ctx.tableData),
    border: true,
    stripe: true,
    ...{ class: "schedule-table" },
}));
const __VLS_18 = __VLS_17({
    data: (__VLS_ctx.tableData),
    border: true,
    stripe: true,
    ...{ class: "schedule-table" },
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
__VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
/** @type {__VLS_StyleScopedClasses['schedule-table']} */ ;
const { default: __VLS_21 } = __VLS_19.slots;
let __VLS_22;
/** @ts-ignore @type {typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn} */
elTableColumn;
// @ts-ignore
const __VLS_23 = __VLS_asFunctionalComponent1(__VLS_22, new __VLS_22({
    prop: "id",
    label: "任务ID",
    width: "280",
}));
const __VLS_24 = __VLS_23({
    prop: "id",
    label: "任务ID",
    width: "280",
}, ...__VLS_functionalComponentArgsRest(__VLS_23));
let __VLS_27;
/** @ts-ignore @type {typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn} */
elTableColumn;
// @ts-ignore
const __VLS_28 = __VLS_asFunctionalComponent1(__VLS_27, new __VLS_27({
    prop: "reportId",
    label: "关联报表ID",
}));
const __VLS_29 = __VLS_28({
    prop: "reportId",
    label: "关联报表ID",
}, ...__VLS_functionalComponentArgsRest(__VLS_28));
let __VLS_32;
/** @ts-ignore @type {typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn} */
elTableColumn;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent1(__VLS_32, new __VLS_32({
    prop: "cron",
    label: "Cron表达式",
}));
const __VLS_34 = __VLS_33({
    prop: "cron",
    label: "Cron表达式",
}, ...__VLS_functionalComponentArgsRest(__VLS_33));
let __VLS_37;
/** @ts-ignore @type {typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn} */
elTableColumn;
// @ts-ignore
const __VLS_38 = __VLS_asFunctionalComponent1(__VLS_37, new __VLS_37({
    prop: "receivers",
    label: "收件人",
    showOverflowTooltip: true,
}));
const __VLS_39 = __VLS_38({
    prop: "receivers",
    label: "收件人",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_38));
let __VLS_42;
/** @ts-ignore @type {typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn} */
elTableColumn;
// @ts-ignore
const __VLS_43 = __VLS_asFunctionalComponent1(__VLS_42, new __VLS_42({
    prop: "status",
    label: "状态",
    width: "100",
}));
const __VLS_44 = __VLS_43({
    prop: "status",
    label: "状态",
    width: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_43));
const { default: __VLS_47 } = __VLS_45.slots;
{
    const { default: __VLS_48 } = __VLS_45.slots;
    const [{ row }] = __VLS_vSlot(__VLS_48);
    let __VLS_49;
    /** @ts-ignore @type {typeof __VLS_components.elSwitch | typeof __VLS_components.ElSwitch} */
    elSwitch;
    // @ts-ignore
    const __VLS_50 = __VLS_asFunctionalComponent1(__VLS_49, new __VLS_49({
        ...{ 'onChange': {} },
        modelValue: (row.status),
        activeValue: (1),
        inactiveValue: (0),
    }));
    const __VLS_51 = __VLS_50({
        ...{ 'onChange': {} },
        modelValue: (row.status),
        activeValue: (1),
        inactiveValue: (0),
    }, ...__VLS_functionalComponentArgsRest(__VLS_50));
    let __VLS_54;
    const __VLS_55 = ({ change: {} },
        { onChange: ((val) => __VLS_ctx.handleStatusChange(row, val)) });
    var __VLS_52;
    var __VLS_53;
    // @ts-ignore
    [tableData, vLoading, loading, handleStatusChange,];
}
// @ts-ignore
[];
var __VLS_45;
let __VLS_56;
/** @ts-ignore @type {typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn} */
elTableColumn;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent1(__VLS_56, new __VLS_56({
    label: "操作",
    width: "220",
    fixed: "right",
}));
const __VLS_58 = __VLS_57({
    label: "操作",
    width: "220",
    fixed: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_57));
const { default: __VLS_61 } = __VLS_59.slots;
{
    const { default: __VLS_62 } = __VLS_59.slots;
    const [{ row }] = __VLS_vSlot(__VLS_62);
    let __VLS_63;
    /** @ts-ignore @type {typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components.elButton | typeof __VLS_components.ElButton} */
    elButton;
    // @ts-ignore
    const __VLS_64 = __VLS_asFunctionalComponent1(__VLS_63, new __VLS_63({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }));
    const __VLS_65 = __VLS_64({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_64));
    let __VLS_68;
    const __VLS_69 = ({ click: {} },
        { onClick: (...[$event]) => {
                __VLS_ctx.handleEdit(row);
                // @ts-ignore
                [handleEdit,];
            } });
    const { default: __VLS_70 } = __VLS_66.slots;
    // @ts-ignore
    [];
    var __VLS_66;
    var __VLS_67;
    let __VLS_71;
    /** @ts-ignore @type {typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components.elButton | typeof __VLS_components.ElButton} */
    elButton;
    // @ts-ignore
    const __VLS_72 = __VLS_asFunctionalComponent1(__VLS_71, new __VLS_71({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }));
    const __VLS_73 = __VLS_72({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_72));
    let __VLS_76;
    const __VLS_77 = ({ click: {} },
        { onClick: (...[$event]) => {
                __VLS_ctx.handleExecute(row);
                // @ts-ignore
                [handleExecute,];
            } });
    const { default: __VLS_78 } = __VLS_74.slots;
    // @ts-ignore
    [];
    var __VLS_74;
    var __VLS_75;
    let __VLS_79;
    /** @ts-ignore @type {typeof __VLS_components.elPopconfirm | typeof __VLS_components.ElPopconfirm | typeof __VLS_components.elPopconfirm | typeof __VLS_components.ElPopconfirm} */
    elPopconfirm;
    // @ts-ignore
    const __VLS_80 = __VLS_asFunctionalComponent1(__VLS_79, new __VLS_79({
        ...{ 'onConfirm': {} },
        title: "确定要删除该任务吗？",
    }));
    const __VLS_81 = __VLS_80({
        ...{ 'onConfirm': {} },
        title: "确定要删除该任务吗？",
    }, ...__VLS_functionalComponentArgsRest(__VLS_80));
    let __VLS_84;
    const __VLS_85 = ({ confirm: {} },
        { onConfirm: (...[$event]) => {
                __VLS_ctx.handleDelete(row);
                // @ts-ignore
                [handleDelete,];
            } });
    const { default: __VLS_86 } = __VLS_82.slots;
    {
        const { reference: __VLS_87 } = __VLS_82.slots;
        let __VLS_88;
        /** @ts-ignore @type {typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components.elButton | typeof __VLS_components.ElButton} */
        elButton;
        // @ts-ignore
        const __VLS_89 = __VLS_asFunctionalComponent1(__VLS_88, new __VLS_88({
            link: true,
            type: "danger",
        }));
        const __VLS_90 = __VLS_89({
            link: true,
            type: "danger",
        }, ...__VLS_functionalComponentArgsRest(__VLS_89));
        const { default: __VLS_93 } = __VLS_91.slots;
        // @ts-ignore
        [];
        var __VLS_91;
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
    var __VLS_82;
    var __VLS_83;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_59;
// @ts-ignore
[];
var __VLS_19;
let __VLS_94;
/** @ts-ignore @type {typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog} */
elDialog;
// @ts-ignore
const __VLS_95 = __VLS_asFunctionalComponent1(__VLS_94, new __VLS_94({
    title: (__VLS_ctx.dialogTitle),
    modelValue: (__VLS_ctx.dialogVisible),
    width: "600px",
}));
const __VLS_96 = __VLS_95({
    title: (__VLS_ctx.dialogTitle),
    modelValue: (__VLS_ctx.dialogVisible),
    width: "600px",
}, ...__VLS_functionalComponentArgsRest(__VLS_95));
const { default: __VLS_99 } = __VLS_97.slots;
let __VLS_100;
/** @ts-ignore @type {typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components.elForm | typeof __VLS_components.ElForm} */
elForm;
// @ts-ignore
const __VLS_101 = __VLS_asFunctionalComponent1(__VLS_100, new __VLS_100({
    model: (__VLS_ctx.form),
    rules: (__VLS_ctx.rules),
    ref: "formRef",
    labelWidth: "120px",
}));
const __VLS_102 = __VLS_101({
    model: (__VLS_ctx.form),
    rules: (__VLS_ctx.rules),
    ref: "formRef",
    labelWidth: "120px",
}, ...__VLS_functionalComponentArgsRest(__VLS_101));
var __VLS_105 = {};
const { default: __VLS_107 } = __VLS_103.slots;
let __VLS_108;
/** @ts-ignore @type {typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem} */
elFormItem;
// @ts-ignore
const __VLS_109 = __VLS_asFunctionalComponent1(__VLS_108, new __VLS_108({
    label: "关联报表",
    prop: "reportId",
}));
const __VLS_110 = __VLS_109({
    label: "关联报表",
    prop: "reportId",
}, ...__VLS_functionalComponentArgsRest(__VLS_109));
const { default: __VLS_113 } = __VLS_111.slots;
let __VLS_114;
/** @ts-ignore @type {typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect} */
elSelect;
// @ts-ignore
const __VLS_115 = __VLS_asFunctionalComponent1(__VLS_114, new __VLS_114({
    modelValue: (__VLS_ctx.form.reportId),
    placeholder: "请选择报表",
    ...{ class: "schedule-select-full" },
}));
const __VLS_116 = __VLS_115({
    modelValue: (__VLS_ctx.form.reportId),
    placeholder: "请选择报表",
    ...{ class: "schedule-select-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_115));
/** @type {__VLS_StyleScopedClasses['schedule-select-full']} */ ;
const { default: __VLS_119 } = __VLS_117.slots;
for (const [item] of __VLS_vFor((__VLS_ctx.reports))) {
    let __VLS_120;
    /** @ts-ignore @type {typeof __VLS_components.elOption | typeof __VLS_components.ElOption} */
    elOption;
    // @ts-ignore
    const __VLS_121 = __VLS_asFunctionalComponent1(__VLS_120, new __VLS_120({
        key: (item.id),
        label: (item.name),
        value: (item.id),
    }));
    const __VLS_122 = __VLS_121({
        key: (item.id),
        label: (item.name),
        value: (item.id),
    }, ...__VLS_functionalComponentArgsRest(__VLS_121));
    // @ts-ignore
    [dialogTitle, dialogVisible, form, form, rules, reports,];
}
// @ts-ignore
[];
var __VLS_117;
// @ts-ignore
[];
var __VLS_111;
let __VLS_125;
/** @ts-ignore @type {typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem} */
elFormItem;
// @ts-ignore
const __VLS_126 = __VLS_asFunctionalComponent1(__VLS_125, new __VLS_125({
    label: "Cron表达式",
    prop: "cron",
}));
const __VLS_127 = __VLS_126({
    label: "Cron表达式",
    prop: "cron",
}, ...__VLS_functionalComponentArgsRest(__VLS_126));
const { default: __VLS_130 } = __VLS_128.slots;
let __VLS_131;
/** @ts-ignore @type {typeof __VLS_components.elInput | typeof __VLS_components.ElInput} */
elInput;
// @ts-ignore
const __VLS_132 = __VLS_asFunctionalComponent1(__VLS_131, new __VLS_131({
    modelValue: (__VLS_ctx.form.cron),
    placeholder: "例如：0 0/5 * * * ?",
}));
const __VLS_133 = __VLS_132({
    modelValue: (__VLS_ctx.form.cron),
    placeholder: "例如：0 0/5 * * * ?",
}, ...__VLS_functionalComponentArgsRest(__VLS_132));
// @ts-ignore
[form,];
var __VLS_128;
let __VLS_136;
/** @ts-ignore @type {typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem} */
elFormItem;
// @ts-ignore
const __VLS_137 = __VLS_asFunctionalComponent1(__VLS_136, new __VLS_136({
    label: "收件人",
    prop: "receivers",
}));
const __VLS_138 = __VLS_137({
    label: "收件人",
    prop: "receivers",
}, ...__VLS_functionalComponentArgsRest(__VLS_137));
const { default: __VLS_141 } = __VLS_139.slots;
let __VLS_142;
/** @ts-ignore @type {typeof __VLS_components.elInput | typeof __VLS_components.ElInput} */
elInput;
// @ts-ignore
const __VLS_143 = __VLS_asFunctionalComponent1(__VLS_142, new __VLS_142({
    modelValue: (__VLS_ctx.form.receivers),
    placeholder: "多个用逗号分隔",
}));
const __VLS_144 = __VLS_143({
    modelValue: (__VLS_ctx.form.receivers),
    placeholder: "多个用逗号分隔",
}, ...__VLS_functionalComponentArgsRest(__VLS_143));
// @ts-ignore
[form,];
var __VLS_139;
let __VLS_147;
/** @ts-ignore @type {typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem} */
elFormItem;
// @ts-ignore
const __VLS_148 = __VLS_asFunctionalComponent1(__VLS_147, new __VLS_147({
    label: "抄送人",
    prop: "ccReceivers",
}));
const __VLS_149 = __VLS_148({
    label: "抄送人",
    prop: "ccReceivers",
}, ...__VLS_functionalComponentArgsRest(__VLS_148));
const { default: __VLS_152 } = __VLS_150.slots;
let __VLS_153;
/** @ts-ignore @type {typeof __VLS_components.elInput | typeof __VLS_components.ElInput} */
elInput;
// @ts-ignore
const __VLS_154 = __VLS_asFunctionalComponent1(__VLS_153, new __VLS_153({
    modelValue: (__VLS_ctx.form.ccReceivers),
    placeholder: "多个用逗号分隔",
}));
const __VLS_155 = __VLS_154({
    modelValue: (__VLS_ctx.form.ccReceivers),
    placeholder: "多个用逗号分隔",
}, ...__VLS_functionalComponentArgsRest(__VLS_154));
// @ts-ignore
[form,];
var __VLS_150;
let __VLS_158;
/** @ts-ignore @type {typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem} */
elFormItem;
// @ts-ignore
const __VLS_159 = __VLS_asFunctionalComponent1(__VLS_158, new __VLS_158({
    label: "邮件主题",
    prop: "emailSubject",
}));
const __VLS_160 = __VLS_159({
    label: "邮件主题",
    prop: "emailSubject",
}, ...__VLS_functionalComponentArgsRest(__VLS_159));
const { default: __VLS_163 } = __VLS_161.slots;
let __VLS_164;
/** @ts-ignore @type {typeof __VLS_components.elInput | typeof __VLS_components.ElInput} */
elInput;
// @ts-ignore
const __VLS_165 = __VLS_asFunctionalComponent1(__VLS_164, new __VLS_164({
    modelValue: (__VLS_ctx.form.emailSubject),
    placeholder: "自定义邮件主题",
}));
const __VLS_166 = __VLS_165({
    modelValue: (__VLS_ctx.form.emailSubject),
    placeholder: "自定义邮件主题",
}, ...__VLS_functionalComponentArgsRest(__VLS_165));
// @ts-ignore
[form,];
var __VLS_161;
let __VLS_169;
/** @ts-ignore @type {typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem} */
elFormItem;
// @ts-ignore
const __VLS_170 = __VLS_asFunctionalComponent1(__VLS_169, new __VLS_169({
    label: "邮件正文",
    prop: "emailContent",
}));
const __VLS_171 = __VLS_170({
    label: "邮件正文",
    prop: "emailContent",
}, ...__VLS_functionalComponentArgsRest(__VLS_170));
const { default: __VLS_174 } = __VLS_172.slots;
let __VLS_175;
/** @ts-ignore @type {typeof __VLS_components.elInput | typeof __VLS_components.ElInput} */
elInput;
// @ts-ignore
const __VLS_176 = __VLS_asFunctionalComponent1(__VLS_175, new __VLS_175({
    modelValue: (__VLS_ctx.form.emailContent),
    type: "textarea",
    rows: (4),
    placeholder: "自定义邮件正文(支持HTML)",
}));
const __VLS_177 = __VLS_176({
    modelValue: (__VLS_ctx.form.emailContent),
    type: "textarea",
    rows: (4),
    placeholder: "自定义邮件正文(支持HTML)",
}, ...__VLS_functionalComponentArgsRest(__VLS_176));
// @ts-ignore
[form,];
var __VLS_172;
let __VLS_180;
/** @ts-ignore @type {typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem} */
elFormItem;
// @ts-ignore
const __VLS_181 = __VLS_asFunctionalComponent1(__VLS_180, new __VLS_180({
    label: "启用状态",
    prop: "status",
}));
const __VLS_182 = __VLS_181({
    label: "启用状态",
    prop: "status",
}, ...__VLS_functionalComponentArgsRest(__VLS_181));
const { default: __VLS_185 } = __VLS_183.slots;
let __VLS_186;
/** @ts-ignore @type {typeof __VLS_components.elSwitch | typeof __VLS_components.ElSwitch} */
elSwitch;
// @ts-ignore
const __VLS_187 = __VLS_asFunctionalComponent1(__VLS_186, new __VLS_186({
    modelValue: (__VLS_ctx.form.status),
    activeValue: (1),
    inactiveValue: (0),
}));
const __VLS_188 = __VLS_187({
    modelValue: (__VLS_ctx.form.status),
    activeValue: (1),
    inactiveValue: (0),
}, ...__VLS_functionalComponentArgsRest(__VLS_187));
// @ts-ignore
[form,];
var __VLS_183;
// @ts-ignore
[];
var __VLS_103;
{
    const { footer: __VLS_191 } = __VLS_97.slots;
    let __VLS_192;
    /** @ts-ignore @type {typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components.elButton | typeof __VLS_components.ElButton} */
    elButton;
    // @ts-ignore
    const __VLS_193 = __VLS_asFunctionalComponent1(__VLS_192, new __VLS_192({
        ...{ 'onClick': {} },
    }));
    const __VLS_194 = __VLS_193({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_193));
    let __VLS_197;
    const __VLS_198 = ({ click: {} },
        { onClick: (...[$event]) => {
                __VLS_ctx.dialogVisible = false;
                // @ts-ignore
                [dialogVisible,];
            } });
    const { default: __VLS_199 } = __VLS_195.slots;
    // @ts-ignore
    [];
    var __VLS_195;
    var __VLS_196;
    let __VLS_200;
    /** @ts-ignore @type {typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components.elButton | typeof __VLS_components.ElButton} */
    elButton;
    // @ts-ignore
    const __VLS_201 = __VLS_asFunctionalComponent1(__VLS_200, new __VLS_200({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.submitLoading),
    }));
    const __VLS_202 = __VLS_201({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.submitLoading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_201));
    let __VLS_205;
    const __VLS_206 = ({ click: {} },
        { onClick: (__VLS_ctx.submitForm) });
    const { default: __VLS_207 } = __VLS_203.slots;
    // @ts-ignore
    [submitLoading, submitForm,];
    var __VLS_203;
    var __VLS_204;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_97;
let __VLS_208;
/** @ts-ignore @type {typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog} */
elDialog;
// @ts-ignore
const __VLS_209 = __VLS_asFunctionalComponent1(__VLS_208, new __VLS_208({
    title: "全局 SMTP 配置",
    modelValue: (__VLS_ctx.mailDialogVisible),
    width: "500px",
}));
const __VLS_210 = __VLS_209({
    title: "全局 SMTP 配置",
    modelValue: (__VLS_ctx.mailDialogVisible),
    width: "500px",
}, ...__VLS_functionalComponentArgsRest(__VLS_209));
const { default: __VLS_213 } = __VLS_211.slots;
let __VLS_214;
/** @ts-ignore @type {typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components.elForm | typeof __VLS_components.ElForm} */
elForm;
// @ts-ignore
const __VLS_215 = __VLS_asFunctionalComponent1(__VLS_214, new __VLS_214({
    model: (__VLS_ctx.mailForm),
    rules: (__VLS_ctx.mailRules),
    ref: "mailFormRef",
    labelWidth: "100px",
}));
const __VLS_216 = __VLS_215({
    model: (__VLS_ctx.mailForm),
    rules: (__VLS_ctx.mailRules),
    ref: "mailFormRef",
    labelWidth: "100px",
}, ...__VLS_functionalComponentArgsRest(__VLS_215));
var __VLS_219 = {};
const { default: __VLS_221 } = __VLS_217.slots;
let __VLS_222;
/** @ts-ignore @type {typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem} */
elFormItem;
// @ts-ignore
const __VLS_223 = __VLS_asFunctionalComponent1(__VLS_222, new __VLS_222({
    label: "SMTP 服务器",
    prop: "host",
}));
const __VLS_224 = __VLS_223({
    label: "SMTP 服务器",
    prop: "host",
}, ...__VLS_functionalComponentArgsRest(__VLS_223));
const { default: __VLS_227 } = __VLS_225.slots;
let __VLS_228;
/** @ts-ignore @type {typeof __VLS_components.elInput | typeof __VLS_components.ElInput} */
elInput;
// @ts-ignore
const __VLS_229 = __VLS_asFunctionalComponent1(__VLS_228, new __VLS_228({
    modelValue: (__VLS_ctx.mailForm.host),
    placeholder: "例如：smtp.qq.com",
}));
const __VLS_230 = __VLS_229({
    modelValue: (__VLS_ctx.mailForm.host),
    placeholder: "例如：smtp.qq.com",
}, ...__VLS_functionalComponentArgsRest(__VLS_229));
// @ts-ignore
[mailDialogVisible, mailForm, mailForm, mailRules,];
var __VLS_225;
let __VLS_233;
/** @ts-ignore @type {typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem} */
elFormItem;
// @ts-ignore
const __VLS_234 = __VLS_asFunctionalComponent1(__VLS_233, new __VLS_233({
    label: "端口",
    prop: "port",
}));
const __VLS_235 = __VLS_234({
    label: "端口",
    prop: "port",
}, ...__VLS_functionalComponentArgsRest(__VLS_234));
const { default: __VLS_238 } = __VLS_236.slots;
let __VLS_239;
/** @ts-ignore @type {typeof __VLS_components.elInputNumber | typeof __VLS_components.ElInputNumber} */
elInputNumber;
// @ts-ignore
const __VLS_240 = __VLS_asFunctionalComponent1(__VLS_239, new __VLS_239({
    modelValue: (__VLS_ctx.mailForm.port),
    min: (1),
    max: (65535),
}));
const __VLS_241 = __VLS_240({
    modelValue: (__VLS_ctx.mailForm.port),
    min: (1),
    max: (65535),
}, ...__VLS_functionalComponentArgsRest(__VLS_240));
// @ts-ignore
[mailForm,];
var __VLS_236;
let __VLS_244;
/** @ts-ignore @type {typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem} */
elFormItem;
// @ts-ignore
const __VLS_245 = __VLS_asFunctionalComponent1(__VLS_244, new __VLS_244({
    label: "用户名",
    prop: "username",
}));
const __VLS_246 = __VLS_245({
    label: "用户名",
    prop: "username",
}, ...__VLS_functionalComponentArgsRest(__VLS_245));
const { default: __VLS_249 } = __VLS_247.slots;
let __VLS_250;
/** @ts-ignore @type {typeof __VLS_components.elInput | typeof __VLS_components.ElInput} */
elInput;
// @ts-ignore
const __VLS_251 = __VLS_asFunctionalComponent1(__VLS_250, new __VLS_250({
    modelValue: (__VLS_ctx.mailForm.username),
    placeholder: "发件人邮箱账号",
}));
const __VLS_252 = __VLS_251({
    modelValue: (__VLS_ctx.mailForm.username),
    placeholder: "发件人邮箱账号",
}, ...__VLS_functionalComponentArgsRest(__VLS_251));
// @ts-ignore
[mailForm,];
var __VLS_247;
let __VLS_255;
/** @ts-ignore @type {typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem} */
elFormItem;
// @ts-ignore
const __VLS_256 = __VLS_asFunctionalComponent1(__VLS_255, new __VLS_255({
    label: "密码/授权码",
    prop: "password",
}));
const __VLS_257 = __VLS_256({
    label: "密码/授权码",
    prop: "password",
}, ...__VLS_functionalComponentArgsRest(__VLS_256));
const { default: __VLS_260 } = __VLS_258.slots;
let __VLS_261;
/** @ts-ignore @type {typeof __VLS_components.elInput | typeof __VLS_components.ElInput} */
elInput;
// @ts-ignore
const __VLS_262 = __VLS_asFunctionalComponent1(__VLS_261, new __VLS_261({
    modelValue: (__VLS_ctx.mailForm.password),
    type: "password",
    showPassword: true,
}));
const __VLS_263 = __VLS_262({
    modelValue: (__VLS_ctx.mailForm.password),
    type: "password",
    showPassword: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_262));
// @ts-ignore
[mailForm,];
var __VLS_258;
let __VLS_266;
/** @ts-ignore @type {typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem} */
elFormItem;
// @ts-ignore
const __VLS_267 = __VLS_asFunctionalComponent1(__VLS_266, new __VLS_266({
    label: "协议",
    prop: "protocol",
}));
const __VLS_268 = __VLS_267({
    label: "协议",
    prop: "protocol",
}, ...__VLS_functionalComponentArgsRest(__VLS_267));
const { default: __VLS_271 } = __VLS_269.slots;
let __VLS_272;
/** @ts-ignore @type {typeof __VLS_components.elInput | typeof __VLS_components.ElInput} */
elInput;
// @ts-ignore
const __VLS_273 = __VLS_asFunctionalComponent1(__VLS_272, new __VLS_272({
    modelValue: (__VLS_ctx.mailForm.protocol),
    placeholder: "smtp",
}));
const __VLS_274 = __VLS_273({
    modelValue: (__VLS_ctx.mailForm.protocol),
    placeholder: "smtp",
}, ...__VLS_functionalComponentArgsRest(__VLS_273));
// @ts-ignore
[mailForm,];
var __VLS_269;
// @ts-ignore
[];
var __VLS_217;
{
    const { footer: __VLS_277 } = __VLS_211.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "schedule-dialog-footer" },
    });
    /** @type {__VLS_StyleScopedClasses['schedule-dialog-footer']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    let __VLS_278;
    /** @ts-ignore @type {typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components.elButton | typeof __VLS_components.ElButton} */
    elButton;
    // @ts-ignore
    const __VLS_279 = __VLS_asFunctionalComponent1(__VLS_278, new __VLS_278({
        ...{ 'onClick': {} },
        type: "success",
        loading: (__VLS_ctx.testLoading),
    }));
    const __VLS_280 = __VLS_279({
        ...{ 'onClick': {} },
        type: "success",
        loading: (__VLS_ctx.testLoading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_279));
    let __VLS_283;
    const __VLS_284 = ({ click: {} },
        { onClick: (__VLS_ctx.testMail) });
    const { default: __VLS_285 } = __VLS_281.slots;
    // @ts-ignore
    [testLoading, testMail,];
    var __VLS_281;
    var __VLS_282;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    let __VLS_286;
    /** @ts-ignore @type {typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components.elButton | typeof __VLS_components.ElButton} */
    elButton;
    // @ts-ignore
    const __VLS_287 = __VLS_asFunctionalComponent1(__VLS_286, new __VLS_286({
        ...{ 'onClick': {} },
    }));
    const __VLS_288 = __VLS_287({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_287));
    let __VLS_291;
    const __VLS_292 = ({ click: {} },
        { onClick: (...[$event]) => {
                __VLS_ctx.mailDialogVisible = false;
                // @ts-ignore
                [mailDialogVisible,];
            } });
    const { default: __VLS_293 } = __VLS_289.slots;
    // @ts-ignore
    [];
    var __VLS_289;
    var __VLS_290;
    let __VLS_294;
    /** @ts-ignore @type {typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components.elButton | typeof __VLS_components.ElButton} */
    elButton;
    // @ts-ignore
    const __VLS_295 = __VLS_asFunctionalComponent1(__VLS_294, new __VLS_294({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.mailSubmitLoading),
    }));
    const __VLS_296 = __VLS_295({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.mailSubmitLoading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_295));
    let __VLS_299;
    const __VLS_300 = ({ click: {} },
        { onClick: (__VLS_ctx.submitMailForm) });
    const { default: __VLS_301 } = __VLS_297.slots;
    // @ts-ignore
    [mailSubmitLoading, submitMailForm,];
    var __VLS_297;
    var __VLS_298;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_211;
// @ts-ignore
var __VLS_106 = __VLS_105, __VLS_220 = __VLS_219;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
//# sourceMappingURL=index.vue.js.map