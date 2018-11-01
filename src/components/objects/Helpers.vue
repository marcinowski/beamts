<template>
  <g>
    <path
      v-bind:d="linePath"
    ></path>
    <path
      v-bind:d="arcPath"
    ></path>
  </g>
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

  get linePath() {
    const line = this.storeApi.getHelperLine();
    return `M ${line.start.x} ${line.start.y}
      L ${line.end.x} ${line.end.y}`;
  }

  get arcPath() {
    const arc = this.storeApi.getHelperArc();
    return `M ${arc.start.x} ${arc.start.y}
      A ${arc.radius} ${arc.radius} ${arc.xAxisRotation}
      ${arc.largeArc} ${arc.sweep} ${arc.end.x} ${arc.end.y}`;
  }
}
</script>

<style lang="scss" scoped>
path {
  stroke: rgb(120, 240, 230);
  stroke-dasharray: 3;
  fill: none;
}
</style>
