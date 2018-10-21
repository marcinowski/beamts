import { GetterTree } from 'vuex';
import { RootState } from '@/store/types';
import { ConfigState } from './types';

export const configGetters: GetterTree<ConfigState, RootState> = {
  getBaseUnit: (state) => state.baseUnit,
  getScale: (state) => state.scale,
  getUnit: (state) => state.scale * state.baseUnit,
  isGridOn: (state) => state.gridOn,
};
