<template>
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
  </v-list>
</template>

<script>
import Vue from "vue";
import methodsMixin from "@/mixins/methods.mixin";
import { MethodTypes } from "@/types/types";

export default Vue.component("SideOptions", {
  methods: {
    handleClick(item) {
      this.$store.commit("changeMethod", item.type);
    }
  },
  data() {
    return {
      methods: [
        {
          icon: "near_me",
          title: "Cursor",
          type: MethodTypes.CURSOR
        },
        {
          icon: "tab_unselected",
          title: "Select",
          type: MethodTypes.SELECTION
        },
        {
          icon: "scatter_plot",
          title: "Points",
          type: MethodTypes.POINT
        },
        {
          icon: "show_chart",
          title: "Line",
          type: MethodTypes.RECTANGLE
        }
      ]
    };
  }
});
</script>

<style lang="scss" scoped>
</style>
