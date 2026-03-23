/**
 * Pet evolution route.
 * @module api/routes/evolve
 */

import { Router } from 'express';
import { asyncHandler } from '../middleware/error-handler.js';
import { cleanupUploadedFile, readFileAsBase64 } from '../middleware/upload.js';

/**
 * Create evolve routes.
 * @param {Object} petService - Pet service instance
 * @param {Object} upload - Multer upload middleware
 * @returns {Router} Express router
 */
export const createEvolveRoutes = (petService, upload) => {
  const router = Router();

  /**
   * POST /api/google/evolve-pet
   * Evolve a pet to the next stage.
   */
  router.post('/', upload.single('image'), asyncHandler(async (req, res) => {
    try {
      const {
        petId,
        currentStage,
        maxStages,
        description,
        basePrompt,
        evolutionPath,
        previousMetadata,
        colorPalette,
        augments: augmentsJson,
        guaranteeAugment
      } = req.body;

      // Parse augments if provided (can be JSON string from FormData)
      let augments = [];
      if (augmentsJson) {
        try {
          augments = typeof augmentsJson === 'string' ? JSON.parse(augmentsJson) : augmentsJson;
        } catch (e) {
          console.warn('Failed to parse augments:', e.message);
        }
      }

      // Prepare image data if file was uploaded
      let imageData = null;
      let imageMimeType = null;

      if (req.file) {
        imageData = Buffer.from(readFileAsBase64(req.file), 'base64');
        imageMimeType = req.file.mimetype;
      }

      const evolvedPet = await petService.evolvePet({
        petId,
        currentStage: parseInt(currentStage),
        maxStages: parseInt(maxStages),
        description,
        evolutionPath: evolutionPath || 'gentle',
        previousMetadata: previousMetadata || description || basePrompt,
        colorPalette: colorPalette || '',
        augments,
        imageData,
        imageMimeType,
        guaranteeAugment: guaranteeAugment === 'true' || guaranteeAugment === true
      });

      // Cleanup uploaded file
      cleanupUploadedFile(req.file);

      res.json(evolvedPet);
    } catch (error) {
      // Cleanup on error
      cleanupUploadedFile(req.file);
      throw error;
    }
  }));

  return router;
};

export default createEvolveRoutes;
