          <template v-if="chosenService.service_category.name !== 'promotion'">
  <div class="slideUp-wrap">
    <v-card-title class="headline pb-0 service-name">
      <div class="small-title">Dịch vụ</div>
      <div class="primary--text font-weight-bold">
        <span>{{ chosenService.name }}</span>
      </div>
    </v-card-title>
    <!-- Action button view -->
    <template v-if="slideUpView === 1">
      <template v-if="hasGender(chosenService.variants)">
        <v-row class="mx-0 px-4">
          <v-col cols="6" class="pl-0 pr-1">
            <v-btn
              color="primary"
              x-large
              block
              :outlined="selectedGender !== 'female'"
              @click="filterVariantsByGender('female')"
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
      <template v-for="variant in variants">
        <v-list-item class="px-2" :key="variant.id">
          <v-list-item-avatar @click="chosenVariant = variant">
            <v-icon
              size="30px"
              v-if="chosenVariant.id === variant.id"
              color="primary"
              >mdi-checkbox-marked-circle</v-icon
            >
            <v-icon size="30px" v-else
              >mdi-checkbox-blank-circle-outline</v-icon
            >
          </v-list-item-avatar>

          <v-list-item-content class="pr-2" v-if="variant.description">
            <v-list-item-title class="service-name font-weight-bold"
              >{{ variant.description }}</v-list-item-title
            >
            <v-list-item-subtitle></v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <v-list-item-title class="service-name font-weight-bold">{{
              variant.sale_price | currencyFormat()
            }}</v-list-item-title>
          </v-list-item-action>
        </v-list-item>
        <v-divider class="my-1 mx-4" :key="'divider' + variant.id"></v-divider>
      </template>
      <v-row class="mx-0 pt-2">
        <v-col cols="12" sm="6" class="py-0 px-4 pr-sm-2">
          <v-btn
            outlined
            color="primary"
            class="w-100 multiple-line-btn pa-4"
            v-if="comboExisted(chosenVariant.id, checkInCustomer) === 1"
            @click="slideUpView = 2"
            :disabled="
              !chosenService.is_combo_sold || checkInCustomer.id === null
            "
          >
            <div class="headline text-capitalize">
              {{ $t("service.combo_title") }}
            </div>

            <div class="text-left v-card__subtitle pa-0 text-capitalize">
              {{ $t("service.combo_description") }}
            </div>
            <div class="pt-5">{{ $t("service.combo_buy_now") }}</div>
          </v-btn>
          <v-btn
            v-else
            outlined
            color="primary"
            class="w-100 multiple-line-btn pa-4"
            @click="
              slideUpModal = false
              tab = 'tab-menu-combo'
            "
          >
            <div class="headline text-capitalize">Đã sở hữu gói combo</div>

            <div class="text-left v-card__subtitle pa-0 text-capitalize">
              Vui lòng kích hoạt và sử dụng gói dịch vụ trước ngày hết hạn
            </div>
            <div class="pt-5">
              <template
                v-if="comboExisted(chosenVariant.id, checkInCustomer) === -1"
                >Thanh toán để kích hoạt gói</template
              >
              <template
                v-if="comboExisted(chosenVariant.id, checkInCustomer) === -2"
                >Book dịch vụ từ gói đã mua</template
              >
            </div>
          </v-btn>
        </v-col>
        <v-col cols="12" sm="6" class="pb-0 py-sm-0 px-4 pl-sm-2">
          <v-btn
            outlined
            color="#835a38"
            class="w-100 multiple-line-btn pa-4"
            @click="makeOrder(chosenService)"
          >
            <div class="headline text-capitalize">
              {{ $t("service.single_title") }}
            </div>

            <div class="text-left v-card__subtitle pa-0 text-capitalize">
              {{ $t("service.single_description") }}
            </div>
            <div class="pt-5">{{ $t("service.single_buy_now") }}</div>
          </v-btn>
        </v-col>
      </v-row>
    </template>
    <!-- Combo view -->
    <template v-if="slideUpView === 2">
      <ComboSlide
        :user="checkInCustomer"
        :variant="chosenVariant"
        @back="slideUpView = 1"
        @bought="
          slideUpModal = false
          tab = 'tab-menu-combo'
        "
      />
    </template>
    <!-- Make Order View -->
    <template v-if="slideUpView === 3">
      <NewOrder
        :service="chosenService"
        :order="order"
        :editable="true"
        @back="slideUpView = 1"
        @back-to-intake="backToIntake"
        @push-new-order="pushNewOrder"
        @edit-order="editOrder"
      />
    </template>
  </div>
</template>
          <template v-else>
  <div class="slideUp-wrap">
    <v-card-title class="headline pb-0 service-name">
      <div class="small-title">Gói Ưu Đãi</div>
      <div class="primary--text font-weight-bold">
        <span>{{ chosenService.name }}</span>
      </div>
    </v-card-title>
    <!-- Action button view -->
    <template v-if="slideUpView === 1">
      <template v-for="variant in variants">
        <v-list-item class="px-2" :key="variant.id">
          <v-list-item-avatar>
            <v-icon size="30px" color="primary">mdi-checkbox-marked</v-icon>
          </v-list-item-avatar>

          <v-list-item-content class="pr-2">
            <v-list-item-title class="service-name font-weight-bold">{{
              variant.name
            }}</v-list-item-title>
            <v-list-item-subtitle></v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <v-list-item-title
              v-if="variant.sale_price"
              class="service-name font-weight-bold"
            >
              {{ variant.sale_price | currencyFormat() }}
            </v-list-item-title>
            <v-list-item-title v-else class="service-name font-weight-bold">
              Gói tặng
            </v-list-item-title>
          </v-list-item-action>
        </v-list-item>
        <v-divider class="my-1 mx-4" :key="'divider' + variant.id"></v-divider>
      </template>
      <v-row class="mx-0 pt-2">
        <v-col cols="12" sm="6" class="pb-0 py-sm-0 px-4 pl-sm-2">
          <v-btn
            outlined
            color="#835a38"
            class="w-100 multiple-line-btn pa-4"
            @click="makePromotionOrder(chosenService)"
          >
            <div class="headline text-capitalize">
              {{ $t("Gói Ưu Đãi") }}
            </div>

            <div class="text-left v-card__subtitle pa-0 text-capitalize">
              {{ $t("Trải nghiệm những dịch vụ hot nhất với giá tốt nhất.") }}
            </div>
            <div class="pt-5">{{ $t("service.single_buy_now") }}</div>
          </v-btn>
        </v-col>
      </v-row>
    </template>
    <!-- Make Order View -->
    <template v-if="slideUpView === 3">
      <NewPromotionOrder
        :service="chosenService"
        :order="order"
        :editable="true"
        @back="slideUpView = 1"
        @back-to-intake="backToIntake"
        @push-new-order="pushNewPromotionOrder"
        @edit-order="editPromotionOrder"
      />
    </template>
  </div>
</template>