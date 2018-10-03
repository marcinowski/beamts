import { Line, Point, Selection } from '@/types/types';

export interface UndoAction {
  action: string;
  item?: any;
  dispatch?: true;
}

export interface SvgState {
  lines: Line[];
  points: Point[];
  selection: Selection;
  undoAction: UndoAction;
}
