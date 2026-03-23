/**
 * Health check route.
 * @module api/routes/health
 */

import { Router } from 'express';

const router = Router();

/**
 * GET /api/health
 * Health check endpoint.
 */
router.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Pet Evolution API is running'
  });
});

export default router;
