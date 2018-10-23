import { ActionTree } from 'vuex';
import { SvgState } from './types';
import { RootState } from '../types';
import {
  Point,
  Coordinates,
  Line,
  Rotation,
  Vector,
  LineCoordinates,
  Arc,
  ObjectId,
} from '@/types/types';

export const actions: ActionTree<SvgState, RootState> = {
  selectPoints(context, ids: ObjectId[]) {
    context.commit('changeSelectionStatePoints', { ids, selected: true });
  },
  deselectPoints(context, ids: ObjectId[]) {
    context.commit('changeSelectionStatePoints', { ids, selected: true });
  },
  selectLines(context, ids: ObjectId[]) {
    context.commit('changeSelectionStateLines', { ids, selected: true });
  },
  deselectLines(context, ids: ObjectId[]) {
    context.commit('changeSelectionStateLines', { ids, selected: false });
  },
  selectArcs(context, ids: ObjectId[]) {
    context.commit('changeSelectionStateArcs', { ids, selected: true });
  },
  deselectArcs(context, ids: ObjectId[]) {
    context.commit('changeSelectionStateArcs', { ids, selected: false });
  },
  selectObjects(context, ids: ObjectId[]) {
    context.dispatch('selectPoints', ids);
    context.dispatch('selectLines', ids);
    context.dispatch('selectArcs', ids);
  },
  deselectObjects(context, ids: ObjectId[]) {
    context.dispatch('deselectPoints', ids);
    context.dispatch('deselectLines', ids);
  },
  selectPointsInRange(context, points: LineCoordinates) {
    const selectedPoints = context.getters
      .getPointsInsideSelection(points)
      .map((p: Point) => p.id);
    context.dispatch('selectPoints', selectedPoints);
  },
  deselectPointsInRange(context, points: LineCoordinates) {
    const selectedPoints = context.getters
      .getPointsInsideSelection(points)
      .map((p: Point) => p.id);
    context.dispatch('deselectPoints', selectedPoints);
  },
  selectLinesInRange(context, points: LineCoordinates) {
    const selectedLines = context.getters
      .getLinesInsideSelection(points)
      .map((l: Line) => l.id);
    context.dispatch('selectLines', selectedLines);
  },
  selectArcsInRange(context, points: LineCoordinates) {
    const selectedArcs = context.getters
      .getArcsInsideSelection(points)
      .map((a: Arc) => a.id);
    context.dispatch('selectArcs', selectedArcs);
  },
  selectObjectsInRange(context, points: LineCoordinates) {
    context.dispatch('selectArcsInRange', points);
    context.dispatch('selectLinesInRange', points);
    context.dispatch('selectPointsInRange', points);
  },
  changeSelectionStateAll(context, selected: boolean) {
    context.commit('changeSelectionStateAllPoints', selected);
    context.commit('changeSelectionStateAllLines', selected);
    context.commit('changeSelectionStateAllArcs', selected);
  },
  selectAll(context) {
    context.dispatch('changeSelectionStateAll', true);
  },
  deselectAll(context) {
    context.dispatch('changeSelectionStateAll', false);
  },
  restoreSelected(
    context,
    { arcs, lines, points }: { arcs: Arc[]; points: Point[]; lines: Line[] },
  ) {
    context.commit('restoreLines', lines);
    context.commit('restorePoints', points);
    context.commit('restoreArcs', arcs);
    const undoAction = {
      action: 'removeSelected', // not atomic, this should be more stateless
      dispatch: true,
    };
    context.commit('addUndoAction', undoAction);
  },
  removeSelected(context) {
    const arcs = context.getters.getSelectedArcs;
    context.commit('removeSelectedArcs', arcs);
    const lines = context.getters.getSelectedLines;
    context.commit('removeSelectedLines', lines);
    const points = context.getters.getSelectedPoints.filter(
      (point: Point) =>
        context.getters.getLinesConnectedToPoint(point.id).length === 0,
    );
    context.commit('removeSelectedPoints', points.map((p: Point) => p.id));
    const undoAction = {
      action: 'restoreSelected',
      item: { arcs, lines, points },
      dispatch: true,
    };
    context.commit('addUndoAction', undoAction);
  },
  moveSelectedPoints(context, vector: Vector) {
    const points = context.getters.getSelectedPoints;
    context.commit('moveSelectedPoints', { points, vector });
  },
  rotateSelectedPoints(context, rotation: Rotation) {
    const points = context.getters.getSelectedPoints;
    context.commit('rotateSelectedPoints', { points, rotation });
  },
  flipSelectedPoints(context, line: LineCoordinates) {
    const points = context.getters.getSelectedPoints;
    context.commit('flipSelectedPoints', { points, line });
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
