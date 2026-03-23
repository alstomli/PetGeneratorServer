/**
 * Merge module - pet merging rules and outcomes.
 * @module core/merge
 */

export {
  checkMergeCompatibility,
  calculateMergedAttributes,
  getInheritedTraits,
  isEligibleForRare
} from './rules.js';

export {
  determineRareOutcome,
  selectRareType,
  getRareVisualModifiers,
  getRareTypeName
} from './rare-outcomes.js';

export {
  selectMergeOutcome,
  buildMergedCreatureDesign,
  getMergeOutcomeSummary
} from './outcome-selector.js';
