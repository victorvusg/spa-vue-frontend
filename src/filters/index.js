import Vue from 'vue';
import phoneFormat from './PhoneFormat';
import dateFormat from './DateFormat';
import { currencyFormat, coinFormat } from './CurrencyFormat';

Vue.filter('phoneFormat', phoneFormat);
Vue.filter('dateFormat', dateFormat);
Vue.filter('currencyFormat', currencyFormat);
Vue.filter('coin', coinFormat);
