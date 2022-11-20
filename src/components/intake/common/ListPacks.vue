<template>
  <CoreDataIlterator
    :url="'api/v1/packages'"
    :params="params"
    class="pa-4"
    v-if="hasCustomer"
  >
    <template v-slot:items="{ items }">
      <div
        class="sold-combo-list profile-list-combo-items mb-4"
        v-for="pack in items"
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
                  <div
                    class="combo-history-items"
                    v-for="(combo, index) in pack.combos"
                    :key="index"
                  >
                    <p class="mb-0 font-weight-bold">
                      {{ combo.variant.name }}
                    </p>
                    <p class="text-color-gray error--text mb-0 caption">
                      Khả dụng:
                      <span
                        class="font-weight-bold"
                        v-if="availableAmount(combo)"
                      >
                        {{ availableAmount(combo) }} lượt
                      </span>
                      <span class="font-weight-bold" v-else> Hết lượt </span>
                    </p>
                    <p
                      class="text-color-gray mb-0 caption primary--text"
                      v-if="beingUsedAmount(combo)"
                    >
                      Đang dùng:
                      <span class="font-weight-bold">
                        {{ beingUsedAmount(combo) }} lượt
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
                    <BookComboOrderDialog
                      :combo="combo"
                      v-if="editMode && availableAmount(combo)"
                    />
                  </div>
                </div>
              </template>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </div>
    </template>
  </CoreDataIlterator>
</template>
<script>
import CoreDataIlterator from '@/components/core/CoreDataIlterator';
import PackItem from '@/components/pack/PackItem';
import BookComboOrderDialog from '@/components/intake/combo-book/BookComboOrderDialog';
import { mapGetters } from 'vuex';

export default {
  name: 'ListPacks',
  props: {
    userType: {
      default: 'customer',
    },
  },
  components: {
    PackItem,
    BookComboOrderDialog,
    CoreDataIlterator,
  },
  data() {
    return {
      isDeleting: false,
    };
  },
  computed: {
    ...mapGetters({
      orders: 'intake/getOrders',
    }),
    hasPriceSlot() {
      return !!this.$slots.price;
    },
    params() {
      const params = {};
      switch (this.userType) {
        case 'ktv':
          params.employee_id = this.currentUser.id;
          break;
        case 'customer':
          params.customer_id = this.hasCustomer ? this.customer.id : -1;
          params.exclude_expired = true;
          break;
        default:
      }
      return params;
    },
  },
  methods: {
    beingUsedAmount(combo) {
      return this.orders.reduce((sum, order) => {
        if (order.combo_id === combo.id) {
          sum += 1;
        }
        return sum;
      }, 0);
    },
    availableAmount(combo) {
      const beingUsedAmount = this.beingUsedAmount(combo);
      return combo.amount - combo.number_used - beingUsedAmount;
    },
  },
};
</script>
