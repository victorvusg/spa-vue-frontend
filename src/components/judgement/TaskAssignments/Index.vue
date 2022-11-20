<template>
  <div>
    <v-stepper alt-labels class="weekdays-stepper mb-4" v-model="currentDay">
      <v-stepper-header>
        <v-stepper-step
          v-for="day in dd"
          :step="day"
          @click="currentDay = day"
          color="blue"
          :key="`daysofWeek_${day}`"
          style="cursor: pointer"
        >
          {{ $t(`${DD[day]}`) }}
        </v-stepper-step>
      </v-stepper-header>
    </v-stepper>
    <v-data-iterator
      :items="listOfChores"
      :search="search"
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
        <h3 class="my-2 primary--text">Danh sách phân công</h3>
      </template>
      <template v-slot:default="props">
        <v-row class="  mx-0">
          <v-col cols="12" v-for="item in props.items" :key="item.id">
            <v-card class="mb-4">
              <v-card-title
                class="
                  pb-1
                  subheading
                  font-weight-bold
                  d-flex
                  align-center
                "
              >
                <div>{{ item.name }}</div>
              </v-card-title>
              <div class="d-flex align-center justify-end">
                <AssignTask :item="item" :day="DD[currentDay]" />
              </div>
              <v-divider></v-divider>

              <v-list dense v-if="item.assignments.length">
                <v-list-item
                  v-for="(each, index) in item.assignments"
                  :key="index"
                >
                  <v-btn icon class="mr-2" @click="removedAssignee(each.id)">
                    <v-icon v-text="'mdi-minus-circle'" color="red"></v-icon>
                  </v-btn>
                  <v-list-item-content
                    class="d-flex align-center justify-space-between"
                  >
                    <div>{{ each.employee.name }}</div>
                    <div>
                      <v-btn
                        text
                        x-small
                        color="error"
                        class=" px-0"
                        @click="openJudgementDialog(each.employee, item)"
                        >Chưa đạt ( trừ 1 điểm )</v-btn
                      >
                    </div>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
              <v-list v-else>
                <v-list-item>
                  <v-list-item-content class="error--text">
                    Chưa có người làm
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-card>
          </v-col>
        </v-row>
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
    <v-dialog v-model="dialog" persistent max-width="290">
      <v-card>
        <v-card-title class="text-h5">
          Đánh giá công việc
        </v-card-title>
        <v-card-text>
          <div class="mb-1 subtitle-1">
            Nhân viên: <strong>{{ judgementObject.employee.name }}</strong>
          </div>
          <div class="mb-1 body-1">
            Điểm bị trừ:
            <span class="red--text darken--lighten-1">-1</span>
          </div>
          <div class="mb-8 body-1">
            Công việc:
            <span class="red--text text--lighten-1">{{
              judgementObject.task.name
            }}</span>
          </div>

          <v-textarea
            hide-details
            outlined
            name="input-7-4"
            label="Nhận xét công việc"
            v-model="judgementObject.reason"
          ></v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="closeJudgementDialog">
            Huỷ
          </v-btn>
          <v-btn color="green darken-1" text @click="minusPoint">
            Lưu
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import moment from 'moment';
import AssignTask from './AssignTask';
import { mapState } from 'vuex';
import { axiosFactory } from '@/axios';

export default {
  name: 'TasksAssignments',
  components: {
    AssignTask,
  },
  data() {
    return {
      search: '',
      currentDay: 'T2',
      dd: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
      DD: {
        T2: 'mon',
        T3: 'tue',
        T4: 'wed',
        T5: 'thu',
        T6: 'fri',
        T7: 'sat',
        CN: 'sun',
      },
      judgementApi: axiosFactory('api/v1/judgement'),
      dialog: false,
      judgementObject: {
        employee: {},
        task: {},
        reason: '',
      },
    };
  },
  methods: {
    async removedAssignee(id) {
      this.setLoading(true);
      await this.dispatch('task/removeTaskAssignment', id);
      this.setLoading(false);
    },
    closeJudgementDialog() {
      this.dialog = false;
      this.judgementObject = {
        employee: {},
        task: {},
        reason: '',
      };
    },
    openJudgementDialog(employee, task) {
      this.judgementObject.employee = employee;
      this.judgementObject.task = task;
      this.judgementObject.reason = `Chưa hoàn thành tốt việc "${task.name}"`;
      this.dialog = true;
    },
    async minusPoint() {
      const payload = [
        {
          employee_id: this.judgementObject.employee.id,
          point: -1,
          reason: this.judgementObject.reason,
        },
      ];
      this.setLoading(true);
      await this.judgementApi.post('', payload);
      this.closeJudgementDialog();
      this.setLoading(false);
    },
  },
  computed: {
    ...mapState('task', ['taskAssignments']),
    listOfChores() {
      const currentDD = this.DD[this.currentDay];
      return this.taskAssignments.map((task) => {
        const { id, name } = task;
        return {
          id,
          name,
          assignments: task[currentDD] || [],
        };
      });
    },
  },
  created() {
    const today = moment().day();
    this.currentDay = this.$t(`daysOfWeek.DAY_${today}`);
  },
};
</script>
<style lang="scss">
.weekdays-stepper {
  box-shadow: unset !important;
  background: transparent !important;
  .v-stepper__header {
    box-shadow: unset !important;
  }
  .v-stepper__step {
    flex-basis: unset !important;
    padding: 0px !important;
  }
}
</style>
