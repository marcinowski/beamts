import { EventHandlerInterface } from './types';
import { RootState } from '@/store/types';
import { Store } from 'vuex';
import { Coordinates, Rotation, EventTypes, CustomEvent } from '@/types/types';
import { getAngle } from '@/helpers/helpers';

enum States {
  BASE,
  END,
}

export class RotateEventHandler implements EventHandlerInterface {
  private $store: Store<RootState>;
  private baseCoordinates?: Coordinates;
  private currentState: States;

  constructor(store: Store<RootState>) {
    this.$store = store;
    this.currentState = States.BASE;
  }

  handleEvent(event: CustomEvent, svgCoordinates: Coordinates) {
    switch (this.currentState) {
      case States.BASE:
        this.handleBaseEvent(event, svgCoordinates);
        return;
      case States.END:
        this.handleEndEvent(event, svgCoordinates);
        return;
    }
  }

  handleBaseEvent(event: CustomEvent, svgCoordinates: Coordinates) {
    if (
      this.currentState !== States.BASE ||
      event.type !== EventTypes.MOUSEDOWN
    ) {
      return;
    }
    this.baseCoordinates = svgCoordinates;
    this.currentState = States.END;
  }

  handleEndEvent(event: CustomEvent, svgCoordinates: Coordinates) {
    if (this.currentState !== States.END || event.type !== EventTypes.CLICK) {
      return;
    }
    if (!this.baseCoordinates) {
      return;
    }
    const angle = getAngle(this.baseCoordinates, svgCoordinates);
    const rotation: Rotation = { angle, origin: this.baseCoordinates };
    this.$store.dispatch('svg/rotateSelectedPoints', rotation);
    this.baseCoordinates = undefined;
    this.currentState = States.BASE;
  }
}
