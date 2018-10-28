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
        <template v-for="item in group.actions">
          <v-tooltip
            right
            :key="item.title"
          >
            <v-list-tile
              slot="activator"
              @click="item.onClick()"
            >
              <v-list-tile-action>
                <v-icon v-html="item.icon"></v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title v-text="item.title"></v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <span>{{ item.tooltip }}</span>
          </v-tooltip>
        </template>
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
  tooltip: string;
  onClick: () => void;
}

@Component({})
export default class SideOptions extends Vue {
  methods: Method[] = [
    {
      icon: 'near_me',
      title: 'Cursor',
      tooltip: 'Point objects',
      onClick: () => this.handleMethodClick(MethodTypes.CURSOR),
    },
    {
      icon: 'scatter_plot',
      title: 'Points',
      tooltip: 'Draw points',
      onClick: () => this.handleMethodClick(MethodTypes.POINT),
    },
    {
      icon: 'show_chart',
      title: 'Line',
      tooltip: 'Draw lines',
      onClick: () => this.handleMethodClick(MethodTypes.LINE),
    },
    {
      icon: 'wifi_tethering',
      title: 'Arc',
      tooltip: 'Draw arcs',
      onClick: () => this.handleMethodClick(MethodTypes.ARC),
    },
    {
      icon: 'tab_unselected',
      title: 'Select',
      tooltip: 'Select objects',
      onClick: () => this.handleMethodClick(MethodTypes.SELECTION),
    },
    {
      icon: 'open_with',
      title: 'Move',
      tooltip: 'Move selected objects',
      onClick: () => this.handleMethodClick(MethodTypes.MOVE),
    },
    {
      icon: 'rotate_right',
      title: 'Rotate',
      tooltip: 'Rotate selected objects',
      onClick: () => this.handleMethodClick(MethodTypes.ROTATE),
    },
    {
      icon: 'flip',
      title: 'Flip',
      tooltip: 'Flip selected objects against a line',
      onClick: () => this.handleMethodClick(MethodTypes.FLIP),
    },
    {
      icon: 'straighten',
      title: 'Measure',
      tooltip: 'Measure selected objects',
      onClick: () => console.log('Measure'),
    },
  ];

  sections: Method[] = [
    {
      icon: 'spellcheck',
      title: 'Assign Section',
      tooltip: 'Assign section',
      onClick: () => console.log('sections'),
    },
    {
      icon: 'edit',
      title: 'Edit Sections',
      tooltip: 'Edit sections',
      onClick: () => console.log('edit sections'),
    },
  ];

  materials: Method[] = [
    {
      icon: 'check_circle',
      title: 'Assign Material',
      tooltip: 'Assign material',
      onClick: () => console.log('materials'),
    },
    {
      icon: 'edit',
      title: 'Edit Materials',
      tooltip: 'Edit materials',
      onClick: () => console.log('edit materials'),
    },
  ];

  loads: Method[] = [
    {
      icon: 'vertical_align_bottom',
      title: 'Force',
      tooltip: 'Add a force',
      onClick: () => console.log('force'),
    },
    {
      icon: 'replay',
      title: 'Momentum',
      tooltip: 'Add a momentum',
      onClick: () => console.log('momentum'),
    },
    {
      icon: 'power_input',
      title: 'Load',
      tooltip: 'Add load',
      onClick: () => console.log('load'),
    },
  ];

  bearings: Method[] = [
    {
      icon: 'center_focus_strong',
      title: 'Full',
      tooltip: 'Add full bearing',
      onClick: () => console.log('Full Bearing'),
    },
    {
      icon: 'change_history',
      title: 'Bearing',
      tooltip: 'Add partial bearing',
      onClick: () => console.log('Bearing'),
    },
    {
      icon: 'eject',
      title: 'Loose Bearing',
      tooltip: 'Add loose bearing',
      onClick: () => console.log('Loose Bearing'),
    },
    {
      icon: 'category',
      title: 'Custom',
      tooltip: 'Add custom bearing',
      onClick: () => console.log('Custom Bearing'),
    },
  ];

  calculations: Method[] = [
    {
      icon: 'check',
      title: 'Check',
      tooltip: 'Check the construction',
      onClick: () => this.check(),
    },
    {
      icon: 'perm_data_settings',
      title: 'Calculate',
      tooltip: 'Start calculations',
      onClick: () => console.log('Calculate'),
    },
  ];

  visuals: Method[] = [
    {
      icon: 'adjust',
      title: 'Center',
      tooltip: 'Center the viewport',
      onClick: () => console.log('Center'),
    },
    {
      icon: 'border_all',
      title: 'Show Grid',
      tooltip: 'Show grid lines',
      onClick: () => this.$store.commit('config/toggleGrid'),
    },
    {
      icon: 'zoom_in',
      title: 'Zoom in',
      tooltip: 'Zoom in the workspace',
      onClick: () => this.$store.commit('config/incrementZoom'),
    },
    {
      icon: 'zoom_out',
      title: 'Zoom out',
      tooltip: 'Zoom out the workspace',
      onClick: () => this.$store.commit('config/decrementZoom'),
    },
  ];

  actions: Method[] = [
    {
      icon: 'edit',
      title: 'Edit',
      tooltip: 'Edit elements',
      onClick: () => console.log('Edit'),
    },
    {
      icon: 'done_all',
      title: 'Select All',
      tooltip: 'Select all objects',
      onClick: () => this.$store.dispatch('svg/selectAll'),
    },
    {
      icon: 'group_work',
      title: 'Group',
      tooltip: 'Group selected objects',
      onClick: () => console.log('Group'),
    },
    {
      icon: 'file_copy',
      title: 'Copy',
      tooltip: 'Copy selected objects',
      onClick: () => console.log('Copy'),
    },
    {
      icon: 'insert_drive_file',
      title: 'Paste',
      tooltip: 'Paste copied objects',
      onClick: () => console.log('Paste'),
    },
    {
      icon: 'undo',
      title: 'Undo',
      tooltip: 'Undo last action',
      onClick: () => this.$store.dispatch('svg/undo'),
    },
    {
      icon: 'clear',
      title: 'Clear Selected',
      tooltip: 'Remove selected objects',
      onClick: () => this.$store.dispatch('svg/removeSelected'),
    },
    {
      icon: 'delete_forever',
      title: 'Clear All',
      tooltip: 'Remove all objects',
      onClick: () => this.$store.commit('svg/removeAll'),
    },
    {
      icon: 'backup',
      title: 'Save',
      tooltip: 'Save session',
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

