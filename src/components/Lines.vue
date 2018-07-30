<template>
  <line
    v-on:click="handleClick"
    v-bind:x1="start.cx"
    v-bind:x2="end.cx"
    v-bind:y1="start.cy"
    v-bind:y2="end.cy"
    v-bind:class="{selected: isSelected}"
  ></line>
</template>

<script>
import Vue from "vue";
import methodsMixin from "@/mixins/methods.mixin";
import Lines from "./Lines";

export default Vue.component("Lines", {
  props: ["id", "p1", "p2", "selected"],
  data() {
    return {
      clicked: false
    };
  },
  computed: {
    start() {
      return this.$store.getters.getPoint(this.p1);
    },
    end() {
      return this.$store.getters.getPoint(this.p2);
    },
    isSelected() {
      return this.selected || this.clicked;
    }
  },
  methods: {
    handleClick() {
      this.clicked = !this.clicked;
    }
  }
});
</script>

<style lang="scss" scoped>
line {
  stroke: black;
  cursor: pointer;
  &.selected {
    stroke: green;
  }
}
</style>
