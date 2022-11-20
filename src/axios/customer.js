import { axiosFactory } from './index';

const api = axiosFactory('api/v1/customers/');

export const checkCashPoint = (id) => api.post(`/${id}/check-cash-point`);

export const getCustomerById = (id) => api.get(`${id}`);

export const updateCustomer = (id, payload) => api.put(`${id}`, payload);