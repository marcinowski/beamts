<template>
  <path
    v-bind:d="path"
  ></path>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import { Coordinates, MethodTypes, LineCoordinates } from '@/types/types';
import { StoreApi } from '@/event-handlers/store-api';

@Component({})
export default class SelectionComponent extends Vue {
  private storeApi: StoreApi;

  constructor() {
    super();
    this.storeApi = new StoreApi(this.$store);
  }

  get path() {
    const selection = this.storeApi.getSelection();
    return `M ${selection.start.x} ${selection.start.y}
      H ${selection.end.x} V ${selection.end.y}
      H ${selection.start.x} Z`;
  }
}
</script>

<style lang="scss" scoped>
path {
  stroke: black;
  fill: rgb(120, 240, 230);
  stroke-dasharray: 3;
  fill-opacity: 0.2;
}
</style>
