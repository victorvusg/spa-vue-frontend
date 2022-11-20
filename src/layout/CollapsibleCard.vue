<template>
  <v-expansion-panels light class="collapsible-card">
    <v-expansion-panel>
      <v-expansion-panel-header class="pa-0">
        <div class="py-2 px-2">
          <slot name="header"></slot>
        </div>
        <template v-slot:actions>
          <span class="py-2 px-2">
            <slot name="header-action"></slot>
          </span>
        </template>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <slot name="content"></slot>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>
<script>

export default {
  name: 'CollapsibleCard',
};
</script>
<style lang="scss">
.collapsible-card {
  font-size: 12.8px !important;
  .v-expansion-panel {
    .v-expansion-panel-content {
      .v-expansion-panel-content__wrap {
        padding: 0px 0px 0px !important;
      }
    }
  }
  .v-expansion-panel {
    border-radius: 10px !important;
    &.v-expansion-panel--active {
      background-color: rgb(234 234 234 / 75%);
    }
  }
  .v-expansion-panel-header {
    font-size: 12.8px !important;
    height: 25px !important;
    min-height: 25px !important;
    background-color: rgba(255, 255, 255, 0.8);
    border-radius: 10px;
    &.v-expansion-panel-header--active {
      border-radius: 10px 10px 0px 0px !important;
    }
  }
}
</style>
