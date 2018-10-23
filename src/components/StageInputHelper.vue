<template>
  <div class="Helpers" v-if="helper.description">
    <p v-if="helper.description">{{ helper.description }}</p>
    <div v-if="helper.showInput" class="d-flex InputControl">
      <v-text-field
        label="Input"
        v-model="userInput"
      ></v-text-field>
      <v-btn v-on:click="handleSubmit" color="info">Submit</v-btn>
      <v-btn v-on:click="handleClose" color="warning">Close</v-btn>
    </div>
  </div>
</template>

<style scoped>
.Helpers {
  padding: 15px;
}
.InputControl {
  max-width: 360px;
}
</style>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { StageHelper, CustomEvent, EventTypes } from '@/types/types';
import { transformEventToCustomEvent } from '@/helpers/helpers';

@Component({})
export default class StageInputHelper extends Vue {
  userInput = '';

  get helper() {
    return this.$store.getters['helpers/getHelper'];
  }

  handleSubmit(event: MouseEvent) {
    const customEvent: CustomEvent = {
      ...transformEventToCustomEvent(event),
      sourceValue: this.userInput,
      type: EventTypes.SUBMITTED_HELPER,
    };
    this.$emit('helper-submission', customEvent);
  }

  handleClose() {
    this.$store.commit('helpers/clearHelper');
  }
}
</script>
