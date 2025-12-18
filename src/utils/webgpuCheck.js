/**
 * Check if WebGPU is available in the current browser
 * @returns {Promise<{supported: boolean, message: string, adapter: GPUAdapter|null}>}
 */
export async function checkWebGPUSupport() {
  // Check if navigator.gpu exists
  if (!navigator.gpu) {
    return {
      supported: false,
      message: 'WebGPU is not supported in this browser. Please use Chrome 113+, Edge 113+, or Opera 99+.',
      adapter: null
    };
  }

  try {
    // Try to request an adapter
    const adapter = await navigator.gpu.requestAdapter();

    if (!adapter) {
      return {
        supported: false,
        message: 'WebGPU is available but no compatible GPU adapter was found.',
        adapter: null
      };
    }

    return {
      supported: true,
      message: 'WebGPU is supported and ready to use!',
      adapter: adapter
    };
  } catch (error) {
    return {
      supported: false,
      message: `WebGPU check failed: ${error.message}`,
      adapter: null
    };
  }
}

/**
 * Get information about the GPU adapter
 * @param {GPUAdapter} adapter
 * @returns {Object}
 */
export function getAdapterInfo(adapter) {
  if (!adapter) return null;

  return {
    architecture: adapter.info?.architecture || 'Unknown',
    description: adapter.info?.description || 'Unknown GPU',
    device: adapter.info?.device || 'Unknown',
    vendor: adapter.info?.vendor || 'Unknown'
  };
}

/**
 * Get browser-specific guidance for enabling WebGPU
 * @returns {Object}
 */
export function getBrowserGuidance() {
  const userAgent = navigator.userAgent.toLowerCase();

  if (userAgent.includes('chrome') && !userAgent.includes('edge')) {
    return {
      browser: 'Chrome',
      minVersion: '113',
      instructions: 'Update to Chrome 113 or later. WebGPU is enabled by default in recent versions.'
    };
  } else if (userAgent.includes('edg')) {
    return {
      browser: 'Edge',
      minVersion: '113',
      instructions: 'Update to Edge 113 or later. WebGPU is enabled by default in recent versions.'
    };
  } else if (userAgent.includes('opera') || userAgent.includes('opr')) {
    return {
      browser: 'Opera',
      minVersion: '99',
      instructions: 'Update to Opera 99 or later. WebGPU is enabled by default in recent versions.'
    };
  } else if (userAgent.includes('firefox')) {
    return {
      browser: 'Firefox',
      minVersion: 'Nightly',
      instructions: 'WebGPU support in Firefox is experimental. Try Firefox Nightly and enable WebGPU in about:config (dom.webgpu.enabled).'
    };
  } else if (userAgent.includes('safari')) {
    return {
      browser: 'Safari',
      minVersion: 'Technology Preview',
      instructions: 'WebGPU support in Safari is experimental. Try Safari Technology Preview.'
    };
  }

  return {
    browser: 'Unknown',
    minVersion: 'N/A',
    instructions: 'Please use Chrome 113+, Edge 113+, or Opera 99+ for the best experience.'
  };
}

