<template>
  <div>
    <v-expansion-panels light v-model="panel">
      <v-expansion-panel class="notification-layout pa-3">
        <v-expansion-panel-header
          expand-icon="mdi-menu-down"
          style="min-height: 0px !important"
          class="pa-0"
        >
          <div class="d-flex align-center">
            <v-icon
              size="16"
              class="mr-2"
              style="border-radius: 4px; background-color: white"
            >
              mdi-clock</v-icon
            >
            <span
              class="grey--text text--darken-1 text-uppercase font-weight-thin"
            >
              VIỆC ĐƯỢC GIAO
            </span>
          </div>
          <template v-slot:actions>
            <span class="red--text text--darken-1 font-weight-thin">
              {{ chores.length ? `${chores.length} việc` : 'Chưa có' }}
            </span>
          </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content v-if="chores.length">
          <div class="mx-n6 mb-n4 pt-3">
            <div><strong>Hôm nay</strong></div>
            <div
              v-for="(chore, i) in chores"
              :key="i"
              class="d-flex align-center"
            >
              <div>
                <v-icon size="15" class="mr-1">mdi-check</v-icon>
                <span class="caption">{{ chore.title }}</span>
              </div>
            </div>
          </div>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>
<script>
import { mapState } from 'vuex';

export default {
  name: 'Chores',
  data() {
    return {
      panel: null,
    };
  },
  computed: {
    ...mapState('auth', ['currentUser']),
    chores() {
      return this.currentUser.task_assignments.filter(
        (t) => t.type === 'chore',
      );
    },
  },
  created() {
    if (this.chores.length) this.panel = 0;
  },
};
</script>
