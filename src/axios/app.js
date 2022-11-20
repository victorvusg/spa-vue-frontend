import { axiosFactory } from './index';

const api = axiosFactory();

export const getPaymentMethods = () => api.get('api/v1/payment-method');

export const getProvinces = () => api.get('api/v1/provinces');
