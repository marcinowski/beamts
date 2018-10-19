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
  private currentPhase: States;

  constructor(store: Store<RootState>) {
    this.$store = store;
    this.currentPhase = States.BASE;
  }

  handleEvent(event: MouseEvent, svgCoordinates: Coordinates) {
    switch (this.currentPhase) {
      case States.BASE:
        this.handleBaseEvent(event, svgCoordinates);
        return;
      case States.END:
        this.handleEndEvent(event, svgCoordinates);
        return;
    }
  }

  handleBaseEvent(event: MouseEvent, svgCoordinates: Coordinates) {
    if (this.currentPhase !== States.BASE || event.type !== EventTypes.CLICK) {
      return;
    }
    this.baseCoordinates = svgCoordinates;
    this.currentPhase = States.END;
  }

  handleEndEvent(event: MouseEvent, svgCoordinates: Coordinates) {
    if (this.currentPhase !== States.END || event.type !== EventTypes.CLICK) {
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
    this.currentPhase = States.BASE;
  }
}
