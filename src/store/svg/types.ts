import { Line, Point, Selection, Arc } from '@/types/types';

export interface UndoAction {
  action: string;
  item?: any;
  dispatch?: true;
}

export interface SvgState {
  arcs: Arc[];
  lines: Line[];
  points: Point[];
  selection: Selection;
  undoAction: UndoAction;
}
