/**
 * Evolution path rules and descriptions.
 * Pure data and functions - no framework dependencies.
 * @module core/evolution/rules
 */

import { STAGE_NAMES, PATH_DESCRIPTIONS } from '../config.js';

/**
 * Get the description for an evolution path with color context.
 * @param {'gentle'|'bold'|'curious'} path - The evolution path
 * @param {string} [colorPalette] - The original color palette
 * @returns {string} The path description
 */
export const getPathDescription = (path, colorPalette) => {
  if (path === 'curious' && colorPalette) {
    return `transforms with DRAMATIC PHYSICAL CHANGES - MUCH larger, MORE elaborate mystical features, PROMINENT magical appendages (multiple tails, wings, crystals), GLOWING elements in THE ORIGINAL COLOR (${colorPalette}). Changes must be as VISIBLE and STRIKING as bold path. IMPORTANT: "Curious" does NOT mean purple/blue/twilight - keep the ${colorPalette} color scheme!`;
  }
  return PATH_DESCRIPTIONS[path] || PATH_DESCRIPTIONS.gentle;
};

/**
 * Get magnitude calibration guidance for a specific stage.
 * @param {number} evolutionStage - Target evolution stage (2 or 3)
 * @returns {string} Magnitude guidance text
 */
export const getMagnitudeGuidance = (evolutionStage) => {
  if (evolutionStage === 2) {
    return `
MAGNITUDE CALIBRATION FOR STAGE 2 (Baby → Juvenile):
- SIZE: Creature MUST be NOTICEABLY 1.5x-1.7x larger - this should be OBVIOUS at first glance
- HEAD-TO-BODY RATIO: Head should be 1/3 of total body height (down from 1/2) - this ratio change is CRITICAL
- BODY CHANGES: Transform from baby chub to leaner, athletic build. NO baby fat remaining.
- VISUAL IMPACT: Anyone looking should IMMEDIATELY see this is a different, more mature stage
- STANCE CHANGES: If quadruped, may become more upright/taller. Posture should look more confident.
- FEATURE EMERGENCE: New features should be CLEARLY VISIBLE (not tiny buds - actual emerging features)
- REFERENCE: Like Charmander→Charmeleon or Bulbasaur→Ivysaur - the difference should be THIS obvious
- MINIMUM CHANGE REQUIREMENT: At least 3-4 major visible differences from baby stage
`;
  }

  return `
MAGNITUDE CALIBRATION FOR STAGE 3 (Juvenile → Adult):
- SIZE: Creature MUST be DRAMATICALLY 2x-2.5x larger than juvenile - MASSIVE size increase
- HEAD-TO-BODY RATIO: Head should be 1/5 to 1/6 of total body height - adult proportions
- BODY TRANSFORMATION: Complete metamorphosis - stockier, more powerful, fully developed muscles
- VISUAL IMPACT: This should look RADICALLY different - like a different species while keeping signature features
- STANCE REVOLUTION: ENCOURAGED to change stance completely (quadruped→bipedal, add wings, change posture entirely)
- FEATURE EXPLOSION: ALL features fully realized - wings spread, horns prominent, powers visible
- REFERENCE: Like Charmeleon→Charizard or Ivysaur→Venusaur - THAT level of transformation
- MINIMUM CHANGE REQUIREMENT: At least 5-6 MAJOR visible transformations from juvenile stage
- DRAMATIC EMPHASIS: This evolution should be SHOCKING in how different it looks
`;
};

/**
 * Get size emphasis text for a specific stage.
 * @param {number} evolutionStage - Target evolution stage (2 or 3)
 * @returns {string} Size emphasis text
 */
export const getSizeEmphasis = (evolutionStage) => {
  if (evolutionStage === 2) {
    return 'OBVIOUSLY 1.5-1.7x LARGER - like comparing a kitten to a young cat - VERY NOTICEABLE size difference';
  }
  return 'MASSIVELY 2-2.5x LARGER than previous - like comparing a young cat to a large wolf - EXTREME size increase';
};

/**
 * Get proportion emphasis text for a specific stage.
 * @param {number} evolutionStage - Target evolution stage (2 or 3)
 * @returns {string} Proportion emphasis text
 */
export const getProportionEmphasis = (evolutionStage) => {
  if (evolutionStage === 2) {
    return 'Head ratio MUST be 1/3 of body (was 1/2 in baby) - NO baby fat, leaner athletic build - think Charmeleon';
  }
  return 'Head ratio MUST be 1/5 to 1/6 of body - FULL adult build, powerful muscles - think Charizard or Venusaur';
};

/**
 * Get change emphasis text for a specific stage.
 * @param {number} evolutionStage - Target evolution stage (2 or 3)
 * @returns {string} Change emphasis text
 */
export const getChangeEmphasis = (evolutionStage) => {
  if (evolutionStage === 2) {
    return 'POKEMON-LEVEL EVOLUTION: Like Bulbasaur→Ivysaur or Charmander→Charmeleon - THAT LEVEL of visible change is REQUIRED';
  }
  return 'FINAL POKEMON EVOLUTION: Like Ivysaur→Venusaur or Charmeleon→Charizard - DRAMATIC, SHOCKING transformation REQUIRED';
};

/**
 * Get the stage name for display.
 * @param {number} stage - The stage number (1-3)
 * @returns {string} The stage name
 */
export const getStageName = (stage) => {
  return STAGE_NAMES[stage] || 'Unknown';
};

/**
 * Check if a pet can evolve.
 * @param {number} currentStage - Current stage
 * @param {number} maxStages - Maximum stages
 * @returns {boolean} Whether the pet can evolve
 */
export const canEvolve = (currentStage, maxStages) => {
  return currentStage < maxStages;
};

export default {
  getPathDescription,
  getMagnitudeGuidance,
  getSizeEmphasis,
  getProportionEmphasis,
  getChangeEmphasis,
  getStageName,
  canEvolve
};
