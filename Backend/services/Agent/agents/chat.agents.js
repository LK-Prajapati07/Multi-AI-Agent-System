import {
  AIMessage,
  HumanMessage,
  SystemMessage,
} from "@langchain/core/messages";

import { getModel } from "../utils/model.js";
import { getMemory } from "../utils/memory.js";

export const chatAgent = async (state) => {
  try {
    const llm = getModel("chat");

    const history = await getMemory(state.conversationId);

    if (!Array.isArray(history)) {
      throw new Error(
        "Conversation history must be an array"
      );
    }

    const systemPrompt = `
You are a helpful AI assistant.

Response rules:
- Always return your response in valid Markdown.
- Use headings with #, ##, ### when appropriate.
- Use **bold** for important terms.
- Use bullet points or numbered lists when useful.
- Use Markdown code blocks for code.
- Use inline code with backticks for variables, functions, commands, etc.
- Use tables when comparing multiple items.
- Use blockquotes when quoting something.
- Do not return raw HTML.
- Keep the response concise unless the user asks for detail.
- Explain concepts step by step when necessary.
- Give examples when helpful.
- If you don't know something, clearly say so.
`;

    const messages = [
      new SystemMessage(systemPrompt),
    ];

   history.forEach((msg) => {
  // Ignore invalid messages
  if (!msg || !msg.content) {
    console.warn("Skipping invalid message:", msg);
    return;
  }

  if (msg.role === "user") {
    messages.push(
      new HumanMessage(msg.content)
    );
  } else if (msg.role === "assistant") {
    messages.push(
      new AIMessage(msg.content)
    );
  }
});

   

    const response = await llm.invoke(messages);

   

    return {
      aiResponse: response.content,
    };

  } catch (error) {
    console.error("========== CHAT AGENT ERROR ==========");
    console.error("Message:", error.message);
    console.error("Stack:", error.stack);

    return {
      aiResponse: null,
      error: error.message,
    };
  }
};