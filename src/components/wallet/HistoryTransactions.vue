<template>
  <div v-if="isFetched">
    <div class="inprocess-order-list" v-if="transactions.length">
      <v-data-iterator
        :items="transactions"
        :footer-props="{
          itemsPerPageText: 'Per Page',
        }"
      >
        <template v-slot:default="props">
          <CollapsibleCard v-for="(invoice, index) in props.items" :key="index">
            <template v-slot:header>
              <strong
                :class="[
                  invoice.type === 'deposit' ? 'green--text' : 'red--text',
                ]"
              >
                {{ $t(invoice.type) }}
              </strong>
            </template>
            <template v-slot:header-action>
              <span>{{
                dateFormatted(invoice.update_at, 'kk:mm - DD/MM/YYYY')
              }}</span>
            </template>
            <template v-slot:content>
              <div class="pa-3">
                <h4>
                  Trạng thái:
                  <span
                    :class="[
                      invoice.status === 'pending'
                        ? 'error--text'
                        : 'success--text',
                    ]"
                  >
                    {{ $t(invoice.status) }}
                  </span>
                </h4>
                <h4>
                  Số Xu:
                  <span
                    class="font-weight-bold success--text"
                    v-if="invoice.type === 'deposit'"
                  >
                    +{{ invoice.amount + invoice.promotion_amount }} Xu
                  </span>
                  <span class="error--text font-weight-bold" v-else>
                    -{{ invoice.amount }} Xu
                  </span>
                </h4>
                <h4>Ghi chú</h4>
                <div class="caption" style="white-space: pre-wrap">
                  {{ invoice.note }}
                </div>
              </div>
            </template>
          </CollapsibleCard>
        </template>
      </v-data-iterator>
    </div>
    <div v-else>
      <div class="box-no-data mx-3">
        <span class="mdi mdi-block-helper mdi-48px error--text"></span>
        <h4 class="mt-2">Chưa có dịch vụ nào được chọn!</h4>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions } from 'vuex';
import CollapsibleCard from '@layout/CollapsibleCard';
import { $axios } from '@/axios';

export default {
  name: 'HistoryTransactions',
  components: {
    CollapsibleCard,
  },
  props: ['customerId', 'type'],
  data: () => ({
    isFetched: false,
    transactions: [],
  }),
  async created() {
    const options = {
      params: {
        customer_id: this.customerId,
        per_page: 10000,
        page: 1,
        type: this.type,
      },
    };
    try {
      this.setLoading(true);
      const invoiceRequest = await $axios.get('/api/v1/invoice', options);
      this.transactions = invoiceRequest.data.Data;
      this.isFetched = true;
    } catch (error) {
      console.log(error);
      this.$emit('fetch-fail');
      throw error;
    } finally {
      this.setLoading(false);
    }
  },
  methods: {
    ...mapActions('intake', ['getTreatmentHistory']),
    goToIntake(id) {
      this.$router.push({ name: 'IntakeDetail', params: { id } });
    },
  },
};
</script>
<style lang="scss">
.transaction-item.v-expansion-panel {
  background-color: grey;
  &:before {
    box-shadow: none !important;
  }
}
.border-green {
  border-left: 3px solid #4caf50;
}
.border-red {
  border-left: 3px solid red;
}
</style>
