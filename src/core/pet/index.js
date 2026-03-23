/**
 * Pet module - model and family tree utilities.
 * @module core/pet
 */

export {
  createPet,
  createEvolvedPet,
  createMergedPet,
  createModifiedPet,
  getRootId,
  shareLineage
} from './model.js';

export {
  buildFamilyTrees,
  getFamilyLine,
  getDescendants,
  getDirectChildren,
  getSiblings,
  getGeneration,
  sortFamilyPets,
  getEvolutionChain
} from './family-tree.js';
