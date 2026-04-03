import { onMounted, reactive, ref, computed } from 'vue';
import { ElMessage } from 'element-plus';
import { deleteDatasource, listDatasources, saveDatasource, testDatasource } from '@/api/datasource';
// 数据源列表数据
const list = ref([]);
// 控制抽屉开关
const drawerOpen = ref(false);
// 表单引用
const formRef = ref();
// 表单响应式数据
const form = reactive({
    id: '',
    name: '',
    type: 'MySQL',
    jdbcUrl: '',
    username: '',
    password: '',
});
// 表单验证规则
const rules = {
    name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
    type: [{ required: true, message: '请选择类型', trigger: 'change' }],
    jdbcUrl: [{ required: true, message: '请输入 JDBC URL', trigger: 'blur' }],
};
// 抽屉标题，根据是否存在 id 判断是编辑还是新增
const drawerTitle = computed(() => (form.id ? '编辑数据源' : '新增数据源'));
/**
 * 重新加载数据源列表
 */
async function reload() {
    const { data } = await listDatasources();
    list.value = data;
}
/**
 * 打开新增数据源抽屉
 */
function openCreate() {
    form.id = '';
    form.name = '';
    form.type = 'MySQL';
    form.jdbcUrl = '';
    form.username = '';
    form.password = '';
    drawerOpen.value = true;
}
/**
 * 打开编辑数据源抽屉
 * @param row 当前选中的数据源对象
 */
function openEdit(row) {
    form.id = row.id;
    form.name = row.name;
    form.type = row.type;
    form.jdbcUrl = row.jdbcUrl;
    form.username = row.username || '';
    form.password = row.password || '';
    drawerOpen.value = true;
}
/**
 * 保存数据源信息
 */
async function onSave() {
    const ok = await formRef.value?.validate().catch(() => false);
    if (!ok)
        return;
    await saveDatasource(form);
    ElMessage.success('保存成功');
    drawerOpen.value = false;
    await reload();
}
/**
 * 删除数据源
 * @param id 数据源ID
 */
async function onDelete(id) {
    await deleteDatasource(id);
    ElMessage.success('删除成功');
    await reload();
}
/**
 * 测试表格中某行数据源的连接
 * @param row 数据源对象
 */
async function onTestRow(row) {
    const { data } = await testDatasource({ jdbcUrl: row.jdbcUrl, username: row.username, password: row.password });
    data.success ? ElMessage.success('连接成功') : ElMessage.error('连接失败');
}
/**
 * 测试表单中数据源的连接
 */
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
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "ds-header" },
});
/** @type {__VLS_StyleScopedClasses['ds-header']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "ds-title" },
});
/** @type {__VLS_StyleScopedClasses['ds-title']} */ ;
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
    { onClick: (__VLS_ctx.openCreate) });
const { default: __VLS_7 } = __VLS_3.slots;
// @ts-ignore
[openCreate,];
var __VLS_3;
var __VLS_4;
let __VLS_8;
/** @ts-ignore @type {typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components.elTable | typeof __VLS_components.ElTable} */
elTable;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent1(__VLS_8, new __VLS_8({
    data: (__VLS_ctx.list),
    border: true,
    height: "calc(100vh - 180px)",
}));
const __VLS_10 = __VLS_9({
    data: (__VLS_ctx.list),
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
    label: "名称",
    width: "180",
}));
const __VLS_16 = __VLS_15({
    prop: "name",
    label: "名称",
    width: "180",
}, ...__VLS_functionalComponentArgsRest(__VLS_15));
let __VLS_19;
/** @ts-ignore @type {typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn} */
elTableColumn;
// @ts-ignore
const __VLS_20 = __VLS_asFunctionalComponent1(__VLS_19, new __VLS_19({
    prop: "type",
    label: "类型",
    width: "120",
}));
const __VLS_21 = __VLS_20({
    prop: "type",
    label: "类型",
    width: "120",
}, ...__VLS_functionalComponentArgsRest(__VLS_20));
let __VLS_24;
/** @ts-ignore @type {typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn} */
elTableColumn;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent1(__VLS_24, new __VLS_24({
    prop: "jdbcUrl",
    label: "JDBC URL",
    minWidth: "360",
    showOverflowTooltip: true,
}));
const __VLS_26 = __VLS_25({
    prop: "jdbcUrl",
    label: "JDBC URL",
    minWidth: "360",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
let __VLS_29;
/** @ts-ignore @type {typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn} */
elTableColumn;
// @ts-ignore
const __VLS_30 = __VLS_asFunctionalComponent1(__VLS_29, new __VLS_29({
    prop: "username",
    label: "账号",
    width: "160",
}));
const __VLS_31 = __VLS_30({
    prop: "username",
    label: "账号",
    width: "160",
}, ...__VLS_functionalComponentArgsRest(__VLS_30));
let __VLS_34;
/** @ts-ignore @type {typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn} */
elTableColumn;
// @ts-ignore
const __VLS_35 = __VLS_asFunctionalComponent1(__VLS_34, new __VLS_34({
    label: "操作",
    width: "260",
    fixed: "right",
}));
const __VLS_36 = __VLS_35({
    label: "操作",
    width: "260",
    fixed: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_35));
const { default: __VLS_39 } = __VLS_37.slots;
{
    const { default: __VLS_40 } = __VLS_37.slots;
    const [{ row }] = __VLS_vSlot(__VLS_40);
    let __VLS_41;
    /** @ts-ignore @type {typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components.elButton | typeof __VLS_components.ElButton} */
    elButton;
    // @ts-ignore
    const __VLS_42 = __VLS_asFunctionalComponent1(__VLS_41, new __VLS_41({
        ...{ 'onClick': {} },
        size: "small",
    }));
    const __VLS_43 = __VLS_42({
        ...{ 'onClick': {} },
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_42));
    let __VLS_46;
    const __VLS_47 = ({ click: {} },
        { onClick: (...[$event]) => {
                __VLS_ctx.openEdit(row);
                // @ts-ignore
                [list, openEdit,];
            } });
    const { default: __VLS_48 } = __VLS_44.slots;
    // @ts-ignore
    [];
    var __VLS_44;
    var __VLS_45;
    let __VLS_49;
    /** @ts-ignore @type {typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components.elButton | typeof __VLS_components.ElButton} */
    elButton;
    // @ts-ignore
    const __VLS_50 = __VLS_asFunctionalComponent1(__VLS_49, new __VLS_49({
        ...{ 'onClick': {} },
        size: "small",
    }));
    const __VLS_51 = __VLS_50({
        ...{ 'onClick': {} },
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_50));
    let __VLS_54;
    const __VLS_55 = ({ click: {} },
        { onClick: (...[$event]) => {
                __VLS_ctx.onTestRow(row);
                // @ts-ignore
                [onTestRow,];
            } });
    const { default: __VLS_56 } = __VLS_52.slots;
    // @ts-ignore
    [];
    var __VLS_52;
    var __VLS_53;
    let __VLS_57;
    /** @ts-ignore @type {typeof __VLS_components.elPopconfirm | typeof __VLS_components.ElPopconfirm | typeof __VLS_components.elPopconfirm | typeof __VLS_components.ElPopconfirm} */
    elPopconfirm;
    // @ts-ignore
    const __VLS_58 = __VLS_asFunctionalComponent1(__VLS_57, new __VLS_57({
        ...{ 'onConfirm': {} },
        title: "确认删除该数据源？",
    }));
    const __VLS_59 = __VLS_58({
        ...{ 'onConfirm': {} },
        title: "确认删除该数据源？",
    }, ...__VLS_functionalComponentArgsRest(__VLS_58));
    let __VLS_62;
    const __VLS_63 = ({ confirm: {} },
        { onConfirm: (...[$event]) => {
                __VLS_ctx.onDelete(row.id);
                // @ts-ignore
                [onDelete,];
            } });
    const { default: __VLS_64 } = __VLS_60.slots;
    {
        const { reference: __VLS_65 } = __VLS_60.slots;
        let __VLS_66;
        /** @ts-ignore @type {typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components.elButton | typeof __VLS_components.ElButton} */
        elButton;
        // @ts-ignore
        const __VLS_67 = __VLS_asFunctionalComponent1(__VLS_66, new __VLS_66({
            size: "small",
            type: "danger",
        }));
        const __VLS_68 = __VLS_67({
            size: "small",
            type: "danger",
        }, ...__VLS_functionalComponentArgsRest(__VLS_67));
        const { default: __VLS_71 } = __VLS_69.slots;
        // @ts-ignore
        [];
        var __VLS_69;
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
    var __VLS_60;
    var __VLS_61;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_37;
// @ts-ignore
[];
var __VLS_11;
let __VLS_72;
/** @ts-ignore @type {typeof __VLS_components.elDrawer | typeof __VLS_components.ElDrawer | typeof __VLS_components.elDrawer | typeof __VLS_components.ElDrawer} */
elDrawer;
// @ts-ignore
const __VLS_73 = __VLS_asFunctionalComponent1(__VLS_72, new __VLS_72({
    modelValue: (__VLS_ctx.drawerOpen),
    title: (__VLS_ctx.drawerTitle),
    size: "520px",
    destroyOnClose: true,
}));
const __VLS_74 = __VLS_73({
    modelValue: (__VLS_ctx.drawerOpen),
    title: (__VLS_ctx.drawerTitle),
    size: "520px",
    destroyOnClose: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_73));
const { default: __VLS_77 } = __VLS_75.slots;
let __VLS_78;
/** @ts-ignore @type {typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components.elForm | typeof __VLS_components.ElForm} */
elForm;
// @ts-ignore
const __VLS_79 = __VLS_asFunctionalComponent1(__VLS_78, new __VLS_78({
    ref: "formRef",
    model: (__VLS_ctx.form),
    rules: (__VLS_ctx.rules),
    labelWidth: "90px",
}));
const __VLS_80 = __VLS_79({
    ref: "formRef",
    model: (__VLS_ctx.form),
    rules: (__VLS_ctx.rules),
    labelWidth: "90px",
}, ...__VLS_functionalComponentArgsRest(__VLS_79));
var __VLS_83 = {};
const { default: __VLS_85 } = __VLS_81.slots;
let __VLS_86;
/** @ts-ignore @type {typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem} */
elFormItem;
// @ts-ignore
const __VLS_87 = __VLS_asFunctionalComponent1(__VLS_86, new __VLS_86({
    label: "名称",
    prop: "name",
}));
const __VLS_88 = __VLS_87({
    label: "名称",
    prop: "name",
}, ...__VLS_functionalComponentArgsRest(__VLS_87));
const { default: __VLS_91 } = __VLS_89.slots;
let __VLS_92;
/** @ts-ignore @type {typeof __VLS_components.elInput | typeof __VLS_components.ElInput} */
elInput;
// @ts-ignore
const __VLS_93 = __VLS_asFunctionalComponent1(__VLS_92, new __VLS_92({
    modelValue: (__VLS_ctx.form.name),
}));
const __VLS_94 = __VLS_93({
    modelValue: (__VLS_ctx.form.name),
}, ...__VLS_functionalComponentArgsRest(__VLS_93));
// @ts-ignore
[drawerOpen, drawerTitle, form, form, rules,];
var __VLS_89;
let __VLS_97;
/** @ts-ignore @type {typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem} */
elFormItem;
// @ts-ignore
const __VLS_98 = __VLS_asFunctionalComponent1(__VLS_97, new __VLS_97({
    label: "类型",
    prop: "type",
}));
const __VLS_99 = __VLS_98({
    label: "类型",
    prop: "type",
}, ...__VLS_functionalComponentArgsRest(__VLS_98));
const { default: __VLS_102 } = __VLS_100.slots;
let __VLS_103;
/** @ts-ignore @type {typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect} */
elSelect;
// @ts-ignore
const __VLS_104 = __VLS_asFunctionalComponent1(__VLS_103, new __VLS_103({
    modelValue: (__VLS_ctx.form.type),
    ...{ class: "ds-select-full" },
}));
const __VLS_105 = __VLS_104({
    modelValue: (__VLS_ctx.form.type),
    ...{ class: "ds-select-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_104));
/** @type {__VLS_StyleScopedClasses['ds-select-full']} */ ;
const { default: __VLS_108 } = __VLS_106.slots;
let __VLS_109;
/** @ts-ignore @type {typeof __VLS_components.elOption | typeof __VLS_components.ElOption} */
elOption;
// @ts-ignore
const __VLS_110 = __VLS_asFunctionalComponent1(__VLS_109, new __VLS_109({
    label: "MySQL",
    value: "MySQL",
}));
const __VLS_111 = __VLS_110({
    label: "MySQL",
    value: "MySQL",
}, ...__VLS_functionalComponentArgsRest(__VLS_110));
let __VLS_114;
/** @ts-ignore @type {typeof __VLS_components.elOption | typeof __VLS_components.ElOption} */
elOption;
// @ts-ignore
const __VLS_115 = __VLS_asFunctionalComponent1(__VLS_114, new __VLS_114({
    label: "PostgreSQL",
    value: "PostgreSQL",
}));
const __VLS_116 = __VLS_115({
    label: "PostgreSQL",
    value: "PostgreSQL",
}, ...__VLS_functionalComponentArgsRest(__VLS_115));
let __VLS_119;
/** @ts-ignore @type {typeof __VLS_components.elOption | typeof __VLS_components.ElOption} */
elOption;
// @ts-ignore
const __VLS_120 = __VLS_asFunctionalComponent1(__VLS_119, new __VLS_119({
    label: "SQLServer",
    value: "SQLServer",
}));
const __VLS_121 = __VLS_120({
    label: "SQLServer",
    value: "SQLServer",
}, ...__VLS_functionalComponentArgsRest(__VLS_120));
let __VLS_124;
/** @ts-ignore @type {typeof __VLS_components.elOption | typeof __VLS_components.ElOption} */
elOption;
// @ts-ignore
const __VLS_125 = __VLS_asFunctionalComponent1(__VLS_124, new __VLS_124({
    label: "SQLite",
    value: "SQLite",
}));
const __VLS_126 = __VLS_125({
    label: "SQLite",
    value: "SQLite",
}, ...__VLS_functionalComponentArgsRest(__VLS_125));
// @ts-ignore
[form,];
var __VLS_106;
// @ts-ignore
[];
var __VLS_100;
let __VLS_129;
/** @ts-ignore @type {typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem} */
elFormItem;
// @ts-ignore
const __VLS_130 = __VLS_asFunctionalComponent1(__VLS_129, new __VLS_129({
    label: "JDBC URL",
    prop: "jdbcUrl",
}));
const __VLS_131 = __VLS_130({
    label: "JDBC URL",
    prop: "jdbcUrl",
}, ...__VLS_functionalComponentArgsRest(__VLS_130));
const { default: __VLS_134 } = __VLS_132.slots;
let __VLS_135;
/** @ts-ignore @type {typeof __VLS_components.elInput | typeof __VLS_components.ElInput} */
elInput;
// @ts-ignore
const __VLS_136 = __VLS_asFunctionalComponent1(__VLS_135, new __VLS_135({
    modelValue: (__VLS_ctx.form.jdbcUrl),
}));
const __VLS_137 = __VLS_136({
    modelValue: (__VLS_ctx.form.jdbcUrl),
}, ...__VLS_functionalComponentArgsRest(__VLS_136));
// @ts-ignore
[form,];
var __VLS_132;
let __VLS_140;
/** @ts-ignore @type {typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem} */
elFormItem;
// @ts-ignore
const __VLS_141 = __VLS_asFunctionalComponent1(__VLS_140, new __VLS_140({
    label: "账号",
}));
const __VLS_142 = __VLS_141({
    label: "账号",
}, ...__VLS_functionalComponentArgsRest(__VLS_141));
const { default: __VLS_145 } = __VLS_143.slots;
let __VLS_146;
/** @ts-ignore @type {typeof __VLS_components.elInput | typeof __VLS_components.ElInput} */
elInput;
// @ts-ignore
const __VLS_147 = __VLS_asFunctionalComponent1(__VLS_146, new __VLS_146({
    modelValue: (__VLS_ctx.form.username),
}));
const __VLS_148 = __VLS_147({
    modelValue: (__VLS_ctx.form.username),
}, ...__VLS_functionalComponentArgsRest(__VLS_147));
// @ts-ignore
[form,];
var __VLS_143;
let __VLS_151;
/** @ts-ignore @type {typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem} */
elFormItem;
// @ts-ignore
const __VLS_152 = __VLS_asFunctionalComponent1(__VLS_151, new __VLS_151({
    label: "密码",
}));
const __VLS_153 = __VLS_152({
    label: "密码",
}, ...__VLS_functionalComponentArgsRest(__VLS_152));
const { default: __VLS_156 } = __VLS_154.slots;
let __VLS_157;
/** @ts-ignore @type {typeof __VLS_components.elInput | typeof __VLS_components.ElInput} */
elInput;
// @ts-ignore
const __VLS_158 = __VLS_asFunctionalComponent1(__VLS_157, new __VLS_157({
    modelValue: (__VLS_ctx.form.password),
    type: "password",
    showPassword: true,
}));
const __VLS_159 = __VLS_158({
    modelValue: (__VLS_ctx.form.password),
    type: "password",
    showPassword: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_158));
// @ts-ignore
[form,];
var __VLS_154;
// @ts-ignore
[];
var __VLS_81;
{
    const { footer: __VLS_162 } = __VLS_75.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "ds-drawer-footer" },
    });
    /** @type {__VLS_StyleScopedClasses['ds-drawer-footer']} */ ;
    let __VLS_163;
    /** @ts-ignore @type {typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components.elButton | typeof __VLS_components.ElButton} */
    elButton;
    // @ts-ignore
    const __VLS_164 = __VLS_asFunctionalComponent1(__VLS_163, new __VLS_163({
        ...{ 'onClick': {} },
    }));
    const __VLS_165 = __VLS_164({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_164));
    let __VLS_168;
    const __VLS_169 = ({ click: {} },
        { onClick: (__VLS_ctx.onTestForm) });
    const { default: __VLS_170 } = __VLS_166.slots;
    // @ts-ignore
    [onTestForm,];
    var __VLS_166;
    var __VLS_167;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "ds-drawer-actions" },
    });
    /** @type {__VLS_StyleScopedClasses['ds-drawer-actions']} */ ;
    let __VLS_171;
    /** @ts-ignore @type {typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components.elButton | typeof __VLS_components.ElButton} */
    elButton;
    // @ts-ignore
    const __VLS_172 = __VLS_asFunctionalComponent1(__VLS_171, new __VLS_171({
        ...{ 'onClick': {} },
    }));
    const __VLS_173 = __VLS_172({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_172));
    let __VLS_176;
    const __VLS_177 = ({ click: {} },
        { onClick: (...[$event]) => {
                __VLS_ctx.drawerOpen = false;
                // @ts-ignore
                [drawerOpen,];
            } });
    const { default: __VLS_178 } = __VLS_174.slots;
    // @ts-ignore
    [];
    var __VLS_174;
    var __VLS_175;
    let __VLS_179;
    /** @ts-ignore @type {typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components.elButton | typeof __VLS_components.ElButton} */
    elButton;
    // @ts-ignore
    const __VLS_180 = __VLS_asFunctionalComponent1(__VLS_179, new __VLS_179({
        ...{ 'onClick': {} },
        type: "primary",
    }));
    const __VLS_181 = __VLS_180({
        ...{ 'onClick': {} },
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_180));
    let __VLS_184;
    const __VLS_185 = ({ click: {} },
        { onClick: (__VLS_ctx.onSave) });
    const { default: __VLS_186 } = __VLS_182.slots;
    // @ts-ignore
    [onSave,];
    var __VLS_182;
    var __VLS_183;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_75;
// @ts-ignore
var __VLS_84 = __VLS_83;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
//# sourceMappingURL=index.vue.js.map