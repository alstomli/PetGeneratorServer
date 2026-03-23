/**
 * Merge prompt templates for combining two pets.
 * No AI SDK dependencies.
 * @module prompting/templates/merge
 */

import { buildMergedCreatureDesign } from '../../core/merge/outcome-selector.js';
import { buildAugmentVisualDescription } from '../augment-visuals.js';

/**
 * Generate the full merge image prompt.
 * @param {Object} params - Merge parameters
 * @param {Object} params.pet1 - First parent pet
 * @param {Object} params.pet2 - Second parent pet
 * @param {Object} params.outcome - Merge outcome from selectMergeOutcome
 * @param {Object[]} [params.augments] - Augments for the merged pet
 * @returns {{prompt: string, metadata: string}} Prompt and metadata
 */
export const generateMergePrompt = ({ pet1, pet2, outcome, augments = [] }) => {
  const { mergedAttributes, isRare, rareType, rareModifiers } = outcome;
  const creatureDesign = buildMergedCreatureDesign(pet1, pet2, outcome);
  const augmentSection = buildAugmentVisualDescription(augments);

  let rareSection = '';
  if (isRare && rareModifiers) {
    rareSection = `
RARE OUTCOME - ${rareType.toUpperCase()}:
This is a SPECIAL rare creature. Apply these visual effects:
- AURA EFFECT: ${rareModifiers.auraEffect}
- SPECIAL FEATURES: ${rareModifiers.specialFeatures.join(', ')}
- COLOR ENHANCEMENT: ${rareModifiers.colorEnhancement}
Make these rare qualities PROMINENTLY VISIBLE and STRIKING.
`;
  }

  // Build augment effects reminder
  const augmentReminder = augments.length > 0
    ? `\n- AUGMENT EFFECTS: Display ${augments.map(a => a.name).join(', ')} effects prominently (inherited from parents)`
    : '';

  const imagePrompt = `IMPORTANT: Generate exactly ONE single creature. Do NOT show two creatures, do NOT show parent creatures, do NOT show multiple views.

${creatureDesign}
${augmentSection}
${rareSection}
ARTISTIC STYLE: Cartoony Pokemon-style digital art, simple clean lines, bright flat colors, NOT realistic - keep it cute and stylized like a Pokemon or Digimon
COMPOSITION: EXACTLY ONE creature portrait, centered, full body visible - NOT two creatures side by side
BACKGROUND: Pure white or transparent background only - NO environment, NO scenery, NO ground, NO shadows on ground
AGE: Baby/infant with oversized head and eyes, chubby proportions
APPEAL: Maximum cuteness for ages 7-11, non-threatening, inspire nurturing instinct

MERGE RESULT (ONE CREATURE ONLY):
- This is the OFFSPRING - a single new baby creature that inherited traits from both parents
- Do NOT show the two parent creatures - only show their ONE child
- The ${mergedAttributes.colorPalette} color scheme should be dominant
- ${mergedAttributes.animals.length ? `Blend features from ${mergedAttributes.animals.join(' and ')} into ONE creature` : 'Unique fantasy creature features'}
- ${isRare ? `PROMINENTLY display the ${rareType} rare characteristics` : 'Standard baby proportions and cuteness'}

CRITICAL REQUIREMENTS:
- EXACTLY ONE CREATURE - not two, not a pair, not twins - ONE single baby creature
- NO TEXT of any kind - no labels, no titles, no captions, no watermarks, no words
- NO writing or letters anywhere in the image
- ONLY the single creature itself - nothing else
- Clean isolated character art suitable for a game asset
- SINGLE VIEW ONLY - one creature, one angle, NO multiple views, NO turnarounds, NO character sheets
- Do NOT interpret "merge" as showing two creatures together - show only the ONE resulting offspring${augmentReminder}

Create exactly ONE ${mergedAttributes.style} baby creature that is the magical offspring of two parent pets. Show only this ONE new creature, not the parents.`;

  return { prompt: imagePrompt, metadata: creatureDesign };
};

/**
 * Generate a simplified merge description for display.
 * @param {Object} pet1 - First parent pet
 * @param {Object} pet2 - Second parent pet
 * @param {Object} outcome - Merge outcome
 * @returns {string} Human-readable merge description
 */
export const getMergeDescription = (pet1, pet2, outcome) => {
  const { mergedAttributes, isRare, rareType } = outcome;

  let description = `A baby ${mergedAttributes.style} pet born from the fusion of a ${pet1.style} ${pet1.colorPalette} pet and a ${pet2.style} ${pet2.colorPalette} pet.`;

  if (mergedAttributes.animals.length) {
    description += ` Features traits from ${mergedAttributes.animals.join(' and ')}.`;
  }

  if (isRare) {
    description += ` This is a RARE ${rareType.toUpperCase()} creature with special characteristics!`;
  }

  return description;
};

export default generateMergePrompt;
