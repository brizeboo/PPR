import { http } from './http';
export function listViews() {
    return http.get('/api/v1/admin/view/list');
}
export function getView(id) {
    return http.get(`/api/v1/admin/view/get/${id}`);
}
export function saveView(payload) {
    return http.post('/api/v1/admin/view/save', payload);
}
export function deleteView(id) {
    return http.delete(`/api/v1/admin/view/delete/${id}`);
}
export function previewView(payload) {
    return http.post('/api/v1/admin/view/preview', payload);
}
//# sourceMappingURL=view.js.map