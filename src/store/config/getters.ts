import { GetterTree } from 'vuex';
import { RootState } from '@/store/types';
import { ConfigState } from './types';

export const configGetters: GetterTree<ConfigState, RootState> = {
  getScaledDensity: (state) => state.scale * state.density,
  getScaledUnit: (state) => state.scale * state.density * state.unit,
  isGridOn: (state) => state.gridOn,
  isContinuousLine: (state) => state.continuousLine,
  isOrthogonalMode: (state) => state.orthogonalMode,
  isHelpersOn: (state) => state.helpersOn,
};
