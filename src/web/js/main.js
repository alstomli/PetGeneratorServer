/**
 * Main entry point for web UI.
 * @module web/js/main
 */

import * as api from './api-client.js';
import * as state from './state.js';
import { buildFamilyTrees, renderFamilyTree, getFamilyLine } from './components/family-tree.js';
import { renderMergePanel, updateMergePanel } from './components/merge-panel.js';

// Make functions available globally for onclick handlers
window.api = api;
window.state = state;

/**
 * Initialize the application.
 */
export const init = async () => {
  // Load generation history from server
  await loadGenerationHistory();

  // Update displays
  updateHistoryDisplay();
  updateMergePanelUI();

  // Check API health
  api.checkHealth()
    .then(data => console.log('API Health:', data))
    .catch(error => console.error('API connection failed:', error));
};

/**
 * Load generation history from server.
 */
export const loadGenerationHistory = async () => {
  try {
    const history = await api.getAllPets();
    state.setGenerationHistory(history);
    console.log('Loaded generation history:', history.length, 'items');
    updateHistoryCount();
    updateHistoryDisplay();
  } catch (error) {
    console.error('Error loading generation history:', error);
  }
};

/**
 * Update the history count display.
 */
export const updateHistoryCount = () => {
  const historyCountElement = document.getElementById('historyCount');
  if (historyCountElement) {
    const history = state.getGenerationHistory();
    historyCountElement.textContent = `${history.length} generations saved`;
  }
};

/**
 * Update the history display.
 */
export const updateHistoryDisplay = () => {
  const container = document.getElementById('historyContainer');
  const history = state.getGenerationHistory();

  if (history.length === 0) {
    container.innerHTML = '<p>No generations yet. Start creating pets to see your history!</p>';
    return;
  }

  const families = buildFamilyTrees(history);
  container.innerHTML = Object.values(families).map(family => renderFamilyTree(family)).join('');
};

/**
 * Update merge panel UI.
 */
export const updateMergePanelUI = async () => {
  const container = document.getElementById('mergePanelContainer');
  if (!container) return;

  const selection = state.getMergeSelection();
  let preview = null;

  // Get preview if both pets selected
  if (selection.pet1 && selection.pet2) {
    try {
      preview = await api.previewMerge(selection.pet1.id, selection.pet2.id);
    } catch (error) {
      console.error('Error getting merge preview:', error);
    }
  }

  container.innerHTML = renderMergePanel({ preview });
};

/**
 * Save pet to history.
 */
export const saveToHistory = async (pet, params) => {
  try {
    await api.savePet(pet, params);
    await loadGenerationHistory();
  } catch (error) {
    console.error('Error saving pet:', error);
  }
};

/**
 * Select a pet for merging.
 */
window.selectForMerge = async (petId) => {
  const history = state.getGenerationHistory();
  const pet = history.find(h => h.id == petId);
  if (!pet) return;

  const selection = state.getMergeSelection();

  // Check if already selected
  if (selection.pet1?.id === petId || selection.pet2?.id === petId) {
    // Deselect
    if (selection.pet1?.id === petId) {
      state.setMergeSelection(1, null);
    } else {
      state.setMergeSelection(2, null);
    }
  } else {
    // Select in first empty slot
    if (!selection.pet1) {
      state.setMergeSelection(1, pet);
    } else if (!selection.pet2) {
      state.setMergeSelection(2, pet);
    } else {
      // Both full, replace second
      state.setMergeSelection(2, pet);
    }
  }

  updateHistoryDisplay();
  await updateMergePanelUI();
};

/**
 * Remove a pet from merge selection.
 */
window.removeMergeSelection = async (slot) => {
  state.setMergeSelection(slot, null);
  updateHistoryDisplay();
  await updateMergePanelUI();
};

/**
 * Clear merge selection.
 */
window.clearMergeSelectionUI = async () => {
  state.clearMergeSelection();
  updateHistoryDisplay();
  await updateMergePanelUI();
};

/**
 * Execute the merge.
 */
window.executeMerge = async () => {
  const selection = state.getMergeSelection();
  if (!selection.pet1 || !selection.pet2) return;

  // Update UI to show loading
  const container = document.getElementById('mergePanelContainer');
  if (container) {
    container.innerHTML = renderMergePanel({ isLoading: true });
  }

  try {
    const result = await api.mergePets(selection.pet1.id, selection.pet2.id);

    // Save the merged pet
    await api.savePet(result.pet, {
      style: result.pet.style,
      colorPalette: result.pet.colorPalette,
      animals: result.pet.animals,
      parentIds: result.pet.parentIds,
      isMerged: true,
      isRare: result.isRare,
      rareType: result.rareType
    });

    // Clear selection and reload
    state.clearMergeSelection();
    await loadGenerationHistory();
    await updateMergePanelUI();

    // Show success message
    if (result.isRare) {
      alert(`🎉 RARE ${result.rareType.toUpperCase()} MERGE! Your merged pet has special characteristics!`);
    } else {
      alert('✨ Merge successful! Your new pet has been created.');
    }
  } catch (error) {
    console.error('Merge error:', error);
    alert(`Merge failed: ${error.message}`);
    await updateMergePanelUI();
  }
};

/**
 * Tooltip element for augments.
 */
let augmentTooltip = null;

/**
 * Create or get the augment tooltip element.
 */
const getAugmentTooltip = () => {
  if (!augmentTooltip) {
    augmentTooltip = document.createElement('div');
    augmentTooltip.className = 'augment-tooltip';
    augmentTooltip.id = 'augment-tooltip';
    document.body.appendChild(augmentTooltip);
  }
  return augmentTooltip;
};

/**
 * Show augment tooltip.
 */
window.showAugmentTooltip = (event, petId, augmentIndex) => {
  const petCard = document.querySelector(`[data-pet-id="${petId}"]`);
  if (!petCard) return;

  const augmentsData = petCard.getAttribute('data-augments');
  if (!augmentsData) return;

  try {
    const augments = JSON.parse(augmentsData);
    const augment = augments[augmentIndex];
    if (!augment) return;

    const tooltip = getAugmentTooltip();

    // Build tooltip content
    tooltip.innerHTML = `
      <div class="augment-tooltip-title">${augment.name}</div>
      <div class="augment-tooltip-story">"${augment.story}"</div>
      <div class="augment-tooltip-effects">
        <strong>Visual Effects:</strong>
        <ul>
          ${augment.visualEffects.map(effect => `<li>${effect}</li>`).join('')}
        </ul>
      </div>
    `;

    // Position tooltip near mouse
    const rect = event.target.getBoundingClientRect();
    const tooltipHeight = 150; // Approximate
    const tooltipWidth = 280;

    let left = rect.left + window.scrollX;
    let top = rect.bottom + window.scrollY + 5;

    // Adjust if would go off screen
    if (left + tooltipWidth > window.innerWidth) {
      left = window.innerWidth - tooltipWidth - 10;
    }
    if (top + tooltipHeight > window.innerHeight + window.scrollY) {
      top = rect.top + window.scrollY - tooltipHeight - 5;
    }

    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
    tooltip.classList.add('visible');
  } catch (e) {
    console.error('Error showing augment tooltip:', e);
  }
};

/**
 * Hide augment tooltip.
 */
window.hideAugmentTooltip = () => {
  const tooltip = getAugmentTooltip();
  tooltip.classList.remove('visible');
};

// Export for module use
export default {
  init,
  loadGenerationHistory,
  updateHistoryCount,
  updateHistoryDisplay,
  updateMergePanelUI,
  saveToHistory
};
