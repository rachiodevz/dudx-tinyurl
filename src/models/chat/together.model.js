import OpenAI from "openai";

/**
 * Together AI Chat Model
 * Provider: Together AI (https://together.ai) - Free tier available
 */
class TogetherChatModel {
  constructor() {
    this.client = null;
    this.config = {
      name: "Together AI",
      apiKeyEnv: "TOGETHER_API_KEY",
      baseURL: "https://api.together.xyz/v1",
      model: "meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo",
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

      // Call Together AI API
      const completion = await this.client.chat.completions.create({
        model: this.config.model,
        messages: messages,
        max_tokens: 1024,
        temperature: 0.7,
      });

      // Extract response
      const reply = completion.choices?.[0]?.message?.content;

      if (!reply) {
        throw new Error("No response from Together AI");
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

export default TogetherChatModel;
