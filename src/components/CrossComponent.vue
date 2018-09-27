<template>
  <g>
    <line
      v-bind:x1="0"
      v-bind:x2="svgWidth"
      v-bind:y1="yOrigin"
      v-bind:y2="yOrigin"
    ></line>
    <line
      v-bind:x1="xOrigin"
      v-bind:x2="xOrigin"
      v-bind:y1="0"
      v-bind:y2="svgHeight"
    ></line>
    <circle v-bind:cx="xOrigin" v-bind:cy="yOrigin" v-bind:r="3"></circle>
  </g>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { Coordinates } from '@/types/types';

@Component({})
export default class Lines extends Vue {
  @Prop() svgHeight: number;
  @Prop() svgWidth: number;
  @Prop() unit: number;

  get xOrigin() {
    return this.svgWidth / 2 - (this.svgWidth / 2) % this.unit;
  }

  get yOrigin() {
    return this.svgHeight / 2 - (this.svgHeight / 2) % this.unit;
  }
}
</script>

<style lang="scss" scoped>
line {
  stroke: darkgray;
  cursor: pointer;
  &.selected {
    stroke: green;
  }
}
circle {
  stroke: darkgray;
}
</style>
