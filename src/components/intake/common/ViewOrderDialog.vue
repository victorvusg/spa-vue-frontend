<template>
  <v-dialog
    v-model="modal"
    fullscreen
    hide-overlay
    persistent
    transition="dialog-bottom-transition"
    style="border-radius: 0px !important"
  >
    <template v-slot:activator="{ on }">
      <v-list-item
        class="py-0 px-2"
        v-ripple="{ center: true }"
        v-on="on"
        @click="open"
      >
        <template>
          <v-list-item-avatar size="24px" class="mr-2" v-if="editMode">
            <v-icon size="20px" color="red" @click.stop="deleteOrder"
              >mdi mdi-close-circle</v-icon
            >
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title
              style="white-space: wrap !important"
              class="primary--text text-uppercase pb-1"
              v-text="order.name"
            ></v-list-item-title>
            <div class="grey--text pt-1" style="font-size: 13px">
              {{ getKTVName(order.employee_id) }}
            </div>
          </v-list-item-content>
          <v-list-item-action>
            <v-list-item-action-text
              class="primary--text"
              style="font-size: 0.9rem"
            >
              <template v-if="order.combo_id == null">
                <span class="green--text">
                  {{ (order.variant.sale_price * order.amount) | currencyFormat }}
                </span>
              </template>
              <template v-else>
                <i class="primary--text">Gói</i>
              </template>
            </v-list-item-action-text>
          </v-list-item-action>
        </template>
      </v-list-item>
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
            <span>{{ order.name }}</span>
          </div>
        </v-card-title>
        <OrderSetup :item="draftOrder" @cancel="close" @save="saveOrder" />
      </div>
    </v-card>
  </v-dialog>
</template>
<script>
import OrderSetup from '@/components/intake/common/OrderSetup';
import orderMixins from '@/mixins/order.mixins';
import { cloneDeep } from 'lodash';
import { mapState } from 'vuex';

export default {
  name: 'ViewOrderDialog',
  mixins: [orderMixins],
  props: {
    orderIndex: {
      require: true,
    },
    order: {
      type: Object,
      require: true,
    },
  },
  components: { OrderSetup },
  data() {
    return {
      modal: false,
      draftOrder: {},
    };
  },
  computed: {
    ...mapState('auth', ['currentUser']),
  },
  methods: {
    getKTVName(id) {
      const found = this.ktvList.find((ktv) => ktv.id === id);
      return found ? found.name : 'unknown';
    },
    open() {
      this.draftOrder = cloneDeep(this.order);
    },
    close() {
      this.draftOrder = {};
      this.modal = false;
    },
    saveOrder(order) {
      this.dispatch('intake/SAVE_ORDER', { order, index: this.orderIndex });
      this.close();
    },
    deleteOrder() {
      this.dispatch('intake/REMOVE_ORDER_FROM_INTAKE', this.orderIndex);
    },
  },
};
</script>
