import { MutationTree } from 'vuex';
import { SvgState, UndoAction } from './types';
import {
  Point,
  Coordinates,
  Line,
  Vector,
  Rotation,
  LineCoordinates,
  Arc,
} from '@/types/types';

export const mutations: MutationTree<SvgState> = {
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
  addArc(state, arc: Arc) {
    state.arcs.push(arc);
    state.undoAction = {
      action: 'removeArc',
      item: arc,
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
      action: 'addPoint',
      item: point,
    };
  },
  removeArc(state, arc: Arc) {
    state.arcs = [...state.arcs.filter((a) => a.id !== arc.id)];
    state.undoAction = {
      action: 'addArc',
      item: arc,
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
  rotateSelectedPoints(
    state,
    { points, rotation }: { points: Point[]; rotation: Rotation },
  ) {
    const selectedIds = points.map((p) => p.id);
    const otherPoints = state.points.filter((p) => !selectedIds.includes(p.id));
    const transformedPoints = points.map((p) => ({
      ...p,
      x:
        Math.cos(rotation.angle) * (p.x - rotation.origin.x) -
        Math.sin(rotation.angle) * (p.y - rotation.origin.y) +
        rotation.origin.x,
      y:
        Math.sin(rotation.angle) * (p.x - rotation.origin.x) +
        Math.cos(rotation.angle) * (p.y - rotation.origin.y) +
        rotation.origin.y,
    }));
    state.points = [...otherPoints, ...transformedPoints];
    const undoAction = {
      action: 'rotateSelectedPoints',
      item: {
        points: transformedPoints,
        rotation: { ...rotation, angle: -rotation.angle },
      },
    };
    state.undoAction = undoAction;
  },
  flipSelectedPoints(
    state,
    { points, line }: { points: Point[]; line: LineCoordinates },
  ) {
    const selectedIds = points.map((p) => p.id);
    const otherPoints = state.points.filter((p) => !selectedIds.includes(p.id));
    let transformedPoints;
    if (line.start.x === line.end.x) {
      transformedPoints = points.map((p) => ({
        ...p,
        x: 2 * line.start.x - p.x,
      }));
    } else {
      const a = (line.start.y - line.end.y) / (line.start.x - line.end.x);
      const b = line.start.y - a * line.start.x;
      transformedPoints = points.map((p) => {
        const d = (p.x + (p.y - b) * a) / (1 + a * a);
        return {
          ...p,
          x: 2 * d - p.x,
          y: 2 * d * a - p.y + 2 * b,
        };
      });
    }
    state.points = [...otherPoints, ...transformedPoints];
    const undoAction = {
      action: 'flipSelectedPoints',
      item: {
        points: transformedPoints,
        line,
      },
    };
    state.undoAction = undoAction;
  },
};
