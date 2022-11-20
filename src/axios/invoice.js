import { axiosFactory } from './index';

const api = axiosFactory('api/v1/invoice/');

export const getInvoice = (id) => api.get(`${id}`);

export const approveInvoice = (id, payload) =>
  api.put(`approve/${id}`, payload);

export const updateIntake = (id, payload) => api.put(`${id}`, payload);
