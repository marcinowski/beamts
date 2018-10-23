<template>
  <g>
    <line
      v-if="start && end"
      v-on:click.stop="handleClick"
      v-bind:x1="start.x"
      v-bind:x2="end.x"
      v-bind:y1="start.y"
      v-bind:y2="end.y"
      v-bind:class="{Selected: line.selected}"
    ></line>
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
line {
  stroke: black;
  cursor: pointer;
  &.Selected {
    stroke: green;
  }
}
</style>
