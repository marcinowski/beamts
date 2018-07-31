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
    this.svg = this.$refs.svg;
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
    handleClick(event) {
      const method = this.$store.getters.getMethod;
      switch (method) {
        case MethodTypes.CURSOR:
          break;
        case MethodTypes.SELECTION:
          break;
        case MethodTypes.POINT:
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
