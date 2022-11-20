<template>
  <v-form ref="form" v-model="valid">
    <v-text-field
      readonly
      :value="customer.name"
      label="Tên khách hàng"
      required
      outlined
      class="error--hidden mb-2"
    ></v-text-field>
    <v-radio-group class="error--hidden" v-model="choosenOption" column>
      <v-radio
        v-for="(option, index) in options"
        :key="`option_${option.id}`"
        :value="index"
        class="mb-3"
      >
        <template v-slot:label>
          <div>
            Nạp
            <span class="font-weight-bold primary--text">
              {{ option.amount }}</span
            >
            Xu tặng
            <span class="font-weight-bold"> {{ option.promotion_amount }}</span>
            Xu
          </div>
        </template>
      </v-radio>
    </v-radio-group>
    <!-- <v-text-field
      label="Số Xu Nạp"
      v-model="topUpForm.amount"
      type="number"
      min="1"
      :rules="rules.required"
      class="no-message credit-input"
      outlined
    > -->
    <!-- <template v-slot:append>
        <v-icon color="warning">mdi-alpha-c-circle</v-icon>
      </template>
    </v-text-field> -->
    <v-text-field
      readonly
      class="money-input error--hidden"
      :value="`${(topUpForm.amount * 1000).toLocaleString()} ĐỒNG`"
      label="Thành tiền"
      required
      outlined
    ></v-text-field>
    <v-text-field
      v-if="promotionValue"
      readonly
      class="credit-input error--hidden mt-3"
      :value="promotionAmount"
      label="Số xu được tặng"
      outlined
    >
      <template v-slot:append>
        <v-icon color="warning">mdi-alpha-c-circle</v-icon>
      </template>
    </v-text-field>
    <!-- <v-checkbox
      v-model="isPromoted"
      :label="`Áp dụng khuyến mãi`"
    ></v-checkbox> -->
    <template v-if="isPromoted && topUpForm.amount">
      <div class="d-flex align-end my-4">
        <span class="font-weight-bold primary--text body-1">Khuyến Mãi</span>
        <v-divider class="ml-1" style="border-width: 2px 0 0 0 !important" />
      </div>
      <v-radio-group v-model="promotionType" row>
        <v-radio label="Theo %" value="percentage"></v-radio>
        <v-radio label="Theo số lượng" value="amount"></v-radio>
      </v-radio-group>
      <v-row class="mx-0" v-show="promotionType === 'percentage'">
        <v-col cols="6" class="pl-0 py-0">
          <v-text-field
            v-model="promotionValue"
            label="Nhập số % KM"
            min="0"
            max="100"
            type="number"
            suffix="%"
            :rules="rules.percentage"
            outlined
          ></v-text-field>
        </v-col>
        <v-col cols="6" class="pr-0 py-0">
          <v-text-field
            readonly
            class="credit-input"
            :value="promotionAmount"
            label="Số xu được tặng"
            outlined
          >
            <template v-slot:append>
              <v-icon color="warning">mdi-alpha-c-circle</v-icon>
            </template>
          </v-text-field>
        </v-col>
      </v-row>
      <v-row class="mx-0" v-show="promotionType === 'amount'">
        <v-col cols="12" class="pa-0">
          <v-text-field
            class="credit-input"
            v-model="promotionValue"
            label="Nhập số xu được tặng"
            type="number"
            outlined
            ><template v-slot:append>
              <v-icon color="warning">mdi-alpha-c-circle</v-icon>
            </template>
          </v-text-field>
        </v-col>
      </v-row>
    </template>
    <v-btn
      :disabled="!topUpForm.amount"
      color="primary"
      block
      outlined
      class="mt-4"
      @click="topUp"
    >
      TOP-UP
    </v-btn>
    <SuccessOverlay
      :success="success"
      :text="'Đã tạo gói! Vui lòng thanh toán tại lễ tân'"
      :btnText="'Quay lại'"
      @on-close="$emit('top-up-done')"
    />
  </v-form>
</template>

<script>
// @ is an alias to /src
import { axiosFactory } from '@/axios';
import SuccessOverlay from '@/components/common/SuccessOverlay';

export default {
  name: 'TopUpWallet',
  components: {
    SuccessOverlay,
  },
  data() {
    return {
      success: false,
      isPromoted: false,
      promotionType: 'amount', // percentage, amount
      promotionValue: 0,
      choosenOption: null,
      options: [
        {
          id: 1,
          amount: 2000,
          promotion_amount: 100,
        },
        {
          id: 2,
          amount: 5000,
          promotion_amount: 500,
        },
        // {
        //   id: 3,
        //   amount: 10000,
        //   promotion_amount: 1500,
        // },
        // {
        //   id: 4,
        //   amount: 20000,
        //   promotion_amount: 4000,
        // },
      ],
      topUpForm: {
        customer_id: null,
        employee_id: null,
        type: 'deposit',
        note: '',
        signature: '',
        amount: null,
        promotion_amount: 0,
      },
      valid: true,
      rules: {
        percentage: [
          (v) =>
            (parseInt(v, 10) >= 0 && parseInt(v, 10) <= 100) ||
            'Số % không hợp lệ',
        ],
        required: [(v) => !!v || 'Không được để trống'],
      },
      api: axiosFactory('api/v1/invoice'),
    };
  },
  watch: {
    promotionType() {
      this.topUpForm.promotion_amount = 0;
      this.promotionValue = 0;
    },
    isPromoted() {
      this.topUpForm.promotion_amount = 0;
      this.promotionValue = 0;
    },
    choosenOption(val) {
      if (val !== null) {
        const option = this.options[val];
        this.topUpForm.amount = option.amount;
        this.promotionValue = option.promotion_amount;
      }
    },
  },
  computed: {
    promotionAmount() {
      if (this.promotionType === 'percentage') {
        return Math.floor((this.topUpForm.amount * this.promotionValue) / 100);
      }
      return this.promotionValue;
    },
  },
  methods: {
    async topUp() {
      this.setLoading(true);
      this.topUpForm.promotion_amount = this.promotionAmount;
      this.topUpForm.customer_id = this.customer.id;
      this.topUpForm.employee_id = this.currentUser.id;
      this.topUpForm.note = this.generateTopUpNote();
      try {
        await this.api.post('', this.topUpForm);
        this.success = true;
      } catch (error) {
        console.log(error);
        throw error;
      } finally {
        this.setLoading(false);
      }
    },
    generateTopUpNote() {
      const note = `Tên khách hàng: ${this.customer.name.toUpperCase()}\nSố tiền nạp: ${(
        this.topUpForm.amount * 1000
      ).toLocaleString()} đồng ( tương ứng ${this.topUpForm.amount} Xu)`;
      if (this.promotionValue) {
        if (this.promotionType === 'percentage') {
          return `${note}\nSố xu được khuyến mãi: ${this.topUpForm.promotion_amount} Xu ( tương ứng ${this.promotionValue}% )`;
        }
        return `${note}\nSố xu được khuyến mãi: ${this.topUpForm.promotion_amount} Xu`;
      }
      return note;
    },
    clearSign() {
      this.$refs.signPad.clearSignature();
    },
    resetSignature() {
      this.topUpForm.signature = null;
    },
    confirmSign() {
      const { data } = this.$refs.signPad.saveSignature();
      this.topUpForm.signature = data;
    },
  },
  created() {
    // this.$nextTick(() => {
    //   this.$refs.signPad.resizeCanvas();
    // });
  },
};
</script>
<style lang="scss">
.money-input input {
  color: #567251 !important;
}
.credit-input input {
  color: #f2853a !important;
}
</style>
