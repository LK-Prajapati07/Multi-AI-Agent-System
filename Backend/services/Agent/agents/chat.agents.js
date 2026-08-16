import {
  HumanMessage,
  SystemMessage,
} from "@langchain/core/messages";

import { getModel } from "../utils/model.js";

export const chatAgent = async (state) => {
  try {
    console.log("State received:", state);

    const llm = getModel("chat");

    console.log("LLM created successfully");

    const response = await llm.invoke([
      new SystemMessage(`
You are a helpful AI assistant.

Rules:
- Answer clearly and accurately.
- Explain concepts step by step when needed.
- Use examples whenever helpful.
- If you don't know something, say so.
- Format code using markdown.
- Keep answers concise unless the user asks for detail.
      `),

      new HumanMessage({
        content: state.prompt,
      }),
    ]);

    console.log("AI Response:", response.content);

    return {
      aiResponse: response.content,
    };

  } catch (error) {
    console.error("========== CHAT AGENT ERROR ==========");
    console.error("Message:", error.message);
    console.error("Stack:", error.stack);
    console.error("Full Error:", error);
    console.error("======================================");

    return {
      aiResponse: null,
      error: error.message,
    };
  }
};