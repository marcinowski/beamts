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
        <template v-for="line in lines">
          <Lines
            :key="line.id"
            v-bind:line="line"
          ></Lines>
        </template>
        <template v-for="point in points">
          <Points
            :key="point.id"
            v-bind:point="point"
            v-on:selected-point="handleSelectedPoint"
          ></Points>
        </template>
        <GridComponent
          v-bind:unit="unit"
          v-bind:svgHeight="svgHeight"
          v-bind:svgWidth="svgWidth"
        ></GridComponent>
        <Selection></Selection>
        <!-- <CrossComponent v-bind:svgWidth="svgWidth" v-bind:svgHeight="svgHeight" v-bind:unit="unit"></CrossComponent> -->
      </svg>
      <div class="SvgMouseSvgCoordinates">
        {{ unitMouseCoordinates.x }}, {{ unitMouseCoordinates.y }}
      </div>
    </div>
  </v-content>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
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
import { mapMutations } from 'vuex';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import Lines from './Lines.vue';
import Points from './Points.vue';
import Selection from './Selection.vue';
import GridComponent from './GridComponent.vue';
import CrossComponent from './CrossComponent.vue';
import { Coordinates, MethodTypes, Point, Vector } from '@/types/types';

type WindowCoordinates = Coordinates;
type SvgCoordinates = Coordinates;
type OriginCoordinates = Coordinates;

@Component({
  components: {
    CrossComponent,
    GridComponent,
    Lines,
    Points,
    Selection,
  },
})
export default class SvgComponent extends Vue {
  prevPoint?: Point;
  prevCoordinates?: WindowCoordinates;
  svg: SVGElement;
  container: HTMLElement;
  svgWindowCoordinates: WindowCoordinates = { x: 0, y: 0 };
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

  get lines() {
    return this.$store.getters['svg/getAllLines'];
  }

  get points() {
    return this.$store.getters['svg/getAllPoints'];
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

  getEventWindowCoordinates(event: MouseEvent): WindowCoordinates {
    return {
      x: event.clientX,
      y: event.clientY,
    };
  }

  transformWindowToSvgCoordinates(
    eventCoords: WindowCoordinates,
  ): SvgCoordinates {
    const x = eventCoords.x - this.svgWindowCoordinates.x;
    const y = eventCoords.y - this.svgWindowCoordinates.y;
    return { x, y };
  }

  transformSvgToUnitCoordinates(svgCoords: SvgCoordinates): Coordinates {
    const x = this.roundUnitCoordinates(svgCoords.x / this.unit);
    const y = this.roundUnitCoordinates(svgCoords.y / this.unit);
    return { x, y };
  }

  roundUnitCoordinates(n: number): number {
    return parseFloat((Math.ceil(n * this.scale) / this.scale).toFixed(2));
  }

  transformCoordinatesToPoint(point: Coordinates, event: MouseEvent): Point {
    const x = point.x - point.x % this.baseUnit;
    const y = point.y - point.y % this.baseUnit;
    return { x, y, id: event.timeStamp };
  }

  handleClick(event: MouseEvent) {
    const method = this.$store.getters.getMethod;
    const eventCoords = this.getEventWindowCoordinates(event);
    const svgCoordinates = this.transformWindowToSvgCoordinates(eventCoords);
    const point = this.transformCoordinatesToPoint(svgCoordinates, event);
    this.$store.dispatch('svg/deselectAll');
    switch (method) {
      case MethodTypes.CURSOR:
        this.prevPoint = undefined; // resetting the line
        break;
      case MethodTypes.SELECTION:
        break;
      case MethodTypes.POINT:
        this.$store.commit('svg/addPoint', point);
        break;
      case MethodTypes.LINE:
        this.$store.commit('svg/addPoint', point);
        this.addLine(event, point);
        break;
      case MethodTypes.MOVE:
        break;
    }
  }

  handleMouseDown(event: MouseEvent) {
    const method = this.$store.getters.getMethod;
    const eventCoords = this.getEventWindowCoordinates(event);
    const svgCoordinates = this.transformWindowToSvgCoordinates(event);
    switch (method) {
      case MethodTypes.CURSOR:
        break;
      case MethodTypes.SELECTION:
        this.prevCoordinates = svgCoordinates;
        this.$store.commit('svg/setSelectionOrigin', svgCoordinates);
        break;
      case MethodTypes.POINT:
        break;
      case MethodTypes.LINE:
        break;
      case MethodTypes.MOVE:
        this.prevCoordinates = svgCoordinates;
    }
  }

  handleMouseMove(event: MouseEvent) {
    const method = this.$store.getters.getMethod;
    const eventCoords = this.getEventWindowCoordinates(event);
    const svgCoordinates = this.transformWindowToSvgCoordinates(eventCoords);
    switch (method) {
      case MethodTypes.CURSOR:
        break;
      case MethodTypes.SELECTION:
        if (!this.prevCoordinates) {
          return;
        }
        const x = svgCoordinates.x - this.prevCoordinates.x;
        const y = svgCoordinates.y - this.prevCoordinates.y;
        this.$store.commit('svg/setSelectionDimensions', { x, y });
        break;
      case MethodTypes.POINT:
        break;
      case MethodTypes.LINE:
        break;
      case MethodTypes.MOVE:
        break;
    }
  }

  handleMouseUp(event: MouseEvent) {
    const method = this.$store.getters.getMethod;
    const eventCoords = this.getEventWindowCoordinates(event);
    const svgCoordinates = this.transformWindowToSvgCoordinates(eventCoords);
    switch (method) {
      case MethodTypes.CURSOR:
        break;
      case MethodTypes.SELECTION:
        if (!this.prevCoordinates) {
          return;
        }
        this.$store.dispatch('svg/selectObjectsInRange', [
          this.prevCoordinates,
          svgCoordinates,
        ]);
        this.prevCoordinates = undefined;
        this.$store.commit('svg/clearSelection');
        break;
      case MethodTypes.POINT:
        break;
      case MethodTypes.LINE:
        break;
      case MethodTypes.MOVE:
        if (!this.prevCoordinates) {
          return;
        }
        const vector = this.getVector(this.prevCoordinates, svgCoordinates);
        this.$store.dispatch('svg/moveSelectedPoints', vector);
        this.prevCoordinates = undefined;
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

  handleSelectedPoint(el: { event: Event; point: Point }) {
    const method = this.$store.getters.getMethod;
    switch (method) {
      case MethodTypes.LINE:
        this.addLine(el.event, el.point);
        break;
    }
  }

  addLine(event: Event, point: Point) {
    if (!this.prevPoint) {
      this.prevPoint = point;
      return;
    }
    const line = {
      p1: this.prevPoint.id,
      p2: point.id,
      id: event.timeStamp + 1, // hack to distinguish from the point
    };
    this.$store.commit('svg/addLine', line);
    this.prevPoint = point;
  }

  getVector(start: Coordinates, end: Coordinates): Vector {
    return {
      x: end.x - start.x,
      y: end.y - start.y,
    };
  }
}
</script>
