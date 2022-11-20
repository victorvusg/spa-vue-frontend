<template>
  <view-layout :title="title" :right="right" :left="left" v-if="isFetched">
    <UserProfilePanel :user="customer" :role="3"> </UserProfilePanel>
    <!-- TAB MENU -->
    <v-tabs
      v-if="editMode"
      class="box-card-service next-pre-none"
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
    <v-tabs-items :touchless="true" v-model="tab" class="mt-4">
      <!-- MENU DICH VU -->
      <v-tab-item :value="'tab-menu-service'" class="px-4">
        <ServiceList />
      </v-tab-item>
      <!-- DANH SÁCH COMBO -->
      <v-tab-item :value="'tab-menu-combo'" class="px-4">
        <ListPacks />
      </v-tab-item>
      <!-- ĐƠN ĐANG TẠO -->
      <v-tab-item :value="'tab-menu-checkout'" class="px-4 pb-4">
        <!-- CHANGE PAYMENT METHOD -->
        <!-- TODO: COMMENT FOR NOW -->
        <!-- <template v-if="customer.id !== null">
          <h3>Phương thức thanh toán</h3>
          <v-radio-group
            hide-details
            :value="intake.payment_type"
            :disabled="!editMode"
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
        <v-row>
          <template v-if="editMode">
            <v-col cols="6">
              <v-btn block color="error" @click="cancelIntake()">Cancel</v-btn>
            </v-col>
            <v-col cols="6">
              <v-btn
                block
                color="primary"
                @click="saveIntake()"
                :disabled="!dirtyIntake"
                >Save</v-btn
              >
            </v-col>
          </template>
          <template v-if="!editMode && !intake.is_valid">
            <v-col cols="12">
              <v-btn block color="primary" @click="enableEditMode"
                >Chỉnh sửa</v-btn
              >
            </v-col>
          </template>
        </v-row>
      </v-tab-item>
    </v-tabs-items>
    <SuccessOverlay
      :success="success"
      :text="'Tạo thành công'"
      :btnText="'Xem chi tiết'"
    />
  </view-layout>
</template>
<script>
import UserProfilePanel from '@/components/common/UserProfilePanel';
import ListPacks from '@/components/intake/common/ListPacks';
import CheckinCart from '@/components/intake/common/CheckinCart';
import ServiceList from '@/components/intake/common/ServiceList';
import ViewLayout from '@/layout/ViewLayout';
import SuccessOverlay from '@/components/common/SuccessOverlay';
import { mapState } from 'vuex';

export default {
  name: 'IntakeDetail',
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
      title: 'Chi tiết Đơn',
      right: {
        icon: 'mdi-reload',
        click: async () => {
          await this.reload();
        },
      },
      left: {
        icon: 'mdi-home',
        click: () => {
          this.home();
        },
      },
      isInit: false,
      createdId: -1,
      success: false,
      order: null,
      tab: 'tab-menu-checkout',
      initialIntake: '',
    };
  },
  computed: {
    ...mapState('intake', ['intake', 'editMode']),
    dirtyIntake() {
      const currentIntake = JSON.stringify(this.intake);
      return currentIntake !== this.initialIntake;
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
      await this.init();
      this.setLoading(false);
    },
    async init() {
      const { id } = this.$route.params;
      if (id) {
        await this.dispatch('intake/GET_INTAKE_BY_ID', id);
        this.initialIntake = JSON.stringify(this.intake);
      }
      this.dispatch('intake/TOGGLE_INTAKE_EDIT_MODE', false);
    },
    async saveIntake() {
      this.setLoading(true);
      const isSuccess = await this.dispatch('intake/UPDATE_INTAKE');
      if (!isSuccess) {
        return;
      }
      this.dispatch('intake/TOGGLE_INTAKE_EDIT_MODE', false);
      this.setLoading(false);
    },
    async cancelIntake() {
      this.setLoading(true);
      if (!this.dirtyIntake) {
        this.dispatch('intake/TOGGLE_INTAKE_EDIT_MODE', false);
        this.setLoading(false);
        return;
      }
      await this.init();
      this.setLoading(false);
    },
    enableEditMode() {
      this.dispatch('intake/TOGGLE_INTAKE_EDIT_MODE', true);
    },
  },
  async created() {
    this.setLoading(true);
    try {
      this.isFetched = false;
      await this.init();
      this.isFetched = true;
      this.setLoading(false);
    } catch (err) {
      this.setLoading(false);
    }
  },
};
</script>
