/**
 * Gemini adapter for AI image generation.
 * @module generation/adapters/gemini-adapter
 */

import { GoogleGenAI } from '@google/genai';
import { BaseAdapter } from './base-adapter.js';
import { extractImageData } from '../image-extractor.js';
import { CONFIG } from '../../core/config.js';

/**
 * Adapter for Google Gemini image generation.
 */
export class GeminiAdapter extends BaseAdapter {
  /**
   * Create a new Gemini adapter.
   * @param {Object} config - Configuration
   * @param {string} config.apiKey - Gemini API key
   * @param {string} [config.model] - Model to use (defaults to CONFIG.MODEL)
   */
  constructor(config) {
    super(config);
    this.genAI = new GoogleGenAI({ apiKey: config.apiKey });
    this.model = config.model || CONFIG.MODEL;
  }

  /**
   * Generate an image from a text prompt.
   * @param {string} prompt - The generation prompt
   * @returns {Promise<{imageData: string, mimeType: string}>} Generated image data
   */
  async generateFromPrompt(prompt) {
    const response = await this.genAI.models.generateContent({
      model: this.model,
      contents: [prompt]
    });

    const imageData = extractImageData(response);
    if (!imageData) {
      throw new Error('No image data returned from Gemini');
    }

    return {
      imageData,
      mimeType: 'image/png'
    };
  }

  /**
   * Generate an image from a text prompt and reference image.
   * @param {string} prompt - The generation prompt
   * @param {Buffer|string} imageData - Reference image data (Buffer or base64 string)
   * @param {string} mimeType - MIME type of the reference image
   * @returns {Promise<{imageData: string, mimeType: string}>} Generated image data
   */
  async generateFromImage(prompt, imageData, mimeType) {
    // Convert Buffer to base64 if needed
    const base64Data = Buffer.isBuffer(imageData)
      ? imageData.toString('base64')
      : imageData;

    const contents = [{
      role: 'user',
      parts: [
        { inlineData: { mimeType, data: base64Data } },
        { text: prompt }
      ]
    }];

    const response = await this.genAI.models.generateContent({
      model: this.model,
      contents,
      config: {
        response_modalities: ['TEXT', 'IMAGE'],
        image_config: { resolution: '2K' }
      }
    });

    const resultImageData = extractImageData(response);
    if (!resultImageData) {
      throw new Error('No image data returned from Gemini');
    }

    return {
      imageData: resultImageData,
      mimeType: 'image/png'
    };
  }

  /**
   * Get the provider name.
   * @returns {string} Provider name
   */
  getProviderName() {
    return 'google';
  }

  /**
   * Get the current model name.
   * @returns {string} Model name
   */
  getModel() {
    return this.model;
  }
}

/**
 * Create a configured Gemini adapter from environment.
 * @returns {GeminiAdapter} Configured adapter
 */
export const createGeminiAdapter = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is required');
  }
  return new GeminiAdapter({ apiKey });
};

export default GeminiAdapter;
