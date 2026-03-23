/**
 * Pet Evolution API Server
 *
 * A kid-friendly pet evolution game backend that uses Google Gemini AI
 * to generate and evolve fantasy pet creatures.
 *
 * API Endpoints:
 *   GET  /api/health              - Health check
 *   POST /api/google/generate-pet - Generate a new baby pet
 *   POST /api/google/evolve-pet   - Evolve a pet to the next stage
 *   POST /api/google/merge-pets   - Merge two pets together
 *   POST /api/pets/save           - Save pet to disk
 *   GET  /api/pets                - Get all saved pets
 *   GET  /api/pets/:id            - Get a single pet
 *   GET  /api/pets/:id/image.png  - Get pet image
 *   DELETE /api/pets/:id          - Delete a pet
 *
 * @requires express
 * @requires @google/genai
 * @requires multer
 */

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { startServer } from './src/api/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const PORT = process.env.PORT || 3001;

// Start the server
startServer({
  baseDir: __dirname,
  publicDir: path.join(__dirname, 'public'),
  port: PORT
}).catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
