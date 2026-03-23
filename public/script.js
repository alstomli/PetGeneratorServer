/**
 * Pet Evolution Frontend
 *
 * Client-side JavaScript for the kid-friendly pet evolution game.
 * Handles pet generation, evolution, modification, merging, and family tree display.
 *
 * Features:
 *   - Generate new baby pets with customizable style, colors, and animals
 *   - Evolve pets through 3 stages (Baby → Juvenile → Adult)
 *   - Three evolution paths: Gentle, Bold, Curious
 *   - Modify pets with accessories (Wizard, Royal, Warrior gear)
 *   - Merge two pets to create unique offspring with rare outcomes
 *   - Family tree visualization showing pet lineages
 *   - Server-side persistence of pet data
 */

let currentPet = null;
let droppedImageData = null;
let generationHistory = [];

// Merge state
let mergeSelection = {
    pet1: null,
    pet2: null
};

// Augment tooltip element
let augmentTooltip = null;

// Category icons for augments
const AUGMENT_ICONS = {
    elemental: '🔥',
    celestial: '⭐',
    nature: '🌿',
    spirit: '👻',
    arcane: '✨'
};

// Rarity tier definitions
const RARITY_TIERS = {
    common: { name: 'Common', minWeight: 0, class: 'rarity-common' },
    uncommon: { name: 'Uncommon', minWeight: 1, class: 'rarity-uncommon' },
    rare: { name: 'Rare', minWeight: 3, class: 'rarity-rare' },
    legendary: { name: 'Legendary', minWeight: 5, class: 'rarity-legendary' },
    mythical: { name: 'Mythical', minWeight: 7, class: 'rarity-mythical' }
};

// Calculate rarity from augments
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

// Render rarity badge
const renderRarityBadge = (augments) => {
    const rarity = calculateRarity(augments);
    return `<span class="rarity-badge ${rarity.class}">${rarity.name}</span>`;
};

// Render augments section
const renderAugmentsSection = (augments, petId) => {
    if (!augments || augments.length === 0) {
        return '';
    }

    const augmentBadges = augments.map((aug, idx) => {
        const icon = AUGMENT_ICONS[aug.category] || '💎';
        const weightStars = '★'.repeat(aug.weight);
        const augData = encodeURIComponent(JSON.stringify(aug));
        return `
            <span class="augment-badge ${aug.category}"
                  data-augment='${augData}'
                  onmouseenter="showAugmentTooltip(event, this)"
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

// Get or create augment tooltip element
const getAugmentTooltip = () => {
    if (!augmentTooltip) {
        augmentTooltip = document.createElement('div');
        augmentTooltip.className = 'augment-tooltip';
        augmentTooltip.id = 'augment-tooltip';
        document.body.appendChild(augmentTooltip);
    }
    return augmentTooltip;
};

// Show augment tooltip
const showAugmentTooltip = (event, element) => {
    const augData = element.getAttribute('data-augment');
    if (!augData) return;

    try {
        const augment = JSON.parse(decodeURIComponent(augData));
        const tooltip = getAugmentTooltip();

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

        const rect = element.getBoundingClientRect();
        const tooltipHeight = 150;
        const tooltipWidth = 280;

        let left = rect.left + window.scrollX;
        let top = rect.bottom + window.scrollY + 5;

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

// Hide augment tooltip
const hideAugmentTooltip = () => {
    const tooltip = getAugmentTooltip();
    tooltip.classList.remove('visible');
};

// Load generation history from server
const loadGenerationHistory = async () => {
    try {
        const response = await fetch(`${API_BASE}/pets`);
        if (response.ok) {
            generationHistory = await response.json();
            console.log('Loaded generation history from server:', generationHistory.length, 'items');
            updateHistoryCount();
            updateHistoryDisplay();
        } else {
            console.error('Failed to load generation history');
        }
    } catch (error) {
        console.error('Error loading generation history:', error);
    }
};

const API_BASE = '/api';

// History management with server-side storage
const saveToHistory = async (pet, params) => {
    console.log('Saving pet to history:', { pet, params });

    try {
        const response = await fetch(`${API_BASE}/pets/save`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ pet, params })
        });

        if (response.ok) {
            console.log('Successfully saved pet to server');
            // Reload the history to get the updated list
            await loadGenerationHistory();
        } else {
            const error = await response.json();
            console.error('Failed to save pet to server:', error);
        }
    } catch (error) {
        console.error('Error saving pet to server:', error);
    }
};

const getFamilyLine = (parentId) => {
    const parent = generationHistory.find(h => h.id == parentId);
    return parent ? [...(parent.familyLine || [parent.id]), Date.now()] : [Date.now()];
};

const updateHistoryCount = () => {
    const historyCountElement = document.getElementById('historyCount');
    if (historyCountElement) {
        historyCountElement.textContent = `${generationHistory.length} generations saved`;
    }
};

const buildFamilyTrees = () => {
    // Group pets by root ancestor
    const families = {};

    generationHistory.forEach(item => {
        // Merged pets are their own family trees (use full ID as root)
        // Regular pets use the first part of their ID as the root
        const isMerged = item.id.startsWith('merge-') || item.params.isMerged;
        const rootId = isMerged ? item.id : item.id.split('-')[0];

        if (!families[rootId]) {
            families[rootId] = {
                root: null,
                descendants: [],
                isMerged: isMerged
            };
        }

        // Check if this is the root ancestor
        // Merged pets are always roots of their own tree
        // Regular pets: no parentId means it's a root
        if (isMerged || item.id === rootId || !item.params.parentId) {
            families[rootId].root = item;
        } else {
            families[rootId].descendants.push(item);
        }
    });

    return families;
};

const renderFamilyTree = (family) => {
    if (!family.root) return '';

    const root = family.root;
    const descendants = family.descendants.sort((a, b) => a.pet.stage - b.pet.stage);

    // Different display for merged pets vs regular family trees
    const isMerged = family.isMerged || root.params.isMerged;
    const treeTitle = isMerged
        ? `🔀 Merged Pet - Created ${new Date(root.timestamp).toLocaleDateString()}`
        : `🌳 Family Tree - Started ${new Date(root.timestamp).toLocaleDateString()}`;
    const stageLabel = isMerged
        ? `🧬 Stage ${root.pet.stage} - Merged Offspring`
        : `👑 Stage ${root.pet.stage} - Original`;

    let html = `
        <div class="family-tree ${isMerged ? 'merged-family' : ''}">
            <h3 class="family-tree-title">${treeTitle}</h3>
            <div class="evolution-chain">
                <div class="stage-column">
                    <div class="stage-label stage-label-root">${stageLabel}</div>
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

// Render parent pet thumbnails for merged pets
const renderParentThumbnails = (parentIds) => {
    if (!parentIds || parentIds.length < 2) return '';

    const parent1 = generationHistory.find(h => h.id === parentIds[0]);
    const parent2 = generationHistory.find(h => h.id === parentIds[1]);

    if (!parent1 || !parent2) return '';

    return `
        <div class="parent-thumbnails">
            <div class="parent-label">Parents:</div>
            <div class="parent-images">
                <div class="parent-thumb" title="Parent 1: ${parent1.params.style || 'unknown'} style">
                    <img src="${parent1.pet.imageUrl}" alt="Parent 1">
                </div>
                <div class="parent-plus">+</div>
                <div class="parent-thumb" title="Parent 2: ${parent2.params.style || 'unknown'} style">
                    <img src="${parent2.pet.imageUrl}" alt="Parent 2">
                </div>
            </div>
        </div>
    `;
};

const renderPetCard = (item, isRoot) => {
    const cardClass = isRoot ? 'pet-card pet-card-root' : 'pet-card pet-card-evolution';
    const hasComparison = item.pet.comparison && item.pet.comparison.method1 && item.pet.comparison.method2;
    const width = hasComparison ? '600px' : '280px';

    // Get style/colors from params or fall back to pet object (for merged pets)
    const style = item.params.style || item.pet.style || 'unknown';
    const colorPalette = item.params.colorPalette || item.pet.colorPalette || 'unknown';
    const animals = item.params.animals || item.pet.animals || [];

    const styleEmoji = style === 'gentle' ? '💚' : style === 'bold' ? '🔥' : '✨';
    const pathEmoji = item.params.evolutionPath === 'gentle' ? '💚' : item.params.evolutionPath === 'bold' ? '🔥' : '✨';

    // Get augments and rarity
    const augments = item.pet.augments || [];
    const rarityBadge = renderRarityBadge(augments);

    // Check if this is a merged pet
    const isMerged = item.params.isMerged || item.pet.parentIds;

    return `
        <div class="${cardClass}" style="width: ${width};">
            <div class="pet-card-header">
                <div class="timestamp">${new Date(item.timestamp).toLocaleString()}</div>
                <div class="pet-card-meta text-muted">${rarityBadge}</div>
            </div>

            ${hasComparison ? `
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
            ` : `
                <div class="pet-image-container" onclick="showPetDetails('${item.id}')">
                    <img src="${item.pet.imageUrl}" alt="Generated Pet">
                </div>
            `}

            <div class="pet-card-meta"><strong>Style:</strong> ${style} ${styleEmoji}</div>
            <div class="pet-card-meta"><strong>Colors:</strong> ${colorPalette}</div>
            <div class="pet-card-meta"><strong>Animals:</strong> ${animals && animals.length ? animals.join(' + ') : 'None'}</div>
            ${item.pet.gender ? `<div class="pet-card-meta"><strong>Gender:</strong> ${item.pet.gender} ${item.pet.gender === 'masculine' ? '♂️' : item.pet.gender === 'feminine' ? '♀️' : '⚖️'}</div>` : ''}
            ${item.params.evolutionPath ? `<div class="pet-card-meta"><strong>Evolution:</strong> ${item.params.evolutionPath} ${pathEmoji}</div>` : ''}
            ${item.pet.isRare ? `<div class="pet-card-meta"><strong>Merge Bonus:</strong> <span class="rare-indicator rare-${item.pet.rareType}">${item.pet.rareType.toUpperCase()}</span></div>` : ''}
            ${isMerged && item.pet.parentIds ? renderParentThumbnails(item.pet.parentIds) : ''}

            ${renderAugmentsSection(augments, item.id)}

            ${item.pet.prompt ? `
            <div class="prompt-debug">
                <div class="prompt-debug-toggle" onclick="togglePrompt('${item.id}')">
                    🔍 Debug: View Prompt <span id="toggle-${item.id}" style="font-size: 9px;">(click to expand)</span>
                </div>
                <div id="prompt-${item.id}" class="prompt-debug-content">${item.pet.prompt.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
            </div>
            ` : ''}

            <div class="pet-card-actions">
                <div class="pet-card-actions-title">🎮 Actions:</div>

                ${item.pet.stage < (item.pet.maxStages || 5) ? `
                    <div class="evolution-btn-group">
                        <label>Evolve to Stage ${item.pet.stage + 1}:</label>
                        <button class="btn-gentle" onclick="evolveFromHistory('${item.id}', 'gentle')">💚 Gentle</button>
                        <button class="btn-bold" onclick="evolveFromHistory('${item.id}', 'bold')">🔥 Bold</button>
                        <button class="btn-curious" onclick="evolveFromHistory('${item.id}', 'curious')">✨ Curious</button>
                    </div>
                ` : '<div class="max-evolution-msg">🏆 Max evolution reached</div>'}

                <div class="merge-btn-group" style="margin-bottom: 8px;">
                    <button class="btn-merge" onclick="selectForMerge('${item.id}')" style="background: ${mergeSelection.pet1?.id === item.id || mergeSelection.pet2?.id === item.id ? '#138496' : '#17a2b8'};">
                        ${mergeSelection.pet1?.id === item.id ? '✓ Parent 1' : mergeSelection.pet2?.id === item.id ? '✓ Parent 2' : '🔀 Select for Merge'}
                    </button>
                </div>

                <div>
                    <button class="secondary btn-small" onclick="loadFromHistory('${item.id}')">📋 Load Settings</button>
                    <button class="secondary btn-small" onclick="deleteFromHistory('${item.id}')">🗑️ Delete</button>
                </div>
            </div>
        </div>
    `;
};

const updateHistoryDisplay = () => {
    const container = document.getElementById('historyContainer');

    if (generationHistory.length === 0) {
        container.innerHTML = '<p>No generations yet. Start creating pets to see your history!</p>';
        return;
    }

    const families = buildFamilyTrees();

    container.innerHTML = Object.values(families).map(family => renderFamilyTree(family)).join('');
};

const showPetDetails = (petId) => {
    const item = generationHistory.find(h => h.id == petId);
    if (!item) return;

    // Simple modal or expanded view - for now just scroll to bottom and show details
    updatePetData(item.pet);

    // Show family lineage
    const family = getFamilyMembers(petId);
    console.log('Pet Family Tree:', family);
};

const getFamilyMembers = (petId) => {
    const item = generationHistory.find(h => h.id == petId);
    if (!item) return [];

    // Find all descendants
    const descendants = generationHistory.filter(h =>
        h.params.parentId == petId ||
        (h.familyLine && h.familyLine.includes(parseInt(petId)))
    );

    return {
        pet: item,
        children: descendants
    };
};

const togglePrompt = (id) => {
    const promptDiv = document.getElementById(`prompt-${id}`);
    const toggleSpan = document.getElementById(`toggle-${id}`);

    if (promptDiv.style.display === 'none') {
        promptDiv.style.display = 'block';
        toggleSpan.textContent = '(click to collapse)';
    } else {
        promptDiv.style.display = 'none';
        toggleSpan.textContent = '(click to expand)';
    }
};

const loadFromHistory = (historyId) => {
    const item = generationHistory.find(h => h.id == historyId);
    if (!item) return;

    // Load the parameters into the form (no tab switching needed)
    document.getElementById('style').value = item.params.style;
    document.getElementById('colorPalette').value = item.params.colorPalette;
    document.getElementById('animal1').value = item.params.animals[0] || '';
    document.getElementById('animal2').value = item.params.animals[1] || '';
    document.getElementById('maxStages').value = item.params.maxStages;

    // Scroll to the top to show the form
    document.querySelector('.section').scrollIntoView({ behavior: 'smooth' });
};

const deleteFromHistory = async (historyId) => {
    try {
        const response = await fetch(`${API_BASE}/pets/${historyId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            console.log('Successfully deleted pet from server');
            // Reload the history to get the updated list
            await loadGenerationHistory();
        } else {
            const error = await response.json();
            console.error('Failed to delete pet from server:', error);
        }
    } catch (error) {
        console.error('Error deleting pet from server:', error);
    }
};

const clearHistory = async () => {
    if (confirm('Are you sure you want to clear all generation history?')) {
        try {
            // Delete all pets one by one
            const deletePromises = generationHistory.map(item =>
                fetch(`${API_BASE}/pets/${item.id}`, { method: 'DELETE' })
            );

            await Promise.all(deletePromises);
            console.log('Successfully cleared all pets from server');

            // Reload the history to get the updated list
            await loadGenerationHistory();
        } catch (error) {
            console.error('Error clearing pets from server:', error);
        }
    }
};

const exportHistory = () => {
    const data = JSON.stringify(generationHistory, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pet-generation-history-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
};

// Available color palettes
const COLOR_PALETTES = [
    // Warm tones
    'sunset orange', 'golden sun', 'cherry blossom pink', 'autumn leaves', 'coral reef', 'cinnamon spice',
    // Cool tones
    'ocean blue', 'forest green', 'arctic ice', 'lavender dreams', 'mint fresh', 'slate storm',
    // Vibrant
    'rainbow bright', 'neon electric', 'tropical paradise', 'berry blast',
    // Magical/Dark
    'purple magic', 'starry night', 'midnight galaxy', 'mystic moonlight',
    // Soft/Light
    'pink princess', 'cotton candy', 'pastel sunrise', 'cream vanilla',
    // Earthy
    'mossy woodland', 'desert sand', 'volcanic ember'
];

// Get a random color palette
const getRandomColorPalette = () => {
    return COLOR_PALETTES[Math.floor(Math.random() * COLOR_PALETTES.length)];
};

// Form utilities
const resetForm = () => {
    document.getElementById('generateForm').reset();
    document.getElementById('style').value = 'gentle';
    document.getElementById('colorPalette').value = 'random';
    document.getElementById('maxStages').value = 3;
    document.getElementById('generateResult').innerHTML = '';
};

const randomizeForm = () => {
    const styles = ['gentle', 'bold', 'curious'];
    const animals = ['cat', 'dog', 'dragon', 'butterfly', 'bird', 'bunny', 'fox', 'bear'];

    document.getElementById('style').value = styles[Math.floor(Math.random() * styles.length)];
    document.getElementById('colorPalette').value = getRandomColorPalette();

    // Randomly pick 0-2 animals
    const numAnimals = Math.floor(Math.random() * 3); // 0, 1, or 2
    if (numAnimals >= 1) {
        const animal1 = animals[Math.floor(Math.random() * animals.length)];
        document.getElementById('animal1').value = animal1;

        if (numAnimals === 2) {
            let animal2;
            do {
                animal2 = animals[Math.floor(Math.random() * animals.length)];
            } while (animal2 === animal1);
            document.getElementById('animal2').value = animal2;
        } else {
            document.getElementById('animal2').value = '';
        }
    } else {
        document.getElementById('animal1').value = '';
        document.getElementById('animal2').value = '';
    }
};

// Evolution from history
const evolveFromHistory = async (historyId, evolutionPath) => {
    const item = generationHistory.find(h => h.id == historyId);
    if (!item) return;

    const pet = item.pet;
    if (pet.stage >= (pet.maxStages || 5)) {
        alert('This pet is already at maximum evolution!');
        return;
    }

    // Check if bonus potion is enabled
    const bonusPotion = document.getElementById('bonusPotion')?.checked || false;

    try {
        let endpoint = `${API_BASE}/google/evolve-pet`;

        // Show loading state
        const historyContainer = document.getElementById('historyContainer');
        const loadingDiv = document.createElement('div');
        loadingDiv.innerHTML = `<div class="loading"><div class="spinner"></div>Evolving ${evolutionPath} pet to Stage ${pet.stage + 1}...${bonusPotion ? ' (with Bonus Potion!)' : ''}</div>`;
        historyContainer.prepend(loadingDiv);

        // Fetch the pet image and send it along with the evolution request
        let response;
        try {
            // Get the pet image data
            const imageResponse = await fetch(pet.imageUrl);
            const imageBlob = await imageResponse.blob();

            // Create FormData for image upload
            const formData = new FormData();
            formData.append('petId', pet.id);
            formData.append('currentStage', pet.stage);
            formData.append('maxStages', pet.maxStages);
            formData.append('description', pet.description);
            formData.append('evolutionPath', evolutionPath);
            formData.append('colorPalette', item.params.colorPalette || '');
            formData.append('previousMetadata', pet.metadata || '');
            formData.append('image', imageBlob, 'pet-image.png');
            formData.append('guaranteeAugment', bonusPotion);
            // Pass existing augments for inheritance
            if (pet.augments && pet.augments.length > 0) {
                formData.append('augments', JSON.stringify(pet.augments));
            }

            response = await fetch(endpoint, {
                method: 'POST',
                body: formData // Don't set Content-Type header, let browser set it for FormData
            });
        } catch (imageError) {
            console.log('Could not fetch image, falling back to text-only evolution:', imageError);
            // Fallback to text-only evolution if image fetch fails
            const requestData = {
                petId: pet.id,
                currentStage: pet.stage,
                maxStages: pet.maxStages,
                description: pet.description,
                evolutionPath: evolutionPath,
                augments: pet.augments || [],
                guaranteeAugment: bonusPotion
            };

            response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestData)
            });
        }

        const result = await response.json();

        if (response.ok) {
            console.log('Evolution result received:', result);
            console.log('Has comparison data:', !!result.comparison);

            // Save the evolved pet to history (includes comparison data if present)
            const evolvedParams = {
                ...item.params,
                evolutionPath: evolutionPath,
                parentId: item.id
            };
            await saveToHistory(result, evolvedParams);

            // Update displays
            updatePetData(result);

            // Remove loading
            loadingDiv.remove();
        } else {
            loadingDiv.remove();
            alert(`Evolution failed: ${result.error}`);
        }
    } catch (error) {
        alert(`Evolution error: ${error.message}`);
    }
};

// =============================================================================
// MERGE FUNCTIONALITY
// =============================================================================

const selectForMerge = async (petId) => {
    const pet = generationHistory.find(h => h.id == petId);
    if (!pet) return;

    // Check if already selected
    if (mergeSelection.pet1?.id === petId) {
        mergeSelection.pet1 = null;
    } else if (mergeSelection.pet2?.id === petId) {
        mergeSelection.pet2 = null;
    } else {
        // Select in first empty slot
        if (!mergeSelection.pet1) {
            mergeSelection.pet1 = pet;
        } else if (!mergeSelection.pet2) {
            mergeSelection.pet2 = pet;
        } else {
            // Both full, replace second
            mergeSelection.pet2 = pet;
        }
    }

    updateHistoryDisplay();
    updateMergePanel();
};

const removeMergeSelection = (slot) => {
    if (slot === 1) {
        mergeSelection.pet1 = null;
    } else {
        mergeSelection.pet2 = null;
    }
    updateHistoryDisplay();
    updateMergePanel();
};

const clearMergeSelectionUI = () => {
    mergeSelection.pet1 = null;
    mergeSelection.pet2 = null;
    updateHistoryDisplay();
    updateMergePanel();
};

const updateMergePanel = async () => {
    const container = document.getElementById('mergePanelContainer');
    if (!container) return;

    let preview = null;

    // Get preview if both pets selected
    if (mergeSelection.pet1 && mergeSelection.pet2) {
        try {
            const response = await fetch(`${API_BASE}/google/merge-pets/preview?pet1Id=${mergeSelection.pet1.id}&pet2Id=${mergeSelection.pet2.id}`);
            if (response.ok) {
                preview = await response.json();
            }
        } catch (error) {
            console.error('Error getting merge preview:', error);
        }
    }

    container.innerHTML = renderMergePanel(preview);
};

const renderMergePanel = (preview) => {
    const ready = mergeSelection.pet1 && mergeSelection.pet2;

    return `
        <div class="merge-section">
            <h3 class="merge-section-title">🔀 Pet Fusion Chamber</h3>
            <p class="text-muted" style="margin: 0 0 15px 0;">
                Select two pets of the <strong>same stage</strong> from different family lines to merge them into a new unique creature!
                ${ready ? '<strong style="color: #28a745;">Ready to merge!</strong>' : 'Click "Select for Merge" on any two pets below.'}
            </p>

            <div class="merge-selection">
                ${renderMergeSlot(1, mergeSelection.pet1)}
                <div class="merge-controls">
                    <div style="font-size: 32px;">+</div>
                    <button
                        class="merge-button"
                        onclick="executeMerge()"
                        ${!ready ? 'disabled' : ''}
                    >
                        🧬 Merge Pets!
                    </button>
                    ${ready ? '<button class="secondary btn-small" onclick="clearMergeSelectionUI()">Clear Selection</button>' : ''}
                </div>
                ${renderMergeSlot(2, mergeSelection.pet2)}
            </div>

            ${preview ? renderMergePreview(preview) : ''}
        </div>
    `;
};

const renderMergeSlot = (slotNum, pet) => {
    if (!pet) {
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
            <img src="${pet.pet.imageUrl}" alt="Parent ${slotNum}" style="max-width: 150px; border-radius: 8px;">
            <div class="pet-info" style="font-size: 11px; margin-top: 8px;">
                <div><strong>${pet.params.style}</strong> - Stage ${pet.pet.stage}</div>
                <div>${pet.params.colorPalette}</div>
                ${pet.params.evolutionPath ? `<div>Path: ${pet.params.evolutionPath}</div>` : ''}
            </div>
            <button class="secondary btn-small" onclick="removeMergeSelection(${slotNum})">✕ Remove</button>
        </div>
    `;
};

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

const executeMerge = async () => {
    if (!mergeSelection.pet1 || !mergeSelection.pet2) return;

    // Update UI to show loading
    const container = document.getElementById('mergePanelContainer');
    if (container) {
        const currentContent = container.innerHTML;
        container.innerHTML = `
            <div class="merge-section">
                <h3 class="merge-section-title">🔀 Pet Fusion Chamber</h3>
                <div class="loading" style="justify-content: center; padding: 40px;">
                    <div class="spinner"></div>
                    <span>Merging pets... Creating new life!</span>
                </div>
            </div>
        `;
    }

    try {
        const response = await fetch(`${API_BASE}/google/merge-pets`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                pet1Id: mergeSelection.pet1.id,
                pet2Id: mergeSelection.pet2.id
            })
        });

        const result = await response.json();

        if (response.ok) {
            // Save the merged pet
            await saveToHistory(result.pet, {
                style: result.pet.style,
                colorPalette: result.pet.colorPalette,
                animals: result.pet.animals,
                parentIds: result.pet.parentIds,
                isMerged: true,
                isRare: result.isRare,
                rareType: result.rareType
            });

            // Clear selection and reload
            mergeSelection.pet1 = null;
            mergeSelection.pet2 = null;
            await loadGenerationHistory();
            updateMergePanel();

            // Show success message
            if (result.isRare) {
                alert(`🎉 RARE ${result.rareType.toUpperCase()} MERGE! Your merged pet has special characteristics!`);
            } else {
                alert('✨ Merge successful! Your new pet has been created.');
            }
        } else {
            alert(`Merge failed: ${result.error}`);
            updateMergePanel();
        }
    } catch (error) {
        console.error('Merge error:', error);
        alert(`Merge error: ${error.message}`);
        updateMergePanel();
    }
};

const updatePetData = (pet) => {
    currentPet = pet;
    // Check if petData element exists (from older UI versions)
    const petDataElement = document.getElementById('petData');
    if (petDataElement) {
        petDataElement.textContent = JSON.stringify(pet, null, 2);
    }
};

const showResult = (containerId, content, isError = false) => {
    const container = document.getElementById(containerId);
    container.innerHTML = content;
    container.className = `result ${isError ? 'error' : 'success'}`;
};

const showLoading = (containerId, message = 'Loading...') => {
    const container = document.getElementById(containerId);
    container.innerHTML = `<div class="loading"><div class="spinner"></div>${message}</div>`;
};

const setButtonLoading = (buttonId, isLoading, originalText = 'Submit') => {
    // Try to find button by ID first, then by form selector
    let button = document.getElementById(buttonId);
    if (!button) {
        // If buttonId ends with 'Form', look for submit button inside that form
        if (buttonId.endsWith('Form')) {
            const formId = buttonId;
            button = document.querySelector(`#${formId} button[type="submit"]`);
        } else {
            // Fallback: look for submit button in section with similar name
            button = document.querySelector(`#${buttonId.replace('Form', '')} button[type="submit"]`);
        }
    }

    if (button) {
        button.disabled = isLoading;
        if (isLoading) {
            button.innerHTML = `<div class="spinner" style="width: 16px; height: 16px; border-width: 1px; margin-right: 8px; display: inline-block;"></div>Loading...`;
        } else {
            button.textContent = originalText;
        }
    } else {
        console.warn(`Button not found for ID: ${buttonId}`);
    }
};

// Form submission handler

document.getElementById('generateForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    // Build animals array from the two select dropdowns
    const animals = [];
    const animal1 = formData.get('animal1');
    const animal2 = formData.get('animal2');

    if (animal1) animals.push(animal1);
    if (animal2 && animal2 !== animal1) animals.push(animal2);

    const bonusPotion = document.getElementById('bonusPotion')?.checked || false;

    // Handle random color palette selection
    let colorPalette = formData.get('colorPalette');
    if (colorPalette === 'random') {
        colorPalette = getRandomColorPalette();
    }

    const requestData = {
        style: formData.get('style'),
        colorPalette: colorPalette,
        animals: animals,
        maxStages: parseInt(formData.get('maxStages')),
        guaranteeAugment: bonusPotion
    };
    
    showLoading('generateResult', 'Generating your pet...');
    // Keep form enabled during generation
    
    try {
        let endpoint = `${API_BASE}/google/generate-pet`;

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestData)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            updatePetData(result);

            // Save to history - the pet will show up in the family tree section
            await saveToHistory(result, requestData);

            // Show success message instead of duplicate pet display
            showResult('generateResult', `<div style="color: green; font-weight: bold;">✅ Pet generated successfully! Check the family tree below.</div>`);

            // Clear the success message after 3 seconds
            setTimeout(() => {
                document.getElementById('generateResult').innerHTML = '';
            }, 3000);
        } else {
            showResult('generateResult', `Error: ${result.error}`, true);
        }
    } catch (error) {
        showResult('generateResult', `Connection error: ${error.message}`, true);
    }
    // Form stays enabled throughout the process
});

// Generate Complete Evolution Line - creates base pet + all 3 evolution paths to stage 3
const generateCompleteEvolutionLine = async () => {
    const form = document.getElementById('generateForm');
    const formData = new FormData(form);

    const style = formData.get('style');
    let colorPalette = formData.get('colorPalette');
    const animal1 = formData.get('animal1');
    const animal2 = formData.get('animal2');
    const maxStages = parseInt(formData.get('maxStages')) || 3;

    // Handle random color palette selection
    if (colorPalette === 'random' || !colorPalette) {
        colorPalette = getRandomColorPalette();
    }

    const animals = [animal1, animal2].filter(a => a && a.trim() !== '');

    const requestData = {
        style: style || 'gentle',
        colorPalette: colorPalette,
        animals,
        maxStages
    };

    try {
        // Show loading message
        showResult('generateResult', `
            <div class="loading">
                <div class="spinner"></div>
                Generating complete evolution line (1 base + 9 evolutions)... This will take a few minutes.
            </div>
        `);

        // Step 1: Generate base pet
        let endpoint = `${API_BASE}/google/generate-pet`;

        const baseResponse = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestData)
        });

        if (!baseResponse.ok) {
            const error = await baseResponse.json();
            throw new Error(error.error || 'Failed to generate base pet');
        }

        const basePet = await baseResponse.json();
        console.log('Generated base pet:', basePet);

        // Save base pet to history
        await saveToHistory(basePet, requestData);

        // Update loading message
        showResult('generateResult', `
            <div class="loading">
                <div class="spinner"></div>
                Base pet created! Generating evolution paths...
            </div>
        `);

        // Step 2: Generate all 3 evolution paths to stage 3 IN PARALLEL
        const evolutionPaths = ['gentle', 'bold', 'curious'];
        let completedEvolutions = 0;
        const totalEvolutions = 6; // 3 paths × 2 stages each

        // Helper function to evolve a single path through all stages
        const evolvePathToCompletion = async (path) => {
            let currentPetImage = basePet.imageUrl;
            let currentStage = 1;
            let currentPetId = basePet.id;
            const pathResults = [];

            // Evolve through stages 2 and 3 sequentially for this path
            for (let targetStage = 2; targetStage <= 3; targetStage++) {
                try {
                    // Convert base64 to blob for upload
                    const base64Data = currentPetImage.replace(/^data:image\/[a-z]+;base64,/, '');
                    const blob = await fetch(`data:image/png;base64,${base64Data}`).then(r => r.blob());

                    const evolveFormData = new FormData();
                    evolveFormData.append('image', blob, 'pet.png');
                    evolveFormData.append('petId', currentPetId);
                    evolveFormData.append('currentStage', currentStage.toString());
                    evolveFormData.append('maxStages', maxStages.toString());
                    evolveFormData.append('description', basePet.description || 'Pet evolution');
                    evolveFormData.append('basePrompt', basePet.prompt || '');
                    evolveFormData.append('evolutionPath', path);
                    evolveFormData.append('colorPalette', basePet.colorPalette || colorPalette || '');
                    // Pass metadata from previous stage for signature feature tracking
                    if (pathResults.length > 0) {
                        const prevEvolution = pathResults[pathResults.length - 1];
                        evolveFormData.append('previousMetadata', prevEvolution.metadata || basePet.metadata || '');
                    } else {
                        evolveFormData.append('previousMetadata', basePet.metadata || '');
                    }
                    // Pass previous image URL for GPT vision
                    evolveFormData.append('previousImageUrl', currentPetImage);

                    // Use Google Gemini for evolution
                    let evolveEndpoint = `${API_BASE}/google/evolve-pet`;

                    const evolveResponse = await fetch(evolveEndpoint, {
                        method: 'POST',
                        body: evolveFormData
                    });

                    if (!evolveResponse.ok) {
                        const error = await evolveResponse.json();
                        console.error(`Failed to evolve ${path} pet to stage ${targetStage}:`, error);
                        pathResults.push({ error: `Failed stage ${targetStage}`, path, targetStage });
                        continue; // Skip this evolution but continue with others
                    }

                    const evolvedPet = await evolveResponse.json();
                    console.log(`Generated ${path} evolution stage ${targetStage}:`, evolvedPet);
                    console.log('Has comparison?', !!evolvedPet.comparison);
                    if (evolvedPet.comparison) {
                        console.log('Comparison data:', evolvedPet.comparison);
                    }

                    // Display comparison if available
                    if (evolvedPet.comparison) {
                        console.log('COMPARISON AVAILABLE:');
                        console.log('Method 1 (Gemini + Image):', evolvedPet.comparison.method1.label);
                        console.log('Method 2 (GPT Direct):', evolvedPet.comparison.method2.label);

                        // Show comparison in UI
                        showResult('generateResult', `
                            <div class="loading">
                                <div class="spinner"></div>
                                Generated ${completedEvolutions}/${totalEvolutions} evolutions (${path} stage ${targetStage})...
                            </div>
                            <h3>🔬 Evolution Comparison - ${path.toUpperCase()} Path Stage ${targetStage}</h3>
                            <div style="display: flex; gap: 20px; margin: 20px 0;">
                                <div style="flex: 1; border: 2px solid #4CAF50; padding: 15px; border-radius: 8px;">
                                    <h4 style="margin-top: 0;">${evolvedPet.comparison.method1.label}</h4>
                                    <img src="${evolvedPet.comparison.method1.imageUrl}" style="max-width: 100%; border: 1px solid #ddd;">
                                </div>
                                <div style="flex: 1; border: 2px solid #2196F3; padding: 15px; border-radius: 8px;">
                                    <h4 style="margin-top: 0;">${evolvedPet.comparison.method2.label}</h4>
                                    <img src="${evolvedPet.comparison.method2.imageUrl}" style="max-width: 100%; border: 1px solid #ddd;">
                                </div>
                            </div>
                            <p><strong>Primary result (Method 1) will be used for next stage.</strong></p>
                        `);
                    }

                    // Save evolved pet to history
                    await saveToHistory(evolvedPet, {
                        ...requestData,
                        parentId: currentPetId,
                        evolutionPath: path
                    });

                    // Update for next iteration - use Method 1 (primary) image
                    currentPetImage = evolvedPet.imageUrl;
                    currentStage = targetStage;
                    currentPetId = evolvedPet.id;

                    pathResults.push({ success: true, pet: evolvedPet, path, targetStage });

                    // Update global progress counter
                    completedEvolutions++;

                    // Update progress display
                    showResult('generateResult', `
                        <div class="loading">
                            <div class="spinner"></div>
                            Generated ${completedEvolutions}/${totalEvolutions} evolutions (${path} stage ${targetStage})...
                        </div>
                    `);

                } catch (error) {
                    console.error(`Error evolving ${path} pet to stage ${targetStage}:`, error);
                    pathResults.push({ error: error.message, path, targetStage });
                    completedEvolutions++;
                }
            }

            return pathResults;
        };

        // Run all 3 evolution paths in parallel
        try {
            const allPathPromises = evolutionPaths.map(path => evolvePathToCompletion(path));
            const allPathResults = await Promise.all(allPathPromises);

            console.log('All evolution paths completed:', allPathResults);
        } catch (error) {
            console.error('Error during parallel evolution:', error);
        }

        // Show completion message
        showResult('generateResult', `
            <div style="color: green; font-weight: bold;">
                ✅ Complete evolution line generated! Created ${completedEvolutions + 1} pets total.
                <br>Check the family tree below to see all evolution paths.
            </div>
        `);

        // Clear the message after 5 seconds
        setTimeout(() => {
            document.getElementById('generateResult').innerHTML = '';
        }, 5000);

    } catch (error) {
        console.error('Error generating complete evolution line:', error);
        showResult('generateResult', `Error: ${error.message}`, true);
    }
};

// Removed old evolution and modification forms - now handled directly from history

// Initialize on page load
document.addEventListener('DOMContentLoaded', async () => {
    // Load generation history from server
    await loadGenerationHistory();

    // Update the history display immediately since we have a combined view
    updateHistoryDisplay();

    // Initialize merge panel
    updateMergePanel();

    fetch(`${API_BASE}/health`)
        .then(response => response.json())
        .then(data => console.log('API Health:', data))
        .catch(error => console.error('API connection failed:', error));
});