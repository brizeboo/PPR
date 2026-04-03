import { http } from './http';
export function listReports() {
    return http.get('/api/v1/admin/report/list');
}
export function getReportMeta(reportId) {
    return http.get(`/api/v1/report/meta/${reportId}`);
}
export function saveReport(report) {
    return http.post('/api/v1/admin/report/upsert', report);
}
export function deleteReport(reportId) {
    return http.delete(`/api/v1/admin/report/${reportId}`);
}
export function getReportData(reportId, params) {
    return http.post(`/api/v1/report/data/${reportId}`, params);
}
//# sourceMappingURL=report.js.map