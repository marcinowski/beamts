import { Coordinates, CustomEvent } from '@/types/types';

export interface EventHandlerInterface {
  handleEvent(event: CustomEvent, svgCoordinates: Coordinates): void;
}
