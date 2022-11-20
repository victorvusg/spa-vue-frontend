import Vue from 'vue';
import Vuex from 'vuex';
import auth from '@/store/auth';
import app from '@/store/app';
import variants from '@/store/variants';
import employee from '@/store/employee';
import customer from '@/store/customer';
import packs from '@/store/packs';
import intake from '@/store/intake';
import task from '@/store/task';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    app,
    auth,
    variants,
    employee,
    customer,
    intake,
    packs,
    task,
  },
});
