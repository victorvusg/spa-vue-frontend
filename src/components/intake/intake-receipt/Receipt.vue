<template>
  <div>
    <v-row style="margin: 8px 0px" v-if="specialNote">
      <v-col style="text-align: center" cols="12">
        Xin chúc mừng!<br />Bạn đã đạt hạn mức thành viên
        <strong>{{ $t(specialNote.to) }}</strong> <br />với tổng chi tiêu
        <strong>{{ specialNote.total_spending | currencyFormat }} VND</strong>
      </v-col>
    </v-row>
    <v-row style="margin: 8px 0px">
      <v-col style="padding: 0px; display: flex; align-item: center" cols="3"
        >Khách</v-col
      >
      <v-col style="padding: 0px; display: flex; align-item: center">{{
        customer.name
      }}</v-col>
    </v-row>
    <!-- <v-row style="margin: 8px 0px">
      <v-col style="padding: 0px; display: flex; align-item: center" cols="3"
        >Tích lũy:</v-col
      >
      <v-col
        style="
          padding: 0px;
          display: flex;
          align-item: center;
          font-weight: bold;
        "
        >{{ customer.cash_point | currencyFormat }}</v-col
      >
    </v-row> -->
    <v-row style="margin: 8px 0px" v-if="customer.rank">
      <v-col style="padding: 0px; display: flex; align-item: center" cols="3"
        >Thành viên:</v-col
      >
      <v-col style="padding: 0px; display: flex; align-item: center">{{
        $t(customer.rank)
      }}</v-col>
    </v-row>
    <v-row style="margin: 8px 0px">
      <v-col style="padding: 0px; display: flex; align-item: center" cols="3"
        >Ngày giờ</v-col
      >
      <v-col style="padding: 0px; display: flex; align-item: center">{{
        createdDate
      }}</v-col>
    </v-row>
    <v-row style="margin: 8px 0px">
      <v-col style="padding: 0px; display: flex; align-item: center" cols="3"
        >Mã Đơn</v-col
      >
      <v-col style="padding: 0px; display: flex; align-item: center">{{
        intake.id
      }}</v-col>
    </v-row>
    <v-row style="margin: 8px 0px" v-if="intake.payment_method_id">
      <v-col style="padding: 0px; display: flex; align-item: center" cols="3"
        >Thanh Toán</v-col
      >
      <v-col style="padding: 0px; display: flex; align-item: center">{{
        $t(intake.payment_method_id)
      }}</v-col>
    </v-row>
    <v-row
      style="
        border-top: solid 0.2px #bdbdbd;
        border-bottom: solid 0.2px #bdbdbd;
        padding-top: 4px;
        margin: 8px 0px;
      "
    >
      <v-col cols="1" style="padding: 0px; font-weight: bold"> SL </v-col>
      <v-col cols="7" style="padding: 0px; font-weight: bold">
        Tên dịch vụ
      </v-col>
      <v-col
        cols="4"
        style="
          padding: 0px;
          display: flex;
          align-item: center;
          justify-content: flex-end;
          font-weight: bold;
        "
      >
        Thành tiền
      </v-col>
    </v-row>
    <v-row
      v-for="(item, index) in items"
      :key="index"
      style="margin: auto 0px; padding-bottom: 8px"
    >
      <v-col cols="1" style="padding: 0px">{{ item.amount }}</v-col>
      <v-col cols="7" style="padding: 0px">{{ item.name }}</v-col>
      <v-col
        cols="4"
        style="
          padding: 0px;
          display: flex;
          align-item: center;
          justify-content: flex-end;
        "
      >
        <template v-if="item.isCombo"> Gói </template>
        <template v-else>
          <span>
            {{ item.price | currencyFormat }}
          </span>
        </template>
      </v-col>
      <template v-if="item.discountDescription">
        <v-col cols="1" style="padding: 0px" />
        <v-col cols="11" style="padding: 0px">
          <div style="font-size: 10px; font-style: italic">
            ( <strong>Giá gốc: {{ item.stockPrice | currencyFormat }}</strong
            >, {{ item.discountDescription }} )
          </div>
        </v-col>
      </template>
    </v-row>
    <div
      style="
        border-top: solid 1px;
        display: block;
        padding: 4px;
        margin-top: 4px;
      "
    >
      <!-- TÍCH LUỸ ĐƠN  -->
      <div
        v-if="intake.customer_earned_points"
        style="
          display: flex;
          align-item: center;
          justify-content: space-between;
          margin-bottom: 8px;
        "
      >
        <i style="font-weight: bold">Tích luỹ đơn này được</i>
        <i>{{ intake.customer_earned_points | currencyFormat }}</i>
      </div>
      <!-- TẠM TÍNH  -->
      <div
        style="
          display: flex;
          align-item: center;
          justify-content: space-between;
        "
      >
        <span style="font-weight: bold">Tạm tính</span>
        <span>{{ preTotal | currencyFormat }}</span>
      </div>
      <template v-if="additionalDiscountPrice">
        <!-- GIẢM GIÁ  -->
        <div
          style="
            display: flex;
            align-item: center;
            justify-content: space-between;
          "
        >
          <span style="font-weight: bold">Giảm thêm</span>
          <span>- {{ additionalDiscountPrice | currencyFormat }}</span>
        </div>
        <!-- GHI CHÚ GIẢM GIÁ  -->
        <div
          style="
            display: flex;
            align-item: center;
            justify-content: flex-end;
            font-size: 10px;
            font-style: italic;
          "
        >
          <strong>( Ghi chú: {{ additionalDiscountNote }} )</strong>
        </div>
      </template>
      <!-- SỬ DỤNG ĐIỂM  -->
      <template v-if="pointsUsedAmount">
        <div
          style="
            display: flex;
            align-item: center;
            justify-content: space-between;
            margin-bottom: 8px;
          "
        >
          <i style="font-weight: bold">Giảm bằng điểm tích lũy</i>
          <i>-{{ pointsUsedAmount | currencyFormat }}</i>
        </div>
        <!-- GHI CHÚ SỬ DỤNG ĐIỂM -->
        <div
          style="font-size: 10px"
          v-for="(log, index) in pointLogs"
          :key="index"
        >
          <i v-html="log.message" />
          <i class="ml-1"
            >(lúc {{ dateFormatted(log.created_at, 'kk:mm - DD/MM/YYYY') }})</i
          >
        </div>
      </template>
      <!-- TỔNG CỘNG  -->
      <div
        class="subtitle-1 mt-2 primary--text"
        style="
          display: flex;
          align-item: center;
          justify-content: space-between;
        "
      >
        <span style="font-weight: bold" class="text-uppercase">Tổng cộng</span>
        <span style="font-weight: bold">
          {{ finalPrice | currencyFormat }}
        </span>
      </div>
      <!-- TODO: Làm trả xu bù tiền mặt -->
      <!-- <div
            style="
              display: flex;
              align-item: center;
              justify-content: space-between;
            "
            v-if="receipt.final_price && isCash"
          >
            <span style="font-weight: bold">Tiền mặt</span>
            <span>{{ (receipt.final_price * 1000).toLocaleString() }}</span>
          </div> -->
    </div>
    <template v-if="isSpaCredit">
      <InvoiceCard
        v-if="intake && intake.invoice"
        :invoice="intake.invoice"
        :customerBalance="intake.customer.balance"
      />
    </template>
  </div>
</template>
<script>
/* eslint-disable camelcase */

import moment from 'moment';
import InvoiceCard from './InvoiceCard';

export default {
  name: 'Receipt',
  props: {
    autoPrint: false,
    intake: {
      required: true,
    },
  },
  components: {
    InvoiceCard,
  },
  computed: {
    customer() {
      if (this.intake && this.intake.customer) {
        return this.intake.customer;
      }
      return {
        name: 'Khách vãng lai',
        rank: null,
        balance: 0,
        cash_point: 0,
      };
    },
    specialNote() {
      const note = this.intake.special_note || false;
      try {
        return JSON.parse(note);
      } catch (er) {
        return false;
      }
    },
    isSpaCredit() {
      return this.intake.payment_method_id === 'credit';
    },
    createdDate() {
      return moment
        .utc(this.intake.created_at)
        .local()
        .format('HH:mm - DD/MM/YYYY ');
    },
    promotionOrders() {
      const filtered = this.intake.orders.filter((o) => o.promotion_hash);
      return filtered.reduce((accArr, order) => {
        const foundIndex = accArr.findIndex(
          (item) => item.id === order.promotion_hash,
        );
        if (foundIndex === -1) {
          const receiptItem = {
            id: order.promotion_hash,
            name: order.variant.service.name,
            price: order.price,
            amount: 1,
            isCombo: false,
            stockPrice: 0,
            discountDescription: '',
          };
          accArr.push(receiptItem);
        } else {
          accArr[foundIndex].price += order.price;
        }
        return accArr;
      }, []);
    },
    normalOrders() {
      const filtered = this.intake.orders.filter((o) => !o.promotion_hash);
      return filtered.reduce((accArr, order) => {
        const foundIndex = accArr.findIndex(
          (item) => item.id === order.variant.id,
        );
        if (foundIndex === -1 || !!order.combo_id) {
          const receiptItem = {
            id: order.variant.id,
            name: order.variant.name,
            amount: 1,
            stockPrice: order.unit_price,
            price: order.price,
            isCombo: !!order.combo_id,
            discountDescription: order.discount_description,
          };
          accArr.push(receiptItem);
        } else {
          accArr[foundIndex].amount += 1;
          accArr[foundIndex].price += order.price;
        }
        return accArr;
      }, []);
    },
    items() {
      return [...this.normalOrders, ...this.promotionOrders];
    },
    preTotal() {
      return this.items.reduce((acc, item) => {
        // eslint-disable-next-line no-param-reassign
        acc += item.price;
        return acc;
      }, 0);
    },
    additionalDiscountPrice() {
      return this.intake.additional_discount_price || 0;
    },
    additionalDiscountNote() {
      return this.intake.discount_note || '';
    },
    finalPrice() {
      return this.intake.final_price || '';
    },
    receipt() {
      const receiptContent = {
        final_price: 0,
        additional_discount_price: 0,
        discount_note: this.intake.additional_discount_price,
      };
      return receiptContent;
    },
    pointsUsedAmount() {
      if (!this.intake.point_logs) return 0;
      return this.intake.point_logs.reduce((sum, log) => {
        const matches = log.message.match(/\{(.*?)\}/);
        return sum + Number(matches[1]);
      }, 0);
    },
    pointLogs() {
      if (!this.intake.point_logs) return [];
      return this.intake.point_logs.map((log) => ({
        ...log,
        message: log.message.replace(
          /{([^"]+)}/g,
          '<strong class="name">$1</strong>',
        ),
      }));
    },
  },
};
</script>
