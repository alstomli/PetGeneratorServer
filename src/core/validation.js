/**
 * Input validation utilities.
 * Pure functions - no framework dependencies.
 * @module core/validation
 */

import { CONFIG } from './config.js';

/**
 * Validate pet generation parameters
 * @param {Object} params - Parameters to validate
 * @param {string} params.style - Pet style
 * @param {string} [params.colorPalette] - Color palette
 * @param {string[]} [params.animals] - Animal inspirations
 * @param {number} params.maxStages - Maximum evolution stages
 * @returns {{valid: boolean, error?: string}} Validation result
 */
export const validatePetParams = ({ style, colorPalette, animals, maxStages }) => {
  if (!CONFIG.VALID_STYLES.includes(style?.toLowerCase())) {
    return { valid: false, error: `Style must be one of: ${CONFIG.VALID_STYLES.join(', ')}` };
  }

  if (colorPalette && !CONFIG.VALID_COLORS.includes(colorPalette.toLowerCase())) {
    return { valid: false, error: `Color palette must be one of: ${CONFIG.VALID_COLORS.join(', ')}` };
  }

  if (animals && animals.length > 2) {
    return { valid: false, error: 'Maximum 2 animals allowed for kid-friendly fusion' };
  }

  if (animals) {
    const invalidAnimals = animals.filter(animal => !CONFIG.VALID_ANIMALS.includes(animal.toLowerCase()));
    if (invalidAnimals.length > 0) {
      return { valid: false, error: `Invalid animals: ${invalidAnimals.join(', ')}. Valid animals: ${CONFIG.VALID_ANIMALS.join(', ')}` };
    }
  }

  if (maxStages !== CONFIG.MAX_STAGES) {
    return { valid: false, error: `Evolution stages must be exactly ${CONFIG.MAX_STAGES} for optimal progression control` };
  }

  return { valid: true };
};

/**
 * Validate evolution parameters
 * @param {Object} params - Parameters to validate
 * @param {number} params.currentStage - Current evolution stage
 * @param {number} params.maxStages - Maximum stages
 * @param {string} params.evolutionPath - Evolution path
 * @returns {{valid: boolean, error?: string}} Validation result
 */
export const validateEvolutionParams = ({ currentStage, maxStages, evolutionPath }) => {
  if (currentStage >= maxStages) {
    return { valid: false, error: 'Pet is already at maximum evolution stage' };
  }

  if (!CONFIG.EVOLUTION_PATHS.includes(evolutionPath)) {
    return { valid: false, error: `Evolution path must be one of: ${CONFIG.EVOLUTION_PATHS.join(', ')}` };
  }

  return { valid: true };
};

/**
 * Validate merge parameters
 * @param {Object} params - Parameters to validate
 * @param {Object} params.pet1 - First parent pet
 * @param {Object} params.pet2 - Second parent pet
 * @returns {{valid: boolean, error?: string}} Validation result
 */
export const validateMergeParams = ({ pet1, pet2 }) => {
  if (!pet1 || !pet2) {
    return { valid: false, error: 'Both pets are required for merging' };
  }

  if (pet1.id === pet2.id) {
    return { valid: false, error: 'Cannot merge a pet with itself' };
  }

  return { valid: true };
};
