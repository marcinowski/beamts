<template>
  <circle
    v-on:click="handleClick"
    v-bind:cx="x"
    v-bind:cy="y"
    v-bind:class="{selected: isSelected}"
    r="3"
  ></circle>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";

@Component({})
export default class Points extends Vue {
  @Prop() id: number;
  @Prop() x: number;
  @Prop() y: number;
  @Prop() selected: boolean;

  clicked = false;

  get isSelected(): any {
    return this.selected || this.clicked;
  }

  handleClick() {
    this.clicked = !this.clicked;
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
