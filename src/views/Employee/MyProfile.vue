<template>
  <ViewLayout
    class="mx-auto"
    v-if="isFetched"
    :title="title"
    :left="left"
    :right="right"
  >
    <v-row class="mx-0 profile-cover">
      <v-card-title class="pl-8 pt-12 pb-8">
        <div class="display-1 pt-12 primary--text">{{ currentUser.name }}</div>
      </v-card-title>
    </v-row>

    <v-list two-line>
      <v-list-item>
        <v-list-item-icon>
          <v-icon color="grey darken-1">mdi-phone</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>
            <a :href="`tel:${currentUser.phone}`">
              {{ currentUser.phone | phoneFormat }}
            </a>
          </v-list-item-title>
          <v-list-item-subtitle>Mobile</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider inset></v-divider>

      <v-list-item>
        <v-list-item-icon>
          <v-icon color="grey darken-1">mdi-email</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ currentUser.email || '-' }}</v-list-item-title>
          <v-list-item-subtitle>Email</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider inset></v-divider>
      <v-list-item>
        <v-list-item-icon>
          <v-icon color="grey darken-1">mdi-human</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title
            >{{
              Math.round(currentUser.attitude_point) || '0'
            }}
            điểm</v-list-item-title
          >
          <v-list-item-subtitle>Điểm thái độ</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider inset></v-divider>
      <v-list-item>
        <v-list-item-icon>
          <v-icon color="grey darken-1">mdi-briefcase</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title
            >{{
              Math.round(currentUser.skill_point) || '0'
            }}
            điểm</v-list-item-title
          >
          <v-list-item-subtitle>Điểm tay nghề</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider inset></v-divider>
      <!-- Working Commission -->
      <v-list-item>
        <v-list-item-icon>
          <v-icon color="grey darken-1">mdi-chart-pie</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>Working commission</v-list-item-title>
          <v-list-item-subtitle
            >Tháng này:
            {{
              (currentUser.working_commission || 0) | currencyFormat
            }}</v-list-item-subtitle
          >
          <v-list-item-subtitle
            >Tháng trước:
            {{
              (currentUser.working_commission_prev || 0) | currencyFormat
            }}</v-list-item-subtitle
          >
        </v-list-item-content>
        <v-list-item-action>
          <MyFinishedOrders />
        </v-list-item-action>
      </v-list-item>
      <!-- Pack Sale Commissions -->
      <v-list-item>
        <v-list-item-action></v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>Sales commission</v-list-item-title>
          <v-list-item-subtitle
            >Tháng này:
            {{
              (currentUser.sale_commission || 0) | currencyFormat
            }}</v-list-item-subtitle
          >
          <v-list-item-subtitle
            >Tháng trước:
            {{
              (currentUser.sale_commission_prev || 0) | currencyFormat
            }}</v-list-item-subtitle
          >
        </v-list-item-content>
        <v-list-item-action>
          <MySalePacks />
        </v-list-item-action>
      </v-list-item>
      <!-- Top Up Commissions -->
      <v-list-item>
        <v-list-item-action></v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>Topup commission</v-list-item-title>
          <v-list-item-subtitle
            >Tháng này:
            {{
              (currentUser.topup_commission || 0) | currencyFormat
            }}</v-list-item-subtitle
          >
          <v-list-item-subtitle
            >Tháng trước:
            {{
              (currentUser.topup_commission_prev || 0) | currencyFormat
            }}</v-list-item-subtitle
          >
        </v-list-item-content>
        <v-list-item-action>
          <MyTopUpSale />
        </v-list-item-action>
      </v-list-item>
    </v-list>
    <v-card-actions class="d-flex align-center justify-center">
    </v-card-actions>
  </ViewLayout>
</template>

<script>
import MyFinishedOrders from '@/components/my-profile/MyFinishedOrders';
import MySalePacks from '@/components/my-profile/MySalePacks';
import MyTopUpSale from '@/components/my-profile/MyTopUpSale';
import ViewLayout from '@/layout/ViewLayout';

export default {
  name: 'MyProfile',
  components: { MyFinishedOrders, ViewLayout, MySalePacks, MyTopUpSale },
  data() {
    return {
      isFetched: false,
      orderListModal: false,
      comboListModal: false,
      title: 'Thông tin cá nhân',
      right: {
        icon: 'mdi-reload',
        click: async () => {
          await this.init();
        },
      },
      left: {
        icon: 'mdi-home',
        click: () => {
          this.home();
        },
      },
    };
  },
  methods: {
    async init() {
      this.setLoading(true);
      try {
        this.isFetched = false;
        await this.dispatch('auth/getCurrentUser', {
          show_commission: 1,
          show_point: 1,
        });
        this.setLoading(false);
        this.isFetched = true;
      } catch (err) {
        this.$router.push({ name: 'Login' });
        this.setLoading(false);
      }
      this.setLoading(false);
    },
  },
  async created() {
    await this.init();
  },
};
</script>
