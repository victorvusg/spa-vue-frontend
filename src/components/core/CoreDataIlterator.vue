<template>
  <v-data-iterator
    :style="style"
    class="d-flex justify-space-between flex-column"
    :items="dataList"
    :page.sync="page"
    :search="search"
    :items-per-page="itemsPerPage"
    hide-default-footer
    :loading="isFetching"
    loading-text="Đang tải dữ liệu..."
  >
    <template v-slot:header>
    </template>

    <template v-slot:default="{ items }">
      <slot
        name="items"
        v-bind="{ items }"
        v-if="!isFetching"
        class="data-list"
      />
      <template v-else>
        <div v-for="i in itemsPerPage" :key="i">
          <v-skeleton-loader :type="loadingType" :key="i"></v-skeleton-loader>
          <v-divider :key="`${i}_divider`" />
        </div>
      </template>
    </template>
    <template v-slot:no-data> Không có dữ liệu </template>
    <template v-slot:footer>
      <v-pagination
        class="core-pagination mt-4"
        v-model="page"
        @input="pageChange"
        :length="totalPage"
        :total-visible="5"
        prev-icon="mdi-menu-left"
        next-icon="mdi-menu-right"
      ></v-pagination>
    </template>
  </v-data-iterator>
</template>
<script>
import { axiosFactory } from '@/axios';
import { mapState } from 'vuex';
import { debounce } from 'lodash';

export default {
  name: 'CoreDataIlterator',
  props: {
    loadingType: {
      default: 'list-item-three-line',
    },
    url: {
      require: true,
    },
    params: {
      require: true,
    },
    itemsPerPage: {
      default: 10,
    },
  },
  data() {
    return {
      api: axiosFactory(this.url),
      totalPage: 0,
      dataList: [],
      page: 1,
      search: '',
      isFetching: true,
      isLoading: true,
    };
  },
  computed: {
    ...mapState('auth', ['currentUser']),
    style() {
      return {
        'min-height': `${this.listHeight}px`,
      };
    },
  },
  watch: {
    params: debounce(async function deb() {
      this.page = 1;
      await this.fetchData();
    }, 500),
  },
  methods: {
    pageChange: debounce(async function deb() {
      window.scrollTo({
        top: 0,
        left: 0,
      });
      await this.fetchData();
    }, 500),
    async fetchData() {
      this.isFetching = true;
      const options = {
        params: {
          per_page: this.itemsPerPage,
          page: this.page,
          ...this.params,
        },
      };
      try {
        const response = await this.api.get('', options);
        // Pagination: {CurrentPage: 1, PerPage: "10", TotalItems: 1}
        if (response.status !== 200 || !response.data) {
          this.dataList = [];
          this.totalPage = 1;
          return;
        }
        const { Data, Pagination } = response.data;
        this.totalPage = Math.ceil(Pagination.TotalItems / this.itemsPerPage);
        this.dataList = Data;
      } catch (err) {
        this.dataList = [];
      } finally {
        this.isFetching = false;
      }
    },
    async reload() {
      this.page = 1;
      await this.fetchData();
    },
  },
  async created() {
    await this.fetchData();
  },
};
</script>
