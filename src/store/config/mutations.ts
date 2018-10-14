import { MutationTree } from 'vuex';
import { ConfigState } from './types';

export const mutations: MutationTree<ConfigState> = {
  incrementZoom(state) {
    state.scale++;
  },
  decrementZoom(state) {
    state.scale--;
  },
};
