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
      icon: 'scatter_plot',
      title: 'Points',
      onClick: () => this.handleMethodClick(MethodTypes.POINT),
    },
    {
      icon: 'show_chart',
      title: 'Line',
      onClick: () => this.handleMethodClick(MethodTypes.LINE),
    },
    {
      icon: 'wifi_tethering',
      title: 'Arc',
      onClick: () => this.handleMethodClick(MethodTypes.ARC),
    },
    {
      icon: 'tab_unselected',
      title: 'Select',
      onClick: () => this.handleMethodClick(MethodTypes.SELECTION),
    },
    {
      icon: 'open_with',
      title: 'Move',
      onClick: () => this.handleMethodClick(MethodTypes.MOVE),
    },
    {
      icon: 'rotate_right',
      title: 'Rotate',
      onClick: () => this.handleMethodClick(MethodTypes.ROTATE),
    },
    {
      icon: 'flip',
      title: 'Flip',
      onClick: () => this.handleMethodClick(MethodTypes.FLIP),
    },
    {
      icon: 'straighten',
      title: 'Measure',
      onClick: () => console.log('Measure'),
    },
  ];

  sections: Method[] = [
    {
      icon: 'spellcheck',
      title: 'Assign Section',
      onClick: () => console.log('sections'),
    },
    {
      icon: 'edit',
      title: 'Edit Sections',
      onClick: () => console.log('edit sections'),
    },
  ];

  materials: Method[] = [
    {
      icon: 'check_circle',
      title: 'Assign Material',
      onClick: () => console.log('materials'),
    },
    {
      icon: 'edit',
      title: 'Edit Materials',
      onClick: () => console.log('edit materials'),
    },
  ];

  loads: Method[] = [
    {
      icon: 'vertical_align_bottom',
      title: 'Force',
      onClick: () => console.log('force'),
    },
    {
      icon: 'replay',
      title: 'Momentum',
      onClick: () => console.log('momentum'),
    },
    {
      icon: 'power_input',
      title: 'Load',
      onClick: () => console.log('load'),
    },
  ];

  bearings: Method[] = [
    {
      icon: 'center_focus_strong',
      title: 'Full',
      onClick: () => console.log('Full Bearing'),
    },
    {
      icon: 'change_history',
      title: 'Bearing',
      onClick: () => console.log('Bearing'),
    },
    {
      icon: 'eject',
      title: 'Loose Bearing',
      onClick: () => console.log('Loose Bearing'),
    },
    {
      icon: 'category',
      title: 'Custom',
      onClick: () => console.log('Custom Bearing'),
    },
  ];

  calculations: Method[] = [
    {
      icon: 'check',
      title: 'Check',
      onClick: () => this.check(),
    },
    {
      icon: 'perm_data_settings',
      title: 'Calculate',
      onClick: () => console.log('Calculate'),
    },
  ];

  visuals: Method[] = [
    {
      icon: 'adjust',
      title: 'Center',
      onClick: () => console.log('Center'),
    },
    {
      icon: 'zoom_in',
      title: 'Zoom in',
      onClick: () => console.log('Zoom in'),
    },
    {
      icon: 'zoom_out',
      title: 'Zoom out',
      onClick: () => console.log('Zoom out'),
    },
  ];

  actions: Method[] = [
    {
      icon: 'edit',
      title: 'Edit',
      onClick: () => console.log('Edit'),
    },
    {
      icon: 'group_work',
      title: 'Group',
      onClick: () => console.log('Group'),
    },
    {
      icon: 'file_copy',
      title: 'Copy',
      onClick: () => console.log('Copy'),
    },
    {
      icon: 'insert_drive_file',
      title: 'Paste',
      onClick: () => console.log('Paste'),
    },
    {
      icon: 'undo',
      title: 'Undo',
      onClick: () => this.$store.dispatch('svg/undo'),
    },
    {
      icon: 'clear',
      title: 'Clear Selected',
      onClick: () => this.$store.dispatch('svg/removeSelected'),
    },
    {
      icon: 'delete_forever',
      title: 'Clear All',
      onClick: () => this.$store.commit('svg/removeAll'),
    },
    {
      icon: 'backup',
      title: 'Save',
      onClick: () => console.log('Save'),
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
      icon: 'fitness_center',
      title: 'Loads',
      actions: this.loads,
    },
    {
      icon: 'font_download',
      title: 'Sections',
      actions: this.sections,
    },
    {
      icon: 'waves',
      title: 'Materials',
      actions: this.materials,
    },
    {
      icon: 'eject',
      title: 'Bearings',
      actions: this.bearings,
    },
    {
      icon: 'computer',
      title: 'Computations',
      actions: this.calculations,
    },
    {
      icon: 'visibility',
      title: 'Visuals',
      actions: this.visuals,
    },
    {
      icon: 'bar_chart',
      title: 'Actions',
      actions: this.actions,
    },
  ];

  check() {
    const points = this.$store.getters['svg/pointsCount'];
    const lines = this.$store.getters['svg/linesCount'];
    const result = lines >= points - 1;
    console.log('Valid: ', result);
  }

  handleMethodClick(methodType: MethodTypes) {
    this.$store.commit('changeMethod', methodType);
  }
}
</script>

