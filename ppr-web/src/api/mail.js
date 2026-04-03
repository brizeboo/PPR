import { http } from './http';
export const getMailConfig = () => {
    return http.get('/api/v1/admin/mail/config');
};
export const saveMailConfig = (data) => {
    return http.post('/api/v1/admin/mail/save', data);
};
export const testMailSend = (to) => {
    return http.post('/api/v1/admin/mail/test', { to });
};
//# sourceMappingURL=mail.js.map