/**
 * Image extraction utilities for AI responses.
 * @module generation/image-extractor
 */

/**
 * Extract base64 image data from a Gemini API response.
 * @param {Object} response - The response from Gemini API
 * @returns {string|null} The base64 image data or null if not found
 */
export const extractImageData = (response) => {
  const parts = response?.candidates?.[0]?.content?.parts;
  if (parts) {
    for (const part of parts) {
      if (part.inlineData?.data) {
        return part.inlineData.data;
      }
    }
  }
  return null;
};

/**
 * Extract text content from a Gemini API response.
 * @param {Object} response - The response from Gemini API
 * @returns {string|null} The text content or null if not found
 */
export const extractTextContent = (response) => {
  const parts = response?.candidates?.[0]?.content?.parts;
  if (parts) {
    for (const part of parts) {
      if (part.text) {
        return part.text;
      }
    }
  }
  return null;
};

/**
 * Convert base64 image data to a data URL.
 * @param {string} base64Data - The base64 image data
 * @param {string} [mimeType='image/png'] - The MIME type
 * @returns {string} The data URL
 */
export const toDataUrl = (base64Data, mimeType = 'image/png') => {
  return `data:${mimeType};base64,${base64Data}`;
};

/**
 * Extract base64 data from a data URL.
 * @param {string} dataUrl - The data URL
 * @returns {string} The base64 data
 */
export const fromDataUrl = (dataUrl) => {
  return dataUrl.replace(/^data:image\/[a-z]+;base64,/, '');
};

/**
 * Check if a string is a valid data URL.
 * @param {string} str - The string to check
 * @returns {boolean} True if valid data URL
 */
export const isDataUrl = (str) => {
  return typeof str === 'string' && str.startsWith('data:image/');
};

/**
 * Get the MIME type from a data URL.
 * @param {string} dataUrl - The data URL
 * @returns {string|null} The MIME type or null
 */
export const getMimeType = (dataUrl) => {
  const match = dataUrl.match(/^data:(image\/[a-z]+);base64,/);
  return match ? match[1] : null;
};

export default {
  extractImageData,
  extractTextContent,
  toDataUrl,
  fromDataUrl,
  isDataUrl,
  getMimeType
};
