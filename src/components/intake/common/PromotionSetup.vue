<template>
  <v-card-text>
    <v-expansion-panels>
      <v-expansion-panel v-for="(order, i) in orders" :key="i">
        <v-expansion-panel-header class="font-weight-bold">
          {{ order.name }}
        </v-expansion-panel-header>
        <v-expansion-panel-content eager>
          <!-- Choose Employee  -->
          <div class="mt-4">
            <p class="section-label">Phụ trách</p>
            <v-select
              class="error--hidden pt-0 mt-0"
              item-color="primary"
              filled
              :items="ktvList"
              :menu-props="{ top: false, offsetY: true }"
              item-text="name"
              item-value="id"
              v-model="order.employee_id"
            >
              <template v-slot:selection="{ item }">
                <span class="font-weight-bold error--text">
                  {{ item.name }}
                </span>
              </template>
              <template v-slot:item="{ item }">
                <span
                  :class="{
                    'font-weight-bold error--text':
                      order.employee_id === item.id,
                  }"
                  >{{ item.name }}</span
                >
              </template>
            </v-select>
          </div>

          <!-- Order Note  -->
          <div class="mt-4">
            <div class="section-label">Ghi chú dịch vụ</div>
            <!-- Note Dich vu thuong  -->
            <v-textarea
              class="order-note-textarea"
              solo
              v-model="order.note.text"
              background-color="amber lighten-4"
              color="orange orange-darken-4"
            ></v-textarea>
          </div>

          <!-- Note massage body  -->
          <div v-if="order.note.type !== 'other'" class="mt-4">
            <div class="section-label">Sơ đồ trị liệu</div>
            <component
              :id="`order_note_${i}`"
              :is="`${order.note.type}-note`"
              v-bind:note.sync="order.note.note"
            ></component>
          </div>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <!-- Control Buttons -->
    <v-row>
      <v-col cols="6">
        <v-btn outlined class="v-btn--block" @click="cancel" color="primary"
          >Trở lại</v-btn
        >
      </v-col>
      <v-col cols="6">
        <v-btn class="v-btn--block" @click="addNewOrder" color="primary"
          >Book</v-btn
        >
      </v-col>
    </v-row>
  </v-card-text>
</template>

<script>
import { mapState } from 'vuex';
import { cloneDeep } from 'lodash';
import BodyNote from '@/components/intake/common/note-template/BodyNote';
import FacialNote from '@/components/intake/common/note-template/FacialNote';

export default {
  name: 'OrderSetup',
  props: {
    items: {
      type: Array,
      require: true,
    },
  },
  components: {
    BodyNote,
    FacialNote,
  },
  data() {
    return {
      isLoading: true,
      order: null,
    };
  },
  computed: {
    ...mapState('employee', ['ktvList']),
  },
  methods: {
    cancel() {
      this.$emit('cancel');
    },
    addNewOrder() {
      this.$emit('save', this.orders);
    },
  },
  created() {
    this.isLoading = true;
    this.orders = cloneDeep(this.items);
  },
};
</script>
