<template>
  <div class="pa-4">
    <div class="mb-2 d-flex align-center justify-space-between">
      <v-btn class="mr-1" @click="reload()" color="grey" depressed dark small>
        Tải lại<v-icon size="18px" class="ml-1">mdi-refresh</v-icon>
      </v-btn>
      <div class="d-flex align-center justify-end">
        <v-text-field
          v-model="invoiceSearch"
          color="primary"
          label="Xem Đơn Nạp Xu Nhanh"
          placeholder="Mã Nạp Xu"
        />
        <v-btn
          class="ml-1"
          @click="goTo('DepositReceipt', invoiceSearch)"
          color="primary"
          depressed
          small
          :disabled="!invoiceSearch"
        >
          Xem
        </v-btn>
      </div>
    </div>
    <CoreDataIlterator
      :url="'api/v1/invoice'"
      :params="params"
      :itemsPerPage="10"
      ref="list-review"
    >
      <template v-slot:items="{ items }">
        <template v-for="(invoice, index) in items">
          <v-list-item class="px-0" :key="index">
            <v-list-item-content>
              <v-list-item-subtitle class="title">
                <strong class="pa-1 primary white--text">{{
                  invoice.id
                }}</strong
                ><strong class="ml-1">{{ invoice.customer.name }}</strong>
              </v-list-item-subtitle>
              <v-list-item-subtitle class="subtitle-1 mt-2">
                <div class="d-flex mb-1">
                  <div class="font-weight-bold grey--text pr-1">
                    Tạo lúc:
                  </div>
                  <div>
                    {{
                      `${dateFormatted(
                        invoice.created_at,
                        'kk:mm - DD/MM/YYYY',
                      )}`
                    }}
                  </div>
                </div>
                <div class="d-flex">
                  <div class="pr-1 font-weight-bold grey--text">
                    Số tiền nạp:
                  </div>
                  <div class="green--text font-weight-bold">
                    {{ invoice.amount | currencyFormat() }}
                  </div>
                </div>
              </v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn
                outlined
                color="primary"
                @click="goTo('DepositReceipt', invoice.id)"
                >Thanh Toán</v-btn
              >
            </v-list-item-action>
          </v-list-item>
          <v-divider :key="`${index}_divider`" />
        </template>
      </template>
    </CoreDataIlterator>
  </div>
</template>
<script>
import ViewLayout from '@/layout/ViewLayout.vue';
import CoreDataIlterator from '@/components/core/CoreDataIlterator';

export default {
  components: { ViewLayout, CoreDataIlterator },
  name: 'UnpaidInvoices',
  props: {},
  data() {
    return {
      date: '',
      menu1: false,
      invoiceSearch: '',
    };
  },
  computed: {
    params() {
      const params = {
        type: 'deposit',
        status: 'pending',
      };
      return params;
    },
  },
  methods: {
    async reload() {
      if (this.$refs['list-review']) {
        await this.$refs['list-review'].reload();
      }
    },
    goTo(routeName, id) {
      this.$router.push({ name: routeName, params: { id } });
    },
  },
};
</script>
