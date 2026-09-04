
import axios from "axios";
import dotenv from "dotenv";

import graph from "../graph/graph.js";
import { addMessage } from "../utils/memory.js";

dotenv.config();

export const agent = async (req, res) => {
  try {

    const {
      prompt,
      conversationId,
      agent: agentType,
    } = req.body;
    const file=req.file

    if (!prompt) {
      return res.status(400).json({
        success: false,
        message: "Prompt is required",
      });
    }

    if (!conversationId) {
      return res.status(400).json({
        success: false,
        message: "Conversation ID is required",
      });
    }


    await addMessage(
      conversationId,
      "user",
      prompt
    );


    await axios.post(
      `${process.env.CHAT_SERVICE}/save`,
      {
        conversationId,
        role: "user",
        content: prompt,
      }
    );


    console.log("========== GRAPH START ==========");

    const result = await graph.invoke({
      prompt,
      conversationId,
      agent: agentType,
      file
    });

    console.log("========== GRAPH RESULT ==========");
    console.dir(result, { depth: null });
    console.log("==================================");

    // ==========================================
    // 6. AI Response
    // ==========================================

    const response = result?.aiResponse ?? "";

    // ==========================================
    // 7. Artifacts
    // ==========================================

    let artifacts = [];

    if (Array.isArray(result?.artifacts)) {
      artifacts = result.artifacts;
    } else if (result?.artifacts) {
      artifacts = [result.artifacts];
    }

    // ==========================================
    // 8. Images
    // ==========================================

    const images = Array.isArray(result?.images)
      ? result.images
      : [];

    // ==========================================
    // 9. Sources
    // ==========================================

    const sources =
      result?.searchResult?.results ?? [];

    // ==========================================
    // 10. Save assistant message to Redis
    // ==========================================

    await addMessage(
      conversationId,
      "assistant",
      response
    );

    // ==========================================
    // 11. Save assistant message to Chat Service
    // ==========================================

    const assistantPayload = {
      conversationId,
      role: "assistant",
      content: response,
      artifacts,
      images,
    };

    console.log(
      "========== CHAT SERVICE PAYLOAD =========="
    );

    console.dir(
      assistantPayload,
      { depth: null }
    );

    console.log(
      "=========================================="
    );

    try {
      const chatResponse = await axios.post(
        `${process.env.CHAT_SERVICE}/save`,
        assistantPayload
      );

      console.log(
        "CHAT SERVICE RESPONSE:",
        chatResponse.data
      );

    } catch (chatError) {
      console.error(
        "========== CHAT SERVICE ERROR =========="
      );

      console.error(
        "Status:",
        chatError.response?.status
      );

      console.error(
        "Data:",
        chatError.response?.data
      );

      console.error(
        "Message:",
        chatError.message
      );

      console.error(
        "========================================");

      throw chatError;
    }

    // ==========================================
    // 12. Send response to frontend
    // ==========================================

    return res.status(200).json({
      success: true,

      data: response,

      artifacts,

      images,

      sources,

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
      "Status:",
      error.response?.status
    );

    console.error(
      "Response:",
      error.response?.data
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

      data: "",

      message:
        error.response?.data?.message ||
        error.message ||
        "Agent service failed",

      artifacts: [],

      images: [],

      sources: [],
    });
  }
};

