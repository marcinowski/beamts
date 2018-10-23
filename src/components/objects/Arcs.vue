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

@Component({})
export default class Arcs extends Vue {
  @Prop()
  arc: Arc;

  get path(): string | undefined {
    const p1 = this.$store.getters['svg/getPoint'](this.arc.p1);
    const p2 = this.$store.getters['svg/getPoint'](this.arc.p2);
    if (!p1 || !p2) {
      this.$store.commit('svg/removeArc', this.arc); // FIXME: this adds UNDO action
      return undefined;
    }
    return `M${p1.x} ${p1.y} A ${this.arc.radius} ${this.arc.radius} 0 0 0 ${
      p2.x
    } ${p2.y}`;
  }

  handleClick(event: MouseEvent) {
    this.$store.dispatch('svg/selectArcs', [this.arc.id]);
    const customEvent: CustomEvent = {
      originalEvent: event,
      sourceId: this.arc.id,
      sourceObject: ObjectTypes.LINE,
      customType: EventTypes.SELECTED_OBJECT,
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
