import { http } from './http';
export const getLogPage = (data) => {
    return http.post('/api/v1/admin/log/page', data);
};
//# sourceMappingURL=log.js.map