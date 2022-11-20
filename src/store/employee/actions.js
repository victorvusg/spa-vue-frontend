import { axiosFactory } from '@/axios';

const employeeAPI = axiosFactory('api/v1/employees');

export default {
  async getEmployees({ commit, state }) {
    commit('setValue', {
      key: 'ktvList',
      value: [],
    });
    const options = {
      params: {
        roleId: state.roleId,
        phone: '',
        page: 1,
        per_page: 100000,
      },
    };
    let value = [];
    try {
      const response = await employeeAPI.get('', options);
      if (response.data.Data) {
        value = response.data.Data;
      }
    } catch (error) {
      throw Error('Cannot get Employee List');
    } finally {
      commit('setValue', {
        key: 'ktvList',
        value,
      });
    }
  },
};
