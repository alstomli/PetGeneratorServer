/**
 * Gemini-based augment generation for unique augments.
 * Optional enhancement - 10% of acquisitions use this.
 * @module core/augments/generator
 */

import { AUGMENT_CATEGORIES } from './pool.js';

/**
 * Generate a prompt for creating a unique augment.
 * @param {Object} params - Generation parameters
 * @param {string} params.style - Pet style
 * @param {string[]} params.animals - Animal features
 * @returns {string} Prompt for Gemini
 */
export const buildAugmentGenerationPrompt = ({ style, animals }) => {
  const animalList = animals && animals.length > 0 ? animals.join('/') : 'fantasy creature';
  const categories = Object.values(AUGMENT_CATEGORIES).join(', ');

  return `Create a unique augment for a ${style} pet with ${animalList} features.

An augment is a special modifier that tells a story of what happened to the pet and adds visible magical effects.

Return a JSON object with exactly these fields:
{
  "id": "kebab-case-unique-id",
  "name": "Display Name",
  "story": "Two sentences describing how the pet gained this augment. Make it feel like a mini-adventure or magical encounter.",
  "visualEffects": ["effect 1", "effect 2", "effect 3"],
  "category": "one of: ${categories}",
  "weight": 1-3 (1=common, 2=moderate, 3=rare)
}

Guidelines:
- The story should feel special and earned through adventure
- Visual effects should be subtle but noticeable (not overwhelming)
- Keep it kid-friendly and whimsical
- Make it feel unique, not a copy of existing augments
- The augment should complement the pet's style and features

Return ONLY the JSON object, no other text.`;
};

/**
 * Parse Gemini response into augment object.
 * @param {string} response - Raw Gemini response
 * @returns {Object|null} Parsed augment or null if invalid
 */
export const parseAugmentResponse = (response) => {
  try {
    // Try to extract JSON from the response
    let jsonStr = response.trim();

    // Handle markdown code blocks
    if (jsonStr.startsWith('```json')) {
      jsonStr = jsonStr.slice(7);
    } else if (jsonStr.startsWith('```')) {
      jsonStr = jsonStr.slice(3);
    }
    if (jsonStr.endsWith('```')) {
      jsonStr = jsonStr.slice(0, -3);
    }

    const parsed = JSON.parse(jsonStr.trim());

    // Validate required fields
    if (!parsed.id || !parsed.name || !parsed.story || !parsed.visualEffects || !parsed.category) {
      return null;
    }

    // Validate category
    const validCategories = Object.values(AUGMENT_CATEGORIES);
    if (!validCategories.includes(parsed.category)) {
      // Try to map to closest category
      parsed.category = AUGMENT_CATEGORIES.ARCANE; // Default fallback
    }

    // Validate weight
    parsed.weight = Math.min(3, Math.max(1, parseInt(parsed.weight) || 2));

    // Ensure visualEffects is an array
    if (!Array.isArray(parsed.visualEffects)) {
      parsed.visualEffects = [String(parsed.visualEffects)];
    }

    // Limit to 3 visual effects
    parsed.visualEffects = parsed.visualEffects.slice(0, 3);

    // Ensure id is kebab-case
    parsed.id = parsed.id.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');

    // Mark as generated
    parsed.isGenerated = true;

    return parsed;
  } catch (e) {
    console.error('Failed to parse augment response:', e.message);
    return null;
  }
};

/**
 * Generate a unique augment using Gemini.
 * @param {Object} adapter - Gemini adapter instance
 * @param {Object} params - Generation parameters
 * @param {string} params.style - Pet style
 * @param {string[]} params.animals - Animal features
 * @returns {Promise<Object|null>} Generated augment or null
 */
export const generateUniqueAugment = async (adapter, { style, animals }) => {
  try {
    const prompt = buildAugmentGenerationPrompt({ style, animals });

    // Use text generation (not image generation)
    // Note: This requires the adapter to support text generation
    // For now, we'll use the prompt-only method if available
    if (adapter.generateText) {
      const response = await adapter.generateText(prompt);
      return parseAugmentResponse(response);
    }

    // Fallback: return null if text generation not supported
    console.warn('Text generation not supported by adapter, skipping unique augment generation');
    return null;
  } catch (e) {
    console.error('Failed to generate unique augment:', e.message);
    return null;
  }
};

/**
 * Augment generation cache for reusing good generations.
 */
const augmentCache = new Map();

/**
 * Get a cached augment or generate a new one.
 * @param {Object} adapter - Gemini adapter
 * @param {Object} params - Generation params
 * @returns {Promise<Object|null>} Augment or null
 */
export const getCachedOrGenerateAugment = async (adapter, params) => {
  const cacheKey = `${params.style}-${(params.animals || []).sort().join('-')}`;

  // Check cache first
  if (augmentCache.has(cacheKey)) {
    const cached = augmentCache.get(cacheKey);
    // Return a copy to avoid mutation
    return { ...cached };
  }

  // Generate new augment
  const augment = await generateUniqueAugment(adapter, params);

  // Cache if successful
  if (augment) {
    augmentCache.set(cacheKey, augment);
  }

  return augment;
};

/**
 * Clear the augment cache.
 */
export const clearAugmentCache = () => {
  augmentCache.clear();
};

/**
 * Get cache size.
 * @returns {number} Number of cached augments
 */
export const getAugmentCacheSize = () => {
  return augmentCache.size;
};

export default {
  buildAugmentGenerationPrompt,
  parseAugmentResponse,
  generateUniqueAugment,
  getCachedOrGenerateAugment,
  clearAugmentCache,
  getAugmentCacheSize
};
