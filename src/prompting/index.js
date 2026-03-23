/**
 * Prompting module - prompt generation with no AI SDK dependencies.
 * @module prompting
 */

// Templates
export { generateBabyPetPrompt, generateCreatureDesign } from './templates/generate.js';
export { generateEvolutionPrompt, generateEvolvedDesign } from './templates/evolve.js';
export { generateMergePrompt, getMergeDescription } from './templates/merge.js';

// Builders
export { PromptBuilder, createPetPromptBuilder, buildCreatureDescription } from './builders/prompt-builder.js';
export {
  buildGenerationMetadata,
  buildEvolutionMetadata,
  buildModificationMetadata,
  buildMergeMetadata,
  getMetadataSummary
} from './builders/metadata-builder.js';

// Color preservation
export {
  getColorPreservationGuidance,
  getColorReminder,
  getColorEmphasis,
  mightCauseColorDrift,
  filterColorSafeTraits
} from './color-preservation.js';

// Augment visuals
export {
  buildAugmentVisualDescription,
  buildAugmentEffectsList,
  getAugmentEmphasis,
  buildAugmentSectionWithNew,
  getAugmentCategoryIcon,
  getAugmentSummary
} from './augment-visuals.js';
