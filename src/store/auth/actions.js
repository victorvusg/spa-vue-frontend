import { axiosFactory } from '@/axios';
import {
  saveToken,
  clearAuthentication,
  saveUser,
} from '@helpers/auth.service';

const authenticationAPI = axiosFactory('oauth/token');
const currentUserAPI = axiosFactory('api/v1/employeeinfo');

export default {
  async authenticate({ dispatch }, userInput) {
    const { username, password } = userInput;
    const body = {
      grant_type: process.env.VUE_APP_GRANT_TYPE,
      client_id: process.env.VUE_APP_CLIENT_ID,
      client_secret: process.env.VUE_APP_CLIENT_SECRET,
      username,
      password,
      scope: '*',
    };
    try {
      const tokenResponse = await authenticationAPI.post('', body);
      saveToken(tokenResponse.data);
      await dispatch('getCurrentUser');
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  async getCurrentUser({ commit }, queryParams = {}) {
    let value = {};
    try {
      const options = {
        params: { ...queryParams },
      };

      const response = await currentUserAPI.get('', options);

      if (response.status === 200) {
        // Save to localStorage
        value = response.data.Data;
        const { id, role } = value;
        saveUser({ id, role: role.name });
      } else {
        clearAuthentication();
        throw Error('unable to get user Info');
      }
    } catch (error) {
      clearAuthentication();
      throw error;
    } finally {
      commit('setValue', {
        key: 'currentUser',
        value,
      });
    }
  },
  LOG_OUT({ commit }) {
    commit('setValue', {
      key: 'currentUser',
      value: {},
    });
    clearAuthentication('user');
  },
};
