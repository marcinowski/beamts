<template>
  <circle
    v-on:click.stop="handleClick"
    v-bind:cx="point.x"
    v-bind:cy="point.y"
    v-bind:class="{selected: isSelected}"
    r="3"
  ></circle>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { Point } from "@/types/types";

@Component({})
export default class Points extends Vue {
  @Prop() point: Point;

  get isSelected(): any {
    return this.point.selected;
  }

  handleClick(event: Event) {
    this.$store.commit("selectPoints", [this.point.id]);
    this.$emit("selected-point", { event, point: this.point });
  }
}
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
