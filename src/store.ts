import Vue from 'vue';
import Vuex, { StoreOptions, Store } from 'vuex';
import {
  Line,
  MethodTypes,
  Point,
  Coordinates,
  Selection,
} from './types/types';

Vue.use(Vuex);

interface UndoAction {
  action: string;
  item?: Line[] | Point[] | Point | Line | { lines: Line[]; points: Point[] };
  dispatch?: true;
}

interface MyStore {
  method: MethodTypes;
  lines: Line[];
  points: Point[];
  selection: Selection;
  undoAction: UndoAction;
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
    undoAction: { action: 'removeAll' },
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
    getSelectedPoints: (state) => state.points.filter((p) => p.selected),
    getSelectedLines: (state) => state.lines.filter((l) => l.selected),
    getSelectedElements: (state, getters) => ({
      lines: getters.getSelectedLines,
      points: getters.getSelectedPoints,
    }),
    getUndoAction: (state): UndoAction => state.undoAction,
  },
  mutations: {
    changeMethod(state, method: MethodTypes) {
      state.method = method;
    },
    addPoint(state, point: Point) {
      state.points.push(point);
      state.undoAction = {
        action: 'removePoint',
        item: point,
      };
    },
    addLine(state, line: Line) {
      state.lines.push(line);
      state.undoAction = {
        action: 'removeLine',
        item: line,
      };
    },
    removeLine(state, line: Line) {
      state.lines = [...state.lines.filter((l) => l.id !== line.id)];
      state.undoAction = {
        action: 'addLine',
        item: line,
      };
    },
    removePoint(state, point: Point) {
      state.points = [...state.points.filter((p) => p.id !== point.id)];
      state.undoAction = {
        action: 'removePoint',
        item: point,
      };
    },
    removeAll(state) {
      state.undoAction = {
        action: 'restoreAll',
        item: {
          lines: state.lines,
          points: state.points,
        },
      };
      state.points = [];
      state.lines = [];
    },
    restoreAll(state) {
      state.undoAction = { action: 'removeAll' };
      state.points =
        state.undoAction.item && 'points' in state.undoAction.item
          ? state.undoAction.item.points
          : [];
      state.lines =
        state.undoAction.item && 'lines' in state.undoAction.item
          ? state.undoAction.item.lines
          : [];
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
    changeSelectionStatePoints(
      state,
      {
        ids,
        selected,
      }: {
        ids: Array<Point['id']>;
        selected: boolean;
      },
    ) {
      const selectedPoints = state.points
        .filter((p) => ids.includes(p.id))
        .map((p) => ({ ...p, selected }));
      const otherPoints = state.points.filter((p) => !ids.includes(p.id));
      state.points = [...otherPoints, ...selectedPoints]; // my fault :(
    },
    changeSelectionStateLines(
      state,
      {
        ids,
        selected,
      }: {
        ids: Array<Point['id']>;
        selected: boolean;
      },
    ) {
      const selectedLines = state.lines
        .filter((l) => ids.includes(l.p1) && ids.includes(l.p2))
        .map((l) => ({ ...l, selected }));
      const otherLines = state.lines.filter(
        (l) => !ids.includes(l.p1) || !ids.includes(l.p2),
      );
      state.lines = [...selectedLines, ...otherLines];
    },
    changeSelectionStateAllPoints(state, selected: boolean) {
      state.points = [...state.points.map((p) => ({ ...p, selected }))];
    },
    changeSelectionStateAllLines(state, selected: boolean) {
      state.lines = [...state.lines.map((l) => ({ ...l, selected }))];
    },
  },
  actions: {
    selectPoints(context, ids: Array<Point['id']>) {
      context.commit('changeSelectionStatePoints', { ids, selected: true });
    },
    deselectPoints(context, ids: Array<Point['id']>) {
      context.commit('changeSelectionStatePoints', { ids, selected: true });
    },
    selectLines(context, ids: Array<Point['id']>) {
      context.commit('changeSelectionStateLines', { ids, selected: true });
    },
    deselectLines(context, ids: Array<Point['id']>) {
      context.commit('changeSelectionStateLines', { ids, selected: false });
    },
    selectObjects(context, ids: Array<Point['id']>) {
      context.dispatch('selectPoints', ids);
      context.dispatch('selectLines', ids);
    },
    deselectObjects(context, ids: Array<Point['id']>) {
      context.dispatch('deselectPoints', ids);
      context.dispatch('deselectLines', ids);
    },
    selectPointsInRange(context, points: [Coordinates, Coordinates]) {
      const [p1, p2] = points;
      const selectedPoints = context.getters
        .getPointsInsideSelection(p1.x, p2.x, p1.y, p2.y)
        .map((p: Point) => p.id);
      context.dispatch('selectPoints', selectedPoints);
    },
    deselectPointsInRange(context, points: [Coordinates, Coordinates]) {
      const [p1, p2] = points;
      const selectedPoints = context.getters
        .getPointsInsideSelection(p1.x, p2.x, p1.y, p2.y)
        .map((p: Point) => p.id);
      context.dispatch('deselectPoints', selectedPoints);
    },
    changeSelectionStateAll(context, selected: boolean) {
      context.commit('changeSelectionStateAllPoints', selected);
      context.commit('changeSelectionStateAllLines', selected);
    },
    selectAll(context) {
      context.dispatch('changeSelectionStateAll', true);
    },
    deselectAll(context) {
      context.dispatch('changeSelectionStateAll', false);
    },
    undo(context) {
      const action = context.getters.getUndoAction;
      if (action.dispatch) {
        context.dispatch(action.action, action.item);
      } else {
        context.commit(action.action, action.item);
      }
    },
  },
};

export default new Vuex.Store<MyStore>(store);
