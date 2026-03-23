/**
 * Evolution trait selection logic.
 * Pure functions - no framework dependencies.
 * @module core/traits/selector
 */

import { evolutionTraitPools } from './pools.js';

/**
 * Randomly select evolution traits from the trait pool based on path and stage.
 * Stage 2 gets fewer traits (emerging), Stage 3 gets more traits (fully realized).
 *
 * @param {'gentle'|'bold'|'curious'} path - The evolution path
 * @param {number} evolutionStage - The target evolution stage (2 or 3)
 * @param {number} [seed] - Optional seed for deterministic selection (for testing)
 * @returns {{physical: string[], abilities: string[], aesthetic: string[]}} Selected traits
 */
export const selectEvolutionTraits = (path, evolutionStage, seed) => {
  const pool = evolutionTraitPools[path];
  if (!pool) return { physical: [], abilities: [], aesthetic: [] };

  // Use seeded random if provided, otherwise Math.random
  const random = seed !== undefined
    ? createSeededRandom(seed)
    : Math.random.bind(Math);

  const selected = {
    physical: [],
    abilities: [],
    aesthetic: []
  };

  // Stage 2: 1 from each category (subtle, developing)
  // Stage 3: 1-2 from each category (dramatic, fully realized)
  const selectCount = evolutionStage === 2 ? 1 : (random() > 0.4 ? 2 : 1);

  Object.keys(selected).forEach(category => {
    const available = [...pool[category]];
    const count = category === 'physical' ? selectCount : 1; // Always favor physical changes

    for (let i = 0; i < count && available.length > 0; i++) {
      const randomIndex = Math.floor(random() * available.length);
      selected[category].push(available[randomIndex]);
      available.splice(randomIndex, 1);
    }
  });

  return selected;
};

/**
 * Create a seeded random number generator for deterministic trait selection.
 * Uses a simple linear congruential generator.
 * @param {number} seed - The seed value
 * @returns {function(): number} A function that returns random numbers 0-1
 */
const createSeededRandom = (seed) => {
  let state = seed;
  return () => {
    state = (state * 1103515245 + 12345) & 0x7fffffff;
    return state / 0x7fffffff;
  };
};

/**
 * Get all available traits for a specific path and category.
 * Useful for UI display or debugging.
 *
 * @param {'gentle'|'bold'|'curious'} path - The evolution path
 * @param {'physical'|'abilities'|'aesthetic'} category - The trait category
 * @returns {string[]} Array of available traits
 */
export const getAvailableTraits = (path, category) => {
  const pool = evolutionTraitPools[path];
  if (!pool || !pool[category]) return [];
  return [...pool[category]];
};

export default selectEvolutionTraits;
