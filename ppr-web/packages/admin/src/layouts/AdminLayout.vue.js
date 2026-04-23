import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
// 当前路由实例
const route = useRoute();
// 路由导航实例
const router = useRouter();
// 计算当前激活的菜单路径
const activePath = computed(() => {
    // 如果路径以某些前缀开头，可以高亮特定的菜单项
    const path = route.path;
    if (path.startsWith('/datasource'))
        return '/datasource';
    if (path.startsWith('/view-designer'))
        return '/view-designer';
    if (path.startsWith('/report-designer'))
        return '/report-designer';
    if (path.startsWith('/template-designer'))
        return '/template-designer';
    if (path.startsWith('/file'))
        return '/file';
    if (path.startsWith('/log'))
        return '/log';
    if (path.startsWith('/setting'))
        return '/setting';
    return path;
});
/**
 * 菜单选中事件处理
 * @param index 选中的菜单索引（路径）
 */
function onSelect(index) {
    router.push(index);
}
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['header-menu']} */ ;
let __VLS_0;
/** @ts-ignore @type {typeof __VLS_components.elContainer | typeof __VLS_components.ElContainer | typeof __VLS_components.elContainer | typeof __VLS_components.ElContainer} */
elContainer;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    ...{ class: "admin-container" },
}));
const __VLS_2 = __VLS_1({
    ...{ class: "admin-container" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5 = {};
/** @type {__VLS_StyleScopedClasses['admin-container']} */ ;
const { default: __VLS_6 } = __VLS_3.slots;
let __VLS_7;
/** @ts-ignore @type {typeof __VLS_components.elHeader | typeof __VLS_components.ElHeader | typeof __VLS_components.elHeader | typeof __VLS_components.ElHeader} */
elHeader;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
    ...{ class: "admin-header" },
}));
const __VLS_9 = __VLS_8({
    ...{ class: "admin-header" },
}, ...__VLS_functionalComponentArgsRest(__VLS_8));
/** @type {__VLS_StyleScopedClasses['admin-header']} */ ;
const { default: __VLS_12 } = __VLS_10.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "header-left" },
});
/** @type {__VLS_StyleScopedClasses['header-left']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "header-logo" },
});
/** @type {__VLS_StyleScopedClasses['header-logo']} */ ;
let __VLS_13;
/** @ts-ignore @type {typeof __VLS_components.elMenu | typeof __VLS_components.ElMenu | typeof __VLS_components.elMenu | typeof __VLS_components.ElMenu} */
elMenu;
// @ts-ignore
const __VLS_14 = __VLS_asFunctionalComponent1(__VLS_13, new __VLS_13({
    ...{ 'onSelect': {} },
    defaultActive: (__VLS_ctx.activePath),
    mode: "horizontal",
    ...{ class: "header-menu" },
    ellipsis: (false),
}));
const __VLS_15 = __VLS_14({
    ...{ 'onSelect': {} },
    defaultActive: (__VLS_ctx.activePath),
    mode: "horizontal",
    ...{ class: "header-menu" },
    ellipsis: (false),
}, ...__VLS_functionalComponentArgsRest(__VLS_14));
let __VLS_18;
const __VLS_19 = ({ select: {} },
    { onSelect: (__VLS_ctx.onSelect) });
/** @type {__VLS_StyleScopedClasses['header-menu']} */ ;
const { default: __VLS_20 } = __VLS_16.slots;
let __VLS_21;
/** @ts-ignore @type {typeof __VLS_components.elMenuItem | typeof __VLS_components.ElMenuItem | typeof __VLS_components.elMenuItem | typeof __VLS_components.ElMenuItem} */
elMenuItem;
// @ts-ignore
const __VLS_22 = __VLS_asFunctionalComponent1(__VLS_21, new __VLS_21({
    index: "/datasource",
}));
const __VLS_23 = __VLS_22({
    index: "/datasource",
}, ...__VLS_functionalComponentArgsRest(__VLS_22));
const { default: __VLS_26 } = __VLS_24.slots;
// @ts-ignore
[activePath, onSelect,];
var __VLS_24;
let __VLS_27;
/** @ts-ignore @type {typeof __VLS_components.elMenuItem | typeof __VLS_components.ElMenuItem | typeof __VLS_components.elMenuItem | typeof __VLS_components.ElMenuItem} */
elMenuItem;
// @ts-ignore
const __VLS_28 = __VLS_asFunctionalComponent1(__VLS_27, new __VLS_27({
    index: "/view-designer",
}));
const __VLS_29 = __VLS_28({
    index: "/view-designer",
}, ...__VLS_functionalComponentArgsRest(__VLS_28));
const { default: __VLS_32 } = __VLS_30.slots;
// @ts-ignore
[];
var __VLS_30;
let __VLS_33;
/** @ts-ignore @type {typeof __VLS_components.elMenuItem | typeof __VLS_components.ElMenuItem | typeof __VLS_components.elMenuItem | typeof __VLS_components.ElMenuItem} */
elMenuItem;
// @ts-ignore
const __VLS_34 = __VLS_asFunctionalComponent1(__VLS_33, new __VLS_33({
    index: "/report-designer",
}));
const __VLS_35 = __VLS_34({
    index: "/report-designer",
}, ...__VLS_functionalComponentArgsRest(__VLS_34));
const { default: __VLS_38 } = __VLS_36.slots;
// @ts-ignore
[];
var __VLS_36;
let __VLS_39;
/** @ts-ignore @type {typeof __VLS_components.elMenuItem | typeof __VLS_components.ElMenuItem | typeof __VLS_components.elMenuItem | typeof __VLS_components.ElMenuItem} */
elMenuItem;
// @ts-ignore
const __VLS_40 = __VLS_asFunctionalComponent1(__VLS_39, new __VLS_39({
    index: "/template-designer",
}));
const __VLS_41 = __VLS_40({
    index: "/template-designer",
}, ...__VLS_functionalComponentArgsRest(__VLS_40));
const { default: __VLS_44 } = __VLS_42.slots;
// @ts-ignore
[];
var __VLS_42;
let __VLS_45;
/** @ts-ignore @type {typeof __VLS_components.elMenuItem | typeof __VLS_components.ElMenuItem | typeof __VLS_components.elMenuItem | typeof __VLS_components.ElMenuItem} */
elMenuItem;
// @ts-ignore
const __VLS_46 = __VLS_asFunctionalComponent1(__VLS_45, new __VLS_45({
    index: "/file",
}));
const __VLS_47 = __VLS_46({
    index: "/file",
}, ...__VLS_functionalComponentArgsRest(__VLS_46));
const { default: __VLS_50 } = __VLS_48.slots;
// @ts-ignore
[];
var __VLS_48;
let __VLS_51;
/** @ts-ignore @type {typeof __VLS_components.elMenuItem | typeof __VLS_components.ElMenuItem | typeof __VLS_components.elMenuItem | typeof __VLS_components.ElMenuItem} */
elMenuItem;
// @ts-ignore
const __VLS_52 = __VLS_asFunctionalComponent1(__VLS_51, new __VLS_51({
    index: "/log",
}));
const __VLS_53 = __VLS_52({
    index: "/log",
}, ...__VLS_functionalComponentArgsRest(__VLS_52));
const { default: __VLS_56 } = __VLS_54.slots;
// @ts-ignore
[];
var __VLS_54;
let __VLS_57;
/** @ts-ignore @type {typeof __VLS_components.elMenuItem | typeof __VLS_components.ElMenuItem | typeof __VLS_components.elMenuItem | typeof __VLS_components.ElMenuItem} */
elMenuItem;
// @ts-ignore
const __VLS_58 = __VLS_asFunctionalComponent1(__VLS_57, new __VLS_57({
    index: "/setting",
}));
const __VLS_59 = __VLS_58({
    index: "/setting",
}, ...__VLS_functionalComponentArgsRest(__VLS_58));
const { default: __VLS_62 } = __VLS_60.slots;
// @ts-ignore
[];
var __VLS_60;
// @ts-ignore
[];
var __VLS_16;
var __VLS_17;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "header-right" },
});
/** @type {__VLS_StyleScopedClasses['header-right']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "header-user" },
});
/** @type {__VLS_StyleScopedClasses['header-user']} */ ;
// @ts-ignore
[];
var __VLS_10;
let __VLS_63;
/** @ts-ignore @type {typeof __VLS_components.elMain | typeof __VLS_components.ElMain | typeof __VLS_components.elMain | typeof __VLS_components.ElMain} */
elMain;
// @ts-ignore
const __VLS_64 = __VLS_asFunctionalComponent1(__VLS_63, new __VLS_63({
    ...{ class: "admin-main" },
}));
const __VLS_65 = __VLS_64({
    ...{ class: "admin-main" },
}, ...__VLS_functionalComponentArgsRest(__VLS_64));
/** @type {__VLS_StyleScopedClasses['admin-main']} */ ;
const { default: __VLS_68 } = __VLS_66.slots;
let __VLS_69;
/** @ts-ignore @type {typeof __VLS_components.RouterView} */
RouterView;
// @ts-ignore
const __VLS_70 = __VLS_asFunctionalComponent1(__VLS_69, new __VLS_69({}));
const __VLS_71 = __VLS_70({}, ...__VLS_functionalComponentArgsRest(__VLS_70));
// @ts-ignore
[];
var __VLS_66;
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
//# sourceMappingURL=AdminLayout.vue.js.map