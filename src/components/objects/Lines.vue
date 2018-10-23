<template>
  <g>
    <path
      v-if="path"
      v-on:click.stop="handleClick"
      v-bind:d="path"
      v-bind:class="{Selected: line.selected}"
    ></path>
    <Handle
      v-if="middle"
      v-on:selected-handle="handleMiddleClick"
      v-bind:isHidden="!line.selected"
      v-bind:coordinates="middle"
    ></Handle>
  </g>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import Handle from './Handle.vue';
import { Prop } from 'vue-property-decorator';
import {
  Line,
  EventTypes,
  ObjectTypes,
  CustomEvent,
  Coordinates,
} from '@/types/types';
import { transformEventToCustomEvent } from '@/helpers/helpers';

@Component({
  components: { Handle },
})
export default class Lines extends Vue {
  @Prop()
  line: Line;

  get start() {
    const start = this.$store.getters['svg/getPoint'](this.line.p1);
    if (!start) {
      this.$store.commit('svg/removeLine', this.line); // FIXME: this adds a UNDO action
    }
    return start;
  }

  get end() {
    const end = this.$store.getters['svg/getPoint'](this.line.p2);
    if (!end) {
      this.$store.commit('svg/removeLine', this.line); // FIXME: this adds a UNDO action
    }
    return end;
  }

  get path() {
    if (!this.start || !this.end) {
      this.$store.commit('svg/removeLine', this.line); // FIXME: this adds UNDO action
      return undefined;
    }
    return `M${this.start.x} ${this.start.y} L ${this.end.x} ${this.end.y}`;
  }

  get middle(): Coordinates | undefined {
    if (this.start && this.end) {
      return {
        x: (this.end.x + this.start.x) / 2,
        y: (this.end.y + this.start.y) / 2,
      };
    }
  }

  handleClick(event: MouseEvent) {
    this.$store.dispatch('svg/selectLines', [this.line.id]);
    const customEvent: CustomEvent = {
      ...transformEventToCustomEvent(event),
      sourceId: this.line.id,
      sourceObject: ObjectTypes.LINE,
      type: EventTypes.SELECTED_OBJECT,
    };
    this.$emit('selected-line', customEvent);
  }

  handleMiddleClick(event: CustomEvent) {
    console.log('TODO');
  }
}
</script>

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
path {
  stroke: black;
  cursor: pointer;
  &.Selected {
    stroke: green;
  }
}
</style>
