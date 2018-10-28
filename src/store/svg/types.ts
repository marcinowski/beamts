import { Line, Point, Arc, LineCoordinates } from '@/types/types';

export interface UndoAction {
  action: string;
  item?: any;
  dispatch?: true;
}

export interface SvgState {
  arcs: Arc[];
  lines: Line[];
  points: Point[];
  undoAction: UndoAction;
  helperLine: LineCoordinates;
}
