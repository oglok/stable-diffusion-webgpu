/**
 * Stable Diffusion model configurations
 * These will be used with the web-txt2img library
 */

export const MODELS = {
  SD_1_5: {
    id: 'sd-1.5',
    name: 'Stable Diffusion 1.5',
    description: 'Best compatibility, works on most GPUs',
    vramRequired: '~4GB',
    resolution: { width: 512, height: 512 },
    defaultSteps: 30,
    defaultGuidanceScale: 7.5,
    defaultNegativePrompt: 'blurry, bad quality, distorted, low quality',
    // These model IDs are placeholders and will need to be updated
    // based on what web-txt2img library actually supports
    modelId: 'stabilityai/stable-diffusion-v1-5',
    sizeInGB: 4.0,
    estimatedTimePerImage: '30-60 seconds'
  },

  SD_2_1: {
    id: 'sd-2.1',
    name: 'Stable Diffusion 2.1',
    description: 'Improved quality with higher resolution',
    vramRequired: '~5GB',
    resolution: { width: 768, height: 768 },
    defaultSteps: 30,
    defaultGuidanceScale: 7.5,
    defaultNegativePrompt: 'blurry, bad quality, distorted, low quality',
    modelId: 'stabilityai/stable-diffusion-2-1',
    sizeInGB: 5.0,
    estimatedTimePerImage: '45-90 seconds'
  },

  SDXL: {
    id: 'sdxl',
    name: 'Stable Diffusion XL',
    description: 'Highest quality, large model',
    vramRequired: '~8GB',
    resolution: { width: 1024, height: 1024 },
    defaultSteps: 30,
    defaultGuidanceScale: 7.5,
    defaultNegativePrompt: 'blurry, bad quality, distorted, low quality',
    modelId: 'stabilityai/stable-diffusion-xl-base-1.0',
    sizeInGB: 8.0,
    estimatedTimePerImage: '60-120 seconds'
  },

  SD_TURBO: {
    id: 'sd-turbo',
    name: 'SD Turbo',
    description: 'Ultra-fast generation, 1-4 steps',
    vramRequired: '~4GB',
    resolution: { width: 512, height: 512 },
    defaultSteps: 4,
    defaultGuidanceScale: 1.0,
    defaultNegativePrompt: '',
    modelId: 'stabilityai/sd-turbo',
    sizeInGB: 4.0,
    estimatedTimePerImage: '10-20 seconds'
  },

  SDXL_TURBO: {
    id: 'sdxl-turbo',
    name: 'SDXL Turbo',
    description: 'Fast generation with high quality',
    vramRequired: '~8GB',
    resolution: { width: 1024, height: 1024 },
    defaultSteps: 4,
    defaultGuidanceScale: 1.0,
    defaultNegativePrompt: '',
    modelId: 'stabilityai/sdxl-turbo',
    sizeInGB: 8.0,
    estimatedTimePerImage: '20-40 seconds'
  }
};

/**
 * Get an array of all available models
 * @returns {Array}
 */
export function getAllModels() {
  return Object.values(MODELS);
}

/**
 * Get a model by its ID
 * @param {string} modelId
 * @returns {Object|null}
 */
export function getModelById(modelId) {
  return Object.values(MODELS).find(model => model.id === modelId) || null;
}

/**
 * Get default model (SD 1.5 for best compatibility)
 * @returns {Object}
 */
export function getDefaultModel() {
  return MODELS.SD_1_5;
}

/**
 * Generation parameters
 */
export const GENERATION_PARAMS = {
  minSteps: 1,
  maxSteps: 100,
  minGuidanceScale: 0,
  maxGuidanceScale: 20,
  defaultSeed: -1, // -1 means random
};

/**
 * UI Configuration
 */
export const UI_CONFIG = {
  maxPromptLength: 500,
  maxNegativePromptLength: 500,
  showAdvancedOptions: true,
  enableSeedControl: true,
};

