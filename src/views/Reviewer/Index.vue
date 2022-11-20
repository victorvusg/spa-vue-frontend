<template>
  <view-layout :title="title" :right="right" :left="isAdmin ? left : null">
    <v-tabs
      v-model="tabModel"
      show-arrows
      grow
      background-color="amber lighten-5"
    >
      <v-tab v-for="item in tabs" :key="item">
        {{ $t(item) }}
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tabModel">
      <v-tab-item v-for="tab in tabs" :key="tab">
        <v-card flat v-if="tabs[tabModel] === tab">
          <component :is="tab" ref="current-tab" />
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </view-layout>
</template>
<script>
import ViewLayout from '@/layout/ViewLayout.vue';
import Intakes from './UnpaidIntakes.vue';
import Invoices from './UnpaidInvoices.vue';

export default {
  components: { ViewLayout, Intakes, Invoices },
  name: 'ReviewerIndex',
  props: {},
  data() {
    return {
      title: 'Hoá Đơn Điện tử',
      right: {
        icon: 'mdi-logout',
        click: () => {
          this.logout();
        },
      },
      left: {
        icon: 'mdi-home',
        click: () => {
          this.home();
        },
      },
      tabModel: 0,
      tabs: ['intakes', 'invoices'],
    };
  },
  methods: {
    goTo(routeName, id) {
      this.$router.push({ name: routeName, params: { id } });
    },
  },
};
</script>
