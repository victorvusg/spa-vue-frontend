<template>
  <v-card class="facial-form" elevation="0">
    <v-card-text>
      <v-row class="ma-0">
        <v-col cols="12" class="facials-diagram pa-0">
          <FaceSVG />
        </v-col>
      </v-row>
      <v-row class="ma-0">
        <v-col cols="6" v-for="(value, key) in note" :key="key">
          <h3 :class="`${key}--text`">{{ $t(key) }}</h3>
          <v-text-field
            :disabled="!editMode"
            label="Độ ẩm"
            prefix="%"
            type="number"
            :value="note[key].humidity"
            @input="update($event, key, 'humidity')"
          ></v-text-field>
          <v-text-field
            :disabled="!editMode"
            label="Độ dầu"
            prefix="%"
            type="number"
            :value="note[key].oil"
            @input="update($event, key, 'oil')"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-divider />
    </v-card-text>
  </v-card>
</template>
<script>
import FaceSVG from '@assets/svg/face.svg';
import { cloneDeep } from 'lodash';

export default {
  name: 'FacialNote',
  components: {
    FaceSVG,
  },
  props: {
    note: { type: Object, required: true },
  },
  data() {
    return {
      tab: 'tab-1',
      sections: [],
      clone: {},
    };
  },
  methods: {
    update(value, key, field) {
      this.clone[key][field] = value;
      this.$emit('update:note', this.clone);
    },
  },
  created() {
    this.clone = cloneDeep(this.note);
  },
};
</script>
