<template>
  <div class="pa-4">
    <div></div>
    <div class="mb-2 d-flex align-center justify-space-between">
      <v-btn class="mr-1" @click="reload()" color="grey" depressed dark small>
        Tải lại<v-icon size="18px" class="ml-1">mdi-refresh</v-icon>
      </v-btn>
      <div class="d-flex align-center justify-end">
        <v-text-field
          v-model="intakeSearch"
          color="primary"
          label="Xem Mã Đơn Nhanh"
          placeholder="Mã đơn"
        />
        <v-btn
          class="ml-1"
          @click="goTo('IntakeReceipt', intakeSearch)"
          color="primary"
          depressed
          small
          :disabled="!intakeSearch"
        >
          Xem
        </v-btn>
      </div>
    </div>
    <CoreDataIlterator
      :url="'api/v1/intakes'"
      :params="params"
      :itemsPerPage="10"
      ref="list-review"
    >
      <template v-slot:items="{ items }">
        <template v-for="(intake, index) in items">
          <v-list-item class="px-0" :key="index">
            <v-list-item-content>
              <v-list-item-subtitle class="title">
                <strong class="pa-1 primary white--text">{{ intake.id }}</strong
                ><strong class="ml-1">{{
                  intake.customer ? intake.customer.name : 'Guest'
                }}</strong>
              </v-list-item-subtitle>
              <v-list-item-subtitle class="subtitle-1 mt-2">
                <div class="d-flex mb-1">
                  <div class="font-weight-bold grey--text pr-1">
                    Check-in lúc:
                  </div>
                  <div>
                    {{
                      `${dateFormatted(
                        intake.created_at,
                        'kk:mm - DD/MM/YYYY',
                      )}`
                    }}
                  </div>
                </div>
                <div class="d-flex">
                  <div class="pr-1 font-weight-bold grey--text">Số tiền:</div>
                  <div class="green--text font-weight-bold">
                    {{ intake.final_price | currencyFormat() }}
                  </div>
                </div>
              </v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn
                v-if="!intake.is_valid || !intake.payment_method_id"
                outlined
                color="primary"
                @click="goTo('IntakeReceipt', intake.id)"
                >Thanh Toán</v-btn
              >
              <v-btn
                v-else
                outlined
                color="primary"
                @click="goTo('ReviewIntake', intake.id)"
                >Đánh giá</v-btn
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
  name: 'UnpaidIntakes',
  props: {},
  data() {
    return {
      title: 'Đơn chưa thanh toán',
      date: '',
      menu1: false,
      intakeSearch: '',
    };
  },
  computed: {
    params() {
      const params = {
        is_calculated: 1,
        has_review: 0,
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
