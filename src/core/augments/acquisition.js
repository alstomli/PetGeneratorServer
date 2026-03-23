/**
 * Augment acquisition logic for generation, evolution, and merge.
 * @module core/augments/acquisition
 */

import { AUGMENT_POOL, AUGMENT_CATEGORIES, getAugmentsByCategory } from './pool.js';

/**
 * Seeded random number generator for reproducible results.
 * @param {number} seed - Seed value
 * @returns {function} Random function that returns 0-1
 */
const seededRandom = (seed) => {
  let s = seed || Date.now();
  return () => {
    s = Math.sin(s) * 10000;
    return s - Math.floor(s);
  };
};

/**
 * Get a random function - uses seed if provided, otherwise Math.random.
 * @param {number} [seed] - Optional seed
 * @returns {function} Random function
 */
const getRandom = (seed) => {
  return seed !== undefined ? seededRandom(seed) : Math.random;
};

/**
 * Check if an animal is mythical.
 * @param {string} animal - Animal name
 * @returns {boolean} True if mythical
 */
const isMythicalAnimal = (animal) => {
  const mythicals = ['dragon', 'phoenix', 'unicorn', 'griffin'];
  return mythicals.includes(animal?.toLowerCase());
};

/**
 * Select a random augment from the pool, avoiding duplicates and same-category augments.
 * @param {Object[]} existingAugments - Already owned augments
 * @param {Object} [options] - Selection options
 * @param {string} [options.preferredCategory] - Category to prefer
 * @param {function} [options.random] - Random function
 * @returns {Object|null} Selected augment or null
 */
const selectAugmentFromPool = (existingAugments = [], options = {}) => {
  const { preferredCategory, random = Math.random } = options;

  // Get existing augment IDs and categories
  const existingIds = new Set(existingAugments.map(a => a.id));
  const existingCategories = new Set(existingAugments.map(a => a.category));

  // Filter pool - no duplicates, no same-category
  let available = AUGMENT_POOL.filter(aug =>
    !existingIds.has(aug.id) && !existingCategories.has(aug.category)
  );

  if (available.length === 0) {
    // If all categories taken, allow any non-duplicate
    available = AUGMENT_POOL.filter(aug => !existingIds.has(aug.id));
  }

  if (available.length === 0) {
    return null;
  }

  // Weight toward preferred category if specified
  if (preferredCategory) {
    const preferred = available.filter(aug => aug.category === preferredCategory);
    if (preferred.length > 0 && random() < 0.6) {
      return preferred[Math.floor(random() * preferred.length)];
    }
  }

  // Random selection from available
  return available[Math.floor(random() * available.length)];
};

/**
 * Get preferred category based on pet style.
 * @param {string} style - Pet style
 * @returns {string|null} Preferred category
 */
const getPreferredCategoryForStyle = (style) => {
  const styleCategories = {
    'gentle': AUGMENT_CATEGORIES.NATURE,
    'bold': AUGMENT_CATEGORIES.ELEMENTAL,
    'curious': AUGMENT_CATEGORIES.ARCANE
  };
  return styleCategories[style] || null;
};

/**
 * Get preferred category based on evolution path.
 * @param {string} path - Evolution path
 * @returns {string|null} Preferred category
 */
const getPreferredCategoryForPath = (path) => {
  const pathCategories = {
    'gentle': AUGMENT_CATEGORIES.NATURE,
    'bold': AUGMENT_CATEGORIES.ELEMENTAL,
    'curious': AUGMENT_CATEGORIES.ARCANE
  };
  return pathCategories[path] || null;
};

/**
 * Roll for augment on new pet generation.
 *
 * Base chance: 15%
 * Style bonuses:
 * - "curious" style: +10%
 * Mythical animals (dragon, phoenix, unicorn): +10%
 *
 * @param {Object} params - Generation parameters
 * @param {string} params.style - Pet style
 * @param {string[]} params.animals - Animal inspirations
 * @param {number} [params.seed] - Random seed for reproducibility
 * @param {boolean} [params.guaranteed] - If true, guarantees an augment (bonus potion)
 * @returns {Object|null} Rolled augment or null
 */
export const rollGenerationAugment = ({ style, animals = [], seed, guaranteed = false }) => {
  const random = getRandom(seed);

  // If guaranteed (bonus potion), skip probability check
  if (!guaranteed) {
    // Calculate probability
    let probability = 0.15; // Base 15%

    // Style bonuses - curious style has higher augment chance
    if (style === 'curious') probability += 0.10;

    // Mythical animal bonus
    if (animals.some(isMythicalAnimal)) {
      probability += 0.10;
    }

    // Roll
    if (random() >= probability) {
      return null;
    }
  }

  // Select augment with style preference
  const preferredCategory = getPreferredCategoryForStyle(style);
  return selectAugmentFromPool([], { preferredCategory, random });
};

/**
 * Roll for augment on evolution (Stage 2 -> 3).
 *
 * Base chance: 20%
 * Path bonuses:
 * - "curious" path: +15%
 * Pets with 0 augments: +10% (pity system)
 *
 * @param {Object} params - Evolution parameters
 * @param {Object} params.pet - Pet being evolved
 * @param {string} params.evolutionPath - Evolution path taken
 * @param {number} [params.seed] - Random seed for reproducibility
 * @param {boolean} [params.guaranteed] - If true, guarantees an augment (bonus potion)
 * @returns {Object|null} Rolled augment or null
 */
export const rollEvolutionAugment = ({ pet, evolutionPath, seed, guaranteed = false }) => {
  const random = getRandom(seed);
  const existingAugments = pet.augments || [];

  // If guaranteed (bonus potion), skip probability check
  if (!guaranteed) {
    // Calculate probability
    let probability = 0.20; // Base 20%

    // Path bonuses - curious path has higher augment chance
    if (evolutionPath === 'curious') probability += 0.15;

    // Pity system - bonus if no augments
    if (existingAugments.length === 0) {
      probability += 0.10;
    }

    // Roll
    if (random() >= probability) {
      return null;
    }
  }

  // Select augment with path preference
  const preferredCategory = getPreferredCategoryForPath(evolutionPath);
  return selectAugmentFromPool(existingAugments, { preferredCategory, random });
};

/**
 * Get augments for merged pet.
 *
 * - Child inherits all augments from both parents (up to 4 max)
 * - 30% chance to gain 1 new augment
 * - If both parents have 2+ augments: guaranteed new augment
 *
 * @param {Object} params - Merge parameters
 * @param {Object} params.pet1 - First parent pet
 * @param {Object} params.pet2 - Second parent pet
 * @param {number} [params.seed] - Random seed for reproducibility
 * @returns {Object[]} Array of augments for merged pet
 */
export const getMergeAugments = ({ pet1, pet2, seed }) => {
  const random = getRandom(seed);

  const parent1Augments = pet1.augments || [];
  const parent2Augments = pet2.augments || [];

  // Combine all parent augments, removing duplicates by ID
  const allInherited = [...parent1Augments];
  for (const aug of parent2Augments) {
    if (!allInherited.find(a => a.id === aug.id)) {
      allInherited.push(aug);
    }
  }

  // Cap at 4 augments
  const inherited = allInherited.slice(0, 4);

  // Check if should gain new augment
  let shouldGainNew = false;
  const bothParentsHaveMultiple = parent1Augments.length >= 2 && parent2Augments.length >= 2;

  if (bothParentsHaveMultiple) {
    // Guaranteed new augment
    shouldGainNew = true;
  } else if (random() < 0.30) {
    // 30% chance
    shouldGainNew = true;
  }

  // Add new augment if applicable and space available
  if (shouldGainNew && inherited.length < 4) {
    const newAugment = selectAugmentFromPool(inherited, { random });
    if (newAugment) {
      inherited.push(newAugment);
    }
  }

  return inherited;
};

/**
 * Check if should use Gemini generation for unique augment.
 * 10% of acquisitions should use Gemini generation.
 * @param {number} [seed] - Random seed
 * @returns {boolean} True if should use Gemini generation
 */
export const shouldUseGeminiGeneration = (seed) => {
  const random = getRandom(seed);
  return random() < 0.10;
};

export default {
  rollGenerationAugment,
  rollEvolutionAugment,
  getMergeAugments,
  shouldUseGeminiGeneration
};
