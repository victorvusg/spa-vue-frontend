import { mapState } from 'vuex';

const computed = {
  ...mapState('task', ['tasks']),
  ...mapState('employee', { employees: 'ktvList' }),
};

export default {
  computed,
};
