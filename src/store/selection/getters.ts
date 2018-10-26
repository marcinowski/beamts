import { GetterTree } from 'vuex';
import { RootState } from '@/store/types';
import { SelectionState } from './types';
import { LineCoordinates } from '@/types/types';

export const selectionGetters: GetterTree<SelectionState, RootState> = {
  getSelection: (state): LineCoordinates => state,
};
