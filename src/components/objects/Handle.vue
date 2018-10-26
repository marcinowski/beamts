<template>
  <circle class="Handle"
    v-on:click.stop="handleClick"
    v-bind:cx="coordinates.x"
    v-bind:cy="coordinates.y"
    v-bind:r="10"
  ></circle>
</template>

<style lang="scss" scoped>
circle.Handle {
  fill: rgba(0, 255, 255, 0.5);
  stroke: blue;
  stroke-dasharray: 5;
  opacity: 0;
  cursor: pointer;
  &:hover {
    opacity: 1;
  }
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
import { createCustomEventFromMouseEvent } from '@/helpers/helpers';

@Component({})
export default class Handle extends Vue {
  @Prop()
  coordinates: Coordinates;

  handleClick(event: MouseEvent) {
    this.$emit('selected-handle', createCustomEventFromMouseEvent(event));
  }
}
</script>

