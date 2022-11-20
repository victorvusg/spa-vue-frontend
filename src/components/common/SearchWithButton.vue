<template>
  <v-row
    class="search d-flex ma-0"
    style="width:100%"
    v-click-outside="onClickOutside"
  >
    <v-col cols="10" class="py-0 pl-0 pr-2">
      <v-text-field
        class="search-input"
        hide-details
        solo
        clearable
        ref="searchInput"
        @input="menu = false"
        v-model="searchKey"
        prepend-inner-icon="mdi-magnify"
        :type="searchType || 'text'"
        :pattern="searchType === 'number' ? '[0-9]*' : ''"
        :inputmode="searchType === 'number' ? 'number' : ''"
      ></v-text-field>
      <v-menu
        offset-y
        absolute
        :attach="`#${$attrs.id}`"
        v-model="menu"
        :close-on-click="false"
        :close-on-content-click="false"
        eager
        content-class="border-radius-8 search-v-menu-content"
        max-height="335px"
      >
        <v-list elevation="0" class="py-0">
          <slot name="results" v-bind="{ items, close }"> </slot>
        </v-list>
      </v-menu>
    </v-col>
    <v-col cols="2" class="pa-0 d-flex align-center justify-end">
      <v-btn
        elevation="0"
        color="primary"
        block
        style="height: 100%; border-radius: 8px"
        @click="search"
        :loading="isSearching"
        >Tìm</v-btn
      >
    </v-col>
  </v-row>
</template>

<script>
import { axiosFactory } from '@/axios';

// @ is an alias to /src
export default {
  name: 'Search',
  props: {
    api: {
      required: true,
    },
    params: {
      default: {},
    },
    searchParam: {
      default: '',
    },
    searchType: {
      type: String,
      default: 'text',
    },
  },
  data() {
    return {
      items: [],
      isSearching: false,
      searchKey: '',
      menu: false,
      axios: null,
    };
  },
  watch: {
    searchParam() {
      this.searchKey = '';
    },
  },
  created() {
    this.axios = axiosFactory(this.api);
  },
  methods: {
    close() {
      this.menu = false;
    },
    onClickOutside() {
      if (this.menu) {
        this.menu = false;
      }
    },
    async search() {
      if (!this.searchKey) return;
      this.isSearching = true;
      try {
        let searchURL = '';
        const params = { ...this.params };
        if (!this.searchParam) {
          searchURL += `/${this.searchKey}`;
        } else {
          params[this.searchParam] = this.searchKey;
        }

        const response = await this.axios.get(searchURL, { params });
        if (response.status !== 200) return;
        this.items = response.data.Data;
        this.menu = true;
      } catch (error) {
        throw Error(error);
      } finally {
        this.isSearching = false;
      }
    },
  },
};
</script>
<style lang="scss">
.search {
  position: relative;
  .search-input {
    width: 100%;
    border-radius: 8px !important;
    .v-input__slot {
      box-shadow: none !important;
    }
  }
}
.search-v-menu-content {
  top: 50px !important;
  width: 100%;
  max-width: unset !important;
  margin-top: 4px;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px !important;
}
</style>
