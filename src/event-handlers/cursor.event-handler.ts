import { EventHandlerInterface, EventTypes } from '@/event-handlers/types';
import { RootState } from '@/store/types';
import { Store } from 'vuex';
import { Coordinates } from '@/types/types';

export class CursorEventHandler implements EventHandlerInterface {
  counter = 0;
  private $store: Store<RootState>;

  constructor(store: Store<RootState>) {
    this.$store = store;
  }

  handleEvent(event: MouseEvent, svgCoordinates: Coordinates) {
    switch (event.type) {
      case EventTypes.CLICK:
        this.$store.dispatch('svg/deselectAll');
    }
  }
}
