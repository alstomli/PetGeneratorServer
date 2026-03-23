/**
 * Augment visual description builder for prompts.
 * @module prompting/augment-visuals
 */

/**
 * Build a visual description section for augments.
 * @param {Object[]} augments - Array of augment objects
 * @returns {string} Visual description for prompts, or empty string if no augments
 */
export const buildAugmentVisualDescription = (augments) => {
  if (!augments || augments.length === 0) {
    return '';
  }

  const augmentLines = augments.map(aug => {
    const effectsList = aug.visualEffects.join(', ');
    return `  - ${aug.name}: ${effectsList}`;
  });

  return `
SPECIAL AUGMENT EFFECTS (must be visibly incorporated):
${augmentLines.join('\n')}
These augment effects should be PROMINENTLY VISIBLE on the creature, blending naturally with its design.`;
};

/**
 * Build a brief augment effects list for inclusion in prompts.
 * @param {Object[]} augments - Array of augment objects
 * @returns {string} Comma-separated list of all visual effects
 */
export const buildAugmentEffectsList = (augments) => {
  if (!augments || augments.length === 0) {
    return '';
  }

  const allEffects = augments.flatMap(aug => aug.visualEffects);
  return allEffects.join(', ');
};

/**
 * Get a single augment's visual description for emphasis.
 * @param {Object} augment - Single augment object
 * @returns {string} Description of the augment's visual effects
 */
export const getAugmentEmphasis = (augment) => {
  if (!augment) {
    return '';
  }

  return `NEW AUGMENT - ${augment.name.toUpperCase()}: This creature has just gained the ${augment.name} augment! Make these effects PROMINENTLY VISIBLE: ${augment.visualEffects.join(', ')}.`;
};

/**
 * Build combined augment section for new acquisition.
 * Shows existing augments plus emphasizes new one.
 * @param {Object[]} existingAugments - Already owned augments
 * @param {Object|null} newAugment - Newly acquired augment
 * @returns {string} Combined augment description
 */
export const buildAugmentSectionWithNew = (existingAugments = [], newAugment = null) => {
  const parts = [];

  // Add existing augments
  if (existingAugments.length > 0) {
    parts.push(buildAugmentVisualDescription(existingAugments));
  }

  // Emphasize new augment
  if (newAugment) {
    parts.push(`
${getAugmentEmphasis(newAugment)}`);
  }

  return parts.join('\n');
};

/**
 * Get augment category icon for display.
 * @param {string} category - Augment category
 * @returns {string} Emoji icon for the category
 */
export const getAugmentCategoryIcon = (category) => {
  const icons = {
    elemental: '🔥',
    celestial: '⭐',
    nature: '🌿',
    spirit: '👻',
    arcane: '✨'
  };
  return icons[category] || '💎';
};

/**
 * Get a short description of augments for display.
 * @param {Object[]} augments - Array of augment objects
 * @returns {string} Short description like "Fire-Blessed, Starforged"
 */
export const getAugmentSummary = (augments) => {
  if (!augments || augments.length === 0) {
    return 'None';
  }

  return augments.map(aug => aug.name).join(', ');
};

export default {
  buildAugmentVisualDescription,
  buildAugmentEffectsList,
  getAugmentEmphasis,
  buildAugmentSectionWithNew,
  getAugmentCategoryIcon,
  getAugmentSummary
};
