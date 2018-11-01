import { Module } from 'vuex';
import { actions } from './actions';
import { svgGetters } from './getters';
import { mutations } from './mutations';
import { SvgState } from './types';
import { RootState } from '../types';

export const state: SvgState = {
  arcs: [],
  lines: [],
  points: [],
  undoAction: { action: 'removeAll' },
  helperLine: {
    start: {
      x: 0,
      y: 0,
    },
    end: {
      x: 0,
      y: 0,
    },
  },
  helperArc: {
    start: {
      x: 0,
      y: 0,
    },
    end: {
      x: 0,
      y: 0,
    },
    radius: 1,
    xAxisRotation: 0,
    sweep: 0,
    largeArc: 0,
  },
};

const namespaced: boolean = true;

export const svg: Module<SvgState, RootState> = {
  namespaced,
  state,
  getters: svgGetters,
  actions,
  mutations,
};
