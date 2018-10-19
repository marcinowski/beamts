import { EventHandlerInterface, EventTypes } from '@/event-handlers/types';
import { RootState } from '@/store/types';
import { Store } from 'vuex';
import { Coordinates, LineCoordinates } from '@/types/types';

export class SelectionEventHandler implements EventHandlerInterface {
  private $store: Store<RootState>;
  private baseCoordinates?: Coordinates;

  constructor(store: Store<RootState>) {
    this.$store = store;
  }

  handleEvent(event: MouseEvent, svgCoordinates: Coordinates) {
    switch (event.type) {
      case EventTypes.MOUSEDOWN:
        this.handleBaseEvent(event, svgCoordinates);
        return;
      case EventTypes.MOUSEMOVE:
        this.handleDragEvent(event, svgCoordinates);
        return;
      case EventTypes.MOUSEUP:
        this.handleEndEvent(event, svgCoordinates);
        return;
    }
  }

  handleBaseEvent(event: MouseEvent, svgCoordinates: Coordinates) {
    if (event.type !== EventTypes.MOUSEDOWN) {
      return;
    }
    this.baseCoordinates = svgCoordinates;
    this.$store.commit('selection/setSelectionOrigin', svgCoordinates);
  }

  handleDragEvent(event: MouseEvent, svgCoordinates: Coordinates) {
    if (event.type !== EventTypes.MOUSEMOVE || !this.baseCoordinates) {
      return;
    }
    const x = svgCoordinates.x - this.baseCoordinates.x;
    const y = svgCoordinates.y - this.baseCoordinates.y;
    this.$store.commit('selection/setSelectionDimensions', { x, y });
  }

  handleEndEvent(event: MouseEvent, svgCoordinates: Coordinates) {
    if (event.type !== EventTypes.MOUSEUP || !this.baseCoordinates) {
      return;
    }
    const lineCoordinates: LineCoordinates = {
      start: this.baseCoordinates,
      end: svgCoordinates,
    };
    this.$store.dispatch('svg/selectObjectsInRange', lineCoordinates);
    this.baseCoordinates = undefined;
    this.$store.commit('selection/clearSelection');
  }
}
