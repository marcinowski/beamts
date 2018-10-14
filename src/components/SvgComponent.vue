<template>
  <v-content class="SvgWindow">
    <div class="SvgContainer">
      <svg
        id="svg"
        ref="svg"
        v-on:click="handleClick"
        v-on:mousedown="handleMouseDown"
        v-on:mousemove="handleMouseMove"
        v-on:mouseup="handleMouseUp"
        v-on:mouseover="handleHover"
      >
        <PrimitivesComponent ref="primitives"></PrimitivesComponent>
        <GridComponent
          v-bind:unit="unit"
          v-bind:svgHeight="svgHeight"
          v-bind:svgWidth="svgWidth"
        ></GridComponent>
        <Selection></Selection>
      </svg>
      <div class="SvgMouseSvgCoordinates">
        {{ unitMouseCoordinates.x }}, {{ unitMouseCoordinates.y }}
      </div>
    </div>
  </v-content>
</template>

<style scoped>
svg {
  width: 100%;
  height: 100%;
  position: absolute;
  background-color: white;
}
rect {
  stroke: black;
  fill: rgb(120, 240, 230);
  stroke-dasharray: 3;
  fill-opacity: 0.2;
}
.SvgWindow {
  /* overflow: scroll; */
}
.SvgContainer {
  height: 100%;
  width: 100%;
  background-color: grey;
}
.SvgMouseSvgCoordinates {
  background-color: grey;
  bottom: 0;
  left: 0;
  position: absolute;
}
</style>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import Selection from './Selection.vue';
import GridComponent from './GridComponent.vue';
import CrossComponent from './CrossComponent.vue';
import PrimitivesComponent from './objects/Primitives.vue';
import {
  Coordinates,
  MethodTypes,
  Point,
  Vector,
  Rotation,
  LineCoordinates,
  Arc,
} from '@/types/types';

@Component({
  components: {
    PrimitivesComponent,
    CrossComponent,
    GridComponent,
    Selection,
  },
})
export default class SvgComponent extends Vue {
  prevCoordinates?: Coordinates;
  svg: SVGElement;
  container: HTMLElement;
  svgWindowCoordinates: Coordinates = { x: 0, y: 0 };
  unitMouseCoordinates = { x: 0.0, y: 0.0 };
  baseUnit = 5;
  scale = 10;
  svgWidth: number = 0;
  svgHeight: number = 0;

  get unit() {
    return this.baseUnit * this.scale;
  }

  mounted() {
    this.svg = this.$refs.svg as SVGElement;
    setTimeout(() => {
      // small hack to run the update as late as possible
      this.updateSvgWindowCoordinates();
    }, 0);
  }

  updateSvgWindowCoordinates() {
    const { left, top, width, height } = this.svg.getBoundingClientRect();
    this.svgWidth = width;
    this.svgHeight = height;
    this.svgWindowCoordinates = {
      x: left,
      y: top,
    };
  }

  getEventWindowCoordinates(event: MouseEvent): Coordinates {
    return {
      x: event.clientX,
      y: event.clientY,
    };
  }

  transformWindowToSvgCoordinates(eventCoords: Coordinates): Coordinates {
    const x = eventCoords.x - this.svgWindowCoordinates.x;
    const y = eventCoords.y - this.svgWindowCoordinates.y;
    return { x, y };
  }

  transformSvgToUnitCoordinates(svgCoords: Coordinates): Coordinates {
    const x = this.roundUnitCoordinates(svgCoords.x / this.unit);
    const y = this.roundUnitCoordinates(svgCoords.y / this.unit);
    return { x, y };
  }

  roundUnitCoordinates(n: number): number {
    return parseFloat((Math.ceil(n * this.scale) / this.scale).toFixed(2));
  }

  handleClick(event: MouseEvent) {
    const method = this.$store.getters.getMethod;
    const eventCoords = this.getEventWindowCoordinates(event);
    const svgCoordinates = this.transformWindowToSvgCoordinates(eventCoords);
    this.$store.dispatch('svg/deselectAll');
    (this.$refs.primitives as PrimitivesComponent).handleClick(
      event,
      svgCoordinates,
    );
    switch (method) {
      default:
        break;
    }
  }

  handleMouseDown(event: MouseEvent) {
    const method = this.$store.getters.getMethod;
    const eventCoords = this.getEventWindowCoordinates(event);
    const svgCoordinates = this.transformWindowToSvgCoordinates(event);
    (this.$refs.primitives as PrimitivesComponent).handleMouseDown(
      event,
      svgCoordinates,
    );
    switch (method) {
      case MethodTypes.SELECTION:
        this.prevCoordinates = svgCoordinates;
        this.$store.commit('selection/setSelectionOrigin', svgCoordinates);
        break;
      default:
        break;
    }
  }

  handleMouseMove(event: MouseEvent) {
    const method = this.$store.getters.getMethod;
    const eventCoords = this.getEventWindowCoordinates(event);
    const svgCoordinates = this.transformWindowToSvgCoordinates(eventCoords);
    (this.$refs.primitives as PrimitivesComponent).handleMouseMove(
      event,
      svgCoordinates,
    );
    switch (method) {
      case MethodTypes.SELECTION:
        if (!this.prevCoordinates) {
          return;
        }
        const x = svgCoordinates.x - this.prevCoordinates.x;
        const y = svgCoordinates.y - this.prevCoordinates.y;
        this.$store.commit('selection/setSelectionDimensions', { x, y });
        break;
      default:
        break;
    }
  }

  handleMouseUp(event: MouseEvent) {
    const method = this.$store.getters.getMethod;
    const eventCoords = this.getEventWindowCoordinates(event);
    const svgCoordinates = this.transformWindowToSvgCoordinates(eventCoords);
    (this.$refs.primitives as PrimitivesComponent).handleMouseUp(
      event,
      svgCoordinates,
    );
    switch (method) {
      case MethodTypes.SELECTION:
        if (!this.prevCoordinates) {
          return;
        }
        const lineCoordinates: LineCoordinates = {
          start: this.prevCoordinates,
          end: svgCoordinates,
        };
        this.$store.dispatch('svg/selectObjectsInRange', lineCoordinates);
        this.prevCoordinates = undefined;
        this.$store.commit('selection/clearSelection');
        break;
      default:
        break;
    }
  }

  handleHover(event: MouseEvent) {
    const eventCoords = this.getEventWindowCoordinates(event);
    const svgCoordinates = this.transformWindowToSvgCoordinates(eventCoords);
    this.unitMouseCoordinates = this.transformSvgToUnitCoordinates({
      x: svgCoordinates.x,
      y: this.svgHeight - svgCoordinates.y,
    });
  }
}
</script>
