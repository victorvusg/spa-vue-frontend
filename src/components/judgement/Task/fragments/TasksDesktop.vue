<template>
  <div>
    <v-text-field
      v-model="search"
      append-icon="mdi-magnify"
      label="Search"
      single-line
      hide-details
    ></v-text-field>
    <v-data-table
      :headers="headers"
      :items="tasks"
      :search="search"
      class="chores-table"
    >
      <template v-slot:item.name="{ item }">
        <strong class="text-uppercase error--text">{{ item.name }}</strong>
      </template>
      <template v-for="day in days" v-slot:[`item.${day}`]="{ item }">
        <ul>
          <li v-for="assignment in item[day]">
            {{ assignment.employee.name }}
          </li>
        </ul>
        <ul>
          <li v-for="assignment in item[day]">
            {{ assignment.employee.name }}
          </li>
        </ul>
      </template>
    </v-data-table>
  </div>
</template>
<script>
import taskMixins from '@/mixins/task.mixins';

export default {
  name: 'TasksDesktop',
  mixins: [taskMixins],
  data() {
    return {
      search: '',
      days: [
        'mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun',
      ],
      headers: [
        {
          text: '',
          align: 'start',
          sortable: false,
          value: 'name',
        },
        { text: 'T.2', value: 'mon' },
        { text: 'T.3', value: 'tue' },
        { text: 'T.4', value: 'wed' },
        { text: 'T.5', value: 'thu' },
        { text: 'T.6', value: 'fri' },
        { text: 'T.7', value: 'sat' },
        { text: 'C.Nhật', value: 'sun' },
      ],
      testData: [
        {
          name: 'Lau nhà',
          mon: ['A', 'B', 'C'],
          tue: ['P'],
          wed: ['K'],
          thu: ['L'],
          fri: ['M'],
          sat: ['N'],
          sun: ['AA'],
        }],
    };
  },
};
</script>
<style lang="scss">
.chores-table {
  .v-data-table__mobile-table-row {
    .v-data-table__mobile-row {
      border-bottom: thin solid rgba(0, 0, 0, 0.12) !important;

      &:first-child {
        background-color: mistyrose;
        .v-data-table__mobile-row__header {
          display: none;
        }
      }
    }
  }
}
</style>
