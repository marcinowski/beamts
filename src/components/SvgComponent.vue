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
        <PrimitivesComponent
          v-on:selected-object="handleSelectedObject"
        ></PrimitivesComponent>
        <SelectionComponent></SelectionComponent>
        <GridComponent
          v-bind:svgHeight="svgHeight"
          v-bind:svgWidth="svgWidth"
        ></GridComponent>
      </svg>
      <div class="Helpers">
        <StageInputHelper
          v-on:helper-submission="handleSubmission"
        ></StageInputHelper>
      </div>
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
.Helpers {
  bottom: 0;
  left: 0;
  position: absolute;
  background-color: rgba(255, 255, 255, 0.7);
  width: 100%;
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
import StageInputHelper from './StageInputHelper.vue';
import { EventHandler } from '@/event-handlers/event-handler';
import {
  Coordinates,
  MethodTypes,
  Point,
  Vector,
  Rotation,
  LineCoordinates,
  Arc,
  CustomEvent,
  ObjectTypes,
  EventTypes,
} from '@/types/types';
import {
  createCustomEventFromMouseEvent,
  transformCoordinatesToScaled,
} from '@/helpers/helpers';
import { Transform } from '@/event-handlers/transform';

@Component({
  components: {
    PrimitivesComponent,
    CrossComponent,
    GridComponent,
    SelectionComponent,
    StageInputHelper,
  },
})
export default class SvgComponent extends Vue {
  container: HTMLElement;
  eventHandler: EventHandler;
  svg: SVGElement;
  svgWindowCoordinates: Coordinates = { x: 0, y: 0 };
  transformer: Transform;
  unitMouseCoordinates = { x: 0.0, y: 0.0 };
  svgWidth: number = 0;
  svgHeight: number = 0;

  constructor() {
    super();
    this.eventHandler = new EventHandler(this.$store);
    this.transformer = new Transform(this.$store);
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

  getEventWindowCoordinates(event: CustomEvent): Coordinates {
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

  handleEvent(event: CustomEvent) {
    const eventCoords = this.getEventWindowCoordinates(event);
    const svgCoordinates = this.transformWindowToSvgCoordinates(eventCoords);
    this.eventHandler.handleEvent(event, svgCoordinates);
  }

  handleClick(event: MouseEvent) {
    this.handleEvent(createCustomEventFromMouseEvent(event));
  }

  handleMouseDown(event: MouseEvent) {
    this.handleEvent(createCustomEventFromMouseEvent(event));
  }

  handleMouseMove(event: MouseEvent) {
    this.handleEvent(createCustomEventFromMouseEvent(event));
  }

  handleMouseUp(event: MouseEvent) {
    this.handleEvent(createCustomEventFromMouseEvent(event));
  }

  handleSubmission(event: CustomEvent) {
    this.handleEvent(event);
  }

  handleHover(event: MouseEvent) {
    const eventCoords = this.getEventWindowCoordinates(
      createCustomEventFromMouseEvent(event),
    );
    const svgCoordinates = this.transformWindowToSvgCoordinates(eventCoords);
    this.unitMouseCoordinates = this.transformer.coordinatesToAbsolute(
      svgCoordinates,
    );
  }

  handleSelectedObject(event: CustomEvent) {
    this.handleEvent(event);
  }
}
</script>
