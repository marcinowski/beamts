<template>
  <circle
    v-on:click="handleClick"
    v-bind:cx="cx"
    v-bind:cy="cy"
    v-bind:class="{selected: isSelected}"
    r="3"
  ></circle>
</template>

<script>
import Vue from "vue";
import methodsMixin from "@/mixins/methods.mixin";
import Lines from "./Lines";

export default Vue.component("Points", {
  props: ["id", "cx", "cy", "selected"],
  data() {
    return {
      clicked: false
    };
  },
  methods: {
    handleClick() {
      this.clicked = !this.clicked;
    }
  },
  computed: {
    isSelected() {
      return this.selected || this.clicked;
    }
  }
});
</script>

<style lang="scss" scoped>
circle {
  cursor: pointer;
  fill: black;
  &.selected {
    fill: green;
  }
}
</style>
