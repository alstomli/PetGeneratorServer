/**
 * Generation module - AI generation abstraction.
 * @module generation
 */

// Adapters
export { BaseAdapter } from './adapters/base-adapter.js';
export { GeminiAdapter, createGeminiAdapter } from './adapters/gemini-adapter.js';

// Image extraction
export {
  extractImageData,
  extractTextContent,
  toDataUrl,
  fromDataUrl,
  isDataUrl,
  getMimeType
} from './image-extractor.js';
