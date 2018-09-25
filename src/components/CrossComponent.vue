<template>
  <!-- <line
    v-bind:x1="start.x"
    v-bind:x2="end.x"
    v-bind:y1="start.y"
    v-bind:y2="end.y"
    v-bind:class="{selected: isSelected}"
  ></line> -->
  <circle v-bind:x="cross.x" v-bind:y="cross.y" v-bind:r="3"></circle>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { Coordinates } from '@/types/types';

@Component({})
export default class Lines extends Vue {
  @Prop() origin: Coordinates;
  // @Prop() unit: number;
  // @Prop() svgWidth: number;
  // @Prop() svgHeight: number;
  get cross() {
    return this.origin;
  }
}
</script>

<style lang="scss" scoped>
line {
  stroke: black;
  cursor: pointer;
  &.selected {
    stroke: green;
  }
}
circle {
  stroke: red;
}
</style>
