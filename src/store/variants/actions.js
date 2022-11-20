import { axiosFactory } from '@/axios';

const variantAPI = axiosFactory('api/v1/variants');

const serviceCategoryAPI = axiosFactory('api/v1/service-categories');

const groupedVaraints = (data) =>
  data.reduce((result, currentValue) => {
    if (currentValue.service.is_active) {
      const variantCategory = currentValue.service.service_category;
      if (!result[variantCategory.name]) {
        result[variantCategory.name] = {
          ...variantCategory,
          services: [],
        };
      }
      const { services } = result[variantCategory.name];
      const serviceObject = services.find(
        (s) => s.id === currentValue.service.id,
      );
      if (!serviceObject) {
        services.push({
          id: currentValue.service.id,
          name: currentValue.service.name,
          descriptions: currentValue.service.descriptions,
          service_category: { ...currentValue.service.service_category },
          is_combo_sold: currentValue.service.is_combo_sold,
          is_active: currentValue.service.is_active,
          combo_ratio: currentValue.service.combo_ratio,
          variants: [{ ...currentValue }],
        });
      } else {
        serviceObject.variants.push({ ...currentValue });
      }
    }
    if (result.promotion) {
      const { promotion, ...rest } = result;
      return { promotion, ...rest };
    }
    return result;
  }, {});

export default {
  async getVariants({ commit, dispatch }) {
    let value = [];
    commit('setValue', {
      key: 'variants',
      value,
    });

    try {
      await dispatch('getServiceCategories');
      const response = await variantAPI.get('', { params: { is_active: 1 } });
      if (response.data.Data) {
        value = response.data.Data;
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
    commit('setValue', {
      key: 'variants',
      value,
    });
  },
  async getServiceCategories({ commit }) {
    let value = [];
    commit('setValue', {
      key: 'serviceCategories',
      value,
    });
    try {
      const response = await serviceCategoryAPI.get('', {
        params: { is_active: 1 },
      });
      if (response.status === 200) {
        value = response.data.Data;
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
    commit('setValue', {
      key: 'serviceCategories',
      value,
    });
  },
  // TODO: Delete pack
  // async deleteCombo({ getters, commit, dispatch }, { id, customer_id }) {
  //   let isDeleted = false;
  //   try {
  //     const response = await $axios.delete(`/api/v1/combos/${id}`);
  //     if (response.status === 200 || response.status === 201) {
  //       isDeleted = true;
  //       await dispatch('customer/GET_CUSTOMER_BY_ID', customer_id, {
  //         root: true,
  //       });
  //     }
  //     // eslint-disable-next-line no-useless-catch
  //   } catch (error) {
  //     console.log(error);
  //     throw error;
  //   } finally {
  //     // eslint-disable-next-line no-unsafe-finally
  //     return isDeleted;
  //   }
  // },
};
