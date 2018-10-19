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
} from '@/types/types';

@Component({
  components: {
    Arcs,
    Lines,
    Points,
  },
})
export default class PrimitivesComponent extends Vue {
  prevPoint?: Point;

  get arcs() {
    return this.$store.getters['svg/getAllArcs'];
  }

  get lines() {
    return this.$store.getters['svg/getAllLines'];
  }

  get points() {
    return this.$store.getters['svg/getAllPoints'];
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
}
</script>
