/**
 * Game configuration constants.
 * Pure data - no framework dependencies.
 * @module core/config
 */

/**
 * Core game configuration
 */
export const CONFIG = {
  /** Gemini model to use for generation */
  MODEL: 'gemini-3-pro-image-preview',

  /** Valid pet styles / evolution paths (unified) */
  VALID_STYLES: ['bold', 'gentle', 'curious'],

  /** Valid color palettes */
  VALID_COLORS: [
    // Warm tones
    'sunset orange',
    'golden sun',
    'cherry blossom pink',
    'autumn leaves',
    'coral reef',
    'cinnamon spice',
    // Cool tones
    'ocean blue',
    'forest green',
    'arctic ice',
    'lavender dreams',
    'mint fresh',
    'slate storm',
    // Vibrant
    'rainbow bright',
    'neon electric',
    'tropical paradise',
    'berry blast',
    // Magical/Dark
    'purple magic',
    'starry night',
    'midnight galaxy',
    'mystic moonlight',
    // Soft/Light
    'pink princess',
    'cotton candy',
    'pastel sunrise',
    'cream vanilla',
    // Earthy
    'mossy woodland',
    'desert sand',
    'volcanic ember'
  ],

  /** Valid animal inspirations */
  VALID_ANIMALS: [
    // Domestic
    'cat', 'dog', 'bunny', 'hamster',
    // Forest
    'fox', 'bear', 'deer', 'squirrel', 'raccoon', 'wolf',
    // Sea & Sky
    'bird', 'butterfly', 'owl', 'eagle', 'dolphin', 'penguin', 'seal', 'stingray', 'crab', 'octopus',
    // Mythical
    'dragon', 'unicorn', 'phoenix', 'griffin',
    // Exotic
    'tiger', 'lion', 'panda', 'elephant', 'giraffe', 'monkey', 'chameleon', 'kangaroo', 'sloth', 'armadillo'
  ],

  /** Valid evolution paths (same as styles - unified system) */
  EVOLUTION_PATHS: ['bold', 'gentle', 'curious'],

  /** Maximum evolution stages */
  MAX_STAGES: 3
};

/**
 * Merge feature configuration
 */
export const MERGE_CONFIG = {
  /** Base probability for rare outcomes (15%) */
  RARE_OUTCOME_PROBABILITY: 0.15,

  /** Types of rare outcomes */
  RARE_TYPES: ['legendary', 'chromatic', 'elemental', 'celestial'],

  /** Minimum stage for rare outcome eligibility */
  MIN_STAGE_FOR_RARE: 2,

  /** Bonus probability per stage above minimum */
  STAGE_BONUS_PER_LEVEL: 0.05,

  /** Bonus probability when both parents share evolution path */
  MATCHING_PATH_BONUS: 0.10,

  /** Bonus probability when parents have different styles */
  STYLE_DIVERSITY_BONUS: 0.05
};

/**
 * Stage names for display
 */
export const STAGE_NAMES = {
  1: 'Baby',
  2: 'Juvenile',
  3: 'Adult'
};

/**
 * Evolution path descriptions
 */
export const PATH_DESCRIPTIONS = {
  bold: 'transforms with DRAMATIC PHYSICAL CHANGES - MUCH larger, more powerful and confident body, PROMINENT strength features, VISIBLE determination indicators. Fearless and ready for adventure.',
  gentle: 'transforms with DRAMATIC PHYSICAL CHANGES - MUCH larger, rounder, fluffier body, BIGGER expressive features, PROMINENT nurturing physical traits. Warm and approachable.',
  curious: 'transforms with DRAMATIC PHYSICAL CHANGES - MUCH larger, MORE elaborate mystical features, PROMINENT magical appendages (multiple tails, wings, crystals), GLOWING elements. Inquisitive and mysterious.'
};

/**
 * Augment system configuration
 */
export const AUGMENT_CONFIG = {
  /** Maximum augments a pet can have */
  MAX_AUGMENTS: 4,

  /** Generation augment probabilities */
  GENERATION: {
    /** Base probability for augment on generation (15%) */
    BASE_PROBABILITY: 0.15,
    /** Bonus for "curious" style (mysterious, magical) */
    CURIOUS_STYLE_BONUS: 0.10,
    /** Bonus for mythical animals (dragon, phoenix, unicorn, griffin) */
    MYTHICAL_ANIMAL_BONUS: 0.10
  },

  /** Evolution augment probabilities */
  EVOLUTION: {
    /** Base probability for augment on evolution (20%) */
    BASE_PROBABILITY: 0.20,
    /** Bonus for "curious" path (mysterious, magical) */
    CURIOUS_PATH_BONUS: 0.15,
    /** Pity bonus if pet has no augments */
    PITY_BONUS: 0.10
  },

  /** Merge augment probabilities */
  MERGE: {
    /** Base probability for new augment on merge (30%) */
    NEW_AUGMENT_PROBABILITY: 0.30,
    /** Threshold for guaranteed new augment (both parents have this many+) */
    GUARANTEED_THRESHOLD: 2
  },

  /** Probability to use Gemini generation for unique augment */
  GEMINI_GENERATION_PROBABILITY: 0.10
};

export default CONFIG;
