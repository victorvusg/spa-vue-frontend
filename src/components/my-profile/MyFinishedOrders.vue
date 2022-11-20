<template>
  <v-dialog
    v-model="dialog"
    fullscreen
    hide-overlay
    persistent
    transition="dialog-bottom-transition"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn icon v-bind="attrs" v-on="on">
        <v-icon color="green lighten-1">mdi-information</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-toolbar dark color="primary" class="sticky-toolbar">
        <v-toolbar-title>Các dịch vụ đã làm</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn icon dark @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <CoreDataIlterator
        :url="'api/v1/orders'"
        :params="params"
        class="pa-4"
        v-if="dialog"
      >
        <template v-slot:items="{ items }">
          <template v-for="(order, index) in items">
            <v-card class="pa-4 mb-4" :key="index">
              <v-list-item-content class="py-0">
                <v-list-item-title>
                  <span class="caption">
                    {{
                      `${dateFormatted(order.created_at, 'kk:mm - DD/MM/YYYY')}`
                    }}
                  </span>
                </v-list-item-title>
                <v-list-item-subtitle class="body-1 mb-2">
                  <strong class="pa-1 grey white--text">{{ order.id }}</strong
                  ><strong class="ml-1">{{ order.name }}</strong>
                </v-list-item-subtitle>
                <div
                  class="body-1 d-flex align-end justify-space-between"
                  v-if="order.working_commission"
                >
                  <div class="font-weight-bold caption">Hoa Hồng</div>
                  <v-divider class="mb-1" />
                  <div class="font-weight-bold green--text">
                    {{ order.working_commission | currencyFormat }}
                  </div>
                </div>
              </v-list-item-content>
            </v-card>
          </template>
        </template>
      </CoreDataIlterator>
    </v-card>
  </v-dialog>
</template>

<script>
// @ is an alias to /src
import CoreDataIlterator from '@/components/core/CoreDataIlterator';

export default {
  name: 'MyFinishedOrders',
  data() {
    return {
      dialog: false,
    };
  },
  components: {
    CoreDataIlterator,
  },
  computed: {
    params() {
      return { employee_id: this.currentUser.id, is_valid: 1 };
    },
  },
};
</script>
<style lang="scss">
.subtitle-services {
  white-space: pre-line;
  flex-wrap: wrap;
}
</style>
