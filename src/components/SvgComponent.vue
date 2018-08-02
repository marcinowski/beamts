<template>
  <v-container fluid>
    <svg
      id="svg"
      ref="svg"
      v-on:click="handleClick"
      v-on:mousedown="handleMouseDown"
      v-on:mousemove="handleMouseMove"
      v-on:mouseup="handleMouseUp"
    >
      <template v-for="line in lines">
        <Lines
          :key="line.id"
          v-bind:line="line"
        ></Lines>
      </template>
      <template v-for="point in points">
        <Points
          :key="point.id"
          v-bind:point="point"
          v-on:selected-point="handleSelectedPoint"
        ></Points>
      </template>
      <Selection></Selection>
    </svg>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { mapMutations } from "vuex";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import Lines from "./Lines.vue";
import Points from "./Points.vue";
import Selection from "./Selection.vue";
import { Coordinates, MethodTypes, Point } from "@/types/types";

@Component({
  components: {
    Lines,
    Points,
    Selection
  }
})
export default class SvgComponent extends Vue {
  prevPoint?: Point;
  svg: SVGElement;

  mounted() {
    this.svg = this.$refs.svg as SVGElement;
  }

  get lines() {
    return this.$store.state.lines;
  }

  get points() {
    return this.$store.state.points;
  }

  transformEventToCoordinates(event: MouseEvent, round: boolean = true) {
    const { left, top } = this.svg.getBoundingClientRect();
    const x = event.clientX - left;
    const y = event.clientY - top;
    return { x, y };
  }

  transformCoordinatesToPoint(point: Coordinates, event: MouseEvent): Point {
    const x = point.x - point.x % 10;
    const y = point.y - point.y % 10;
    return { x, y, id: event.timeStamp };
  }

  handleClick(event: MouseEvent) {
    const method = this.$store.getters.getMethod;
    const coordinates = this.transformEventToCoordinates(event);
    const point = this.transformCoordinatesToPoint(coordinates, event);
    this.$store.commit("deselectAllPoints");
    switch (method) {
      case MethodTypes.CURSOR:
        break;
      case MethodTypes.SELECTION:
        break;
      case MethodTypes.POINT:
        this.$store.commit("addPoint", point);
        break;
      case MethodTypes.LINE:
        this.$store.commit("addPoint", point);
        this.addLine(event, point);
        break;
    }
  }

  handleMouseDown(event: MouseEvent) {
    const method = this.$store.getters.getMethod;
    const coordinates = this.transformEventToCoordinates(event);
    const point = this.transformCoordinatesToPoint(coordinates, event);
    switch (method) {
      case MethodTypes.CURSOR:
        break;
      case MethodTypes.SELECTION:
        this.prevPoint = point;
        this.$store.commit("setSelectionOrigin", coordinates);
        break;
      case MethodTypes.POINT:
        break;
      case MethodTypes.LINE:
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
        this.$store.commit("setSelectionDimensions", { x, y });
        break;
      case MethodTypes.POINT:
        break;
      case MethodTypes.LINE:
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
        this.$store.dispatch("selectPointsInRange", [
          this.prevPoint,
          coordinates
        ]);
        this.prevPoint = undefined;
        this.$store.commit("clearSelection");
        break;
      case MethodTypes.POINT:
        break;
      case MethodTypes.LINE:
        break;
    }
  }

  handleSelectedPoint(el: { event: Event; point: Point }) {
    const method = this.$store.getters.getMethod;
    switch (method) {
      case MethodTypes.LINE:
        this.addLine(el.event, el.point);
        break;
    }
  }

  addLine(event: Event, point: Point) {
    if (!this.prevPoint) {
      this.prevPoint = point;
      return;
    }
    const line = {
      p1: this.prevPoint.id,
      p2: point.id,
      id: event.timeStamp + 1 // hack to distinguish from the point
    };
    this.$store.commit("addLine", line);
    this.prevPoint = undefined;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
svg {
  width: 100vw;
  height: 100vh;
  border: 2px solid black;
}
rect {
  stroke: black;
  fill: rgb(120, 240, 230);
  stroke-dasharray: 3;
  fill-opacity: 0.2;
}
</style>
