import { EventHandlerInterface, EventTypes } from '@/event-handlers/types';
import { RootState } from '@/store/types';
import { Store } from 'vuex';
import { Coordinates, Rotation } from '@/types/types';
import { getAngle } from '@/helpers/helpers';

enum States {
  BASE,
  END,
}

export class RotateEventHandler implements EventHandlerInterface {
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
    const angle = getAngle(this.baseCoordinates, svgCoordinates);
    const rotation: Rotation = { angle, origin: this.baseCoordinates };
    this.$store.dispatch('svg/rotateSelectedPoints', rotation);
    this.baseCoordinates = undefined;
    this.currentPhase = States.BASE;
  }
}
