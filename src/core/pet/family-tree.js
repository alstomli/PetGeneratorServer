/**
 * Pure data family tree construction.
 * No framework dependencies - just data transformation.
 * @module core/pet/family-tree
 */

import { getRootId } from './model.js';

/**
 * Build family trees from a list of pet records.
 * Groups pets by their root ancestor.
 * @param {Object[]} petRecords - Array of saved pet metadata records
 * @returns {Object} Map of rootId -> { root: PetRecord, descendants: PetRecord[] }
 */
export const buildFamilyTrees = (petRecords) => {
  const families = {};

  petRecords.forEach(item => {
    const rootId = getRootId(item.id);

    if (!families[rootId]) {
      families[rootId] = {
        root: null,
        descendants: []
      };
    }

    // Check if this is the root ancestor
    if (item.id === rootId || !item.params?.parentId) {
      families[rootId].root = item;
    } else {
      families[rootId].descendants.push(item);
    }
  });

  return families;
};

/**
 * Get the family line (ancestor chain) for a pet.
 * @param {string} petId - The pet ID
 * @param {Object[]} petRecords - All pet records
 * @returns {string[]} Array of ancestor IDs from oldest to newest
 */
export const getFamilyLine = (petId, petRecords) => {
  const pet = petRecords.find(p => p.id === petId);
  if (!pet) return [petId];

  if (pet.familyLine && pet.familyLine.length > 0) {
    return pet.familyLine;
  }

  // Build family line by traversing parentId
  const line = [];
  let currentId = petId;
  const visited = new Set();

  while (currentId && !visited.has(currentId)) {
    visited.add(currentId);
    const current = petRecords.find(p => p.id === currentId);
    if (!current) break;

    line.unshift(currentId);
    currentId = current.params?.parentId;
  }

  return line.length > 0 ? line : [petId];
};

/**
 * Get all descendants of a pet.
 * @param {string} petId - The pet ID
 * @param {Object[]} petRecords - All pet records
 * @returns {Object[]} Array of descendant pet records
 */
export const getDescendants = (petId, petRecords) => {
  return petRecords.filter(record =>
    record.params?.parentId === petId ||
    (record.familyLine && record.familyLine.includes(petId))
  );
};

/**
 * Get direct children of a pet (one generation down).
 * @param {string} petId - The pet ID
 * @param {Object[]} petRecords - All pet records
 * @returns {Object[]} Array of direct child pet records
 */
export const getDirectChildren = (petId, petRecords) => {
  return petRecords.filter(record => record.params?.parentId === petId);
};

/**
 * Get siblings of a pet (same parent).
 * @param {string} petId - The pet ID
 * @param {Object[]} petRecords - All pet records
 * @returns {Object[]} Array of sibling pet records (excluding self)
 */
export const getSiblings = (petId, petRecords) => {
  const pet = petRecords.find(p => p.id === petId);
  if (!pet || !pet.params?.parentId) return [];

  return petRecords.filter(record =>
    record.params?.parentId === pet.params.parentId &&
    record.id !== petId
  );
};

/**
 * Calculate generation number for a pet (1 = root, 2 = first evolution, etc).
 * @param {string} petId - The pet ID
 * @param {Object[]} petRecords - All pet records
 * @returns {number} Generation number
 */
export const getGeneration = (petId, petRecords) => {
  const line = getFamilyLine(petId, petRecords);
  return line.length;
};

/**
 * Sort pets within a family for display.
 * Groups by stage, then by evolution path, then by timestamp.
 * @param {Object[]} pets - Array of pet records
 * @returns {Object[]} Sorted pet records
 */
export const sortFamilyPets = (pets) => {
  const pathOrder = { 'gentle': 1, 'bold': 2, 'curious': 3 };

  return [...pets].sort((a, b) => {
    // First sort by stage
    const stageDiff = (a.pet?.stage || 1) - (b.pet?.stage || 1);
    if (stageDiff !== 0) return stageDiff;

    // Then by evolution path
    const pathA = a.params?.evolutionPath || '';
    const pathB = b.params?.evolutionPath || '';
    const pathDiff = (pathOrder[pathA] || 99) - (pathOrder[pathB] || 99);
    if (pathDiff !== 0) return pathDiff;

    // Finally by timestamp
    return new Date(a.timestamp) - new Date(b.timestamp);
  });
};

/**
 * Get a flat list of the evolution chain for a pet.
 * Returns ancestors from root to the specified pet.
 * @param {string} petId - The pet ID
 * @param {Object[]} petRecords - All pet records
 * @returns {Object[]} Array of pet records from root to specified pet
 */
export const getEvolutionChain = (petId, petRecords) => {
  const line = getFamilyLine(petId, petRecords);
  return line.map(id => petRecords.find(p => p.id === id)).filter(Boolean);
};

export default {
  buildFamilyTrees,
  getFamilyLine,
  getDescendants,
  getDirectChildren,
  getSiblings,
  getGeneration,
  sortFamilyPets,
  getEvolutionChain
};
