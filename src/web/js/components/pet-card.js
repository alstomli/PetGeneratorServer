/**
 * Pet card component.
 * @module web/js/components/pet-card
 */

import { isInSelectionMode, getMergeSelection } from '../state.js';

/**
 * Category icons for augments.
 */
const AUGMENT_ICONS = {
  elemental: '🔥',
  celestial: '⭐',
  nature: '🌿',
  spirit: '👻',
  arcane: '✨'
};

/**
 * Rarity tier info.
 */
const RARITY_TIERS = {
  common: { name: 'Common', minWeight: 0, class: 'rarity-common' },
  uncommon: { name: 'Uncommon', minWeight: 1, class: 'rarity-uncommon' },
  rare: { name: 'Rare', minWeight: 3, class: 'rarity-rare' },
  legendary: { name: 'Legendary', minWeight: 5, class: 'rarity-legendary' },
  mythical: { name: 'Mythical', minWeight: 7, class: 'rarity-mythical' }
};

/**
 * Calculate rarity from augments.
 */
const calculateRarity = (augments) => {
  if (!augments || augments.length === 0) {
    return RARITY_TIERS.common;
  }
  const totalWeight = augments.reduce((sum, aug) => sum + (aug.weight || 0), 0);
  if (totalWeight >= 7) return RARITY_TIERS.mythical;
  if (totalWeight >= 5) return RARITY_TIERS.legendary;
  if (totalWeight >= 3) return RARITY_TIERS.rare;
  if (totalWeight >= 1) return RARITY_TIERS.uncommon;
  return RARITY_TIERS.common;
};

/**
 * Render rarity badge.
 */
const renderRarityBadge = (augments) => {
  const rarity = calculateRarity(augments);
  return `<span class="rarity-badge ${rarity.class}">${rarity.name}</span>`;
};

/**
 * Render augments section.
 */
const renderAugments = (augments, petId) => {
  if (!augments || augments.length === 0) {
    return '';
  }

  const augmentBadges = augments.map((aug, idx) => {
    const icon = AUGMENT_ICONS[aug.category] || '💎';
    const weightStars = '★'.repeat(aug.weight);
    return `
      <span class="augment-badge ${aug.category}"
            data-augment-id="${aug.id}"
            data-pet-id="${petId}"
            data-augment-index="${idx}"
            onmouseenter="showAugmentTooltip(event, '${petId}', ${idx})"
            onmouseleave="hideAugmentTooltip()">
        <span class="augment-icon">${icon}</span>
        ${aug.name}
        <span class="augment-weight">${weightStars}</span>
      </span>
    `;
  }).join('');

  return `
    <div class="augments-container">
      <div class="augments-title">Augments</div>
      <div class="augment-list">${augmentBadges}</div>
    </div>
  `;
};

/**
 * Render a pet card.
 * @param {Object} item - Pet record
 * @param {boolean} isRoot - Whether this is a root pet
 * @param {Object} options - Render options
 * @returns {string} HTML string
 */
export const renderPetCard = (item, isRoot, options = {}) => {
  const { selectable = false, onSelectForMerge } = options;
  const cardClass = isRoot ? 'pet-card pet-card-root' : 'pet-card pet-card-evolution';
  const hasComparison = item.pet.comparison && item.pet.comparison.method1 && item.pet.comparison.method2;
  const width = hasComparison ? '600px' : '280px';
  const styleEmoji = item.params.style === 'gentle' ? '💚' : item.params.style === 'bold' ? '🔥' : '✨';
  const pathEmoji = item.params.evolutionPath === 'gentle' ? '💚' : item.params.evolutionPath === 'bold' ? '🔥' : '✨';

  const mergeSelection = getMergeSelection();
  const isSelected = mergeSelection.pet1?.id === item.id || mergeSelection.pet2?.id === item.id;
  const selectionSlot = mergeSelection.pet1?.id === item.id ? 1 : mergeSelection.pet2?.id === item.id ? 2 : null;

  const selectableClass = selectable ? 'selectable' : '';
  const selectedClass = isSelected ? 'selected' : '';

  // Get augments from pet
  const augments = item.pet.augments || [];
  const rarityBadge = renderRarityBadge(augments);

  return `
    <div class="${cardClass} ${selectableClass} ${selectedClass}" style="width: ${width}; position: relative;" data-pet-id="${item.id}" data-augments='${JSON.stringify(augments)}'>
      ${isSelected ? `<div class="selection-indicator">${selectionSlot}</div>` : ''}
      <div class="pet-card-header">
        <div class="timestamp">${new Date(item.timestamp).toLocaleString()}</div>
        <div class="pet-card-meta text-muted">Stage ${item.pet.stage} ${rarityBadge}</div>
      </div>

      ${hasComparison ? renderComparisonImages(item) : renderSingleImage(item)}

      <div class="pet-card-meta"><strong>Style:</strong> ${item.params.style} ${styleEmoji}</div>
      <div class="pet-card-meta"><strong>Colors:</strong> ${item.params.colorPalette}</div>
      <div class="pet-card-meta"><strong>Animals:</strong> ${item.params.animals && item.params.animals.length ? item.params.animals.join(' + ') : 'None'}</div>
      ${item.pet.gender ? `<div class="pet-card-meta"><strong>Gender:</strong> ${item.pet.gender} ${item.pet.gender === 'masculine' ? '♂️' : item.pet.gender === 'feminine' ? '♀️' : '⚖️'}</div>` : ''}
      ${item.params.evolutionPath ? `<div class="pet-card-meta"><strong>Evolution:</strong> ${item.params.evolutionPath} ${pathEmoji}</div>` : ''}
      ${item.pet.isRare ? `<div class="pet-card-meta"><strong>Rare:</strong> <span class="rare-indicator rare-${item.pet.rareType}">${item.pet.rareType.toUpperCase()}</span></div>` : ''}

      ${renderAugments(augments, item.id)}

      ${item.pet.prompt ? renderPromptDebug(item) : ''}

      <div class="pet-card-actions">
        <div class="pet-card-actions-title">🎮 Actions:</div>

        ${renderEvolutionButtons(item)}
        ${renderMergeButton(item)}

        <div>
          <button class="secondary btn-small" onclick="loadFromHistory('${item.id}')">📋 Load Settings</button>
          <button class="secondary btn-small" onclick="deleteFromHistory('${item.id}')">🗑️ Delete</button>
        </div>
      </div>
    </div>
  `;
};

const renderSingleImage = (item) => {
  return `
    <div class="pet-image-container" onclick="showPetDetails('${item.id}')">
      <img src="${item.pet.imageUrl}" alt="Generated Pet">
      <div class="stage-badge">Stage ${item.pet.stage}</div>
      ${item.pet.isRare ? `<div class="rare-badge">${item.pet.rareType.toUpperCase()}</div>` : ''}
    </div>
  `;
};

const renderComparisonImages = (item) => {
  return `
    <div style="margin-bottom: 10px;">
      <div class="pet-card-meta" style="font-weight: bold; color: #007cba; text-align: center;">🔬 Method Comparison</div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
        <div style="border: 2px solid #4CAF50; border-radius: 6px; padding: 8px;">
          <div style="font-size: 9px; font-weight: bold; color: #4CAF50; margin-bottom: 4px; text-align: center;">
            ${item.pet.comparison.method1.label || 'Method 1'}
          </div>
          <div class="pet-image-container" onclick="showPetDetails('${item.id}')">
            <img src="${item.pet.comparison.method1.imageUrl}" alt="Method 1">
          </div>
          <div style="font-size: 8px; color: #666; margin-top: 4px; text-align: center;">${item.pet.comparison.method1.method || 'Primary'}</div>
        </div>
        <div style="border: 2px solid #2196F3; border-radius: 6px; padding: 8px;">
          <div style="font-size: 9px; font-weight: bold; color: #2196F3; margin-bottom: 4px; text-align: center;">
            ${item.pet.comparison.method2.label || 'Method 2'}
          </div>
          <div class="pet-image-container" onclick="showPetDetails('${item.id}')">
            <img src="${item.pet.comparison.method2.imageUrl}" alt="Method 2">
          </div>
          <div style="font-size: 8px; color: #666; margin-top: 4px; text-align: center;">${item.pet.comparison.method2.method || 'Alternative'}</div>
        </div>
      </div>
    </div>
  `;
};

const renderPromptDebug = (item) => {
  return `
    <div class="prompt-debug">
      <div class="prompt-debug-toggle" onclick="togglePrompt('${item.id}')">
        🔍 Debug: View Prompt <span id="toggle-${item.id}" style="font-size: 9px;">(click to expand)</span>
      </div>
      <div id="prompt-${item.id}" class="prompt-debug-content">${item.pet.prompt.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
    </div>
  `;
};

const renderEvolutionButtons = (item) => {
  if (item.pet.stage >= (item.pet.maxStages || 5)) {
    return '<div class="max-evolution-msg">🏆 Max evolution reached</div>';
  }

  return `
    <div class="evolution-btn-group">
      <label>Evolve to Stage ${item.pet.stage + 1}:</label>
      <button class="btn-gentle" onclick="evolveFromHistory('${item.id}', 'gentle')">💚 Gentle</button>
      <button class="btn-bold" onclick="evolveFromHistory('${item.id}', 'bold')">🔥 Bold</button>
      <button class="btn-curious" onclick="evolveFromHistory('${item.id}', 'curious')">✨ Curious</button>
    </div>
  `;
};

const renderMergeButton = (item) => {
  return `
    <div class="merge-btn-group">
      <button class="btn-merge" onclick="selectForMerge('${item.id}')">🔀 Select for Merge</button>
    </div>
  `;
};

export default renderPetCard;
