<template>
  <v-overlay :z-index="99999" light :color="'grey lighten-1'" :dark="false" v-if="success">
    <v-card class="mx-auto success-overlay-wrap" min-width="250" >
      <v-card-text>
        <lottie :options="defaultOptions" :height="80" :width="80" />
        <p class="text--grey">{{text}}</p>
      </v-card-text>
      <v-card-actions>
        <v-btn v-if="btnText2" text color="info" @click="close2()">{{btnText2}}</v-btn>
        <v-btn v-if="btnText" text color="primary" @click="close()">{{btnText}}</v-btn>
      </v-card-actions>
    </v-card>
  </v-overlay>
</template>
<script>
import Lottie from 'vue-lottie';
import * as animationData from '@assets/json/checkmark.json';

export default {
  name: 'SuccessOverlay',
  data: () => ({
    defaultOptions: { animationData: animationData.default, loop: false },
  }),
  props: ['success', 'text', 'btnText', 'btnText2'],
  components: {
    Lottie,
  },
  methods: {
    close() {
      this.$emit('on-close');
    },
    close2() {
      this.$emit('on-close2');
    },
  },
};
</script>
