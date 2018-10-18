import { EventHandlerInterface, EventTypes } from '@/event-handlers/types';
import { RootState } from '@/store/types';
import { Store } from 'vuex';
import { Coordinates, Point } from '@/types/types';

export class PointEventHandler implements EventHandlerInterface {
  counter = 0;
  private $store: Store<RootState>;

  constructor(store: Store<RootState>) {
    this.$store = store;
  }

  get baseUnit() {
    return this.$store.getters['config/getBaseUnit'];
  }

  transformCoordinatesToPoint(point: Coordinates, event: MouseEvent): Point {
    const x = point.x - (point.x % this.baseUnit);
    const y = point.y - (point.y % this.baseUnit);
    return { x, y, id: event.timeStamp };
  }

  handleEvent(event: MouseEvent, svgCoordinates: Coordinates) {
    switch (event.type) {
      case EventTypes.CLICK:
        const point = this.transformCoordinatesToPoint(svgCoordinates, event);
        this.$store.commit('svg/addPoint', point);
    }
  }
}
