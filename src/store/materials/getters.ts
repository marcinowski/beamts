import { GetterTree } from 'vuex';
import { RootState } from '@/store/types';
import { MaterialsState } from './types';

export const materialsGetters: GetterTree<MaterialsState, RootState> = {
  getAllMaterials: (state) => state.materials,
  getCurrentId: (state) => state.currentIndex,
  getNextId: (state) => state.currentIndex + 1,
};
