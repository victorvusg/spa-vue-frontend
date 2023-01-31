<template>
  <div class="order-list-wrap">
    <v-row>
      <v-col cols="12" class="py-0"> <h3>Phiếu thanh toán</h3> </v-col>
    </v-row>
    <v-row>
      <v-col cols="4" class="py-0">Phụ trách</v-col>
      <v-col cols="8" class="py-0">{{ currentUser.name }}</v-col>
    </v-row>
    <v-row>
      <v-col cols="4" class="py-0">Giá</v-col>
      <v-col cols="8" class="py-0">
        <span class="green--text">
          {{ totalPrice | currencyFormat }}
        </span>
      </v-col>
    </v-row>
    <v-list two-line class="mt-2">
      <h3>Danh sách trị liệu</h3>
      <template v-for="(order, index) in orders">
        <ViewOrderDialog :key="index" :order="order" :orderIndex="index" />
        <v-divider :key="`divder_${index}`" />
      </template>
    </v-list>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import orderMixins from '@mixins/order.mixins';
import ViewOrderDialog from '@/components/intake/common/ViewOrderDialog';

export default {
  name: 'CheckinCart',
  mixins: [orderMixins],
  components: {
    ViewOrderDialog,
  },
  data() {
    return {
      showDelete: false,
      editOrderModal: {
        status: false,
        selectedOrder: null,
      },
    };
  },
  computed: {
    ...mapState('employee', ['ktvList']),
    ...mapState('intake', ['intake']),
    ...mapGetters({
      orders: 'intake/getOrders',
    }),
    totalPrice() {
      return this.orders.reduce((total, order) => {
        let price = 0;
        const priceField = 'sale_price';
        if (order.type === 'promotion') {
          total += order[priceField];
        } else {
          if (order.combo_id === null && !order.variant.is_free) {
            price = order.variant[priceField] * order.amount;
          }
          total += price;
        }
        return total;
      }, 0);
    },
    showOrders() {
      return this.orders.length ? 0 : -1;
    },
  },
  methods: {
    openOrderEditor(type, index) {
      this.editingIndex = index;
      this.editOrderModal.status = true;
      this.editOrderModal.selectedOrder = JSON.parse(
        JSON.stringify(this.orders[index]),
      );
    },
    deleteOrder(index) {
      this.showDelete = -1;
      this.orders.splice(index, 1);
      this.$emit('update-order-list', this.orders);
    },
    saveEditOrder(order) {
      const index = this.editingIndex;
      Object.assign(this.orders[index], order);
      this.$emit('update-order-list', this.orders);
    },
    saveEditedPromotion(promotionOrder) {
      const index = this.editingIndex;
      Object.assign(this.orders[index], promotionOrder);
      this.$emit('update-order-list', this.orders);
    },
  },
};
</script>
