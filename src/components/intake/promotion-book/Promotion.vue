<template>
  <div class="slideUp-wrap">
    <!-- Action button view -->
    <template v-for="variant in variants">
      <v-list-item class="px-2" :key="variant.id">
        <v-list-item-avatar>
          <v-icon size="30px" color="primary">
            mdi-checkbox-marked-circle
          </v-icon>
        </v-list-item-avatar>

        <v-list-item-content class="pr-2">
          <v-list-item-title class="service-name font-weight-bold">
            {{ variant.name }}
          </v-list-item-title>
        </v-list-item-content>
        <v-list-item-action>
          <v-list-item-title class="service-name font-weight-bold">
            <template v-if="variant.is_free"> Gói tặng </template>
            <template v-else>
              <div class="text-right">
                {{ variant.price | currencyFormat() }}
              </div>
            </template>
          </v-list-item-title>
        </v-list-item-action>
      </v-list-item>
      <v-divider class="my-1 mx-4" :key="'divider' + variant.id"></v-divider>
    </template>
    <v-row class="mx-0 pt-2">
      <v-col cols="12" sm="6" class="py-0 px-4 pr-sm-2"> </v-col>
      <v-col cols="12" sm="6" class="pb-0 py-sm-0 px-4 pl-sm-2">
        <v-btn
          outlined
          block
          color="#835a38"
          @click="$emit('select', variants)"
        >
          {{ $t('service.single_buy_now') }}
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>
<script>
import { mapState } from 'vuex';

export default {
  name: 'Variants',
  props: {
    service: {
      required: true,
    },
  },
  components: {},
  data() {
    return {};
  },
  computed: {
    ...mapState('customer', ['checkInCustomer']),
    isFilteredByGender() {
      return this.service.variants.some((variant) => variant.gender !== 'both');
    },
    variants() {
      return [...this.service.variants].sort((a, b) => a.is_free - b.is_free);
    },
  },
  methods: {
    filterVariantsByGender(gender) {
      this.selectedGender = gender;
    },
  },
};
</script>
