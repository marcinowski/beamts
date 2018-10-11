import { GetterTree } from 'vuex';
import { SvgState, UndoAction } from './types';
import { RootState } from '../types';
import { Point, Line } from '@/types/types';

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
    x1: number,
    x2: number,
    y1: number,
    y2: number,
    x: number,
    y: number,
  ): boolean => x1 <= x && x <= x2 && y1 <= y && y <= y2,
  getPointsInsideSelection: (state, self) => (
    x1: number,
    x2: number,
    y1: number,
    y2: number,
  ): ReadonlyArray<Point> =>
    state.points.filter((p) =>
      self.checkPointInsideSelection(x1, x2, y1, y2, p.x, p.y),
    ),
  getLinesInsideSelection: (state, self) => (
    x1: number,
    x2: number,
    y1: number,
    y2: number,
  ): ReadonlyArray<Line> =>
    state.lines.filter((line) => {
      const points = self.getPoints([line.p1, line.p2]);
      return (
        self.checkPointInsideSelection(
          x1,
          x2,
          y1,
          y2,
          points[0].x,
          points[0].y,
        ) &&
        self.checkPointInsideSelection(x1, x2, y1, y2, points[1].x, points[1].y)
      );
    }),
  getSelectedPoints: (state) => state.points.filter((p) => p.selected),
  getSelectedLines: (state) => state.lines.filter((l) => l.selected),
  getSelectedElements: (state, self) => ({
    lines: self.getSelectedLines,
    points: self.getSelectedPoints,
  }),
  getUndoAction: (state): UndoAction => state.undoAction,
};
