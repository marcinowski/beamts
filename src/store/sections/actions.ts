import { ActionTree } from 'vuex';
import { SectionsState } from './types';
import { RootState } from '@/store/types';
import { Section } from '@/types/types';

export const actions: ActionTree<SectionsState, RootState> = {
  addSection(context, section: Section) {
    const id = context.getters.getNextId;
    context.commit('addSection', { ...section, id });
  },
};
