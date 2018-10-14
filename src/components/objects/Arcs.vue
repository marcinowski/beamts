<template>
  <path
    v-on:click="handleClick"
    v-bind:d="path"
    v-bind:class="{selected: arc.selected}"
  ></path>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { Arc } from '@/types/types';

@Component({})
export default class Arcs extends Vue {
  @Prop() arc: Arc;

  get path() {
    const p1 = this.$store.getters['svg/getPoint'](this.arc.p1);
    const p2 = this.$store.getters['svg/getPoint'](this.arc.p2);
    return `M${p1.x} ${p1.y} A ${this.arc.radius} ${this.arc.radius} 0 0 0 ${
      p2.x
    } ${p2.y}`;
  }

  handleClick() {
    console.warn('Selecting Arcs: Not implemented');
  }
}
</script>

<style lang="scss" scoped>
path {
  cursor: pointer;
  fill: none;
  stroke: black;
  &.selected {
    stroke: green;
  }
}
</style>
