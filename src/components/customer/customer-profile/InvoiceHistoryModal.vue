<template>
  <v-dialog
    v-model="invoiceModal"
    fullscreen
    hide-overlay
    persistent
    transition="dialog-bottom-transition"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-list-item v-bind="attrs" v-on="on">
        <v-list-item-icon>
          <v-icon> mdi-clipboard-text</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title> Xem Lịch Sử Giao Dịch </v-list-item-title>
          <v-list-item-subtitle> Lịch sử các lần nạp xu </v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-action>
          <v-btn icon>
            <v-icon color="grey lighten-1">mdi-information</v-icon>
          </v-btn>
        </v-list-item-action>
      </v-list-item>
    </template>
    <v-card>
      <v-toolbar dark color="primary" class="sticky-toolbar">
        <v-toolbar-title>Xem Lịch Sử Giao Dịch</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn icon dark @click="invoiceModal = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-card-text class="profile-list-combos pt-6" v-if="invoiceModal">
        <CoreDataIlterator
          :url="'api/v1/invoice'"
          :itemsPerPage="5"
          :params="params"
          class="pa-4"
          v-if="hasCustomer"
        >
          <template v-slot:items="{ items }">
            <template v-for="(invoice, index) in items">
              <v-card class="pa-4 mb-2" :key="index">
                <div class="d-flex align-end justify-space-between mb-2">
                  <div>
                    <strong class="title primary--text"
                      >HOÁ ĐƠN #{{ invoice.id }}</strong
                    >
                  </div>
                </div>
                <div class="mb-2">
                  <div class="d-flex align-end justify-space-between">
                    <div><strong>Loại giao dịch</strong></div>
                    <v-divider class="mb-1 mx-1" />
                    <div>{{ $t(invoice.type) }}</div>
                  </div>
                  <div class="d-flex align-end justify-space-between">
                    <div><strong>Lúc</strong></div>
                    <v-divider class="mb-1 mx-1" />
                    <div>
                      {{
                        dateFormatted(invoice.update_at, 'kk:mm - DD/MM/YYYY')
                      }}
                    </div>
                  </div>
                  <div class="d-flex align-end justify-space-between">
                    <div><strong>Trạng thái:</strong></div>
                    <v-divider class="mb-1 mx-1" />
                    <div
                      :class="[
                        invoice.status === 'pending'
                          ? 'error--text'
                          : 'success--text',
                      ]"
                    >
                      {{ $t(invoice.status) }}
                    </div>
                  </div>
                </div>
                <div class="mb-2">
                  <strong>Ghi chú</strong>
                  <div class="caption" style="white-space: pre-line">
                    {{ invoice.note }}
                  </div>
                </div>
                <div class="d-flex align-end justify-space-between">
                  <v-spacer />
                  <span
                    class="title success--text font-weight-bold"
                    v-if="invoice.type === 'deposit'"
                  >
                    + {{ invoice.amount + invoice.promotion_amount }} Xu
                  </span>
                  <span class="title error--text font-weight-bold" v-else>
                    - {{ invoice.amount }} Xu
                  </span>
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
import CollapsibleCard from '@/layout/CollapsibleCard';

export default {
  name: 'InvoiceHistoryModal',
  data() {
    return {
      invoiceModal: false,
    };
  },
  components: {
    CoreDataIlterator,
    CollapsibleCard,
  },
  computed: {
    params() {
      const params = {
        customer_id: -1,
      };
      if (this.hasCustomer) {
        params.customer_id = this.customer.id;
      }
      return params;
    },
  },
};
</script>
