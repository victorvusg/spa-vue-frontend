<template>
  <v-dialog
    v-model="packModal"
    fullscreen
    hide-overlay
    persistent
    transition="dialog-bottom-transition"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-list-item v-bind="attrs" v-on="on">
        <v-list-item-icon>
          <v-icon color="grey darken-1">mdi-tag-multiple</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title> Các Gói (Packages)</v-list-item-title>
          <v-list-item-subtitle>
            Danh sách gói (packages) đã mua
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
      <v-toolbar dark color="primary" class="sticky-toolbar">
        <v-toolbar-title>Gói dịch vụ đang có</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn icon dark @click="packModal = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-card-text class="profile-list-combos pt-6" v-if="packModal">
        <ListPacks />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
// @ is an alias to /src
import CustomerPacks from '@/components/customer/customer-packs/CustomerPacks';
import ListPacks from '@/components/intake/common/ListPacks';

export default {
  name: 'CustomerPacksModal',
  props: ['packs'],
  data() {
    return {
      packModal: false,
    };
  },
  components: {
    CustomerPacks,
    ListPacks,
  },
};
</script>
