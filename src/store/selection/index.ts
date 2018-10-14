import { Module } from 'vuex';
import { RootState } from '../types';
import { SelectionState } from './types';
import { selectionGetters } from './getters';
import { mutations } from './mutations';

const state: SelectionState = {
  selection: {
    x: 0,
    y: 0,
    height: 0,
    width: 0,
  },
};

const namespaced: boolean = true;

export const selection: Module<SelectionState, RootState> = {
  namespaced,
  state,
  getters: selectionGetters,
  mutations,
};
