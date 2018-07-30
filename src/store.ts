import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    lines: [
      {
        id: 0,
        p1: 1,
        p2: 2,
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
  getters: {
    getPoints: (state) => (ids: number[]) =>
      state.points.filter((p) => ids.includes(p.id)),
    getPoint: (state, getters) => (id: number) => getters.getPoints([id]).pop(),
    getLines: (state) => (ids: number[]) =>
      state.lines.filter((l) => ids.includes(l.id)),
    getLine: (state, getters) => (id: number) => getters.getLines([id]).pop(),
    getLinePoints: (state, getters) => (id: number) => {
      const line = getters.getLine(id);
      return getters.getPoints([line.p1, line.p2]);
    },
    getLinesConnectedToPoint: (state) => (id: number) =>
      state.lines.filter((l) => [l.p2, l.p1].includes(id)),
    getPointsInsideSelection: (state) => (
      x1: number,
      x2: number,
      y1: number,
      y2: number,
    ) =>
      state.points.filter(
        (p) => x1 <= p.cx && p.cx <= x2 && (y1 <= p.cy && p.cy <= y2),
      ),
  },
  mutations: {
    addPoint(state, point) {
      state.points.push(point);
    },
    addLine(state, line) {
      state.lines.push(line);
    },
    removeLine(state, line) {
      state.lines.splice(state.lines.map((l) => l.id).indexOf(line.id), 1);
    },
    removePoint(state, point) {
      state.points.splice(state.points.map((l) => l.id).indexOf(point.id), 1);
    },
  },
  actions: {},
});
