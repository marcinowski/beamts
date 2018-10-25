<template>
  <path
    v-if="path"
    v-on:click.stop="handleClick"
    v-bind:d="path"
    v-bind:class="{selected: arc.selected}"
  ></path>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { Arc, CustomEvent, ObjectTypes, EventTypes } from '@/types/types';
import { createCustomEventFromMouseEvent } from '@/helpers/helpers';
import { StoreApi } from '@/event-handlers/store-api';

@Component({})
export default class Arcs extends Vue {
  @Prop()
  arc: Arc;

  private storeApi: StoreApi;

  constructor() {
    super();
    this.storeApi = new StoreApi(this.$store);
  }

  get path(): string | undefined {
    const arc = this.storeApi.getArc(this.arc.id); // rethink passing a whole object
    const p1 = this.storeApi.getPoint(arc.p1);
    const p2 = this.storeApi.getPoint(arc.p2);
    if (!p1 || !p2) {
      this.storeApi.removeArc(arc); // FIXME: this adds UNDO action
      return undefined;
    }
    return `M${p1.x} ${p1.y}
     A ${arc.radius} ${arc.radius}
     0 0 0 ${p2.x} ${p2.y}`;
  }

  handleClick(event: MouseEvent) {
    this.$store.dispatch('svg/selectArcs', [this.arc.id]);
    const customEvent: CustomEvent = {
      ...createCustomEventFromMouseEvent(event),
      sourceId: this.arc.id,
      sourceObject: ObjectTypes.LINE,
      type: EventTypes.SELECTED_OBJECT,
    };
    this.$emit('selected-arc', customEvent);
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
