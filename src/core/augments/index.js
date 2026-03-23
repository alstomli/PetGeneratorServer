/**
 * Augment system - combines augment pool, rarity, and acquisition logic.
 * @module core/augments
 */

// Pool
export {
  AUGMENT_POOL,
  AUGMENT_CATEGORIES,
  getAugmentsByCategory,
  getAugmentById,
  getAugmentsByWeight,
  getAllCategories
} from './pool.js';

// Rarity
export {
  RARITY_TIERS,
  calculateRarity,
  calculateTotalWeight,
  getRarityDisplay,
  getRarityById,
  getRarityFromWeight,
  getAllRarityTiers,
  meetsRarityThreshold
} from './rarity.js';

// Acquisition
export {
  rollGenerationAugment,
  rollEvolutionAugment,
  getMergeAugments,
  shouldUseGeminiGeneration
} from './acquisition.js';

// Generator (optional Gemini-based unique augment generation)
export {
  buildAugmentGenerationPrompt,
  parseAugmentResponse,
  generateUniqueAugment,
  getCachedOrGenerateAugment,
  clearAugmentCache,
  getAugmentCacheSize
} from './generator.js';
