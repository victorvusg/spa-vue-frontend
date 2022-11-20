<template>
  <v-card elevation="0" class="core-table">
    <v-card-title class="align-end">
      <v-text-field
        v-if="searchable"
        v-model="search"
        prepend-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
        :disabled="isLoading"
      ></v-text-field>

      <v-spacer></v-spacer>
      <slot name="filter" v-bind="{ isLoading, fetchData }"></slot>
      <v-btn
        class="ml-2"
        depressed
        color="secondary"
        small
        @click="fetchData"
        :disabled="isLoading"
        ><v-icon small>mdi-refresh</v-icon></v-btn
      >
    </v-card-title>
    <!-- Data List -->
    <template>
      <v-data-table
        :headers="headers"
        :items="items"
        :page.sync="page"
        :loading="isLoading"
        loading-text="Loading... Please wait"
        :items-per-page="itemsPerPage"
        hide-default-footer
      >
        <template v-slot:body v-if="isLoading">
          <tbody>
            <tr v-for="item in itemsPerPage" :key="item">
              <td v-for="cell in headersLength" :key="`loading_${cell}`">
                <v-skeleton-loader type="text" boilerplate></v-skeleton-loader>
              </td>
            </tr>
          </tbody>
        </template>
        <template
          v-for="(_, name) in $scopedSlots"
          :slot="name"
          slot-scope="slotData"
        >
          <slot :name="name" v-bind="{ ...slotData, fetchData }" />
        </template>
      </v-data-table>
      <core-pagination
        :disabled="isLoading"
        v-model="page"
        :totalItems="totalItems"
        :itemsPerPage="itemsPerPage"
        :length="pageCount"
        :total-visible="5"
        circle
        class="pa-4"
      ></core-pagination>
    </template>
  </v-card>
</template>
<script>
import { privateAxios as api } from '@/api/api';
import CorePagination from '@/core/components/CorePagination';
import { debounce } from 'lodash';

export default {
  name: 'CoreTable',
  props: {
    url: {
      default: null,
    },
    searchable: {
      default: false,
    },
    headers: {
      default: () => [],
    },
    extraParams: {
      default: () => {},
    },
  },
  components: {
    CorePagination,
  },
  data() {
    return {
      search: '',
      isLoading: true,
      items: [],
      page: 1,
      itemsPerPage: 10,
      pageCount: 10,
      totalItems: 0,
    };
  },
  computed: {
    headersLength() {
      return this.headers.length;
    },
    params() {
      return {
        ...this.itemsPerPage,
        ...this.extraParams,
      };
    },
  },
  methods: {
    async fetchData(inputParams) {
      if (this.isMobile) {
        window.scrollTo({
          top: 0,
          left: 0,
        });
      }
      const params = inputParams || this.params;
      this.isLoading = true;
      try {
        const response = await api.get(this.url, { params });
        if (response.status !== 200) this.items = [];
        const { Data, Pagination } = response.data;
        this.totalItems = Pagination.TotalItems;
        this.pageCount = Math.round(Pagination.TotalItems / this.itemsPerPage);
        this.items = Data;
      } catch (err) {
        console.log(err);
      } finally {
        this.isLoading = false;
      }
    },
  },
  watch: {
    page: debounce(async function deb(val) {
      await this.fetchData({ ...this.params, page: val });
    }, 500),
    extraParams: debounce(async function deb(val) {
      if (this.page !== 1) {
        this.page = 1;
        return;
      }
      await this.fetchData({ ...this.params, ...val });
    }, 500),
  },
  async mounted() {
    this.fetchData();
  },
};
</script>
