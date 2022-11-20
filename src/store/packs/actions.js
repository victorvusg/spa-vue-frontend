import { axiosFactory } from '@/axios';

const packageAPI = axiosFactory('api/v1/packages/');

export default {
  async getPackages({ commit }, paramObject) {
    let value = [];
    try {
      const options = {
        params: {
          page: 1,
          per_page: 100000,
          ...paramObject,
        },
      };
      const response = await packageAPI.get('', options);
      if (response.data.Data.length) {
        value = response.data.Data;
      }
      // eslint-disable-next-line no-useless-catch
    } catch (error) {
      console.log(error);
    } finally {
      commit('setValue', {
        key: 'packs',
        value,
      });
    }
  },
  async createPackage({}, formData) {
    try {
      await packageAPI.post('', formData);
      return true;
    } catch (error) {
      return false;
    }
  },
};
