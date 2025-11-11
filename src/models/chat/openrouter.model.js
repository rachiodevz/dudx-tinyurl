import OpenAI from "openai";

/**
 * OpenRouter Chat Model
 * Provider: OpenRouter (https://openrouter.ai) - Access to multiple models
 */
class OpenRouterChatModel {
  constructor() {
    this.client = null;
    this.config = {
      name: "OpenRouter",
      apiKeyEnv: "OPENROUTER_API_KEY",
      baseURL: "https://openrouter.ai/api/v1",
      model: "meta-llama/llama-3.1-70b-instruct:free", // Free model
      systemPrompt:
        "You are a helpful AI assistant. You can communicate in both Thai and English.",
    };
  }

  /**
   * Initialize the client
   */
  init() {
    const apiKey = process.env[this.config.apiKeyEnv];

    if (!apiKey) {
      throw new Error(
        `${this.config.name} API key not configured (${this.config.apiKeyEnv})`,
      );
    }

    this.client = new OpenAI({
      apiKey: apiKey,
      baseURL: this.config.baseURL,
      defaultHeaders: {
        "HTTP-Referer": process.env.BASE_URL || "http://localhost:8080",
        "X-Title": "TinyURL Chat",
      },
    });

    return this;
  }

  /**
   * Check if the model is configured
   */
  isConfigured() {
    return !!process.env[this.config.apiKeyEnv];
  }

  /**
   * Send a chat message and get response
   * @param {string} message - User message
   * @param {Array} history - Optional chat history
   * @returns {Promise<Object>} - Response object
   */
  async chat(message, history = []) {
    if (!this.client) {
      this.init();
    }

    try {
      // Build messages array
      const messages = [
        {
          role: "system",
          content: this.config.systemPrompt,
        },
        ...history,
        {
          role: "user",
          content: message,
        },
      ];

      // Call OpenRouter API
      const completion = await this.client.chat.completions.create({
        model: this.config.model,
        messages: messages,
      });

      // Extract response
      const reply = completion.choices?.[0]?.message?.content;

      if (!reply) {
        throw new Error("No response from OpenRouter");
      }

      return {
        success: true,
        reply: reply,
        provider: this.config.name,
        model: this.config.model,
      };
    } catch (error) {
      console.error(`${this.config.name} error:`, error);

      return {
        success: false,
        error: error.message,
        provider: this.config.name,
      };
    }
  }

  /**
   * Get model information
   */
  getInfo() {
    return {
      name: this.config.name,
      model: this.config.model,
      configured: this.isConfigured(),
    };
  }
}

export default OpenRouterChatModel;
