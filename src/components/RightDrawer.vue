<template>
  <v-container>
    <template v-for="item in items">
      <v-tooltip
        left
        :key="item.icon"
      >
        <v-btn
          slot="activator"
          icon flat
          :small="false"
          :block="true"
          :color="item.value ? 'green' : undefined"
          v-on:click="item.onClick()"
        >
          <v-icon v-html="item.icon"></v-icon>
        </v-btn>
        <span>{{ item.tooltip }}</span>
      </v-tooltip>
    </template>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { MethodTypes } from '@/types/types';

interface ToggleIcons {
  icon: string;
  tooltip: string;
  value: boolean;
  onClick: () => void;
}

@Component({})
export default class RightDrawer extends Vue {
  get gridOn() {
    return this.$store.getters['config/isGridOn'];
  }

  get continuousLine() {
    return this.$store.getters['config/isContinuousLine'];
  }

  get orthogonalMode() {
    return this.$store.getters['config/isOrthogonalMode'];
  }

  get items(): ToggleIcons[] {
    return [
      {
        icon: 'border_all',
        tooltip: 'Toggle grid',
        value: this.gridOn,
        onClick: () => this.toggleGrid(),
      },
      {
        icon: 'border_inner',
        tooltip: 'Toggle ortho mode',
        value: this.orthogonalMode,
        onClick: () => this.toggleOrthogonalMode(),
      },
      {
        icon: 'call_split',
        tooltip: 'Toggle continuous line',
        value: this.continuousLine,
        onClick: () => this.toggleContinuousLine(),
      },
    ];
  }

  toggleGrid() {
    this.$store.commit('config/toggleGrid');
  }

  toggleOrthogonalMode() {
    this.$store.commit('config/toggleOrthogonalMode');
  }

  toggleContinuousLine() {
    this.$store.commit('config/toggleContinuousLine');
  }
}
</script>

<style lang="scss" scoped>
</style>
