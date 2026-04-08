import { http } from './http';

export const getScheduleList = () => {
    return http.get('/api/v1/admin/schedule/list');
};

export const saveSchedule = (data: any) => {
    return http.post('/api/v1/admin/schedule/save', data);
};

export const changeScheduleStatus = (id: string, status: number) => {
    return http.post(`/api/v1/admin/schedule/status/${id}`, { status });
};

export const deleteSchedule = (id: string) => {
    return http.delete(`/api/v1/admin/schedule/${id}`);
};
