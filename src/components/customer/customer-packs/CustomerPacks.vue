<template>
  <v-data-iterator
    :items="packs"
    :footer-props="{
      itemsPerPageText: 'Per Page',
    }"
  >
    <template v-slot:default="props">
      <div
        class="sold-combo-list profile-list-combo-items mb-4"
        v-for="pack in props.items"
        :key="pack.id"
      >
        <v-expansion-panels class="expansion-amount-combo">
          <v-expansion-panel>
            <v-expansion-panel-header>
              <PackItem :pack="pack" />
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <template v-if="!pack.is_valid">
                <div class="d-flex align-center justify-space-between">
                  <span>Vui lòng kích hoạt để sử dụng</span>
                  <v-btn
                    color="error"
                    text
                    small
                    @click.stop="isDeleting = true"
                  >
                    <template v-if="!isDeleting">Hủy</template>
                    <template>
                      <v-progress-circular
                        v-if="isDeleting"
                        :size="20"
                        color="#fffffff"
                        indeterminate
                      ></v-progress-circular>
                    </template>
                  </v-btn>
                </div>
              </template>
              <template v-else>
                <div class="combo-history">
                  <div class="caption font-weight-bold">Các gói đã mua</div>
                  <div
                    class="combo-history-items"
                    v-for="(combo, index) in paidCombos(pack.combos)"
                    :key="index"
                  >
                    <p class="mb-0 font-weight-bold">
                      {{ combo.variant.name }}
                    </p>
                    <p
                      class="text-color-gray mb-0 caption"
                      v-if="combo.amount - combo.number_used !== 0"
                    >
                      Khả dụng:
                      <span class="font-weight-bold error--text">
                        {{ combo.amount - combo.number_used }} lượt
                      </span>
                    </p>
                    <p
                      class="text-color-gray mb-0 caption"
                      v-if="combo.number_used"
                    >
                      Đã dùng:
                      <span class="font-weight-bold">
                        {{ combo.number_used }} lượt
                      </span>
                    </p>
                    <ul>
                      <li
                        class="caption font-weight-bold primary--text"
                        v-for="order in combo.orders"
                        :key="order.id"
                      >
                        {{ dateFormatted(order.created_at, 'DD/MM/YYYY') }} -
                        <a
                          href="javascript:void(0)"
                          class="error--text"
                          @click="
                            $router.push({
                              name: 'IntakeDetail',
                              params: { id: order.intake_id },
                            })
                          "
                          >Xem</a
                        >
                      </li>
                    </ul>
                  </div>
                </div>
                <div
                  class="combo-history mt-2"
                  v-if="pack.promotion_type === 'promotion-combos'"
                >
                  <div class="caption font-weight-bold">Các gói tặng</div>
                  <div
                    class="combo-history-items"
                    v-for="(combo, index) in promotionCombos(pack.combos)"
                    :key="`promotion_${index}`"
                  >
                    <p class="mb-0 font-weight-bold">
                      {{ combo.variant.name }}
                    </p>
                    <p
                      class="text-color-gray mb-0 caption"
                      v-if="combo.amount - combo.number_used !== 0"
                    >
                      Khả dụng:
                      <span class="font-weight-bold error--text">
                        {{ combo.amount - combo.number_used }} lượt
                      </span>
                    </p>
                    <p
                      class="text-color-gray mb-0 caption"
                      v-if="combo.number_used"
                    >
                      Đã dùng:
                      <span class="font-weight-bold">
                        {{ combo.number_used }} lượt
                      </span>
                    </p>
                    <ul>
                      <li
                        class="caption font-weight-bold primary--text"
                        v-for="order in combo.orders"
                        :key="order.id"
                      >
                        {{ dateFormatted(order.created_at, 'DD/MM/YYYY') }} -
                        <a
                          href="javascript:void(0)"
                          class="error--text"
                          @click="
                            $router.push({
                              name: 'IntakeDetail',
                              params: { id: order.intake_id },
                            })
                          "
                          >Xem</a
                        >
                      </li>
                    </ul>
                  </div>
                </div>
              </template>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </div>
    </template>
    <template v-slot:no-data>
      <div class="service-no-data">
        <v-icon>mdi-alert-circle</v-icon>Chưa có
      </div>
    </template>
  </v-data-iterator>
</template>
<script>
import PackItem from '@/components/pack/PackItem';

export default {
  name: 'CustomerPacks',
  components: {
    PackItem,
  },
  data() {
    return {
      isDeleting: false,
    };
  },
  props: {
    packs: {
      required: true,
    },
  },
  methods: {
    promotionCombos(combos) {
      return combos.filter((combo) => combo.is_promotion_combo);
    },
    paidCombos(combos) {
      return combos.filter((combo) => !combo.is_promotion_combo);
    },
  },
  computed: {
    hasPriceSlot() {
      return !!this.$slots.price;
    },
  },
};
</script>
