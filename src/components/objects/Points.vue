<template>
  <g>
    <circle
      v-on:click.stop="handleClick"
      v-bind:cx="transformedPoint.x"
      v-bind:cy="transformedPoint.y"
      v-bind:class="{selected: point.selected}"
      r="3"
    ></circle>
    <Handle
      v-bind:coordinates="transformedPoint"
      v-on:selected-handle="handleClick"
    ></Handle>
  </g>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import Handle from './Handle.vue';
import { Prop } from 'vue-property-decorator';
import { Point, CustomEvent, ObjectTypes, EventTypes } from '@/types/types';
import { createCustomEventFromMouseEvent } from '@/helpers/helpers';
import { StoreApi } from '@/event-handlers/store-api';

@Component({
  components: { Handle },
})
export default class Points extends Vue {
  @Prop()
  point: Point;

  private storeApiInstance: StoreApi;

  get storeApi(): StoreApi {
    if (!this.storeApiInstance) {
      this.storeApiInstance = new StoreApi(this.$store);
    }
    return this.storeApiInstance;
  }

  get transformedPoint() {
    return this.storeApi.getPoint(this.point.id);
  }

  handleClick(event: MouseEvent) {
    // there's a small lie here, the handle emits the CustomEvent
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
