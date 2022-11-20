<template>
  <v-row justify="center">
    <v-col cols="12" v-if="errorMessage">
      <v-alert
        class="error--text"
        border="right"
        colored-border
        type="error"
        elevation="2"
        >{{ errorMessage }}</v-alert
      >
    </v-col>
    <v-col cols="12" sm="10" md="8" lg="6">
      <v-card>
        <v-form ref="registerForm" @submit.prevent="submitForm">
          <v-card-text>
            <v-text-field
              ref="name"
              v-model="$v.name.$model"
              :rules="[() => !!$v.name.required || 'Vui lòng điền tên KH']"
              label="*Tên khách hàng"
              placeholder="Họ & Tên"
              required
            ></v-text-field>
            <v-text-field
              ref="phone"
              v-model="$v.phone.$model"
              :rules="[
                () => !!$v.phone.required || 'Vui lòng điền SĐT',
                () => !!$v.phone.numeric || 'Vui lòng chỉ nhập số',
              ]"
              placeholder="xxxx xxx xxx"
              label="*Số điện thoại"
              required
            ></v-text-field>
            <v-text-field
              ref="email"
              v-model="$v.email.$model"
              :rules="[
                () => !!$v.email.email || 'Vui lòng nhập đúng định dạng email',
              ]"
              label="Email"
              placeholder="Địa chỉ email (có thể bỏ trống)"
            ></v-text-field>
            <v-menu
              ref="menu"
              v-model="birthdayPickerMenu"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              min-width="290px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  :value="birthday ? dateFormatted(birthday, 'DD/MM/YYYY') : ''"
                  label="*Ngày sinh"
                  placeholder="DD/MM/YYYY"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                  required
                  :rules="[
                    () =>
                      !!$v.birthday.required ||
                      'Vui lòng nhập ngày tháng năm sinh',
                  ]"
                ></v-text-field>
              </template>
              <v-date-picker
                ref="picker"
                v-model="$v.birthday.$model"
                :max="new Date().toISOString().substr(0, 10)"
                min="1950-01-01"
                @change="saveBirthday"
                locale="vi"
              ></v-date-picker>
            </v-menu>
            <v-autocomplete
              v-model="$v.provinceObject.$model"
              :items="provinces"
              item-text="name"
              label="Bạn đến từ tỉnh thành nào ?"
              return-object
            ></v-autocomplete>
            <v-autocomplete
              v-if="provinceObject"
              v-model="$v.district.$model"
              :items="provinceObject.huyen"
              item-text="name"
              item-value="name"
              label="Quận/Huyện"
            ></v-autocomplete>
          </v-card-text>
          <v-row class="ma-0">
            <v-col cols="6">
              <v-btn color="error" block @click="$refs.registerForm.reset()"
                >Reset Form</v-btn
              >
            </v-col>
            <v-col cols="6">
              <v-btn color="primary" block type="submit" :disabled="$v.$invalid"
                >Tạo Mới</v-btn
              >
            </v-col>
          </v-row>
          <v-card-actions> </v-card-actions>
        </v-form>
      </v-card>
    </v-col>
    <SuccessOverlay
      :success="success"
      :text="'Chào mừng khách hàng mới'"
      :btnText="'Check-in'"
      @on-close="goToCheckIn"
      :btnText2="'Chi Tiết'"
      @on-close2="goToDetail"
    />
  </v-row>
</template>

<script>
import { mapActions } from 'vuex';
import { axiosFactory } from '@/axios';
import * as validationType from 'vuelidate/lib/validators';
import SuccessOverlay from '@/components/common/SuccessOverlay';

export default {
  name: 'CreateNewCustomer',
  props: ['phoneNumber'],
  data() {
    return {
      name: '',
      phone: '',
      email: '',
      birthday: '',
      district: null,
      provinceObject: null,
      lazy: false,
      panel: false,
      success: false,
      errorMessage: '',
      newCustomerId: null,
      birthdayPickerMenu: false,
    };
  },
  components: {
    SuccessOverlay,
  },
  watch: {
    birthdayPickerMenu(val) {
      if (val) {
        setTimeout(() => {
          this.$refs.picker.activePicker = 'YEAR';
        });
      }
    },
    phone: {
      immediate: true,
      handler() {
        this.errorMessage = '';
      },
    },
  },
  validations: {
    name: {
      required: validationType.required,
    },
    phone: {
      required: validationType.required,
      numeric: validationType.numeric,
    },
    email: {
      email: validationType.email,
    },
    birthday: {
      required: validationType.required,
    },
    district: {},
    provinceObject: {},
  },
  created() {
    this.phone = this.phoneNumber;
    this.provinceObject = { ...this.provinces[49] };
  },
  methods: {
    ...mapActions('customer', ['createCustomer']),
    saveBirthday(date) {
      this.$refs.menu.save(date);
    },
    async createNewCustomer(formData) {
      this.setLoading(true);
      try {
        const api = axiosFactory('api/v1/customers/');
        const response = await api.post('', formData);
        if (response.status !== 201) {
          this.errorMessage = 'Đã có lỗi xảy ra !';
          return;
        }
        this.newCustomerId = response.data.Data.id;
        this.success = true;
      } catch (error) {
        if (
          error.response &&
          error.response.data.Message.includes(formData.phone)
        ) {
          this.errorMessage = 'Số điện thoại đã tồn tại';
        } else {
          this.errorMessage = 'Đã có lỗi xảy ra !';
        }
      } finally {
        this.setLoading(false);
      }
    },
    async submitForm() {
      this.errorMessage = '';
      const { name, phone, email, birthday, district, provinceObject } = this;
      const province = provinceObject ? provinceObject.name : '';
      const formData = {
        name,
        phone,
        email,
        birthday,
        district,
        province,
      };
      await this.createNewCustomer(formData);
    },
    goToCheckIn() {
      this.$router.push({
        name: 'Check-in',
        params: { customerId: this.newCustomerId },
      });
    },
    goToDetail() {
      this.$router.push({
        name: 'CustomerProfile',
        params: { id: this.newCustomerId },
      });
    },
  },
};
</script>
