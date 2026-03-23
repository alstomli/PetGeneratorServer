/**
 * File system persistence service.
 * @module api/services/storage-service
 */

import fs from 'fs';
import path from 'path';

/**
 * Storage service for pet persistence.
 */
export class StorageService {
  /**
   * Create a new storage service.
   * @param {string} petsDir - Directory for pet storage
   */
  constructor(petsDir) {
    this.petsDir = petsDir;
    this.ensureDirectory();
  }

  /**
   * Ensure the pets directory exists.
   */
  ensureDirectory() {
    if (!fs.existsSync(this.petsDir)) {
      fs.mkdirSync(this.petsDir, { recursive: true });
    }
  }

  /**
   * Save a pet to disk.
   * @param {Object} pet - The pet object
   * @param {Object} params - Generation parameters
   * @returns {{success: boolean, id: string}} Save result
   */
  savePet(pet, params = {}) {
    // Create metadata object
    const metadata = {
      id: pet.id,
      timestamp: new Date().toISOString(),
      pet: {
        ...pet,
        // Store image as separate file, keep reference
        imageUrl: `/api/pets/${pet.id}/image.png`
      },
      params: params || {},
      generation: params?.parentId ? 1 : 1,
      familyLine: params?.parentId ? [] : [pet.id]
    };

    // Save image file if it contains base64 data
    if (pet.imageUrl && pet.imageUrl.startsWith('data:image/')) {
      const base64Data = pet.imageUrl.replace(/^data:image\/[a-z]+;base64,/, '');
      const imageBuffer = Buffer.from(base64Data, 'base64');
      const imagePath = path.join(this.petsDir, `${pet.id}.png`);
      fs.writeFileSync(imagePath, imageBuffer);
    }

    // Save metadata
    const metadataPath = path.join(this.petsDir, `${pet.id}.json`);
    fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));

    return { success: true, id: pet.id };
  }

  /**
   * Get all saved pets.
   * @returns {Object[]} Array of pet metadata objects
   */
  getAllPets() {
    if (!fs.existsSync(this.petsDir)) {
      return [];
    }

    const pets = [];
    const files = fs.readdirSync(this.petsDir);
    const jsonFiles = files.filter(file => file.endsWith('.json'));

    for (const file of jsonFiles) {
      try {
        const filePath = path.join(this.petsDir, file);
        const content = fs.readFileSync(filePath, 'utf8');
        const metadata = JSON.parse(content);
        pets.push(metadata);
      } catch (error) {
        console.error(`Error reading pet file ${file}:`, error);
      }
    }

    // Sort by timestamp (newest first)
    pets.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return pets;
  }

  /**
   * Get a single pet by ID.
   * @param {string} id - Pet ID
   * @returns {Object|null} Pet metadata or null
   */
  getPet(id) {
    const metadataPath = path.join(this.petsDir, `${id}.json`);
    if (!fs.existsSync(metadataPath)) {
      return null;
    }

    try {
      const content = fs.readFileSync(metadataPath, 'utf8');
      return JSON.parse(content);
    } catch (error) {
      console.error(`Error reading pet ${id}:`, error);
      return null;
    }
  }

  /**
   * Get the image path for a pet.
   * @param {string} id - Pet ID
   * @returns {string|null} Image file path or null
   */
  getImagePath(id) {
    const imagePath = path.join(this.petsDir, `${id}.png`);
    if (fs.existsSync(imagePath)) {
      return imagePath;
    }
    return null;
  }

  /**
   * Delete a pet.
   * @param {string} id - Pet ID
   * @returns {boolean} True if deleted
   */
  deletePet(id) {
    const imagePath = path.join(this.petsDir, `${id}.png`);
    const metadataPath = path.join(this.petsDir, `${id}.json`);

    let deleted = false;

    // Delete image file if exists
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
      deleted = true;
    }

    // Delete metadata file if exists
    if (fs.existsSync(metadataPath)) {
      fs.unlinkSync(metadataPath);
      deleted = true;
    }

    return deleted;
  }

  /**
   * Check if a pet exists.
   * @param {string} id - Pet ID
   * @returns {boolean} True if exists
   */
  petExists(id) {
    const metadataPath = path.join(this.petsDir, `${id}.json`);
    return fs.existsSync(metadataPath);
  }
}

/**
 * Create a storage service instance.
 * @param {string} baseDir - Base directory
 * @returns {StorageService} Storage service
 */
export const createStorageService = (baseDir) => {
  const petsDir = path.join(baseDir, 'pets');
  return new StorageService(petsDir);
};

export default StorageService;
