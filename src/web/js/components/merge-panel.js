/**
 * Merge panel component.
 * @module web/js/components/merge-panel
 */

import { getMergeSelection, isMergeReady, clearMergeSelection } from '../state.js';

/**
 * Render the merge panel.
 * @param {Object} options - Render options
 * @returns {string} HTML string
 */
export const renderMergePanel = (options = {}) => {
  const { preview = null, isLoading = false } = options;
  const selection = getMergeSelection();
  const ready = isMergeReady();

  return `
    <div class="merge-section">
      <h3 class="merge-section-title">🔀 Pet Fusion Chamber</h3>
      <p class="text-muted" style="margin: 0 0 15px 0;">
        Select two pets from different family lines to merge them into a new unique creature!
        ${ready ? '<strong style="color: #28a745;">Ready to merge!</strong>' : 'Click "Select for Merge" on any two pets below.'}
      </p>

      <div class="merge-selection">
        ${renderMergeSlot(1, selection.pet1)}
        <div class="merge-controls">
          <div style="font-size: 32px;">+</div>
          <button
            class="merge-button"
            onclick="executeMerge()"
            ${!ready || isLoading ? 'disabled' : ''}
          >
            ${isLoading ? '<div class="spinner" style="display: inline-block; margin-right: 8px;"></div> Merging...' : '🧬 Merge Pets!'}
          </button>
          ${ready ? '<button class="secondary btn-small" onclick="clearMergeSelectionUI()">Clear Selection</button>' : ''}
        </div>
        ${renderMergeSlot(2, selection.pet2)}
      </div>

      ${preview ? renderMergePreview(preview) : ''}
    </div>
  `;
};

/**
 * Render a merge slot.
 * @param {number} slotNum - Slot number (1 or 2)
 * @param {Object|null} pet - Selected pet or null
 * @returns {string} HTML string
 */
const renderMergeSlot = (slotNum, pet) => {
  const filled = pet !== null;

  if (!filled) {
    return `
      <div class="merge-slot">
        <div class="merge-slot-label">Parent ${slotNum}</div>
        <div class="merge-slot-empty">
          <div style="font-size: 48px; color: #ddd;">🐾</div>
          <p>Click "Select for Merge" on a pet below</p>
        </div>
      </div>
    `;
  }

  return `
    <div class="merge-slot filled">
      <div class="merge-slot-label">Parent ${slotNum}</div>
      <img src="${pet.pet.imageUrl}" alt="Parent ${slotNum}">
      <div class="pet-info">
        <div><strong>${pet.params.style}</strong> - Stage ${pet.pet.stage}</div>
        <div>${pet.params.colorPalette}</div>
        ${pet.params.evolutionPath ? `<div>Path: ${pet.params.evolutionPath}</div>` : ''}
      </div>
      <button class="secondary btn-small" onclick="removeMergeSelection(${slotNum})">✕ Remove</button>
    </div>
  `;
};

/**
 * Render merge preview.
 * @param {Object} preview - Preview data
 * @returns {string} HTML string
 */
const renderMergePreview = (preview) => {
  if (!preview.canMerge) {
    return `
      <div class="merge-preview" style="border-color: #dc3545;">
        <div class="merge-preview-title" style="color: #dc3545;">❌ Cannot Merge</div>
        <p>${preview.reason}</p>
      </div>
    `;
  }

  return `
    <div class="merge-preview">
      <div class="merge-preview-title">✨ Merge Preview</div>
      <p><strong>Result:</strong> ${preview.summary}</p>
      <div style="display: flex; gap: 20px; flex-wrap: wrap;">
        <div>
          <strong>Style:</strong> ${preview.mergedAttributes.style}
        </div>
        <div>
          <strong>Colors:</strong> ${preview.mergedAttributes.colorPalette}
        </div>
        <div>
          <strong>Animals:</strong> ${preview.mergedAttributes.animals.join(', ') || 'Fantasy creature'}
        </div>
      </div>
      ${preview.isRare ? `
        <div style="margin-top: 10px;">
          <span class="rare-indicator rare-${preview.rareType}">
            ⭐ Rare Outcome Possible: ${preview.rareType.toUpperCase()}!
          </span>
        </div>
      ` : ''}
      <div style="margin-top: 10px;">
        <strong>Inherited Traits:</strong>
        <ul style="margin: 5px 0; padding-left: 20px;">
          ${preview.inheritedTraits.map(t => `<li>${t}</li>`).join('')}
        </ul>
      </div>
    </div>
  `;
};

/**
 * Update the merge panel in the DOM.
 * @param {Object} options - Render options
 */
export const updateMergePanel = (options = {}) => {
  const container = document.getElementById('mergePanelContainer');
  if (container) {
    container.innerHTML = renderMergePanel(options);
  }
};

export default {
  renderMergePanel,
  updateMergePanel
};
