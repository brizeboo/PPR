import { ref, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { getScheduleList, saveSchedule, changeScheduleStatus, deleteSchedule } from '@/api/schedule';
import { getMailConfig, saveMailConfig, testMailSend } from '@/api/mail';
import { listReports } from '@/api/report';
const loading = ref(false);
const tableData = ref([]);
const reports = ref([]);
const dialogVisible = ref(false);
const dialogTitle = ref('新增任务');
const submitLoading = ref(false);
const formRef = ref();
const form = ref({
    status: 1
});
const mailDialogVisible = ref(false);
const mailFormRef = ref();
const mailForm = ref({
    port: 465,
    protocol: 'smtp'
});
const mailSubmitLoading = ref(false);
const testLoading = ref(false);
const rules = {
    reportId: [{ required: true, message: '请选择报表', trigger: 'change' }],
    cron: [{ required: true, message: '请输入Cron表达式', trigger: 'blur' }],
    receivers: [{ required: true, message: '请输入收件人', trigger: 'blur' }]
};
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
function handleCreate() {
    dialogTitle.value = '新增任务';
    form.value = { status: 1 };
    dialogVisible.value = true;
}
function handleEdit(row) {
    dialogTitle.value = '编辑任务';
    form.value = { ...row };
    dialogVisible.value = true;
}
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
function handleExecute(row) {
    ElMessageBox.prompt('请输入临时接收邮箱（如果不输入则发给配置的收件人）', '立即执行', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
    }).then(async ({ value }) => {
        // TODO: 实现手动触发接口
        ElMessage.success('触发指令已发送');
    }).catch(() => { });
}
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
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "h-full flex flex-col" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex justify-between mb-4" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
const __VLS_0 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ...{ 'onClick': {} },
    type: "primary",
}));
const __VLS_2 = __VLS_1({
    ...{ 'onClick': {} },
    type: "primary",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_4;
let __VLS_5;
let __VLS_6;
const __VLS_7 = {
    onClick: (__VLS_ctx.handleCreate)
};
__VLS_3.slots.default;
var __VLS_3;
const __VLS_8 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
    ...{ 'onClick': {} },
}));
const __VLS_10 = __VLS_9({
    ...{ 'onClick': {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
let __VLS_12;
let __VLS_13;
let __VLS_14;
const __VLS_15 = {
    onClick: (__VLS_ctx.handleMailConfig)
};
__VLS_11.slots.default;
var __VLS_11;
const __VLS_16 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
    data: (__VLS_ctx.tableData),
    border: true,
    stripe: true,
    ...{ class: "flex-1" },
}));
const __VLS_18 = __VLS_17({
    data: (__VLS_ctx.tableData),
    border: true,
    stripe: true,
    ...{ class: "flex-1" },
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
__VLS_asFunctionalDirective(__VLS_directives.vLoading)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
__VLS_19.slots.default;
const __VLS_20 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
    prop: "id",
    label: "任务ID",
    width: "280",
}));
const __VLS_22 = __VLS_21({
    prop: "id",
    label: "任务ID",
    width: "280",
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
const __VLS_24 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
    prop: "reportId",
    label: "关联报表ID",
}));
const __VLS_26 = __VLS_25({
    prop: "reportId",
    label: "关联报表ID",
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
const __VLS_28 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
    prop: "cron",
    label: "Cron表达式",
}));
const __VLS_30 = __VLS_29({
    prop: "cron",
    label: "Cron表达式",
}, ...__VLS_functionalComponentArgsRest(__VLS_29));
const __VLS_32 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
    prop: "receivers",
    label: "收件人",
    showOverflowTooltip: true,
}));
const __VLS_34 = __VLS_33({
    prop: "receivers",
    label: "收件人",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_33));
const __VLS_36 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
    prop: "status",
    label: "状态",
    width: "100",
}));
const __VLS_38 = __VLS_37({
    prop: "status",
    label: "状态",
    width: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
__VLS_39.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_39.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_40 = {}.ElSwitch;
    /** @type {[typeof __VLS_components.ElSwitch, typeof __VLS_components.elSwitch, ]} */ ;
    // @ts-ignore
    const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
        ...{ 'onChange': {} },
        modelValue: (row.status),
        activeValue: (1),
        inactiveValue: (0),
    }));
    const __VLS_42 = __VLS_41({
        ...{ 'onChange': {} },
        modelValue: (row.status),
        activeValue: (1),
        inactiveValue: (0),
    }, ...__VLS_functionalComponentArgsRest(__VLS_41));
    let __VLS_44;
    let __VLS_45;
    let __VLS_46;
    const __VLS_47 = {
        onChange: ((val) => __VLS_ctx.handleStatusChange(row, val))
    };
    var __VLS_43;
}
var __VLS_39;
const __VLS_48 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
    label: "操作",
    width: "220",
    fixed: "right",
}));
const __VLS_50 = __VLS_49({
    label: "操作",
    width: "220",
    fixed: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_49));
__VLS_51.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_51.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_52 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }));
    const __VLS_54 = __VLS_53({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_53));
    let __VLS_56;
    let __VLS_57;
    let __VLS_58;
    const __VLS_59 = {
        onClick: (...[$event]) => {
            __VLS_ctx.handleEdit(row);
        }
    };
    __VLS_55.slots.default;
    var __VLS_55;
    const __VLS_60 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }));
    const __VLS_62 = __VLS_61({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_61));
    let __VLS_64;
    let __VLS_65;
    let __VLS_66;
    const __VLS_67 = {
        onClick: (...[$event]) => {
            __VLS_ctx.handleExecute(row);
        }
    };
    __VLS_63.slots.default;
    var __VLS_63;
    const __VLS_68 = {}.ElPopconfirm;
    /** @type {[typeof __VLS_components.ElPopconfirm, typeof __VLS_components.elPopconfirm, typeof __VLS_components.ElPopconfirm, typeof __VLS_components.elPopconfirm, ]} */ ;
    // @ts-ignore
    const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
        ...{ 'onConfirm': {} },
        title: "确定要删除该任务吗？",
    }));
    const __VLS_70 = __VLS_69({
        ...{ 'onConfirm': {} },
        title: "确定要删除该任务吗？",
    }, ...__VLS_functionalComponentArgsRest(__VLS_69));
    let __VLS_72;
    let __VLS_73;
    let __VLS_74;
    const __VLS_75 = {
        onConfirm: (...[$event]) => {
            __VLS_ctx.handleDelete(row);
        }
    };
    __VLS_71.slots.default;
    {
        const { reference: __VLS_thisSlot } = __VLS_71.slots;
        const __VLS_76 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
            link: true,
            type: "danger",
        }));
        const __VLS_78 = __VLS_77({
            link: true,
            type: "danger",
        }, ...__VLS_functionalComponentArgsRest(__VLS_77));
        __VLS_79.slots.default;
        var __VLS_79;
    }
    var __VLS_71;
}
var __VLS_51;
var __VLS_19;
const __VLS_80 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({
    title: (__VLS_ctx.dialogTitle),
    modelValue: (__VLS_ctx.dialogVisible),
    width: "600px",
}));
const __VLS_82 = __VLS_81({
    title: (__VLS_ctx.dialogTitle),
    modelValue: (__VLS_ctx.dialogVisible),
    width: "600px",
}, ...__VLS_functionalComponentArgsRest(__VLS_81));
__VLS_83.slots.default;
const __VLS_84 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
    model: (__VLS_ctx.form),
    rules: (__VLS_ctx.rules),
    ref: "formRef",
    labelWidth: "120px",
}));
const __VLS_86 = __VLS_85({
    model: (__VLS_ctx.form),
    rules: (__VLS_ctx.rules),
    ref: "formRef",
    labelWidth: "120px",
}, ...__VLS_functionalComponentArgsRest(__VLS_85));
/** @type {typeof __VLS_ctx.formRef} */ ;
var __VLS_88 = {};
__VLS_87.slots.default;
const __VLS_90 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_91 = __VLS_asFunctionalComponent(__VLS_90, new __VLS_90({
    label: "关联报表",
    prop: "reportId",
}));
const __VLS_92 = __VLS_91({
    label: "关联报表",
    prop: "reportId",
}, ...__VLS_functionalComponentArgsRest(__VLS_91));
__VLS_93.slots.default;
const __VLS_94 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_95 = __VLS_asFunctionalComponent(__VLS_94, new __VLS_94({
    modelValue: (__VLS_ctx.form.reportId),
    placeholder: "请选择报表",
    ...{ class: "w-full" },
}));
const __VLS_96 = __VLS_95({
    modelValue: (__VLS_ctx.form.reportId),
    placeholder: "请选择报表",
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_95));
__VLS_97.slots.default;
for (const [item] of __VLS_getVForSourceType((__VLS_ctx.reports))) {
    const __VLS_98 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_99 = __VLS_asFunctionalComponent(__VLS_98, new __VLS_98({
        key: (item.id),
        label: (item.name),
        value: (item.id),
    }));
    const __VLS_100 = __VLS_99({
        key: (item.id),
        label: (item.name),
        value: (item.id),
    }, ...__VLS_functionalComponentArgsRest(__VLS_99));
}
var __VLS_97;
var __VLS_93;
const __VLS_102 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_103 = __VLS_asFunctionalComponent(__VLS_102, new __VLS_102({
    label: "Cron表达式",
    prop: "cron",
}));
const __VLS_104 = __VLS_103({
    label: "Cron表达式",
    prop: "cron",
}, ...__VLS_functionalComponentArgsRest(__VLS_103));
__VLS_105.slots.default;
const __VLS_106 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_107 = __VLS_asFunctionalComponent(__VLS_106, new __VLS_106({
    modelValue: (__VLS_ctx.form.cron),
    placeholder: "例如：0 0/5 * * * ?",
}));
const __VLS_108 = __VLS_107({
    modelValue: (__VLS_ctx.form.cron),
    placeholder: "例如：0 0/5 * * * ?",
}, ...__VLS_functionalComponentArgsRest(__VLS_107));
var __VLS_105;
const __VLS_110 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_111 = __VLS_asFunctionalComponent(__VLS_110, new __VLS_110({
    label: "收件人",
    prop: "receivers",
}));
const __VLS_112 = __VLS_111({
    label: "收件人",
    prop: "receivers",
}, ...__VLS_functionalComponentArgsRest(__VLS_111));
__VLS_113.slots.default;
const __VLS_114 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_115 = __VLS_asFunctionalComponent(__VLS_114, new __VLS_114({
    modelValue: (__VLS_ctx.form.receivers),
    placeholder: "多个用逗号分隔",
}));
const __VLS_116 = __VLS_115({
    modelValue: (__VLS_ctx.form.receivers),
    placeholder: "多个用逗号分隔",
}, ...__VLS_functionalComponentArgsRest(__VLS_115));
var __VLS_113;
const __VLS_118 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_119 = __VLS_asFunctionalComponent(__VLS_118, new __VLS_118({
    label: "抄送人",
    prop: "ccReceivers",
}));
const __VLS_120 = __VLS_119({
    label: "抄送人",
    prop: "ccReceivers",
}, ...__VLS_functionalComponentArgsRest(__VLS_119));
__VLS_121.slots.default;
const __VLS_122 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_123 = __VLS_asFunctionalComponent(__VLS_122, new __VLS_122({
    modelValue: (__VLS_ctx.form.ccReceivers),
    placeholder: "多个用逗号分隔",
}));
const __VLS_124 = __VLS_123({
    modelValue: (__VLS_ctx.form.ccReceivers),
    placeholder: "多个用逗号分隔",
}, ...__VLS_functionalComponentArgsRest(__VLS_123));
var __VLS_121;
const __VLS_126 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_127 = __VLS_asFunctionalComponent(__VLS_126, new __VLS_126({
    label: "邮件主题",
    prop: "emailSubject",
}));
const __VLS_128 = __VLS_127({
    label: "邮件主题",
    prop: "emailSubject",
}, ...__VLS_functionalComponentArgsRest(__VLS_127));
__VLS_129.slots.default;
const __VLS_130 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_131 = __VLS_asFunctionalComponent(__VLS_130, new __VLS_130({
    modelValue: (__VLS_ctx.form.emailSubject),
    placeholder: "自定义邮件主题",
}));
const __VLS_132 = __VLS_131({
    modelValue: (__VLS_ctx.form.emailSubject),
    placeholder: "自定义邮件主题",
}, ...__VLS_functionalComponentArgsRest(__VLS_131));
var __VLS_129;
const __VLS_134 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_135 = __VLS_asFunctionalComponent(__VLS_134, new __VLS_134({
    label: "邮件正文",
    prop: "emailContent",
}));
const __VLS_136 = __VLS_135({
    label: "邮件正文",
    prop: "emailContent",
}, ...__VLS_functionalComponentArgsRest(__VLS_135));
__VLS_137.slots.default;
const __VLS_138 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_139 = __VLS_asFunctionalComponent(__VLS_138, new __VLS_138({
    modelValue: (__VLS_ctx.form.emailContent),
    type: "textarea",
    rows: (4),
    placeholder: "自定义邮件正文(支持HTML)",
}));
const __VLS_140 = __VLS_139({
    modelValue: (__VLS_ctx.form.emailContent),
    type: "textarea",
    rows: (4),
    placeholder: "自定义邮件正文(支持HTML)",
}, ...__VLS_functionalComponentArgsRest(__VLS_139));
var __VLS_137;
const __VLS_142 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_143 = __VLS_asFunctionalComponent(__VLS_142, new __VLS_142({
    label: "启用状态",
    prop: "status",
}));
const __VLS_144 = __VLS_143({
    label: "启用状态",
    prop: "status",
}, ...__VLS_functionalComponentArgsRest(__VLS_143));
__VLS_145.slots.default;
const __VLS_146 = {}.ElSwitch;
/** @type {[typeof __VLS_components.ElSwitch, typeof __VLS_components.elSwitch, ]} */ ;
// @ts-ignore
const __VLS_147 = __VLS_asFunctionalComponent(__VLS_146, new __VLS_146({
    modelValue: (__VLS_ctx.form.status),
    activeValue: (1),
    inactiveValue: (0),
}));
const __VLS_148 = __VLS_147({
    modelValue: (__VLS_ctx.form.status),
    activeValue: (1),
    inactiveValue: (0),
}, ...__VLS_functionalComponentArgsRest(__VLS_147));
var __VLS_145;
var __VLS_87;
{
    const { footer: __VLS_thisSlot } = __VLS_83.slots;
    const __VLS_150 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_151 = __VLS_asFunctionalComponent(__VLS_150, new __VLS_150({
        ...{ 'onClick': {} },
    }));
    const __VLS_152 = __VLS_151({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_151));
    let __VLS_154;
    let __VLS_155;
    let __VLS_156;
    const __VLS_157 = {
        onClick: (...[$event]) => {
            __VLS_ctx.dialogVisible = false;
        }
    };
    __VLS_153.slots.default;
    var __VLS_153;
    const __VLS_158 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_159 = __VLS_asFunctionalComponent(__VLS_158, new __VLS_158({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.submitLoading),
    }));
    const __VLS_160 = __VLS_159({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.submitLoading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_159));
    let __VLS_162;
    let __VLS_163;
    let __VLS_164;
    const __VLS_165 = {
        onClick: (__VLS_ctx.submitForm)
    };
    __VLS_161.slots.default;
    var __VLS_161;
}
var __VLS_83;
const __VLS_166 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_167 = __VLS_asFunctionalComponent(__VLS_166, new __VLS_166({
    title: "全局 SMTP 配置",
    modelValue: (__VLS_ctx.mailDialogVisible),
    width: "500px",
}));
const __VLS_168 = __VLS_167({
    title: "全局 SMTP 配置",
    modelValue: (__VLS_ctx.mailDialogVisible),
    width: "500px",
}, ...__VLS_functionalComponentArgsRest(__VLS_167));
__VLS_169.slots.default;
const __VLS_170 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_171 = __VLS_asFunctionalComponent(__VLS_170, new __VLS_170({
    model: (__VLS_ctx.mailForm),
    rules: (__VLS_ctx.mailRules),
    ref: "mailFormRef",
    labelWidth: "100px",
}));
const __VLS_172 = __VLS_171({
    model: (__VLS_ctx.mailForm),
    rules: (__VLS_ctx.mailRules),
    ref: "mailFormRef",
    labelWidth: "100px",
}, ...__VLS_functionalComponentArgsRest(__VLS_171));
/** @type {typeof __VLS_ctx.mailFormRef} */ ;
var __VLS_174 = {};
__VLS_173.slots.default;
const __VLS_176 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_177 = __VLS_asFunctionalComponent(__VLS_176, new __VLS_176({
    label: "SMTP 服务器",
    prop: "host",
}));
const __VLS_178 = __VLS_177({
    label: "SMTP 服务器",
    prop: "host",
}, ...__VLS_functionalComponentArgsRest(__VLS_177));
__VLS_179.slots.default;
const __VLS_180 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_181 = __VLS_asFunctionalComponent(__VLS_180, new __VLS_180({
    modelValue: (__VLS_ctx.mailForm.host),
    placeholder: "例如：smtp.qq.com",
}));
const __VLS_182 = __VLS_181({
    modelValue: (__VLS_ctx.mailForm.host),
    placeholder: "例如：smtp.qq.com",
}, ...__VLS_functionalComponentArgsRest(__VLS_181));
var __VLS_179;
const __VLS_184 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_185 = __VLS_asFunctionalComponent(__VLS_184, new __VLS_184({
    label: "端口",
    prop: "port",
}));
const __VLS_186 = __VLS_185({
    label: "端口",
    prop: "port",
}, ...__VLS_functionalComponentArgsRest(__VLS_185));
__VLS_187.slots.default;
const __VLS_188 = {}.ElInputNumber;
/** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
// @ts-ignore
const __VLS_189 = __VLS_asFunctionalComponent(__VLS_188, new __VLS_188({
    modelValue: (__VLS_ctx.mailForm.port),
    min: (1),
    max: (65535),
}));
const __VLS_190 = __VLS_189({
    modelValue: (__VLS_ctx.mailForm.port),
    min: (1),
    max: (65535),
}, ...__VLS_functionalComponentArgsRest(__VLS_189));
var __VLS_187;
const __VLS_192 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_193 = __VLS_asFunctionalComponent(__VLS_192, new __VLS_192({
    label: "用户名",
    prop: "username",
}));
const __VLS_194 = __VLS_193({
    label: "用户名",
    prop: "username",
}, ...__VLS_functionalComponentArgsRest(__VLS_193));
__VLS_195.slots.default;
const __VLS_196 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_197 = __VLS_asFunctionalComponent(__VLS_196, new __VLS_196({
    modelValue: (__VLS_ctx.mailForm.username),
    placeholder: "发件人邮箱账号",
}));
const __VLS_198 = __VLS_197({
    modelValue: (__VLS_ctx.mailForm.username),
    placeholder: "发件人邮箱账号",
}, ...__VLS_functionalComponentArgsRest(__VLS_197));
var __VLS_195;
const __VLS_200 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_201 = __VLS_asFunctionalComponent(__VLS_200, new __VLS_200({
    label: "密码/授权码",
    prop: "password",
}));
const __VLS_202 = __VLS_201({
    label: "密码/授权码",
    prop: "password",
}, ...__VLS_functionalComponentArgsRest(__VLS_201));
__VLS_203.slots.default;
const __VLS_204 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_205 = __VLS_asFunctionalComponent(__VLS_204, new __VLS_204({
    modelValue: (__VLS_ctx.mailForm.password),
    type: "password",
    showPassword: true,
}));
const __VLS_206 = __VLS_205({
    modelValue: (__VLS_ctx.mailForm.password),
    type: "password",
    showPassword: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_205));
var __VLS_203;
const __VLS_208 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_209 = __VLS_asFunctionalComponent(__VLS_208, new __VLS_208({
    label: "协议",
    prop: "protocol",
}));
const __VLS_210 = __VLS_209({
    label: "协议",
    prop: "protocol",
}, ...__VLS_functionalComponentArgsRest(__VLS_209));
__VLS_211.slots.default;
const __VLS_212 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_213 = __VLS_asFunctionalComponent(__VLS_212, new __VLS_212({
    modelValue: (__VLS_ctx.mailForm.protocol),
    placeholder: "smtp",
}));
const __VLS_214 = __VLS_213({
    modelValue: (__VLS_ctx.mailForm.protocol),
    placeholder: "smtp",
}, ...__VLS_functionalComponentArgsRest(__VLS_213));
var __VLS_211;
var __VLS_173;
{
    const { footer: __VLS_thisSlot } = __VLS_169.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex justify-between" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    const __VLS_216 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_217 = __VLS_asFunctionalComponent(__VLS_216, new __VLS_216({
        ...{ 'onClick': {} },
        type: "success",
        loading: (__VLS_ctx.testLoading),
    }));
    const __VLS_218 = __VLS_217({
        ...{ 'onClick': {} },
        type: "success",
        loading: (__VLS_ctx.testLoading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_217));
    let __VLS_220;
    let __VLS_221;
    let __VLS_222;
    const __VLS_223 = {
        onClick: (__VLS_ctx.testMail)
    };
    __VLS_219.slots.default;
    var __VLS_219;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    const __VLS_224 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_225 = __VLS_asFunctionalComponent(__VLS_224, new __VLS_224({
        ...{ 'onClick': {} },
    }));
    const __VLS_226 = __VLS_225({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_225));
    let __VLS_228;
    let __VLS_229;
    let __VLS_230;
    const __VLS_231 = {
        onClick: (...[$event]) => {
            __VLS_ctx.mailDialogVisible = false;
        }
    };
    __VLS_227.slots.default;
    var __VLS_227;
    const __VLS_232 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_233 = __VLS_asFunctionalComponent(__VLS_232, new __VLS_232({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.mailSubmitLoading),
    }));
    const __VLS_234 = __VLS_233({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.mailSubmitLoading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_233));
    let __VLS_236;
    let __VLS_237;
    let __VLS_238;
    const __VLS_239 = {
        onClick: (__VLS_ctx.submitMailForm)
    };
    __VLS_235.slots.default;
    var __VLS_235;
}
var __VLS_169;
/** @type {__VLS_StyleScopedClasses['h-full']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
// @ts-ignore
var __VLS_89 = __VLS_88, __VLS_175 = __VLS_174;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            loading: loading,
            tableData: tableData,
            reports: reports,
            dialogVisible: dialogVisible,
            dialogTitle: dialogTitle,
            submitLoading: submitLoading,
            formRef: formRef,
            form: form,
            mailDialogVisible: mailDialogVisible,
            mailFormRef: mailFormRef,
            mailForm: mailForm,
            mailSubmitLoading: mailSubmitLoading,
            testLoading: testLoading,
            rules: rules,
            mailRules: mailRules,
            handleCreate: handleCreate,
            handleEdit: handleEdit,
            handleStatusChange: handleStatusChange,
            handleDelete: handleDelete,
            handleExecute: handleExecute,
            submitForm: submitForm,
            handleMailConfig: handleMailConfig,
            submitMailForm: submitMailForm,
            testMail: testMail,
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