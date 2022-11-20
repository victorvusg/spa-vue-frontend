<template>
  <v-dialog v-model="dialog" persistent max-width="400">
    <template v-slot:activator="{ attrs }">
      <div class="d-flex align-center justify-center mt-8">
        <v-btn
          color="primary"
          depressed
          outlined
          v-bind="attrs"
          @click="open"
          large
          rounded
        >
          <div class="d-flex align-center justify-space-between">
            <div class="pr-4">Thanh toán</div>
            <div class="pr-l"><v-icon>mdi-receipt</v-icon></div>
          </div>
        </v-btn>
      </div>
    </template>
    <v-card>
      <v-card-title class="text-h5 justify-center primary--text" v-if="dialog">
        THANH TOÁN
      </v-card-title>

      <v-card-text>
        <v-form v-model="formValid" ref="form">
          <div v-if="isAllowToUserPoint" class="mb-2">
            <div class="subtitle-2 mb-1 font-weight-bold">
              Tích luỹ của bạn:
            </div>
            <div v-if="usePointForm.cash_point">
              Hiện tại:
              <span class="primary--text font-weight-bold">{{
                usePointForm.cash_point | currencyFormat
              }}</span>
            </div>
            <div v-if="usePointForm.reward_remaining_points">
              Năm trước:
              <span class="error--text font-weight-bold">{{
                usePointForm.reward_remaining_points | currencyFormat
              }}</span>
              <template v-if="usePointForm.left_over_point_expired_date">
                <div class="caption error--text">
                  <i>
                    (Hạn chót sử dụng:
                    {{
                      `${dateFormatted(
                        usePointForm.left_over_point_expired_date,
                        'kk:mm - DD/MM/YYYY',
                        false,
                      )}`
                    }})
                  </i>
                </div>
              </template>
            </div>
            <v-divider class="my-2" />
            <div class="subtitle-1 mb-4">
              Bạn có thể sử dụng tích luỹ để giảm trực tiếp vào đơn này ( Số
              tiền giảm tối đa:
              <span class="font-weight-bold primary--text">
                {{ availableCashPoint | currencyFormat }})
              </span>
              <div class="error--text subtitle-1 my-2">
                <i
                  ><u>Lưu ý:</u> Đơn áp dụng giảm giá sẽ KHÔNG ĐƯỢC TÍCH LUỸ
                  ĐIỂM</i
                >
              </div>
            </div>
            <vuetify-money
              outlined
              label="Số tiền tích luỹ muốn dùng"
              :placeholder="!usePointForm.reward_points ? 'Vd: 10.000...' : ''"
              v-model="usePointForm.reward_points"
              v-bind:options="options"
              :rules="[availableCashPointRule]"
            />
            <v-divider />
          </div>
          <v-radio-group
            v-model="selectedPaymentMethod"
            :rules="[required]"
            @change="handlePaymentChange"
          >
            <template v-slot:label>
              <div class="subtitle-1 mb-2" v-if="customerBalance">
                Bạn đang có
                <span class="warning--text font-weight-bold"
                  >{{ customerBalance }} Xu</span
                >
              </div>
              <div class="subtitle-2 mb-1 font-weight-bold">
                Vui lòng chọn hình thức thanh toán:
              </div>
            </template>
            <v-radio
              v-for="method in availablePaymentMethods"
              class="mb-4"
              :key="method.id"
              :value="method.id"
            >
              <template v-slot:label>
                <div v-if="method.id === 'credit'">
                  {{ $t(method.id) }}
                  ( <span class="red--text">{{ intake.final_price }} Xu</span> )
                </div>
                <div v-else>
                  {{ $t(method.id) }}
                </div>
              </template>
            </v-radio>
          </v-radio-group>
          <template v-if="selectedPaymentMethod === 'credit'">
            <div class="d-flex align-center justify-center flex-column">
              <div class="subtitle-2 font-weight-bold">Ký xác nhận</div>
              <div v-if="signatureMissing" class="error--text caption">
                Thiếu chữ ký xác nhận !
              </div>
              <VueSignaturePad
                style="border: 1px solid black"
                height="300px"
                width="300px"
                ref="signPad"
                :options="{ penColor: '#000000' }"
              ></VueSignaturePad>
              <div class="text-right">
                <v-btn color="green darken-1" text @click="clearSign">
                  Ký lại
                </v-btn>
              </div>
            </div>
          </template>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error darken-1" text @click="close">
          Thoát
        </v-btn>
        <v-btn
          color="primary"
          text
          @click="selectPayment"
          :disabled="!formValid"
        >
          Đồng ý
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import { mapState } from 'vuex';
import { axiosFactory } from '@/axios';

export default {
  props: {
    intake: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      dialog: false,
      selectedPaymentMethod: null,
      signatureMissing: false,
      formValid: true,
      api: axiosFactory('api/v1/intakes'),
      customerAPI: axiosFactory('api/v1/customers'),
      usePointForm: {
        reward_points: 0,
        cash_point: 0,
        reward_remaining_points: 0,
        left_over_point_expired_date: '',
      },
      options: {
        locale: 'pt-BR',
        prefix: '',
        suffix: 'đồng',
        length: 9,
        precision: 0,
      },
      required: (v) => !!v || 'Vui lòng không để trống',
    };
  },
  computed: {
    ...mapState('app', ['paymentMethods']),
    availableCashPointRule() {
      return (v) => {
        const parsed = Number(v.replace(/\./g, '')) / 1000;
        return (
          !v ||
          parsed <= this.availableCashPoint ||
          'Lượng tích luỹ không hợp lệ'
        );
      };
    },
    hasCustomer() {
      return !!this.intake.customer;
    },
    availablePaymentMethods() {
      if (
        this.customerBalance &&
        this.intake.final_price &&
        this.customerBalance >= this.intake.final_price
      )
        return this.paymentMethods;
      return this.paymentMethods.filter((p) => p.id !== 'credit');
    },
    customerBalance() {
      return this.intake.customer ? this.intake.customer.balance : 0;
    },
    totalAvailablePoints() {
      return (
        this.usePointForm.cash_point + this.usePointForm.reward_remaining_points
      );
    },
    availableCashPoint() {
      if (this.intake.final_price >= this.totalAvailablePoints)
        return this.totalAvailablePoints;
      return this.intake.final_price;
    },
    isAllowToUserPoint() {
      return this.intake.final_price && this.totalAvailablePoints > 0;
    },
  },
  methods: {
    resetUsePointForm() {
      this.usePointForm.reward_points = 0;
      this.usePointForm.cash_point = 0;
      this.usePointForm.reward_remaining_points = 0;
      this.usePointForm.left_over_point_expired_date = '';
    },
    close() {
      this.dialog = false;
      this.resetUsePointForm();
    },
    async open() {
      this.selectedPaymentMethod = null;
      this.signatureMissing = false;
      this.formValid = true;
      if (this.hasCustomer) {
        const {
          cash_point,
          reward_remaining_points,
          reward_rule,
        } = this.intake.customer;

        this.usePointForm.cash_point = cash_point;
        this.usePointForm.reward_remaining_points = reward_remaining_points;
        this.usePointForm.left_over_point_expired_date =
          reward_rule.left_over_point_expired_date;
      }
      this.dialog = true;
    },
    async selectPayment() {
      this.signatureMissing = false;
      let signature = null;
      if (this.selectedPaymentMethod === 'credit') {
        const { data } = this.$refs.signPad.saveSignature();
        if (!data) {
          this.signatureMissing = true;
          return;
        }
        signature = data;
      }
      this.setLoading(true);
      try {
        const response = await this.api.put(`/${this.intake.id}/pay-up`, {
          signature,
          payment_method_id: this.selectedPaymentMethod,
          reward_points: this.usePointForm.reward_points
            ? this.usePointForm.reward_points / 1000
            : 0,
        });
        if (response.status === 200) {
          this.$emit('payment-updated');
          this.dialog = false;
        }
        this.isFetched = true;
        this.setLoading(false);
        return;
      } catch (error) {
        console.log(error);
      }
      this.setLoading(false);
    },
    clearSign() {
      this.$refs.signPad.clearSignature();
    },
    handlePaymentChange(val) {
      if (val === 'credit') {
        this.$nextTick(() => {
          this.$refs.signPad.resizeCanvas();
        });
      }
    },
  },
};
</script>
