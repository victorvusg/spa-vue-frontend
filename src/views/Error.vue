<template>
  <v-container
    class="text-center"
    fill-height
    style="height: calc(100vh - 58px)"
    v-if="currentUser"
  >
    <v-row align="center">
      <v-col>
        <h1 class="display-2 primary--text">Whoops, 404</h1>

        <p>{{ $t('error.not_exist') }}</p>

        <v-btn color="primary" outlined @click="getOutOfHere(role)">
          <template v-if="role === reviewerRole">{{
            $t('error.review')
          }}</template>
          <template v-else>{{ $t('error.main') }}</template>
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { mapState } from 'vuex';
import { getSavedUser } from '@helpers/auth.service';

export default {
  name: 'Error',
  computed: {
    ...mapState('auth', ['currentUser']),
    role() {
      return getSavedUser().role;
    },
  },
  methods: {
    getOutOfHere(role) {
      if (role === this.reviewerRole) {
         this.$router.push({ name: 'Receipt' });
      } else {
        this.$router.push({ name: 'Dashboard' });
      }
    },
  },
};
</script>
