<template>
  <div>
    <v-data-iterator
      :items="tasks"
      :items-per-page="50"
      :search="search"
      class="mt-4"
      :footer-props="{
        itemsPerPageText: 'Per Page',
      }"
    >
      <template v-slot:header>
        <v-text-field
          solo
          flat
          clearable
          outlined
          v-model="search"
          class="error-message-hidden"
          label="Tìm công việc"
        ></v-text-field>
        <div class="d-flex align-center justify-space-between my-2 ">
          <h3 class="primary--text">
            Danh sách công việc
          </h3>
          <CreateTaskDialog />
        </div>
      </template>
      <template v-slot:default="props">
        <v-list dense>
          <template v-for="item in props.items">
            <v-list-item class="px-0" :key="item.id">
              <v-btn icon class="mr-2" @click="removeTask(item.id)">
                <v-icon v-text="'mdi-minus-circle'" color="red"></v-icon>
              </v-btn>
              <v-list-item-content>
                {{ item.name }}
              </v-list-item-content>
            </v-list-item>
            <v-divider :key="`divider_${item.id}`" />
          </template>
        </v-list>
      </template>
      <template v-slot:no-results>
        <div class="px-4 d-flex align-center justify-center">
          Không tìm thấy công việc
        </div>
      </template>
      <template v-slot:no-data>
        <div class="px-4 d-flex align-center justify-center">
          Chưa có danh sách công việc
        </div>
      </template>
    </v-data-iterator>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import CreateTaskDialog from './CreateTaskDialog';

export default {
  name: 'TaskIndex',
  components: {
    CreateTaskDialog,
  },
  data() {
    return {
      search: '',
    };
  },
  computed: {
    ...mapState('task', ['taskAssignments']),
    tasks() {
      return this.taskAssignments.map((t) => {
        const { name, id } = t;
        return { name, id };
      });
    },
  },
  methods: {
    async removeTask(taskId) {
      this.setLoading(true);
      await this.$store.dispatch('task/removeTask', taskId);
      this.setLoading(false);
    },
  },
};
</script>
