import { RootState } from '@/store/types';
import { Store } from 'vuex';
import { transformCoordinatesToPoint } from '@/helpers/helpers';
import { Coordinates, CustomEvent, Line } from '@/types/types';

export class StoreApi {
  private $store: Store<RootState>;

  constructor(store: Store<RootState>) {
    this.$store = store;
  }

  drawPoint(coordinates: Coordinates, event: CustomEvent) {
    const baseUnit = this.$store.getters['config/getBaseUnit'];
    const point = transformCoordinatesToPoint(coordinates, event, baseUnit);
    this.$store.commit('svg/addPoint', point);
  }
}
