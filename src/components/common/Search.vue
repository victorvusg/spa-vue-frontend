<template>
  <div class="search" v-click-outside="onClickOutside">
    <v-text-field
      class="search-input"
      hide-details
      :loading="isSearching"
      :disabled="isSearching"
      solo
      clearable
      ref="searchInput"
      :value="searchKey"
      @input="inputHandle"
      prepend-inner-icon="mdi-magnify"
      @focus="onFocus"
      :type="searchType || 'text'"
      :pattern="searchType === 'number' ? '[0-9]*' : ''"
      :inputmode="searchType === 'number' ? 'number' : ''"
      @keypress="searchKeyPress($event, searchType)"
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
  </div>
</template>

<script>
// @ is an alias to /src
import { axiosFactory } from '@/axios';
import { debounce } from 'lodash';

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
    };
  },
  watch: {
    searchParam() {
      this.searchKey = '';
    },
  },
  methods: {
    close() {
      this.menu = false;
    },
    onFocus() {
      if (this.items.length) {
        this.menu = true;
      }
    },
    onClickOutside() {
      if (this.menu) {
        this.menu = false;
      }
    },
    searchKeyPress($event, searchType) {
      this.menu = false;
      this.handleKeypress($event, searchType);
    },
    inputHandle: debounce(async function deb(searchKey) {
      this.searchKey = searchKey;
      if (!searchKey) return;
      this.isSearching = true;
      try {
        let searchURL = this.api;
        const params = { ...this.params };
        if (!this.searchParam) {
          searchURL += `/${searchKey}`;
        } else {
          params[this.searchParam] = searchKey;
        }

        const searchAPI = axiosFactory(searchURL);

        const response = await searchAPI.get('', { params });
        if (response.status !== 200) return;
        this.items = response.data.Data;
        this.menu = true;
      } catch (error) {
        throw Error(error);
      } finally {
        this.isSearching = false;
      }
    }, 500),
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
