import { ActionTree } from 'vuex';
import { MaterialsState } from '@/store/materials/types';
import { RootState } from '@/store/types';
import { Material } from '@/types/types';

export const actions: ActionTree<MaterialsState, RootState> = {
  addMaterial(context, material: Material) {
    const id = context.getters.getNextId;
    context.commit('addMaterial', { ...material, id });
  },
};
