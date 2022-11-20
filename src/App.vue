<template>
  <v-app style="overflow-x: hidden; height: 100vh !important">
    <router-view></router-view>
    <Loading />
    <NotFoundDialog />
  </v-app>
</template>

<script>
import Loading from '@/layout/Loading';
import NotFoundDialog from '@/components/common/NotFoundDialog';
import './style/main.scss';

export default {
  name: 'App',
  components: {
    Loading,
    NotFoundDialog,
  },
  data() {
    return {
      allowRoute: false,
    };
  },
};
</script>
