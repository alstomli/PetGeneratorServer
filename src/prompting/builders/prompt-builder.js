/**
 * Prompt builder utilities for constructing complex prompts.
 * No AI SDK dependencies.
 * @module prompting/builders/prompt-builder
 */

/**
 * A fluent builder for constructing image generation prompts.
 */
export class PromptBuilder {
  constructor() {
    this.sections = [];
    this.requirements = [];
    this.style = null;
    this.background = 'pure white or transparent background';
  }

  /**
   * Add a section to the prompt.
   * @param {string} title - Section title
   * @param {string} content - Section content
   * @returns {PromptBuilder} this
   */
  addSection(title, content) {
    this.sections.push({ title, content });
    return this;
  }

  /**
   * Add a critical requirement.
   * @param {string} requirement - The requirement text
   * @returns {PromptBuilder} this
   */
  addRequirement(requirement) {
    this.requirements.push(requirement);
    return this;
  }

  /**
   * Set the artistic style.
   * @param {string} style - Style description
   * @returns {PromptBuilder} this
   */
  setStyle(style) {
    this.style = style;
    return this;
  }

  /**
   * Set the background style.
   * @param {string} background - Background description
   * @returns {PromptBuilder} this
   */
  setBackground(background) {
    this.background = background;
    return this;
  }

  /**
   * Build the final prompt string.
   * @returns {string} The complete prompt
   */
  build() {
    const parts = [];

    // Add sections
    for (const section of this.sections) {
      if (section.title) {
        parts.push(`${section.title}:\n${section.content}`);
      } else {
        parts.push(section.content);
      }
    }

    // Add style
    if (this.style) {
      parts.push(`ARTISTIC STYLE: ${this.style}`);
    }

    // Add background
    if (this.background) {
      parts.push(`BACKGROUND: ${this.background}`);
    }

    // Add requirements
    if (this.requirements.length > 0) {
      parts.push('CRITICAL REQUIREMENTS:');
      parts.push(this.requirements.map(r => `- ${r}`).join('\n'));
    }

    return parts.join('\n\n');
  }
}

/**
 * Create a standard pet generation prompt builder with common settings.
 * @returns {PromptBuilder} Pre-configured builder
 */
export const createPetPromptBuilder = () => {
  return new PromptBuilder()
    .setStyle('High-quality digital art, Pokemon/Disney style, vibrant colors, professional concept art')
    .setBackground('Pure white or transparent background only - NO environment, NO scenery, NO ground, NO shadows on ground')
    .addRequirement('NO TEXT of any kind - no labels, no titles, no captions, no watermarks, no words')
    .addRequirement('NO writing or letters anywhere in the image')
    .addRequirement('ONLY the creature itself - nothing else')
    .addRequirement('Clean isolated character art suitable for a game asset')
    .addRequirement('SINGLE VIEW ONLY - one creature, one angle, NO multiple views, NO turnarounds, NO character sheets');
};

/**
 * Build a creature description section.
 * @param {Object} options - Description options
 * @param {string} options.style - Pet style
 * @param {string} options.colorPalette - Color palette
 * @param {string[]} options.animals - Animal inspirations
 * @param {number} options.stage - Evolution stage
 * @param {string} [options.additionalFeatures] - Additional features
 * @returns {string} Creature description
 */
export const buildCreatureDescription = ({ style, colorPalette, animals, stage, additionalFeatures }) => {
  const animalFeatures = animals.length > 0 ? animals.join(' and ') : 'fantasy creature';
  const stageNames = { 1: 'baby', 2: 'juvenile', 3: 'adult' };
  const stageName = stageNames[stage] || 'baby';

  let description = `A ${style} ${stageName} fantasy creature inspired by ${animalFeatures} with ${colorPalette} colors.`;

  if (additionalFeatures) {
    description += ` ${additionalFeatures}`;
  }

  return description;
};

export default PromptBuilder;
