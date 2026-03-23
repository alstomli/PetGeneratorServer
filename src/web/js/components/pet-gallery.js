/**
 * Pet gallery component for selection.
 * @module web/js/components/pet-gallery
 */

import { renderPetCard } from './pet-card.js';

/**
 * Render a selectable pet gallery.
 * @param {Object[]} pets - Array of pet records
 * @param {Object} options - Render options
 * @returns {string} HTML string
 */
export const renderPetGallery = (pets, options = {}) => {
  const { selectable = false, onSelect } = options;

  if (pets.length === 0) {
    return '<p class="text-muted">No pets available. Generate some pets first!</p>';
  }

  const sortedPets = [...pets].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  return `
    <div class="pet-gallery" style="display: flex; flex-wrap: wrap; gap: 15px;">
      ${sortedPets.map(pet => renderPetCard(pet, false, { selectable })).join('')}
    </div>
  `;
};

/**
 * Render a mini pet selector for merge.
 * @param {Object[]} pets - Array of pet records
 * @param {string[]} excludeIds - IDs to exclude from selection
 * @returns {string} HTML string
 */
export const renderPetSelector = (pets, excludeIds = []) => {
  const availablePets = pets.filter(p => !excludeIds.includes(p.id));

  if (availablePets.length === 0) {
    return '<p class="text-muted">No pets available for selection.</p>';
  }

  return `
    <div class="pet-selector" style="display: flex; flex-wrap: wrap; gap: 10px; max-height: 300px; overflow-y: auto;">
      ${availablePets.map(pet => renderMiniPetCard(pet)).join('')}
    </div>
  `;
};

/**
 * Render a mini pet card for compact display.
 * @param {Object} pet - Pet record
 * @returns {string} HTML string
 */
const renderMiniPetCard = (pet) => {
  return `
    <div class="mini-pet-card selectable"
         style="width: 120px; padding: 8px; border: 1px solid #ddd; border-radius: 6px; cursor: pointer; text-align: center;"
         onclick="selectForMerge('${pet.id}')"
         data-pet-id="${pet.id}">
      <img src="${pet.pet.imageUrl}" style="width: 100%; border-radius: 4px;">
      <div style="font-size: 10px; margin-top: 4px;">
        <div>${pet.params.style}</div>
        <div>Stage ${pet.pet.stage}</div>
      </div>
    </div>
  `;
};

export default {
  renderPetGallery,
  renderPetSelector
};
