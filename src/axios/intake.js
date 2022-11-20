import { axiosFactory } from './index';

const api = axiosFactory('api/v1/intakes/');

export const getIntakeById = (id) => api.get(`${id}`);
