<template>
  <div class="SvgContainer">
    <svg
      id="svg"
      ref="svg"
      v-on:click="handleClick"
      v-on:mousedown="handleMouseDown"
      v-on:mousemove="handleMouseMove"
      v-on:mouseup="handleMouseUp"
    >
      <GridComponent
        v-bind:unit="unit"
        v-bind:svgHeight="svgHeight"
        v-bind:svgWidth="svgWidth"
      ></GridComponent>
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
      <Selection></Selection>
    </svg>
  </div>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
svg {
  width: 100vw;
  height: 100vh;
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
  overflow: scroll;
  border: 2px solid black;
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
import GridComponent from './Grid.vue';
import { Coordinates, MethodTypes, Point } from '@/types/types';

type WindowCoordinates = Coordinates;
type SvgCoordinates = Coordinates;
type OriginCoordinates = Coordinates;

@Component({
  components: {
    Lines,
    Points,
    Selection,
  },
})
export default class SvgComponent extends Vue {
  prevPoint?: Point;
  prevCoordinates?: WindowCoordinates;
  svg: SVGElement;
  originSvgCoordinates: SvgCoordinates;
  originWindowCoordinates: WindowCoordinates;
  svgWindowCoordinates: WindowCoordinates;
  unit = 10;
  svgWidth: number = 0;
  svgHeight: number = 0;

  update() {
    this.updateSvgWindowCoordinates();
    this.updateOriginWindowCoordinates();
  }

  mounted() {
    this.svg = this.$refs.svg as SVGElement;
    this.originSvgCoordinates = {
      x: this.svg.clientWidth / 2,
      y: this.svg.clientHeight / 2,
    };
    this.updateSvgWindowCoordinates();
    this.updateOriginWindowCoordinates();
  }

  get lines() {
    return this.$store.state.lines;
  }

  get points() {
    return this.$store.state.points;
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

  updateOriginWindowCoordinates() {
    this.originWindowCoordinates = {
      x: this.originSvgCoordinates.x + this.svgWindowCoordinates.x,
      y: this.originSvgCoordinates.y + this.svgWindowCoordinates.y,
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
    const x = point.x - point.x % this.unit;
    const y = point.y - point.y % this.unit;
    return { x, y, id: event.timeStamp };
  }

  handleClick(event: MouseEvent) {
    const method = this.$store.getters.getMethod;
    const eventCoords = this.getEventWindowCoordinates(event);
    const svgCoordinates = this.transformWindowToSvgCoordinates(eventCoords);
    const point = this.transformCoordinatesToPoint(svgCoordinates, event);
    this.$store.commit('deselectAllPoints');
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
        this.prevCoordinates = eventCoords;
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
        if (this.prevCoordinates) {
          const vector = {
            x: eventCoords.x - this.prevCoordinates.x,
            y: eventCoords.y - this.prevCoordinates.y,
          };
          // this only works with this.svg position: absolute;
          this.svg.style.top = `${0 + vector.y}px`;
          this.svg.style.left = `${0 + vector.x}px`;
          this.updateSvgWindowCoordinates();
        }
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
        break;
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
        this.prevCoordinates = undefined;
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
    this.prevPoint = undefined;
  }
}
</script>
