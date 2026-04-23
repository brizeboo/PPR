import { ref, onMounted, onUnmounted } from 'vue';
import { http } from '@ppr/core';
import { ElMessage } from 'element-plus';
const authDialogVisible = ref(false);
const adminKeyInput = ref('');
const verifying = ref(false);
const checkAuthStatus = async () => {
    try {
        const { data } = await http.get('/api/v1/admin/auth/status');
        if (data && data.enabled) {
            // 检查 URL 参数
            const urlParams = new URLSearchParams(window.location.search);
            const urlKey = urlParams.get('adminkey');
            if (urlKey) {
                adminKeyInput.value = urlKey;
                await verifyAdminKey();
                // 验证成功后，清理 URL 上的参数，保持地址栏干净
                urlParams.delete('adminkey');
                const newUrl = window.location.pathname + (urlParams.toString() ? '?' + urlParams.toString() : '') + window.location.hash;
                window.history.replaceState({}, '', newUrl);
            }
        }
    }
    catch (error) {
        console.error('Failed to check auth status', error);
    }
};
const verifyAdminKey = async () => {
    if (!adminKeyInput.value) {
        ElMessage.warning('请输入管理员密钥');
        return;
    }
    verifying.value = true;
    try {
        const { data } = await http.post('/api/v1/admin/auth/verify', {
            adminKey: adminKeyInput.value
        });
        if (data.success) {
            ElMessage.success('验证成功');
            localStorage.setItem('satoken', data.token);
            authDialogVisible.value = false;
            // 触发页面重载或重新获取数据，以更新之前 401 失败的请求
            window.dispatchEvent(new CustomEvent('ppr-authorized'));
        }
        else {
            ElMessage.error(data.message || '密钥无效');
        }
    }
    catch (error) {
        ElMessage.error('验证请求失败');
    }
    finally {
        verifying.value = false;
    }
};
const handleUnauthorized = () => {
    authDialogVisible.value = true;
};
onMounted(() => {
    window.addEventListener('ppr-unauthorized', handleUnauthorized);
    checkAuthStatus();
});
onUnmounted(() => {
    window.removeEventListener('ppr-unauthorized', handleUnauthorized);
});
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
let __VLS_0;
/** @ts-ignore @type {typeof __VLS_components.RouterView} */
RouterView;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({}));
const __VLS_2 = __VLS_1({}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_5;
/** @ts-ignore @type {typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog} */
elDialog;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent1(__VLS_5, new __VLS_5({
    modelValue: (__VLS_ctx.authDialogVisible),
    title: "管理员身份验证",
    width: "400px",
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
    showClose: (false),
}));
const __VLS_7 = __VLS_6({
    modelValue: (__VLS_ctx.authDialogVisible),
    title: "管理员身份验证",
    width: "400px",
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
    showClose: (false),
}, ...__VLS_functionalComponentArgsRest(__VLS_6));
const { default: __VLS_10 } = __VLS_8.slots;
let __VLS_11;
/** @ts-ignore @type {typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components.elForm | typeof __VLS_components.ElForm} */
elForm;
// @ts-ignore
const __VLS_12 = __VLS_asFunctionalComponent1(__VLS_11, new __VLS_11({
    ...{ 'onSubmit': {} },
}));
const __VLS_13 = __VLS_12({
    ...{ 'onSubmit': {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_12));
let __VLS_16;
const __VLS_17 = ({ submit: {} },
    { onSubmit: (__VLS_ctx.verifyAdminKey) });
const { default: __VLS_18 } = __VLS_14.slots;
let __VLS_19;
/** @ts-ignore @type {typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem} */
elFormItem;
// @ts-ignore
const __VLS_20 = __VLS_asFunctionalComponent1(__VLS_19, new __VLS_19({}));
const __VLS_21 = __VLS_20({}, ...__VLS_functionalComponentArgsRest(__VLS_20));
const { default: __VLS_24 } = __VLS_22.slots;
let __VLS_25;
/** @ts-ignore @type {typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components.elInput | typeof __VLS_components.ElInput} */
elInput;
// @ts-ignore
const __VLS_26 = __VLS_asFunctionalComponent1(__VLS_25, new __VLS_25({
    modelValue: (__VLS_ctx.adminKeyInput),
    placeholder: "请输入控制台打印的管理员密钥",
    type: "password",
    showPassword: true,
}));
const __VLS_27 = __VLS_26({
    modelValue: (__VLS_ctx.adminKeyInput),
    placeholder: "请输入控制台打印的管理员密钥",
    type: "password",
    showPassword: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_26));
// @ts-ignore
[authDialogVisible, verifyAdminKey, adminKeyInput,];
var __VLS_22;
// @ts-ignore
[];
var __VLS_14;
var __VLS_15;
{
    const { footer: __VLS_30 } = __VLS_8.slots;
    let __VLS_31;
    /** @ts-ignore @type {typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components.elButton | typeof __VLS_components.ElButton} */
    elButton;
    // @ts-ignore
    const __VLS_32 = __VLS_asFunctionalComponent1(__VLS_31, new __VLS_31({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.verifying),
        ...{ style: {} },
    }));
    const __VLS_33 = __VLS_32({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.verifying),
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_32));
    let __VLS_36;
    const __VLS_37 = ({ click: {} },
        { onClick: (__VLS_ctx.verifyAdminKey) });
    const { default: __VLS_38 } = __VLS_34.slots;
    // @ts-ignore
    [verifyAdminKey, verifying,];
    var __VLS_34;
    var __VLS_35;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_8;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
//# sourceMappingURL=App.vue.js.map