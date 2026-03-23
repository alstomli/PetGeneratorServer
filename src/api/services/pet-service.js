/**
 * Pet service - orchestrates core, prompting, and generation layers.
 * @module api/services/pet-service
 */

import { validatePetParams, validateEvolutionParams, validateMergeParams } from '../../core/validation.js';
import { createPet, createEvolvedPet, createMergedPet } from '../../core/pet/model.js';
import { selectMergeOutcome } from '../../core/merge/outcome-selector.js';
import { rollGenerationAugment, rollEvolutionAugment, getMergeAugments } from '../../core/augments/index.js';
import { generateBabyPetPrompt } from '../../prompting/templates/generate.js';
import { generateEvolutionPrompt } from '../../prompting/templates/evolve.js';
import { generateMergePrompt } from '../../prompting/templates/merge.js';
import { toDataUrl } from '../../generation/image-extractor.js';

/**
 * Pet service for generating, evolving, and merging pets.
 */
export class PetService {
  /**
   * Create a new pet service.
   * @param {Object} adapter - AI generation adapter
   * @param {Object} storageService - Storage service
   */
  constructor(adapter, storageService) {
    this.adapter = adapter;
    this.storage = storageService;
  }

  /**
   * Generate a new baby pet.
   * @param {Object} params - Generation parameters
   * @param {string} params.style - Pet style
   * @param {string} params.colorPalette - Color palette
   * @param {string[]} params.animals - Animal inspirations
   * @param {number} params.maxStages - Max evolution stages
   * @returns {Promise<Object>} Generated pet
   */
  async generatePet({ style, colorPalette, animals = [], maxStages = 3, guaranteeAugment = false }) {
    // Validate parameters
    const validation = validatePetParams({ style, colorPalette, animals, maxStages });
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    // Roll for augment on generation (or guarantee one if bonus potion is used)
    const augment = guaranteeAugment
      ? rollGenerationAugment({ style, animals, guaranteed: true })
      : rollGenerationAugment({ style, animals });
    const augments = augment ? [augment] : [];

    // Generate prompt (include augments if any)
    const { prompt, metadata } = generateBabyPetPrompt({ style, colorPalette, animals, augments });

    // Generate image
    const result = await this.adapter.generateFromPrompt(prompt);

    // Create pet object
    const pet = createPet({
      stage: 1,
      maxStages,
      style,
      colorPalette,
      animals,
      metadata,
      imageUrl: toDataUrl(result.imageData, result.mimeType),
      prompt,
      provider: this.adapter.getProviderName(),
      augments
    });

    return pet;
  }

  /**
   * Evolve a pet to the next stage.
   * @param {Object} params - Evolution parameters
   * @param {string} params.petId - Pet ID
   * @param {number} params.currentStage - Current stage
   * @param {number} params.maxStages - Max stages
   * @param {string} params.description - Pet description
   * @param {string} params.evolutionPath - Evolution path
   * @param {string} params.previousMetadata - Previous metadata
   * @param {string} params.colorPalette - Color palette
   * @param {Object[]} [params.augments] - Existing augments from parent pet
   * @param {Buffer} [params.imageData] - Image data
   * @param {string} [params.imageMimeType] - Image MIME type
   * @returns {Promise<Object>} Evolved pet
   */
  async evolvePet({
    petId,
    currentStage,
    maxStages,
    description,
    evolutionPath,
    previousMetadata,
    colorPalette,
    augments: existingAugments = [],
    imageData,
    imageMimeType,
    guaranteeAugment = false
  }) {
    // Validate parameters
    const validation = validateEvolutionParams({
      currentStage: parseInt(currentStage),
      maxStages: parseInt(maxStages),
      evolutionPath
    });
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    const nextStage = parseInt(currentStage) + 1;

    // Roll for new augment during evolution (or guarantee one if bonus potion is used)
    const pet = { augments: existingAugments };
    const newAugment = guaranteeAugment
      ? rollEvolutionAugment({ pet, evolutionPath: evolutionPath || 'gentle', guaranteed: true })
      : rollEvolutionAugment({ pet, evolutionPath: evolutionPath || 'gentle' });

    // Combine existing augments with new one if acquired
    const finalAugments = newAugment
      ? [...existingAugments, newAugment]
      : existingAugments;

    // Generate prompt (include augments)
    const { prompt, metadata } = generateEvolutionPrompt({
      currentStage: parseInt(currentStage),
      evolutionStage: nextStage,
      evolutionPath: evolutionPath || 'gentle',
      previousMetadata: previousMetadata || description,
      colorPalette: colorPalette || '',
      existingAugments,
      newAugment
    });

    // Generate image
    let result;
    if (imageData) {
      result = await this.adapter.generateFromImage(prompt, imageData, imageMimeType || 'image/png');
    } else {
      result = await this.adapter.generateFromPrompt(prompt);
    }

    // Create evolved pet object
    const evolvedPet = {
      id: `${petId}-${nextStage}-${Date.now()}`,
      stage: nextStage,
      maxStages: parseInt(maxStages),
      evolutionPath: evolutionPath || 'gentle',
      provider: this.adapter.getProviderName(),
      imageUrl: toDataUrl(result.imageData, result.mimeType),
      prompt,
      metadata,
      augments: finalAugments
    };

    return evolvedPet;
  }

  /**
   * Merge two pets together.
   * @param {Object} params - Merge parameters
   * @param {Object} params.pet1 - First parent pet
   * @param {Object} params.pet2 - Second parent pet
   * @returns {Promise<{pet: Object, isRare: boolean, rareType?: string, sourceHandling: Object}>} Merge result
   */
  async mergePets({ pet1, pet2 }) {
    // Validate parameters
    const validation = validateMergeParams({ pet1, pet2 });
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    // Select merge outcome
    const outcome = selectMergeOutcome(pet1, pet2);

    if (!outcome.canMerge) {
      throw new Error(outcome.reason);
    }

    // Get augments for merged pet (inheritance + potential new)
    const mergedAugments = getMergeAugments({ pet1, pet2 });

    // Generate prompt (include inherited augments)
    const { prompt, metadata } = generateMergePrompt({ pet1, pet2, outcome, augments: mergedAugments });

    // Generate image
    const result = await this.adapter.generateFromPrompt(prompt);

    // Create merged pet object
    const mergedPet = createMergedPet(pet1, pet2, {
      imageUrl: toDataUrl(result.imageData, result.mimeType),
      prompt,
      metadata,
      style: outcome.mergedAttributes.style,
      colorPalette: outcome.mergedAttributes.colorPalette,
      animals: outcome.mergedAttributes.animals,
      isRare: outcome.isRare,
      rareType: outcome.rareType,
      augments: mergedAugments
    });

    return {
      pet: mergedPet,
      isRare: outcome.isRare,
      rareType: outcome.rareType,
      sourceHandling: {
        pet1: 'preserved',
        pet2: 'preserved'
      }
    };
  }
}

/**
 * Create a pet service instance.
 * @param {Object} adapter - AI adapter
 * @param {Object} storageService - Storage service
 * @returns {PetService} Pet service
 */
export const createPetService = (adapter, storageService) => {
  return new PetService(adapter, storageService);
};

export default PetService;
