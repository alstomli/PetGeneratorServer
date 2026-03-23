/**
 * Express app factory.
 * @module api
 */

import express from 'express';
import cors from 'cors';
import path from 'path';

import { upload } from './middleware/upload.js';
import { errorHandler, notFoundHandler } from './middleware/error-handler.js';
import { createStorageService } from './services/storage-service.js';
import { createPetService } from './services/pet-service.js';
import { createGeminiAdapter } from '../generation/adapters/gemini-adapter.js';

import healthRoutes from './routes/health.js';
import { createGenerateRoutes } from './routes/generate.js';
import { createEvolveRoutes } from './routes/evolve.js';
import { createMergeRoutes } from './routes/merge.js';
import { createPetsRoutes } from './routes/pets.js';

/**
 * Create the Express application.
 * @param {Object} options - Configuration options
 * @param {string} options.baseDir - Base directory for storage
 * @param {string} options.publicDir - Public directory for static files
 * @returns {express.Application} Configured Express app
 */
export const createApp = ({ baseDir, publicDir }) => {
  const app = express();

  // Create services
  const adapter = createGeminiAdapter();
  const storageService = createStorageService(baseDir);
  const petService = createPetService(adapter, storageService);

  // Middleware
  app.use(cors());
  app.use(express.json({ limit: '50mb' }));

  // Static files
  app.use(express.static(publicDir, {
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('.js') || filePath.endsWith('.css')) {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
      }
    }
  }));

  // API routes
  app.use('/api/health', healthRoutes);
  app.use('/api/google/generate-pet', createGenerateRoutes(petService));
  app.use('/api/google/evolve-pet', createEvolveRoutes(petService, upload));
  app.use('/api/google/merge-pets', createMergeRoutes(petService, storageService));
  app.use('/api/pets', createPetsRoutes(storageService));

  // Serve index.html for root
  app.get('/', (req, res) => {
    res.sendFile(path.join(publicDir, 'index.html'));
  });

  // Error handling
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};

/**
 * Create and start the server.
 * @param {Object} options - Server options
 * @param {string} options.baseDir - Base directory
 * @param {string} options.publicDir - Public directory
 * @param {number} [options.port=3001] - Port to listen on
 * @returns {Promise<Object>} Server instance
 */
export const startServer = async ({ baseDir, publicDir, port = 3001 }) => {
  const app = createApp({ baseDir, publicDir });

  return new Promise((resolve) => {
    const server = app.listen(port, '0.0.0.0', () => {
      console.log(`Pet Evolution API running on port ${port}`);
      console.log(`Health check: http://localhost:${port}/api/health`);
      console.log(`Network access: http://[your-ip]:${port}/api/health`);
      resolve(server);
    });
  });
};

export default createApp;
