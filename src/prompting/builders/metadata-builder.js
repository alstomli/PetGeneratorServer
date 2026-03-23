/**
 * Metadata builder utilities for constructing creature design metadata.
 * No AI SDK dependencies.
 * @module prompting/builders/metadata-builder
 */

/**
 * Build metadata for a newly generated pet.
 * @param {Object} params - Parameters
 * @param {string} params.style - Pet style
 * @param {string} params.colorPalette - Color palette
 * @param {string[]} params.animals - Animal inspirations
 * @param {string} params.prompt - Generation prompt used
 * @returns {Object} Metadata object
 */
export const buildGenerationMetadata = ({ style, colorPalette, animals, prompt }) => {
  return {
    type: 'generation',
    style,
    colorPalette,
    animals,
    stage: 1,
    generatedAt: new Date().toISOString(),
    promptLength: prompt.length
  };
};

/**
 * Build metadata for an evolved pet.
 * @param {Object} params - Parameters
 * @param {Object} params.parentPet - Parent pet data
 * @param {string} params.evolutionPath - Evolution path taken
 * @param {number} params.newStage - New evolution stage
 * @param {string} params.prompt - Evolution prompt used
 * @param {Object} params.selectedTraits - Traits that were applied
 * @returns {Object} Metadata object
 */
export const buildEvolutionMetadata = ({ parentPet, evolutionPath, newStage, prompt, selectedTraits }) => {
  return {
    type: 'evolution',
    parentId: parentPet.id,
    evolutionPath,
    previousStage: parentPet.stage,
    newStage,
    style: parentPet.style,
    colorPalette: parentPet.colorPalette,
    animals: parentPet.animals,
    selectedTraits,
    evolvedAt: new Date().toISOString(),
    promptLength: prompt.length
  };
};

/**
 * Build metadata for a modified pet.
 * @param {Object} params - Parameters
 * @param {Object} params.parentPet - Parent pet data
 * @param {string[]} params.modifications - Modifications applied
 * @param {string} params.prompt - Modification prompt used
 * @returns {Object} Metadata object
 */
export const buildModificationMetadata = ({ parentPet, modifications, prompt }) => {
  return {
    type: 'modification',
    parentId: parentPet.id,
    modifications,
    style: parentPet.style,
    colorPalette: parentPet.colorPalette,
    stage: parentPet.stage,
    modifiedAt: new Date().toISOString(),
    promptLength: prompt.length
  };
};

/**
 * Build metadata for a merged pet.
 * @param {Object} params - Parameters
 * @param {Object} params.pet1 - First parent pet
 * @param {Object} params.pet2 - Second parent pet
 * @param {Object} params.outcome - Merge outcome
 * @param {string} params.prompt - Merge prompt used
 * @returns {Object} Metadata object
 */
export const buildMergeMetadata = ({ pet1, pet2, outcome, prompt }) => {
  return {
    type: 'merge',
    parentIds: [pet1.id, pet2.id],
    parent1: {
      id: pet1.id,
      style: pet1.style,
      colorPalette: pet1.colorPalette,
      stage: pet1.stage,
      evolutionPath: pet1.evolutionPath
    },
    parent2: {
      id: pet2.id,
      style: pet2.style,
      colorPalette: pet2.colorPalette,
      stage: pet2.stage,
      evolutionPath: pet2.evolutionPath
    },
    resultStyle: outcome.mergedAttributes.style,
    resultColorPalette: outcome.mergedAttributes.colorPalette,
    resultAnimals: outcome.mergedAttributes.animals,
    isRare: outcome.isRare,
    rareType: outcome.rareType,
    inheritedTraits: outcome.inheritedTraits,
    mergedAt: new Date().toISOString(),
    promptLength: prompt.length
  };
};

/**
 * Extract summary information from metadata.
 * @param {Object} metadata - Metadata object
 * @returns {string} Human-readable summary
 */
export const getMetadataSummary = (metadata) => {
  switch (metadata.type) {
    case 'generation':
      return `Generated ${metadata.style} baby pet with ${metadata.colorPalette} colors`;
    case 'evolution':
      return `Evolved via ${metadata.evolutionPath} path to stage ${metadata.newStage}`;
    case 'modification':
      return `Modified with ${metadata.modifications.join(', ')}`;
    case 'merge':
      const rareText = metadata.isRare ? ` (RARE ${metadata.rareType})` : '';
      return `Merged from pets ${metadata.parentIds[0]} and ${metadata.parentIds[1]}${rareText}`;
    default:
      return 'Unknown operation';
  }
};

export default {
  buildGenerationMetadata,
  buildEvolutionMetadata,
  buildModificationMetadata,
  buildMergeMetadata,
  getMetadataSummary
};
