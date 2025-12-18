import { useState } from 'react';
import { UI_CONFIG, GENERATION_PARAMS } from '../config/models';

export default function PromptInput({
  onGenerate,
  disabled = false,
  selectedModel
}) {
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [steps, setSteps] = useState(selectedModel?.defaultSteps || 30);
  const [guidanceScale, setGuidanceScale] = useState(selectedModel?.defaultGuidanceScale || 7.5);
  const [seed, setSeed] = useState(-1);

  const handleGenerate = () => {
    if (!prompt.trim()) {
      alert('Please enter a prompt');
      return;
    }

    onGenerate({
      prompt: prompt.trim(),
      negativePrompt: negativePrompt.trim(),
      steps: parseInt(steps),
      guidanceScale: parseFloat(guidanceScale),
      seed: parseInt(seed)
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleGenerate();
    }
  };

  // Update advanced settings when model changes
  useState(() => {
    if (selectedModel) {
      setSteps(selectedModel.defaultSteps);
      setGuidanceScale(selectedModel.defaultGuidanceScale);
      setNegativePrompt(selectedModel.defaultNegativePrompt);
    }
  }, [selectedModel]);

  return (
    <div className="card">
      <div className="space-y-4">
        {/* Prompt Input */}
        <div>
          <label htmlFor="prompt" className="block text-sm font-medium mb-2">
            Prompt
            <span className="ml-2 text-xs text-gray-500">
              ({prompt.length}/{UI_CONFIG.maxPromptLength})
            </span>
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value.slice(0, UI_CONFIG.maxPromptLength))}
            onKeyPress={handleKeyPress}
            placeholder="Describe the image you want to generate... (Ctrl+Enter to generate)"
            disabled={disabled}
            rows={4}
            className="input-field resize-none"
          />
        </div>

        {/* Advanced Options Toggle */}
        {UI_CONFIG.showAdvancedOptions && (
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
          >
            {showAdvanced ? '▼' : '▶'} Advanced Options
          </button>
        )}

        {/* Advanced Options */}
        {showAdvanced && (
          <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-600">
            {/* Negative Prompt */}
            <div>
              <label htmlFor="negative-prompt" className="block text-sm font-medium mb-2">
                Negative Prompt
                <span className="ml-2 text-xs text-gray-500">
                  ({negativePrompt.length}/{UI_CONFIG.maxNegativePromptLength})
                </span>
              </label>
              <textarea
                id="negative-prompt"
                value={negativePrompt}
                onChange={(e) => setNegativePrompt(e.target.value.slice(0, UI_CONFIG.maxNegativePromptLength))}
                placeholder="What to avoid in the image..."
                disabled={disabled}
                rows={2}
                className="input-field resize-none"
              />
            </div>

            {/* Steps */}
            <div>
              <label htmlFor="steps" className="block text-sm font-medium mb-2">
                Steps: {steps}
              </label>
              <input
                type="range"
                id="steps"
                min={GENERATION_PARAMS.minSteps}
                max={GENERATION_PARAMS.maxSteps}
                value={steps}
                onChange={(e) => setSteps(e.target.value)}
                disabled={disabled}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Faster</span>
                <span>Better Quality</span>
              </div>
            </div>

            {/* Guidance Scale */}
            <div>
              <label htmlFor="guidance" className="block text-sm font-medium mb-2">
                Guidance Scale: {guidanceScale}
              </label>
              <input
                type="range"
                id="guidance"
                min={GENERATION_PARAMS.minGuidanceScale}
                max={GENERATION_PARAMS.maxGuidanceScale}
                step={0.5}
                value={guidanceScale}
                onChange={(e) => setGuidanceScale(e.target.value)}
                disabled={disabled}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>More Creative</span>
                <span>Follows Prompt Closely</span>
              </div>
            </div>

            {/* Seed */}
            {UI_CONFIG.enableSeedControl && (
              <div>
                <label htmlFor="seed" className="block text-sm font-medium mb-2">
                  Seed (-1 for random)
                </label>
                <input
                  type="number"
                  id="seed"
                  value={seed}
                  onChange={(e) => setSeed(e.target.value)}
                  disabled={disabled}
                  className="input-field"
                  placeholder="-1"
                />
              </div>
            )}
          </div>
        )}

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={disabled || !prompt.trim()}
          className="btn-primary w-full py-3 text-lg"
        >
          {disabled ? 'Generating...' : 'Generate Image'}
        </button>

        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          Tip: Use Ctrl+Enter to quickly generate
        </p>
      </div>
    </div>
  );
}

