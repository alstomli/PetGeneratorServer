/**
 * Multer configuration for file uploads.
 * @module api/middleware/upload
 */

import multer from 'multer';
import fs from 'fs';

/**
 * Create multer upload middleware with standard configuration.
 * @param {Object} [options] - Configuration options
 * @param {string} [options.dest='uploads/'] - Upload destination
 * @param {number} [options.fileSize=10*1024*1024] - Max file size in bytes
 * @param {number} [options.fieldSize=5*1024*1024] - Max field size in bytes
 * @param {number} [options.fields=50] - Max number of fields
 * @returns {multer.Multer} Configured multer instance
 */
export const createUpload = (options = {}) => {
  const dest = options.dest || 'uploads/';
  const fileSize = options.fileSize || 10 * 1024 * 1024; // 10MB
  const fieldSize = options.fieldSize || 5 * 1024 * 1024; // 5MB
  const fields = options.fields || 50;

  return multer({
    dest,
    limits: {
      fileSize,
      fieldSize,
      fields
    },
    fileFilter: (req, file, cb) => {
      // Check if the file is an image
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed!'), false);
      }
    }
  });
};

/**
 * Clean up an uploaded file from the filesystem.
 * @param {Object} file - The multer file object
 */
export const cleanupUploadedFile = (file) => {
  if (file && fs.existsSync(file.path)) {
    fs.unlinkSync(file.path);
  }
};

/**
 * Read file contents as base64.
 * @param {Object} file - The multer file object
 * @returns {string} Base64 encoded file contents
 */
export const readFileAsBase64 = (file) => {
  if (!file || !fs.existsSync(file.path)) {
    throw new Error('File not found');
  }
  return fs.readFileSync(file.path, { encoding: 'base64' });
};

// Default upload instance
export const upload = createUpload();

export default upload;
