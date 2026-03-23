/**
 * Baby pet generation prompt templates.
 * No AI SDK dependencies.
 * @module prompting/templates/generate
 */

import { buildAugmentVisualDescription } from '../augment-visuals.js';

/**
 * Generate the creature design description for a new baby pet.
 * @param {Object} params - Generation parameters
 * @param {string} params.style - Pet personality (gentle/bold/curious)
 * @param {string} params.colorPalette - Color palette
 * @param {string[]} params.animals - Animal inspirations
 * @param {Object[]} [params.augments] - Augments the pet has
 * @returns {string} Creature design description
 */
export const generateCreatureDesign = ({ style, colorPalette, animals, augments = [] }) => {
  const animalFeatures = animals.length > 0 ? animals.join(' and ') : 'fantasy creature';
  const augmentSection = buildAugmentVisualDescription(augments);

  return `A ${style} baby fantasy creature (Stage 1 of 3) inspired by ${animalFeatures}.

SIGNATURE FEATURES: Distinctive features that will evolve but remain recognizable through all stages
BODY STRUCTURE: Appropriate form (quadruped/bipedal/other)
HEAD: Baby proportions with oversized head (1/2 of body height), large expressive eyes
BODY: Chubby, round baby proportions, adorable and non-threatening
LIMBS: Short, stubby limbs appropriate for baby stage
COLORS: ${colorPalette} color palette with vibrant, eye-catching patterns
TEXTURE: Soft, appealing texture (fur, scales, feathers, or smooth skin)
SPECIAL FEATURES: Unique traits that hint at future evolution potential
AGE: Baby/infant stage with maximum cuteness appeal
${augmentSection}
This creature should have clear potential for dramatic Pokemon-style evolution while being adorable in its current form.`;
};

/**
 * Generate the full image prompt for a new baby pet.
 * @param {Object} params - Generation parameters
 * @param {string} params.style - Pet style
 * @param {string} params.colorPalette - Color palette
 * @param {string[]} params.animals - Animal inspirations
 * @param {Object[]} [params.augments] - Augments the pet has
 * @returns {{prompt: string, metadata: string}} Prompt and metadata
 */
export const generateBabyPetPrompt = ({ style, colorPalette, animals, augments = [] }) => {
  const animalFeatures = animals.length > 0 ? animals.join(' and ') : 'fantasy creature';
  const creatureDesign = generateCreatureDesign({ style, colorPalette, animals, augments });
  const augmentEffects = augments.length > 0
    ? `\n- AUGMENT EFFECTS: Display ${augments.map(a => a.name).join(', ')} effects prominently`
    : '';

  const imagePrompt = `${creatureDesign}

ARTISTIC STYLE: Cartoony Pokemon-style digital art, simple clean lines, bright flat colors, NOT realistic - keep it cute and stylized like a Pokemon or Digimon
COMPOSITION: Single creature portrait, centered, full body visible
BACKGROUND: Pure white or transparent background only - NO environment, NO scenery, NO ground, NO shadows on ground
AGE: Baby/infant with oversized head and eyes, chubby proportions
APPEAL: Maximum cuteness for ages 7-11, non-threatening, inspire nurturing instinct

CRITICAL REQUIREMENTS:
- NO TEXT of any kind - no labels, no titles, no captions, no watermarks, no words
- NO writing or letters anywhere in the image
- ONLY the creature itself - nothing else
- Clean isolated character art suitable for a game asset
- SINGLE VIEW ONLY - one creature, one angle, NO multiple views, NO turnarounds, NO character sheets
- Do NOT show the creature from multiple angles or perspectives in the same image${augmentEffects}

Create a ${style} baby creature with ${colorPalette} colors inspired by ${animalFeatures}. Show ONE creature from ONE angle only.`;

  return { prompt: imagePrompt, metadata: creatureDesign };
};

export default generateBabyPetPrompt;
