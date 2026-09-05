import axios from "axios";
import dotenv from "dotenv";
import fs from "fs";

import graph from "../graph/graph.js";
import { addMessage } from "../utils/memory.js";

dotenv.config();

export const agent = async (req, res) => {
  const file = req.file;

  try {
    const { prompt, conversationId, agent: agentType } = req.body;

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

    // Guard against empty/corrupted uploads before they hit the graph
    if (file && file.size === 0) {
      // Clean up the empty file immediately
      fs.unlink(file.path, () => {});
      return res.status(400).json({
        success: false,
        message: "Uploaded file is empty. Please try uploading again.",
      });
    }

    await addMessage(conversationId, "user", prompt);

    await axios.post(`${process.env.CHAT_SERVICE}/save`, {
      conversationId,
      role: "user",
      content: prompt,
    });

    const result = await graph.invoke({
      prompt,
      conversationId,
      agent: agentType,
      file,
    });

    const response = result?.aiResponse ?? "";

    let artifacts = [];
    if (Array.isArray(result?.artifacts)) {
      artifacts = result.artifacts;
    } else if (result?.artifacts) {
      artifacts = [result.artifacts];
    }

    const images = Array.isArray(result?.images) ? result.images : [];

    const sources = result?.searchResult?.results ?? [];

    await addMessage(conversationId, "assistant", response);

    const assistantPayload = {
      conversationId,
      role: "assistant",
      content: response,
      artifacts,
      images,
    };

    try {
      await axios.post(`${process.env.CHAT_SERVICE}/save`, assistantPayload);
    } catch (chatError) {
      console.error("========== CHAT SERVICE ERROR ==========");
      console.error("Status:", chatError.response?.status);
      console.error("Data:", chatError.response?.data);
      console.error("Message:", chatError.message);
      console.error("=========================================");
      throw chatError;
    }

    return res.status(200).json({
      success: true,
      data: response,
      artifacts,
      images,
      sources,
      message: "Agent Service working now",
    });

  } catch (error) {
    // If the graph threw before pdfRag's own finally block could run,
    // the temp file may be left behind on disk — clean it up here.
    if (file?.path) {
      fs.unlink(file.path, () => {});
    }

    console.error("========== AGENT ERROR ==========");
    console.error("Message:", error.message);
    console.error("Status:", error.response?.status);
    console.error("Response:", error.response?.data);
    console.error("Stack:", error.stack);
    console.error("=================================");

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