/**
 * Deterministic merge outcome selection.
 * Pure functions - no framework dependencies.
 * @module core/merge/outcome-selector
 */

import { checkMergeCompatibility, calculateMergedAttributes, getInheritedTraits } from './rules.js';
import { determineRareOutcome, getRareVisualModifiers } from './rare-outcomes.js';

/**
 * Select the outcome for a pet merge operation.
 * This determines all attributes of the merged pet without generating images.
 *
 * @param {Object} pet1 - First parent pet
 * @param {Object} pet2 - Second parent pet
 * @param {number} [seed] - Optional seed for deterministic testing
 * @returns {{
 *   canMerge: boolean,
 *   reason?: string,
 *   mergedAttributes?: Object,
 *   isRare: boolean,
 *   rareType?: string,
 *   rareModifiers?: Object,
 *   inheritedTraits: string[]
 * }} Merge outcome
 */
export const selectMergeOutcome = (pet1, pet2, seed) => {
  // Check compatibility first
  const compatibility = checkMergeCompatibility(pet1, pet2);

  if (!compatibility.canMerge) {
    return {
      canMerge: false,
      reason: compatibility.reason,
      isRare: false,
      inheritedTraits: []
    };
  }

  // Calculate merged attributes
  const mergedAttributes = calculateMergedAttributes(pet1, pet2);

  // Determine if rare outcome
  const rareResult = determineRareOutcome(pet1, pet2, seed);

  // Get inherited traits
  const inheritedTraits = getInheritedTraits(pet1, pet2);

  // Build result
  const result = {
    canMerge: true,
    mergedAttributes,
    isRare: rareResult.isRare,
    inheritedTraits
  };

  if (rareResult.isRare) {
    result.rareType = rareResult.rareType;
    result.rareModifiers = getRareVisualModifiers(rareResult.rareType);
  }

  return result;
};

/**
 * Build the creature design description for the merged pet.
 * @param {Object} pet1 - First parent pet
 * @param {Object} pet2 - Second parent pet
 * @param {Object} outcome - The merge outcome from selectMergeOutcome
 * @returns {string} The creature design description
 */
export const buildMergedCreatureDesign = (pet1, pet2, outcome) => {
  const { mergedAttributes, isRare, rareType, rareModifiers, inheritedTraits } = outcome;

  let design = `Generate exactly ONE newly born ${mergedAttributes.style} baby fantasy creature (Stage 1 of 3).

THIS IS A SINGLE CREATURE - the offspring/child of two parents. Do NOT show two creatures or the parents themselves.

ORIGIN: This ONE creature inherited traits from two parent pets (do not show the parents):
- From Parent 1: ${pet1.style} characteristics with ${pet1.colorPalette} color influence
- From Parent 2: ${pet2.style} characteristics with ${pet2.colorPalette} color influence

COLORS: ${mergedAttributes.colorPalette} color palette - blended into this ONE creature
ANIMALS: ${mergedAttributes.animals.length ? mergedAttributes.animals.join(' and ') + ' features combined in ONE body' : 'unique fantasy creature'}

INHERITED TRAITS (all combined into ONE creature):
${inheritedTraits.map(t => `- ${t}`).join('\n')}
`;

  if (isRare && rareModifiers) {
    design += `
RARE OUTCOME: ${rareType.toUpperCase()}
This is a special rare creature with unique characteristics:
- AURA: ${rareModifiers.auraEffect}
- SPECIAL FEATURES: ${rareModifiers.specialFeatures.join(', ')}
- COLOR ENHANCEMENT: ${rareModifiers.colorEnhancement}
`;
  }

  design += `
SIGNATURE FEATURES: Unique combination of both parents' distinctive features
BODY STRUCTURE: Baby proportions with oversized head (1/2 of body height)
APPEAL: Maximum cuteness for ages 7-11, non-threatening, inspire nurturing instinct

This creature shows clear heritage from both parents while being entirely unique.`;

  return design;
};

/**
 * Get a summary of the merge outcome for display.
 * @param {Object} outcome - The merge outcome
 * @returns {string} Human-readable summary
 */
export const getMergeOutcomeSummary = (outcome) => {
  if (!outcome.canMerge) {
    return `Cannot merge: ${outcome.reason}`;
  }

  const { mergedAttributes, isRare, rareType } = outcome;
  let summary = `A ${mergedAttributes.style} baby pet with ${mergedAttributes.colorPalette} colors`;

  if (mergedAttributes.animals.length) {
    summary += ` featuring ${mergedAttributes.animals.join(' and ')} traits`;
  }

  if (isRare) {
    summary += ` (RARE ${rareType.toUpperCase()} OUTCOME!)`;
  }

  return summary;
};

export default {
  selectMergeOutcome,
  buildMergedCreatureDesign,
  getMergeOutcomeSummary
};
