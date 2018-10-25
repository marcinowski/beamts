<template>
  <circle
    v-on:click.stop="handleClick"
    v-bind:cx="transformedPoint.x"
    v-bind:cy="transformedPoint.y"
    v-bind:class="{selected: point.selected}"
    r="3"
  ></circle>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { Point, CustomEvent, ObjectTypes, EventTypes } from '@/types/types';
import { createCustomEventFromMouseEvent } from '@/helpers/helpers';
import { StoreApi } from '@/event-handlers/store-api';

@Component({})
export default class Points extends Vue {
  @Prop()
  point: Point;

  private storeApi: StoreApi;

  constructor() {
    super();
    this.storeApi = new StoreApi(this.$store);
  }

  get transformedPoint() {
    return this.storeApi.getPoint(this.point.id);
  }

  handleClick(event: MouseEvent) {
    this.$store.dispatch('svg/selectPoints', [this.point.id]);
    const customEvent: CustomEvent = {
      ...createCustomEventFromMouseEvent(event),
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
