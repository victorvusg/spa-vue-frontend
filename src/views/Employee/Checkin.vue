<template>
  <view-layout :title="title" :right="right" :left="left" v-if="isFetched">
    <UserProfilePanel :user="customer" :role="3"> </UserProfilePanel>
    <!-- TAB MENU -->
    <v-tabs
      class="box-card-service next-pre-none mb-4"
      fixed-tabs
      v-model="tab"
    >
      <v-tab :href="`#tab-menu-service`" class="header-card-service-item">
        Dịch Vụ
      </v-tab>
      <v-tab
        :href="`#tab-menu-combo`"
        class="header-card-service-item"
        v-if="customer.id !== null"
        >Gói</v-tab
      >
      <v-tab :href="`#tab-menu-checkout`" class="header-card-service-item">
        <v-badge color="red" :content="`${intake.orders.length}`"> Đơn</v-badge>
        <span class="header-card-checkout"></span>
      </v-tab>
    </v-tabs>
    <v-tabs-items :touchless="true" v-model="tab">
      <!-- MENU DICH VU -->
      <v-tab-item :value="'tab-menu-service'" class="px-4" eager>
        <ServiceList />
      </v-tab-item>
      <!-- DANH SÁCH COMBO -->
      <v-tab-item :value="'tab-menu-combo'" class="px-4" eager>
        <ListPacks />
      </v-tab-item>
      <!-- ĐƠN ĐANG TẠO -->
      <v-tab-item :value="'tab-menu-checkout'" class="px-4 pb-4" eager>
        <!-- CHANGE PAYMENT METHOD -->
        <!-- TODO: COMMENT FOR NOW -->
        <!-- <template v-if="customer.id !== null">
          <h3>Phương thức thanh toán</h3>
          <v-radio-group
            hide-details
            :value="intake.payment_type"
            @change="dispatch('intake/CHANGE_PAYMENT_TYPE', $event)"
          >
            <v-radio color="green" value="cash">
              <template v-slot:label>
                <div
                  :class="[
                    intake.payment_type === 'cash'
                      ? 'green--text font-weight-bold'
                      : '',
                  ]"
                >
                  Thanh toán bằng tiền mặt/thẻ tín dụng
                </div>
              </template>
            </v-radio>
            <v-radio color="warning" value="credit" :disabled="!isEnoughCredit">
              <template v-slot:label>
                <div
                  :class="[
                    intake.payment_type === 'credit'
                      ? 'warning--text font-weight-bold'
                      : '',
                  ]"
                >
                  Thanh Toán Bằng Xu
                </div>
              </template>
            </v-radio>
          </v-radio-group>
        </template> -->
        <!-- LIST OF ORDERS -->
        <CheckinCart class="mt-4" />
        <div class="intake-btn-group mx-2 mt-4">
          <v-btn
            class="v-btn--block"
            color="primary"
            :disabled="invalidIntake"
            @click="createIntake()"
            >Tạo đơn</v-btn
          >
        </div>
      </v-tab-item>
    </v-tabs-items>
    <SuccessOverlay
      :success="success"
      :text="'Tạo thành công'"
      :btnText="'Xem chi tiết'"
      @on-close="viewDetail"
    />
  </view-layout>
</template>
<script>
import UserProfilePanel from '@/components/common/UserProfilePanel';
import ListPacks from '@/components/intake/common/ListPacks';
import CheckinCart from '@/components/intake/common/CheckinCart';
import ServiceList from '@/components/intake/common/ServiceList';
import { mapState } from 'vuex';
import ViewLayout from '@/layout/ViewLayout';
import SuccessOverlay from '@/components/common/SuccessOverlay';

export default {
  name: 'Checkin',
  components: {
    UserProfilePanel,
    ViewLayout,
    ListPacks,
    CheckinCart,
    ServiceList,
    SuccessOverlay,
  },
  data() {
    return {
      isFetched: false,
      title: 'Tạo đơn',
      right: {
        icon: 'mdi-reload',
        click: async () => {
          await this.reload();
        },
      },
      left: {
        icon: 'mdi-chevron-left',
        click: () => {
          this.back();
        },
      },
      isInit: false,
      createdId: -1,
      success: false,
      order: null,
      tab: null,
    };
  },
  computed: {
    ...mapState('intake', ['intake']),
    invalidIntake() {
      return !this.intake.orders.length;
    },
    isEnoughCredit() {
      const check = this.checkBalance(this.intake, this.customer.balance);
      return check;
    },
  },
  methods: {
    async reload() {
      this.setLoading(true);
      await this.dispatch('variants/getVariants');
      this.setLoading(false);
    },
    async GET_CUSTOMER_BY_ID() {
      const { customerId } = this.$route.params;
      if (customerId) {
        await this.dispatch('customer/GET_CUSTOMER_BY_ID', customerId);
      }
    },
    async init() {
      this.dispatch('intake/TOGGLE_INTAKE_EDIT_MODE', true);
      this.isFetched = false;
      this.setLoading(true);
      await this.GET_CUSTOMER_BY_ID();
      this.dispatch('intake/INIT_NEW_INTAKE', this.customer.id);
      this.setLoading(false);
      this.isFetched = true;
    },
    viewDetail() {
      this.success = false;
      this.$router.push({
        name: 'IntakeDetail',
        params: { id: this.createdId },
      });
    },
    async createIntake() {
      this.setLoading(true);
      this.createdId = await this.dispatch('intake/CREATE_INTAKE');
      if (this.createdId === -1) {
        return;
      }
      this.success = true;
      this.setLoading(false);
    },
  },
  async created() {
    await this.init();
  },
  async destroyed() {
    this.dispatch('intake/TOGGLE_INTAKE_EDIT_MODE', false);
    await this.dispatch('intake/REMOVE_INTAKE');
  },
};
</script>
