import { MutationTree } from 'vuex';
import { ConfigState } from './types';

export const mutations: MutationTree<ConfigState> = {
  incrementZoom(state) {
    state.scale *= 2;
  },
  decrementZoom(state) {
    state.scale /= 2;
  },
  toggleGrid(state) {
    state.gridOn = !state.gridOn;
  },
};
