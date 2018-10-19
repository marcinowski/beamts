import { EventHandlerInterface, EventTypes } from '@/event-handlers/types';
import { RootState } from '@/store/types';
import { Store } from 'vuex';
import { Coordinates, LineCoordinates } from '@/types/types';

enum States {
  BASE,
  END,
}

export class FlipEventHandler implements EventHandlerInterface {
  private $store: Store<RootState>;
  private baseCoordinates?: Coordinates;
  private currentState: States;

  constructor(store: Store<RootState>) {
    this.$store = store;
    this.currentState = States.BASE;
  }

  handleEvent(event: MouseEvent, svgCoordinates: Coordinates) {
    switch (this.currentState) {
      case States.BASE:
        this.handleBaseEvent(event, svgCoordinates);
        return;
      case States.END:
        this.handleEndEvent(event, svgCoordinates);
        return;
    }
  }

  handleBaseEvent(event: MouseEvent, svgCoordinates: Coordinates) {
    if (this.currentState !== States.BASE || event.type !== EventTypes.CLICK) {
      return;
    }
    this.baseCoordinates = svgCoordinates;
    this.currentState = States.END;
  }

  handleEndEvent(event: MouseEvent, svgCoordinates: Coordinates) {
    if (this.currentState !== States.END || event.type !== EventTypes.CLICK) {
      return;
    }
    if (!this.baseCoordinates) {
      return;
    }
    const line: LineCoordinates = {
      start: this.baseCoordinates,
      end: svgCoordinates,
    };
    this.$store.dispatch('svg/flipSelectedPoints', line);
    this.baseCoordinates = undefined;
    this.currentState = States.BASE;
  }
}
