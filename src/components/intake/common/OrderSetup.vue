<template>
  <v-card-text v-if="order">
    <div class="mt-2">
      <div class="section-label">Loại dịch vụ</div>
      <div class="body-1 font-weight-bold">{{ order.name }}</div>
    </div>

    <!-- Choose Employee  -->
    <div class="mt-4">
      <p class="section-label">Phụ trách</p>
      <v-select
        :disabled="!editMode"
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
              'font-weight-bold error--text': order.employee_id === item.id,
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
        :disabled="!editMode"
        class="order-note-textarea"
        solo
        v-model="order.note.text"
        background-color="amber lighten-4"
        color="orange orange-darken-4"
      ></v-textarea>
    </div>

    <!-- Note massage body  -->
    <div
      v-if="order.note.type === 'body' || order.note.type === 'facial'"
      class="mt-4"
    >
      <div class="section-label">Sơ đồ trị liệu</div>
      <component
        id="current_order_note"
        :is="`${order.note.type}-note`"
        v-bind:note.sync="order.note.note"
      ></component>
    </div>

    <!-- Combo Template: Customer Signature -->
    <template v-if="order.combo_id !== null">
      <div class="section-label mb-2 mt-4">Chữ ký xác nhận của khách</div>
      <v-card
        elevation="2"
        width="300px"
        style="margin-left: auto; margin-right: auto"
      >
        <template v-if="!order.note.signature && editMode">
          <VueSignaturePad
            height="300px"
            width="300px"
            ref="signPad"
            :options="{ penColor: '#000000' }"
          ></VueSignaturePad>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" text @click="clearSign()">
              Ký lại
            </v-btn>
            <v-btn color="green darken-1" text @click="confirmSign()">
              Xác nhận
            </v-btn>
          </v-card-actions>
        </template>
        <template v-else>
          <img
            :src="order.note.signature"
            height="300px"
            width="300px"
            alt="saved signature"
            style="margin-left: auto; margin-right: auto"
          />
        </template>
      </v-card>
    </template>

    <!-- Control Buttons -->
    <v-row v-if="editMode">
      <v-col cols="6">
        <v-btn
          outlined
          v-if="order.combo_id === null"
          class="v-btn--block"
          @click="cancel()"
          color="primary"
          >Cancel</v-btn
        >
      </v-col>
      <v-col :cols="order.combo_id === null ? 6 : 12">
        <v-btn
          class="v-btn--block"
          @click="addNewOrder()"
          color="primary"
          :disabled="preventSave"
          >Ok</v-btn
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
import noteTypes from '@helpers/note';

export default {
  name: 'OrderSetup',
  props: {
    item: {
      type: Object,
      require: true,
    },
  },
  components: {
    BodyNote,
    FacialNote,
  },
  data() {
    return {
      order: null,
    };
  },
  computed: {
    ...mapState('employee', ['ktvList']),
    orderValidation() {
      let noteCondition = true;
      if (this.order.variant.variant_category === 'facials') {
        noteCondition = !this._.isEqual(
          noteTypes.facialForm.note,
          this.order.note.note,
        );
      }
      const employeeRequired = this.order.employee_id !== null;
      const signatureRequired =
        this.order.combo_id !== null ? !!this.order.note.signature : true;
      return employeeRequired && signatureRequired && noteCondition;
    },
    preventSave() {
      return !this.orderValidation;
    },
  },
  methods: {
    cancel() {
      this.$emit('cancel');
    },
    addNewOrder() {
      this.$emit('save', this.order);
    },
    clearSign() {
      this.signature = null;
      this.$refs.signPad.clearSignature();
    },
    confirmSign() {
      const { data } = this.$refs.signPad.saveSignature();
      this.order.note.signature = data;
    },
  },
  created() {
    this.order = cloneDeep(this.item);
    this.$nextTick(() => {
      if (this.order.combo_id !== null && this.$refs.signPad) {
        this.$refs.signPad.resizeCanvas();
      }
    });
  },
};
</script>
