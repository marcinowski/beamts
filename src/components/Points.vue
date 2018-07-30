<template>
  <circle
    v-bind:cx="cx"
    v-bind:cy="cy"
    r="3"
    style="cursor: pointer;"
  ></circle>
</template>

<script>
import Vue from "vue";
import methodsMixin from "@/mixins/methods.mixin";
import Lines from "./Lines";

export default Vue.component("Points", {
  props: ["id", "cx", "cy", "selected"]
});
</script>