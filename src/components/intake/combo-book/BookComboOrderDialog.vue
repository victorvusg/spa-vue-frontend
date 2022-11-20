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
      <span
        class="action-text primary--text"
        v-bind="attrs"
        v-on="on"
        @click="setupComboOrder"
      >
        Chọn
      </span>
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
            <span>{{ combo.variant.name }}</span>
          </div>
        </v-card-title>
        <OrderSetup :item="draftOrder" @cancel="close" @save="createOrder" />
      </div>
    </v-card>
  </v-dialog>
</template>
<script>
import { mapState } from 'vuex';
import orderMixins from '@/mixins/order.mixins';
import OrderSetup from '@/components/intake/common/OrderSetup';

export default {
  name: 'BookComboOrderDialog',
  mixins: [orderMixins],
  props: {
    combo: {
      type: Object,
      require: true,
    },
  },
  data() {
    return {
      modal: false,
      draftOrder: {},
    };
  },
  components: {
    OrderSetup,
  },
  computed: {
    ...mapState('auth', ['currentUser']),
  },
  methods: {
    setupComboOrder() {
      const { variant } = this.combo;
      const note = this.generateNote('single', variant.variant_category);
      note.signature = null;
      this.draftOrder = {
        id: null,
        name: variant.name,
        type: this.combo.variant.service.service_category.name,
        amount: 1,
        note,
        variant_id: variant.id,
        employee_id: this.isAdmin ? null : this.currentUser.id,
        combo_id: this.combo.id,
        variant: this.combo.variant,
      };
    },
    close() {
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
