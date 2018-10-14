<template>
  <g id="gridLines">
    <line 
      v-for="line in lines" 
      :key="`${line.xStart}-${line.yStart}`"
      v-bind:x1="line.xStart"
      v-bind:x2="line.xEnd"
      v-bind:y1="line.yStart"
      v-bind:y2="line.yEnd"
      v-bind:class="{bolded: line.bolded}"
    ></line>
  </g>
</template>

<style lang="scss" scoped>
line {
  stroke: #8080804d;
  stroke-width: 1px;

  &.bolded {
    stroke-width: 2px;
  }
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
  bolded: boolean;
}

@Component({})
export default class GridComponent extends Vue {
  @Prop() svgWidth: number;
  @Prop() svgHeight: number;

  get unit() {
    return this.$store.getters['config/getUnit'];
  }

  boldConst = 5; // bold each xth line

  get lines(): Line[] {
    const verticals = Array(Math.ceil(this.svgWidth / this.unit))
      .fill(0)
      .map((v, i) => ({
        xStart: 0 + this.unit * (i + 1),
        yStart: 0,
        xEnd: 0 + this.unit * (i + 1),
        yEnd: this.svgHeight,
        bolded: (i + 1) % 5 === 0,
      }));
    const horizontals = Array(Math.ceil(this.svgHeight / this.unit))
      .fill(0)
      .map((v, i) => ({
        xStart: 0,
        yStart: this.svgHeight - this.unit * (i + 1),
        xEnd: this.svgWidth,
        yEnd: this.svgHeight - this.unit * (i + 1),
        bolded: (i + 1) % 5 === 0,
      }));
    return [...verticals, ...horizontals];
  }
}
</script>
