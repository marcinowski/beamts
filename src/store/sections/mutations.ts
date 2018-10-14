import { MutationTree } from 'vuex';
import { SectionsState } from './types';

export const mutations: MutationTree<SectionsState> = {
  addSection(state, section) {
    state.sections.push(section);
    state.currentIndex++;
  },
  removeSection(state, section) {
    state.sections = [...state.sections.filter((s) => s.id !== section.id)];
  },
};
