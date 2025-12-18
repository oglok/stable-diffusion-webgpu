# Stable Diffusion WebGPU

Generate AI images using Stable Diffusion models directly in your browser with WebGPU acceleration. All processing happens locally on your GPU - no server required!

## Features

- 🎨 **Text-to-Image Generation** - Create images from text descriptions
- 🚀 **WebGPU Acceleration** - Uses your GPU via browser WebGPU API
- 🔄 **Multiple Models** - Choose from SD 1.5, SD 2.1, SDXL, SD Turbo, and SDXL Turbo
- 🔒 **100% Private** - All processing happens locally, nothing is sent to servers
- 💾 **Model Caching** - Models are cached in browser after first download
- ⚙️ **Advanced Controls** - Adjust steps, guidance scale, negative prompts, and seeds
- 🌙 **Dark Mode** - Beautiful UI with dark mode support
- 📱 **Responsive** - Works on desktop and tablet devices

## Browser Requirements

WebGPU is required to run this application. Supported browsers:

| Browser | Minimum Version | Notes |
|---------|----------------|-------|
| Chrome | 113+ | ✅ Recommended, WebGPU enabled by default |
| Edge | 113+ | ✅ WebGPU enabled by default |
| Opera | 99+ | ✅ WebGPU enabled by default |
| Firefox | Nightly | ⚠️ Experimental, requires enabling in about:config |
| Safari | Tech Preview | ⚠️ Experimental support |

### Checking WebGPU Support

To check if your browser supports WebGPU:
1. Open the developer console (F12)
2. Type: `navigator.gpu`
3. If it returns an object, WebGPU is available

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- A WebGPU-compatible browser (see requirements above)
- A GPU with at least 4GB VRAM

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd stable-diffusion-webgpu
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory. You can serve them with any static file server.

## Usage Guide

### Basic Usage

1. **Check Status** - Ensure WebGPU is supported (green checkmark in Status panel)
2. **Select Model** - Choose a Stable Diffusion model from the dropdown
3. **Wait for Loading** - First time loading a model will download ~2-8GB (cached afterwards)
4. **Enter Prompt** - Describe the image you want to generate
5. **Generate** - Click "Generate Image" or press Ctrl+Enter
6. **Download** - Save your generated image using the Download button

### Advanced Options

Click "Advanced Options" in the Prompt Input section to access:

- **Negative Prompt** - Describe what you don't want in the image
- **Steps** - Number of denoising steps (more = better quality, slower)
- **Guidance Scale** - How closely to follow the prompt (7-8 is typical)
- **Seed** - Set to -1 for random, or use a specific number for reproducible results

### Keyboard Shortcuts

- `Ctrl + Enter` - Generate image from prompt
- Click dark/light mode icon in header to toggle theme

## Model Comparison

| Model | Resolution | VRAM | Speed | Quality | Best For |
|-------|-----------|------|-------|---------|----------|
| SD 1.5 | 512x512 | ~4GB | Fast | Good | Most compatible, great for testing |
| SD 2.1 | 768x768 | ~5GB | Medium | Better | Improved quality and resolution |
| SDXL | 1024x1024 | ~8GB | Slow | Excellent | Highest quality, detailed images |
| SD Turbo | 512x512 | ~4GB | Very Fast | Good | Rapid iteration, 1-4 steps |
| SDXL Turbo | 1024x1024 | ~8GB | Fast | Excellent | Best of both worlds |

## Performance Tips

1. **First Load** - Model download can take 5-15 minutes depending on your connection
2. **Close Other Apps** - Close GPU-intensive applications for best performance
3. **Browser Memory** - Large models may use 4-8GB of RAM in addition to VRAM
4. **Generation Time** - First generation is slower, subsequent ones are faster
5. **Steps** - Use fewer steps (15-20) for faster results while testing
6. **Turbo Models** - Use Turbo variants for rapid iteration

## Troubleshooting

### WebGPU Not Supported

**Problem**: "WebGPU is not supported" error

**Solutions**:
- Update to the latest version of Chrome, Edge, or Opera
- Ensure your GPU drivers are up to date
- On Linux, you may need to enable GPU acceleration in browser flags
- Check if hardware acceleration is enabled: `chrome://settings/?search=hardware`

### Model Loading Fails

**Problem**: Model fails to load or download

**Solutions**:
- Check your internet connection
- Clear browser cache and try again
- Ensure you have enough disk space (models are 2-8GB each)
- Try a different model (start with SD 1.5)

### Out of Memory Errors

**Problem**: Browser crashes or shows out of memory errors

**Solutions**:
- Choose a smaller model (SD 1.5 instead of SDXL)
- Close other browser tabs and applications
- Reduce the number of steps
- Check available VRAM: smaller GPUs may not support larger models

### Slow Generation

**Problem**: Image generation takes too long

**Solutions**:
- Use Turbo models for faster generation
- Reduce the number of steps (try 15-25)
- Ensure no other GPU-intensive apps are running
- First generation is always slower - subsequent ones improve

## Project Structure

```
stable-diffusion-webgpu/
├── index.html              # Entry point
├── package.json            # Dependencies
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind CSS config
└── src/
    ├── main.jsx            # React entry point
    ├── App.jsx             # Main application component
    ├── index.css           # Global styles
    ├── components/         # React components
    │   ├── ModelSelector.jsx
    │   ├── PromptInput.jsx
    │   ├── ImageDisplay.jsx
    │   └── StatusPanel.jsx
    ├── services/           # Business logic
    │   └── stableDiffusion.js
    ├── utils/              # Utilities
    │   └── webgpuCheck.js
    └── config/             # Configuration
        └── models.js
```

## Technical Details

### Architecture

The application uses a service-based architecture:
- **React Components** - UI layer
- **Stable Diffusion Service** - Handles model loading and inference
- **WebGPU Utils** - Browser capability detection
- **Model Config** - Model definitions and parameters

### WebGPU Integration

This project is designed to work with WebGPU-based Stable Diffusion implementations. The current code provides a complete interface and placeholder implementation. To use actual Stable Diffusion inference, you need to:

1. Install a WebGPU-compatible SD library (e.g., web-txt2img, ONNX Runtime Web)
2. Update `src/services/stableDiffusion.js` with the library's API
3. Verify model IDs in `src/config/models.js` match available models

### Technologies Used

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **WebGPU API** - GPU acceleration

## Known Limitations

1. **Browser Support** - WebGPU is still relatively new and not universally supported
2. **Model Size** - Large downloads required for first use
3. **Memory Usage** - Requires significant RAM and VRAM
4. **Mobile** - Not recommended for mobile devices due to resource requirements
5. **Library Integration** - Actual SD inference requires additional WebGPU library integration

## Future Enhancements

- [ ] Image-to-image transformation
- [ ] Inpainting support
- [ ] ControlNet integration
- [ ] Multiple image generation (batch mode)
- [ ] Generation history/gallery
- [ ] Prompt templates and examples
- [ ] Settings persistence
- [ ] Progressive image preview during generation

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## License

This project is provided as-is for educational and research purposes.

## Acknowledgments

- Stable Diffusion by Stability AI
- WebGPU specification by W3C
- React and Vite communities
- Tailwind CSS team

## Support

For issues and questions:
1. Check the Troubleshooting section above
2. Open an issue on GitHub
3. Check browser WebGPU compatibility at https://caniuse.com/webgpu

---

**Note**: This application requires actual WebGPU Stable Diffusion library integration to perform real image generation. The current implementation includes placeholder generation for demonstration purposes.

