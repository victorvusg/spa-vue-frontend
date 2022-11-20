<template>
  <v-dialog
    v-model="dialog"
    persistent
    max-width="600px"
    fullscreen
    transition="dialog-bottom-transition"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        text
        style="float: right"
        color="primary"
        dark
        v-bind="attrs"
        v-on="on"
      >
        + Tạo Công Việc
      </v-btn>
    </template>
    <v-card style="position: relative" v-if="dialog">
      <v-card-title
        class="d-flex align-center justify-space-between pa-2 primary"
        style="
              position: sticky;
              top: 0;
              z-index: 1;
            "
      >
        <v-btn text @click="close()" color="white"> Đóng </v-btn>
        <span class="headline white--text">Chi Tiết Công Việc</span>
        <v-btn text dark :disabled="!valid" @click="createTask">
          + Tạo
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="valid">
          <v-container>
            <div>
              <h3 class="mb-2">Tên Công Việc*</h3>
              <v-text-field
                outlined
                color="primary"
                v-model="name"
                :rules="rules.required"
              ></v-text-field>
            </div>
            <h3 class="my-2">Phân Công</h3>
            <v-card
              elevation="0"
              v-for="(day, index) in days"
              :key="`day_${day.value}`"
              class="pa-4"
              :class="{ 'mb-4': index !== days.length - 1 }"
              style="border: 1px solid #2f573d"
            >
              <h4>{{ $t(day.value) }}</h4>
              <v-list dense class="py-0">
                <v-list-item
                  v-for="(assignment, assignIndex) in day.assignments"
                  :key="`assignment_${day.value}_${assignIndex}`"
                  class="px-0"
                >
                  <v-list-item-icon class="mr-2">
                    <v-btn
                      icon
                      color="primary"
                      @click="remove(index, assignIndex)"
                    >
                      <v-icon color="error">mdi mdi-minus-circle</v-icon>
                    </v-btn>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>
                      <v-select
                        class="error-message-hidden pt-0 mt-0"
                        item-color="primary"
                        :items="employees"
                        :menu-props="{ top: false, offsetY: true }"
                        item-text="name"
                        item-value="id"
                        v-model="assignment.employee_id"
                        :rules="rules.requried"
                      >
                        <template slot="selection" slot-scope="data">
                          <!-- HTML that describe how select should render selected items -->
                          <span class="font-weight-bold error--text">
                            {{ data.item.name }}
                          </span>
                        </template>
                        <template slot="item" slot-scope="data">
                          <span
                            :class="{
                              'font-weight-bold error--text':
                                assignment.employee_id === data.item.id,
                            }"
                            >{{ data.item.name }}</span
                          >
                        </template>
                      </v-select>
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
              <div class="text-right">
                <v-btn text depressed elevation="0" small color="primary" @click="add(index, day.value)">
                  + Thêm người làm
                </v-btn>
              </div>
            </v-card>
          </v-container>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
import taskMixins from '@/mixins/task.mixins';

const initialData = () => ({
  search: '',
  valid: true,
  errorMessage: '',
  rules: {
    required: [(v) => !!v || 'Không được để trống'],
  },
  dialog: false,
  name: '',
  days: [
    { value: 'mon', assignments: [] },
    { value: 'tue', assignments: [] },
    { value: 'wed', assignments: [] },
    { value: 'thu', assignments: [] },
    { value: 'fri', assignments: [] },
    { value: 'sat', assignments: [] },
    { value: 'sun', assignments: [] },
  ],
});
export default {
  name: 'CreateTaskDialog',
  mixins: [taskMixins],
  data: () => initialData(),
  methods: {
    close() {
      Object.assign(this.$data, initialData());
    },
    add(index, day) {
      this.days[index].assignments.push({
        day,
        employee_id: null,
      });
    },
    remove(dayIndex, assignIndex) {
      this.days[dayIndex].assignments.splice(assignIndex, 1);
    },
    async createTask() {
      this.setLoading(true);
      try {
        const schedule = this.days.reduce((data, currentDay) => {
          data.push(...currentDay.assignments);
          return data;
        }, []);
        await this.dispatch('task/createTask', { schedule, name: this.name });
        this.close();
      } catch (error) {
        console.log(error);
        this.toggleToast({
          model: true,
          color: 'error',
          message: 'Có lỗi xảy ra !',
        });
      } finally {
        this.setLoading(false);
      }
    },
  },
};
</script>
