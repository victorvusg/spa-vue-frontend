<template>
  <div class="services-list px-2">
    <v-tabs
      show-arrows
      fixed-tabs
      hide-slider
      v-model="tab"
      background-color="transparent"
      class="service-tabs mb-4"
    >
      <v-tabs-slider></v-tabs-slider>

      <v-tab
        :href="'#tab-' + index"
        v-for="(category, index) in getGroupedVariants"
        :key="index"
        >{{ category.descriptions }}</v-tab
      >
    </v-tabs>

    <v-tabs-items v-model="tab">
      <v-tab-item
        v-for="(category, i) in getGroupedVariants"
        :key="'menu' + i"
        :value="'tab-' + i"
      >
        <v-data-iterator
          :items="category.services"
          :search="search"
          class="service-list-by-category"
          :footer-props="{
            itemsPerPageText: 'Per Page',
          }"
        >
          <template v-slot:header>
            <v-text-field
              solo
              flat
              clearable
              rounded
              v-model="search"
              class="search-input search-service"
              prepend-inner-icon="mdi-magnify"
              label="Tìm theo tên dịch vụ"
            ></v-text-field>
            <h1 class="my-2 px-2">{{ category.descriptions }}</h1>
          </template>
          <template v-slot:default="props">
            <template v-for="item in props.items">
              <v-list-item class="px-2" :key="item.id">
                <v-list-item-avatar v-ripple="{ center: true }">
                  <v-icon class="service-avatar">mdi-dots-horizontal</v-icon>
                </v-list-item-avatar>

                <v-list-item-content class="pr-2">
                  <v-list-item-title class="service-name font-weight-bold">
                    {{ item.name }}
                  </v-list-item-title>
                </v-list-item-content>
                <v-list-item-action class="mx-0">
                  <BookPromotionDialog
                    v-if="category.name === 'promotion'"
                    :item="item"
                  />
                  <BookServiceOrderDialog v-else :item="item" />
                </v-list-item-action>
              </v-list-item>
              <v-divider class="my-1" :key="'divider' + item.id"></v-divider>
            </template>
          </template>
          <template v-slot:no-results>
            <div class="service-no-results">
              <v-icon>mdi-alert</v-icon>Không tìm thấy dịch vụ phù hợp
            </div>
          </template>
          <template v-slot:no-data>
            <div class="service-no-data">
              <v-icon>mdi-alert-circle</v-icon>Kông có dịch vụ
            </div>
          </template>
        </v-data-iterator>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
import BookServiceOrderDialog from '@/components/intake/service-book/BookServiceOrderDialog';
import BookPromotionDialog from '@/components/intake/promotion-book/BookPromotionDialog';
import { mapGetters } from 'vuex';
import orderMixins from '@/mixins/order.mixins';

export default {
  name: 'ServiceList',
  mixins: [orderMixins],
  components: {
    BookServiceOrderDialog,
    BookPromotionDialog,
  },
  data() {
    return {
      tab: 0,
      search: '',
    };
  },
  watch: {
    tab() {
      this.search = '';
    },
  },
  computed: {
    ...mapGetters('variants', ['getGroupedVariants']),
  },
  methods: {
    fromPrice(variants) {
      if (variants.length > 1) {
        return Math.min(...variants.map((v) => v.sale_price));
      }
      return variants[0].sale_price;
    },
  },
};
</script>
