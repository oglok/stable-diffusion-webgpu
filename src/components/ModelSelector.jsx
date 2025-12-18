import { useState } from 'react';
import { getAllModels } from '../config/models';

export default function ModelSelector({ selectedModel, onModelChange, disabled = false }) {
  const models = getAllModels();
  const [showDetails, setShowDetails] = useState(false);

  const handleModelChange = (e) => {
    const modelId = e.target.value;
    const model = models.find(m => m.id === modelId);
    if (model) {
      onModelChange(model);
    }
  };

  const currentModel = models.find(m => m.id === selectedModel?.id) || models[0];

  return (
    <div className="card">
      <div className="mb-4">
        <label htmlFor="model-select" className="block text-sm font-medium mb-2">
          Select Model
        </label>
        <select
          id="model-select"
          value={currentModel.id}
          onChange={handleModelChange}
          disabled={disabled}
          className="input-field cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
        >
          {models.map((model) => (
            <option key={model.id} value={model.id}>
              {model.name}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">{currentModel.name}</h3>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
          >
            {showDetails ? 'Hide' : 'Show'} Details
          </button>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-300">
          {currentModel.description}
        </p>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="font-medium">VRAM:</span>{' '}
            <span className="text-gray-600 dark:text-gray-300">
              {currentModel.vramRequired}
            </span>
          </div>
          <div>
            <span className="font-medium">Resolution:</span>{' '}
            <span className="text-gray-600 dark:text-gray-300">
              {currentModel.resolution.width}x{currentModel.resolution.height}
            </span>
          </div>
        </div>

        {showDetails && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600 space-y-2 text-sm">
            <div>
              <span className="font-medium">Model Size:</span>{' '}
              <span className="text-gray-600 dark:text-gray-300">
                ~{currentModel.sizeInGB} GB
              </span>
            </div>
            <div>
              <span className="font-medium">Default Steps:</span>{' '}
              <span className="text-gray-600 dark:text-gray-300">
                {currentModel.defaultSteps}
              </span>
            </div>
            <div>
              <span className="font-medium">Guidance Scale:</span>{' '}
              <span className="text-gray-600 dark:text-gray-300">
                {currentModel.defaultGuidanceScale}
              </span>
            </div>
            <div>
              <span className="font-medium">Est. Time:</span>{' '}
              <span className="text-gray-600 dark:text-gray-300">
                {currentModel.estimatedTimePerImage}
              </span>
            </div>
          </div>
        )}
      </div>

      {!disabled && (
        <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
          <p>💡 First load will download the model (~{currentModel.sizeInGB}GB)</p>
          <p className="mt-1">Model files are cached in your browser for future use</p>
        </div>
      )}
    </div>
  );
}

