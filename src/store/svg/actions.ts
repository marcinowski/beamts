import { ActionTree } from 'vuex';
import { SvgState } from './types';
import { RootState } from '../types';
import { Point, Coordinates, Line, Vector } from '@/types/types';

export const actions: ActionTree<SvgState, RootState> = {
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
};
