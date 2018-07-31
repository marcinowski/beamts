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
        <lines
          :key="line.id"
          v-bind:id="line.id"
          v-bind:p1="line.p1"
          v-bind:p2="line.p2"
        ></lines>
      </template>
      <template v-for="point in points">
        <points
          :key="point.id"
          v-bind:id="point.id"
          v-bind:cx="point.cx"
          v-bind:cy="point.cy"
        ></points>
      </template>
    </svg>
  </v-container>
</template>

<script>
import Vue from "vue";
import Lines from "./Lines";
import Points from "./Points";
import { MethodTypes } from "@/types/types";

export default Vue.component("SvgComponent", {
  mounted() {
    const svg = this.$refs.svg;
    const { left, top } = svg.getBoundingClientRect();
    this.svgLeftOffset = left;
    this.svgTopOffset = top;
  },
  computed: {
    lines() {
      return this.$store.state.lines;
    },
    points() {
      return this.$store.state.points;
    }
  },
  methods: {
    transformEventToPoint(event) {
      const rawX = event.clientX - this.svgLeftOffset;
      const rawY = event.clientY - this.svgTopOffset;
      const cx = rawX - rawX % 10;
      const cy = rawY - rawY % 10;
      return { cx, cy, id: event.timestamp };
    },
    handleClick(event) {
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
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
