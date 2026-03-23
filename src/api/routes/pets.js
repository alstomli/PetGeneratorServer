/**
 * Pet CRUD routes.
 * @module api/routes/pets
 */

import { Router } from 'express';
import { asyncHandler } from '../middleware/error-handler.js';

/**
 * Create pets routes.
 * @param {Object} storageService - Storage service instance
 * @returns {Router} Express router
 */
export const createPetsRoutes = (storageService) => {
  const router = Router();

  /**
   * POST /api/pets/save
   * Save a pet to disk.
   */
  router.post('/save', asyncHandler(async (req, res) => {
    const { pet, params } = req.body;

    if (!pet || !pet.id) {
      return res.status(400).json({
        error: 'Pet data with ID is required'
      });
    }

    const result = storageService.savePet(pet, params);
    res.json(result);
  }));

  /**
   * GET /api/pets
   * Get all saved pets.
   */
  router.get('/', asyncHandler(async (req, res) => {
    const pets = storageService.getAllPets();
    res.json(pets);
  }));

  /**
   * GET /api/pets/:id
   * Get a single pet by ID.
   */
  router.get('/:id', asyncHandler(async (req, res) => {
    const { id } = req.params;
    const pet = storageService.getPet(id);

    if (!pet) {
      return res.status(404).json({
        error: 'Pet not found'
      });
    }

    res.json(pet);
  }));

  /**
   * GET /api/pets/:id/image.png
   * Get pet image.
   */
  router.get('/:id/image.png', asyncHandler(async (req, res) => {
    const { id } = req.params;
    const imagePath = storageService.getImagePath(id);

    if (!imagePath) {
      return res.status(404).json({
        error: 'Image not found'
      });
    }

    res.sendFile(imagePath);
  }));

  /**
   * DELETE /api/pets/:id
   * Delete a pet.
   */
  router.delete('/:id', asyncHandler(async (req, res) => {
    const { id } = req.params;
    const deleted = storageService.deletePet(id);

    res.json({ success: deleted });
  }));

  return router;
};

export default createPetsRoutes;
