import { Module } from 'vuex';
import { RootState } from '../types';
import { MaterialsState } from './types';
import { materialsGetters } from './getters';
import { mutations } from './mutations';
import { actions } from './actions';

const state: MaterialsState = {
  currentIndex: 0,
  materials: [],
};

const namespaced: boolean = true;

export const materials: Module<MaterialsState, RootState> = {
  namespaced,
  state,
  getters: materialsGetters,
  mutations,
  actions,
};
