/* eslint-disable camelcase */
import { axiosFactory } from '@/axios';

const intakeAPI = axiosFactory('api/v1/intakes/');

const mapOrders = (orders) =>
  orders.map((o) => {
    const {
      id,
      name,
      variant_id,
      employee_id,
      amount,
      note,
      combo_id,
      gender,
      promotion_hash,
    } = o;
    return {
      id,
      name,
      variant_id,
      employee_id,
      amount,
      note: JSON.stringify(note),
      combo_id,
      gender,
      promotion_hash,
    };
  });
export default {
  INIT_NEW_INTAKE({ commit }, customer_id) {
    commit('setValue', {
      key: 'intake',
      value: {
        customer_id,
        orders: [],
      },
    });
  },
  REMOVE_INTAKE({ commit }) {
    commit('setValue', {
      key: 'intake',
      value: null,
    });
  },
  ADD_ORDER_TO_INTAKE({ commit }, order) {
    commit('addOrder', order);
  },
  REMOVE_ORDER_FROM_INTAKE({ commit }, orderIndex) {
    commit('removeOrder', orderIndex);
  },
  SAVE_ORDER({ commit }, { order, index }) {
    commit('saveOrder', { order, index });
  },
  CHANGE_PAYMENT_TYPE({ commit }, value) {
    commit('changeIntakePaymentType', value);
  },
  TOGGLE_INTAKE_EDIT_MODE({ commit }, value) {
    commit('setValue', {
      key: 'editMode',
      value,
    });
  },
  async CREATE_INTAKE({ state }) {
    let createdId = -1;
    try {
      // id,
      // variant_id,
      // employee_id,
      // amount,
      // note,
      // combo_id,
      // gender,
      // promotion_hash: null,
      const orders = mapOrders(state.intake.orders);

      const { customer_id } = state.intake;
      const response = await intakeAPI.post('', {
        customer_id,
        orders,
      });
      if (response.status === 201) createdId = response.data.Data.id;
    } catch (error) {
      console.log(error);
    }
    return createdId;
  },
  async GET_INTAKE_BY_ID({ commit, dispatch }, id) {
    let value = {};
    try {
      const response = await intakeAPI.get(`${id}`);
      if (response.data.IsSuccess) {
        // Map orders
        const orders = response.data.Data.orders.map((o) => ({
          ...o,
          note: JSON.parse(o.note),
        }));

        value = { ...response.data.Data, orders };
        const { customer_id } = value;
        await dispatch('customer/GET_CUSTOMER_BY_ID', customer_id, {
          root: true,
        });
      }
    } catch (error) {
      console.warn(error);
    } finally {
      commit('setValue', {
        key: 'intake',
        value,
      });
    }
  },
  async UPDATE_INTAKE({ state }) {
    let isSuccess = false;
    try {
      const orders = mapOrders(state.intake.orders);
      const { customer_id, id } = state.intake;
      const response = await intakeAPI.put(`${id}`, {
        customer_id,
        orders,
      });
      if (response.status === 200) {
        isSuccess = true;
      }
    } catch (error) {
      console.log(error);
    } finally {
      // eslint-disable-next-line no-unsafe-finally
      return isSuccess;
    }
  },
  // TODO: Update note for order
  // async updateOrderNote({ commit, dispatch }, { note, id }) {
  //   let done = false;
  //   try {
  //     const stringNote = JSON.stringify(note);
  //     commit(
  //       'loading/setLoading',
  //       { isLoading: true, text: 'Đang xử lý' },
  //       { root: true },
  //     );
  //     const response = await $axios.put(`/api/v1/orders/${id}`, {
  //       note: stringNote,
  //     });
  //     if (response.data.Data) {
  //       await dispatch('getOrders', true);
  //       done = true;
  //     }
  //   } catch (error) {
  //     done = false;
  //     throw error;
  //   } finally {
  //     commit(
  //       'loading/setLoading',
  //       { isLoading: false, text: 'Đang xử lý' },
  //       { root: true },
  //     );
  //     // eslint-disable-next-line no-unsafe-finally
  //     return done;
  //   }
  // },
};
