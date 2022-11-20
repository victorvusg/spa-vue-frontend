<template>
  <ViewLayout v-if="isFetched" :left="left" :right="right" :title="title">
    <div class="customer-profile">
      <v-sheet class="mx-auto primary">
        <div class="d-flex align-center flex-column primary py-8 accent--text">
          <v-icon size="100px" color="accent">mdi-account-circle</v-icon>
          <div class="title font-weight-bold mt-2">
            {{ customer.name }}
          </div>
          <div v-if="customer.rank">Thành viên {{ $t(customer.rank) }}</div>
        </div>
        <div
          class="accent py-4"
          style="border-top-left-radius: 30px;border-top-right-radius: 30px"
        >
          <v-row class="mt-0 mb-4">
            <v-col cols="4" class="text-center">
              <div>
                <div class="caption font-weight-bold primary--text">
                  Số dư ví
                </div>
                <h1>{{ customer.balance }}</h1>
                <div class="text--darken-2 grey--text">Xu</div>
              </div>
            </v-col>
            <v-col cols="4" class="text-center">
              <div>
                <div class="caption font-weight-bold primary--text">
                  Điểm tích luỹ
                </div>
                <h1>{{ customer.cash_point }}</h1>
                <div class="text--darken-2 grey--text">Hiện tại</div>
              </div>
            </v-col>
            <v-col cols="4" class="text-center">
              <div>
                <div class="caption font-weight-bold primary--text">
                  Điểm tích luỹ
                </div>
                <h1>{{ customer.reward_remaining_points }}</h1>
                <div class="text--darken-2 grey--text">Năm ngoái</div>
              </div>
            </v-col>
          </v-row>
          <div class="px-4">
            <template v-if="!editMedicalHistory.status">
              <v-textarea
                auto-grow
                class="mb-3"
                hide-details
                outlined
                label="Lưu ý tình trạng sức khỏe khách"
                readonly
                :value="customer.medical_history"
              />
              <div class="text-right">
                <v-btn
                  dense
                  x-small
                  outlined
                  color="primary"
                  depressed
                  @click="editCustomerMedical"
                >
                  Điều chỉnh
                </v-btn>
              </div>
            </template>
            <template v-else>
              <v-textarea
                class="mb-3"
                hide-details
                outlined
                auto-grow
                label="Lưu ý tình trạng sức khỏe khách"
                v-model="editMedicalHistory.content"
              />
              <div class="text-right">
                <v-btn
                  class="mr-3"
                  dense
                  x-small
                  outlined
                  color="error"
                  depressed
                  @click="
                    editMedicalHistory.status = false;
                    editMedicalHistory.content = '';
                  "
                >
                  Hủy
                </v-btn>
                <v-btn
                  dense
                  x-small
                  outlined
                  color="primary"
                  depressed
                  @click="saveEditMedical()"
                >
                  Lưu
                </v-btn>
              </div>
            </template>
          </div>
        </div>
        <v-tabs v-model="tab" grow>
          <v-tab href="#personal-info"> Thông Tin </v-tab>
          <v-tab href="#account-management">Check-in</v-tab>
        </v-tabs>

        <v-tabs-items v-model="tab">
          <v-tab-item value="account-management">
            <v-list two-line>
              <IntakeTreatmentHistoryModal />
              <v-divider inset></v-divider>
              <v-list-item
                @click="
                  $router.push({
                    name: 'Check-in',
                    params: { customerId: customer.id },
                  })
                "
              >
                <v-list-item-icon>
                  <v-icon color="grey darken-1"> mdi-arrow-right</v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-title>Bắt đầu dịch vụ</v-list-item-title>
                  <v-list-item-subtitle
                    >Đi đến trang check-in</v-list-item-subtitle
                  >
                </v-list-item-content>
                <v-list-item-action>
                  <v-btn icon>
                    <v-icon color="grey lighten-1">mdi-information</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
              <v-divider inset></v-divider>
              <v-list-item @click="goToBuyPacks()">
                <v-list-item-icon>
                  <v-icon color="grey darken-1"> mdi-cart</v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-title>Mua Gói (Package)</v-list-item-title>
                  <v-list-item-subtitle
                    >Mua gói dịch vụ với ưu đãi</v-list-item-subtitle
                  >
                </v-list-item-content>
                <v-list-item-action>
                  <v-btn icon>
                    <v-icon color="grey lighten-1">mdi-information</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
              <v-divider inset></v-divider>
              <TopUpModal :customer="customer" />
              <v-divider inset></v-divider>
              <CustomerPacksModal />
              <v-divider inset></v-divider>
              <IntakeHistoryModal :customerId="customer.id" />
              <v-divider inset></v-divider>
              <InvoiceHistoryModal :customer="customer" />
              <v-divider inset></v-divider>
            </v-list>
          </v-tab-item>
          <v-tab-item value="personal-info">
            <v-list two-line>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="grey darken-1">mdi-phone</v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-title>
                    <a :href="`tel:${customer.phone}`">
                      {{ customer.phone | phoneFormat }}
                    </a></v-list-item-title
                  >
                  <v-list-item-subtitle>Mobile</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>

              <v-divider inset></v-divider>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="grey darken-1">mdi-calendar</v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-title>{{
                    customer.birthday
                      ? dateFormatted(customer.birthday, 'DD/MM/YYYY')
                      : '-'
                  }}</v-list-item-title>
                  <v-list-item-subtitle>Ngày sinh</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>

              <v-divider inset></v-divider>
              <v-list-item>
                <v-list-item-icon>
                  <a
                    :href="
                      `http://maps.google.com/?q=${customer.district}, ${customer.province}`
                    "
                  >
                    <v-icon color="grey darken-1">mdi-map-marker</v-icon>
                  </a>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-title>
                    {{ customer.district ? `${customer.district},` : '' }}
                    {{ `${customer.province || ''}` }}
                  </v-list-item-title>
                  <v-list-item-subtitle>Địa chỉ</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>

              <v-divider inset></v-divider>

              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="grey darken-1">mdi-email</v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-title>{{
                    customer.email || '-'
                  }}</v-list-item-title>
                  <v-list-item-subtitle>Email</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-tab-item>
        </v-tabs-items>
        <!-- customer packs modal  -->
      </v-sheet>
    </div>
  </ViewLayout>
</template>

<script>
// @ is an alias to /src
import { mapState, mapActions } from 'vuex';
import IntakeHistoryModal from '@/components/customer/customer-profile/IntakeHistoryModal';
import CustomerPacksModal from '@/components/customer/customer-packs/CustomerPacksModal';
import IntakeTreatmentHistoryModal from '@/components/customer/customer-profile/IntakeTreatmentHistoryModal';
import TopUpModal from '@/components/customer/customer-profile/TopUpModal';
import InvoiceHistoryModal from '@/components/customer/customer-profile/InvoiceHistoryModal';
import {
  checkCashPoint,
  getCustomerById,
  updateCustomer,
} from '@/axios/customer';
import ViewLayout from '@/layout/ViewLayout';

export default {
  name: 'CustomerProfile',
  components: {
    IntakeHistoryModal,
    CustomerPacksModal,
    TopUpModal,
    InvoiceHistoryModal,
    IntakeTreatmentHistoryModal,
    ViewLayout,
  },
  data() {
    return {
      title: 'Khách hàng',
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
      tab: 'personal-info',
      isFetched: false,
      isDeleting: false,
      creditModal: false,
      historyModal: false,
      deleteStyle: {
        display: 'flex',
        alignItem: 'center',
        justifyContent: 'flex-end',
      },
      editMedicalHistory: {
        status: false,
        content: '',
      },
    };
  },
  computed: {
    ...mapState('packs', ['packs']),
  },
  methods: {
    ...mapActions('customer', ['GET_CUSTOMER_BY_ID']),
    ...mapActions('combo', ['deleteCombo']),
    async saveEditMedical() {
      this.setLoading(true);
      try {
        const response = await updateCustomer(this.customer.id, {
          medical_history: this.editMedicalHistory.content,
        });
        if (response.data.IsSuccess) {
          this.customer.medical_history = this.editMedicalHistory.content;
        }
        this.editMedicalHistory.status = false;
      } catch (error) {
        this.editMedicalHistory = '';
        this.editMedicalHistory.status = false;
        console.log(error);
      }
      this.setLoading(false);
    },
    goToBuyPacks() {
      this.$router.push({
        name: 'BuyPacks',
        params: { customerId: this.customer.id },
      });
    },
    async deleteMyPack(pack) {
      this.isDeleting = true;
      await this.deletePack(pack);
      this.isDeleting = false;
    },
    async reload() {
      await this.init();
    },
    async init() {
      this.setLoading(true);
      let isSuccess = false;
      const { id } = this.$route.params;
      if (id) {
        try {
          await checkCashPoint(id);
          const response = await getCustomerById(id);
          if (response.status === 200) {
            isSuccess = true;
            this.dispatch('customer/SET_CUSTOMER', response.data.Data);
          }
        } catch (err) {
          console.log(err);
        }
      }

      if (!isSuccess) {
        this.dispatch('app/TOGGLE_NOT_FOUND_DIALOG', {
          model: true,
          content: 'Đã xảy ra lỗi',
        });
      }
      this.isFetched = true;
      this.setLoading(false);
    },
    editCustomerMedical() {
      this.editMedicalHistory.status = true;
      this.editMedicalHistory.content = this.customer.medical_history;
    },
  },
  async created() {
    await this.init();
  },
};
</script>
