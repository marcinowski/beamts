<template>
  <g>
    <line
      v-bind:x1="0"
      v-bind:x2="10000"
      v-bind:y1="origin.y"
      v-bind:y2="origin.y"
    ></line>
    <line
      v-bind:x1="origin.x"
      v-bind:x2="origin.x"
      v-bind:y1="0"
      v-bind:y2="10000"
    ></line>
    <circle v-bind:cx="cross.x" v-bind:cy="cross.y" v-bind:r="3"></circle>
  </g>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { Coordinates } from '@/types/types';

@Component({})
export default class Lines extends Vue {
  @Prop() origin: Coordinates;
  get cross() {
    return this.origin;
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
