<template>
  
</template>
<script>
import taskMixins from '@/mixins/task.mixins';
import CreateTaskDialog from './CreateTaskDialog';
import TasksMobile from './fragments/TasksMobile';

export default {
  name: 'Task',
  mixins: [taskMixins],
  components: {
    CreateTaskDialog,
    TasksMobile,
  },
  data() {
    return {
      tab: 'tab_task_management',
    };
  },
};
</script>
<style lang="scss">
.task-management {
  a.v-tab {
    margin-left: unset !important;
  }
}
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
