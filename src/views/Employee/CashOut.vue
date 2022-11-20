<template>
  <view-layout :title="title" :right="right">
    <v-sheet color="accent" class="pb-4">
      <v-subheader class="px-6">Tìm kiếm khách hàng</v-subheader>
      <div class="mx-4">
        <CustomerSearch @result-click="setCustomer" />
      </div>
    </v-sheet>
    <v-alert dense outlined type="error" class="ma-4" v-if="!error.isSuccess">
      {{ error.message }}
    </v-alert>
    <v-sheet
      outlined
      v-if="resource && view === 'withdraw'"
      class="ma-4 border-radius-8"
      elevation="4"
      style="position: relative; max-height: 60%"
    >
      <v-icon
        @click="reset"
        color="red"
        class="white"
        size="28px"
        style="right: -14px; top: -14px; position: absolute"
        >mdi-close-circle</v-icon
      >
      <v-sheet class="d-flex align-center flex-column my-4 px-4">
        <div>
          <v-icon size="100" color="grey lighten-2">mdi-account-circle</v-icon>
        </div>
        <div class="title font-weight-bold">{{ resource.name }}</div>
      </v-sheet>
      <v-sheet class="px-4 mb-4">
        <v-card elevation="0" outlined class="border-radius-8 pa-4">
          <h3>Thông tin</h3>
          <div class="mb-1">
            Ngày sinh:
            <strong>{{
              resource.birthday
                ? dateFormatted(resource.birthday, 'DD/MM/YYYY')
                : '-'
            }}</strong>
          </div>
          <div>
            SĐT: <strong>{{ resource.phone | phoneFormat }}</strong>
          </div>
        </v-card>
      </v-sheet>
      <v-sheet class="px-4 mb-4">
        <v-card elevation="0" outlined class="border-radius-8">
          <v-card-text>
            <div
              class="border-radius-8 grey lighten-4 pa-2 d-flex align-center"
            >
              <v-icon color="primary" class="mr-1">mdi-alert-circle</v-icon>
              <span>
                Số dư Ví:
                <strong class="ml-1">
                  {{ resource.balance | coin }}
                </strong>
              </span>
            </div>
            <div class="mt-1 mb-3 text-right font-italic caption px-2">
              1 xu = 1.000 đồng
            </div>
            <v-form ref="addCustomerForm" v-model="valid">
              <v-text-field
                class="border-radius-8"
                v-model="value"
                label="Số xu cần rút"
                outlined
                :placeholder="value ? '' : '0 Xu'"
                clearable
                :rules="balanceRules"
                type="number"
                pattern="[0-9]*"
                inputmode="number"
              ></v-text-field>
            </v-form>
            <template>
              <div class="subtitle-2 font-weight-bold text-center">
                Ký tên xác nhận
              </div>
              <template v-if="signature">
                <img
                  :src="signature"
                  height="300px"
                  width="100%"
                  alt="saved signature"
                  style="
                    margin-left: auto;
                    margin-right: auto;
                    border-radius: 8px;
                    border: 1px solid rgba(0, 0, 0, 0.38);
                  "
                />
              </template>
              <template v-else>
                <VueSignaturePad
                  height="300px"
                  width="100%"
                  ref="signPad"
                  style="
                    border-radius: 8px;
                    border: 1px solid rgba(0, 0, 0, 0.38);
                  "
                  :options="{ penColor: '#000000' }"
                ></VueSignaturePad>
              </template>
            </template>
            <v-row>
              <v-col cols="6" class="pb-0">
                <v-btn
                  color="green darken-1"
                  text
                  @click="confirmSign"
                  v-if="!signature"
                  block
                >
                  Xác nhận
                </v-btn>
              </v-col>
              <v-col cols="6" class="pb-0">
                <v-btn color="green darken-1" text @click="clearSign" block>
                  Ký lại
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
        <v-dialog
          v-model="dialog"
          persistent
          max-width="290"
          content-class="border-radius-8"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              v-bind="attrs"
              v-on="on"
              block
              dark
              :disabled="!isFormValid"
              depressed
              color="primary"
              elevation="0"
              class="mt-6 border-radius-8"
              >Rút Xu</v-btn
            >
          </template>
          <v-card>
            <v-card-title class="text-h5"> Xác nhận rút xu </v-card-title>
            <v-card-text
              >Số lượng xu được rút sẽ trừ trực tiếp vào số dư hiện tại của
              khách hàng và
              <strong class="red--text"
                >không thể hoàn tác.</strong
              ></v-card-text
            >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="green darken-1" text @click="dialog = false">
                Huỷ bỏ
              </v-btn>
              <v-btn color="green darken-1" text @click="submit">
                Xác nhận
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-sheet>
    </v-sheet>
    <template v-if="view === 'instruction'">
      <v-sheet class="pa-4">
        <v-card elevation="0" outlined class="border-radius-8 pa-4">
          <h3 class="primary--text">Hướng dẫn</h3>
          <ul>
            <li>Tìm kiếm khách hàng bằng tên (hoặc số điện thoại).</li>
            <li>Chọn khách hàng và tiến hành nhập số xu muốn rút.</li>
            <li>
              <span class="font-italic text-decoration-underline">Lưu ý:</span>
              Giao dịch rút xu <span class="red--text">chỉ hợp lệ</span> khi có
              <strong>chữ ký khách hàng.</strong>
            </li>
          </ul>
        </v-card>
      </v-sheet>
    </template>
    <template v-if="view === 'success'">
      <v-sheet class="pa-4">
        <v-card elevation="0" outlined class="border-radius-8 pa-4">
          <div class="text-center">
            <lottie
              :options="lottieOptions"
              :height="180"
              :width="180"
              class="mt-n4"
            />
            <div
              class="
                text-center
                title
                font-weight-bold
                primary--text
                mt-n4
                mb-4
              "
            >
              RÚT XU THÀNH CÔNG
            </div>
          </div>
          <div class="body-1">
            <div class="d-flex align-center justify-space-between">
              Họ tên <strong>{{ resource.name }}</strong>
            </div>
            <div class="d-flex align-center justify-space-between">
              Ngày sinh
              <strong>{{
                resource.birthday
                  ? dateFormatted(resource.birthday, 'DD/MM/YYYY')
                  : '-'
              }}</strong>
            </div>
            <div class="d-flex align-center justify-space-between">
              SĐT <strong>{{ resource.phone | phoneFormat }}</strong>
            </div>
            <div class="d-flex align-center justify-space-between">
              Đã rút
              <span class="grey--text text--darken-2">
                <strong>{{ value | coin }}</strong>
                (tương ứng <strong>{{ value | currencyFormat }}</strong
                >)</span
              >
            </div>
            <div class="d-flex align-center justify-space-between">
              Số xu hiện tại <strong>{{ remainingBalance | coin }}</strong>
            </div>
            <div class="d-flex align-center justify-space-between mt-4">
              <v-btn
                block
                class="border-radius-8"
                color="primary darken-1"
                @click="home"
                elevation="0"
              >
                Về trang chủ
              </v-btn>
            </div>
          </div>
        </v-card>
      </v-sheet>
    </template>
  </view-layout>
</template>
<script>
import ViewLayout from '@/layout/ViewLayout';
import CustomerSearch from '@/components/customer/CustomerSearch';
import * as animationData from '@assets/json/checkmark.json';
import Lottie from 'vue-lottie';

export default {
  name: 'CashOut',
  components: {
    ViewLayout,
    CustomerSearch,
    Lottie,
  },
  data() {
    return {
      title: 'Rút xu ( Cashout )',
      right: {
        icon: 'mdi-home',
        click: () => {
          this.home();
        },
      },
      searchType: {
        name: 'text',
        phone: 'number',
      },
      view: 'instruction', // instruction - withdraw - success
      lottieOptions: { animationData: animationData.default, loop: false },
      searchParam: 'name',
      signature: null,
      resource: null,
      value: null,
      valid: true,
      dialog: false,
      error: {
        isSuccess: true,
        message: '',
      },
    };
  },
  methods: {
    setCustomer(customer) {
      this.resource = customer;
      this.view = 'withdraw';
      this.$nextTick(() => {
        this.$refs.signPad.resizeCanvas();
      });
    },
    clearSign() {
      this.signature = null;
      this.$nextTick(() => {
        this.$refs.signPad.clearSignature();
      });
    },
    confirmSign() {
      const { data } = this.$refs.signPad.saveSignature();
      this.signature = data;
    },
    reset() {
      this.view = 'instruction';
      this.signature = null;
      this.resource = null;
      this.value = null;
      this.valid = true;
      this.error = {
        isSuccess: true,
        message: '',
      };
    },
    async submit() {
      this.error = {
        isSuccess: true,
        message: '',
      };
      this.dialog = false;
      this.setLoading(true);
      const { isSuccess, message } = await this.dispatch('customer/CASH_OUT', {
        id: this.resource.id,
        amount: this.value,
        employee_id: this.currentUser.id,
        signature: this.signature,
      });
      this.setLoading(false);
      if (isSuccess) {
        this.view = 'success';
      } else {
        this.error = {
          isSuccess,
          message,
        };
        window.scrollTo(0, 0);
      }
    },
  },
  computed: {
    remainingBalance() {
      return (
        (this.resource && this.value && this.resource.balance - this.value) ||
        null
      );
    },
    balanceRules() {
      const rules = [];
      if (this.resource) {
        rules.push(
          (v) =>
            !v ||
            (v > 0 && v <= this.resource.balance) ||
            'Số tiền lớn hơn số dư trong ví. Vui lòng nhập lại',
        );
      }
      return rules;
    },
    isFormValid() {
      return this.value && this.valid && this.signature;
    },
  },
};
</script>
