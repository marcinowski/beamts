import Vue from 'vue';
import Vuex, { StoreOptions, Store } from 'vuex';
import {
  Coordinates,
  Line,
  MethodTypes,
  Point,
  Selection,
  Vector,
} from '@/types/types';

Vue.use(Vuex);

interface UndoAction {
  action: string;
  item?: any;
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
    getSelection: (state) => state.selection,
    getAllPoints: (state) => state.points,
    getAllLines: (state) => state.lines,
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
    checkPointInsideSelection: () => (
      x1: number,
      x2: number,
      y1: number,
      y2: number,
      x: number,
      y: number,
    ): boolean => x1 <= x && x <= x2 && y1 <= y && y <= y2,
    getPointsInsideSelection: (state, getters) => (
      x1: number,
      x2: number,
      y1: number,
      y2: number,
    ): ReadonlyArray<Point> =>
      state.points.filter((p) =>
        getters.checkPointInsideSelection(x1, x2, y1, y2, p.x, p.y),
      ),
    getLinesInsideSelection: (state, getters) => (
      x1: number,
      x2: number,
      y1: number,
      y2: number,
    ): ReadonlyArray<Line> =>
      state.lines.filter((line) => {
        const points = getters.getPoints([line.p1, line.p2]);
        return (
          getters.checkPointInsideSelection(
            x1,
            x2,
            y1,
            y2,
            points[0].x,
            points[0].y,
          ) &&
          getters.checkPointInsideSelection(
            x1,
            x2,
            y1,
            y2,
            points[1].x,
            points[1].y,
          )
        );
      }),
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
    addUndoAction(state, undoAction: UndoAction) {
      state.undoAction = undoAction;
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
      state.points =
        state.undoAction.item && 'points' in state.undoAction.item
          ? [...state.undoAction.item.points]
          : [];
      state.lines =
        state.undoAction.item && 'lines' in state.undoAction.item
          ? [...state.undoAction.item.lines]
          : [];
      state.undoAction = { action: 'removeAll' };
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
    removeSelectedPoints(state, ids: Array<Point['id']>) {
      const selectedPoints = state.points.filter((p) => ids.includes(p.id));
      const otherPoints = state.points.filter((p) => !ids.includes(p.id));
      state.points = [...otherPoints];
      state.undoAction = {
        action: 'addPoints',
        item: selectedPoints,
      };
    },
    removeSelectedLines(state, ids: Array<Point['id']>) {
      const selectedLines = state.lines.filter(
        (l) => ids.includes(l.p1) && ids.includes(l.p2),
      );
      const otherLines = state.lines.filter(
        (l) => !ids.includes(l.p1) || !ids.includes(l.p2),
      );
      state.lines = [...otherLines];
      state.undoAction = {
        action: 'addLines',
        item: selectedLines,
      };
    },
    restorePoints(state, points: Point[]) {
      state.points = [...state.points, ...points];
      state.undoAction = {
        action: 'removeSelectedPoints',
        item: points.map((p) => p.id),
      };
    },
    restoreLines(state, lines: Line[]) {
      state.lines = [...state.lines, ...lines];
      const points = lines
        .map((l: Line) => [l.p1, l.p2])
        .reduce((acc: number[], val: number[]) => acc.concat(val), []);
      state.undoAction = {
        action: 'removeSelectedLines',
        item: [...points],
      };
    },
    moveSelectedPoints(
      state,
      { points, vector }: { points: Point[]; vector: Vector },
    ) {
      const selectedIds = points.map((p) => p.id);
      const otherPoints = state.points.filter((p) => !selectedIds.includes(p.id));
      const transformedPoints = points.map((p) => ({
        ...p,
        x: p.x + vector.x,
        y: p.y + vector.y,
      }));
      state.points = [...otherPoints, ...transformedPoints];
      const undoAction = {
        action: 'moveSelectedPoints',
        item: {
          points: transformedPoints,
          vector: { x: -vector.x, y: -vector.y },
        },
      };
      state.undoAction = undoAction;
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
    selectLinesInRange(context, points: [Coordinates, Coordinates]) {
      const [p1, p2] = points;
      const selectedPoints = context.getters
        .getLinesInsideSelection(p1.x, p2.x, p1.y, p2.y)
        .map((l: Line) => [l.p1, l.p2])
        .reduce((acc: number[], val: number[]) => acc.concat(val), []);
      context.dispatch('selectLines', selectedPoints);
    },
    selectObjectsInRange(context, points: [Coordinates, Coordinates]) {
      context.dispatch('selectPointsInRange', points);
      context.dispatch('selectLinesInRange', points);
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
    restoreSelected(
      context,
      { points, lines }: { points: Point[]; lines: Line[] },
    ) {
      context.commit('restoreLines', lines);
      context.commit('restorePoints', points);
      const undoAction = {
        action: 'removeSelected',
        dispatch: true,
      };
      context.commit('addUndoAction', undoAction);
    },
    removeSelected(context) {
      const lines = context.getters.getSelectedLines;
      context.commit(
        'removeSelectedLines',
        lines
          .map((l: Line) => [l.p1, l.p2])
          .reduce((acc: number[], val: number[]) => acc.concat(val), []),
      );
      const points = context.getters.getSelectedPoints.filter(
        (point: Point) =>
          context.getters.getLinesConnectedToPoint(point.id).length === 0,
      );
      context.commit('removeSelectedPoints', points.map((p: Point) => p.id));
      const undoAction = {
        action: 'restoreSelected',
        item: { points, lines },
        dispatch: true,
      };
      context.commit('addUndoAction', undoAction);
    },
    moveSelectedPoints(context, vector: Vector) {
      const selectedPoints = context.getters.getSelectedPoints;
      context.commit('moveSelectedPoints', { points: selectedPoints, vector });
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
