# Stable Diffusion WebGPU

A browser-based Stable Diffusion image generator that runs entirely client-side using WebGPU acceleration.

## Overview

This project demonstrates running Stable Diffusion models directly in the browser without any server-side inference. It leverages:

- **[transformers.js](https://huggingface.co/docs/transformers.js)** - Hugging Face's JavaScript library for running transformer models in the browser
- **[Bun](https://bun.com)** - Fast all-in-one JavaScript runtime used as the development server and bundler
- **WebGPU** - Modern GPU API for hardware-accelerated machine learning inference in the browser

## Features

- Chat-style interface for generating images from text prompts
- Multiple Stable Diffusion model sizes to choose from
- Real-time progress feedback during model loading and generation
- All inference runs locally in your browser - no data sent to external servers

## Requirements

- **Browser**: Chrome 113+ or Edge 113+ (WebGPU support required)
- **GPU**: A WebGPU-compatible graphics card with sufficient VRAM (4GB+ recommended)
- **Bun**: v1.0.0 or later

## Installation

```bash
bun install
```

## Development

Start the development server with hot module replacement:

```bash
bun run dev
```

Or run directly:

```bash
bun --hot ./index.ts
```

## Production

```bash
bun run start
```

## Available Models

| Model | Description | Speed | Quality |
|-------|-------------|-------|---------|
| SD Turbo | Fastest generation, smaller output | Fast | Good |
| SD 1.5 | Standard Stable Diffusion | Medium | Better |
| SDXL Turbo | High quality with faster generation | Slower | Best |

## How It Works

1. The Bun server serves the HTML/React frontend
2. When you enter a prompt, transformers.js loads the selected Stable Diffusion model
3. The model runs inference using WebGPU for GPU acceleration
4. Generated images are displayed inline in the chat interface

All model weights are downloaded and cached in your browser on first use (~2-4GB depending on model).

---

## Development Guidelines

This project uses **Bun** instead of Node.js for all tooling.

### Commands

- Use `bun <file>` instead of `node <file>` or `ts-node <file>`
- Use `bun test` instead of `jest` or `vitest`
- Use `bun build <file>` instead of `webpack` or `esbuild`
- Use `bun install` instead of `npm install` or `yarn install`
- Use `bun run <script>` instead of `npm run <script>`
- Use `bunx <package>` instead of `npx <package>`
- Bun automatically loads `.env` files - no need for dotenv

### Bun APIs

- `Bun.serve()` for HTTP server with WebSocket support (no Express needed)
- `bun:sqlite` for SQLite (no better-sqlite3)
- `Bun.file()` for file operations (preferred over node:fs)
- Built-in `WebSocket` support (no ws package needed)

### Frontend Architecture

This project uses Bun's HTML imports with `Bun.serve()` instead of Vite. HTML files can directly import `.tsx`, `.jsx`, or `.js` files, and Bun's bundler handles transpilation automatically.

Example server setup:

```ts
import index from "./index.html"

Bun.serve({
  routes: {
    "/": index,
  },
  development: {
    hmr: true,
    console: true,
  }
})
```

### Testing

```ts
import { test, expect } from "bun:test";

test("example test", () => {
  expect(1).toBe(1);
});
```

Run tests with:

```bash
bun test
```

---

## License

MIT
