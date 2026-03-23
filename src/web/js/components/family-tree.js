/**
 * Family tree component.
 * @module web/js/components/family-tree
 */

import { renderPetCard } from './pet-card.js';

/**
 * Build family trees from generation history.
 * @param {Object[]} generationHistory - Array of pet records
 * @returns {Object} Map of rootId -> family data
 */
export const buildFamilyTrees = (generationHistory) => {
  const families = {};

  generationHistory.forEach(item => {
    // Extract root ancestor ID (before first dash)
    const rootId = item.id.split('-')[0];

    if (!families[rootId]) {
      families[rootId] = {
        root: null,
        descendants: []
      };
    }

    // Check if this is the root ancestor (no dashes in ID or matches root pattern)
    if (item.id === rootId || !item.params.parentId) {
      families[rootId].root = item;
    } else {
      families[rootId].descendants.push(item);
    }
  });

  return families;
};

/**
 * Render a family tree.
 * @param {Object} family - Family data
 * @returns {string} HTML string
 */
export const renderFamilyTree = (family) => {
  if (!family.root) return '';

  const root = family.root;
  const descendants = family.descendants.sort((a, b) => a.pet.stage - b.pet.stage);

  let html = `
    <div class="family-tree">
      <h3 class="family-tree-title">🌳 Family Tree - Started ${new Date(root.timestamp).toLocaleDateString()}</h3>
      <div class="evolution-chain">
        <div class="stage-column">
          <div class="stage-label stage-label-root">👑 Stage ${root.pet.stage} - Original</div>
          ${renderPetCard(root, true)}
        </div>`;

  if (descendants.length > 0) {
    const stages = {};
    descendants.forEach(pet => {
      const stage = pet.pet.stage;
      if (!stages[stage]) stages[stage] = [];
      stages[stage].push(pet);
    });

    const pathOrder = { 'gentle': 1, 'bold': 2, 'curious': 3 };
    Object.keys(stages).sort((a, b) => a - b).forEach(stage => {
      const stagePets = stages[stage];
      stagePets.sort((a, b) => {
        const pathA = a.params.evolutionPath || '';
        const pathB = b.params.evolutionPath || '';
        return (pathOrder[pathA] || 99) - (pathOrder[pathB] || 99);
      });

      html += `
        <div class="arrow-connector">→</div>
        <div class="stage-column">
          <div class="stage-label stage-label-evolution">
            ⚡ Stage ${stage} Evolution${stagePets.length > 1 ? 's' : ''}
          </div>
          <div style="display: flex; flex-direction: column; gap: 15px; align-items: center;">
            ${stagePets.map(pet => renderPetCard(pet, false)).join('')}
          </div>
        </div>`;
    });
  }

  html += `
      </div>
    </div>`;

  return html;
};

/**
 * Get family line (ancestor chain) for a pet.
 * @param {string} parentId - Parent pet ID
 * @param {Object[]} generationHistory - Generation history
 * @returns {string[]} Array of ancestor IDs
 */
export const getFamilyLine = (parentId, generationHistory) => {
  const parent = generationHistory.find(h => h.id == parentId);
  return parent ? [...(parent.familyLine || [parent.id]), Date.now()] : [Date.now()];
};

/**
 * Get all family members for a pet.
 * @param {string} petId - Pet ID
 * @param {Object[]} generationHistory - Generation history
 * @returns {Object} Family members
 */
export const getFamilyMembers = (petId, generationHistory) => {
  const item = generationHistory.find(h => h.id == petId);
  if (!item) return [];

  const descendants = generationHistory.filter(h =>
    h.params.parentId == petId ||
    (h.familyLine && h.familyLine.includes(parseInt(petId)))
  );

  return {
    pet: item,
    children: descendants
  };
};

export default {
  buildFamilyTrees,
  renderFamilyTree,
  getFamilyLine,
  getFamilyMembers
};
