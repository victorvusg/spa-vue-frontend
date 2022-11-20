<template>
  <v-dialog
    v-model="historyModal"
    fullscreen
    hide-overlay
    persistent
    transition="dialog-bottom-transition"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-list-item v-bind="attrs" v-on="on">
        <v-list-item-icon>
          <v-icon color="grey darken-1"> mdi-history</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title> Xem Lịch Sử Trị Liệu </v-list-item-title>
          <v-list-item-subtitle>
            Thống kê tất cả trị liệu tại spa
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
        <v-toolbar-title>LỊCH SỬ TRỊ LIỆU</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn icon dark @click="historyModal = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <CoreDataIlterator
        :url="'api/v1/intakes'"
        :params="params"
        class="pa-4"
        v-if="historyModal && hasCustomer"
      >
        <template v-slot:items="{ items }">
          <template v-for="(intake, index) in items">
            <v-list-item
              class="px-0"
              :key="index"
              @click="
                $router.push({
                  name: 'IntakeDetail',
                  params: { id: intake.id },
                })
              "
            >
              <v-list-item-content>
                <v-list-item-title>
                  <span class="caption">
                    {{
                      `${dateFormatted(
                        intake.created_at,
                        'kk:mm - DD/MM/YYYY',
                      )}`
                    }}
                  </span>
                </v-list-item-title>
                <v-list-item-subtitle class="body-1">
                  <strong class="pa-1 grey white--text">{{ intake.id }}</strong
                  ><strong class="ml-1">{{ intake.customer.name }}</strong>
                </v-list-item-subtitle>
                <v-list-item-subtitle class="body-2 mt-1 subtitle-services">
                  {{ intake.orders.map((o) => o.name).join('\n') }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-divider :key="`${index}_divider`" />
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
  name: 'IntakeHistoryModal',
  data() {
    return {
      historyModal: false,
    };
  },
  components: {
    CoreDataIlterator,
  },
  computed: {
    params() {
      if (!this.hasCustomer) return {};
      return { customer_id: this.customer.id, is_Valid: 1 };
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
