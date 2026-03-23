/**
 * API client for pet evolution backend.
 * @module web/js/api-client
 */

const API_BASE = '/api';

/**
 * Check API health.
 * @returns {Promise<Object>} Health status
 */
export const checkHealth = async () => {
  const response = await fetch(`${API_BASE}/health`);
  return response.json();
};

/**
 * Generate a new pet.
 * @param {Object} params - Generation parameters
 * @returns {Promise<Object>} Generated pet
 */
export const generatePet = async (params) => {
  const response = await fetch(`${API_BASE}/google/generate-pet`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to generate pet');
  }

  return response.json();
};

/**
 * Evolve a pet.
 * @param {Object} pet - Pet to evolve
 * @param {string} evolutionPath - Evolution path
 * @param {Object} params - Additional parameters
 * @returns {Promise<Object>} Evolved pet
 */
export const evolvePet = async (pet, evolutionPath, params) => {
  // Get the pet image and send it along
  const imageResponse = await fetch(pet.imageUrl);
  const imageBlob = await imageResponse.blob();

  const formData = new FormData();
  formData.append('petId', pet.id);
  formData.append('currentStage', pet.stage);
  formData.append('maxStages', pet.maxStages);
  formData.append('description', pet.description);
  formData.append('evolutionPath', evolutionPath);
  formData.append('colorPalette', params.colorPalette || '');
  formData.append('previousMetadata', pet.metadata || '');
  formData.append('image', imageBlob, 'pet-image.png');

  const response = await fetch(`${API_BASE}/google/evolve-pet`, {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to evolve pet');
  }

  return response.json();
};

/**
 * Modify a pet with accessories.
 * @param {string} petId - Pet ID
 * @param {string} baseDescription - Base pet description
 * @param {string[]} modifications - Modifications to apply
 * @returns {Promise<Object>} Modified pet
 */
export const modifyPet = async (petId, baseDescription, modifications) => {
  const response = await fetch(`${API_BASE}/google/modify-pet`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ petId, baseDescription, modifications })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to modify pet');
  }

  return response.json();
};

/**
 * Merge two pets.
 * @param {string} pet1Id - First pet ID
 * @param {string} pet2Id - Second pet ID
 * @returns {Promise<Object>} Merge result
 */
export const mergePets = async (pet1Id, pet2Id) => {
  const response = await fetch(`${API_BASE}/google/merge-pets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pet1Id, pet2Id })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to merge pets');
  }

  return response.json();
};

/**
 * Preview merge outcome.
 * @param {string} pet1Id - First pet ID
 * @param {string} pet2Id - Second pet ID
 * @returns {Promise<Object>} Merge preview
 */
export const previewMerge = async (pet1Id, pet2Id) => {
  const response = await fetch(`${API_BASE}/google/merge-pets/preview?pet1Id=${pet1Id}&pet2Id=${pet2Id}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to preview merge');
  }

  return response.json();
};

/**
 * Save a pet to storage.
 * @param {Object} pet - Pet to save
 * @param {Object} params - Generation parameters
 * @returns {Promise<Object>} Save result
 */
export const savePet = async (pet, params) => {
  const response = await fetch(`${API_BASE}/pets/save`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pet, params })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to save pet');
  }

  return response.json();
};

/**
 * Get all saved pets.
 * @returns {Promise<Object[]>} Array of pet records
 */
export const getAllPets = async () => {
  const response = await fetch(`${API_BASE}/pets`);

  if (!response.ok) {
    throw new Error('Failed to get pets');
  }

  return response.json();
};

/**
 * Delete a pet.
 * @param {string} petId - Pet ID to delete
 * @returns {Promise<Object>} Delete result
 */
export const deletePet = async (petId) => {
  const response = await fetch(`${API_BASE}/pets/${petId}`, {
    method: 'DELETE'
  });

  if (!response.ok) {
    throw new Error('Failed to delete pet');
  }

  return response.json();
};

export default {
  checkHealth,
  generatePet,
  evolvePet,
  modifyPet,
  mergePets,
  previewMerge,
  savePet,
  getAllPets,
  deletePet
};
