<template>
  <v-dialog
    v-model="dialog"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
    eager
  >
    <template v-slot:activator="{ on }">
      <v-list-item v-on="on">
        <v-list-item-content>
          <v-list-item-title class="caption">
            <span class="font-weight-bold error--text">[{{ order.id }}]</span>
            {{ `Lúc ${dateFormatted(order.created_at, 'kk:mm - DD/MM/YYYY')}` }}
            <span class="font-weight-bold" v-if="order.combo_id !== null"
              >(Gói)</span
            >
          </v-list-item-title>
          <v-list-item-title
            class="primary--text font-weight-bold"
            v-text="order.name"
          />
          <v-list-item-subtitle class="font-weight-bold grey--text caption">
            <span>
              Mã đơn -
              <strong>{{ order.intake_id }}</strong>
            </span>
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </template>
    <v-card>
      <v-toolbar dark color="primary" class="sticky-toolbar">
        <v-toolbar-title>Chi tiết order</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon dark @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <OrderSetup :item="item" />
    </v-card>
  </v-dialog>
</template>
<script>
import OrderSetup from '@/components/intake/common/OrderSetup';

export default {
  name: 'OrderListItem',
  components: { OrderSetup },
  props: {
    order: {
      required: true,
    },
  },
  data() {
    return { dialog: false, item: {} };
  },
  created() {
    const note = JSON.parse(this.order.note);
    this.item = { ...this.order, note };
  },
};
</script>
