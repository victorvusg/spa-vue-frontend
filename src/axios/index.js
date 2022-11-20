/* eslint-disable no-param-reassign */
import { getToken, clearAuthentication } from '@helpers/auth.service';
import axios from 'axios';

export const axiosFactory = (api = '') => {
  const url = `${process.env.VUE_APP_BASE_URL}${api}`;
  // init axios instance
  const $axios = axios.create({
    baseURL: url,
  });

  // interceptors for request
  $axios.interceptors.request.use(
    (config) => {
      if (config.url === '/oauth/token') {
        return config;
      }
      const token = getToken();
      if (token && token.access_token) {
        config.headers.common.Authorization = `Bearer ${token.access_token}`;
        config.headers.common['User-Type'] = 'ktv';
      }
      return config;
    },
    (error) => Promise.reject(error),
  );

  // intercepter for response
  $axios.interceptors.response.use(
    (response) => {
      if (response.status === 200 || response.status === 201) {
        return Promise.resolve(response);
      }
      return Promise.reject(response);
    },
    (error) => {
      console.log(error);
      if (error.response && error.response.status === 401) {
        clearAuthentication();
      }

      return Promise.reject(error);
    },
  );

  return $axios;
};
export const api = axiosFactory();
