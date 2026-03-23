/**
 * Base adapter interface for AI image generation.
 * @module generation/adapters/base-adapter
 */

/**
 * Abstract base class for AI generation adapters.
 * Concrete implementations should extend this class.
 */
export class BaseAdapter {
  /**
   * Create a new adapter instance.
   * @param {Object} config - Adapter configuration
   * @param {string} config.apiKey - API key for the service
   * @param {string} [config.model] - Model to use
   */
  constructor(config) {
    if (new.target === BaseAdapter) {
      throw new Error('BaseAdapter is abstract and cannot be instantiated directly');
    }
    this.config = config;
  }

  /**
   * Generate an image from a text prompt.
   * @param {string} prompt - The generation prompt
   * @returns {Promise<{imageData: string, mimeType: string}>} Generated image data
   * @abstract
   */
  async generateFromPrompt(prompt) {
    throw new Error('generateFromPrompt must be implemented by subclass');
  }

  /**
   * Generate an image from a text prompt and reference image.
   * @param {string} prompt - The generation prompt
   * @param {Buffer|string} imageData - Reference image data (Buffer or base64)
   * @param {string} mimeType - MIME type of the reference image
   * @returns {Promise<{imageData: string, mimeType: string}>} Generated image data
   * @abstract
   */
  async generateFromImage(prompt, imageData, mimeType) {
    throw new Error('generateFromImage must be implemented by subclass');
  }

  /**
   * Check if the adapter is properly configured.
   * @returns {boolean} True if configured
   */
  isConfigured() {
    return !!this.config?.apiKey;
  }

  /**
   * Get the provider name.
   * @returns {string} Provider name
   * @abstract
   */
  getProviderName() {
    throw new Error('getProviderName must be implemented by subclass');
  }
}

export default BaseAdapter;
