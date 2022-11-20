<template>
  <ViewLayout v-if="isFetched" :left="left" :title="title" :right="right">
    <!-- Billing header -->
    <v-sheet color="accent" class="pa-4">
      <h3>Phiếu thanh toán</h3>
      <v-row>
        <v-col cols="6" class="py-0">Khách hàng</v-col>
        <v-col cols="6" class="py-0 primary--text text-uppercase">
          {{ customer.name }}
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6" class="py-0">Số lượng dịch vụ</v-col>
        <v-col cols="6" class="py-0">
          {{ paidCombos.length }}
        </v-col>
      </v-row>
      <v-row v-if="promotionCreditPercent">
        <v-col cols="6" class="py-0">Chiết khấu (credit)</v-col>
        <v-col cols="6" class="py-0">
          {{ ((promotionCreditPercent * totalPrice) / 100) | currencyFormat }}
          ({{ promotionCreditPercent }}%)
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6" class="py-0">Tổng giá</v-col>
        <v-col cols="6" class="py-0 primary--text">{{
          totalPrice | currencyFormat
        }}</v-col>
      </v-row>
    </v-sheet>
    <!--//-->
    <v-container>
      <div class="services-list px-2">
        <v-tabs
          class="box-card-service d-none"
          grow
          v-model="upperTab"
          :prev-icon="'mdi-arrow-left-bold-box-outline'"
          :next-icon="'mdi-arrow-right-bold-box-outline'"
        >
          <v-tabs-slider></v-tabs-slider>
          <v-tab :href="`#add-combo`" class="header-card-service-item">
            Menu
          </v-tab>
          <v-tab :href="`#config-promotion`" class="header-card-service-item">
            Menu
          </v-tab>
          <v-tab
            :href="`#create-package`"
            class="header-card-service-item d-none"
          >
            <span>{{ $t('profile.combos') }}</span>
          </v-tab>
        </v-tabs>
        <v-tabs-items v-model="upperTab">
          <!-- TAB ĐỂ KHUYẾN MÃI -->
          <v-tab-item :value="'add-combo'" eager>
            <div class="d-flex align-end">
              <span class="font-weight-bold primary--text">CHỌN DỊCH VỤ</span>
              <v-divider
                class="ml-1"
                style="border-width: 2px 0 0 0 !important"
              />
            </div>
            <!-- MENU ĐỂ CHỌN COMBO -->
            <v-tabs
              show-arrows
              fixed-tabs
              v-model="tab"
              hide-slider
              background-color="transparent"
              class="service-tabs my-5"
            >
              <v-tabs-slider></v-tabs-slider>

              <v-tab
                :href="'#tab-' + index"
                v-for="(category, index) in displayPaidMenu"
                :key="index"
                >{{ category.descriptions }}</v-tab
              >
            </v-tabs>
            <!-- MENU CHO COMBO TRẢ TIỀN -->
            <v-tabs-items v-model="tab">
              <v-tab-item
                v-for="(category, i) in displayPaidMenu"
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
                      class="search-input search-service mb-3"
                      prepend-inner-icon="mdi-magnify"
                      label="Tìm theo tên dịch vụ"
                    ></v-text-field>
                  </template>
                  <template v-slot:default="props">
                    <template v-for="item in props.items">
                      <v-list-item
                        class="px-2"
                        :key="item.id"
                        @click="chooseCombo(item)"
                      >
                        <v-list-item-content class="pr-2">
                          <v-list-item-title class="service-name">
                            {{ item.name }}
                          </v-list-item-title>
                        </v-list-item-content>
                        <v-list-item-action>
                          <span class="primary--text"> Chọn </span>
                        </v-list-item-action>
                      </v-list-item>
                      <v-divider
                        class="my-1"
                        :key="'divider' + item.id"
                      ></v-divider>
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
            <!-- CHỌN LOẠI KHUYẾN MÃI  -->
            <div class="d-flex align-end mt-4">
              <span class="font-weight-bold primary--text"
                >CHỌN LOẠI KHUYẾN MÃI</span
              >
              <v-divider
                class="ml-1"
                style="border-width: 2px 0 0 0 !important"
              />
            </div>
            <v-container fluid>
              <v-radio-group v-model="promotion.type" column>
                <!-- TODO: NOT RELEASE YET -->
                <v-radio
                  v-if="false"
                  label="TẶNG CREDIT"
                  :value="'credit'"
                ></v-radio>
                <v-radio
                  label="TẶNG THÊM DỊCH VỤ"
                  :value="'promotion-combos'"
                ></v-radio>
                <v-radio
                  label="KHÔNG ÁP DỤNG KHUYẾN MÃI"
                  :value="false"
                ></v-radio>
              </v-radio-group>
            </v-container>
          </v-tab-item>
          <v-tab-item :value="'config-promotion'" eager>
            <!-- KHUYẾN MÃI CHIẾT KHẤU ( NOT RELEASE YET)  -->
            <template v-if="promotion.type === 'credit'">
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    label=" Phần trăm (%) chiết khấu"
                    type="number"
                    v-model="promotionCreditPercent"
                    suffix="%"
                    :rules="discountPercentRules"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" v-if="promotionCreditPercent">
                  <p class="ma-0 text-center">KHÁCH HÀNG NHẬN ĐƯỢC</p>
                  <p
                    class="
                      display-2
                      my-2
                      font-weight-bold
                      primary--text
                      ma-0
                      text-center
                    "
                  >
                    {{
                      ((promotionCreditPercent * totalPrice) / 100)
                        | currencyFormat
                    }}
                  </p>
                  <p class="ma-0 text-center">CHIẾT KHẤU VÀO VÍ</p>
                </v-col>
              </v-row>
            </template>
            <!-- MENU CHO COMBO KHUYẾN MÃI  -->
            <template v-if="promotion.type === 'promotion-combos'">
              <div class="d-flex align-end">
                <span class="font-weight-bold primary--text"
                  >CHỌN GÓI KHUYẾN MÃI</span
                >
                <v-divider
                  class="ml-1"
                  style="border-width: 2px 0 0 0 !important"
                />
              </div>
              <v-tabs
                show-arrows
                fixed-tabs
                v-model="promotionTab"
                hide-slider
                background-color="transparent"
                class="service-tabs my-5"
              >
                <v-tabs-slider></v-tabs-slider>

                <v-tab
                  :href="'#tab-' + index"
                  v-for="(category, index) in displayGiftMenu"
                  :key="index"
                  >{{ category.descriptions }}</v-tab
                >
              </v-tabs>

              <v-tabs-items v-model="promotionTab">
                <v-tab-item
                  v-for="(category, i) in displayGiftMenu"
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
                        class="search-input search-service mb-3"
                        prepend-inner-icon="mdi-magnify"
                        label="Tìm theo tên dịch vụ"
                      ></v-text-field>
                    </template>
                    <template v-slot:default="props">
                      <template v-for="item in props.items">
                        <v-list-item
                          class="px-2"
                          :key="item.id"
                          @click="chooseCombo(item)"
                        >
                          <v-list-item-content class="pr-2">
                            <v-list-item-title class="service-name">
                              {{ item.name }}
                            </v-list-item-title>
                          </v-list-item-content>
                          <v-list-item-action>
                            <span class="primary--text"> Chọn </span>
                          </v-list-item-action>
                        </v-list-item>
                        <v-divider
                          class="my-1"
                          :key="'divider' + item.id"
                        ></v-divider>
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
            </template>
          </v-tab-item>
          <!-- TAB BILLING -->
          <v-tab-item :value="'create-package'" eager>
            <div class="d-flex align-end pb-3">
              <span class="font-weight-bold">Các dịch vụ đã chọn</span>
              <v-divider
                class="ml-1"
                style="border-width: 2px 0 0 0 !important"
              />
            </div>
            <ComboListItem
              v-for="(variant, index) in paidCombos"
              :key="`variant_${index}`"
              :variant="variant"
            >
              <template v-slot:action>
                <v-sheet
                  color="primary"
                  class="d-flex add-package-btn-group"
                  rounded
                >
                  <v-btn
                    depressed
                    small
                    dark
                    icon
                    @click="
                      variant.amount === 0 ? false : (variant.amount -= 1)
                    "
                  >
                    <v-icon>mdi mdi-minus</v-icon>
                  </v-btn>
                  <v-sheet
                    color="white"
                    class="px-3 d-flex align-center justify-center"
                    >{{ variant.amount }}</v-sheet
                  >
                  <v-btn dark depressed small icon @click="variant.amount += 1">
                    <v-icon>mdi mdi-plus</v-icon>
                  </v-btn>
                </v-sheet>
              </template>
            </ComboListItem>
            <template v-if="promotionCombos.length">
              <div class="d-flex align-end pb-3">
                <span class="font-weight-bold">Các dịch vụ được tặng</span>
                <v-divider
                  class="ml-1"
                  style="border-width: 2px 0 0 0 !important"
                />
              </div>
              <ComboListItem
                v-for="(variant, index) in promotionCombos"
                :key="`promotion_${index}`"
                :variant="variant"
              >
                <template v-slot:price>
                  <v-list-item-subtitle style="font-size: small">
                    <span class="error--text font-weight-bold"
                      >{{ variant.amount }} lượt</span
                    >
                    x {{ variant.price | currencyFormat }}
                  </v-list-item-subtitle>
                  <v-list-item-subtitle>
                    <strong><i>Tặng</i></strong>
                  </v-list-item-subtitle>
                </template>
                <template v-slot:action>
                  <v-sheet
                    color="primary"
                    class="d-flex add-package-btn-group"
                    rounded
                  >
                    <v-btn
                      depressed
                      small
                      dark
                      icon
                      @click="
                        variant.amount === 0 ? false : (variant.amount -= 1)
                      "
                    >
                      <v-icon>mdi mdi-minus</v-icon>
                    </v-btn>
                    <v-sheet
                      color="white"
                      class="px-3 d-flex align-center justify-center"
                      >{{ variant.amount }}</v-sheet
                    >
                    <v-btn
                      dark
                      depressed
                      small
                      icon
                      @click="variant.amount += 1"
                    >
                      <v-icon>mdi mdi-plus</v-icon>
                    </v-btn>
                  </v-sheet>
                </template>
              </ComboListItem>
            </template>
            <v-row class="mx-0">
              <v-col cols="12">
                <v-btn
                  color="primary"
                  depressed
                  block
                  @click="createNewPackage()"
                >
                  TẠO GÓI
                </v-btn>
              </v-col>
            </v-row>
          </v-tab-item>
        </v-tabs-items>

        <!-- THANH ĐIỀU HƯỚNG  -->
        <div class="d-flex justify-space-between align-center">
          <v-list-item-action>
            <v-btn
              depressed
              text
              small
              @click="previousStep()"
              :disabled="upperTab === 'add-combo'"
              color="primary"
            >
              <v-icon>mdi mdi-chevron-left</v-icon>
              <span class="font-weight-bold">quay lại</span>
            </v-btn>
          </v-list-item-action>
          <v-list-item-action>
            <v-btn
              color="primary"
              depressed
              text
              small
              @click="nextStep()"
              :disabled="
                upperTab === 'create-package' || paidCombos.length === 0
              "
            >
              <span class="font-weight-bold">Tiếp theo</span>
              <v-icon>mdi mdi-chevron-right</v-icon>
            </v-btn>
          </v-list-item-action>
        </div>
      </div>
    </v-container>

    <!-- DIALOG DANH SÁCH VARIANTS  -->
    <v-dialog
      v-model="detailModal.status"
      fullscreen
      persistent
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar dark color="primary" class="sticky-toolbar">
          <v-toolbar-title style="letter-spacing: 2px">
            CHI TIẾT
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn icon dark @click="detailModal.status = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <div class="slideUp-background" v-if="detailModal.status">
          <div class="slideUp-wrap">
            <v-card-title class="headline pb-0 service-name">
              <div class="small-title">Dịch vụ</div>
              <div class="primary--text font-weight-bold">
                <span>{{ detailModal.model.name }}</span>
              </div>
            </v-card-title>
            <!-- Action button view -->
            <template v-for="variant in detailModal.model.variants">
              <v-list-item class="px-2" :key="variant.id">
                <v-list-item-content class="pr-2">
                  <v-list-item-title class="service-name font-weight-bold">{{
                    variant.name
                  }}</v-list-item-title>
                  <v-list-item-subtitle>
                    {{ variant.price | currencyFormat() }}
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <v-sheet
                    color="primary"
                    class="d-flex add-package-btn-group"
                    rounded
                  >
                    <v-btn
                      depressed
                      small
                      dark
                      icon
                      @click="
                        variant.amount === 0 ? false : (variant.amount -= 1)
                      "
                    >
                      <v-icon>mdi mdi-minus</v-icon>
                    </v-btn>
                    <v-sheet
                      color="white"
                      class="px-3 d-flex align-center justify-center"
                      >{{ variant.amount }}</v-sheet
                    >
                    <v-btn
                      dark
                      depressed
                      small
                      icon
                      @click="variant.amount += 1"
                    >
                      <v-icon>mdi mdi-plus</v-icon>
                    </v-btn>
                  </v-sheet>
                </v-list-item-action>
              </v-list-item>
              <v-divider class="my-1" :key="'divider' + variant.id"></v-divider>
            </template>
          </div>
        </div>
      </v-card>
    </v-dialog>
    <SuccessOverlay
      :success="success"
      :text="'Đã tạo gói! Vui lòng thanh toán tại lễ tân'"
      :btnText="'Quay lại'"
      @on-close="
        $router.push({
          name: 'CustomerProfile',
          params: { id: customer.id },
        })
      "
    />
  </ViewLayout>
</template>

<script>
import { mapState } from 'vuex';
import { cloneDeep } from 'lodash';
import { groupVariantsByServiceCategory } from '@/helpers/variants';
import ViewLayout from '@/layout/ViewLayout';
import ComboListItem from '@/components/pack/ComboListItem';
import SuccessOverlay from '@/components/common/SuccessOverlay';

export default {
  name: 'BuyPacks',
  components: {
    ViewLayout,
    ComboListItem,
    SuccessOverlay,
  },
  data() {
    return {
      success: false,
      paidMenu: [],
      giftMenu: [],
      detailModal: {
        status: false,
        model: null,
      },
      promotion: {
        type: false,
        value: null,
      },
      discountPercentRules: [
        (v) =>
          (parseInt(v, 10) >= 0 && parseInt(v, 10) <= 100) ||
          'Số % không hợp lệ',
      ],
      promotionCreditPercent: 0,
      upperTab: null,
      isFetched: false,
      tab: null,
      promotionTab: null,
      search: '',
      title: 'Mua gói (package)',
      right: {
        icon: 'mdi-reload',
        click: async () => {
          await this.reload();
        },
      },
      left: {
        icon: 'mdi-chevron-left',
        click: () => {
          this.back();
        },
      },
    };
  },
  watch: {
    'promotion.type': {
      deep: true,
      handler() {
        this.promotionCreditPercent = 0;
        this.resetAmount(this.giftMenu);
      },
    },
    tab() {
      this.search = '';
    },
  },
  computed: {
    ...mapState('variants', ['serviceCategories', 'variants']),
    paidCombos() {
      return this.paidMenu.filter((v) => v.amount);
    },
    totalPrice() {
      return this.paidCombos.reduce((sum, currentVariant) => {
        // eslint-disable-next-line no-param-reassign
        sum += currentVariant.price * currentVariant.amount;
        return sum;
      }, 0);
    },
    promotionCombos() {
      return this.giftMenu.filter((v) => v.amount);
    },
    displayPaidMenu() {
      return groupVariantsByServiceCategory(
        this.paidMenu,
        this.serviceCategories,
      );
    },
    displayGiftMenu() {
      return groupVariantsByServiceCategory(
        this.giftMenu,
        this.serviceCategories,
      );
    },
  },
  methods: {
    resetAmount(variants) {
      variants.forEach((v) => {
        v.amount = 0;
      });
    },
    chooseCombo(service) {
      this.detailModal.model = service;
      this.detailModal.status = true;
    },
    nextStep() {
      switch (this.upperTab) {
        case 'add-combo':
          if (this.promotion.type) {
            this.upperTab = 'config-promotion';
          } else {
            this.upperTab = 'create-package';
          }
          return;
        case 'config-promotion':
          this.upperTab = 'create-package';
          break;
        default:
      }
    },
    previousStep() {
      switch (this.upperTab) {
        case 'create-package':
          if (this.promotion.type) {
            this.upperTab = 'config-promotion';
          } else {
            this.upperTab = 'add-combo';
          }
          return;
        case 'config-promotion':
          this.upperTab = 'add-combo';
          break;
        default:
      }
    },
    generateMenu(isPromotionCombo = false) {
      const filteredVariant = this.variants.filter(
        (v) => v.service.service_category.name !== 'promotion',
      );
      // deep clone to create new menu Object
      const menu = cloneDeep(filteredVariant);

      // Add quantity control to each service
      return menu.map((v) => ({
        ...v,
        amount: 0,
        is_promotion_combo: isPromotionCombo,
      }));
    },
    async createNewPackage() {
      const mergedCombos = [...this.paidCombos];

      if (this.promotion.type === 'promotion-combos') {
        mergedCombos.push(...this.promotionCombos);
      }

      const combos = mergedCombos.map((v) => ({
        variant_id: v.id,
        amount: v.amount,
        is_promotion_combo: v.is_promotion_combo,
      }));

      const formData = {
        customer_id: this.customer.id,
        is_gift: false,
        promotion_type: this.promotion.type,
        combos,
      };
      try {
        this.setLoading(true);
        const isSuccess = await this.dispatch('packs/createPackage', formData);
        if (isSuccess) {
          this.success = true;
        }
      } catch (err) {
        console.log(err);
      } finally {
        this.setLoading(false);
      }
    },
    async reload() {
      this.setLoading(true);
      await this.dispatch('variants/getVariants');
      this.initMenu();
      this.setLoading(false);
    },
    initMenu() {
      this.paidMenu = this.generateMenu();
      this.giftMenu = this.generateMenu(true);
      this.upperTab = 'add-combo';
    },
  },
  async created() {
    this.setLoading(true);
    const { customerId } = this.$route.params;
    await this.dispatch('customer/GET_CUSTOMER_BY_ID', customerId);
    this.initMenu();
    this.isFetched = true;
    this.setLoading(false);
  },
};
</script>
