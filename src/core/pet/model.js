/**
 * Pet model creation and manipulation.
 * Pure functions - no framework dependencies.
 * @module core/pet/model
 */

/**
 * Create a new pet object.
 * @param {Object} params - Pet parameters
 * @param {string} [params.id] - Pet ID (generated if not provided)
 * @param {number} [params.stage=1] - Evolution stage
 * @param {number} [params.maxStages=3] - Maximum stages
 * @param {string} params.style - Pet style
 * @param {string} params.colorPalette - Color palette
 * @param {string[]} [params.animals=[]] - Animal inspirations
 * @param {string} params.metadata - Creature design description
 * @param {string} params.imageUrl - Image URL or data URI
 * @param {string} params.prompt - Generation prompt
 * @param {string} [params.description] - Human-readable description
 * @param {string} [params.provider='google'] - AI provider
 * @param {string} [params.evolutionPath] - Evolution path (for evolved pets)
 * @param {Object[]} [params.augments=[]] - Augments the pet has
 * @returns {Object} The pet object
 */
export const createPet = ({
  id,
  stage = 1,
  maxStages = 3,
  style,
  colorPalette,
  animals = [],
  metadata,
  imageUrl,
  prompt,
  description,
  provider = 'google',
  evolutionPath,
  augments = []
}) => {
  const petId = id || Date.now().toString();
  const petDescription = description ||
    `A stage ${stage} ${style} pet with ${colorPalette} colors${animals.length ? ` featuring ${animals.join(' and ')} traits` : ''}`;

  return {
    id: petId,
    stage,
    maxStages,
    style,
    colorPalette,
    animals,
    metadata,
    imageUrl,
    prompt,
    description: petDescription,
    provider,
    augments,
    ...(evolutionPath && { evolutionPath })
  };
};

/**
 * Create an evolved pet from a parent pet.
 * @param {Object} parentPet - The parent pet object
 * @param {Object} evolutionResult - Evolution result data
 * @param {string} evolutionResult.imageUrl - New image URL
 * @param {string} evolutionResult.prompt - Evolution prompt used
 * @param {string} evolutionResult.metadata - New metadata
 * @param {Object[]} [evolutionResult.augments] - Augments (inherited + new)
 * @param {string} evolutionPath - Evolution path taken
 * @returns {Object} The evolved pet object
 */
export const createEvolvedPet = (parentPet, evolutionResult, evolutionPath) => {
  const newStage = parentPet.stage + 1;
  const id = `${parentPet.id.split('-')[0]}-${newStage}-${Date.now()}`;

  // Inherit parent augments, add any new ones from evolution
  const augments = evolutionResult.augments || parentPet.augments || [];

  return {
    id,
    stage: newStage,
    maxStages: parentPet.maxStages,
    style: parentPet.style,
    colorPalette: parentPet.colorPalette,
    animals: parentPet.animals,
    evolutionPath,
    provider: parentPet.provider,
    imageUrl: evolutionResult.imageUrl,
    prompt: evolutionResult.prompt,
    metadata: evolutionResult.metadata,
    augments,
    description: `A stage ${newStage} ${parentPet.style} pet evolved via ${evolutionPath} path`
  };
};

/**
 * Create a merged pet from two parent pets.
 * @param {Object} pet1 - First parent pet
 * @param {Object} pet2 - Second parent pet
 * @param {Object} mergeResult - Merge result data
 * @param {string} mergeResult.imageUrl - New image URL
 * @param {string} mergeResult.prompt - Merge prompt used
 * @param {string} mergeResult.metadata - New metadata
 * @param {string} mergeResult.style - Resulting style
 * @param {string} mergeResult.colorPalette - Resulting color palette
 * @param {string[]} mergeResult.animals - Combined animals
 * @param {boolean} [mergeResult.isRare=false] - Whether this is a rare outcome
 * @param {string} [mergeResult.rareType] - Type of rare outcome
 * @param {Object[]} [mergeResult.augments=[]] - Augments (inherited + new)
 * @returns {Object} The merged pet object
 */
export const createMergedPet = (pet1, pet2, mergeResult) => {
  const id = `merge-${Date.now()}`;

  return {
    id,
    stage: 1, // Merged pets start at stage 1
    maxStages: 3,
    style: mergeResult.style,
    colorPalette: mergeResult.colorPalette,
    animals: mergeResult.animals,
    parentIds: [pet1.id, pet2.id],
    provider: 'google',
    imageUrl: mergeResult.imageUrl,
    prompt: mergeResult.prompt,
    metadata: mergeResult.metadata,
    augments: mergeResult.augments || [],
    description: `A merged pet from ${pet1.id} and ${pet2.id}`,
    ...(mergeResult.isRare && {
      isRare: true,
      rareType: mergeResult.rareType
    })
  };
};

/**
 * Extract the root ID from a pet ID (the original ancestor).
 * @param {string} petId - The pet ID
 * @returns {string} The root ID
 */
export const getRootId = (petId) => {
  return petId.split('-')[0];
};

/**
 * Check if two pets share the same lineage (same root ancestor).
 * @param {Object} pet1 - First pet
 * @param {Object} pet2 - Second pet
 * @returns {boolean} True if they share lineage
 */
export const shareLineage = (pet1, pet2) => {
  return getRootId(pet1.id) === getRootId(pet2.id);
};

export default {
  createPet,
  createEvolvedPet,
  createMergedPet,
  getRootId,
  shareLineage
};
