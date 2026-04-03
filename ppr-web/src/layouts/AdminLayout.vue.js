import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
// 当前路由实例
const route = useRoute();
// 路由导航实例
const router = useRouter();
// 计算当前激活的菜单路径
const activePath = computed(() => route.path);
// 根据当前路径计算顶部标题
const title = computed(() => {
    if (route.path.startsWith('/datasource'))
        return '数据源管理';
    if (route.path.startsWith('/view-designer'))
        return '视图设计器';
    if (route.path.startsWith('/report-designer'))
        return '报表设计器';
    if (route.path.startsWith('/template-designer'))
        return '模板设计器';
    if (route.path.startsWith('/schedule'))
        return '定时发送';
    if (route.path.startsWith('/log'))
        return '系统日志';
    return 'PPR';
});
/**
 * 菜单选中事件处理
 * @param index 选中的菜单索引（路径）
 */
function onSelect(index) {
    router.push(index);
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
const __VLS_0 = {}.ElContainer;
/** @type {[typeof __VLS_components.ElContainer, typeof __VLS_components.elContainer, typeof __VLS_components.ElContainer, typeof __VLS_components.elContainer, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ...{ class: "admin-container" },
}));
const __VLS_2 = __VLS_1({
    ...{ class: "admin-container" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_4 = {};
__VLS_3.slots.default;
const __VLS_5 = {}.ElAside;
/** @type {[typeof __VLS_components.ElAside, typeof __VLS_components.elAside, typeof __VLS_components.ElAside, typeof __VLS_components.elAside, ]} */ ;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({
    width: "220px",
    ...{ class: "admin-aside" },
}));
const __VLS_7 = __VLS_6({
    width: "220px",
    ...{ class: "admin-aside" },
}, ...__VLS_functionalComponentArgsRest(__VLS_6));
__VLS_8.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "aside-logo" },
});
const __VLS_9 = {}.ElMenu;
/** @type {[typeof __VLS_components.ElMenu, typeof __VLS_components.elMenu, typeof __VLS_components.ElMenu, typeof __VLS_components.elMenu, ]} */ ;
// @ts-ignore
const __VLS_10 = __VLS_asFunctionalComponent(__VLS_9, new __VLS_9({
    ...{ 'onSelect': {} },
    defaultActive: (__VLS_ctx.activePath),
    ...{ class: "aside-menu" },
}));
const __VLS_11 = __VLS_10({
    ...{ 'onSelect': {} },
    defaultActive: (__VLS_ctx.activePath),
    ...{ class: "aside-menu" },
}, ...__VLS_functionalComponentArgsRest(__VLS_10));
let __VLS_13;
let __VLS_14;
let __VLS_15;
const __VLS_16 = {
    onSelect: (__VLS_ctx.onSelect)
};
__VLS_12.slots.default;
const __VLS_17 = {}.ElMenuItem;
/** @type {[typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, ]} */ ;
// @ts-ignore
const __VLS_18 = __VLS_asFunctionalComponent(__VLS_17, new __VLS_17({
    index: "/datasource",
}));
const __VLS_19 = __VLS_18({
    index: "/datasource",
}, ...__VLS_functionalComponentArgsRest(__VLS_18));
__VLS_20.slots.default;
var __VLS_20;
const __VLS_21 = {}.ElMenuItem;
/** @type {[typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, ]} */ ;
// @ts-ignore
const __VLS_22 = __VLS_asFunctionalComponent(__VLS_21, new __VLS_21({
    index: "/view-designer",
}));
const __VLS_23 = __VLS_22({
    index: "/view-designer",
}, ...__VLS_functionalComponentArgsRest(__VLS_22));
__VLS_24.slots.default;
var __VLS_24;
const __VLS_25 = {}.ElMenuItem;
/** @type {[typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, ]} */ ;
// @ts-ignore
const __VLS_26 = __VLS_asFunctionalComponent(__VLS_25, new __VLS_25({
    index: "/report-designer",
}));
const __VLS_27 = __VLS_26({
    index: "/report-designer",
}, ...__VLS_functionalComponentArgsRest(__VLS_26));
__VLS_28.slots.default;
var __VLS_28;
const __VLS_29 = {}.ElMenuItem;
/** @type {[typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, ]} */ ;
// @ts-ignore
const __VLS_30 = __VLS_asFunctionalComponent(__VLS_29, new __VLS_29({
    index: "/template-designer",
}));
const __VLS_31 = __VLS_30({
    index: "/template-designer",
}, ...__VLS_functionalComponentArgsRest(__VLS_30));
__VLS_32.slots.default;
var __VLS_32;
const __VLS_33 = {}.ElMenuItem;
/** @type {[typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, ]} */ ;
// @ts-ignore
const __VLS_34 = __VLS_asFunctionalComponent(__VLS_33, new __VLS_33({
    index: "/schedule",
}));
const __VLS_35 = __VLS_34({
    index: "/schedule",
}, ...__VLS_functionalComponentArgsRest(__VLS_34));
__VLS_36.slots.default;
var __VLS_36;
const __VLS_37 = {}.ElMenuItem;
/** @type {[typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, ]} */ ;
// @ts-ignore
const __VLS_38 = __VLS_asFunctionalComponent(__VLS_37, new __VLS_37({
    index: "/log",
}));
const __VLS_39 = __VLS_38({
    index: "/log",
}, ...__VLS_functionalComponentArgsRest(__VLS_38));
__VLS_40.slots.default;
var __VLS_40;
var __VLS_12;
var __VLS_8;
const __VLS_41 = {}.ElContainer;
/** @type {[typeof __VLS_components.ElContainer, typeof __VLS_components.elContainer, typeof __VLS_components.ElContainer, typeof __VLS_components.elContainer, ]} */ ;
// @ts-ignore
const __VLS_42 = __VLS_asFunctionalComponent(__VLS_41, new __VLS_41({}));
const __VLS_43 = __VLS_42({}, ...__VLS_functionalComponentArgsRest(__VLS_42));
__VLS_44.slots.default;
const __VLS_45 = {}.ElHeader;
/** @type {[typeof __VLS_components.ElHeader, typeof __VLS_components.elHeader, typeof __VLS_components.ElHeader, typeof __VLS_components.elHeader, ]} */ ;
// @ts-ignore
const __VLS_46 = __VLS_asFunctionalComponent(__VLS_45, new __VLS_45({
    ...{ class: "admin-header" },
}));
const __VLS_47 = __VLS_46({
    ...{ class: "admin-header" },
}, ...__VLS_functionalComponentArgsRest(__VLS_46));
__VLS_48.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "header-title" },
});
(__VLS_ctx.title);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "header-user" },
});
var __VLS_48;
const __VLS_49 = {}.ElMain;
/** @type {[typeof __VLS_components.ElMain, typeof __VLS_components.elMain, typeof __VLS_components.ElMain, typeof __VLS_components.elMain, ]} */ ;
// @ts-ignore
const __VLS_50 = __VLS_asFunctionalComponent(__VLS_49, new __VLS_49({
    ...{ class: "admin-main" },
}));
const __VLS_51 = __VLS_50({
    ...{ class: "admin-main" },
}, ...__VLS_functionalComponentArgsRest(__VLS_50));
__VLS_52.slots.default;
const __VLS_53 = {}.RouterView;
/** @type {[typeof __VLS_components.RouterView, ]} */ ;
// @ts-ignore
const __VLS_54 = __VLS_asFunctionalComponent(__VLS_53, new __VLS_53({}));
const __VLS_55 = __VLS_54({}, ...__VLS_functionalComponentArgsRest(__VLS_54));
var __VLS_52;
var __VLS_44;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['admin-container']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-aside']} */ ;
/** @type {__VLS_StyleScopedClasses['aside-logo']} */ ;
/** @type {__VLS_StyleScopedClasses['aside-menu']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-header']} */ ;
/** @type {__VLS_StyleScopedClasses['header-title']} */ ;
/** @type {__VLS_StyleScopedClasses['header-user']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-main']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            activePath: activePath,
            title: title,
            onSelect: onSelect,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=AdminLayout.vue.js.map