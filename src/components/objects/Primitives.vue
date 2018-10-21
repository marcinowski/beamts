<template>
  <g>
    <template v-for="arc in arcs">
      <Arcs
        :key="arc.id"
        v-bind:arc="arc"
        v-on:selected-arc="handeSelectedObject"
      ></Arcs>
    </template>
    <template v-for="line in lines">
      <Lines
        :key="line.id"
        v-bind:line="line"
        v-on:selected-line="handleSelectedObject"
      ></Lines>
    </template>
    <template v-for="point in points">
      <Points
        :key="point.id"
        v-bind:point="point"
        v-on:selected-point="handleSelectedObject"
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
import { CustomEvent } from '@/types/types';

@Component({
  components: {
    Arcs,
    Lines,
    Points,
  },
})
export default class PrimitivesComponent extends Vue {
  get arcs() {
    return this.$store.getters['svg/getAllArcs'];
  }

  get lines() {
    return this.$store.getters['svg/getAllLines'];
  }

  get points() {
    return this.$store.getters['svg/getAllPoints'];
  }

  handleSelectedObject(event: CustomEvent) {
    this.$emit('selected-object', event);
  }
}
</script>
