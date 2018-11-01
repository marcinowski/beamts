import { RootState } from '@/store/types';
import { Store } from 'vuex';
import {
  getArcIdFromEvent,
  getLineIdFromEvent,
  getPointIdFromEvent,
} from '@/helpers/helpers';
import {
  Coordinates,
  CustomEvent,
  Line,
  Arc,
  ObjectId,
  Point,
  LineCoordinates,
  Vector,
  Rotation,
} from '@/types/types';
import { Transform } from '@/event-handlers/transform';

export class StoreApi {
  private $store: Store<RootState>;
  private transform: Transform;

  constructor(store: Store<RootState>) {
    this.$store = store;
    this.transform = new Transform(store);
  }

  drawPoint(coordinates: Coordinates, event: CustomEvent) {
    const point: Point = {
      ...coordinates,
      id: getPointIdFromEvent(event),
    };
    const transformedPoint = this.transform.pointToAbsolute(point);
    this.$store.commit('svg/addPoint', transformedPoint);
  }

  getPoint(id: ObjectId) {
    const point = this.$store.getters['svg/getPoint'](id);
    return this.transform.pointFromAbsolute(point);
  }

  removePoint(point: Point) {
    this.$store.dispatch('svg/removePoint', point);
  }

  drawLine(event: CustomEvent, p1: ObjectId, p2: ObjectId) {
    const line: Line = {
      id: getLineIdFromEvent(event),
      p1,
      p2,
    };
    const transformedLine = this.transform.lineToAbsolute(line);
    this.$store.commit('svg/addLine', transformedLine);
  }

  getLine(id: ObjectId) {
    const line = this.$store.getters['svg/getLine'](id);
    return this.transform.lineFromAbsolute(line);
  }

  removeLine(line: Line) {
    this.$store.dispatch('svg/removeLine', line);
  }

  drawArc(
    event: CustomEvent,
    radius: number,
    p1: ObjectId,
    p2: ObjectId,
    sweep: 0 | 1 = 0,
    largeArc: 0 | 1 = 0,
    xAxisRotation: number = 0,
  ) {
    const arc: Arc = {
      id: getArcIdFromEvent(event),
      radius,
      p1,
      p2,
      xAxisRotation,
      sweep,
      largeArc,
    };
    const transformedArc = this.transform.arcToAbsolute(arc);
    this.$store.commit('svg/addArc', transformedArc);
  }

  getArc(id: ObjectId) {
    const arc = this.$store.getters['svg/getArc'](id);
    return this.transform.arcFromAbsolute(arc);
  }

  removeArc(arc: Arc) {
    this.$store.dispatch('svg/removeArc', arc);
  }

  addHelper(description: string, showInput: boolean) {
    this.$store.commit('helpers/addHelper', {
      description,
      showInput,
    });
  }

  getHelper() {
    return this.$store.getters['helpers/getHelper'];
  }

  clearHelper() {
    this.$store.commit('helpers/clearHelper');
  }

  flipSelected(line: LineCoordinates) {
    const transformedLine = this.transform.lineCoordinatesToAbsolute(line);
    this.$store.dispatch('svg/flipSelectedPoints', transformedLine);
  }

  moveSelected(vector: Vector) {
    const transformedVector = this.transform.vectorToAbsolute(vector);
    this.$store.dispatch('svg/moveSelectedPoints', transformedVector);
  }

  rotateSelected(rotation: Rotation) {
    const transformedRotation = this.transform.rotationToAbsolute(rotation);
    this.$store.dispatch('svg/rotateSelectedPoints', transformedRotation);
  }

  setSelectionStart(coordinates: Coordinates) {
    const transformedCoords = this.transform.coordinatesToAbsolute(coordinates);
    this.$store.commit('selection/setSelectionStart', transformedCoords);
    this.$store.commit('selection/setSelectionEnd', transformedCoords);
    // otherwise this goes from 0 to origin
  }

  setSelectionEnd(coordinates: Coordinates) {
    const transformedCoords = this.transform.coordinatesToAbsolute(coordinates);
    this.$store.commit('selection/setSelectionEnd', transformedCoords);
  }

  selectObjects(line: LineCoordinates) {
    const transformed = this.transform.lineCoordinatesToAbsolute(line);
    this.$store.dispatch('svg/selectObjectsInRange', transformed);
  }

  clearSelection() {
    this.$store.commit('selection/clearSelection');
  }

  removeSelected() {
    this.$store.dispatch('svg/removeSelected');
  }

  isContinuousLine() {
    return this.$store.getters['config/isContinuousLine'];
  }

  isHelpersOn() {
    return this.$store.getters['config/isHelpersOn'];
  }

  getSelection() {
    const selection = this.$store.getters['selection/getSelection'];
    return this.transform.lineCoordinatesFromAbsolute(selection);
  }

  setHelperLineStart(coords: Coordinates) {
    const transformed = this.transform.lineCoordinatesToAbsolute({
      start: coords,
      end: coords,
    });
    return this.$store.commit('svg/setHelperLine', transformed);
  }

  setHelperLineEnd(coords: Coordinates) {
    const helperLine = this.getHelperLine();
    const newHelperLine = this.transform.lineCoordinatesToAbsolute({
      start: helperLine.start,
      end: coords,
    });
    return this.$store.commit('svg/setHelperLine', newHelperLine);
  }

  getHelperLine() {
    const line = this.$store.getters['svg/getHelperLine'];
    return this.transform.lineCoordinatesFromAbsolute(line);
  }

  clearHelperLine() {
    this.$store.commit('svg/clearHelperLine');
  }

  setHelperArcBase(coords: LineCoordinates) {
    const helperArc = this.getHelperArc();
    const transformedArc = this.transform.arcCoordinatesToAbsolute({
      ...helperArc,
      start: coords.start,
      end: coords.end,
    });
    return this.$store.commit('svg/setHelperArc', transformedArc);
  }

  setHelperArcEnd(
    radius: number,
    xAxisRotation: number,
    sweep: 0 | 1,
    largeArc: 0 | 1,
  ) {
    const arc = this.getHelperArc();
    const transformedArc = this.transform.arcCoordinatesToAbsolute({
      start: arc.start,
      end: arc.end,
      radius,
      xAxisRotation,
      sweep,
      largeArc,
    });
    return this.$store.commit('svg/setHelperArc', transformedArc);
  }

  getHelperArc() {
    const arc = this.$store.getters['svg/getHelperArc'];
    return this.transform.arcCoordinatesFromAbsolute(arc);
  }

  clearHelperArc() {
    this.$store.commit('svg/clearHelperArc');
  }
}
