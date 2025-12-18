import { useState } from 'react';

export default function ImageDisplay({
  imageUrl,
  isGenerating = false,
  progress = null,
  generationInfo = null
}) {
  const [showInfo, setShowInfo] = useState(false);

  const handleDownload = () => {
    if (!imageUrl) return;

    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `sd-webgpu-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyPrompt = () => {
    if (generationInfo?.prompt) {
      navigator.clipboard.writeText(generationInfo.prompt);
      alert('Prompt copied to clipboard!');
    }
  };

  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-4">Generated Image</h2>

      {/* Image Container */}
      <div className="relative bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden aspect-square flex items-center justify-center">
        {isGenerating ? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            {/* Loading Spinner */}
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mb-4"></div>

            {progress && (
              <div className="w-full max-w-xs">
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mb-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress.progress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {progress.message}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {progress.progress}%
                </p>
              </div>
            )}

            {!progress && (
              <p className="text-gray-600 dark:text-gray-300">
                Generating image...
              </p>
            )}
          </div>
        ) : imageUrl ? (
          <img
            src={imageUrl}
            alt="Generated"
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="text-center p-8 text-gray-500 dark:text-gray-400">
            <svg
              className="w-24 h-24 mx-auto mb-4 opacity-50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p>Your generated image will appear here</p>
            <p className="text-sm mt-2">Enter a prompt and click Generate</p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {imageUrl && !isGenerating && (
        <div className="mt-4 flex gap-2">
          <button
            onClick={handleDownload}
            className="btn-primary flex-1 flex items-center justify-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Download
          </button>

          {generationInfo && (
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="btn-secondary flex items-center justify-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Info
            </button>
          )}
        </div>
      )}

      {/* Generation Info Panel */}
      {showInfo && generationInfo && (
        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg space-y-2 text-sm">
          <h3 className="font-semibold mb-2">Generation Details</h3>

          {generationInfo.prompt && (
            <div>
              <span className="font-medium">Prompt:</span>
              <p className="text-gray-600 dark:text-gray-300 mt-1 break-words">
                {generationInfo.prompt}
              </p>
              <button
                onClick={handleCopyPrompt}
                className="text-xs text-primary-600 dark:text-primary-400 hover:underline mt-1"
              >
                Copy Prompt
              </button>
            </div>
          )}

          {generationInfo.negativePrompt && (
            <div>
              <span className="font-medium">Negative Prompt:</span>
              <p className="text-gray-600 dark:text-gray-300 mt-1 break-words">
                {generationInfo.negativePrompt}
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 pt-2">
            {generationInfo.steps && (
              <div>
                <span className="font-medium">Steps:</span>{' '}
                <span className="text-gray-600 dark:text-gray-300">
                  {generationInfo.steps}
                </span>
              </div>
            )}

            {generationInfo.guidanceScale && (
              <div>
                <span className="font-medium">Guidance:</span>{' '}
                <span className="text-gray-600 dark:text-gray-300">
                  {generationInfo.guidanceScale}
                </span>
              </div>
            )}

            {generationInfo.seed && (
              <div>
                <span className="font-medium">Seed:</span>{' '}
                <span className="text-gray-600 dark:text-gray-300">
                  {generationInfo.seed}
                </span>
              </div>
            )}

            {generationInfo.model && (
              <div>
                <span className="font-medium">Model:</span>{' '}
                <span className="text-gray-600 dark:text-gray-300">
                  {generationInfo.model}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

