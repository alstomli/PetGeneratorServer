/**
 * Core module - pure business logic with no framework dependencies.
 * @module core
 */

// Configuration
export { CONFIG, MERGE_CONFIG, STAGE_NAMES, PATH_DESCRIPTIONS, AUGMENT_CONFIG } from './config.js';

// Validation
export {
  validatePetParams,
  validateEvolutionParams,
  validateMergeParams
} from './validation.js';

// Traits
export { evolutionTraitPools } from './traits/pools.js';
export { selectEvolutionTraits, getAvailableTraits } from './traits/selector.js';

// Evolution
export {
  getPathDescription,
  getMagnitudeGuidance,
  getSizeEmphasis,
  getProportionEmphasis,
  getChangeEmphasis,
  getStageName,
  canEvolve
} from './evolution/rules.js';

export {
  calculateNextStage,
  getEvolutionProgress,
  getRemainingEvolutions,
  isFullyEvolved,
  getStageProportions,
  getSizeMultiplier
} from './evolution/calculator.js';

// Pet model
export {
  createPet,
  createEvolvedPet,
  createMergedPet,
  getRootId,
  shareLineage
} from './pet/model.js';

// Family tree
export {
  buildFamilyTrees,
  getFamilyLine,
  getDescendants,
  getDirectChildren,
  getSiblings,
  getGeneration,
  sortFamilyPets,
  getEvolutionChain
} from './pet/family-tree.js';

// Merge
export {
  checkMergeCompatibility,
  calculateMergedAttributes,
  getInheritedTraits,
  isEligibleForRare
} from './merge/rules.js';

export {
  determineRareOutcome,
  selectRareType,
  getRareVisualModifiers,
  getRareTypeName
} from './merge/rare-outcomes.js';

export {
  selectMergeOutcome,
  buildMergedCreatureDesign,
  getMergeOutcomeSummary
} from './merge/outcome-selector.js';

// Augments
export {
  AUGMENT_POOL,
  AUGMENT_CATEGORIES,
  getAugmentsByCategory,
  getAugmentById,
  getAugmentsByWeight,
  getAllCategories,
  RARITY_TIERS,
  calculateRarity,
  calculateTotalWeight,
  getRarityDisplay,
  getRarityById,
  getRarityFromWeight,
  getAllRarityTiers,
  meetsRarityThreshold,
  rollGenerationAugment,
  rollEvolutionAugment,
  getMergeAugments,
  shouldUseGeminiGeneration,
  buildAugmentGenerationPrompt,
  parseAugmentResponse,
  generateUniqueAugment,
  getCachedOrGenerateAugment,
  clearAugmentCache,
  getAugmentCacheSize
} from './augments/index.js';
