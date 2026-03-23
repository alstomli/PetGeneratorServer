/**
 * Rarity calculation system based on augment weights.
 * @module core/augments/rarity
 */

/**
 * Rarity tier definitions.
 * @readonly
 * @enum {Object}
 */
export const RARITY_TIERS = {
  common: {
    id: 'common',
    name: 'Common',
    minWeight: 0,
    maxWeight: 0,
    color: '#9e9e9e', // Gray
    badgeClass: 'rarity-common'
  },
  uncommon: {
    id: 'uncommon',
    name: 'Uncommon',
    minWeight: 1,
    maxWeight: 2,
    color: '#4caf50', // Green
    badgeClass: 'rarity-uncommon'
  },
  rare: {
    id: 'rare',
    name: 'Rare',
    minWeight: 3,
    maxWeight: 4,
    color: '#2196f3', // Blue
    badgeClass: 'rarity-rare'
  },
  legendary: {
    id: 'legendary',
    name: 'Legendary',
    minWeight: 5,
    maxWeight: 6,
    color: '#9c27b0', // Purple
    badgeClass: 'rarity-legendary'
  },
  mythical: {
    id: 'mythical',
    name: 'Mythical',
    minWeight: 7,
    maxWeight: Infinity,
    color: 'rainbow', // Special rainbow effect
    badgeClass: 'rarity-mythical'
  }
};

/**
 * Calculate total weight from augments.
 * @param {Object[]} augments - Array of augment objects
 * @returns {number} Total weight
 */
export const calculateTotalWeight = (augments) => {
  if (!augments || !Array.isArray(augments)) {
    return 0;
  }
  return augments.reduce((total, aug) => total + (aug.weight || 0), 0);
};

/**
 * Calculate rarity tier from augments.
 * @param {Object[]} augments - Array of augment objects
 * @returns {Object} Rarity tier object
 */
export const calculateRarity = (augments) => {
  const totalWeight = calculateTotalWeight(augments);

  if (totalWeight >= RARITY_TIERS.mythical.minWeight) {
    return RARITY_TIERS.mythical;
  }
  if (totalWeight >= RARITY_TIERS.legendary.minWeight) {
    return RARITY_TIERS.legendary;
  }
  if (totalWeight >= RARITY_TIERS.rare.minWeight) {
    return RARITY_TIERS.rare;
  }
  if (totalWeight >= RARITY_TIERS.uncommon.minWeight) {
    return RARITY_TIERS.uncommon;
  }
  return RARITY_TIERS.common;
};

/**
 * Get rarity tier by ID.
 * @param {string} rarityId - Rarity tier ID
 * @returns {Object} Rarity tier object
 */
export const getRarityById = (rarityId) => {
  return RARITY_TIERS[rarityId] || RARITY_TIERS.common;
};

/**
 * Get display information for a rarity.
 * @param {Object} rarity - Rarity tier object
 * @returns {Object} Display info with name, color, and CSS class
 */
export const getRarityDisplay = (rarity) => {
  const tier = typeof rarity === 'string' ? getRarityById(rarity) : rarity;

  return {
    name: tier.name,
    color: tier.color,
    badgeClass: tier.badgeClass,
    isRainbow: tier.id === 'mythical'
  };
};

/**
 * Get rarity from total weight directly.
 * @param {number} totalWeight - Total augment weight
 * @returns {Object} Rarity tier object
 */
export const getRarityFromWeight = (totalWeight) => {
  if (totalWeight >= RARITY_TIERS.mythical.minWeight) {
    return RARITY_TIERS.mythical;
  }
  if (totalWeight >= RARITY_TIERS.legendary.minWeight) {
    return RARITY_TIERS.legendary;
  }
  if (totalWeight >= RARITY_TIERS.rare.minWeight) {
    return RARITY_TIERS.rare;
  }
  if (totalWeight >= RARITY_TIERS.uncommon.minWeight) {
    return RARITY_TIERS.uncommon;
  }
  return RARITY_TIERS.common;
};

/**
 * Get all rarity tiers sorted by weight.
 * @returns {Object[]} Array of rarity tiers
 */
export const getAllRarityTiers = () => {
  return [
    RARITY_TIERS.common,
    RARITY_TIERS.uncommon,
    RARITY_TIERS.rare,
    RARITY_TIERS.legendary,
    RARITY_TIERS.mythical
  ];
};

/**
 * Check if augments qualify for a specific rarity.
 * @param {Object[]} augments - Array of augment objects
 * @param {string} rarityId - Rarity tier ID to check
 * @returns {boolean} True if augments meet or exceed the rarity threshold
 */
export const meetsRarityThreshold = (augments, rarityId) => {
  const totalWeight = calculateTotalWeight(augments);
  const tier = getRarityById(rarityId);
  return totalWeight >= tier.minWeight;
};

export default {
  RARITY_TIERS,
  calculateRarity,
  calculateTotalWeight,
  getRarityDisplay,
  getRarityById,
  getRarityFromWeight,
  getAllRarityTiers,
  meetsRarityThreshold
};
