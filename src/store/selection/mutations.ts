import { MutationTree } from 'vuex';
import { SelectionState } from '@/store/selection/types';
import { Coordinates } from '@/types/types';

export const mutations: MutationTree<SelectionState> = {
  setSelectionOrigin(state, coords: Coordinates) {
    state.selection = { ...state.selection, x: coords.x, y: coords.y };
  },
  setSelectionDimensions(state, coords: Coordinates) {
    state.selection = {
      ...state.selection,
      width: coords.x,
      height: coords.y,
    };
  },
  clearSelection(state) {
    state.selection = { x: 0, y: 0, height: 0, width: 0 };
  },
};
