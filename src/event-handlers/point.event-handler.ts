import { EventHandlerInterface } from './types';
import { RootState } from '@/store/types';
import { Store } from 'vuex';
import {
  Coordinates,
  Point,
  EventTypes,
  CustomEvent,
  ObjectTypes,
} from '@/types/types';
import { getPointIdFromEvent } from '@/helpers/helpers';

export class PointEventHandler implements EventHandlerInterface {
  private $store: Store<RootState>;

  constructor(store: Store<RootState>) {
    this.$store = store;
  }

  get baseUnit() {
    return this.$store.getters['config/getBaseUnit'];
  }

  transformCoordinatesToPoint(point: Coordinates, event: CustomEvent): Point {
    const x = point.x - (point.x % this.baseUnit);
    const y = point.y - (point.y % this.baseUnit);
    const id = getPointIdFromEvent(event.originalEvent);
    return { x, y, id };
  }

  handleEvent(event: CustomEvent, svgCoordinates: Coordinates) {
    if (
      event.customType === EventTypes.SELECTED_OBJECT &&
      event.sourceObject === ObjectTypes.POINT
    ) {
      return;
    } else if (event.originalEvent.type === EventTypes.CLICK) {
      const point = this.transformCoordinatesToPoint(svgCoordinates, event);
      this.$store.commit('svg/addPoint', point);
    }
  }
}
