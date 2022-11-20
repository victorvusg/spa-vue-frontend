<template>
  <div class="login">
    <v-container fluid class="py-0">
      <v-row class="row-h-100-mobile">
        <v-col cols="12" md="6" class="order-2 order-md-1">
          <v-row class="row-form">
            <v-col
              cols="10"
              md="8"
              lg="6"
              offset="1"
              offset-md="2"
              offset-lg="3"
            >
              <h1 class="mb-4">{{ $t('login.xin_chao') }} !</h1>
              <div class="form-login">
                <v-form
                  ref="form"
                  v-model="valid"
                  :lazy-validation="lazy"
                  @submit.prevent="login(userObj)"
                >
                  <v-text-field
                    v-model="userObj.username"
                    :label="$t('login.ten_dang_nhap')"
                    :rules="rules"
                    :loading="isSubmitting"
                    @click="error = false"
                  />

                  <v-text-field
                    :label="$t('login.mat_khau')"
                    v-model="userObj.password"
                    type="password"
                    :rules="rules"
                    :loading="isSubmitting"
                    @click="error = false"
                  />
                  <v-alert v-if="error" type="error">{{ error }}</v-alert>

                  <v-btn
                    block
                    class="c-btn-primary mt-4"
                    color="primary"
                    type="submit"
                    :disabled="!valid"
                    >{{ $t('login.dang_nhap') }}</v-btn
                  >

                  <!-- <a>Forget your password?</a> -->
                </v-form>
              </div>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" md="6" class="image-right-login order-1 order-md-2">
          <div class="box-image-right">
            <div class="text-center">
              <h1 class="text-logo-spa">N D C</h1>
              <h3 class="text-sub-spa">Homestay & Spa</h3>
              <h3 class="text-description-spa">Cozy home and Delicate spa</h3>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex';

export default {
  name: 'Login',
  data() {
    return {
      valid: true,
      lazy: false,
      userObj: {
        username: '',
        password: '',
      },
      isSubmitting: false,
      rules: [(value) => !!value || 'Không được để trống'],
      error: false,
    };
  },
  computed: {
    ...mapState('auth', ['currentUser']),
  },
  methods: {
    ...mapActions('auth', ['authenticate']),
    async login() {
      this.error = false;
      this.isSubmitting = true;
      try {
        await this.dispatch('auth/authenticate', this.userObj);
        if (this.currentUser.role.name === this.reviewerRole) {
          this.$router.push({ name: 'Receipt' });
        } else {
          this.$router.push({ name: 'Dashboard' });
        }
      } catch (error) {
        this.error = 'Tên đăng nhập hoặc Mật Khẩu không đúng !';
      } finally {
        this.isSubmitting = false;
      }
    },
  },
};
</script>
