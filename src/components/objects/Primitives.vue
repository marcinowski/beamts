<template>
  <g>
    <template v-for="arc in arcs">
      <Arcs
        :key="arc.id"
        v-bind:arc="arc"
      ></Arcs>
    </template>
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
  </g>
</template>

<style scoped>
</style>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import Arcs from './Arcs.vue';
import Lines from './Lines.vue';
import Points from './Points.vue';
import {
  Coordinates,
  MethodTypes,
  Point,
  Vector,
  Rotation,
  LineCoordinates,
  Arc,
  EventBasedComponent,
} from '@/types/types';

@Component({
  components: {
    Arcs,
    Lines,
    Points,
  },
})
export default class PrimitivesComponent extends Vue
  implements EventBasedComponent {
  prevPoint?: Point;
  prevCoordinates?: Coordinates;
  baseUnit = 5;

  get arcs() {
    return this.$store.getters['svg/getAllArcs'];
  }

  get lines() {
    return this.$store.getters['svg/getAllLines'];
  }

  get points() {
    return this.$store.getters['svg/getAllPoints'];
  }

  transformCoordinatesToPoint(point: Coordinates, event: MouseEvent): Point {
    const x = point.x - point.x % this.baseUnit; // FIXME: getters, CONFIG store
    const y = point.y - point.y % this.baseUnit;
    return { x, y, id: event.timeStamp };
  }

  handleClick(event: MouseEvent, svgCoordinates: Coordinates) {
    const method = this.$store.getters.getMethod;
    const point = this.transformCoordinatesToPoint(svgCoordinates, event);
    switch (method) {
      case MethodTypes.CURSOR:
        this.prevPoint = undefined; // resetting the line
        break;
      case MethodTypes.POINT:
        this.$store.commit('svg/addPoint', point);
        break;
      case MethodTypes.LINE:
        this.$store.commit('svg/addPoint', point);
        this.addLine(event, point);
        break;
      case MethodTypes.ARC:
        this.$store.commit('svg/addPoint', point);
        this.addArc(event, point);
      default:
        break;
    }
  }

  handleMouseDown(event: MouseEvent, svgCoordinates: Coordinates) {
    const method = this.$store.getters.getMethod;
    switch (method) {
      case MethodTypes.FLIP:
      case MethodTypes.MOVE:
      case MethodTypes.ROTATE:
        this.prevCoordinates = svgCoordinates;
      default:
        break;
    }
  }

  handleMouseMove(event: MouseEvent, svgCoordinates: Coordinates) {
    const method = this.$store.getters.getMethod;
    switch (method) {
      default:
        break;
    }
  }

  handleMouseUp(event: MouseEvent, svgCoordinates: Coordinates) {
    const method = this.$store.getters.getMethod;
    switch (method) {
      case MethodTypes.MOVE:
        if (!this.prevCoordinates) {
          return;
        }
        const vector = this.getVector(this.prevCoordinates, svgCoordinates);
        this.$store.dispatch('svg/moveSelectedPoints', vector);
        this.prevCoordinates = undefined;
      case MethodTypes.ROTATE:
        if (!this.prevCoordinates) {
          return;
        }
        const angle = this.getAngle(this.prevCoordinates, svgCoordinates);
        const rotation: Rotation = { angle, origin: this.prevCoordinates };
        this.$store.dispatch('svg/rotateSelectedPoints', rotation);
        this.prevCoordinates = undefined;
      case MethodTypes.FLIP:
        if (!this.prevCoordinates) {
          return;
        }
        const line: LineCoordinates = {
          start: this.prevCoordinates,
          end: svgCoordinates,
        };
        this.$store.dispatch('svg/flipSelectedPoints', line);
        this.prevCoordinates = undefined;
      default:
        break;
    }
  }

  handleSelectedPoint(el: { event: MouseEvent; point: Point }) {
    const method = this.$store.getters.getMethod;
    switch (method) {
      case MethodTypes.LINE:
        this.addLine(el.event, el.point);
        break;
      case MethodTypes.ARC:
        this.addArc(el.event, el.point);
    }
  }

  addArc(event: Event, point: Point) {
    if (!this.prevPoint) {
      this.prevPoint = point;
    } else {
      const radius = 10; // FIXME: allow specification of the radius somehow
      const arc: Arc = {
        id: event.timeStamp + 2,
        radius,
        p1: this.prevPoint.id,
        p2: point.id,
        selected: false,
      };
      this.$store.commit('svg/addArc', arc);
      this.prevPoint = undefined;
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

  getAngle(start: Coordinates, end: Coordinates): number {
    return Math.atan2(end.y - start.y, end.x - start.x);
  }
}
</script>
