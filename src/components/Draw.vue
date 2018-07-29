<template>
  <v-container fluid>
    <svg
      id="svg"
      ref="svg"
      width="600"
      height="600"
      style="border: 2px solid black;"
    ></svg>
  </v-container>
</template>

<script>
import Vue from "vue";
import methodsMixin from "@/mixins/methods.mixin";

export default Vue.component("Draw", {
  props: ["method"],
  mounted() {
    this.svg = this.$refs.svg;
    this.events = [];
  },
  mixins: [methodsMixin],
  watch: {
    method: {
      handler: function(newVal) {
        this.handleMethod(newVal);
      }
    }
  }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
