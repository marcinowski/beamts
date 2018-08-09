<template>
  <v-app>
    <v-navigation-drawer
      persistent
      :mini-variant="miniVariant"
      :clipped="clipped"
      v-model="drawer"
      enable-resize-watcher
      fixed
      app
    >
      <SideOptions></SideOptions>
    </v-navigation-drawer>
    <v-toolbar
      app
      :clipped-left="clipped"
    >
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-btn icon @click.stop="miniVariant = !miniVariant">
        <v-icon v-html="miniVariant ? 'chevron_right' : 'chevron_left'"></v-icon>
      </v-btn>
      <v-btn icon @click.stop="clipped = !clipped">
        <v-icon>web</v-icon>
      </v-btn>
      <v-btn icon @click.stop="fixed = !fixed">
        <v-icon>remove</v-icon>
      </v-btn>
      <v-toolbar-title v-text="title"></v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click.stop="rightDrawer = !rightDrawer">
        <v-icon>menu</v-icon>
      </v-btn>
    </v-toolbar>
    <svg-component>
    </svg-component>
    <v-navigation-drawer
      :right="true"
      v-model="rightDrawer"
      fixed
      app
    >
      <RightDrawer>
      </RightDrawer>
    </v-navigation-drawer>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import SideOptions from './components/SideOptions.vue';
import SvgComponent from './components/SvgComponent.vue';
import RightDrawer from './components/RightDrawer.vue';

@Component({
  components: {
    SvgComponent,
    SideOptions,
    RightDrawer,
  },
})
export default class App extends Vue {
  clipped = false;
  drawer = true;
  fixed = false;
  miniVariant = false;
  rightDrawer = false;
  title = 'Beam';
}
</script>
