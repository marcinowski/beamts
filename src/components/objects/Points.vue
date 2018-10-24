<template>
  <circle
    v-on:click.stop="handleClick"
    v-bind:cx="point.x * scale"
    v-bind:cy="point.y * scale"
    v-bind:class="{selected: point.selected}"
    r="3"
  ></circle>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { Point, CustomEvent, ObjectTypes, EventTypes } from '@/types/types';
import { transformEventToCustomEvent } from '@/helpers/helpers';

@Component({})
export default class Points extends Vue {
  @Prop()
  point: Point;

  get scale() {
    return this.$store.getters['config/getScaledUnit'];
  }

  handleClick(event: MouseEvent) {
    this.$store.dispatch('svg/selectPoints', [this.point.id]);
    const customEvent: CustomEvent = {
      ...transformEventToCustomEvent(event),
      sourceId: this.point.id,
      sourceObject: ObjectTypes.POINT,
      type: EventTypes.SELECTED_OBJECT,
    };
    this.$emit('selected-point', customEvent);
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
