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

export class SelectionEventHandler implements EventHandlerInterface {
  private $store: Store<RootState>;
  private baseCoordinates?: Coordinates;

  constructor(store: Store<RootState>) {
    this.$store = store;
  }

  get unit() {
    return this.$store.getters['config/getScaledUnit'];
  }

  get density() {
    return this.$store.getters['config/getScaledDensity'];
  }

  handleEvent(event: CustomEvent, svgCoordinates: Coordinates) {
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

  handleBaseEvent(event: CustomEvent, svgCoordinates: Coordinates) {
    if (event.type !== EventTypes.MOUSEDOWN) {
      return;
    }
    this.baseCoordinates = svgCoordinates;
    this.$store.commit('selection/setSelectionOrigin', svgCoordinates);
  }

  handleDragEvent(event: CustomEvent, svgCoordinates: Coordinates) {
    if (event.type !== EventTypes.MOUSEMOVE || !this.baseCoordinates) {
      return;
    }
    const x = svgCoordinates.x - this.baseCoordinates.x;
    const y = svgCoordinates.y - this.baseCoordinates.y;
    this.$store.commit('selection/setSelectionDimensions', { x, y });
  }

  handleEndEvent(event: CustomEvent, svgCoordinates: Coordinates) {
    if (event.type !== EventTypes.MOUSEUP || !this.baseCoordinates) {
      return;
    }
    const lineCoordinates: LineCoordinates = {
      start: transformCoordinatesToScaled(
        this.baseCoordinates,
        this.density,
        this.unit,
      ),
      end: transformCoordinatesToScaled(svgCoordinates, this.density, this.unit),
    };
    this.$store.dispatch('svg/selectObjectsInRange', lineCoordinates);
    this.baseCoordinates = undefined;
    this.$store.commit('selection/clearSelection');
  }
}
