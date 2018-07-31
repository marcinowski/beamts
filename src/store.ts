import Vue from 'vue';
import Vuex from 'vuex';
import { Line, MethodTypes, Point } from './types/types';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    method: MethodTypes.CURSOR,
    lines: [
      {
        id: 0,
        p1: 1,
        p2: 2
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
    getMethod: (state): MethodTypes => state.method,
    getPoints: (state) => (ids: number[]): ReadonlyArray<Point> =>
      state.points.filter((p) => ids.includes(p.id)),
    getPoint: (state, getters) => (id: number): Point =>
      getters.getPoints([id]).pop(),
    getLines: (state) => (ids: number[]): ReadonlyArray<Line> =>
      state.lines.filter((l) => ids.includes(l.id)),
    getLine: (state, getters) => (id: number): Line =>
      getters.getLines([id]).pop(),
    getLinePoints: (state, getters) => (id: number): ReadonlyArray<Point> => {
      const line = getters.getLine(id);
      return getters.getPoints([line.p1, line.p2]);
    },
    getLinesConnectedToPoint: (state) => (id: number): ReadonlyArray<Line> =>
      state.lines.filter((l) => [l.p2, l.p1].includes(id)),
    getPointsInsideSelection: (state) => (
      x1: number,
      x2: number,
      y1: number,
      y2: number,
    ): ReadonlyArray<Point> =>
      state.points.filter(
        (p) => x1 <= p.cx && p.cx <= x2 && (y1 <= p.cy && p.cy <= y2),
      ),
  },
  mutations: {
    changeMethod(state, method: MethodTypes) {
      state.method = method;
    },
    addPoint(state, point: Point) {
      state.points.push(point);
    },
    addLine(state, line: Line) {
      state.lines.push(line);
    },
    removeLine(state, line: Line) {
      state.lines.splice(state.lines.map((l) => l.id).indexOf(line.id), 1);
    },
    removePoint(state, point: Point) {
      state.points.splice(state.points.map((l) => l.id).indexOf(point.id), 1);
    },
  },
  actions: {},
});
