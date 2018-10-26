<template>
  <v-app>
    <v-navigation-drawer
      persistent
      :mini-variant="miniVariant"
      enable-resize-watcher
      app
    >
      <SideOptions></SideOptions>
    </v-navigation-drawer>
    <v-toolbar
      app
    >
      <v-btn icon @click.stop="miniVariant = !miniVariant">
        <v-icon v-html="miniVariant ? 'chevron_right' : 'chevron_left'"></v-icon>
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
  miniVariant = false;
  rightDrawer = false;
  title = 'Beam';
}
</script>
