import { axiosFactory } from '@/axios';

const customerAPI = axiosFactory('api/v1/customers/');

export default {
  SET_CUSTOMER({ commit }, value) {
    commit('setValue', {
      key: 'customer',
      value,
    });
  },
  // eslint-disable-next-line no-unused-vars
  async GET_CUSTOMER_BY_ID({ commit, dispatch }, id) {
    let value = {};
    try {
      if (!id || id === 'guest') {
        value = {
          id: null,
          phone: null,
          name: 'GUEST',
          email: null,
          points: 0,
          user_id: null,
          birthday: null,
          district: null,
          province: null,
        };
      } else {
        const response = await customerAPI.get(`${id}`);
        if (response.data.IsSuccess) {
          // await dispatch(
          //   'packs/getPackages',
          //   { customer_id: id },
          //   { root: true },
          // );
          value = response.data.Data;
        }
      }
    } catch (error) {
      console.warn(error);
    } finally {
      commit('setValue', {
        key: 'customer',
        value,
      });
    }
  },
  async CASH_OUT({ dispatch }, { id, amount, employee_id, signature }) {
    try {
      const response = await customerAPI.post(`${id}/cash-out`, {
        amount,
        employee_id,
        signature,
      });
      if (response.status === 200) {
        return Promise.resolve({
          isSuccess: true,
          message: '',
        });
      }
      return Promise.resolve({
        isSuccess: false,
        message: 'Đã có lỗi xảy ra',
      });
    } catch (error) {
      return Promise.resolve({
        isSuccess: false,
        message: error.response.data.Message,
      });
    }
  },
};
