<template>
  <v-dialog
    v-model="dialog"
    fullscreen
    hide-overlay
    persistent
    transition="dialog-bottom-transition"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-list-item v-bind="attrs" v-on="on">
        <v-list-item-icon>
          <v-icon color="warning">mdi-alpha-c-circle</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title> Nạp Xu Vào Ví Spa </v-list-item-title>
          <v-list-item-subtitle>
            Sử dụng Spa Credit để có giá ưu đãi
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
        <v-toolbar-title>Nạp Xu Vào Ví Spa</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn icon dark @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-card-text class="profile-list-combos pt-6" v-if="dialog">
        <TopUpWallet @top-up-done="dialog = false" />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
// @ is an alias to /src
import TopUpWallet from '@/components/wallet/TopUpWallet';

export default {
  name: 'TopUpModal',
  data() {
    return {
      dialog: false,
    };
  },
  components: {
    TopUpWallet,
  },
};
</script>
