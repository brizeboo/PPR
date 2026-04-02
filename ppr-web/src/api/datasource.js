import { http } from './http';
export function listDatasources() {
    return http.get('/api/v1/admin/datasource/list');
}
export function saveDatasource(payload) {
    return http.post('/api/v1/admin/datasource/save', payload);
}
export function deleteDatasource(id) {
    return http.delete(`/api/v1/admin/datasource/delete/${id}`);
}
export function testDatasource(payload) {
    return http.post('/api/v1/admin/datasource/test', payload);
}
//# sourceMappingURL=datasource.js.map