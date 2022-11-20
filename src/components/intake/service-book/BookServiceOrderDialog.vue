<template>
  <v-dialog
    v-model="modal"
    fullscreen
    hide-overlay
    persistent
    transition="dialog-bottom-transition"
    style="border-radius: 0px !important"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        text
        color="primary"
        class="font-weight-bold"
        v-bind="attrs"
        v-on="on"
        >Book</v-btn
      >
    </template>
    <v-card>
      <v-toolbar dark color="primary" class="sticky-toolbar">
        <v-toolbar-title style="letter-spacing: 2px">CHI TIẾT</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn icon dark @click="close()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <div v-if="modal">
        <v-card-title class="headline pb-0 service-name">
          <div class="primary--text font-weight-bold">
            <span>{{ item.name }}</span>
          </div>
        </v-card-title>
        <template v-if="view === 'variants'">
          <ServiceVariants :item="item" @select="setupOrder" />
        </template>
        <template v-if="view === 'booking'">
          <OrderSetup :item="draftOrder" @cancel="close" @save="createOrder" />
        </template>
      </div>
    </v-card>
  </v-dialog>
</template>
<script>
import ServiceVariants from '@/components/intake/service-book/ServiceVariants';
import OrderSetup from '@/components/intake/common/OrderSetup';
import orderMixins from '@/mixins/order.mixins';
import { mapState } from 'vuex';

export default {
  name: 'BookServiceOrderDialog',
  mixins: [orderMixins],
  props: {
    item: {
      type: Object,
      require: true,
    },
  },
  components: {
    ServiceVariants,
    OrderSetup,
  },
  data() {
    return {
      modal: false,
      view: 'variants',
      draftOrder: {},
    };
  },
  computed: {
    ...mapState('auth', ['currentUser']),
  },
  methods: {
    setupOrder(variant) {
      const {
        price,
        name,
        // eslint-disable-next-line camelcase
        variant_category,
        id,
      } = variant;
      const note = this.generateNote('single', variant_category);
      this.draftOrder = {
        id: null,
        variant_id: id,
        name,
        amount: 1,
        unit_price: price,
        employee_id: this.isAdmin ? null : this.currentUser.id,
        combo_id: null,
        note,
        variant,
      };
      this.view = 'booking';
    },
    close() {
      this.view = 'variants';
      this.draftOrder = {};
      this.modal = false;
    },
    createOrder(order) {
      this.dispatch('intake/ADD_ORDER_TO_INTAKE', order);
      this.close();
    },
  },
};
</script>
