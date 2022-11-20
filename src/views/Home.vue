<template>
</template>

<script>
// @ is an alias to /src
import { getSavedUser } from '@/helpers/auth.service';

export default {
  name: 'Home',
  data() {
    return {
      isFetched: false,
    };
  },
  created() {
    const { role } = getSavedUser();
    let routeName = 'Error';
    if (role) {
      const employeePrmission = ['admin', 'cashier', 'ktv'];
      const reviewerPermission = ['admin', 'cashier', 'ktv', 'reviewer'];
      if (employeePrmission.includes(role)) {
        routeName = 'Dashboard';
      } else if(reviewerPermission.includes(role)) {
          routeName = 'Receipt';
      }
    }
    this.$router.push({name: routeName});
  },
};
</script>
