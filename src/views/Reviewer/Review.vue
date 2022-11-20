<template>
  <view-layout :title="title" :right="right" :left="left">
    <CoreDataIlterator
      :url="'api/v1/intakes'"
      :params="params"
      :itemsPerPage="10"
      class="pa-4"
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
                <div class="d-flex">
                  <div class="font-weight-bold grey--text pr-1">Check-in lúc:</div>
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
                  <div class="green--text">
                    {{
                      intake.final_price | currencyFormat()
                    }}
                  </div>
                </div>
              </v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn outlined color="primary" @click="goToReview(intake)"
                >Thanh Toán</v-btn
              >
            </v-list-item-action>
          </v-list-item>
          <v-divider :key="`${index}_divider`" />
        </template>
      </template>
    </CoreDataIlterator>
  </view-layout>
</template>
<script>
import ViewLayout from '@/layout/ViewLayout.vue';
import CoreDataIlterator from '@/components/core/CoreDataIlterator';

export default {
  components: { ViewLayout, CoreDataIlterator },
  name: 'Review',
  props: {},
  data() {
    return {
      title: 'Đơn chưa thanh toán',
      right: {
        icon: 'mdi-reload',
        click: () => {
          this.reload();
        },
      },
      left: {
        icon: 'mdi-logout',
        click: () => {
          this.logout();
        },
      },
      date: '',
      menu1: false,
    };
  },
  computed: {
    async reload() {
      if (this.$refs['list-review']) {
        await this.$refs['list-review'].reload();
      }
    },
    params() {
      const params = {
        is_valid: 0,
        has_review: 0,
      };
      return params;
    },
  },
  methods: {
    goToReview(intake) {
      this.$router.push({ name: 'ReviewIntake', params: { id: intake.id } });
    },
  },
};
</script>
