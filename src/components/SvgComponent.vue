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

<style lang="scss" scoped>
svg {
  width: 100%;
  height: 100%;
  position: absolute;
  background-color: white;
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
  CustomEvent,
  ObjectTypes,
  EventTypes,
} from '@/types/types';
import {
  createCustomEventFromMouseEvent,
  transformCoordinatesToScaled,
  createCustomEventFromKeyboardEvent,
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

  mounted() {
    this.svg = this.$refs.svg as SVGElement;
    setTimeout(() => {
      // small hack to run the update as late as possible
      this.updateSvgWindowCoordinates();
    }, 0);
    document.addEventListener('keyup', this.handleKeyUp);
    this.eventHandler = new EventHandler(this.$store);
    this.transformer = new Transform(this.$store);
  }

  beforeDestroy() {
    document.removeEventListener('keyup', this.handleKeyUp);
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
      x: event.clientX || 0,
      y: event.clientY || 0,
    };
  }

  transformWindowToSvgCoordinates(eventCoords: Coordinates): Coordinates {
    const x = eventCoords.x - this.svgWindowCoordinates.x;
    const y = eventCoords.y - this.svgWindowCoordinates.y;
    return { x, y };
  }

  handleEvent(event: CustomEvent, transformWindow: boolean = true) {
    const eventCoords = this.getEventWindowCoordinates(event);
    const svgCoordinates = transformWindow
      ? this.transformWindowToSvgCoordinates(eventCoords)
      : eventCoords;
    this.eventHandler.handleEvent(event, svgCoordinates);
  }

  handleClick(event: MouseEvent) {
    this.handleEvent(createCustomEventFromMouseEvent(event));
  }

  handleMouseDown(event: MouseEvent) {
    this.handleEvent(createCustomEventFromMouseEvent(event));
  }

  handleMouseMove(event: MouseEvent) {
    const customEvent = createCustomEventFromMouseEvent(event);
    this.updateCoordinates(customEvent);
    this.handleEvent(customEvent);
  }

  handleMouseUp(event: MouseEvent) {
    this.handleEvent(createCustomEventFromMouseEvent(event));
  }

  handleSubmission(event: CustomEvent) {
    this.handleEvent(event);
  }

  handleKeyUp(event: KeyboardEvent) {
    const { timeStamp } = event;
    switch (event.keyCode) {
      case 27: // escape
        return this.handleEvent({ timeStamp, type: EventTypes.KEY_ESC });
      case 8: // backspace
      case 46: // delete
        return this.handleEvent({ timeStamp, type: EventTypes.KEY_DELETE });
      case 13: // enter
        return this.handleEvent({ timeStamp, type: EventTypes.KEY_ENTER });
    }
  }

  updateCoordinates(customEvent: CustomEvent) {
    const eventCoords = this.getEventWindowCoordinates(customEvent);
    const svgCoordinates = this.transformWindowToSvgCoordinates(eventCoords);
    this.unitMouseCoordinates = this.transformer.coordinatesToAbsolute(
      svgCoordinates,
    );
  }

  handleSelectedObject(event: CustomEvent) {
    this.handleEvent(event, false);
  }
}
</script>
