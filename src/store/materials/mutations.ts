import { MutationTree } from 'vuex';
import { MaterialsState } from './types';

export const mutations: MutationTree<MaterialsState> = {
  addMaterial(state, material) {
    state.materials.push(material);
    state.currentIndex++;
  },
  removeMaterial(state, material) {
    state.materials = [...state.materials.filter((m) => m.id !== material.id)];
  },
};
