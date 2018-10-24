import { RootState } from '@/store/types';
import { Store } from 'vuex';
import {
  transformCoordinatesToPoint,
  getArcIdFromEvent,
  getLineIdFromEvent,
} from '@/helpers/helpers';
import { Coordinates, CustomEvent, Line, Arc, ObjectId } from '@/types/types';

export class StoreApi {
  private $store: Store<RootState>;

  constructor(store: Store<RootState>) {
    this.$store = store;
  }

  get unit() {
    return this.$store.getters['config/getScaledUnit'];
  }

  get density() {
    return this.$store.getters['config/getScaledDensity'];
  }

  drawPoint(coordinates: Coordinates, event: CustomEvent) {
    const point = transformCoordinatesToPoint(
      coordinates,
      event,
      this.density,
      this.unit,
    );
    this.$store.commit('svg/addPoint', point);
  }

  drawLine(event: CustomEvent, p1: ObjectId, p2: ObjectId) {
    const line: Line = {
      id: getLineIdFromEvent(event),
      p1,
      p2,
      selected: false,
    };
    this.$store.commit('svg/addLine', line);
  }

  drawArc(event: CustomEvent, radius: number, p1: ObjectId, p2: ObjectId) {
    const arc: Arc = {
      id: getArcIdFromEvent(event),
      radius,
      p1,
      p2,
      selected: false,
    };
    this.$store.commit('svg/addArc', arc);
  }

  addHelper(description: string, showInput: boolean) {
    this.$store.commit('helpers/addHelper', {
      description,
      showInput,
    });
  }
}
