<template>
  <v-container fluid>
    <svg
      id="svg"
      ref="svg"
      width="600"
      height="600"
      style="border: 2px solid black;"
    >
      <lines 
        v-for="line in lines"
        :key="line.id"
        v-bind:id="line.id"
        v-bind:x1="line.x1"
        v-bind:x2="line.x2"
        v-bind:y1="line.y1"
        v-bind:y2="line.y2"
      ></lines>
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

export default Vue.component("SvgComponent", {
  data() {
    return {
      lines: [
        {
          id: 0,
          x1: 300,
          x2: 200,
          y1: 300,
          y2: 300
        }
      ],
      points: [
        {
          id: 0,
          cx: 300,
          cy: 300
        },
        {
          id: 1,
          cx: 200,
          cy: 300
        }
      ]
    };
  }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
