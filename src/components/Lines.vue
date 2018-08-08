<template>
  <line
    v-on:click="handleClick"
    v-bind:x1="start.x"
    v-bind:x2="end.x"
    v-bind:y1="start.y"
    v-bind:y2="end.y"
    v-bind:class="{selected: isSelected}"
  ></line>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { Line } from '@/types/types';

@Component({})
export default class Lines extends Vue {
  @Prop() line: Line;

  get start() {
    return this.$store.getters.getPoint(this.line.p1);
  }
  get end() {
    return this.$store.getters.getPoint(this.line.p2);
  }
  get isSelected() {
    return this.line.selected;
  }

  handleClick() {
    this.$store.commit('selectPoints', [this.line.p1, this.line.p2]);
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
