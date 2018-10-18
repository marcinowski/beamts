import { EventHandlerInterface } from '@/event-handlers/types';
import { RootState } from '@/store/types';
import { Store } from 'vuex';
import { Coordinates } from '@/types/types';

export class LineEventHandler implements EventHandlerInterface {
  counter = 0;
  private $store: Store<RootState>;

  constructor(store: Store<RootState>) {
    this.$store = store;
  }

  handleEvent(event: MouseEvent, svgCoordinates: Coordinates) {
    console.log('Lineeees', this.counter);
    this.counter += 1;
  }
}
