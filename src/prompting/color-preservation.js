/**
 * Color preservation utilities for consistent pet coloring across evolutions.
 * No AI SDK dependencies.
 * @module prompting/color-preservation
 */

/**
 * Generate color preservation guidance for evolution prompts.
 * This ensures the evolved pet maintains its original color palette.
 *
 * @param {string} colorPalette - The original color palette
 * @returns {string} Color preservation guidance text
 */
export const getColorPreservationGuidance = (colorPalette) => {
  if (!colorPalette) {
    return `COLOR PRESERVATION (CRITICAL): Maintain the EXACT same color scheme as the previous stage. The pet's color identity must not change.`;
  }

  return `COLOR PRESERVATION (ABSOLUTELY CRITICAL - DO NOT IGNORE):
This creature's color palette is "${colorPalette}" - this MUST NOT change.
- The evolved form MUST be the SAME COLOR as the previous stage
- A green creature stays GREEN, a blue creature stays BLUE, etc.
- DO NOT change the hue - a forest green pet cannot become red, orange, purple, or any other color
- Only allowed changes: slightly darker/lighter shades, more/less saturation of the SAME color
- The creature must be IMMEDIATELY recognizable as the same pet by its ${colorPalette} coloring
- WRONG: Changing a green pet to red/orange/purple
- RIGHT: A green pet stays green, just with richer or more varied green tones`;
};

/**
 * Generate a color reminder for the start of prompts.
 * This is placed at the beginning to ensure maximum attention.
 *
 * @param {string} colorPalette - The original color palette
 * @returns {string} Color reminder text
 */
export const getColorReminder = (colorPalette) => {
  if (!colorPalette) {
    return '';
  }

  return `[MANDATORY COLOR: ${colorPalette.toUpperCase()}] - This creature is ${colorPalette} colored and MUST REMAIN ${colorPalette.toUpperCase()} in this evolution. DO NOT change to any other color.`;
};

/**
 * Generate color emphasis for image prompts.
 * @param {string} colorPalette - The original color palette
 * @returns {string} Color emphasis text
 */
export const getColorEmphasis = (colorPalette) => {
  if (!colorPalette) {
    return 'SAME AS INPUT';
  }

  return `**COLOR: ${colorPalette.toUpperCase()}** - The creature MUST be this color. NOT red, NOT orange, NOT purple, NOT blue unless that was the original color.`;
};

/**
 * Check if a trait description might suggest a color change.
 * Useful for filtering or warning about potentially problematic traits.
 *
 * @param {string} trait - The trait description
 * @returns {boolean} True if the trait might cause color drift
 */
export const mightCauseColorDrift = (trait) => {
  const colorChangeKeywords = [
    'purple', 'blue', 'twilight', 'rainbow', 'multicolor',
    'color-changing', 'chromatic shift', 'hue shift'
  ];

  const lowerTrait = trait.toLowerCase();
  return colorChangeKeywords.some(keyword => lowerTrait.includes(keyword));
};

/**
 * Filter traits to remove ones that might cause color drift.
 * @param {string[]} traits - Array of trait descriptions
 * @param {string} colorPalette - The original color palette
 * @returns {string[]} Filtered traits
 */
export const filterColorSafeTraits = (traits, colorPalette) => {
  if (!colorPalette) return traits;

  // If the color palette includes the keyword, don't filter it out
  const paletteWords = colorPalette.toLowerCase().split(' ');

  return traits.filter(trait => {
    if (!mightCauseColorDrift(trait)) return true;

    // Allow if the trait's color word is in the palette
    const lowerTrait = trait.toLowerCase();
    return paletteWords.some(word => lowerTrait.includes(word));
  });
};

export default {
  getColorPreservationGuidance,
  getColorReminder,
  getColorEmphasis,
  mightCauseColorDrift,
  filterColorSafeTraits
};
