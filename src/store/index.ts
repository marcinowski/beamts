import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';
import { RootState } from './types';
import { svg } from './svg/index';
import { selection } from './selection/index';
import { MethodTypes } from '@/types/types';

Vue.use(Vuex);

const store: StoreOptions<RootState> = {
  state: {
    method: MethodTypes.CURSOR,
  },
  modules: {
    svg,
    selection,
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
