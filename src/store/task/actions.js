import { axiosFactory } from '@/axios';

const taskAPI = axiosFactory('api/v1/task');
const taskAssignmentAPI = axiosFactory('api/v1/task-assignment');

export default {
  async FETCH_TASK_ASSIGNMENT({ commit }) {
    try {
      const response = await taskAssignmentAPI.get();
      if (response.data.IsSuccess) {
        commit('setValue', {
          key: 'taskAssignments',
          value: response.data.Data,
        });
      }
    } catch (error) {
      console.log(error);
    }
  },
  async createTask({ commit }, payload) {
    try {
      const response = await taskAPI.post('', payload);
      if (response.data.IsSuccess) {
        commit('setValue', {
          key: 'taskAssignments',
          value: response.data.Data,
        });
      }
    } catch (error) {
      console.log(error);
    }
  },
  async removeTask({ commit }, id) {
    try {
      const response = await taskAPI.delete(`${id}`);
      if (response.data.IsSuccess) {
        commit('setValue', {
          key: 'taskAssignments',
          value: response.data.Data,
        });
      }
    } catch (error) {
      console.log(error);
    }
  },
  async removeTaskAssignment({ commit }, id) {
    try {
      const response = await taskAssignmentAPI.delete(`${id}`);
      if (response.data.IsSuccess) {
        commit('setValue', {
          key: 'taskAssignments',
          value: response.data.Data,
        });
      }
    } catch (error) {
      console.log(error);
    }
  },
  async removeReminder({ commit, rootState }, id) {
    try {
      const response = await taskAssignmentAPI.delete(`${id}`);
      if (response.data.IsSuccess) {
        const { task_assignments } = rootState.auth.currentUser;
        const value = task_assignments.filter((t) => t.id !== id);
        commit('auth/setTaskAssignments', value, { root: true });
      }
    } catch (error) {
      console.log(error);
    }
  },
  async createTaskAssignments({ commit }, payload) {
    try {
      const response = await taskAssignmentAPI.post('', payload);
      if (response.data.IsSuccess) {
        commit('setValue', {
          key: 'taskAssignments',
          value: response.data.Data,
        });
      }
    } catch (error) {
      console.log(error);
    }
  },
};
