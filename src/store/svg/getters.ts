import { GetterTree } from 'vuex';
import { SvgState, UndoAction } from './types';
import { RootState } from '../types';
import { Point, Line, LineCoordinates, Coordinates, Arc } from '@/types/types';

/**
 * Note that 'self' is just a self reference to 'getters' object
 */
export const getters: GetterTree<SvgState, RootState> = {
  pointsCount: (state) => state.points.length,
  linesCount: (state) => state.lines.length,
  getSelection: (state) => state.selection,
  getAllArcs: (state) => state.arcs,
  getAllLines: (state) => state.lines,
  getAllPoints: (state) => state.points,
  getPoints: (state) => (ids: number[]): ReadonlyArray<Point> =>
    state.points.filter((p) => ids.includes(p.id)),
  getPoint: (state, self) => (id: number): Point => self.getPoints([id]).pop(),
  getLines: (state) => (ids: number[]): ReadonlyArray<Line> =>
    state.lines.filter((l) => ids.includes(l.id)),
  getLine: (state, self) => (id: number): Line => self.getLines([id]).pop(),
  getLinePoints: (state, self) => (id: number): ReadonlyArray<Point> => {
    const line = self.getLine(id);
    return self.getPoints([line.p1, line.p2]);
  },
  getLinesConnectedToPoint: (state) => (id: number): ReadonlyArray<Line> =>
    state.lines.filter((l) => [l.p2, l.p1].includes(id)),
  checkPointInsideSelection: () => (
    s: LineCoordinates,
    c: Coordinates,
  ): boolean =>
    s.start.x <= c.x && c.x <= s.end.x && s.start.y <= c.y && c.y <= s.end.y,
  getPointsInsideSelection: (state, self) => (
    s: LineCoordinates,
  ): ReadonlyArray<Point> =>
    state.points.filter((p) =>
      self.checkPointInsideSelection(s, { x: p.x, y: p.y }),
    ),
  getLinesInsideSelection: (state, self) => (
    s: LineCoordinates,
  ): ReadonlyArray<Line> =>
    state.lines.filter((line) => {
      const points = self.getPoints([line.p1, line.p2]);
      return (
        self.checkPointInsideSelection(s, {
          x: points[0].x,
          y: points[0].y,
        }) &&
        self.checkPointInsideSelection(s, { x: points[1].x, y: points[1].y })
      );
    }),
  getArcsInsideSelection: (state, self) => (
    s: LineCoordinates,
  ): ReadonlyArray<Arc> =>
    state.arcs.filter((arc) => {
      const points = self.getPoints([arc.p1, arc.p2]);
      return (
        self.checkPointInsideSelection(s, {
          x: points[0].x,
          y: points[0].y,
        }) &&
        self.checkPointInsideSelection(s, { x: points[1].x, y: points[1].y })
      );
    }),
  getSelectedPoints: (state) => state.points.filter((p) => p.selected),
  getSelectedLines: (state) => state.lines.filter((l) => l.selected),
  getSelectedArcs: (state) => state.arcs.filter((a) => a.selected),
  getSelectedElements: (state, self) => ({
    lines: self.getSelectedLines,
    points: self.getSelectedPoints,
  }),
  getUndoAction: (state): UndoAction => state.undoAction,
};
