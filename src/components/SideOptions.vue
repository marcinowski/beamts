<template>
  <div class="SideOptions">
    <v-list>
      <v-list-group
        v-for="group in groups"
        v-model="group.active"
        :key="group.title"
        :prepend-icon="group.icon"
        no-action
      >
        <v-list-tile slot="activator">
          <v-list-tile-content>
            <v-list-tile-title>{{ group.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile
          v-for="item in group.actions"
          :key="item.title"
          @click="item.onClick()"
        >
          <v-list-tile-action>
            <v-icon v-html="item.icon"></v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.title"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list-group>
    </v-list>
    <span>&copy; 2018</span>
  </div>
</template>

<style lang="scss" scoped>
.SideOptions {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}
</style>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { MethodTypes } from '@/types/types';

interface Method {
  icon: string;
  title: string;
  onClick: () => void;
}

@Component({})
export default class SideOptions extends Vue {
  methods: Method[] = [
    {
      icon: 'near_me',
      title: 'Cursor',
      onClick: () => this.handleMethodClick(MethodTypes.CURSOR),
    },
    {
      icon: 'open_with',
      title: 'Move',
      onClick: () => this.handleMethodClick(MethodTypes.MOVE),
    },
    {
      icon: 'tab_unselected',
      title: 'Select',
      onClick: () => this.handleMethodClick(MethodTypes.SELECTION),
    },
    {
      icon: 'scatter_plot',
      title: 'Points',
      onClick: () => this.handleMethodClick(MethodTypes.POINT),
    },
    {
      icon: 'show_chart',
      title: 'Line',
      onClick: () => this.handleMethodClick(MethodTypes.LINE),
    },
  ];

  actions: Method[] = [
    {
      icon: 'undo',
      title: 'Undo',
      onClick: () => {
        this.$store.dispatch('svg/undo');
      },
    },
    {
      icon: 'delete_forever',
      title: 'Clear Selected',
      onClick: () => {
        this.$store.dispatch('svg/removeSelected');
      },
    },
    {
      icon: 'delete_forever',
      title: 'Clear All',
      onClick: () => {
        this.$store.commit('svg/removeAll');
      },
    },
    {
      icon: 'check',
      title: 'Check',
      onClick: () => {
        const result = this.check();
        console.log('Valid: ', result);
      },
    },
    {
      icon: 'perm_data_settings',
      title: 'Calculate',
      onClick: () => {
        console.log('Calculate');
      },
    },
    {
      icon: 'backup',
      title: 'Save',
      onClick: () => {
        console.log('Save');
      },
    },
    {
      icon: 'adjust',
      title: 'Center',
      onClick: () => {
        console.log('Center');
      },
    },
  ];

  groups = [
    {
      icon: 'edit',
      title: 'Draw',
      active: true,
      actions: this.methods,
    },
    {
      icon: 'assessment',
      title: 'Actions',
      active: false,
      actions: this.actions,
    },
  ];

  check() {
    const points = this.$store.getters['svg/pointsCount'];
    const lines = this.$store.getters['svg/linesCount'];
    return lines >= points - 1;
  }

  handleMethodClick(methodType: MethodTypes) {
    this.$store.commit('changeMethod', methodType);
  }
}
</script>

