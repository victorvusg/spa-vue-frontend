import Vue from 'vue';
import VueLodash from 'vue-lodash';
import lodash from 'lodash';
import '@filters';
import VueSignaturePad from 'vue-signature-pad';
import VuetifyMoney from 'vuetify-money';
import Vuelidate from 'vuelidate';
import App from './App';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import mixins from './mixins/global.mixins';
import i18n from './i18n';

Vue.use(Vuelidate);
Vue.use(VuetifyMoney);

Vue.use(VueLodash, { name: 'custom', lodash });

Vue.use(VueSignaturePad);

Vue.config.productionTip = false;
Vue.mixin(mixins);
new Vue({
  i18n,
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
