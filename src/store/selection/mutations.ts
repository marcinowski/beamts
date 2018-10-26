import { MutationTree } from 'vuex';
import { SelectionState } from '@/store/selection/types';
import { Coordinates } from '@/types/types';

export const mutations: MutationTree<SelectionState> = {
  setSelectionStart(state, coords: Coordinates) {
    state.start = coords;
  },
  setSelectionEnd(state, coords: Coordinates) {
    state.end = coords;
  },
  clearSelection(state) {
    state.start = state.end = { x: 0, y: 0 };
  },
};
