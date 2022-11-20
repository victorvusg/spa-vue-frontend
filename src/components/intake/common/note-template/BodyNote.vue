<template>
  <v-card class="body-form" elevation="0">
    <v-tabs v-model="tab" background-color="transparent" color="basil" grow>
      <v-tab href="#tab-1">Body Trước</v-tab>
      <v-tab href="#tab-2">Body Sau</v-tab>
    </v-tabs>
    <v-card-text ref="bodyDiagram">
      <v-tabs-items v-model="tab">
        <v-tab-item key="tab-1" :value="'tab-1'" eager>
          <div class="body-diagram">
            <FrontBodySVG></FrontBodySVG>
          </div>
          <v-row>
            <v-col class="pa-0" cols="6">
              <v-container class="pa-0" fluid>
                <p class="mb-1 font-weight-bold">Bên phải</p>
                <v-checkbox
                  :disabled="!editMode"
                  v-for="(part, index) in frontBody.right"
                  :key="index"
                  class="part-selector"
                  :label="$t(`body_diagram.${part}`)"
                  :value="part"
                  @change="changeHandle(part)"
                  v-model="model"
                ></v-checkbox>
              </v-container>
            </v-col>
            <v-col class="pa-0" cols="6">
              <v-container class="pa-0" fluid>
                <p class="mb-1 font-weight-bold">Bên trái</p>
                <v-checkbox
                  :disabled="!editMode"
                  v-for="(part, index) in frontBody.left"
                  :key="index"
                  class="part-selector"
                  :label="$t(`body_diagram.${part}`)"
                  :value="part"
                  @change="changeHandle(part)"
                  v-model="model"
                ></v-checkbox>
              </v-container>
            </v-col>
          </v-row>
        </v-tab-item>
        <v-tab-item key="tab-2" :value="'tab-2'" eager>
          <div class="body-diagram">
            <BackBodySVG ref="backBodyDiagram"></BackBodySVG>
          </div>
          <v-row>
            <v-col class="pa-0" cols="6">
              <v-container class="pa-0" fluid>
                <p class="mb-1 font-weight-bold">Bên trái</p>
                <v-checkbox
                  :disabled="!editMode"
                  v-for="(part, index) in backBody.left"
                  :key="index"
                  class="part-selector"
                  :label="$t(`body_diagram.${part}`)"
                  :value="part"
                  @change="changeHandle(part)"
                  v-model="model"
                ></v-checkbox>
              </v-container>
            </v-col>
            <v-col class="pa-0" cols="6">
              <v-container class="pa-0" fluid>
                <p class="mb-1 font-weight-bold">Bên phải</p>
                <v-checkbox
                  :disabled="!editMode"
                  v-for="(part, index) in backBody.right"
                  :key="index"
                  class="part-selector"
                  :label="$t(`body_diagram.${part}`)"
                  :value="part"
                  @change="changeHandle(part)"
                  v-model="model"
                ></v-checkbox>
              </v-container>
            </v-col>
          </v-row>
        </v-tab-item>
      </v-tabs-items>
    </v-card-text>
  </v-card>
</template>
<script>
import FrontBodySVG from '@/assets/svg/body-front.svg';
import BackBodySVG from '@/assets/svg/body-back.svg';
import { mapState } from 'vuex';

export default {
  name: 'BodyNote',
  components: {
    FrontBodySVG,
    BackBodySVG,
  },
  props: {
    note: { type: Array, default: [], required: true },
  },
  data() {
    return {
      tab: 'tab-1',
      sections: [],
      ref: {},
      model: [],
    };
  },
  computed: {
    backBody() {
      const result = { left: [], right: [] };
      this.sections
        .filter((v) => v.includes('back'))
        .reverse()
        .forEach((p) => {
          if (p.includes('left')) {
            result.left.push(p);
          } else {
            result.right.push(p);
          }
        });
      return result;
    },
    frontBody() {
      const result = { left: [], right: [] };
      this.sections
        .filter((v) => !v.includes('back'))
        .reverse()
        .forEach((p) => {
          if (p.includes('left')) {
            result.left.push(p);
          } else {
            result.right.push(p);
          }
        });
      return result;
    },
  },
  methods: {
    changeHandle(partName) {
      this.$emit('update:note', this.model);
      const el = this.ref.querySelector(
        `#${this.$attrs.id} g[data-name='${partName}']`,
      );
      el.classList.toggle('highlight');
    },
    getSectionList(arrayNodes = []) {
      return arrayNodes.reduce((accum, node) => {
        const part = node.getAttribute('data-name');
        if (part) {
          accum.push(part);
        }
        return accum;
      }, []);
    },
  },
  mounted() {
    this.model = [...this.note];
    this.$nextTick(() => {
      this.ref = this.$refs.bodyDiagram;
      const nodes = Array.from(this.ref.querySelectorAll('.section'));
      this.sections = nodes.reduce((accum, node) => {
        const part = node.getAttribute('data-name');
        if (part) accum.push(part);
        return accum;
      }, []);

      this.note.forEach((p) => {
        const el = this.ref.querySelector(`g[data-name='${p}']`);
        el.classList.add('highlight');
      });
    });
  },
};
</script>
