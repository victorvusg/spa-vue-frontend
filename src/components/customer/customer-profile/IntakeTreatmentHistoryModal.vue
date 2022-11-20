<template>
  <v-dialog
    v-model="dialog"
    fullscreen
    scrollable
    hide-overlay
    persistent
    transition="dialog-bottom-transition"
  >
    <template v-slot:activator="{ attrs, on }">
      <v-list-item v-bind="attrs" v-on="on">
        <v-list-item-icon>
          <v-icon color="grey darken-1"> mdi-clipboard-edit</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title> Lần Trị Liệu Gần Nhất </v-list-item-title>
          <v-list-item-subtitle>
            Chi tiết trị liệu Body/Facials gần nhất
          </v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-action>
          <v-btn icon>
            <v-icon color="grey lighten-1">mdi-information</v-icon>
          </v-btn>
        </v-list-item-action>
      </v-list-item>
    </template>
    <v-card>
      <v-toolbar
        dark
        color="primary"
        max-height="56px"
        style="box-shadow: none !important"
        class="sticky-toolbar"
      >
        <v-toolbar-title>LẦN TRỊ LIỆU GẦN NHẤT</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn icon dark @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-card-text v-if="hasCustomer" class="px-0">
        <v-tabs fixed-tabs background-color="transparent" v-model="tab">
          <v-tab href="#body">BODY</v-tab>
          <v-tab href="#facials">FACIALS</v-tab>
        </v-tabs>

        <v-tabs-items v-model="tab" class="px-4">
          <v-tab-item value="body" class="pt-3" eager>
            <div v-if="bodyTreatment">
              <OrderSetup :item="bodyTreatment" />
            </div>
            <div v-else class="d-flex align-center justify-center mt-3">
              Chưa có dữ liệu
            </div>
          </v-tab-item>
          <v-tab-item value="facials" class="pt-3" eager>
            <div v-if="facialTreatment">
              <OrderSetup :item="facialTreatment" />
            </div>
            <div v-else class="d-flex align-center justify-center mt-3">
              Chưa có dữ liệu
            </div>
          </v-tab-item>
        </v-tabs-items>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
// @ is an alias to /src
import { isEmpty } from 'lodash';
import { mapState } from 'vuex';
import OrderSetup from '@/components/intake/common/OrderSetup';

export default {
  name: 'IntakeTreatmentdialog',
  components: {
    OrderSetup,
  },
  data() {
    return {
      tab: 'body',
      isFormLoading: false,
      dialog: false,
    };
  },
  computed: {
    bodyTreatment() {
      if (this.hasCustomer && this.customer.latest_treatments.body) {
        const order = this.customer.latest_treatments.body;
        return {
          ...order,
          note: JSON.parse(order.note),
        };
      }
      return false;
    },
    facialTreatment() {
      if (this.hasCustomer && this.customer.latest_treatments.facials) {
        const order = this.customer.latest_treatments.facials;
        return {
          ...order,
          note: JSON.parse(order.note),
        };
      }
      return false;
    },
  },
  methods: {},
};
</script>
