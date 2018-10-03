<template>
  <rect
    v-bind:x="selection.x"
    v-bind:y="selection.y"
    v-bind:width="selection.width"
    v-bind:height="selection.height"
  ></rect>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';

@Component({})
export default class Points extends Vue {
  get selection() {
    return this.$store.getters['svg/getSelection'];
  }
}
</script>

<style lang="scss" scoped>
rect {
  stroke: black;
  fill: rgb(120, 240, 230);
  stroke-dasharray: 3;
  fill-opacity: 0.2;
}
</style>
