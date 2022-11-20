<template>
  <view-layout
    :title="title"
    :right="right"
    :left="left"
    v-if="isFetched"
    class="pb-10"
  >
    <template v-if="!showResult">
      <div
        class="pa-4"
        style="max-width: 650px; margin-left: auto; margin-right: auto"
      >
        <div class="d-flex align-center justify-center">
          <span style="font-size: 100px">
            {{
              reviewForm.customer_satisfy
                ? ratingEmotions[reviewForm.customer_satisfy - 1].icon
                : defaultEmoji
            }}
          </span>
        </div>
        <div
          class="
            primary--text
            headline
            text-center text-uppercase
            font-weight-bold
          "
        >
          {{ $t('review.satisfy_question') }}
        </div>
        <div class="caption text-center">
          ( {{ $t('review.satisfy_question_en') }} )
        </div>
        <!-- {{ reviewForm }} -->
        <div class="text-center mt-4">
          <v-rating
            :ripple="false"
            class="d-flex align-start justify-space-between"
            v-model="reviewForm.customer_satisfy"
            :length="5"
            :half-increments="false"
            :hover="false"
            :dense="false"
            @input="checkSatisfy"
          >
            <template v-slot:item="{ click, value, index }">
              <div @click="click">
                <template>
                  <div
                    class="font-weight-bold"
                    :class="{
                      [ratingEmotions[index].activeClass]: value === index + 1,
                      'grey--text': value !== index + 1,
                      'display-1': !isMobile,
                    }"
                  >
                    {{ $t(ratingEmotions[index].text) }}
                  </div>
                  <div
                    class="caption"
                    :class="{
                      [ratingEmotions[index].activeClass]: value === index + 1,
                      'grey--text': value !== index + 1,
                    }"
                  >
                    ({{ $t(`${ratingEmotions[index].text}_en`) }})
                  </div>
                </template>
              </div>
            </template>
          </v-rating>
        </div>
        <template v-if="reviewForm.customer_satisfy">
          <template v-if="reviewForm.customer_satisfy < 4">
            <div class="mt-4 d-flex justify-center flex-column">
              <div class="font-weight-bold primary--text">
                {{ $t('review.question_unsatisfied') }}
              </div>

              <!-- Attitude review -->
              <v-checkbox
                v-model="problems"
                @change="resetPoint($event, 'attitude')"
                on-icon="mdi-checkbox-marked-outline"
                color="#EF7D6C"
                :label="$t('review.attitude_problem')"
                value="attitude"
              />
              <div v-if="hasAttitudeProblem" class="pl-4">
                <v-checkbox
                  v-for="review in reviewForm.reviews"
                  :key="`${review.order_id}_attitude`"
                  on-icon="mdi-checkbox-marked-outline"
                  class="review-choices"
                  color="#EF7D6C"
                  v-model="review.attitude"
                >
                  <template v-slot:label>
                    <div>
                      <div class="body-1 font-weight-bold grey--text">
                        {{ review.name }}
                      </div>
                      <div class="caption">
                        Phụ trách:
                        <span class="text-uppercase error--text">{{
                          review.employee
                        }}</span>
                      </div>
                    </div>
                  </template>
                </v-checkbox>
              </div>
              <!-- Skill review -->
              <v-checkbox
                v-model="problems"
                @change="resetPoint($event, 'skill')"
                on-icon="mdi-checkbox-marked-outline"
                color="#EF7D6C"
                :label="$t('review.skill_problem')"
                value="skill"
              />
              <div v-if="hasSkillProblem" class="pl-4">
                <v-checkbox
                  v-for="review in reviewForm.reviews"
                  :key="`${review.order_id}_skill`"
                  on-icon="mdi-checkbox-marked-outline"
                  class="review-choices"
                  color="#EF7D6C"
                  v-model="review.skill"
                >
                  <template v-slot:label>
                    <div>
                      <div class="body-1 font-weight-bold grey--text">
                        {{ review.name }}
                      </div>
                      <div class="caption">
                        Phụ trách:
                        <span class="text-uppercase error--text">{{
                          review.employee
                        }}</span>
                      </div>
                    </div>
                  </template>
                </v-checkbox>
              </div>
            </div>
          </template>
          <div class="mt-4 font-weight-bold primary--text">
            Bạn thích điều gì nhất tại NDC Spa hôm nay ?
          </div>
          <v-row class="mx-n1">
            <v-col
              cols="6"
              class="pa-1"
              v-for="(content, index) in likeContents"
              :key="`like_${index}`"
            >
              <v-checkbox
                v-model="likes"
                :label="content.text"
                :value="content.value"
                hide-details
              ></v-checkbox>
            </v-col>
            <v-col cols="12">
              <v-textarea
                v-if="likes.includes('other')"
                hide-details
                v-model="likeOtherNote"
                filled
                auto-grow
                rows="5"
                color="orange orange-darken-4"
                name="before"
              ></v-textarea>
            </v-col>
          </v-row>
          <!-- TODO: Hide for now -->
          <!-- <div class="mt-4 font-weight-bold primary--text">
            NDC Spa cần làm gì để chăm sóc bạn tốt hơn lần sau ?
          </div>
          <v-row class="mx-n1">
            <v-col
              cols="6"
              class="pa-1"
              v-for="(content, index) in improveContents"
              :key="`improvement_${index}`"
            >
              <v-checkbox
                v-model="improvements"
                :label="content.text"
                :value="content.value"
                hide-details
              ></v-checkbox>
            </v-col>
            <v-col cols="12">
              <v-textarea
                v-if="improvements.includes('other')"
                hide-details
                v-model="improvementOtherNote"
                filled
                auto-grow
                rows="5"
                color="orange orange-darken-4"
                name="before"
              ></v-textarea>
            </v-col>
          </v-row> -->

          <div class="mt-4 font-weight-bold primary--text">Góp ý khác</div>
          <v-textarea
            hide-details
            v-model="otherNote"
            filled
            auto-grow
            rows="5"
            color="orange orange-darken-4"
            name="before"
          ></v-textarea>
        </template>
      </div>
      <div
        class="d-flex align-center justify-center"
        v-if="reviewForm.customer_satisfy"
      >
        <v-btn color="primary" @click="submit">Hoàn Thành</v-btn>
      </div>
    </template>

    <template v-else>
      <ThankYouPage :customerPoints="customerPoints" />
    </template>
  </view-layout>
</template>
<script>
/* eslint-disable camelcase */
import UserProfilePanel from '@/components/common/UserProfilePanel';
import ThankYouPage from '@/components/review/ThankYouPage';
import ViewLayout from '@/layout/ViewLayout';
import { axiosFactory } from '@/axios';
import { mapState } from 'vuex';

export default {
  name: 'IntakeDetail',
  components: {
    UserProfilePanel,
    ViewLayout,
    ThankYouPage,
  },
  data() {
    return {
      isFetched: false,
      showResult: false,
      title: 'ĐÁNH GIÁ CỦA KHÁCH HÀNG',
      right: {
        icon: 'mdi-reload',
        click: async () => {
          await this.reload();
        },
      },
      left: {
        icon: 'mdi-home',
        click: () => {
          this.home();
        },
      },
      reviewForm: {},
      defaultEmoji: '🤔',
      ratingEmotions: [
        {
          icon: '😤',
          text: 'bad',
          activeClass: 'brown--text',
        },
        {
          icon: '😞',
          text: 'so_so',
          activeClass: 'blue--text',
        },
        {
          icon: '😐',
          text: 'fine',
          activeClass: 'green--text',
        },
        {
          icon: '😄',
          text: 'good',
          activeClass: 'pink--text',
        },
        {
          icon: '😍',
          text: 'wow',
          activeClass: 'red--text',
        },
      ],
      chips: ['attitude', 'skill'],
      problems: [],
      likes: [],
      likeContents: [
        {
          text: 'Thái độ KTV',
          value: 'Thái độ KTV',
        },
        {
          text: 'Không gian/Trang trí',
          value: 'Không gian/Trang trí',
        },
        {
          text: 'Tay nghề KTV',
          value: 'Tay nghề KTV',
        },
        {
          text: 'Giá cả',
          value: 'Giá cả',
        },
        {
          text: 'Khác',
          value: 'other',
        },
      ],
      likeOtherNote: '',
      improvements: [],
      improvementOtherNote: '',
      improveContents: [
        {
          text: 'Thái độ KTV',
          value: 'Thái độ KTV',
        },
        {
          text: 'Cải thiện về không gian',
          value: 'Cải thiện về không gian',
        },
        {
          text: 'Cải thiện dịch vụ',
          value: 'Cải thiện dịch vụ',
        },
        {
          text: 'Cải thiện Kỹ Thuật',
          value: 'Cải thiện Kỹ Thuật',
        },
        {
          text: 'Khác',
          value: 'other',
        },
      ],
      otherNote: '',
      customerPoints: 0,
    };
  },
  computed: {
    ...mapState('intake', ['intake']),
    hasAttitudeProblem() {
      return this.problems.includes('attitude');
    },
    hasSkillProblem() {
      return this.problems.includes('skill');
    },
    reviewNote() {
      const likes = this.likes
        .map((cont) => {
          if (cont === 'other') {
            return `_${this.likeOtherNote}`;
          }
          return `_${cont}`;
        })
        .join('\n');
      const improvements = this.improvements
        .map((cont) => {
          if (cont === 'other') {
            return `\t_${this.improvementOtherNote}`;
          }
          return `\t_${cont}`;
        })
        .join('\n');
      return `<strong>Điều tôi thích:</strong>\n${likes}\n<strong>Cần Cải Thiện:</strong>\n${improvements}\n<strong>Khác:</strong>\n\t${this.otherNote}`;
    },
    // customerPoints() {
    //   if (
    //     this.intake.customer_id !== null &&
    //     this.intake.payment_type !== 'credit' &&
    //     this.intake.final_price
    //   ) {
    //     return Math.floor(this.intake.final_price / 50);
    //   }
    //   return 0;
    // },
  },
  methods: {
    async reload() {
      await this.init();
    },
    initReviewForm() {
      const reviews = this.intake.orders.map((order) => ({
        name: order.name,
        employee: order.employee.name,
        order_id: order.id,
        skill: false,
        attitude: false,
        service_point: false,
      }));
      this.reviewForm = {
        intake_id: this.intake.id,
        facility: 0,
        customer_satisfy: 0,
        note: '',
        reviews,
      };
    },
    async init() {
      const { id } = this.$route.params;
      this.isFetched = false;
      this.setLoading(true);
      try {
        await this.dispatch('intake/GET_INTAKE_BY_ID', id);

        if (this.intake.review_form === null) {
          this.initReviewForm();
        } else {
          this.showResult = true;
        }
        this.isFetched = true;
        this.setLoading(false);
        return;
      } catch (error) {
        console.log(error);
      }
      this.setLoading(false);
      this.dispatch('app/TOGGLE_NOT_FOUND_DIALOG', {
        model: true,
        content: this.$t('NOT_FOUND.REVIEW', { id }),
      });
    },
    resetPoint(value, field) {
      if (!value.includes(field)) {
        this.reviewForm.reviews.forEach((review) => {
          review[field] = false;
        });
      }
    },
    checkSatisfy() {
      if (this.reviewForm.customer_satisfy > 3) {
        this.problems = [];
        this.resetPoint([], 'skill');
        this.resetPoint([], 'attitude');
      }
    },
    async submit() {
      this.setLoading(true);
      const reviews = this.reviewForm.reviews.map((review) => {
        const { order_id, skill, attitude } = review;
        return {
          order_id,
          skill: skill ? this.reviewForm.customer_satisfy : 5,
          attitude: attitude ? this.reviewForm.customer_satisfy : 5,
          service_point: 5,
        };
      });
      const payload = {
        ...this.reviewForm,
        note: this.reviewNote,
        reviews,
      };
      this.customerPoints = 0;
      const api = axiosFactory('api/v1/reviews');
      try {
        const response = await api.post('', payload);
        if (response.data.IsSuccess) {
          await this.dispatch('intake/GET_INTAKE_BY_ID', payload.intake_id);
          if (this.customer.id && this.intake.payment_method_id !== 'credit') {
            this.customerPoints = Math.floor(this.intake.final_price / 50);
          }
          this.showResult = true;
        }
        this.setLoading(false);
      } catch (err) {
        this.setLoading(false);
      }
    },
  },
  async created() {
    await this.init();
  },
};
</script>
<style lang="scss">
.review-choices {
  .v-input__slot {
    align-items: flex-start;
  }
}
</style>
