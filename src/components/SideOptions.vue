<template>
  <div class="SideOptions">
    <v-list>
      <v-list-tile
        value="true"
        v-for="item in methods"
        :key="item.type"
        @click="handleClick(item)"
      >
        <v-list-tile-action>
          <v-icon v-html="item.icon"></v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title v-text="item.title"></v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-divider></v-divider>
    </v-list>
    <span>&copy; 2018</span>
  </div>
</template>

<style lang="scss" scoped>
.SideOptions {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  // flex: 1 1 100%;
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
  type: MethodTypes;
}

@Component({})
export default class SideOptions extends Vue {
  methods: Method[] = [
    {
      icon: 'near_me',
      title: 'Cursor',
      type: MethodTypes.CURSOR,
    },
    {
      icon: 'tab_unselected',
      title: 'Select',
      type: MethodTypes.SELECTION,
    },
    {
      icon: 'scatter_plot',
      title: 'Points',
      type: MethodTypes.POINT,
    },
    {
      icon: 'show_chart',
      title: 'Line',
      type: MethodTypes.LINE,
    },
  ];

  handleClick(item: Method) {
    this.$store.commit('changeMethod', item.type);
  }
}
</script>

