/**
 * Rare merge outcome probability and visual modifiers.
 * Pure functions - no framework dependencies.
 * @module core/merge/rare-outcomes
 */

import { MERGE_CONFIG } from '../config.js';

/**
 * Determine if a rare outcome should occur for a merge.
 * @param {Object} pet1 - First parent pet
 * @param {Object} pet2 - Second parent pet
 * @param {number} [seed] - Optional seed for deterministic testing
 * @returns {{isRare: boolean, rareType?: string, rollValue: number}} Rare outcome result
 */
export const determineRareOutcome = (pet1, pet2, seed) => {
  // Use seeded random if provided
  const rollValue = seed !== undefined
    ? createSeededRandom(seed)()
    : Math.random();

  // Check minimum stage requirement
  if (pet1.stage < MERGE_CONFIG.MIN_STAGE_FOR_RARE ||
      pet2.stage < MERGE_CONFIG.MIN_STAGE_FOR_RARE) {
    return { isRare: false, rollValue };
  }

  // Calculate total probability
  let probability = MERGE_CONFIG.RARE_OUTCOME_PROBABILITY;

  // Stage bonus
  const minStage = Math.min(pet1.stage, pet2.stage);
  probability += (minStage - MERGE_CONFIG.MIN_STAGE_FOR_RARE + 1) * MERGE_CONFIG.STAGE_BONUS_PER_LEVEL;

  // Matching evolution path bonus
  if (pet1.evolutionPath && pet2.evolutionPath && pet1.evolutionPath === pet2.evolutionPath) {
    probability += MERGE_CONFIG.MATCHING_PATH_BONUS;
  }

  // Style diversity bonus
  if (pet1.style !== pet2.style) {
    probability += MERGE_CONFIG.STYLE_DIVERSITY_BONUS;
  }

  // Cap probability at 50%
  probability = Math.min(probability, 0.5);

  // Roll for rare outcome
  if (rollValue < probability) {
    const rareType = selectRareType(pet1, pet2, rollValue);
    return { isRare: true, rareType, rollValue };
  }

  return { isRare: false, rollValue };
};

/**
 * Select the type of rare outcome based on parent characteristics.
 * @param {Object} pet1 - First parent pet
 * @param {Object} pet2 - Second parent pet
 * @param {number} rollValue - The random roll value
 * @returns {string} The selected rare type
 */
export const selectRareType = (pet1, pet2, rollValue) => {
  const types = MERGE_CONFIG.RARE_TYPES;

  // Weight types based on parent characteristics
  const weights = {
    legendary: 1,
    chromatic: 1,
    elemental: 1,
    celestial: 1
  };

  // Curious parents increase celestial chance
  if (pet1.evolutionPath === 'curious' || pet2.evolutionPath === 'curious') {
    weights.celestial += 2;
  }

  // Bold parents increase legendary chance
  if (pet1.evolutionPath === 'bold' || pet2.evolutionPath === 'bold') {
    weights.legendary += 2;
  }

  // Gentle parents increase chromatic chance
  if (pet1.evolutionPath === 'gentle' || pet2.evolutionPath === 'gentle') {
    weights.chromatic += 2;
  }

  // High stage parents increase elemental chance
  if (pet1.stage === 3 && pet2.stage === 3) {
    weights.elemental += 2;
  }

  // Calculate total weight and select
  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
  let threshold = rollValue * totalWeight;

  for (const type of types) {
    threshold -= weights[type];
    if (threshold <= 0) {
      return type;
    }
  }

  return types[0]; // Fallback to legendary
};

/**
 * Get visual modifiers for a rare pet type.
 * @param {string} rareType - The type of rare outcome
 * @returns {{auraEffect: string, specialFeatures: string[], colorEnhancement: string}} Visual modifiers
 */
export const getRareVisualModifiers = (rareType) => {
  const modifiers = {
    legendary: {
      auraEffect: 'golden ethereal glow surrounding the creature',
      specialFeatures: [
        'crown-like natural formation on head',
        'majestic flowing mane or plumage',
        'regal posture and bearing',
        'ancient rune-like markings'
      ],
      colorEnhancement: 'rich golden accents with deeper, more saturated base colors'
    },
    chromatic: {
      auraEffect: 'prismatic rainbow shimmer that shifts with movement',
      specialFeatures: [
        'iridescent scales or fur that changes color in light',
        'crystalline horn or spines',
        'glittering dust particles around body',
        'multi-colored eye reflections'
      ],
      colorEnhancement: 'all colors enhanced with rainbow iridescence'
    },
    elemental: {
      auraEffect: 'visible elemental energy crackling around body',
      specialFeatures: [
        'floating elemental particles (fire sparks, water droplets, etc)',
        'body sections that appear made of pure element',
        'elemental trails when moving',
        'glowing elemental core visible through skin'
      ],
      colorEnhancement: 'colors intensified with elemental glow effects'
    },
    celestial: {
      auraEffect: 'soft starlight emanating from within',
      specialFeatures: [
        'constellation patterns on body',
        'tiny orbiting star-like motes',
        'crescent moon or sun motifs',
        'semi-transparent cosmic sections'
      ],
      colorEnhancement: 'deep space colors with starlight sparkles throughout'
    }
  };

  return modifiers[rareType] || modifiers.legendary;
};

/**
 * Get the display name for a rare type.
 * @param {string} rareType - The rare type code
 * @returns {string} Human-readable name
 */
export const getRareTypeName = (rareType) => {
  const names = {
    legendary: 'Legendary',
    chromatic: 'Chromatic',
    elemental: 'Elemental',
    celestial: 'Celestial'
  };
  return names[rareType] || rareType;
};

/**
 * Create a seeded random number generator.
 * @param {number} seed - The seed value
 * @returns {function(): number} Random function returning 0-1
 */
const createSeededRandom = (seed) => {
  let state = seed;
  return () => {
    state = (state * 1103515245 + 12345) & 0x7fffffff;
    return state / 0x7fffffff;
  };
};

export default {
  determineRareOutcome,
  selectRareType,
  getRareVisualModifiers,
  getRareTypeName
};
