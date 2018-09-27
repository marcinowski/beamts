<template>
  <v-content class="SvgWindow">
    <div ref="container" class="SvgContainer">
      <svg
        id="svg"
        ref="svg"
        v-on:click="handleClick"
        v-on:mousedown="handleMouseDown"
        v-on:mousemove="handleMouseMove"
        v-on:mouseup="handleMouseUp"
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
        <CrossComponent v-bind:svgWidth="svgWidth" v-bind:svgHeight="svgHeight" v-bind:unit="unit"></CrossComponent>
      </svg>
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
import { Coordinates, MethodTypes, Point } from '@/types/types';

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
  svgWindowCoordinates: WindowCoordinates;
  baseUnit = 5;
  svgWidth: number = 0;
  svgHeight: number = 0;
  containerBounds: ClientRect;

  get unit() {
    return this.baseUnit * 10;
  }

  mounted() {
    this.svg = this.$refs.svg as SVGElement;
    this.svg.addEventListener('scroll', () => console.log('SCROOOOL'));
    this.container = this.$refs.container as HTMLElement;
    setTimeout(() => {
      // small hack to run the update as soon as possible
      this.updateSvgWindowCoordinates();
    }, 0);
  }

  get lines() {
    return this.$store.state.lines;
  }

  get points() {
    return this.$store.state.points;
  }

  updateSvgWindowCoordinates() {
    this.containerBounds = this.container.getBoundingClientRect();
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
    this.$store.dispatch('deselectAll');
    switch (method) {
      case MethodTypes.CURSOR:
        break;
      case MethodTypes.SELECTION:
        break;
      case MethodTypes.POINT:
        this.$store.commit('addPoint', point);
        break;
      case MethodTypes.LINE:
        this.$store.commit('addPoint', point);
        this.addLine(event, point);
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
        this.$store.commit('setSelectionOrigin', svgCoordinates);
        break;
      case MethodTypes.POINT:
        break;
      case MethodTypes.LINE:
        break;
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
        this.$store.commit('setSelectionDimensions', { x, y });
        break;
      case MethodTypes.POINT:
        if (svgCoordinates.x % this.unit === 0) {
          // draw vertical helper line
        }
        if (svgCoordinates.y % this.unit === 0) {
          // draw horizontal helper line
        }
      case MethodTypes.LINE:
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
        this.$store.dispatch('selectPointsInRange', [
          this.prevCoordinates,
          svgCoordinates,
        ]);
        this.prevCoordinates = undefined;
        this.$store.commit('clearSelection');
        break;
      case MethodTypes.POINT:
        break;
      case MethodTypes.LINE:
        break;
    }
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
    this.$store.commit('addLine', line);
    this.prevPoint = point;
  }
}
</script>
