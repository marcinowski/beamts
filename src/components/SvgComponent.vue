<template>
  <v-content>
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
        <PrimitivesComponent></PrimitivesComponent>
        <SelectionComponent></SelectionComponent>
        <GridComponent
          v-bind:svgHeight="svgHeight"
          v-bind:svgWidth="svgWidth"
        ></GridComponent>
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
import GridComponent from './GridComponent.vue';
import CrossComponent from './CrossComponent.vue';
import PrimitivesComponent from './objects/Primitives.vue';
import SelectionComponent from './Selection.vue';
import { EventHandler } from '@/event-handlers/event-handler';
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
    SelectionComponent,
  },
})
export default class SvgComponent extends Vue {
  container: HTMLElement;
  eventHandler: EventHandler;
  svg: SVGElement;
  svgWindowCoordinates: Coordinates = { x: 0, y: 0 };
  unitMouseCoordinates = { x: 0.0, y: 0.0 };
  svgWidth: number = 0;
  svgHeight: number = 0;

  get unit() {
    return this.$store.getters['config/getUnit'];
  }
  get scale() {
    return this.$store.getters['config/getScale'];
  }

  constructor() {
    super();
    this.eventHandler = new EventHandler(this.$store);
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

  handleEvent(event: MouseEvent) {
    const eventCoords = this.getEventWindowCoordinates(event);
    const svgCoordinates = this.transformWindowToSvgCoordinates(eventCoords);
    this.eventHandler.handleEvent(event, svgCoordinates);
  }

  handleClick(event: MouseEvent) {
    this.handleEvent(event);
  }

  handleMouseDown(event: MouseEvent) {
    this.handleEvent(event);
  }

  handleMouseMove(event: MouseEvent) {
    this.handleEvent(event);
  }

  handleMouseUp(event: MouseEvent) {
    this.handleEvent(event);
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
