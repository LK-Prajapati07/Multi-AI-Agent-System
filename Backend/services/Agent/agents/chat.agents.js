import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { getModel } from "../utils/model.js";

export const chatAgent = async (state) => {
  try {
    const llm = getModel("chat");

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
      new HumanMessage(state.message),
    ]);

    return {
      ...state,
      response: response.content,
    };
  } catch (error) {
    console.error("Chat Agent Error:", error);

    return {
      ...state,
      response: "Something went wrong while generating the response.",
    };
  }
};