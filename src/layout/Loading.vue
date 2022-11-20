<template>
  <v-overlay :z-index="1111" light :color="'grey lighten-1'" v-if="isLoading">
    <div class="box-loading-wrap">
      <div class="box-loading">
        <div class="text-loading-animation">
          <v-progress-circular
            indeterminate
            color="#295F49"
          ></v-progress-circular>
        </div>
      </div>
    </div>
  </v-overlay>
</template>
<script>
import { mapState } from 'vuex';

export default {
  name: 'Loading',
  computed: {
    ...mapState('app', ['isLoading']),
  },
};
</script>
