import { GetterTree } from 'vuex';
import { RootState } from '@/store/types';
import { SelectionState } from './types';

export const selectionGetters: GetterTree<SelectionState, RootState> = {
  getSelection: (state) => state.selection,
};
