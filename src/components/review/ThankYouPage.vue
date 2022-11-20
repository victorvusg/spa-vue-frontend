<template >
  <div
    class="pa-4"
    style="max-width: 650px; margin-left: auto; margin-right: auto"
  >
    <template
      v-if="customer && customer.id !== null && customerPoints"
    >
      <h3 class="font-weight-light text-center">
        <v-icon size="18" color="orange" class="mr-1 mt-n1">mdi mdi-gift</v-icon
        ><span class="font-weight-bold" style="color: #ff99ab">{{
          customerFirstName
        }}</span>
        ơi, <span>bạn vừa tích lũy được</span>
      </h3>
      <h2 class="font-weight-light text-center mb-2">
        <span class="orange--text text--darken-1 font-weight-bold">
          {{ customerPoints }} điểm thưởng
        </span>
      </h2>
    </template>
    <div class="thank-you">{{ $t('review.thank_you_title') }}</div>
    <div class="heart-split pa-2 mb-4">
      <v-divider></v-divider>
      <div class="heart-icon px-2">
        <v-icon size="20" color="#ff99ab">mdi mdi-heart</v-icon>
      </div>
    </div>
    <img :src="thankYouPic" style="max-width: 100%" />

    <div class="thank-description pt-2">
      {{ $t('review.thank_you_description') }}
    </div>
    <div class="thank-description">
      {{ $t('review.see_you_again') }}
    </div>
    <div class="d-flex align-center justify-center mt-4">
      <v-btn outlined color="primary" @click="$router.push({ name: 'Receipt' })"
        >Trang Chủ</v-btn
      >
    </div>
  </div>
</template>
<script>
/* eslint-disable camelcase */
import UserProfilePanel from '@/components/common/UserProfilePanel';
import thankYouPic from '@assets/images/thankyou.jpg';
import ViewLayout from '@/layout/ViewLayout';
import { mapState } from 'vuex';

export default {
  name: 'ThankYouPage',
  props: {
    customerPoints: {
      default: 0,
    },
  },
  components: {
    UserProfilePanel,
    ViewLayout,
  },
  data() {
    return {
      thankYouPic,
    };
  },
  computed: {
    ...mapState('intake', ['intake']),
    hasReview() {
      return this.intake.review_form !== null;
    },
    customerFirstName() {
      if (this.customer.name) {
        return this.customer.name.split(' ').splice(-1)[0];
      }
      return '';
    },
    reviewForm() {
      const orderNames = this.intake.orders.reduce((acc, order) => {
        acc[order.id] = order.name;
        return acc;
      }, {});
      const reviews = this.intake.review_form.reviews.map((review) => ({
        ...review,
        name: orderNames[review.order_id],
      }));
      return {
        ...this.intake.review_form,
        reviews,
      };
    },
  },
};
</script>
