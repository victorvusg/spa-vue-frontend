<template>
  <view-layout :title="title" :right="right" :left="left">
    <ReceiptLayout v-if="isFetched">
      <Receipt :intake="intake" />
      <!-- HẸN GẶP LẠI  -->
      <div
        v-if="intake.payment_method_id"
        style="
        width: 100%;
        display: flex;
        align-item: center;
        justify-content: center;
        flex-wrap: wrap;
      "
      >
        <div style="padding-top: 8px; width: 100%; text-align: center">
          Xin cám ơn quý khách
        </div>
        <div style="width: 100%; text-align: center">
          Hẹn gặp lại quý khách lần sau !
        </div>
        <v-btn
          v-if="intake.review_form === null"
          elevation="0"
          color="primary"
          class="mt-4"
          depressed
          block
          @click="
            $router.push({ name: 'ReviewIntake', params: { id: intake.id } })
          "
        >
          Đánh giá dịch vụ
        </v-btn>
      </div>
      <div v-else>
        <PaymentMethodsDialog :intake="intake" @payment-updated="init" />
      </div>
    </ReceiptLayout>
  </view-layout>
</template>
<script>
import { getIntakeById } from '@/axios/intake';
import { mapState } from 'vuex';
import ViewLayout from '@/layout/ViewLayout.vue';
import Receipt from '@/components/intake/intake-receipt/Receipt';
import PaymentMethodsDialog from '@/components/intake/intake-receipt/PaymentMethodsDialog';
import ReceiptLayout from '@/components/common/ReceiptLayout';

export default {
  name: 'IntakeReceipt',
  components: {
    ViewLayout,
    Receipt,
    ReceiptLayout,
    PaymentMethodsDialog,
  },
  props: {},
  data() {
    return {
      title: 'Thanh toán đơn',
      right: {
        icon: 'mdi-reload',
        click: async () => {
          await this.reload();
        },
      },
      left: {
        icon: 'mdi-arrow-left',
        click: () => {
          this.$router.push({ name: 'Receipt' });
        },
      },
      isFetched: false,
      intake: {},
    };
  },
  methods: {
    async init() {
      const { id } = this.$route.params;
      this.isFetched = false;
      this.setLoading(true);
      try {
        const response = await getIntakeById(id);
        if (response.status === 200) {
          this.intake = response.data.Data;
        } else {
          this.dispatch('app/TOGGLE_NOT_FOUND_DIALOG', {
            model: true,
            content: 'Đã xảy ra lỗi',
          });
        }
      } catch (error) {
        console.log(error);
        this.dispatch('app/TOGGLE_NOT_FOUND_DIALOG', {
          model: true,
          content: 'Đã xảy ra lỗi',
        });
      }
      this.isFetched = true;
      this.setLoading(false);
    },
    async reload() {
      await this.init();
    },
  },
  async created() {
    await this.init();
  },
};
</script>
