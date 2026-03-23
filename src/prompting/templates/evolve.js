/**
 * Evolution prompt templates.
 * No AI SDK dependencies.
 * @module prompting/templates/evolve
 */

import { selectEvolutionTraits } from '../../core/traits/selector.js';
import { STAGE_NAMES } from '../../core/config.js';
import { getPathDescription } from '../../core/evolution/rules.js';
import {
  getColorPreservationGuidance,
  getColorReminder,
  getColorEmphasis
} from '../color-preservation.js';
import { buildAugmentSectionWithNew } from '../augment-visuals.js';

/**
 * Generate the evolved creature design description.
 * @param {Object} params - Evolution parameters
 * @param {number} params.evolutionStage - Target stage (2 or 3)
 * @param {string} params.evolutionPath - Evolution path
 * @param {string} params.previousMetadata - Previous stage metadata
 * @param {string} params.colorPalette - Original color palette
 * @param {Object[]} [params.existingAugments] - Augments from previous stage
 * @param {Object} [params.newAugment] - Newly acquired augment during evolution
 * @returns {string} Evolved creature design
 */
export const generateEvolvedDesign = ({ evolutionStage, evolutionPath, previousMetadata, colorPalette, existingAugments = [], newAugment = null }) => {
  const selectedTraits = selectEvolutionTraits(evolutionPath, evolutionStage);
  const pathDescription = getPathDescription(evolutionPath, colorPalette);
  const colorGuidance = getColorPreservationGuidance(colorPalette);
  const colorReminder = getColorReminder(colorPalette);
  const stageName = STAGE_NAMES[evolutionStage] || 'Unknown';
  const augmentSection = buildAugmentSectionWithNew(existingAugments, newAugment);

  // Check if pet has augments - augmented pets get extra visual flair
  const allAugments = newAugment ? [...existingAugments, newAugment] : existingAugments;
  const hasAugments = allAugments.length > 0;

  // Moderate intensity for base evolution, extra flair for augmented
  const bodyDescStage2 = 'leaner, more athletic build while keeping cute appeal';
  const bodyDescStage3 = 'fully mature proportions with confident presence';

  // Soften the trait intensity words for non-augmented pets
  const softenTraits = (traits) => {
    return traits.map(t => t
      .replace(/DRAMATICALLY /gi, '')
      .replace(/SIGNIFICANTLY /gi, '')
      .replace(/MUCH /gi, 'more ')
      .replace(/LARGE /gi, '')
      .replace(/BOLD /gi, '')
      .replace(/THICK /gi, '')
      .replace(/LONG /gi, 'longer ')
      .replace(/PROMINENT /gi, '')
      .replace(/MULTIPLE /gi, '')
      .replace(/ELABORATE /gi, '')
      .replace(/BRILLIANT /gi, '')
      .replace(/GLOWING /gi, '')
      .replace(/1\.5x size increase/gi, 'noticeable growth')
      .replace(/nearly doubles body size visually/gi, 'adds fluffiness')
      .replace(/clearly visible/gi, 'visible')
    ).join(', ');
  };

  return `${colorReminder}

EVOLVED CREATURE - STAGE ${evolutionStage} (${stageName.toUpperCase()})
COLOR PALETTE: ${colorPalette || 'same as input image'} - PRESERVE THIS EXACT COLOR

${colorGuidance}

SIGNATURE FEATURES (preserved but evolved): ${previousMetadata.substring(0, 200)}... evolved to ${evolutionStage === 2 ? 'juvenile' : 'adult'} proportions

EVOLUTION PATH: ${evolutionPath.toUpperCase()}
This creature ${pathDescription}
ALL CHANGES must use the ${colorPalette || 'original'} color palette - no color substitutions allowed.

SIZE COMPARISON: ${evolutionStage === 2 ? '1.4x larger than baby stage' : '2x larger than juvenile stage'}
HEAD-TO-BODY RATIO: ${evolutionStage === 2 ? '1/3 of body height' : '1/4 to 1/5 of body height'}

BODY STRUCTURE: Maintains core structure from previous stage but with ${evolutionStage === 2 ? bodyDescStage2 : bodyDescStage3}

EVOLUTION TRAITS (all in ${colorPalette || 'original'} colors):
${selectedTraits.physical.length > 0 ? `  - Physical: ${hasAugments ? selectedTraits.physical.join(', ') : softenTraits(selectedTraits.physical)}` : ''}
${selectedTraits.abilities.length > 0 ? `  - Abilities: ${hasAugments ? selectedTraits.abilities.join(', ') : softenTraits(selectedTraits.abilities)}` : ''}
${selectedTraits.aesthetic.length > 0 ? `  - Aesthetic: ${hasAugments ? selectedTraits.aesthetic.join(', ') : softenTraits(selectedTraits.aesthetic)}` : ''}
${augmentSection}
OVERALL TRANSFORMATION: This evolution shows ${evolutionStage === 2 ? 'clear growth and emerging maturity' : 'full transformation to adult form'}${hasAugments ? ' with special augment effects prominently displayed' : ''}.
REMINDER: The creature's color is ${colorPalette || 'unchanged'} - this must not change.`;
};

/**
 * Generate the full evolution image prompt.
 * @param {Object} params - Evolution parameters
 * @param {number} params.currentStage - Current stage
 * @param {number} params.evolutionStage - Target stage
 * @param {string} params.evolutionPath - Evolution path
 * @param {string} params.previousMetadata - Previous stage metadata
 * @param {string} params.colorPalette - Original color palette
 * @param {Object[]} [params.existingAugments] - Augments from previous stage
 * @param {Object} [params.newAugment] - Newly acquired augment during evolution
 * @returns {{prompt: string, metadata: string}} Prompt and metadata
 */
export const generateEvolutionPrompt = ({ currentStage, evolutionStage, evolutionPath, previousMetadata, colorPalette, existingAugments = [], newAugment = null }) => {
  const evolvedDesign = generateEvolvedDesign({
    evolutionStage,
    evolutionPath,
    previousMetadata,
    colorPalette,
    existingAugments,
    newAugment
  });

  const colorEmphasis = getColorEmphasis(colorPalette);
  const stageName = STAGE_NAMES[evolutionStage] || 'Unknown';

  // Build augment effects reminder
  const allAugments = newAugment ? [...existingAugments, newAugment] : existingAugments;
  const hasAugments = allAugments.length > 0;

  const augmentReminder = hasAugments
    ? `\n- AUGMENT EFFECTS: Display ${allAugments.map(a => a.name).join(', ')} effects - make these stand out as special enhancements`
    : '';

  // Evolution emphasis - base evolution is nice, augmented is extra impressive
  const evolutionEmphasis = evolutionStage === 2
    ? 'noticeably bigger and more mature than the baby stage'
    : 'fully grown adult form, confident and capable';

  const imagePrompt = `${evolvedDesign}

SIZE GUIDANCE: ${evolutionStage === 2 ? '1.4x larger than baby' : '2x larger than juvenile'}
PROPORTION: Head-to-body ratio changes from baby to ${evolutionStage === 2 ? 'juvenile (1/3)' : 'adult (1/4-1/5)'}

ARTISTIC STYLE: Cartoony Pokemon-style digital art, simple clean lines, bright flat colors, NOT realistic - keep it cute and stylized like a Pokemon or Digimon
COMPOSITION: Single creature portrait, centered, full body visible
BACKGROUND: Pure white or transparent background only - NO environment, NO scenery, NO ground, NO shadows on ground
AGE: ${stageName} with appropriate maturity level
EVOLUTION EMPHASIS: ${evolutionEmphasis}${hasAugments ? ' - PLUS impressive augment effects that make this pet stand out' : ''}

CRITICAL REQUIREMENTS:
- NO TEXT of any kind - no labels, no titles, no captions, no watermarks, no words, no stage numbers
- NO writing or letters anywhere in the image
- ONLY the creature itself - nothing else
- Clean isolated character art suitable for a game asset
- SINGLE VIEW ONLY - one creature, one angle, NO multiple views, NO turnarounds, NO character sheets
- ${colorEmphasis}${augmentReminder}

${hasAugments
  ? `This pet has AUGMENTS - the augment visual effects should be clearly visible and make this pet look more impressive than a regular evolution.`
  : `This is a standard evolution - show natural growth and maturation appropriate for the evolution path.`}
COLOR MUST BE ${colorPalette ? colorPalette.toUpperCase() : 'THE SAME'}! Show ONE creature from ONE angle only.`;

  return { prompt: imagePrompt, metadata: evolvedDesign };
};

export default generateEvolutionPrompt;
