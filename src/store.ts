import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';
import {
  Line,
  MethodTypes,
  Point,
  Coordinates,
  Selection,
} from './types/types';

Vue.use(Vuex);

interface MyStore {
  method: MethodTypes;
  lines: Line[];
  points: Point[];
  selection: Selection;
}

const store: StoreOptions<MyStore> = {
  strict: true,
  state: {
    method: MethodTypes.CURSOR,
    lines: [],
    points: [],
    selection: {
      x: 0,
      y: 0,
      height: 0,
      width: 0,
    },
  },
  getters: {
    pointsCount: (state) => state.points.length,
    linesCount: (state) => state.lines.length,
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
        (p) => x1 <= p.x && p.x <= x2 && (y1 <= p.y && p.y <= y2),
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
    setSelectionOrigin(state, coords: Coordinates) {
      state.selection = { ...state.selection, x: coords.x, y: coords.y };
    },
    setSelectionDimensions(state, coords: Coordinates) {
      state.selection = {
        ...state.selection,
        width: coords.x,
        height: coords.y,
      };
    },
    clearSelection(state) {
      state.selection = { x: 0, y: 0, height: 0, width: 0 };
    },
    selectPoints(state, ids: Array<Point['id']>) {
      const selectedPoints = state.points.filter((p) => ids.includes(p.id));
      const otherPoints = state.points.filter((p) => !ids.includes(p.id));
      selectedPoints.forEach((p) => (p.selected = true));
      state.points = [...otherPoints, ...selectedPoints]; // my fault :(
    },
    deselectAllPoints(state) {
      const points = state.points;
      points.forEach((p) => Vue.set(p, 'selected', false));
      state.points = [...points];
    },
  },
  actions: {
    selectPointsInRange(context, points: [Coordinates, Coordinates]) {
      const [p1, p2] = points;
      const selectedPoints = context.getters
        .getPointsInsideSelection(p1.x, p2.x, p1.y, p2.y)
        .map((p: Point) => p.id);
      context.commit('selectPoints', selectedPoints);
    },
  },
};

export default new Vuex.Store<MyStore>(store);
