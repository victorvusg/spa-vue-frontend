import { getPaymentMethods, getProvinces } from '@/axios/app';

export default {
  toggleLoading({ commit }, value) {
    commit('setValue', {
      key: 'isLoading',
      value,
    });
  },
  toggleToast({ commit }, value) {
    commit('setValue', {
      key: 'toast',
      value,
    });
  },
  TOGGLE_NOT_FOUND_DIALOG({ commit }, { model, content }) {
    commit('setValue', {
      key: 'notFoundDialog',
      value: {
        model,
        content,
      },
    });
  },
  async GET_PAYMENT_METHODS({commit}){
    try {
      const response = await getPaymentMethods();
      if(response.status === 200){
        commit('setValue', {
          key: 'paymentMethods',
          value: response.data.Data,
        })
      }
    } catch(err) {
      console.log(err)
    }
  },
  async GET_PROVINCES({commit}){
    try {
      const response = await getProvinces();
      if(response.status === 200){
        commit('setValue', {
          key: 'provinces',
          value: response.data.Data,
        })
      }
    } catch(err) {
      console.log(err)
    }
  },
};