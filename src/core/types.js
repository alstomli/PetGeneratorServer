/**
 * JSDoc type definitions for the pet evolution system.
 * This file contains no runtime code - only type annotations.
 * @module core/types
 */

/**
 * Valid pet styles (unified with evolution paths)
 * @typedef {'gentle'|'bold'|'curious'} PetStyle
 */

/**
 * Valid color palettes
 * @typedef {'sunset orange'|'golden sun'|'cherry blossom pink'|'autumn leaves'|'coral reef'|'cinnamon spice'|'ocean blue'|'forest green'|'arctic ice'|'lavender dreams'|'mint fresh'|'slate storm'|'rainbow bright'|'neon electric'|'tropical paradise'|'berry blast'|'purple magic'|'starry night'|'midnight galaxy'|'mystic moonlight'|'pink princess'|'cotton candy'|'pastel sunrise'|'cream vanilla'|'mossy woodland'|'desert sand'|'volcanic ember'} ColorPalette
 */

/**
 * Valid evolution paths (same as styles - unified system)
 * @typedef {'gentle'|'bold'|'curious'} EvolutionPath
 */

/**
 * Rare outcome types for merged pets
 * @typedef {'legendary'|'chromatic'|'elemental'|'celestial'} RareType
 */

/**
 * Augment categories
 * @typedef {'elemental'|'celestial'|'nature'|'spirit'|'arcane'} AugmentCategory
 */

/**
 * An augment that can be applied to a pet
 * @typedef {Object} Augment
 * @property {string} id - Unique identifier
 * @property {string} name - Display name
 * @property {string} story - How the pet gained this augment
 * @property {string[]} visualEffects - Visual effects the augment adds
 * @property {AugmentCategory} category - Augment category
 * @property {number} weight - Rarity weight contribution (1-3)
 */

/**
 * Rarity tier identifiers
 * @typedef {'common'|'uncommon'|'rare'|'legendary'|'mythical'} RarityId
 */

/**
 * Rarity tier definition
 * @typedef {Object} RarityTier
 * @property {RarityId} id - Rarity identifier
 * @property {string} name - Display name
 * @property {number} minWeight - Minimum total augment weight
 * @property {number} maxWeight - Maximum total augment weight
 * @property {string} color - Badge color (hex or 'rainbow')
 * @property {string} badgeClass - CSS class for badge styling
 */

/**
 * A pet object
 * @typedef {Object} Pet
 * @property {string} id - Unique identifier
 * @property {number} stage - Current evolution stage (1-3)
 * @property {number} maxStages - Maximum evolution stages
 * @property {PetStyle} style - Pet style
 * @property {ColorPalette} colorPalette - Color palette
 * @property {string[]} animals - Animal inspirations
 * @property {string} metadata - Creature design description
 * @property {string} imageUrl - Base64 data URL or file path
 * @property {string} prompt - Generation prompt used
 * @property {string} description - Human-readable description
 * @property {string} provider - AI provider used
 * @property {Augment[]} [augments] - Augments the pet has (default: [])
 * @property {EvolutionPath} [evolutionPath] - Evolution path (for evolved pets)
 * @property {string[]} [parentIds] - Parent pet IDs (for merged pets)
 * @property {boolean} [isRare] - Whether this is a rare merge outcome
 * @property {RareType} [rareType] - Type of rare outcome
 */

/**
 * Parameters for generating a new pet
 * @typedef {Object} GeneratePetParams
 * @property {PetStyle} style - Pet style
 * @property {ColorPalette} colorPalette - Color palette
 * @property {string[]} animals - Animal inspirations (0-2)
 * @property {number} maxStages - Maximum evolution stages
 */

/**
 * Parameters for evolving a pet
 * @typedef {Object} EvolvePetParams
 * @property {string} petId - ID of pet to evolve
 * @property {number} currentStage - Current evolution stage
 * @property {number} maxStages - Maximum evolution stages
 * @property {string} description - Pet description
 * @property {EvolutionPath} evolutionPath - Evolution path to take
 * @property {string} previousMetadata - Metadata from previous stage
 * @property {ColorPalette} colorPalette - Original color palette
 * @property {Buffer} [imageData] - Image data buffer
 * @property {string} [imageMimeType] - Image MIME type
 */

/**
 * Parameters for merging two pets
 * @typedef {Object} MergePetsParams
 * @property {string} pet1Id - First parent pet ID
 * @property {string} pet2Id - Second parent pet ID
 */

/**
 * Merge compatibility result
 * @typedef {Object} MergeCompatibilityResult
 * @property {boolean} canMerge - Whether the pets can be merged
 * @property {string} [reason] - Reason if merge is not allowed
 * @property {number} rareChanceModifier - Modifier for rare outcome probability
 */

/**
 * Merged attributes result
 * @typedef {Object} MergedAttributes
 * @property {PetStyle} style - Resulting style
 * @property {ColorPalette} colorPalette - Resulting color palette
 * @property {string[]} animals - Combined animal traits
 */

/**
 * Merge outcome result
 * @typedef {Object} MergeOutcome
 * @property {Pet} resultPet - The resulting merged pet
 * @property {boolean} isRare - Whether a rare outcome occurred
 * @property {RareType} [rareType] - Type of rare outcome if applicable
 * @property {string[]} inheritedTraits - Traits inherited from parents
 */

/**
 * Rare outcome determination result
 * @typedef {Object} RareOutcomeResult
 * @property {boolean} isRare - Whether a rare outcome was rolled
 * @property {RareType} [rareType] - Type of rare outcome
 * @property {number} rollValue - The random roll value (0-1)
 */

/**
 * Visual modifiers for rare pets
 * @typedef {Object} RareVisualModifiers
 * @property {string} auraEffect - Aura effect description
 * @property {string[]} specialFeatures - Special visual features
 * @property {string} colorEnhancement - Color enhancement description
 */

/**
 * Selected evolution traits
 * @typedef {Object} SelectedTraits
 * @property {string[]} physical - Physical trait changes
 * @property {string[]} abilities - Ability changes
 * @property {string[]} aesthetic - Aesthetic changes
 */

/**
 * Prompt generation result
 * @typedef {Object} PromptResult
 * @property {string} prompt - The generated prompt
 * @property {string} metadata - Metadata for storage
 */

/**
 * Validation result
 * @typedef {Object} ValidationResult
 * @property {boolean} valid - Whether validation passed
 * @property {string} [error] - Error message if validation failed
 */

/**
 * Saved pet metadata for storage
 * @typedef {Object} SavedPetMetadata
 * @property {string} id - Pet ID
 * @property {string} timestamp - ISO timestamp
 * @property {Pet} pet - Pet data
 * @property {Object} params - Generation parameters
 * @property {number} generation - Generation number in family tree
 * @property {string[]} familyLine - Array of ancestor IDs
 */

export {};
