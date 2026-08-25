import axios from "axios";
import dotenv from "dotenv";

import graph from "../graph/graph.js";
import { addMessage } from "../utils/memory.js";

dotenv.config();

export const agent = async (req, res) => {
  try {
    // ==========================================
    // 1. Request data
    // ==========================================

    const {
      prompt,
      conversationId,
      agent: agentType,
    } = req.body;

    // ==========================================
    // 2. Validate request
    // ==========================================

    if (!prompt?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Prompt is required",
      });
    }

    if (!conversationId) {
      return res.status(400).json({
        success: false,
        message: "ConversationId is required",
      });
    }

    // ==========================================
    // 3. Save user message to Redis
    // ==========================================

    await addMessage(
      conversationId,
      "user",
      prompt
    );

    // ==========================================
    // 4. Save user message to Chat Service
    // ==========================================

    await axios.post(
      `${process.env.CHAT_SERVICE}/save`,
      {
        conversationId,
        role: "user",
        content: prompt,
      }
    );

    // ==========================================
    // 5. Run LangGraph
    // ==========================================

    console.log("========== GRAPH START ==========");

    const result = await graph.invoke({
      prompt,
      conversationId,
      agent: agentType,
    });

    console.log("========== GRAPH RESULT ==========");
    console.log("Intent:", result?.intent);
    console.log("AI Response:", result?.aiResponse);
    console.log("Artifacts:", result?.artifacts);
    console.log("Images:", result?.images);
    console.log("==================================");

    // ==========================================
    // 6. Validate AI response
    // ==========================================

    if (!result?.aiResponse) {
      throw new Error(
        result?.error || "AI response is empty"
      );
    }

    const response = result.aiResponse;

    // ==========================================
    // 7. Normalize artifacts
    // ==========================================

    const artifacts = Array.isArray(result?.artifacts)
      ? result.artifacts
      : [];

    // ==========================================
    // 8. Normalize images
    // ==========================================

    const images = Array.isArray(result?.images)
      ? result.images
      : [];

    // ==========================================
    // 9. Save AI response to Redis
    // ==========================================

    await addMessage(
      conversationId,
      "assistant",
      response
    );

    // ==========================================
    // 10. Save AI response to Chat Service
    // ==========================================

    await axios.post(
      `${process.env.CHAT_SERVICE}/save`,
      {
        conversationId,
        role: "assistant",
        content: response,
        artifacts,
        images,
      }
    );

    // ==========================================
    // 11. Send response to frontend
    // ==========================================

    return res.status(200).json({
      success: true,

      data: response,

      artifacts,

      images,

      sources:
        result?.searchResult?.results ?? [],

      message: "Agent Service working now",
    });

  } catch (error) {

    console.error(
      "========== AGENT ERROR =========="
    );

    console.error(
      "Message:",
      error.message
    );

    console.error(
      "Stack:",
      error.stack
    );

    console.error(
      "================================="
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Agent service failed",

      artifacts: [],
      images: [],
    });
  }
};