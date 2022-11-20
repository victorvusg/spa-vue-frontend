<template>
  <v-card
    style="box-shadow: none !important"
    :class="{
      active: packValid,
      inactive: !packValid,
    }"
  >
    <v-card-title class="d-block">
      <v-list-item-subtitle class="text-uppercase" style="line-height: 1.5">
        <template v-if="!isGift">Gói Tổng Hợp</template>
        <template v-else> Gói quà tặng</template>
      </v-list-item-subtitle>
      <div class="font-weight-bold" style="letter-spacing: 2px">
        <template v-if="!packValid">
          {{ PreTotalPrice | currencyFormat }}
        </template>
        <template v-else>
          {{ pack.total_price | currencyFormat }}
        </template>
        <!-- {{ dateFormatted(pack.created_at, 'DD/MM/YYYY') }} -->
      </div>
      <div class="caption">
        <i class="error--text" v-if="!packValid"> Chưa kích hoạt </i>
        <i class="error--text" v-else>
          Ngày hết hạn: {{ dateFormatted(pack.expiry_date, 'DD/MM/YYYY') }}
        </i>
      </div>
      <div class="pt-1 text-uppercase primary--text" style="font-size: 18px">
        <span>
          {{ pack.customer.name }}
        </span>
      </div>
    </v-card-title>
  </v-card>
</template>
<script>
export default {
  name: 'PackItem',
  props: {
    pack: {
      required: true,
    },
  },
  computed: {
    hasPriceSlot() {
      return !!this.$slots.price;
    },
    isGift() {
      return !!this.pack.is_gift;
    },
    packValid() {
      return !!this.pack.is_valid;
    },
    PreTotalPrice() {
      return this.pack.combos.reduce((sum, combo) => {
        if (!combo.is_promotion_combo) {
          sum += combo.total_price;
        }
        return sum;
      }, 0);
    },
  },
};
</script>
