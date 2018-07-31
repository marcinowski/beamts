<template>
  <v-container fluid>
    <svg
      id="svg"
      ref="svg"
      width="600"
      height="600"
      style="border: 2px solid black;"
      v-on:click="handleClick"
    >
      <template v-for="line in lines">
        <Lines
          :key="line.id"
          v-bind:id="line.id"
          v-bind:p1="line.p1"
          v-bind:p2="line.p2"
        ></Lines>
      </template>
      <template v-for="point in points">
        <Points
          :key="point.id"
          v-bind:id="point.id"
          v-bind:cx="point.cx"
          v-bind:cy="point.cy"
        ></Points>
      </template>
    </svg>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import Lines from "./Lines.vue";
import Points from "./Points.vue";
import { MethodTypes } from "@/types/types";

@Component({
  components: {
    Lines,
    Points
  }
})
export default class SvgComponent extends Vue {
  svgLeftOffset: number;
  svgTopOffset: number;

  mounted() {
    const svg = this.$refs.svg as HTMLElement;
    const { left, top } = svg.getBoundingClientRect();
    this.svgLeftOffset = left;
    this.svgTopOffset = top;
  }
  get lines() {
    return this.$store.state.lines;
  }
  get points() {
    return this.$store.state.points;
  }
  transformEventToPoint(event: MouseEvent) {
    const rawX = event.clientX - this.svgLeftOffset;
    const rawY = event.clientY - this.svgTopOffset;
    const cx = rawX - rawX % 10;
    const cy = rawY - rawY % 10;
    return { cx, cy, id: event.timeStamp };
  }
  handleClick(event: MouseEvent) {
    const method = this.$store.getters.getMethod;
    switch (method) {
      case MethodTypes.CURSOR:
        break;
      case MethodTypes.SELECTION:
        break;
      case MethodTypes.POINT:
        const point = this.transformEventToPoint(event);
        this.$store.commit("addPoint", point);
        break;
      case MethodTypes.RECTANGLE:
        break;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
