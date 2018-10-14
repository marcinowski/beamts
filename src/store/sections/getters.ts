import { GetterTree } from 'vuex';
import { RootState } from '@/store/types';
import { SectionsState } from './types';

export const sectionsGetters: GetterTree<SectionsState, RootState> = {
  getAllSections: (state) => state.sections,
  getCurrentId: (state) => state.currentIndex,
  getNextId: (state) => state.currentIndex + 1,
};
