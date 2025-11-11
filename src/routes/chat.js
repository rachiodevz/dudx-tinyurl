import express from "express";
import GLMChatModel from "../models/chat/glm.model.js";
import GroqChatModel from "../models/chat/groq.model.js";
import OpenRouterChatModel from "../models/chat/openrouter.model.js";
import TogetherChatModel from "../models/chat/together.model.js";

const router = express.Router();

// Available chat models
const CHAT_MODELS = {
  GLM: GLMChatModel,
  GROQ: GroqChatModel,
  OPENROUTER: OpenRouterChatModel,
  TOGETHER: TogetherChatModel,
};

// Cache for initialized models
const modelCache = new Map();

/**
 * Get active chat model instance
 */
function getActiveChatModel() {
  const providerKey = (process.env.AI_PROVIDER || "GLM").toUpperCase();

  // Check if model already cached
  if (modelCache.has(providerKey)) {
    return modelCache.get(providerKey);
  }

  // Get model class
  const ModelClass = CHAT_MODELS[providerKey];

  if (!ModelClass) {
    console.warn(`Provider ${providerKey} not found, falling back to GLM`);
    const fallbackModel = new GLMChatModel();
    modelCache.set("GLM", fallbackModel);
    return fallbackModel;
  }

  // Create and cache model instance
  const model = new ModelClass();
  modelCache.set(providerKey, model);

  return model;
}

/**
 * Get all available models info
 */
function getAllModelsInfo() {
  const models = {};

  for (const [key, ModelClass] of Object.entries(CHAT_MODELS)) {
    const model = new ModelClass();
    models[key] = model.getInfo();
  }

  return models;
}

// Chat API endpoint
router.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Check if user is authenticated
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    // Get active chat model
    const chatModel = getActiveChatModel();

    // Check if model is configured
    if (!chatModel.isConfigured()) {
      const modelInfo = chatModel.getInfo();
      return res.status(500).json({
        error: "AI service not configured",
        reply: `ขออภัยครับ ${modelInfo.name} ยังไม่ได้ตั้งค่า API Key กรุณาติดต่อผู้ดูแลระบบ`,
      });
    }

    // Send message to chat model
    const result = await chatModel.chat(message);

    // Check if successful
    if (!result.success) {
      return res.status(500).json({
        error: result.error,
        reply:
          "ขออภัยครับ เกิดข้อผิดพลาดในการเชื่อมต่อกับ AI กรุณาลองใหม่อีกครั้ง",
      });
    }

    // Return successful response
    res.json({
      reply: result.reply,
      provider: result.provider,
      model: result.model,
    });
  } catch (error) {
    console.error("Chat API error:", error);

    res.status(500).json({
      error: "Internal server error",
      reply: "ขออภัยครับ เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง",
    });
  }
});

// Get available AI providers (for admin/debugging)
router.get("/api/chat/providers", (req, res) => {
  // Check if user is authenticated
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const activeProvider = process.env.AI_PROVIDER || "GLM";
  const allModels = getAllModelsInfo();
  const activeModel = getActiveChatModel();

  res.json({
    active: {
      key: activeProvider,
      ...activeModel.getInfo(),
    },
    available: allModels,
  });
});

export default router;
