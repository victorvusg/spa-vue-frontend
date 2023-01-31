<template>
  <div v-if="selectedVariant">
    <!-- Template for variants filtered by gender -->
    <template v-if="isFilteredByGender">
      <v-row class="mx-0 px-4">
        <v-col cols="6" class="pl-0 pr-1">
          <v-btn
            color="primary"
            x-large
            block
            :outlined="selectedGender !== 'female'"
            @click="
              selectedGender = 'female';
              filterVariantsByGender('female');
            "
          >
            <v-list-item-content>
              <v-list-item-title class="font-weight-bold"
                >FOR HER</v-list-item-title
              >
              <v-list-item-subtitle
                class="font-weight-light"
                style="text-transform: none !important"
                >Dành cho nữ</v-list-item-subtitle
              >
            </v-list-item-content>
          </v-btn>
        </v-col>
        <v-col cols="6" class="pr-0 pl-1">
          <v-btn
            color="primary"
            x-large
            block
            :outlined="selectedGender !== 'male'"
            @click="filterVariantsByGender('male')"
          >
            <v-list-item-content>
              <v-list-item-title class="font-weight-bold"
                >FOR HIM</v-list-item-title
              >
              <v-list-item-subtitle
                class="font-weight-light"
                style="text-transform: none !important"
                >Dành cho nam</v-list-item-subtitle
              >
            </v-list-item-content>
          </v-btn>
        </v-col>
      </v-row>
    </template>
    <!-- Template for variant list  -->
    <template v-for="variant in variants">
      <v-list-item class="px-2" :key="variant.id">
        <v-list-item-avatar @click="selectedVariant = variant">
          <v-icon
            size="30px"
            v-if="selectedVariant.id === variant.id"
            color="primary"
            >mdi-checkbox-marked-circle</v-icon
          >
          <v-icon size="30px" v-else>mdi-checkbox-blank-circle-outline</v-icon>
        </v-list-item-avatar>

        <v-list-item-content class="pr-2">
          <v-list-item-title class="service-name font-weight-bold">{{
            variant.name
          }}</v-list-item-title>
          <v-list-item-subtitle></v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-action>
          <v-list-item-title class="service-name font-weight-bold">
            <div class="text-right">{{ variant.sale_price | currencyFormat() }}</div>
          </v-list-item-title>
        </v-list-item-action>
      </v-list-item>
      <v-divider class="my-1 mx-4" :key="'divider' + variant.id"></v-divider>
    </template>
    <div class="mx-0 pa-4 d-flex align-center justify-end">
      <v-btn
        outlined
        class="px-16"
        color="#835a38"
        @click="$emit('select', selectedVariant)"
        :block="isMobile"
      >
        {{ $t('service.single_buy_now') }}
      </v-btn>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex';

export default {
  name: 'ServiceVariants',
  props: {
    // Service Object
    item: {
      required: true,
    },
  },
  components: {},
  data() {
    return {
      selectedGender: 'both',
      selectedVariant: {},
    };
  },
  computed: {
    ...mapState('customer', ['checkInCustomer']),
    isFilteredByGender() {
      return this.item.variants.some((variant) => variant.gender !== 'both');
    },
    variants() {
      return this.item.variants.filter((v) => {
        if (v.gender) {
          return v.gender === this.selectedGender;
        }
        return true;
      });
    },
  },
  watch: {
    variants: {
      immediate: true,
      handler(val) {
        this.selectedVariant = { ...val[0] };
      },
    },
  },
  methods: {
    filterVariantsByGender(gender) {
      this.selectedGender = gender;
    },
  },
  created() {
    this.selectedVariant = this.variants[0];
    if (this.isFilteredByGender) {
      this.selectedGender = 'female';
    }
  },
};
</script>
