<template>
  <router-view v-if="isFetched" />
</template>

<script>
// @ is an alias to /src
import { getSavedUser } from '@/helpers/auth.service';

export default {
  name: 'Main',
  data() {
    return {
      isFetched: false,
    };
  },
  async created() {
    this.isFetched = false;
    this.setLoading(true);
    try {
      const promises = [
        this.dispatch('auth/getCurrentUser'),
        this.dispatch('variants/getVariants'),
        this.dispatch('employee/getEmployees'),
        this.dispatch('app/GET_PAYMENT_METHODS'),
        this.dispatch('app/GET_PROVINCES'),
      ];
      await Promise.all(promises);
      this.setLoading(false);
      this.isFetched = true;
    } catch (err) {
      this.$router.push({ name: 'Login' });
      this.setLoading(false);
    }
    this.setLoading(false);
  },
};
</script>
