<template>
  <v-card
    class="dashboard-menu background--primary h-100 d-flex justify-center"
    v-if="hasUser"
  >
    <v-sheet color="transparent" min-width="100%" class="mt-10" dark>
      <div class="text-center" style="font-size: 80px; line-height: 80px">
        Hello
      </div>
      <div class="text-center mb-2">
        <span> Nice day, {{ employeeFirstName }} </span>
      </div>
      <v-divider
        color="white"
        class="mx-auto"
        style="max-width: 50px !important"
      />
      <v-sheet
        color="transparent"
        class="mt-6 d-flex justify-center mx-auto px-8"
        dark
        max-width="400px"
      >
        <v-row class="mx-0 overflow-hidden">
          <v-col cols="12" class="pt-0 px-0">
            <Chores />
          </v-col>
          <v-col cols="12" class="pt-0 px-0">
            <Reminders />
          </v-col>
          <v-col cols="12">
            <CheckinCustomer />
          </v-col>
          <v-col cols="12" v-for="btn in menus" :key="btn.pathName">
            <v-btn
              x-large
              dark
              outlined
              color="secondary"
              depressed
              block
              @click="$router.push({ name: btn.pathName })"
              >{{ btn.name }}</v-btn
            >
          </v-col>
          <v-col cols="12" v-if="isAdmin || isSupervisor">
            <Judgement />
          </v-col>
          <v-col cols="6">
            <v-btn
              x-large
              dark
              color="secondary"
              depressed
              block
              outlined
              @click="logout()"
            >
              <v-icon>mdi-logout</v-icon></v-btn
            >
          </v-col>
          <v-col cols="6">
            <v-btn
              x-large
              dark
              color="secondary"
              depressed
              outlined
              block
              @click="$router.push({ name: 'MyProfile' })"
            >
              <v-icon>mdi-account-circle</v-icon></v-btn
            >
          </v-col>
        </v-row>
      </v-sheet>
    </v-sheet>
  </v-card>
</template>
<script>
import Chores from '@/components/dashboard/Chores';
import Reminders from '@/components/dashboard/Reminders';
import Judgement from '@/components/judgement/Judgement';
import CheckinCustomer from '@/components/dashboard/CheckinCustomer';
import spaLogo from '@assets/images/grey-logo.png';
import { isEmpty } from 'lodash';
import { mapState } from 'vuex';

export default {
  name: 'Dashboard',
  components: {
    CheckinCustomer,
    Chores,
    Judgement,
    Reminders,
  },
  data() {
    return {
      spaLogo,
      pageTitle: 'Trang Chủ',
      checkInModal: false,
    };
  },
  computed: {
    ...mapState('auth', ['currentUser']),
    employeeFirstName() {
      if (this.currentUser.name) {
        return this.currentUser.name.split(' ').splice(-1)[0];
      }
      return '';
    },
    isSupervisor() {
      return this.currentUser.is_supervisor;
    },
    hasUser() {
      return !isEmpty(this.currentUser);
    },
    menus() {
      if (this.isAdmin) {
        return [
          {
            name: this.$t('menus.danh_sach_da_tao'),
            pathName: 'IntakeList',
          },
          {
            name: 'Hoá Đơn',
            pathName: 'Receipt',
          },
        ];
      }
      return [
        {
          name: this.$t('menus.dich_vu_dang_lam'),
          pathName: 'InProcessOrders',
        },
        {
          name: this.$t('menus.danh_sach_da_tao'),
          pathName: 'IntakeList',
        },
        {
          name: this.$t('Rút xu'),
          pathName: 'CashOut',
        },
      ];
    },
  },
};
</script>
