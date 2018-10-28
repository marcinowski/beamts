<template>
  <path
    v-bind:d="path"
  ></path>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { StoreApi } from '@/event-handlers/store-api';

@Component({})
export default class HelpersComponent extends Vue {
  private storeApiInstance: StoreApi;

  get storeApi(): StoreApi {
    if (!this.storeApiInstance) {
      this.storeApiInstance = new StoreApi(this.$store);
    }
    return this.storeApiInstance;
  }

  get path() {
    const line = this.storeApi.getHelperLine();
    return `M ${line.start.x} ${line.start.y}
      L ${line.end.x} ${line.end.y}`;
  }
}
</script>

<style lang="scss" scoped>
path {
  stroke: rgb(120, 240, 230);
  stroke-dasharray: 3;
}
</style>
