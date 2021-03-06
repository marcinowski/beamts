import {
  Coordinates,
  Vector,
  Point,
  CustomEvent,
  ObjectId,
  EventTypes,
} from '@/types/types';

export function getVector(start: Coordinates, end: Coordinates): Vector {
  return {
    x: end.x - start.x,
    y: end.y - start.y,
  };
}

export function getVectorLength(vector: Vector) {
  return Math.sqrt(vector.x * vector.x + vector.y * vector.y);
}

export function get2DDotProduct(start: Vector, end: Vector) {
  return start.x * end.x + start.y * end.y;
}

export function get2DCrossProduct(start: Vector, end: Vector) {
  return start.x * end.y - start.y * end.x;
}

export function getAngle(start: Vector, end: Vector): number {
  return Math.acos(
    get2DDotProduct(start, end) / getVectorLength(start) / getVectorLength(end),
  );
}

export function getPointIdFromEvent(event: CustomEvent): ObjectId {
  return event.timeStamp;
}

// TODO: This approach doesn't scale well, how about string based ids or UUID?
export function getLineIdFromEvent(event: CustomEvent): ObjectId {
  return getPointIdFromEvent(event) + 1;
}

export function getArcIdFromEvent(event: CustomEvent): ObjectId {
  return getPointIdFromEvent(event) + 2;
}

export function transformCoordinatesToScaled(
  coords: Coordinates,
  density: number,
  unit: number,
): Coordinates {
  return {
    x: (coords.x - (coords.x % density)) / unit,
    y: (coords.y - (coords.y % density)) / unit,
  };
}

export function createPointFromEventCoordinates(
  point: Coordinates,
  event: CustomEvent,
  density: number,
  unit: number,
): Point {
  return {
    ...transformCoordinatesToScaled(point, density, unit),
    id: getPointIdFromEvent(event),
  };
}

function validateEventType(event: Event) {
  if (!Object.values(EventTypes).includes(event.type)) {
    throw new Error(`Unsupported event type ${event.type}`);
  }
}

export function createCustomEventFromKeyboardEvent(
  event: KeyboardEvent,
): CustomEvent {
  validateEventType(event);
  return {
    timeStamp: event.timeStamp,
    type: event.type as EventTypes,
  };
}

export function createCustomEventFromMouseEvent(
  event: MouseEvent,
): CustomEvent {
  validateEventType(event);
  return {
    clientX: event.clientX,
    clientY: event.clientY,
    timeStamp: event.timeStamp,
    type: event.type as EventTypes,
  };
}
