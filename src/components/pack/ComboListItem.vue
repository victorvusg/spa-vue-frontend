<template>
  <v-list-item class="task" @click="$emit('on-click-item')">
    <v-list-item-content>
      <v-list-item-title class="text-uppercase primary--text font-weight-bold">
        {{ variant.name }}
      </v-list-item-title>
      <template v-if="!hasPriceSlot">
        <v-list-item-subtitle style="font-size: small">
          <span class="error--text font-weight-bold"
            >{{ variant.amount }} lượt</span
          >
          x {{ variant.price | currencyFormat }}
        </v-list-item-subtitle>
        <v-list-item-subtitle>
          <strong>{{
            (variant.amount * variant.price) | currencyFormat
          }}</strong>
        </v-list-item-subtitle>
      </template>
      <template v-else>
        <slot name="price"></slot>
      </template>
    </v-list-item-content>
    <v-list-item-action>
      <slot name="action"></slot>
    </v-list-item-action>
  </v-list-item>
</template>
<script>
export default {
  name: 'ComboListItem',
  props: {
    variant: {
      required: true,
    },
  },
  computed: {
    hasPriceSlot() {
      return !!this.$slots.price;
    },
  },
};
</script>
