/**
 * Pet generation route.
 * @module api/routes/generate
 */

import { Router } from 'express';
import { asyncHandler } from '../middleware/error-handler.js';

/**
 * Create generate routes.
 * @param {Object} petService - Pet service instance
 * @returns {Router} Express router
 */
export const createGenerateRoutes = (petService) => {
  const router = Router();

  /**
   * POST /api/google/generate-pet
   * Generate a new baby pet.
   */
  router.post('/', asyncHandler(async (req, res) => {
    const { style = 'gentle', colorPalette = 'rainbow bright', animals = [], maxStages = 3, guaranteeAugment = false } = req.body;

    const pet = await petService.generatePet({
      style,
      colorPalette,
      animals,
      maxStages,
      guaranteeAugment
    });

    res.json(pet);
  }));

  return router;
};

export default createGenerateRoutes;
