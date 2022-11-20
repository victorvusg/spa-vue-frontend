<template>
  <div>
    <v-expansion-panels light>
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
              style="border-radius: 10px; background-color: white"
            >
              mdi-clipboard-edit</v-icon
            >
            <span
              class="grey--text text--darken-1 text-uppercase font-weight-thin"
            >
              Nhắc nhở cần làm
            </span>
          </div>
          <template v-slot:actions>
            <span class="red--text text--darken-1 font-weight-thin">
              {{ reminders.length ? `${reminders.length} việc` : 'Chưa có' }}
            </span>
          </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content v-if="reminders.length">
          <div class="mx-n6 mb-n4">
            <div class="pb-2 pt-3"><strong>Danh sách</strong></div>
            <div style="max-height: 400px; overflow-y: auto">
              <div
                v-for="(item, i) in reminders"
                :key="i"
                class="message-layout mb-3"
              >
                <div v-html="item.title" />
                <div class="d-flex align-center justify-end">
                  <v-btn text small color="error" @click="doneReminder(item.id)"
                    >Xong</v-btn
                  >
                </div>
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
  name: 'Reminders',
  data() {
    return {};
  },
  computed: {
    ...mapState('auth', ['currentUser']),
    reminders() {
      return this.currentUser.task_assignments.filter(
        (t) => t.type === 'reminder',
      );
    },
  },
  created() {},
  methods: {
    async doneReminder(id) {
      this.setLoading(true);
      await this.$store.dispatch('task/removeReminder', id);
      this.setLoading(false);
    },
  },
};
</script>
