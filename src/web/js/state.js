/**
 * Application state management.
 * @module web/js/state
 */

/**
 * Global application state.
 */
export const state = {
  currentPet: null,
  generationHistory: [],
  mergeSelection: {
    pet1: null,
    pet2: null
  },
  isSelectionMode: false
};

/**
 * Set the current pet.
 * @param {Object} pet - Pet object
 */
export const setCurrentPet = (pet) => {
  state.currentPet = pet;
};

/**
 * Get the current pet.
 * @returns {Object|null} Current pet
 */
export const getCurrentPet = () => {
  return state.currentPet;
};

/**
 * Set the generation history.
 * @param {Object[]} history - Array of pet records
 */
export const setGenerationHistory = (history) => {
  state.generationHistory = history;
};

/**
 * Get the generation history.
 * @returns {Object[]} Generation history
 */
export const getGenerationHistory = () => {
  return state.generationHistory;
};

/**
 * Find a pet in history by ID.
 * @param {string} petId - Pet ID
 * @returns {Object|undefined} Pet record
 */
export const findPetInHistory = (petId) => {
  return state.generationHistory.find(h => h.id == petId);
};

/**
 * Set merge selection.
 * @param {number} slot - Slot number (1 or 2)
 * @param {Object|null} pet - Pet object or null to clear
 */
export const setMergeSelection = (slot, pet) => {
  if (slot === 1) {
    state.mergeSelection.pet1 = pet;
  } else if (slot === 2) {
    state.mergeSelection.pet2 = pet;
  }
};

/**
 * Get merge selection.
 * @returns {{pet1: Object|null, pet2: Object|null}} Merge selection
 */
export const getMergeSelection = () => {
  return state.mergeSelection;
};

/**
 * Clear merge selection.
 */
export const clearMergeSelection = () => {
  state.mergeSelection.pet1 = null;
  state.mergeSelection.pet2 = null;
};

/**
 * Check if merge selection is complete.
 * @returns {boolean} True if both pets selected
 */
export const isMergeReady = () => {
  return state.mergeSelection.pet1 !== null && state.mergeSelection.pet2 !== null;
};

/**
 * Set selection mode.
 * @param {boolean} isActive - Whether selection mode is active
 */
export const setSelectionMode = (isActive) => {
  state.isSelectionMode = isActive;
};

/**
 * Check if selection mode is active.
 * @returns {boolean} True if in selection mode
 */
export const isInSelectionMode = () => {
  return state.isSelectionMode;
};

export default state;
