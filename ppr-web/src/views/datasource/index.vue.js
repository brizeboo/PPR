import { onMounted, reactive, ref, computed } from 'vue';
import { ElMessage } from 'element-plus';
import { deleteDatasource, listDatasources, saveDatasource, testDatasource } from '@/api/datasource';
const list = ref([]);
const drawerOpen = ref(false);
const formRef = ref();
const form = reactive({
    id: '',
    name: '',
    type: 'MySQL',
    jdbcUrl: '',
    username: '',
    password: '',
});
const rules = {
    name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
    type: [{ required: true, message: '请选择类型', trigger: 'change' }],
    jdbcUrl: [{ required: true, message: '请输入 JDBC URL', trigger: 'blur' }],
};
const drawerTitle = computed(() => (form.id ? '编辑数据源' : '新增数据源'));
async function reload() {
    const { data } = await listDatasources();
    list.value = data;
}
function openCreate() {
    form.id = '';
    form.name = '';
    form.type = 'MySQL';
    form.jdbcUrl = '';
    form.username = '';
    form.password = '';
    drawerOpen.value = true;
}
function openEdit(row) {
    form.id = row.id;
    form.name = row.name;
    form.type = row.type;
    form.jdbcUrl = row.jdbcUrl;
    form.username = row.username || '';
    form.password = row.password || '';
    drawerOpen.value = true;
}
async function onSave() {
    const ok = await formRef.value?.validate().catch(() => false);
    if (!ok)
        return;
    await saveDatasource(form);
    ElMessage.success('保存成功');
    drawerOpen.value = false;
    await reload();
}
async function onDelete(id) {
    await deleteDatasource(id);
    ElMessage.success('删除成功');
    await reload();
}
async function onTestRow(row) {
    const { data } = await testDatasource({ jdbcUrl: row.jdbcUrl, username: row.username, password: row.password });
    data.success ? ElMessage.success('连接成功') : ElMessage.error('连接失败');
}
async function onTestForm() {
    const ok = await formRef.value?.validate().catch(() => false);
    if (!ok)
        return;
    const { data } = await testDatasource({ jdbcUrl: String(form.jdbcUrl), username: form.username, password: form.password });
    data.success ? ElMessage.success('连接成功') : ElMessage.error('连接失败');
}
onMounted(() => {
    reload();
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex items-center justify-between mb-3" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "text-lg font-600" },
});
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
    onClick: (__VLS_ctx.openCreate)
};
__VLS_3.slots.default;
var __VLS_3;
const __VLS_8 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
    data: (__VLS_ctx.list),
    border: true,
    height: "calc(100vh - 180px)",
}));
const __VLS_10 = __VLS_9({
    data: (__VLS_ctx.list),
    border: true,
    height: "calc(100vh - 180px)",
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
__VLS_11.slots.default;
const __VLS_12 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
    prop: "name",
    label: "名称",
    width: "180",
}));
const __VLS_14 = __VLS_13({
    prop: "name",
    label: "名称",
    width: "180",
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
const __VLS_16 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
    prop: "type",
    label: "类型",
    width: "120",
}));
const __VLS_18 = __VLS_17({
    prop: "type",
    label: "类型",
    width: "120",
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
const __VLS_20 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
    prop: "jdbcUrl",
    label: "JDBC URL",
    minWidth: "360",
    showOverflowTooltip: true,
}));
const __VLS_22 = __VLS_21({
    prop: "jdbcUrl",
    label: "JDBC URL",
    minWidth: "360",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
const __VLS_24 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
    prop: "username",
    label: "账号",
    width: "160",
}));
const __VLS_26 = __VLS_25({
    prop: "username",
    label: "账号",
    width: "160",
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
const __VLS_28 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
    label: "操作",
    width: "260",
    fixed: "right",
}));
const __VLS_30 = __VLS_29({
    label: "操作",
    width: "260",
    fixed: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_29));
__VLS_31.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_31.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_32 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
        ...{ 'onClick': {} },
        size: "small",
    }));
    const __VLS_34 = __VLS_33({
        ...{ 'onClick': {} },
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_33));
    let __VLS_36;
    let __VLS_37;
    let __VLS_38;
    const __VLS_39 = {
        onClick: (...[$event]) => {
            __VLS_ctx.openEdit(row);
        }
    };
    __VLS_35.slots.default;
    var __VLS_35;
    const __VLS_40 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
        ...{ 'onClick': {} },
        size: "small",
    }));
    const __VLS_42 = __VLS_41({
        ...{ 'onClick': {} },
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_41));
    let __VLS_44;
    let __VLS_45;
    let __VLS_46;
    const __VLS_47 = {
        onClick: (...[$event]) => {
            __VLS_ctx.onTestRow(row);
        }
    };
    __VLS_43.slots.default;
    var __VLS_43;
    const __VLS_48 = {}.ElPopconfirm;
    /** @type {[typeof __VLS_components.ElPopconfirm, typeof __VLS_components.elPopconfirm, typeof __VLS_components.ElPopconfirm, typeof __VLS_components.elPopconfirm, ]} */ ;
    // @ts-ignore
    const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
        ...{ 'onConfirm': {} },
        title: "确认删除该数据源？",
    }));
    const __VLS_50 = __VLS_49({
        ...{ 'onConfirm': {} },
        title: "确认删除该数据源？",
    }, ...__VLS_functionalComponentArgsRest(__VLS_49));
    let __VLS_52;
    let __VLS_53;
    let __VLS_54;
    const __VLS_55 = {
        onConfirm: (...[$event]) => {
            __VLS_ctx.onDelete(row.id);
        }
    };
    __VLS_51.slots.default;
    {
        const { reference: __VLS_thisSlot } = __VLS_51.slots;
        const __VLS_56 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
            size: "small",
            type: "danger",
        }));
        const __VLS_58 = __VLS_57({
            size: "small",
            type: "danger",
        }, ...__VLS_functionalComponentArgsRest(__VLS_57));
        __VLS_59.slots.default;
        var __VLS_59;
    }
    var __VLS_51;
}
var __VLS_31;
var __VLS_11;
const __VLS_60 = {}.ElDrawer;
/** @type {[typeof __VLS_components.ElDrawer, typeof __VLS_components.elDrawer, typeof __VLS_components.ElDrawer, typeof __VLS_components.elDrawer, ]} */ ;
// @ts-ignore
const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
    modelValue: (__VLS_ctx.drawerOpen),
    title: (__VLS_ctx.drawerTitle),
    size: "520px",
    destroyOnClose: true,
}));
const __VLS_62 = __VLS_61({
    modelValue: (__VLS_ctx.drawerOpen),
    title: (__VLS_ctx.drawerTitle),
    size: "520px",
    destroyOnClose: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_61));
__VLS_63.slots.default;
const __VLS_64 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
    ref: "formRef",
    model: (__VLS_ctx.form),
    rules: (__VLS_ctx.rules),
    labelWidth: "90px",
}));
const __VLS_66 = __VLS_65({
    ref: "formRef",
    model: (__VLS_ctx.form),
    rules: (__VLS_ctx.rules),
    labelWidth: "90px",
}, ...__VLS_functionalComponentArgsRest(__VLS_65));
/** @type {typeof __VLS_ctx.formRef} */ ;
var __VLS_68 = {};
__VLS_67.slots.default;
const __VLS_70 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_71 = __VLS_asFunctionalComponent(__VLS_70, new __VLS_70({
    label: "名称",
    prop: "name",
}));
const __VLS_72 = __VLS_71({
    label: "名称",
    prop: "name",
}, ...__VLS_functionalComponentArgsRest(__VLS_71));
__VLS_73.slots.default;
const __VLS_74 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_75 = __VLS_asFunctionalComponent(__VLS_74, new __VLS_74({
    modelValue: (__VLS_ctx.form.name),
}));
const __VLS_76 = __VLS_75({
    modelValue: (__VLS_ctx.form.name),
}, ...__VLS_functionalComponentArgsRest(__VLS_75));
var __VLS_73;
const __VLS_78 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_79 = __VLS_asFunctionalComponent(__VLS_78, new __VLS_78({
    label: "类型",
    prop: "type",
}));
const __VLS_80 = __VLS_79({
    label: "类型",
    prop: "type",
}, ...__VLS_functionalComponentArgsRest(__VLS_79));
__VLS_81.slots.default;
const __VLS_82 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_83 = __VLS_asFunctionalComponent(__VLS_82, new __VLS_82({
    modelValue: (__VLS_ctx.form.type),
    ...{ class: "w-full" },
}));
const __VLS_84 = __VLS_83({
    modelValue: (__VLS_ctx.form.type),
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_83));
__VLS_85.slots.default;
const __VLS_86 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_87 = __VLS_asFunctionalComponent(__VLS_86, new __VLS_86({
    label: "MySQL",
    value: "MySQL",
}));
const __VLS_88 = __VLS_87({
    label: "MySQL",
    value: "MySQL",
}, ...__VLS_functionalComponentArgsRest(__VLS_87));
const __VLS_90 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_91 = __VLS_asFunctionalComponent(__VLS_90, new __VLS_90({
    label: "PostgreSQL",
    value: "PostgreSQL",
}));
const __VLS_92 = __VLS_91({
    label: "PostgreSQL",
    value: "PostgreSQL",
}, ...__VLS_functionalComponentArgsRest(__VLS_91));
const __VLS_94 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_95 = __VLS_asFunctionalComponent(__VLS_94, new __VLS_94({
    label: "SQLServer",
    value: "SQLServer",
}));
const __VLS_96 = __VLS_95({
    label: "SQLServer",
    value: "SQLServer",
}, ...__VLS_functionalComponentArgsRest(__VLS_95));
const __VLS_98 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_99 = __VLS_asFunctionalComponent(__VLS_98, new __VLS_98({
    label: "SQLite",
    value: "SQLite",
}));
const __VLS_100 = __VLS_99({
    label: "SQLite",
    value: "SQLite",
}, ...__VLS_functionalComponentArgsRest(__VLS_99));
var __VLS_85;
var __VLS_81;
const __VLS_102 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_103 = __VLS_asFunctionalComponent(__VLS_102, new __VLS_102({
    label: "JDBC URL",
    prop: "jdbcUrl",
}));
const __VLS_104 = __VLS_103({
    label: "JDBC URL",
    prop: "jdbcUrl",
}, ...__VLS_functionalComponentArgsRest(__VLS_103));
__VLS_105.slots.default;
const __VLS_106 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_107 = __VLS_asFunctionalComponent(__VLS_106, new __VLS_106({
    modelValue: (__VLS_ctx.form.jdbcUrl),
}));
const __VLS_108 = __VLS_107({
    modelValue: (__VLS_ctx.form.jdbcUrl),
}, ...__VLS_functionalComponentArgsRest(__VLS_107));
var __VLS_105;
const __VLS_110 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_111 = __VLS_asFunctionalComponent(__VLS_110, new __VLS_110({
    label: "账号",
}));
const __VLS_112 = __VLS_111({
    label: "账号",
}, ...__VLS_functionalComponentArgsRest(__VLS_111));
__VLS_113.slots.default;
const __VLS_114 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_115 = __VLS_asFunctionalComponent(__VLS_114, new __VLS_114({
    modelValue: (__VLS_ctx.form.username),
}));
const __VLS_116 = __VLS_115({
    modelValue: (__VLS_ctx.form.username),
}, ...__VLS_functionalComponentArgsRest(__VLS_115));
var __VLS_113;
const __VLS_118 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_119 = __VLS_asFunctionalComponent(__VLS_118, new __VLS_118({
    label: "密码",
}));
const __VLS_120 = __VLS_119({
    label: "密码",
}, ...__VLS_functionalComponentArgsRest(__VLS_119));
__VLS_121.slots.default;
const __VLS_122 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_123 = __VLS_asFunctionalComponent(__VLS_122, new __VLS_122({
    modelValue: (__VLS_ctx.form.password),
    type: "password",
    showPassword: true,
}));
const __VLS_124 = __VLS_123({
    modelValue: (__VLS_ctx.form.password),
    type: "password",
    showPassword: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_123));
var __VLS_121;
var __VLS_67;
{
    const { footer: __VLS_thisSlot } = __VLS_63.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex justify-between w-full" },
    });
    const __VLS_126 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_127 = __VLS_asFunctionalComponent(__VLS_126, new __VLS_126({
        ...{ 'onClick': {} },
    }));
    const __VLS_128 = __VLS_127({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_127));
    let __VLS_130;
    let __VLS_131;
    let __VLS_132;
    const __VLS_133 = {
        onClick: (__VLS_ctx.onTestForm)
    };
    __VLS_129.slots.default;
    var __VLS_129;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex gap-2" },
    });
    const __VLS_134 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_135 = __VLS_asFunctionalComponent(__VLS_134, new __VLS_134({
        ...{ 'onClick': {} },
    }));
    const __VLS_136 = __VLS_135({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_135));
    let __VLS_138;
    let __VLS_139;
    let __VLS_140;
    const __VLS_141 = {
        onClick: (...[$event]) => {
            __VLS_ctx.drawerOpen = false;
        }
    };
    __VLS_137.slots.default;
    var __VLS_137;
    const __VLS_142 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_143 = __VLS_asFunctionalComponent(__VLS_142, new __VLS_142({
        ...{ 'onClick': {} },
        type: "primary",
    }));
    const __VLS_144 = __VLS_143({
        ...{ 'onClick': {} },
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_143));
    let __VLS_146;
    let __VLS_147;
    let __VLS_148;
    const __VLS_149 = {
        onClick: (__VLS_ctx.onSave)
    };
    __VLS_145.slots.default;
    var __VLS_145;
}
var __VLS_63;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-600']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
// @ts-ignore
var __VLS_69 = __VLS_68;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            list: list,
            drawerOpen: drawerOpen,
            formRef: formRef,
            form: form,
            rules: rules,
            drawerTitle: drawerTitle,
            openCreate: openCreate,
            openEdit: openEdit,
            onSave: onSave,
            onDelete: onDelete,
            onTestRow: onTestRow,
            onTestForm: onTestForm,
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