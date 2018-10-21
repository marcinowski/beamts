<template>
  <g>
    <line
      v-on:click.stop="handleClick"
      v-bind:x1="start.x"
      v-bind:x2="end.x"
      v-bind:y1="start.y"
      v-bind:y2="end.y"
      v-bind:class="{Selected: line.selected}"
    ></line>
    <Handle
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

@Component({
  components: { Handle },
})
export default class Lines extends Vue {
  @Prop()
  line: Line;

  get start() {
    return this.$store.getters['svg/getPoint'](this.line.p1);
  }

  get end() {
    return this.$store.getters['svg/getPoint'](this.line.p2);
  }

  get middle(): Coordinates {
    return {
      x: (this.end.x + this.start.x) / 2,
      y: (this.end.y + this.start.y) / 2,
    };
  }

  handleClick(event: MouseEvent) {
    this.$store.dispatch('svg/selectLines', [this.line.id]);
    const customEvent: CustomEvent = {
      originalEvent: event,
      sourceId: this.line.id,
      sourceObject: ObjectTypes.LINE,
      customType: EventTypes.SELECTED_OBJECT,
    };
    this.$emit('selected-line', customEvent);
  }

  handleMiddleClick() {
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
