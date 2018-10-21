import { EventHandlerInterface } from './types';
import { RootState } from '@/store/types';
import { Store } from 'vuex';
import { Coordinates, EventTypes, CustomEvent } from '@/types/types';

export class CursorEventHandler implements EventHandlerInterface {
  private $store: Store<RootState>;

  constructor(store: Store<RootState>) {
    this.$store = store;
  }

  handleEvent(event: CustomEvent, svgCoordinates: Coordinates) {
    if (!event.customType) {
      switch (event.originalEvent.type) {
        case EventTypes.CLICK:
          this.$store.dispatch('svg/deselectAll');
      }
    }
  }
}
