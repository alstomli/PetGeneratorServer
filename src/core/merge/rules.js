/**
 * Merge compatibility rules.
 * Pure functions - no framework dependencies.
 * @module core/merge/rules
 */

import { MERGE_CONFIG } from '../config.js';
import { shareLineage } from '../pet/model.js';

/**
 * Check if two pets can be merged together.
 * @param {Object} pet1 - First pet
 * @param {Object} pet2 - Second pet
 * @returns {{canMerge: boolean, reason?: string, rareChanceModifier: number}} Compatibility result
 */
export const checkMergeCompatibility = (pet1, pet2) => {
  // Cannot merge same pet
  if (pet1.id === pet2.id) {
    return {
      canMerge: false,
      reason: 'Cannot merge a pet with itself',
      rareChanceModifier: 0
    };
  }

  // Cannot merge pets of different stages
  if (pet1.stage !== pet2.stage) {
    return {
      canMerge: false,
      reason: `Pets must be the same stage to merge (Stage ${pet1.stage} vs Stage ${pet2.stage})`,
      rareChanceModifier: 0
    };
  }

  // Cannot merge pets from the same lineage (inbreeding prevention)
  if (shareLineage(pet1, pet2)) {
    return {
      canMerge: false,
      reason: 'Cannot merge pets from the same family lineage',
      rareChanceModifier: 0
    };
  }

  // Calculate rare chance modifier based on various factors
  let rareChanceModifier = 0;

  // Bonus for higher stages
  const minStage = Math.min(pet1.stage, pet2.stage);
  if (minStage >= MERGE_CONFIG.MIN_STAGE_FOR_RARE) {
    const stageBonus = (minStage - MERGE_CONFIG.MIN_STAGE_FOR_RARE + 1) * MERGE_CONFIG.STAGE_BONUS_PER_LEVEL;
    rareChanceModifier += stageBonus;
  }

  // Bonus for matching evolution paths
  if (pet1.evolutionPath && pet2.evolutionPath && pet1.evolutionPath === pet2.evolutionPath) {
    rareChanceModifier += MERGE_CONFIG.MATCHING_PATH_BONUS;
  }

  // Bonus for style diversity
  if (pet1.style !== pet2.style) {
    rareChanceModifier += MERGE_CONFIG.STYLE_DIVERSITY_BONUS;
  }

  return {
    canMerge: true,
    rareChanceModifier
  };
};

/**
 * Calculate merged attributes from two parent pets.
 * @param {Object} pet1 - First pet
 * @param {Object} pet2 - Second pet
 * @returns {{style: string, colorPalette: string, animals: string[]}} Merged attributes
 */
export const calculateMergedAttributes = (pet1, pet2) => {
  // Style: higher stage parent's style, or random if equal
  let style;
  if (pet1.stage > pet2.stage) {
    style = pet1.style;
  } else if (pet2.stage > pet1.stage) {
    style = pet2.style;
  } else {
    style = Math.random() > 0.5 ? pet1.style : pet2.style;
  }

  // Color palette: weighted blend based on dominant colors
  // For now, take the one from the more evolved pet, or mix
  let colorPalette;
  if (pet1.stage > pet2.stage) {
    colorPalette = pet1.colorPalette;
  } else if (pet2.stage > pet1.stage) {
    colorPalette = pet2.colorPalette;
  } else {
    colorPalette = Math.random() > 0.5 ? pet1.colorPalette : pet2.colorPalette;
  }

  // Animals: combine unique animals from both parents (max 2)
  const allAnimals = [...new Set([...(pet1.animals || []), ...(pet2.animals || [])])];
  const animals = allAnimals.slice(0, 2);

  return {
    style,
    colorPalette,
    animals
  };
};

/**
 * Get traits that will be inherited from parents.
 * @param {Object} pet1 - First pet
 * @param {Object} pet2 - Second pet
 * @returns {string[]} List of inherited trait descriptions
 */
export const getInheritedTraits = (pet1, pet2) => {
  const traits = [];

  // Inherit evolution path traits if present
  if (pet1.evolutionPath) {
    traits.push(`${pet1.evolutionPath} characteristics from parent 1`);
  }
  if (pet2.evolutionPath) {
    traits.push(`${pet2.evolutionPath} characteristics from parent 2`);
  }

  // Inherit signature features from metadata
  if (pet1.metadata) {
    traits.push('signature features from parent 1');
  }
  if (pet2.metadata) {
    traits.push('signature features from parent 2');
  }

  return traits;
};

/**
 * Check if both pets meet the minimum stage requirement for rare outcomes.
 * @param {Object} pet1 - First pet
 * @param {Object} pet2 - Second pet
 * @returns {boolean} True if eligible for rare outcomes
 */
export const isEligibleForRare = (pet1, pet2) => {
  return pet1.stage >= MERGE_CONFIG.MIN_STAGE_FOR_RARE &&
         pet2.stage >= MERGE_CONFIG.MIN_STAGE_FOR_RARE;
};

export default {
  checkMergeCompatibility,
  calculateMergedAttributes,
  getInheritedTraits,
  isEligibleForRare
};
