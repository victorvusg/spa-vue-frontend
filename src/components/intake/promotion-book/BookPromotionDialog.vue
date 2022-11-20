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
            <span>Gói Ưu Đãi</span>
          </div>
        </v-card-title>
        <template v-if="view === 'variants'">
          <Promotion :service="item" @select="setupPromotionOrder" />
        </template>
        <template v-if="view === 'booking'">
          <PromotionSetup
            :items="draftOrders"
            @cancel="close"
            @save="createPromotionOrder"
          />
        </template>
      </div>
    </v-card>
  </v-dialog>
</template>
<script>
import Promotion from '@/components/intake/promotion-book/Promotion';
import PromotionSetup from '@/components/intake/common/PromotionSetup';
import orderMixins from '@/mixins/order.mixins';
import { mapState } from 'vuex';

export default {
  name: 'BookPromotionDialog',
  mixins: [orderMixins],
  props: {
    // Service Object
    item: {
      type: Object,
      require: true,
    },
  },
  components: {
    Promotion,
    PromotionSetup,
  },
  data() {
    return {
      modal: false,
      view: 'variants',
      draftOrders: [],
    };
  },
  computed: {
    ...mapState('auth', ['currentUser']),
    isPromotionBooking() {
      return this.type === 'promotion';
    },
  },
  methods: {
    generatePromotionHash() {
      return (
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15)
      );
    },
    setupPromotionOrder(variants) {
      const promotionHash = this.generatePromotionHash();
      this.draftOrders = variants.map((variant) => ({
        id: null,
        name: `${variant.name} (${this.item.name})`,
        amount: 1,
        note: this.generateNote('single', variant.variant_category),
        variant_id: variant.id,
        employee_id: this.isAdmin ? null : this.currentUser.id,
        combo_id: null,
        variant,
        promotion_hash: promotionHash,
      }));
      this.view = 'booking';
    },
    close() {
      this.view = 'variants';
      this.draftOrder = [];
      this.modal = false;
    },
    createPromotionOrder(orders) {
      orders.forEach((element) => {
        this.dispatch('intake/ADD_ORDER_TO_INTAKE', element);
      });
      this.close();
    },
  },
};
</script>
