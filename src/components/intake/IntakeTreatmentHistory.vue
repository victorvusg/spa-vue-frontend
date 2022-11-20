<template>
  <div class="intake-list py-5" v-if="isFetched">
    <div class="inprocess-order-list" v-if="intakes.length">
      <v-data-iterator
        :items="intakes"
        :footer-props="{
          itemsPerPageText: 'Per Page',
        }"
      >
        <template v-slot:default="props">
          <CollapsibleCard
            class="mb-3"
            v-for="(item, index) in props.items"
            :key="index"
          >
            <template v-slot:header>
              <strong>Check-in {{ item.id }}</strong>
            </template>

            <template v-slot:header-action>
              <span>{{ dateFormatted(item.created_at, 'DD/MM/YYYY') }}</span>
            </template>

            <template v-slot:content>
              <div class="pa-3">
                <div>
                  <strong>Các trị liệu</strong>
                </div>
                <div>
                  <div v-for="order in item.orders" :key="order.id">
                    <div class="subtitle-1 font-weight-bold primary--text">
                      {{ order.variant.name }}
                    </div>
                    <div class="caption" style="font-size: 10px">
                      Phụ trách: {{ order.employee.name }}
                    </div>
                  </div>
                </div>
                <div class="text-right">
                  <v-btn
                    text
                    depressed
                    color="primary"
                    x-small
                    @click="
                      $router.push({
                        name: 'IntakeDetail',
                        params: { id: item.id },
                      })
                    "
                    >Xem</v-btn
                  >
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

export default {
  name: 'IntakeTreatmentHistory',
  data: () => ({
    isFetched: false,
    selectedOrder: null,
    intakes: [],
  }),
  components: {
    CollapsibleCard,
  },
  props: ['customerId'],
  async created() {
    const options = {
      params: {
        customer_id: this.customerId,
        is_valid: 1,
        per_page: 10000,
        page: 1,
      },
    };
    this.intakes = await this.getTreatmentHistory(options);
    this.isFetched = true;
  },
  methods: {
    ...mapActions('intake', ['getTreatmentHistory']),
    goToIntake(id) {
      this.$router.push({ name: 'IntakeDetail', params: { id } });
    },
  },
};
</script>
