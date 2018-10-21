import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';
import { RootState } from './types';
import { config } from './config';
import { helpers } from './helpers';
import { materials } from './materials';
import { sections } from './sections';
import { selection } from './selection';
import { svg } from './svg';
import { MethodTypes } from '@/types/types';

Vue.use(Vuex);

const store: StoreOptions<RootState> = {
  state: {
    method: MethodTypes.CURSOR,
  },
  modules: {
    config,
    helpers,
    materials,
    sections,
    selection,
    svg,
  },
  getters: {
    getMethod: (state): MethodTypes => state.method,
  },
  mutations: {
    changeMethod(state, method: MethodTypes) {
      state.method = method;
    },
  },
};

export default new Vuex.Store<RootState>(store);
