<template>
  <view-layout :title="title" :left="left">
    <v-radio-group v-model="isValid" row class="mt-4 px-4" hide-details>
      <v-radio label="Đang được giao" :value="0"></v-radio>
      <v-radio label="Đã xong" :value="1"></v-radio>
    </v-radio-group>
    <v-menu
      v-model="menu1"
      :close-on-content-click="false"
      max-width="290"
      v-if="isValid"
      offset-y
    >
      <template v-slot:activator="{ on, attrs }">
        <v-text-field
          class="error--hidden px-4 mt-4"
          :value="formattedDate"
          clearable
          label="Xem đơn theo ngày"
          readonly
          v-bind="attrs"
          v-on="on"
          @click:clear="date = null"
        ></v-text-field>
      </template>
      <v-date-picker
        v-model="date"
        @change="menu1 = false"
        locale="vi"
      ></v-date-picker>
    </v-menu>
    <CoreDataIlterator :url="'api/v1/orders'" :params="params" class="pa-4">
      <template v-slot:items="{ items }">
        <template v-for="(order, index) in items">
          <OrderListItem :order="order" :key="index" />
          <v-divider :key="`${index}_divider`" />
        </template>
      </template>
    </CoreDataIlterator>
  </view-layout>
</template>
<script>
import ViewLayout from '@/layout/ViewLayout.vue';
import CoreDataIlterator from '@/components/core/CoreDataIlterator';
import OrderListItem from '@/components/order/OrderListItem';
import { mapGetters, mapState } from 'vuex';
import moment from 'moment';

export default {
  components: { ViewLayout, CoreDataIlterator, OrderListItem },
  name: 'InProcessOrders',
  props: {},
  data() {
    return {
      title: 'Đang Được Giao',
      left: {
        icon: 'mdi-home',
        click: () => {
          this.home();
        },
      },
      isValid: 0,
      date: '',
      menu1: false,
    };
  },
  computed: {
    ...mapState('auth', ['currentUser']),
    ...mapGetters('auth', ['getRole']),
    formattedDate() {
      return this.date ? moment(this.date).local().format('DD/MM/YYYY') : '';
    },
    params() {
      const params = {
        is_valid: this.isValid,
      };
      const isEmployee = this.getRole !== 'admin' && this.getRole !== 'cashier';
      if (isEmployee) params.employee_id = this.currentUser.id;
      const date = moment(this.date);
      // eslint-disable-next-line no-underscore-dangle
      if (date._isValid) {
        params.from_date = date.startOf('day').format('yyyy-MM-DD HH:mm:ss');
        params.to_date = date.endOf('day').format('yyyy-MM-DD HH:mm:ss');
      }

      return params;
    },
  },
  methods: {},
};
</script>
