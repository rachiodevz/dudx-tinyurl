// AI Models Configuration
// Support multiple AI providers with OpenAI SDK compatibility

export const AI_PROVIDERS = {
  GLM: {
    name: "GLM-4.6",
    apiKeyEnv: "GLM_API_KEY",
    baseURL: "https://api.z.ai/api/paas/v4/",
    model: "glm-4.6",
    systemPrompt: "You are a helpful AI assistant. You can communicate in both Thai and English.",
  },
  GROQ: {
    name: "Groq (Llama 3.1)",
    apiKeyEnv: "GROQ_API_KEY",
    baseURL: "https://api.groq.com/openai/v1",
    model: "llama-3.1-70b-versatile",
    systemPrompt: "You are a helpful AI assistant. You can communicate in both Thai and English.",
  },
  OPENROUTER: {
    name: "OpenRouter",
    apiKeyEnv: "OPENROUTER_API_KEY",
    baseURL: "https://openrouter.ai/api/v1",
    model: "meta-llama/llama-3.1-70b-instruct:free", // Free model
    systemPrompt: "You are a helpful AI assistant. You can communicate in both Thai and English.",
  },
  TOGETHER: {
    name: "Together AI",
    apiKeyEnv: "TOGETHER_API_KEY",
    baseURL: "https://api.together.xyz/v1",
    model: "meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo",
    systemPrompt: "You are a helpful AI assistant. You can communicate in both Thai and English.",
  },
};

// Default provider (can be changed via env variable)
export const DEFAULT_PROVIDER = process.env.AI_PROVIDER || "GLM";

// Get active provider configuration
export function getActiveProvider() {
  const providerKey = DEFAULT_PROVIDER.toUpperCase();
  const provider = AI_PROVIDERS[providerKey];

  if (!provider) {
    console.warn(`Provider ${providerKey} not found, falling back to GLM`);
    return AI_PROVIDERS.GLM;
  }

  return provider;
}

// Check if provider API key is configured
export function isProviderConfigured(provider) {
  const apiKey = process.env[provider.apiKeyEnv];
  return !!apiKey;
}

// Get all configured providers
export function getConfiguredProviders() {
  return Object.entries(AI_PROVIDERS)
    .filter(([key, provider]) => isProviderConfigured(provider))
    .map(([key, provider]) => ({
      key,
      name: provider.name,
      model: provider.model,
    }));
}
