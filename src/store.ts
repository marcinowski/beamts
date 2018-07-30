import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    lines: [
      {
        id: 0,
        x1: 300,
        x2: 200,
        y1: 300,
        y2: 300,
      },
    ],
    points: [
      {
        id: 1,
        cx: 300,
        cy: 300,
      },
      {
        id: 2,
        cx: 200,
        cy: 300,
      },
    ],
  },
  mutations: {},
  actions: {},
});
