<template>
  <v-container fluid>
    <svg
      id="svg"
      ref="svg"
      width="600"
      height="600"
      style="border: 2px solid black;"
      v-on:click="handleClick"
      v-on:mousedown="handleMouseDown"
      v-on:mousemove="handleMouseMove"
      v-on:mouseup="handleMouseUp"
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
          v-bind:selected="point.selected"
        ></Points>
      </template>
       <!-- <rect
        ref="selection"
        x="0"
        y="0"
        width="0"
        height="0"
      ></rect> -->
      <Selection></Selection>
    </svg>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import Lines from "./Lines.vue";
import Points from "./Points.vue";
import Selection from "./Selection.vue";
import { Coordinates, MethodTypes } from "@/types/types";

@Component({
  components: {
    Lines,
    Points,
    Selection
  }
})
export default class SvgComponent extends Vue {
  svgLeftOffset: number = 0;
  svgTopOffset: number = 0;
  prevPoint?: Coordinates;
  // selection: SVGRectElement;
  isSelecting = false;

  mounted() {
    // FIXME: technically this should be checked whenever the position changes :(
    // this.selection = this.$refs.selection as SVGRectElement;
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

  transformEventToCoordinates(event: MouseEvent, round: boolean = true) {
    let x = event.clientX - this.svgLeftOffset;
    let y = event.clientY - this.svgTopOffset;
    return { x, y };
  }

  transformCoordinatesToPoint(point: Coordinates, event: MouseEvent) {
    const cx = point.x - point.x % 10;
    const cy = point.y - point.y % 10;
    return { cx, cy, id: event.timeStamp };
  }

  handleClick(event: MouseEvent) {
    const method = this.$store.getters.getMethod;
    const coordinates = this.transformEventToCoordinates(event);
    switch (method) {
      case MethodTypes.CURSOR:
        break;
      case MethodTypes.SELECTION:
        break;
      case MethodTypes.POINT:
        const point = this.transformCoordinatesToPoint(coordinates, event);
        this.$store.commit("addPoint", point);
        break;
      case MethodTypes.RECTANGLE:
        break;
    }
  }

  handleMouseDown(event: MouseEvent) {
    const method = this.$store.getters.getMethod;
    const coordinates = this.transformEventToCoordinates(event);
    switch (method) {
      case MethodTypes.CURSOR:
        break;
      case MethodTypes.SELECTION:
        this.prevPoint = coordinates;
        // this.selection.setAttribute("x", coordinates.x.toString());
        // this.selection.setAttribute("y", coordinates.y.toString());
        this.$store.commit("setSelectionOrigin", coordinates);
        break;
      case MethodTypes.POINT:
        this.prevPoint = coordinates;
        break;
      case MethodTypes.RECTANGLE:
        break;
    }
  }

  handleMouseMove(event: MouseEvent) {
    const method = this.$store.getters.getMethod;
    const coordinates = this.transformEventToCoordinates(event);
    switch (method) {
      case MethodTypes.CURSOR:
        break;
      case MethodTypes.SELECTION:
        if (!this.prevPoint) {
          return;
        }
        const x = coordinates.x - this.prevPoint.x;
        const y = coordinates.y - this.prevPoint.y;
        // this.selection.setAttribute("height", y.toString());
        // this.selection.setAttribute("width", x.toString());
        this.$store.commit("setSelectionDimensions", { x, y });
        break;
      case MethodTypes.POINT:
        break;
      case MethodTypes.RECTANGLE:
        break;
    }
  }

  handleMouseUp(event: MouseEvent) {
    const method = this.$store.getters.getMethod;
    const coordinates = this.transformEventToCoordinates(event);
    switch (method) {
      case MethodTypes.CURSOR:
        break;
      case MethodTypes.SELECTION:
        if (!this.prevPoint) {
          return;
        }
        // this.selection.setAttribute("x", "0");
        // this.selection.setAttribute("y", "0");
        // this.selection.setAttribute("height", "0");
        // this.selection.setAttribute("width", "0");
        this.$store.dispatch("selectPointsInRange", [
          this.prevPoint,
          coordinates
        ]);
        // this.$store.commit("changeMethod", MethodTypes.CURSOR);
        this.prevPoint = undefined;
        this.$store.commit("clearSelection");
        break;
      case MethodTypes.POINT:
        break;
      case MethodTypes.RECTANGLE:
        break;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
rect {
  stroke: black;
  fill: rgb(120, 240, 230);
  stroke-dasharray: 3;
  fill-opacity: 0.2;
}
</style>
