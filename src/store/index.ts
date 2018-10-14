import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';
import { RootState } from './types';
import { svg } from './svg/index';
import { config } from './config/index';
import { sections } from './sections/index';
import { selection } from './selection/index';
import { materials } from './materials/index';
import { MethodTypes } from '@/types/types';

Vue.use(Vuex);

const store: StoreOptions<RootState> = {
  state: {
    method: MethodTypes.CURSOR,
  },
  modules: {
    config,
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
