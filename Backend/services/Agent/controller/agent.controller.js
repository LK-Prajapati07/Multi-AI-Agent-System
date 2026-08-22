import axios from "axios";
import dotenv from "dotenv";

import graph from "../graph/graph.js";
import { addMessage } from "../utils/memory.js";

dotenv.config();

export const agent = async (req, res) => {
  try {
    const { prompt, conversationId, agent } = req.body;

    // Validate request
    if (!prompt?.trim() || !conversationId) {
      return res.status(400).json({
        success: false,
        message: "prompt and conversationId are required",
      });
    }

    // 1. Add user message to Redis memory
    await addMessage(conversationId, "user", prompt);

    // 2. Persist user message
    await axios.post(`${process.env.CHAT_SERVICE}/save`, {
      conversationId,
      role: "user",
      content: prompt,
    });

    // 3. Run AI agent
    const result = await graph.invoke({
      prompt,
      conversationId,
      agent,
    });

    console.log("Graph result:", result);

    // 4. Validate AI response
    // if (!result?.aiResponse) {
    //   throw new Error(result?.error || "AI response is empty");
    // }

    const response = result.aiResponse;

    // 5. Add AI response to Redis
    await addMessage(conversationId, "assistant", response);

    // 6. Persist AI response
    await axios.post(`${process.env.CHAT_SERVICE}/save`, {
      conversationId,
      role: "assistant",
      content: response,
    });

    // 7. Send response
    return res.status(200).json({
      success: true,
      data: response,
      images: result.images ?? [],
      sources: result.searchResult?.results ?? [],
      message: "Agent Service working now",
    });
  } catch (error) {
    console.error("========== AGENT ERROR ==========");
    console.error("Message:", error.message);
    console.error("Stack:", error.stack);
    console.error("=================================");

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
