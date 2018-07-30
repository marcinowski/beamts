<template>
  <line
    v-bind:x1="x1"
    v-bind:x2="x2"
    v-bind:y1="y1"
    v-bind:y2="y2"
    style="stroke: black;"
  ></line>
</template>

<script>
import Vue from "vue";
import methodsMixin from "@/mixins/methods.mixin";
import Lines from "./Lines";

export default Vue.component("Lines", {
  props: ["id", "x1", "x2", "y1", "y2", "selected"]
});
</script>
