import { http } from './http';

export const getLogPage = (data: any) => {
    return http.post('/api/v1/admin/log/page', data);
};
