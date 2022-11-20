<template>
  <v-dialog
    v-model="dialog"
    fullscreen
    hide-overlay
    persistent
    transition="dialog-bottom-transition"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn icon v-bind="attrs" v-on="on">
        <v-icon color="green lighten-1">mdi-information</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-toolbar dark color="primary" class="sticky-toolbar">
        <v-toolbar-title>Các Gói Nạp đã Tạo</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn icon dark @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-card-text class="pa-4" v-if="dialog">
        <CoreDataIlterator
          :url="'api/v1/invoice'"
          :params="params"
          class="pa-4"
        >
          <template v-slot:items="{ items }">
            <template v-for="invoice in items">
              <v-card class="mb-4 pa-4" :key="invoice.id">
                <div class="title primary--text mb-2">
                  INVOICE#{{ invoice.id }}
                </div>
                <div
                  class="body-1 d-flex align-end justify-space-between caption"
                >
                  <div class="font-weight-bold">Khách hàng</div>
                  <v-divider class="mb-1"></v-divider>
                  <div>{{ invoice.customer.name }}</div>
                </div>
                <div
                  class="
                    body-1
                    d-flex
                    align-end
                    justify-space-between
                    mb-2
                    caption
                  "
                >
                  <div class="font-weight-bold">Giá</div>
                  <v-divider class="mb-1"></v-divider>
                  <div>{{ invoice.amount | currencyFormat }}</div>
                </div>
                <div class="body-1 d-flex align-end justify-space-between">
                  <div class="font-weight-bold caption">Hoa Hồng</div>
                  <v-divider class="mb-1"></v-divider>
                  <div class="font-weight-bold green--text">
                    {{ invoice.topup_commission | currencyFormat }}
                  </div>
                </div>
              </v-card>
            </template>
          </template>
        </CoreDataIlterator>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
// @ is an alias to /src
import CoreDataIlterator from '@/components/core/CoreDataIlterator';

export default {
  name: 'MyTopUpSale',
  data() {
    return {
      dialog: false,
    };
  },
  computed: {
    params() {
      return {
        employee_id: this.currentUser.id,
        is_valid: 1,
        type: 'deposit',
      };
    },
  },
  components: {
    CoreDataIlterator,
  },
};
</script>
