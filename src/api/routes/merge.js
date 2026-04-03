/**
 * Pet merging route.
 * @module api/routes/merge
 */

import { Router } from 'express';
import { asyncHandler } from '../middleware/error-handler.js';

/**
 * Create merge routes.
 * @param {Object} petService - Pet service instance
 * @param {Object} storageService - Storage service instance
 * @returns {Router} Express router
 */
export const createMergeRoutes = (petService, storageService) => {
  const router = Router();

  /**
   * POST /api/google/merge-pets/full
   * Merge two pets using full pet objects (no storage lookup required).
   */
  router.post('/full', asyncHandler(async (req, res) => {
    const { pet1, pet2 } = req.body;

    if (!pet1 || !pet2) {
      return res.status(400).json({ error: 'Both pet1 and pet2 objects are required' });
    }

    const result = await petService.mergePets({ pet1, pet2 });

    res.json(result);
  }));

  /**
   * POST /api/google/merge-pets
   * Merge two pets together.
   */
  router.post('/', asyncHandler(async (req, res) => {
    const { pet1Id, pet2Id } = req.body;

    if (!pet1Id || !pet2Id) {
      return res.status(400).json({
        error: 'Both pet1Id and pet2Id are required'
      });
    }

    // Load pets from storage
    const pet1Data = storageService.getPet(pet1Id);
    const pet2Data = storageService.getPet(pet2Id);

    if (!pet1Data) {
      return res.status(404).json({
        error: `Pet ${pet1Id} not found`
      });
    }

    if (!pet2Data) {
      return res.status(404).json({
        error: `Pet ${pet2Id} not found`
      });
    }

    // Merge the pets
    const result = await petService.mergePets({
      pet1: pet1Data.pet,
      pet2: pet2Data.pet
    });

    res.json(result);
  }));

  /**
   * GET /api/google/merge-pets/preview
   * Preview merge outcome without generating image.
   */
  router.get('/preview', asyncHandler(async (req, res) => {
    const { pet1Id, pet2Id } = req.query;

    if (!pet1Id || !pet2Id) {
      return res.status(400).json({
        error: 'Both pet1Id and pet2Id are required'
      });
    }

    // Load pets from storage
    const pet1Data = storageService.getPet(pet1Id);
    const pet2Data = storageService.getPet(pet2Id);

    if (!pet1Data || !pet2Data) {
      return res.status(404).json({
        error: 'One or both pets not found'
      });
    }

    // Import merge functions for preview
    const { selectMergeOutcome, getMergeOutcomeSummary } = await import('../../core/merge/outcome-selector.js');

    const outcome = selectMergeOutcome(pet1Data.pet, pet2Data.pet);
    const summary = getMergeOutcomeSummary(outcome);

    res.json({
      canMerge: outcome.canMerge,
      reason: outcome.reason,
      summary,
      isRare: outcome.isRare,
      rareType: outcome.rareType,
      mergedAttributes: outcome.mergedAttributes,
      inheritedTraits: outcome.inheritedTraits
    });
  }));

  return router;
};

export default createMergeRoutes;
