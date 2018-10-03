import { Module } from 'vuex';
import { actions } from './actions';
import { getters } from './getters';
import { mutations } from './mutations';
import { SvgState } from './types';
import { RootState } from '../types';

export const state: SvgState = {
  lines: [],
  points: [],
  selection: {
    x: 0,
    y: 0,
    height: 0,
    width: 0,
  },
  undoAction: { action: 'removeAll' },
};

const namespaced: boolean = true;

export const svg: Module<SvgState, RootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations,
};
