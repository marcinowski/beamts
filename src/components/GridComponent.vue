<template>
  <g id="gridLines">
    <line v-for="line in lines" :key="`${line.xStart}-${line.yStart}`"
      v-bind:x1="line.xStart"
      v-bind:x2="line.xEnd"
      v-bind:y1="line.yStart"
      v-bind:y2="line.yEnd"
    ></line>
  </g>
</template>

<style lang="scss" scoped>
line {
  stroke: #8080804d;
  stroke-width: 1px;
}
</style>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

interface Line {
  xStart: number;
  yStart: number;
  xEnd: number;
  yEnd: number;
}

@Component({})
export default class GridComponent extends Vue {
  @Prop() unit: number;
  @Prop() svgWidth: number;
  @Prop() svgHeight: number;

  get lines(): Line[] {
    const verticals = Array(Math.ceil(this.svgWidth / this.unit))
      .fill(0)
      .map((v, i) => ({
        xStart: 0 + this.unit * (i + 1),
        yStart: 0,
        xEnd: 0 + this.unit * (i + 1),
        yEnd: this.svgHeight,
      }));
    const horizontals = Array(Math.ceil(this.svgHeight / this.unit))
      .fill(0)
      .map((v, i) => ({
        xStart: 0,
        yStart: 0 + this.unit * (i + 1),
        xEnd: this.svgWidth,
        yEnd: 0 + this.unit * (i + 1),
      }));
    return [...verticals, ...horizontals];
  }
}
</script>
