<template>
  <v-dialog
    v-model="dialog"
    persistent
    max-width="600px"
    fullscreen
    transition="dialog-bottom-transition"
  >
    <template v-slot:activator="{ attrs }">
      <v-btn
        x-large
        dark
        color="secondary"
        depressed
        block
        v-bind="attrs"
        @click="open"
        >Kiểm tra</v-btn
      >
    </template>
    <v-card style="position: relative">
      <v-toolbar dark color="primary" class="sticky-toolbar">
        <v-toolbar-title style="letter-spacing: 2px; text-transform: uppercase">
          Kiểm tra công việc
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn icon dark @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <div class="task-management" v-if="dialog">
        <v-tabs v-model="tab" align-with-title grow>
          <v-tabs-slider color="primary"></v-tabs-slider>
          <v-tab href="#tab_task_management">Quản lý</v-tab>
          <v-tab href="#tab_schedule">Phân Công</v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab" class="pa-4">
          <v-tab-item
            value="tab_task_management"
            v-if="tab === 'tab_task_management'"
          >
            <Tasks />
          </v-tab-item>
          <v-tab-item value="tab_schedule" v-if="tab === 'tab_schedule'">
            <TaskAssignments />
          </v-tab-item>
        </v-tabs-items>
      </div>
    </v-card>
  </v-dialog>
</template>
<script>
import Tasks from './Tasks/Index';
import TaskAssignments from './TaskAssignments/Index';

export default {
  name: 'Judgement',
  components: {
    Tasks,
    TaskAssignments,
  },
  data() {
    return {
      dialog: false,
      tab: 'tab_task_management',
    };
  },
  methods: {
    async open() {
      this.setLoading(true);
      try {
        await this.$store.dispatch('task/FETCH_TASK_ASSIGNMENT');
        this.dialog = true;
      } catch (err) {}
      this.setLoading(false);
    },
  },
  async created() {},
};
</script>
