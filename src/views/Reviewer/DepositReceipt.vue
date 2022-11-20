<template>
  <view-layout :title="title" :right="right" :left="left">
    <ReceiptLayout v-if="invoice">
      <div style="padding: 8px">
        <div
          style="
          display: flex;
          align-item: center;
          justify-content: space-between;
          padding: 8px;
          border: solid;
          border-color: rgba(0, 0, 0, 0.12);
          border-width: 0 0 thin 0;
        "
        >
          <span>KHÁCH HÀNG</span>
          <span style="font-weight: 700; text-transform: capitalize">
            {{ invoice.customer.name }}
          </span>
        </div>
        <div
          style="
          display: flex;
          align-item: center;
          justify-content: space-between;
          padding: 8px;
          border: solid;
          border-color: rgba(0, 0, 0, 0.12);
          border-width: 0 0 thin 0;
        "
        >
          <span>TẠO ĐƠN</span>
          <span style="font-weight: 700; text-transform: capitalize">
            {{ invoice.employee.name }}
          </span>
        </div>
        <div
          style="
          display: flex;
          align-item: center;
          justify-content: space-between;
          padding: 8px;
          border: solid;
          border-color: rgba(0, 0, 0, 0.12);
          border-width: 0 0 thin 0;
        "
        >
          <span>NGÀY</span>
          <span
            style="font-weight: 700; text-transform: capitalize; color: black"
          >
            {{ `${dateFormatted(invoice.created_at, 'kk:mm - DD/MM/YYYY')}` }}
          </span>
        </div>
        <div
          style="
          display: flex;
          align-item: center;
          justify-content: space-between;
          padding: 8px;
          border: solid;
          border-color: rgba(0, 0, 0, 0.12);
          border-width: 0 0 thin 0;
        "
        >
          <span>LOẠI GIAO DỊCH</span>
          <span
            style="font-weight: 700; text-transform: capitalize; color: black"
          >
            {{
              invoice.type === 'withdraw' && invoice.note === 'cashout'
                ? 'Rút xu'
                : $t(invoice.type)
            }}
          </span>
        </div>
        <div
          style="
          display: flex;
          align-item: center;
          justify-content: space-between;
          padding: 8px;
          border: solid;
          border-color: rgba(0, 0, 0, 0.12);
          border-width: 0 0 thin 0;
        "
        >
          <span>SỐ XU</span>
          <span
            style="font-weight: 700; text-transform: capitalize; color: black"
          >
            {{ invoice.amount }} Xu
          </span>
        </div>
        <div
          v-if="invoice.promotion_amount"
          style="
          display: flex;
          align-item: center;
          justify-content: space-between;
          padding: 8px;
          border: solid;
          border-color: rgba(0, 0, 0, 0.12);
          border-width: 0 0 thin 0;
        "
        >
          <span>SỐ XU ĐƯỢC TẶNG</span>
          <span
            style="font-weight: 700; text-transform: capitalize; color: black"
          >
            {{ invoice.promotion_amount }} Xu
          </span>
        </div>
        <div
          v-if="invoice.type === 'deposit'"
          style="
          display: flex;
          align-item: center;
          justify-content: space-between;
          padding: 8px;
          border: solid;
          border-color: rgba(0, 0, 0, 0.12);
          border-width: 0 0 thin 0;
        "
        >
          <span>THÀNH TIỀN</span>
          <span style="font-weight: 700; text-transform: capitalize">
            {{ invoice.amount | currencyFormat }}
          </span>
        </div>
        <div
          v-if="invoice.type === 'deposit' && invoice.status === 'paid'"
          style="
          display: flex;
          align-item: center;
          justify-content: space-between;
          padding: 8px;
          border: solid;
          border-color: rgba(0, 0, 0, 0.12);
          border-width: 0 0 thin 0;
        "
        >
          <span>SỐ DƯ VÍ HIỆN TẠI</span>
          <span style="font-weight: 700; text-transform: capitalize">
            {{ invoice.customer.balance }} Xu
          </span>
        </div>
        <div style="padding: 8px" v-if="invoice.note !== 'cashout'">
          <p style="margin-bottom: 2px">GHI CHÚ</p>
          <p style="white-space: pre-line; font-size: 12px">
            {{ invoice.note }}
          </p>
        </div>
      </div>
      <!-- Sign to pay  -->
      <template v-if="invoice.status === 'pending'">
        <v-card
          class="mb-2 pt-2"
          elevation="2"
          width="300px"
          style="margin-left: auto; margin-right: auto"
        >
          <h3 class="text-center">Vui lòng ký xác nhận</h3>
          <template v-if="!signature">
            <VueSignaturePad
              height="300px"
              width="300px"
              ref="signPad"
              :options="{ penColor: '#000000' }"
            ></VueSignaturePad>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="green darken-1" text @click="clearSign()">
                Xóa
              </v-btn>
              <v-btn color="green darken-1" text @click="confirmSign()">
                Xác nhận
              </v-btn>
            </v-card-actions>
          </template>
          <template v-else>
            <img
              :src="signature"
              height="300px"
              width="300px"
              alt="saved signature"
              style="margin-left: auto; margin-right: auto"
            />
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="green darken-1" text @click="resetSignature()">
                Ký lại
              </v-btn>
            </v-card-actions>
          </template>
        </v-card>
        <div class="d-flex align-center justify-center mt-4">
          <v-btn :disabled="!signature" color="primary" @click="openDialog">
            Xác Nhận Thanh Toán
          </v-btn>
        </div>
      </template>

      <!-- Paid -->
      <div
        v-if="invoice.status === 'paid'"
        style="
        display: flex;
        align-items: flex-end;
        flex-direction: column;
        justify-content: center;
        padding: 8px 10px;
        font-size: 16px;
      "
      >
        <span>CHỮ KÝ KHÁCH HÀNG</span>
        <img :src="invoice.signature" width="150px" height="auto" />
        <div style="padding-top: 8px; width: 100%; text-align: center">
          Xin cám ơn quý khách
        </div>
        <div style="width: 100%; text-align: center">
          Hẹn gặp lại quý khách lần sau !
        </div>
      </div>
    </ReceiptLayout>
    <v-dialog v-model="dialog" max-width="290">
      <v-card>
        <v-card-title class="text-h5">
          Chọn phương thức thanh toán
        </v-card-title>

        <v-card-text>
          <v-radio-group v-model="selectedPaymentMethod">
            <template v-slot:label>
              <div class="subtitle-2 mb-2 font-weight-bold">
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
                <div>{{ $t(method.id) }}</div>
              </template>
            </v-radio>
          </v-radio-group>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="green darken-1" text @click="dialog = false">
            Đóng
          </v-btn>

          <v-btn color="green darken-1" text @click="confirm">
            Đồng ý
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </view-layout>
</template>

<script>
// @ is an alias to /src
import { getInvoice, approveInvoice } from '@/axios/invoice';
import { mapState } from 'vuex';
import ViewLayout from '@/layout/ViewLayout.vue';
import ReceiptLayout from '@/components/common/ReceiptLayout';
export default {
  name: 'DepositReceipt',
  components: {
    ReceiptLayout,
    ViewLayout,
  },
  data() {
    return {
      signature: null,
      invoice: null,
      title: 'Thanh toán Nạp Xu',
      right: {
        icon: 'mdi-reload',
        click: async () => {
          await this.init();
        },
      },
      left: {
        icon: 'mdi-arrow-left',
        click: () => {
          this.$router.push({ name: 'Receipt' });
        },
      },
      selectedPaymentMethod: null,
      dialog: false,
    };
  },
  computed: {
    ...mapState('app', ['paymentMethods']),
    availablePaymentMethods() {
      return this.paymentMethods.filter((p) => p.id !== 'credit');
    },
  },
  methods: {
    clearSign() {
      this.$refs.signPad.clearSignature();
    },
    resetSignature() {
      this.signature = null;
    },
    confirmSign() {
      const { data } = this.$refs.signPad.saveSignature();
      this.signature = data;
    },
    async init() {
      this.resetSignature();
      try {
        this.setLoading(true);
        const response = await getInvoice(this.$route.params['id']);
        if (response.status === 200) {
          this.invoice = response.data.Data;
          if (!this.invoice.status === 'paid') {
            this.$nextTick(() => {
              this.$refs.signPad.resizeCanvas();
            });
          }
        }
      } catch (err) {
        console.log(err);
      } finally {
        this.setLoading(false);
      }
    },
    openDialog() {
      this.selectedPaymentMethod = null;
      this.dialog = true;
    },
    async confirm() {
      try {
        this.setLoading(true);
        const response = await approveInvoice(this.$route.params['id'], {
          signature: this.signature,
          payment_method_id: this.selectedPaymentMethod,
        });
        if (response.status === 200) {
          await this.init();
          this.dialog = false;
        }
      } catch (err) {
        console.log(err);
      } finally {
        this.setLoading(false);
      }
    },
  },
  async created() {
    await this.init();
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
