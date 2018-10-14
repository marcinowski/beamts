import { Module } from 'vuex';
import { RootState } from '../types';
import { SectionsState } from './types';
import { sectionsGetters } from './getters';
import { mutations } from './mutations';
import { actions } from './actions';

const state: SectionsState = {
  currentIndex: 0,
  sections: [],
};

const namespaced: boolean = true;

export const sections: Module<SectionsState, RootState> = {
  namespaced,
  state,
  getters: sectionsGetters,
  mutations,
  actions,
};
