export default function StatusPanel({
  webgpuSupported,
  webgpuInfo,
  modelLoaded,
  modelInfo,
  isLoading,
  loadingProgress
}) {
  const getStatusColor = () => {
    if (!webgpuSupported) return 'text-red-600 dark:text-red-400';
    if (isLoading) return 'text-yellow-600 dark:text-yellow-400';
    if (modelLoaded) return 'text-green-600 dark:text-green-400';
    return 'text-gray-600 dark:text-gray-400';
  };

  const getStatusText = () => {
    if (!webgpuSupported) return 'WebGPU Not Supported';
    if (isLoading) return 'Loading Model...';
    if (modelLoaded) return 'Ready to Generate';
    return 'Select a Model to Start';
  };

  const getStatusIcon = () => {
    if (!webgpuSupported) {
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
      );
    }
    if (isLoading) {
      return (
        <svg
          className="w-5 h-5 animate-spin"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      );
    }
    if (modelLoaded) {
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
      );
    }
    return (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
          clipRule="evenodd"
        />
      </svg>
    );
  };

  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-4">Status</h2>

      {/* Overall Status */}
      <div className={`flex items-center gap-3 mb-4 ${getStatusColor()}`}>
        {getStatusIcon()}
        <span className="font-semibold">{getStatusText()}</span>
      </div>

      {/* WebGPU Status */}
      <div className="space-y-3">
        <div className="flex items-start gap-2">
          <div className="mt-1">
            {webgpuSupported ? (
              <svg
                className="w-4 h-4 text-green-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                className="w-4 h-4 text-red-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">WebGPU</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {webgpuInfo?.message || 'Checking...'}
            </p>
          </div>
        </div>

        {/* GPU Info */}
        {webgpuSupported && webgpuInfo?.adapterInfo && (
          <div className="pl-6 text-xs space-y-1 text-gray-600 dark:text-gray-400">
            <p>
              <span className="font-medium">GPU:</span>{' '}
              {webgpuInfo.adapterInfo.description}
            </p>
            {webgpuInfo.adapterInfo.vendor && (
              <p>
                <span className="font-medium">Vendor:</span>{' '}
                {webgpuInfo.adapterInfo.vendor}
              </p>
            )}
          </div>
        )}

        {/* Model Status */}
        <div className="flex items-start gap-2">
          <div className="mt-1">
            {modelLoaded ? (
              <svg
                className="w-4 h-4 text-green-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                className="w-4 h-4 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">Model</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {modelLoaded && modelInfo
                ? modelInfo.name
                : 'No model loaded'}
            </p>
          </div>
        </div>

        {/* Loading Progress */}
        {isLoading && loadingProgress && (
          <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
              <div
                className="bg-yellow-600 dark:bg-yellow-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${loadingProgress.progress}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-700 dark:text-gray-300">
              {loadingProgress.message}
            </p>
          </div>
        )}
      </div>

      {/* Browser Guidance */}
      {!webgpuSupported && webgpuInfo?.browserGuidance && (
        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <p className="text-sm font-medium text-red-800 dark:text-red-300 mb-2">
            WebGPU Not Available
          </p>
          <p className="text-xs text-red-700 dark:text-red-400">
            <span className="font-medium">Browser:</span>{' '}
            {webgpuInfo.browserGuidance.browser}
          </p>
          <p className="text-xs text-red-700 dark:text-red-400 mt-1">
            {webgpuInfo.browserGuidance.instructions}
          </p>
        </div>
      )}

      {/* Tips */}
      {webgpuSupported && !isLoading && (
        <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
          <p className="font-medium mb-1">Tips:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Models are cached after first download</li>
            <li>Close other GPU-intensive apps for best performance</li>
            <li>First generation may take longer as GPU warms up</li>
          </ul>
        </div>
      )}
    </div>
  );
}

