import { GetterTree } from 'vuex';
import { SvgState, UndoAction } from './types';
import { RootState } from '../types';
import {
  Point,
  Line,
  LineCoordinates,
  Coordinates,
  Arc,
  ObjectId,
} from '@/types/types';

export const svgGetters: GetterTree<SvgState, RootState> = {
  pointsCount: (state) => state.points.length,
  linesCount: (state) => state.lines.length,
  getAllArcs: (state) => state.arcs,
  getAllLines: (state) => state.lines,
  getAllPoints: (state) => state.points,
  getPoints: (state) => (ids: ObjectId[]): ReadonlyArray<Point> =>
    state.points.filter((p) => ids.includes(p.id)),
  getPoint: (state, getters) => (id: ObjectId): Point =>
    getters.getPoints([id]).pop(),
  getLines: (state) => (ids: ObjectId[]): ReadonlyArray<Line> =>
    state.lines.filter((l) => ids.includes(l.id)),
  getLine: (state, getters) => (id: ObjectId): Line =>
    getters.getLines([id]).pop(),
  getArcs: (state, getters) => (ids: ObjectId[]) =>
    state.arcs.filter((a) => ids.includes(a.id)),
  getArc: (state, getters) => (id: ObjectId): Arc =>
    getters.getArcs([id]).pop(),
  getLinePoints: (state, getters) => (id: ObjectId): ReadonlyArray<Point> => {
    const line = getters.getLine(id);
    return getters.getPoints([line.p1, line.p2]);
  },
  getLinesConnectedToPoint: (state) => (id: ObjectId): ReadonlyArray<Line> =>
    state.lines.filter((l) => [l.p2, l.p1].includes(id)),
  checkPointInsideSelection: () => (
    c: Coordinates,
    s: LineCoordinates,
  ): boolean =>
    s.start.x <= c.x && c.x <= s.end.x && s.start.y <= c.y && c.y <= s.end.y,
  getPointsInsideSelection: (state, getters) => (
    s: LineCoordinates,
  ): ReadonlyArray<Point> =>
    state.points.filter((p) =>
      getters.checkPointInsideSelection({ x: p.x, y: p.y }, s),
    ),
  getLinesInsideSelection: (state, getters) => (
    s: LineCoordinates,
  ): ReadonlyArray<Line> =>
    state.lines.filter((line) => {
      const points = getters.getPoints([line.p1, line.p2]);
      return (
        getters.checkPointInsideSelection(
          {
            x: points[0].x,
            y: points[0].y,
          },
          s,
        ) &&
        getters.checkPointInsideSelection({ x: points[1].x, y: points[1].y }, s)
      );
    }),
  getArcsInsideSelection: (state, getters) => (
    s: LineCoordinates,
  ): ReadonlyArray<Arc> =>
    state.arcs.filter((arc) => {
      const points = getters.getPoints([arc.p1, arc.p2]);
      return (
        getters.checkPointInsideSelection(
          {
            x: points[0].x,
            y: points[0].y,
          },
          s,
        ) &&
        getters.checkPointInsideSelection({ x: points[1].x, y: points[1].y }, s)
      );
    }),
  getSelectedPoints: (state) => state.points.filter((p) => p.selected),
  getSelectedLines: (state) => state.lines.filter((l) => l.selected),
  getSelectedArcs: (state) => state.arcs.filter((a) => a.selected),
  getUndoAction: (state): UndoAction => state.undoAction,
  getHelperLine: (state): LineCoordinates => state.helperLine,
};
