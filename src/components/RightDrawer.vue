<template>
  <v-container fluid>
    Points
    <template v-for="point in points">
      <div :key="point.id">
        {{ point.x }} {{ point.y }} {{ point.id }}
      </div>
    </template>
    Lines
    <template v-for="line in lines">
      <div :key="line.id">
        {{ line.p1 }} {{ line.p2 }} {{ line.id }}
      </div>
    </template>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { MethodTypes } from '@/types/types';

@Component({})
export default class RightDrawer extends Vue {
  get lines() {
    return this.$store.getters.getSelectedLines;
  }

  get points() {
    return this.$store.getters.getSelectedPoints;
  }
}
</script>

<style lang="scss" scoped>
</style>
