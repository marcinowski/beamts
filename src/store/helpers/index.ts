import { Module } from 'vuex';
import { RootState } from '../types';
import { StageHelper } from '@/types/types';

interface HelpersState {
  helper: StageHelper;
}

export const helpers: Module<HelpersState, RootState> = {
  namespaced: true,
  state: {
    helper: {},
  },
  getters: {
    getHelper: (state) => state.helper,
  },
  mutations: {
    addHelper: (state, helper: StageHelper) => (state.helper = helper),
    clearHelper: (state) => (state.helper = {}),
  },
};
