<template>
  <v-dialog v-model="dialog" persistent max-width="290">
    <v-card>
      <v-card-text class="pa-4 text-center">
        {{ content }}
      </v-card-text>
      <v-card-actions class="pa-0">
        <v-spacer></v-spacer>
        <v-btn
          block
          color="primary"
          text
          @click="close"
          outlined
          style="border-radius: 0"
        >
          {{ $t('NOT_FOUND.OK') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import { mapState } from 'vuex';

export default {
  name: 'NotFoundDialog',
  methods: {
    close() {
      this.dialog = false;
      this.$router.go(-1);
    },
  },
  computed: {
    ...mapState('app', ['notFoundDialog']),
    content() {
      return this.notFoundDialog.content;
    },
    dialog: {
      get() {
        return this.notFoundDialog.model;
      },
      set(value) {
        this.dispatch('app/TOGGLE_NOT_FOUND_DIALOG', { model: value });
      },
    },
  },
};
</script>
