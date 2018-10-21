<template>
  <circle 
    v-on:click.stop="handleClick"
    v-bind:class="{Hidden: hide}"
    v-bind:cx="coordinates.x"
    v-bind:cy="coordinates.y"
    v-bind:r="10"
  ></circle>
</template>

<style lang="scss" scoped>
circle {
  fill: rgba(0, 255, 255, 0.5);
  stroke: blue;
  stroke-dasharray: 5;
  &.Hidden {
    display: none;
  }
  cursor: pointer;
}
</style>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import {
  Line,
  EventTypes,
  ObjectTypes,
  CustomEvent,
  Coordinates,
} from '@/types/types';

@Component({})
export default class Handle extends Vue {
  @Prop()
  isHidden: boolean = true;
  @Prop()
  coordinates: Coordinates;

  get hide() {
    return this.isHidden;
  }

  handleClick(event: MouseEvent) {
    this.$emit('selected-handle', event);
  }
}
</script>

