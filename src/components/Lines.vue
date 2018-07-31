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

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";

@Component({})
export default class Lines extends Vue {
  @Prop() id: number;
  @Prop() p1: number;
  @Prop() p2: number;
  @Prop() selected: boolean;
  clicked = false;

  get start() {
    return this.$store.getters.getPoint(this.p1);
  }
  get end() {
    return this.$store.getters.getPoint(this.p2);
  }
  get isSelected() {
    return this.selected || this.clicked;
  }

  handleClick() {
    this.clicked = !this.clicked;
  }
}
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
