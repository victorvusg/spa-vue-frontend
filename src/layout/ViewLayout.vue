<template>
  <div class="view-layout">
    <v-toolbar color="primary" dark style="z-index: 2" class="sticky-toolbar">
      <v-app-bar-nav-icon v-if="left">
        <v-icon @click="left.click">{{ left.icon }} mdi-24px</v-icon>
      </v-app-bar-nav-icon>

      <v-toolbar-title class="text-uppercase">{{ title }}</v-toolbar-title>

      <v-spacer></v-spacer>
      <template v-if="right">
        <v-icon @click="right.click">{{ right.icon }} mdi-24px</v-icon>
      </template>
    </v-toolbar>
    <slot />
  </div>
</template>
<script>
export default {
  name: 'ViewLayout',
  props: {
    title: {
      default: 'Page',
    },
    left: {
      default: null,
    },
    right: {
      default: null,
    },
  },
};
</script>
<style lang="scss">
</style>
