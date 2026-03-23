/**
 * Evolution module - rules and calculations.
 * @module core/evolution
 */

export {
  getPathDescription,
  getMagnitudeGuidance,
  getSizeEmphasis,
  getProportionEmphasis,
  getChangeEmphasis,
  getStageName,
  canEvolve
} from './rules.js';

export {
  calculateNextStage,
  getEvolutionProgress,
  getRemainingEvolutions,
  isFullyEvolved,
  getStageProportions,
  getSizeMultiplier
} from './calculator.js';
