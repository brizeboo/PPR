import { ref, onMounted, watch, onBeforeUnmount } from 'vue';
import Spreadsheet from 'x-data-spreadsheet';
import 'x-data-spreadsheet/dist/xspreadsheet.css';
import * as XLSX from 'xlsx';
const props = defineProps();
const emit = defineEmits();
const editorContainer = ref(null);
let spreadsheet = null;
onMounted(() => {
    if (editorContainer.value) {
        spreadsheet = new Spreadsheet(editorContainer.value, {
            mode: props.readonly ? 'read' : 'edit',
            showToolbar: !props.readonly,
            showGrid: true,
            showContextmenu: !props.readonly,
        });
        if (props.data) {
            spreadsheet.loadData(props.data);
        }
        spreadsheet.change((data) => {
            emit('change', data);
        });
        // 监听拖拽事件
        if (!props.readonly) {
            editorContainer.value.addEventListener('dragover', handleDragOver);
            editorContainer.value.addEventListener('drop', handleDrop);
        }
    }
});
onBeforeUnmount(() => {
    if (editorContainer.value && !props.readonly) {
        editorContainer.value.removeEventListener('dragover', handleDragOver);
        editorContainer.value.removeEventListener('drop', handleDrop);
    }
});
watch(() => props.data, (newData) => {
    if (spreadsheet && newData) {
        spreadsheet.loadData(newData);
    }
}, { deep: true });
const handleDragOver = (e) => {
    e.preventDefault();
};
const handleDrop = (e) => {
    e.preventDefault();
    if (props.readonly)
        return;
    const transferData = e.dataTransfer?.getData('text/plain');
    if (!transferData)
        return;
    try {
        const payload = JSON.parse(transferData);
        // x-spreadsheet DOM elements structure can be complex, so finding the exact cell might require coordinate mapping
        // As a simple workaround for the requirement, we'll try to find the currently active cell if no precise DOM mapping is used
        // A better way is using the mouse coordinates to find cell (row, col) but x-spreadsheet doesn't easily expose this.
        // However, x-spreadsheet updates its internal `sheet.data.selector` to the cell clicked.
        // For a real drop, we can either require the user to click a cell first, or just use the current selected cell.
        const sheet = spreadsheet.sheet;
        const { ri, ci } = sheet.data.selector; // current selected row/col
        emit('drop', { row: ri, col: ci, value: payload });
    }
    catch (err) {
        console.error('Drop error:', err);
    }
};
// Expose methods for parent components
const __VLS_exposed = {
    loadExcelFile: async (file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const data = new Uint8Array(e.target?.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            // Simple conversion from XLSX to x-spreadsheet format
            // Note: A full conversion requires mapping styles, merges, etc.
            // Here we do a basic conversion for demonstration
            const outData = stox(workbook);
            spreadsheet.loadData(outData);
            emit('change', outData);
        };
        reader.readAsArrayBuffer(file);
    },
    getData: () => {
        return spreadsheet ? spreadsheet.getData() : [];
    },
    setCellValue: (row, col, text) => {
        if (spreadsheet) {
            spreadsheet.cellText(row, col, text).reRender();
        }
    }
};
defineExpose(__VLS_exposed);
// A helper function to convert XLSX to x-spreadsheet format
function stox(wb) {
    const out = [];
    for (const sheetName of wb.SheetNames) {
        const ws = wb.Sheets[sheetName];
        const sheetData = { name: sheetName, rows: {}, merges: [] };
        const range = XLSX.utils.decode_range(ws['!ref'] || 'A1:A1');
        for (let R = range.s.r; R <= range.e.r; ++R) {
            const row = { cells: {} };
            for (let C = range.s.c; C <= range.e.c; ++C) {
                const cell = ws[XLSX.utils.encode_cell({ r: R, c: C })];
                if (cell && cell.v !== undefined) {
                    row.cells[C] = { text: String(cell.v) };
                }
            }
            sheetData.rows[R] = row;
        }
        out.push(sheetData);
    }
    return out;
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "excel-editor" },
    ref: "editorContainer",
});
/** @type {typeof __VLS_ctx.editorContainer} */ ;
/** @type {__VLS_StyleScopedClasses['excel-editor']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            editorContainer: editorContainer,
        };
    },
    __typeEmits: {},
    __typeProps: {},
});
export default (await import('vue')).defineComponent({
    setup() {
        return {
            ...__VLS_exposed,
        };
    },
    __typeEmits: {},
    __typeProps: {},
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=index.vue.js.map