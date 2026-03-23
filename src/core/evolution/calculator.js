/**
 * Evolution stage progression logic.
 * Pure functions - no framework dependencies.
 * @module core/evolution/calculator
 */

import { CONFIG } from '../config.js';

/**
 * Calculate the next evolution stage.
 * @param {number} currentStage - Current evolution stage
 * @param {number} [maxStages] - Maximum stages (defaults to CONFIG.MAX_STAGES)
 * @returns {number|null} The next stage or null if at max
 */
export const calculateNextStage = (currentStage, maxStages = CONFIG.MAX_STAGES) => {
  if (currentStage >= maxStages) {
    return null;
  }
  return currentStage + 1;
};

/**
 * Get evolution progress as a percentage.
 * @param {number} currentStage - Current evolution stage
 * @param {number} [maxStages] - Maximum stages (defaults to CONFIG.MAX_STAGES)
 * @returns {number} Progress percentage (0-100)
 */
export const getEvolutionProgress = (currentStage, maxStages = CONFIG.MAX_STAGES) => {
  return Math.round((currentStage / maxStages) * 100);
};

/**
 * Calculate how many evolutions remain.
 * @param {number} currentStage - Current evolution stage
 * @param {number} [maxStages] - Maximum stages (defaults to CONFIG.MAX_STAGES)
 * @returns {number} Number of remaining evolutions
 */
export const getRemainingEvolutions = (currentStage, maxStages = CONFIG.MAX_STAGES) => {
  return Math.max(0, maxStages - currentStage);
};

/**
 * Check if the pet is at final evolution.
 * @param {number} currentStage - Current evolution stage
 * @param {number} [maxStages] - Maximum stages (defaults to CONFIG.MAX_STAGES)
 * @returns {boolean} True if at final evolution
 */
export const isFullyEvolved = (currentStage, maxStages = CONFIG.MAX_STAGES) => {
  return currentStage >= maxStages;
};

/**
 * Get body proportion guidance for a specific stage.
 * @param {number} stage - The stage number
 * @returns {{headRatio: string, bodyType: string, limbDescription: string}} Proportion guidance
 */
export const getStageProportions = (stage) => {
  const proportions = {
    1: {
      headRatio: '1/2 of body height',
      bodyType: 'Chubby, round baby proportions',
      limbDescription: 'Short, stubby limbs'
    },
    2: {
      headRatio: '1/3 of body height',
      bodyType: 'Leaner, athletic build, lost baby fat',
      limbDescription: 'Longer, more capable limbs'
    },
    3: {
      headRatio: '1/5 to 1/6 of body height',
      bodyType: 'Fully developed adult musculature',
      limbDescription: 'Fully extended, powerful limbs'
    }
  };

  return proportions[stage] || proportions[1];
};

/**
 * Get size multiplier for evolution stage relative to baby.
 * @param {number} stage - The stage number
 * @returns {{min: number, max: number}} Size multiplier range
 */
export const getSizeMultiplier = (stage) => {
  const multipliers = {
    1: { min: 1, max: 1 },
    2: { min: 1.5, max: 1.7 },
    3: { min: 2, max: 2.5 }
  };

  return multipliers[stage] || multipliers[1];
};

export default {
  calculateNextStage,
  getEvolutionProgress,
  getRemainingEvolutions,
  isFullyEvolved,
  getStageProportions,
  getSizeMultiplier
};
