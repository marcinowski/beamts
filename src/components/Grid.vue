<template>
  <div>
    <template
      v-for="line in verticalLines"
    >
      <line :key="`v${line.xStart}`"
        v-bind:x1="line.xStart"
        v-bind:x2="line.xEnd"
        v-bind:y1="line.yStart"
        v-bind:y2="line.yEnd"
      ></line>
    </template>
    <line
      v-for="line in horizontalLines"
      :key="`h${line.xStart}`"
      v-bind:x1="line.xStart"
      v-bind:x2="line.xEnd"
      v-bind:y1="line.yStart"
      v-bind:y2="line.yEnd"
    ></line>    
  </div>
</template>

<style lang="scss" scoped>
line {
  stroke: gray;
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

  update() {
    const a = this.verticalLines;
  }

  mounted() {
    console.log('mounte');
  }

  get verticalLines(): Line[] {
    const kek = Array(Math.floor(this.svgWidth / this.unit))
      .fill(0)
      .map((v, i) => ({
        xStart: 0 + this.unit * i,
        yStart: 0,
        xEnd: 0 + this.unit * i,
        yEnd: this.svgHeight,
      }));
    console.log(kek);
    return kek;
  }

  get horizontalLines(): Line[] {
    return Array(Math.floor(this.svgHeight / this.unit))
      .fill(0)
      .map((v, i) => ({
        xStart: 0,
        yStart: 0 + this.unit * i,
        xEnd: this.svgWidth,
        yEnd: 0 + this.unit * i,
      }));
  }
}
</script>
