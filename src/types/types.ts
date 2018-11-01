export enum MethodTypes {
  ARC = 'arc',
  CURSOR = 'cursor',
  FLIP = 'flip',
  LINE = 'line',
  MOVE = 'move',
  POINT = 'point',
  ROTATE = 'rotate',
  SELECTION = 'selection',
}

export type ObjectId = number;

export enum ObjectTypes {
  POINT = 'point',
  LINE = 'line',
  ARC = 'arc',
}

export interface Coordinates {
  x: number;
  y: number;
}

export interface Vector {
  x: number;
  y: number;
}

export interface Rotation {
  origin: Coordinates;
  angle: number;
}

export interface Point extends Coordinates {
  id: ObjectId;
  selected?: boolean;
}

export interface LineCoordinates {
  start: Coordinates;
  end: Coordinates;
}

export interface ArcCoordinates {
  start: Coordinates;
  end: Coordinates;
  radius: number;
  xAxisRotation: number; // 0 for circles
  sweep: 0 | 1;
  largeArc: 0 | 1;
}

export interface Line {
  id: ObjectId;
  p1: ObjectId;
  p2: ObjectId;
  selected?: boolean;
}

export interface Arc extends Line {
  radius: number;
  xAxisRotation: number; // 0 for circles
  sweep: 0 | 1;
  largeArc: 0 | 1;
}

export interface Section {
  id: ObjectId;
  area: number;
  inertia: Coordinates;
}

export interface Material {
  id: ObjectId;
  young: number;
  poisson: number;
}

export enum EventTypes {
  CLICK = 'click',
  MOUSEUP = 'mouseup',
  MOUSEDOWN = 'mousedown',
  MOUSEMOVE = 'mousemove',
  MOUSEOVER = 'mouseover',
  // Custom events
  SELECTED_OBJECT = 'selectedobject',
  SUBMITTED_HELPER = 'submittedhelper',
  KEY_DELETE = 'keydelete',
  KEY_ENTER = 'keyenter',
  KEY_ESC = 'keyesc',
}

export interface CustomEvent {
  timeStamp: number;
  type: EventTypes;
  clientX?: number;
  clientY?: number;
  sourceId?: ObjectId;
  sourceObject?: ObjectTypes;
  sourceValue?: string;
}

export interface StageHelper {
  description?: string;
  showInput?: boolean;
}
