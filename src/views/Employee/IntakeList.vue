<template>
  <view-layout :title="title" :left="left">
    <v-menu
      v-model="menu1"
      :close-on-content-click="false"
      max-width="290"
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
    <CoreDataIlterator :url="'api/v1/intakes'" :params="params" class="pa-4">
      <template v-slot:items="{ items }">
        <template v-for="(intake, index) in items">
          <v-list-item
            class="px-0"
            :key="index"
            @click="
              $router.push({ name: 'IntakeDetail', params: { id: intake.id } })
            "
          >
            <v-list-item-content>
              <v-list-item-title>
                <span
                  class="caption"
                  :class="{
                    'primary--text font-weight-bold': !intake.is_valid,
                  }"
                >
                  {{
                    `${dateFormatted(intake.created_at, 'kk:mm - DD/MM/YYYY')}`
                  }}
                  - {{ intake.is_valid ? 'Đã đóng' : 'Đang làm' }}
                </span>
              </v-list-item-title>
              <v-list-item-subtitle class="body-1">
                <strong
                  class="pa-1"
                  :class="{
                    'error white--text': !intake.is_valid,
                    'grey white--text': intake.is_valid,
                  }"
                  >{{ intake.id }}</strong
                ><strong
                  class="ml-1"
                  :class="{
                    'primary--text': !intake.is_valid,
                  }"
                  >{{
                    intake.customer ? intake.customer.name : 'Guest'
                  }}</strong
                >
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-divider :key="`${index}_divider`" />
        </template>
      </template>
    </CoreDataIlterator>
  </view-layout>
</template>
<script>
import ViewLayout from '@/layout/ViewLayout.vue';
import CoreDataIlterator from '@/components/core/CoreDataIlterator';
import { mapGetters, mapState } from 'vuex';
import moment from 'moment';

export default {
  components: { ViewLayout, CoreDataIlterator },
  name: 'IntakeList',
  props: {},
  data() {
    return {
      title: 'Đơn đã tạo',
      left: {
        icon: 'mdi-home',
        click: () => {
          this.home();
        },
      },
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
      const params = {};
      const isEmployee = this.getRole !== 'admin' && this.getRole !== 'cashier';
      if (isEmployee) params.employee_id = this.currentUser.id;
      const date = moment(this.date);
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
