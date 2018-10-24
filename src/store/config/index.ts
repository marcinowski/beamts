import { Module } from 'vuex';
import { RootState } from '../types';
import { ConfigState } from './types';
import { configGetters } from './getters';
import { mutations } from './mutations';

const state: ConfigState = {
  density: 6,
  unit: 10,
  scale: 1,
  gridOn: true,
};

const namespaced: boolean = true;

export const config: Module<ConfigState, RootState> = {
  namespaced,
  state,
  getters: configGetters,
  mutations,
};
