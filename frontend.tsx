import React, { useState, useRef, useEffect, useCallback } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

// Model configurations
const MODELS = [
  {
    id: "aislamov/stable-diffusion-2-1-base-onnx",
    name: "SD 2.1",
    description: "Balanced quality",
  },
  {
    id: "Xenova/stable-diffusion-v1-5",
    name: "SD 1.5",
    description: "Classic model",
  },
  {
    id: "stabilityai/sd-turbo",
    name: "SD Turbo",
    description: "Fast generation",
  },
] as const;

type ModelId = (typeof MODELS)[number]["id"];

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  image?: string;
  timestamp: Date;
}

interface LoadingState {
  isLoading: boolean;
  stage: string;
  progress: number;
}

// Check WebGPU support
function checkWebGPUSupport(): boolean {
  return "gpu" in navigator;
}

// Generate unique ID
function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

// Main App Component
function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [selectedModel, setSelectedModel] = useState<ModelId>(MODELS[0].id);
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isLoading: false,
    stage: "",
    progress: 0,
  });
  const [webGPUSupported, setWebGPUSupported] = useState<boolean | null>(null);
  const [pipelineReady, setPipelineReady] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const pipelineRef = useRef<any>(null);

  // Check WebGPU on mount
  useEffect(() => {
    setWebGPUSupported(checkWebGPUSupport());
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-resize textarea
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 150) + "px";
  };

  // Initialize the pipeline
  const initializePipeline = useCallback(async () => {
    if (pipelineRef.current) return pipelineRef.current;

    setLoadingState({
      isLoading: true,
      stage: "Loading transformers.js...",
      progress: 10,
    });

    try {
      // Dynamic import to avoid SSR issues
      const { pipeline, env } = await import("@huggingface/transformers");

      // Configure for browser usage
      env.allowLocalModels = false;
      env.useBrowserCache = true;

      setLoadingState({
        isLoading: true,
        stage: "Loading model (this may take a few minutes on first run)...",
        progress: 30,
      });

      const pipe = await pipeline("text-to-image", selectedModel, {
        device: "webgpu",
        dtype: "fp16",
        progress_callback: (progress: any) => {
          if (progress.status === "downloading") {
            const pct = progress.progress ? Math.round(progress.progress) : 30;
            setLoadingState({
              isLoading: true,
              stage: `Downloading ${progress.file || "model"}...`,
              progress: Math.min(30 + pct * 0.5, 80),
            });
          } else if (progress.status === "loading") {
            setLoadingState({
              isLoading: true,
              stage: "Loading model into GPU memory...",
              progress: 85,
            });
          }
        },
      });

      pipelineRef.current = pipe;
      setPipelineReady(true);
      setLoadingState({ isLoading: false, stage: "", progress: 100 });

      return pipe;
    } catch (error) {
      console.error("Failed to initialize pipeline:", error);
      setLoadingState({ isLoading: false, stage: "", progress: 0 });
      throw error;
    }
  }, [selectedModel]);

  // Generate image
  const generateImage = async (prompt: string) => {
    setLoadingState({
      isLoading: true,
      stage: "Initializing...",
      progress: 5,
    });

    try {
      const pipe = await initializePipeline();

      setLoadingState({
        isLoading: true,
        stage: "Generating image...",
        progress: 90,
      });

      const result = await pipe(prompt, {
        num_inference_steps: 20,
        guidance_scale: 7.5,
      });

      // Convert result to base64 image
      let imageUrl: string;

      if (result && result[0]) {
        const imageData = result[0];

        if (imageData instanceof Blob) {
          imageUrl = URL.createObjectURL(imageData);
        } else if (imageData.toDataURL) {
          imageUrl = imageData.toDataURL();
        } else if (typeof imageData === "string") {
          imageUrl = imageData;
        } else {
          // Try to create a canvas and draw the image data
          const canvas = document.createElement("canvas");
          canvas.width = 512;
          canvas.height = 512;
          const ctx = canvas.getContext("2d");

          if (ctx && imageData.data) {
            const imgData = new ImageData(
              new Uint8ClampedArray(imageData.data),
              imageData.width || 512,
              imageData.height || 512
            );
            ctx.putImageData(imgData, 0, 0);
            imageUrl = canvas.toDataURL("image/png");
          } else {
            throw new Error("Unable to process image output");
          }
        }
      } else {
        throw new Error("No image generated");
      }

      return imageUrl;
    } finally {
      setLoadingState({ isLoading: false, stage: "", progress: 0 });
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedInput = input.trim();
    if (!trimmedInput || loadingState.isLoading) return;

    // Add user message
    const userMessage: Message = {
      id: generateId(),
      role: "user",
      content: trimmedInput,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    try {
      const imageUrl = await generateImage(trimmedInput);

      // Add assistant message with generated image
      const assistantMessage: Message = {
        id: generateId(),
        role: "assistant",
        content: `Here's your generated image for: "${trimmedInput}"`,
        image: imageUrl,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Generation error:", error);

      // Add error message
      const errorMessage: Message = {
        id: generateId(),
        role: "assistant",
        content: `Sorry, I couldn't generate that image. ${error instanceof Error ? error.message : "Please try again."}`,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  // Handle Enter key
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Reset pipeline when model changes
  useEffect(() => {
    pipelineRef.current = null;
    setPipelineReady(false);
  }, [selectedModel]);

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <h1>Stable Diffusion WebGPU</h1>
        <p>Generate images directly in your browser using AI</p>
      </header>

      {/* WebGPU Warning */}
      {webGPUSupported === false && (
        <div className="webgpu-warning">
          <span className="webgpu-warning-icon">⚠️</span>
          <div className="webgpu-warning-text">
            <h4>WebGPU Not Supported</h4>
            <p>
              Your browser doesn't support WebGPU. Please use Chrome 113+ or Edge 113+ for the best experience.
            </p>
          </div>
        </div>
      )}

      {/* Model Selector */}
      <div className="model-selector">
        {MODELS.map((model) => (
          <div key={model.id} className="model-option">
            <input
              type="radio"
              id={model.id}
              name="model"
              value={model.id}
              checked={selectedModel === model.id}
              onChange={(e) => setSelectedModel(e.target.value as ModelId)}
              disabled={loadingState.isLoading}
            />
            <label htmlFor={model.id}>
              <span className="model-name">{model.name}</span>
              <span className="model-desc">{model.description}</span>
            </label>
          </div>
        ))}
      </div>

      {/* Chat Container */}
      <div className="chat-container">
        {/* Messages */}
        <div className="messages">
          {messages.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🎨</div>
              <h3>Ready to create</h3>
              <p>
                Describe the image you want to generate and I'll create it using
                Stable Diffusion running entirely in your browser.
              </p>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <div key={message.id} className={`message ${message.role}`}>
                  <div className="message-avatar">
                    {message.role === "user" ? "👤" : "🤖"}
                  </div>
                  <div className="message-content">
                    <p>{message.content}</p>
                    {message.image && (
                      <img
                        src={message.image}
                        alt="Generated"
                        className="generated-image"
                      />
                    )}
                  </div>
                </div>
              ))}
            </>
          )}

          {/* Loading State */}
          {loadingState.isLoading && (
            <div className="message assistant">
              <div className="message-avatar">🤖</div>
              <div className="loading">
                <div className="loading-spinner" />
                <span className="loading-text">{loadingState.stage}</span>
                <span className="loading-progress">{loadingState.progress}%</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="input-area">
          <form onSubmit={handleSubmit} className="input-wrapper">
            <div className="input-field">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={handleTextareaChange}
                onKeyDown={handleKeyDown}
                placeholder="Describe the image you want to generate..."
                disabled={loadingState.isLoading || webGPUSupported === false}
                rows={1}
              />
            </div>
            <button
              type="submit"
              className="send-button"
              disabled={
                !input.trim() ||
                loadingState.isLoading ||
                webGPUSupported === false
              }
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
              Generate
            </button>
          </form>
        </div>

        {/* Status Bar */}
        <div className="status-bar">
          <span
            className={`status-dot ${
              loadingState.isLoading
                ? "loading"
                : pipelineReady
                ? "ready"
                : ""
            }`}
          />
          <span>
            {loadingState.isLoading
              ? "Processing..."
              : pipelineReady
              ? "Model ready"
              : "Model will load on first generation"}
          </span>
        </div>
      </div>
    </div>
  );
}

// Mount the app
const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}

