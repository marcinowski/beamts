import { EventHandlerInterface, EventTypes } from '@/event-handlers/types';
import { RootState } from '@/store/types';
import { Store } from 'vuex';
import { Coordinates, Vector } from '@/types/types';

enum States {
  BASE,
  END,
}

export class MoveEventHandler implements EventHandlerInterface {
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
    if (
      this.currentPhase !== States.BASE ||
      event.type !== EventTypes.MOUSEDOWN
    ) {
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
    const vector = this.getVector(this.baseCoordinates, svgCoordinates);
    this.$store.dispatch('svg/moveSelectedPoints', vector);
    this.baseCoordinates = undefined;
    this.currentPhase = States.BASE;
  }

  getVector(start: Coordinates, end: Coordinates): Vector {
    return {
      x: end.x - start.x,
      y: end.y - start.y,
    };
  }
}
