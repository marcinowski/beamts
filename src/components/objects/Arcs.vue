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
import { transformEventToCustomEvent } from '@/helpers/helpers';

@Component({})
export default class Arcs extends Vue {
  @Prop()
  arc: Arc;

  get scale() {
    return this.$store.getters['config/getScaledUnit'];
  }

  get path(): string | undefined {
    const p1 = this.$store.getters['svg/getPoint'](this.arc.p1);
    const p2 = this.$store.getters['svg/getPoint'](this.arc.p2);
    if (!p1 || !p2) {
      this.$store.commit('svg/removeArc', this.arc); // FIXME: this adds UNDO action
      return undefined;
    }
    return `M${p1.x * this.scale} ${p1.y * this.scale}
     A ${this.arc.radius * this.scale} ${this.arc.radius * this.scale}
     0 0 0 ${p2.x * this.scale} ${p2.y * this.scale}`;
  }

  handleClick(event: MouseEvent) {
    this.$store.dispatch('svg/selectArcs', [this.arc.id]);
    const customEvent: CustomEvent = {
      ...transformEventToCustomEvent(event),
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
