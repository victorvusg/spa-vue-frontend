<template>
  <v-sheet color="accent">
    <v-app-bar flat color="rgba(0, 0, 0, 0)" class="px-0">
      <v-app-bar-nav-icon
        @click="user.id !== null ? viewUserProfile(user) : false"
      >
        <v-icon>mdi-account-circle</v-icon>
      </v-app-bar-nav-icon>
      <v-toolbar-title class="title pl-0">
        {{ roles[user.role || 'kh'] }}
      </v-toolbar-title>

      <v-spacer></v-spacer>
      <slot name="action"></slot>
    </v-app-bar>
    <v-row class="mx-0 profile-cover px-5 pb-2 my-0">
      <v-col cols="12" class="pa-0">
        <div class="display-1 primary--text">{{ user.name }}</div>
      </v-col>
      <v-col cols="12" class="pa-0" v-if="!user.role && user.id">
        <div class="warning--text d-flex align-center font-weight-bold">
          <v-icon class="pr-2" color="warning" size="18px"
            >mdi-alpha-c-circle</v-icon
          >
          {{ user.balance }}
        </div>
      </v-col>
      <v-col cols="12" class="pa-0 pt-3" v-if="user.medical_history">
        <div class="red--text text--darken-1">
          <u>Lưu ý tình trạng sức khỏe khách:</u>
        </div>
        <div class="caption">
          {{ user.medical_history }}
        </div>
      </v-col>
    </v-row>
  </v-sheet>
</template>

<script>
export default {
  name: 'UserProfilePanel',
  props: ['user', 'role'],
  data() {
    return {
      roles: {
        admin: 'Admin',
        ktv: 'Kỹ thuật viên',
        kh: 'Khách hàng',
      },
    };
  },
  computed: {},
  methods: {
    viewUserProfile(user) {
      if ('role' in user) {
        this.$router.push({ name: 'MyProfile' });
      } else {
        this.$router.push({ name: 'CustomerProfile', params: { id: user.id } });
      }
    },
  },
};
</script>
