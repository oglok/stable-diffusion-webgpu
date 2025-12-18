import { useState, useEffect, useCallback } from 'react';
import ModelSelector from './components/ModelSelector';
import PromptInput from './components/PromptInput';
import ImageDisplay from './components/ImageDisplay';
import StatusPanel from './components/StatusPanel';
import { checkWebGPUSupport, getAdapterInfo, getBrowserGuidance } from './utils/webgpuCheck';
import { sdService } from './services/stableDiffusion';
import { getDefaultModel } from './config/models';

function App() {
  // WebGPU state
  const [webgpuSupported, setWebgpuSupported] = useState(false);
  const [webgpuInfo, setWebgpuInfo] = useState(null);

  // Model state
  const [selectedModel, setSelectedModel] = useState(getDefaultModel());
  const [modelLoaded, setModelLoaded] = useState(false);
  const [isLoadingModel, setIsLoadingModel] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(null);

  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(null);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [generationInfo, setGenerationInfo] = useState(null);

  // Dark mode state
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true' ||
      window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Check WebGPU support on mount
  useEffect(() => {
    const checkSupport = async () => {
      const result = await checkWebGPUSupport();
      setWebgpuSupported(result.supported);

      const adapterInfo = result.adapter ? getAdapterInfo(result.adapter) : null;
      const browserGuidance = getBrowserGuidance();

      setWebgpuInfo({
        message: result.message,
        adapterInfo,
        browserGuidance
      });
    };

    checkSupport();
  }, []);

  // Apply dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  // Set up progress callback for SD service
  useEffect(() => {
    sdService.onProgress((progress) => {
      if (progress.stage === 'loading' || progress.stage === 'initialization') {
        setLoadingProgress(progress);
      } else if (progress.stage === 'generating') {
        setGenerationProgress(progress);
      } else if (progress.stage === 'ready') {
        setLoadingProgress(null);
        setModelLoaded(true);
        setIsLoadingModel(false);
      } else if (progress.stage === 'complete') {
        setGenerationProgress(null);
      }
    });
  }, []);

  // Handle model change
  const handleModelChange = useCallback(async (model) => {
    if (isGenerating || isLoadingModel) {
      alert('Please wait for the current operation to complete');
      return;
    }

    setSelectedModel(model);
    setModelLoaded(false);
    setIsLoadingModel(true);
    setLoadingProgress({ stage: 'initialization', progress: 0, message: 'Initializing...' });

    try {
      await sdService.initializeModel(model.id);
      setModelLoaded(true);
    } catch (error) {
      console.error('Failed to load model:', error);
      alert(`Failed to load model: ${error.message}`);
      setModelLoaded(false);
    } finally {
      setIsLoadingModel(false);
      setLoadingProgress(null);
    }
  }, [isGenerating, isLoadingModel]);

  // Handle image generation
  const handleGenerate = useCallback(async (params) => {
    if (!modelLoaded) {
      alert('Please wait for the model to load first');
      return;
    }

    if (!webgpuSupported) {
      alert('WebGPU is not supported in your browser. Please use a supported browser.');
      return;
    }

    setIsGenerating(true);
    setGenerationProgress({ stage: 'generating', progress: 0, message: 'Starting generation...' });

    try {
      const result = await sdService.generateImage(params.prompt, {
        negativePrompt: params.negativePrompt,
        steps: params.steps,
        guidanceScale: params.guidanceScale,
        seed: params.seed
      });

      setGeneratedImage(result.imageUrl);
      setGenerationInfo({
        prompt: params.prompt,
        negativePrompt: params.negativePrompt,
        steps: params.steps,
        guidanceScale: params.guidanceScale,
        seed: result.seed,
        model: selectedModel.name
      });
    } catch (error) {
      console.error('Failed to generate image:', error);
      alert(`Failed to generate image: ${error.message}`);
    } finally {
      setIsGenerating(false);
      setGenerationProgress(null);
    }
  }, [modelLoaded, webgpuSupported, selectedModel]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Stable Diffusion WebGPU
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                AI Image Generation in Your Browser
              </p>
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg className="w-6 h-6 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Controls */}
          <div className="lg:col-span-1 space-y-6">
            <ModelSelector
              selectedModel={selectedModel}
              onModelChange={handleModelChange}
              disabled={isLoadingModel || isGenerating}
            />

            <StatusPanel
              webgpuSupported={webgpuSupported}
              webgpuInfo={webgpuInfo}
              modelLoaded={modelLoaded}
              modelInfo={selectedModel}
              isLoading={isLoadingModel}
              loadingProgress={loadingProgress}
            />
          </div>

          {/* Middle Column - Generation */}
          <div className="lg:col-span-1 space-y-6">
            <PromptInput
              onGenerate={handleGenerate}
              disabled={!modelLoaded || isGenerating || isLoadingModel || !webgpuSupported}
              selectedModel={selectedModel}
            />
          </div>

          {/* Right Column - Output */}
          <div className="lg:col-span-1">
            <ImageDisplay
              imageUrl={generatedImage}
              isGenerating={isGenerating}
              progress={generationProgress}
              generationInfo={generationInfo}
            />
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>
            All processing happens locally in your browser using WebGPU.
            Your images and prompts never leave your device.
          </p>
          <p className="mt-2">
            First model load may take a few minutes. Models are cached for future use.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 py-6 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>
            Powered by WebGPU • Built with React and Vite
          </p>
          <p className="mt-1">
            Requires Chrome 113+, Edge 113+, or Opera 99+
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;

