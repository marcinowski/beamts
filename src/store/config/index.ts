import { Module } from 'vuex';
import { RootState } from '../types';
import { ConfigState } from './types';
import { configGetters } from './getters';
import { mutations } from './mutations';

const state: ConfigState = {
  baseUnit: 5,
  scale: 10,
};

const namespaced: boolean = true;

export const config: Module<ConfigState, RootState> = {
  namespaced,
  state,
  getters: configGetters,
  mutations,
};
