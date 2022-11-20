import { mapState, mapActions } from 'vuex';
import functions from '@helpers/common-functions';
import moment from 'moment';
import { isEmpty } from 'lodash';
import userBackground from '@assets/images/user-background.jpg';
import { getSavedUser } from '@/helpers/auth.service';
import storeMixins from './store.mixins';

export default {
  mixins: [storeMixins],
  data() {
    return {
      userBackground,
      showNav: true,
      slideUpModal: false,
      pageTitle: '',
      reviewerRole: 'reviewer',
      genders: {
        othher: 'Khác',
        male: 'Nam',
        female: 'Nữ',
      },
    };
  },
  computed: {
    ...mapState('customer', ['customer']),
    ...mapState('intake', ['editMode']),
    ...mapState('auth', ['currentUser']),
    ...mapState('employee', ['ktvList']),
    ...mapState('app', ['toast', 'provinces']),
    localStorageUser() {
      return JSON.parse(localStorage.getItem('user'));
    },
    isMobile() {
      return this.$vuetify.breakpoint.width <= 640;
    },
    hasCustomer() {
      return !isEmpty(this.customer);
    },
    isAdmin() {
      const { role } = getSavedUser();
      if (role) {
        return (
          role.toLowerCase() === 'admin' || role.toLowerCase() === 'cashier'
        );
      }
      return false;
    },
  },
  methods: {
    ...mapActions('app', ['toggleToast']),
    async logout() {
      this.setLoading(true);
      await this.dispatch('auth/LOG_OUT');
      this.$router.push('/login');
      this.setLoading(false);
    },
    setLoading(isLoading) {
      this.dispatch('app/toggleLoading', isLoading);
    },
    back() {
      this.$router.go(-1);
    },
    home() {
      this.$router.push({ path: '/' });
    },
    onlyNumber($event) {
      const ASCIICode = $event.which ? $event.which : $event.keyCode;
      if (ASCIICode > 31 && (ASCIICode < 48 || ASCIICode > 57)) {
        return $event.preventDefault();
      }
      return true;
    },
    handleKeypress($event, type) {
      if (type === 'number') {
        return this.onlyNumber($event);
      }
      // Only ASCII charactar in that range allowed
      return true;
    },
    
    dateFormatted(date, fmString, isLocal = true) {
      const parsed = moment.utc(date);
      if(isLocal) return parsed.local().format(fmString);
      return parsed.format(fmString);
        
    },
    expired(date) {
      return functions.expired(date);
    },
    checkBalance(intake, customerBalance) {
      const totalCredit = intake.orders.reduce((total, order) => {
        let price = 0;
        const field = 'price';
        if (order.type === 'promotion') {
          total += order[field];
        } else {
          if (order.combo_id === null && !order.variant.is_free) {
            price = order.variant[field] * order.amount;
          }
          total += price;
        }
        return total;
      }, 0);
      return customerBalance >= totalCredit;
    },
  },
};
