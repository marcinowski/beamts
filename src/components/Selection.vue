<template>
  <rect
    v-bind:x="selection.x"
    v-bind:y="selection.y"
    v-bind:width="selection.width"
    v-bind:height="selection.height"
  ></rect>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import {
  Coordinates,
  EventBasedComponent,
  MethodTypes,
  LineCoordinates,
} from '@/types/types';

@Component({})
export default class SelectionComponent extends Vue
  implements EventBasedComponent {
  get selection() {
    return this.$store.getters['selection/getSelection'];
  }

  handleClick(event: MouseEvent, svgCoordinates: Coordinates) {
    // const method = this.$store.getters.getMethod;
    // switch (method) {
    //   case MethodTypes.CURSOR:
    //     this.$store.dispatch('svg/deselectAll');
    // }
  }

  handleMouseDown(event: MouseEvent, svgCoordinates: Coordinates) {
    // const method = this.$store.getters.getMethod;
    // switch (method) {
    //   case MethodTypes.SELECTION:
    //     this.prevCoordinates = svgCoordinates;
    //     this.$store.commit('selection/setSelectionOrigin', svgCoordinates);
    //     break;
    //   default:
    //     break;
    // }
  }
  handleMouseMove(event: MouseEvent, svgCoordinates: Coordinates) {
    // const method = this.$store.getters.getMethod;
    // switch (method) {
    //   case MethodTypes.SELECTION:
    //     if (!this.prevCoordinates) {
    //       return;
    //     }
    //     const x = svgCoordinates.x - this.prevCoordinates.x;
    //     const y = svgCoordinates.y - this.prevCoordinates.y;
    //     this.$store.commit('selection/setSelectionDimensions', { x, y });
    //     break;
    //   default:
    //     break;
    // }
  }
  handleMouseUp(event: MouseEvent, svgCoordinates: Coordinates) {
    // const method = this.$store.getters.getMethod;
    // switch (method) {
    //   case MethodTypes.SELECTION:
    //     if (!this.prevCoordinates) {
    //       return;
    //     }
    //     const lineCoordinates: LineCoordinates = {
    //       start: this.prevCoordinates,
    //       end: svgCoordinates,
    //     };
    //     this.$store.dispatch('svg/selectObjectsInRange', lineCoordinates);
    //     this.prevCoordinates = undefined;
    //     this.$store.commit('selection/clearSelection');
    //     break;
    //   default:
    //     break;
    // }
  }
}
</script>

<style lang="scss" scoped>
rect {
  stroke: black;
  fill: rgb(120, 240, 230);
  stroke-dasharray: 3;
  fill-opacity: 0.2;
}
</style>
