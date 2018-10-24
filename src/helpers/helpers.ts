import {
  Coordinates,
  Vector,
  Point,
  CustomEvent,
  ObjectId,
  EventTypes,
} from '@/types/types';

export function getVector(
  start: Coordinates,
  end: Coordinates,
  density: number,
  unit: number,
): Vector {
  return transformCoordinatesToScaled(
    {
      x: end.x - start.x,
      y: end.y - start.y,
    },
    density,
    unit,
  );
}

export function getVectorLength(vector: Vector) {
  return Math.sqrt(vector.x * vector.x + vector.y * vector.y);
}

export function getAngle(start: Coordinates, end: Coordinates): ObjectId {
  return Math.atan2(end.y - start.y, end.x - start.x);
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

export function transformCoordinatesToPoint(
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

export function transformEventToCustomEvent(event: MouseEvent): CustomEvent {
  if (!Object.values(EventTypes).includes(event.type)) {
    throw new Error(`Unsupported event type ${event.type}`);
  }
  return {
    clientX: event.clientX,
    clientY: event.clientY,
    timeStamp: event.timeStamp,
    type: event.type as EventTypes,
  };
}
