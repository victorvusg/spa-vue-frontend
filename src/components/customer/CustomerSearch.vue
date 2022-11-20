<template>
  <div class="search-customer">
    <v-row class="mx-auto mb-2" style="max-width: 600px">
      <v-btn-toggle
        v-model="searchParam"
        mandatory
        tile
        color="primary"
        @change="searchKey = ''"
        class="d-flex w-100 border-radius-8"
      >
        <v-btn value="name" small style="flex-basis: 50%"> Tìm Theo Tên </v-btn>
        <v-btn value="phone" small style="flex-basis: 50%">
          Tìm Theo SĐT
        </v-btn>
      </v-btn-toggle>
    </v-row>
    <Search
      :searchType="searchType[searchParam]"
      :searchParam="searchParam"
      :params="{ page: 1, per_page: 100000 }"
      :api="'/api/v1/customers'"
      id="customer-search"
    >
      <template v-slot:results="{ items, close }">
        <div
          v-for="customer in items"
          :key="customer.id"
          class="d-flex flex-column"
        >
          <div class="d-flex align-center justify-space-between py-2 pl-1 pr-4">
            <div class="d-flex">
              <v-icon size="50px" class="mr-2" color="grey lighten-1"
                >mdi-account-circle</v-icon
              >
              <div class="d-flex justify-center flex-column">
                <div class="font-weight-bold">{{ customer.name }}</div>
                <div class="body-2">{{ customer.phone | phoneFormat }}</div>
              </div>
            </div>
            <div class="v-list-btn-group">
              <v-btn
                x-small
                outlined
                fab
                color="primary"
                @click.stop="
                  $emit('result-click', customer);
                  close();
                "
              >
                <v-icon>mdi-arrow-right</v-icon>
              </v-btn>
            </div>
          </div>
          <v-divider />
        </div>
      </template>
    </Search>
  </div>
</template>

<script>
// @ is an alias to /src
import Search from '@/components/common/SearchWithButton';

export default {
  name: 'CustomerSearch',
  components: {
    Search,
  },
  data() {
    return {
      searchType: {
        name: 'text',
        phone: 'number',
      },
      searchParam: 'name',
    };
  },
};
</script>
