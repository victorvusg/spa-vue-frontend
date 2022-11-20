<template>
  <v-dialog
    v-model="dialog"
    fullscreen
    persistent
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        x-large
        outlined
        dark
        color="secondary"
        depressed
        block
        v-bind="attrs"
        v-on="on"
        @click="
          currentView = 'check-in';
          checkInModal = true;
        "
        >Khách Hàng</v-btn
      >
    </template>
    <v-card>
      <v-toolbar dark color="primary" class="sticky-toolbar">
        <v-toolbar-title>{{ contents.title }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn icon dark @click="iconFunc">
            <v-icon>{{ contents.icon }}</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-tabs v-model="currentView" v-if="false">
        <v-tab href="#check-in"></v-tab>
        <v-tab href="#create-customer"></v-tab>
      </v-tabs>

      <v-tabs-items v-model="currentView">
        <v-tab-item :value="'check-in'">
          <v-sheet color="accent" class="pb-4">
            <v-subheader class="px-6">Tìm kiếm khách hàng</v-subheader>
            <CustomerSearch
              class="mx-4"
              v-if="dialog && currentView === 'check-in'"
              @result-click="viewCustomerDetail"
            />
          </v-sheet>
          <v-list three-line subheader>
            <v-subheader>Lựa chọn khác:</v-subheader>
            <v-list-item @click="currentView = 'create-customer'">
              <v-list-item-action>
                <v-icon size="30px">mdi mdi-account-plus</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>Tạo khách hàng mới</v-list-item-title>
                <v-list-item-subtitle
                  >Khách hàng sẽ được tích điểm và hưởng ưu đãi khi sử dụng dịch
                  vụ tại spa.</v-list-item-subtitle
                >
              </v-list-item-content>
            </v-list-item>
            <v-list-item @click="guestCheckIn()">
              <v-list-item-action>
                <v-icon size="30px">mdi mdi-account-outline</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>Guest Check-in</v-list-item-title>
                <v-list-item-subtitle
                  >Check-in nhanh ( dành cho khách hàng trải nghiệm hoặc khách
                  vãng lai )</v-list-item-subtitle
                >
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-tab-item>
        <v-tab-item :value="'create-customer'">
          <v-list three-line subheader>
            <v-subheader
              >Điền thông tin khách hàng mới theo các mục bên dưới</v-subheader
            >
            <div class="mx-4">
              <CreateNewCustomer
                v-if="dialog && currentView === 'create-customer'"
              />
            </div>
          </v-list>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
  </v-dialog>
</template>
<script>
import CustomerSearch from '@/components/customer/CustomerSearch';
import CreateNewCustomer from '@/components/customer/CreateNewCustomer';

export default {
  name: 'CheckinCustomer',
  components: {
    CustomerSearch,
    CreateNewCustomer,
  },
  data() {
    return {
      currentView: 'check-in',
      dialog: false,
    };
  },
  computed: {
    contents() {
      let contents;
      switch (this.currentView) {
        case 'create-customer':
          contents = {
            title: 'TẠO KHÁCH MỚI',
            icon: 'mdi-chevron-left',
          };
          break;
        case 'check-in':
        default:
          contents = {
            title: 'CHECK-IN',
            icon: 'mdi-close',
          };
      }
      return contents;
    },
  },
  methods: {
    close() {
      this.dialog = false;
    },
    iconFunc() {
      if (this.currentView === 'create-customer') {
        this.currentView = 'check-in';
        return;
      }
      this.close();
    },
    guestCheckIn() {
      this.$router.push({
        name: 'Check-in',
        params: {
          customerId: 'guest',
        },
      });
    },
    viewCustomerDetail(customer) {
      this.$router.push({
        name: 'CustomerProfile',
        params: {
          id: customer.id,
        },
      });
    },
    receiveCreateEvent(phoneNum) {
      this.newCustomerPhone = phoneNum;
      this.currentView = 'create-customer';
    },
  },
};
</script>
