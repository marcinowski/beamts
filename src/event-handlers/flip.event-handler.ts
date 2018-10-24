import { EventHandlerInterface } from './types';
import { RootState } from '@/store/types';
import { Store } from 'vuex';
import {
  Coordinates,
  LineCoordinates,
  EventTypes,
  CustomEvent,
} from '@/types/types';
import { transformCoordinatesToScaled } from '@/helpers/helpers';

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

  get unit() {
    return this.$store.getters['config/getScaledUnit'];
  }

  get density() {
    return this.$store.getters['config/getScaledDensity'];
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
    if (this.currentState !== States.BASE || event.type !== EventTypes.CLICK) {
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
    const line: LineCoordinates = {
      start: transformCoordinatesToScaled(
        this.baseCoordinates,
        this.density,
        this.unit,
      ),
      end: transformCoordinatesToScaled(svgCoordinates, this.density, this.unit),
    };
    this.$store.dispatch('svg/flipSelectedPoints', line);
    this.baseCoordinates = undefined;
    this.currentState = States.BASE;
  }
}
