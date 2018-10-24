<template>
  <g id="gridLines">
    <path
      v-for="line in lines" 
      :key="line.path"
      v-bind:d="line.path"
      v-bind:class="{Bolded: line.bolded, Hidden: isGridHidden}"
    ></path>
  </g>
</template>

<style lang="scss" scoped>
path {
  stroke: #8080804d;
  stroke-width: 1px;

  &.Bolded {
    stroke-width: 2px;
  }

  &.Hidden {
    display: none;
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
  @Prop()
  svgWidth: number;
  @Prop()
  svgHeight: number;

  get unit() {
    return this.$store.getters['config/getScaledUnit'];
  }

  get isGridHidden() {
    return !this.$store.getters['config/isGridOn'];
  }

  boldConst = 5; // bold each xth line

  get lines() {
    const verticals = Array(Math.ceil(this.svgWidth / this.unit))
      .fill(0)
      .map((v, i) => ({
        path: `M${this.unit * (i + 1)} 0 v ${this.svgHeight}`,
        bolded: (i + 1) % 5 === 0,
      }));
    const horizontals = Array(Math.ceil(this.svgHeight / this.unit))
      .fill(0)
      .map((v, i) => ({
        path: `M0 ${this.unit * (i + 1)} h ${this.svgWidth}`,
        bolded: (i + 1) % 5 === 0,
      }));
    return [...verticals, ...horizontals];
  }
}
</script>
