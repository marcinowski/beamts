import { Coordinates } from '@/types/types';

export interface EventHandlerInterface {
  handleEvent(event: MouseEvent, svgCoordinates: Coordinates): void;
}

export enum EventTypes {
  CLICK = 'click',
  MOUSEUP = 'mouseup',
  MOUSEDOWN = 'mousedown',
  MOUSEMOVE = 'mousemove',
}
