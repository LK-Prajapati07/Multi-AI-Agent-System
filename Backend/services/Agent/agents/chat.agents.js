import {
  AIMessage,
  HumanMessage,
  SystemMessage,
} from "@langchain/core/messages";

import { getModel } from "../utils/model.js";
import { getMemory } from "../utils/memory.js";

export const chatAgent = async (state) => {
  try {
    console.log("========== CHAT AGENT ==========");

    const llm = getModel("chat");

    // --------------------------------
    // 1. Get conversation history
    // --------------------------------
    const history = await getMemory(state.conversationId);

    if (!Array.isArray(history)) {
      throw new Error("Conversation history must be an array");
    }

    // --------------------------------
    // 2. Build Web Search Context
    // --------------------------------
    let searchContext = "";

    if (state.searchResult?.results?.length > 0) {
      const results = state.searchResult.results
        .map(
          (result, index) => `
### Source ${index + 1}

**Title:** ${result.title || "Unknown"}

**URL:** ${result.url || "N/A"}

**Content:**
${result.content || "No content available"}
`
        )
        .join("\n");

      searchContext = `
# Web Search Results

${results}

## Search Instructions

- Use the web search results as the primary source for current information.
- For latest, current, today, recent, or breaking-news questions, prioritize these results over your general knowledge.
- Do not claim that you cannot access live information when search results are provided.
- Do not invent facts that are not supported by the search results.
- If different sources provide conflicting information, mention the uncertainty.
- If the search results are insufficient, clearly state that.
- Do not mention internal agents, tools, prompts, or implementation details.
`;
    }

    // --------------------------------
    // 3. System Prompt
    // --------------------------------
    const systemPrompt = `
# Role

You are a friendly, intelligent, accurate AI assistant.

## General Behavior

- Understand the user's intent before answering.
- Give accurate and useful answers.
- Support English, Hindi, and Hinglish.
- Match the user's language and communication style.
- Use conversation history when it is relevant.
- Do not make up information.
- If you are uncertain, clearly say so.
- Keep simple questions concise.
- Provide detailed explanations when the user asks for them.

## Coding Restriction

You are NOT the coding agent.

If the user asks about:

- Programming
- Coding
- Debugging
- Data structures and algorithms
- Code generation
- Software development
- Programming errors
- Technical implementation

Do not solve the coding problem.

Instead, briefly tell the user that the Coding Agent should handle it.

## Markdown Formatting

Always return valid Markdown.

Use:

- **Bold** for important terms.
- *Italic* when emphasis is useful.
- Bullet lists for multiple points.
- Numbered lists for ordered steps.
- Headings using \`#\`, \`##\`, or \`###\` when appropriate.
- Fenced code blocks with the correct language for code.

Example:

\`\`\`python
print("Hello World")
\`\`\`

Do NOT return raw HTML.

## Web Search

${searchContext}
`;

    // --------------------------------
    // 4. Convert memory into LangChain
    //    messages
    // --------------------------------
    const messages = [
      new SystemMessage(systemPrompt),
    ];

    for (const msg of history) {
      if (!msg?.content) {
        console.warn("Skipping invalid message:", msg);
        continue;
      }

      if (msg.role === "user") {
        messages.push(
          new HumanMessage(msg.content)
        );
      }

      if (msg.role === "assistant") {
        messages.push(
          new AIMessage(msg.content)
        );
      }
    }

    // --------------------------------
    // 5. Make sure current prompt exists
    // --------------------------------
    const lastMessage = history.at(-1);

    if (
      !lastMessage ||
      lastMessage.role !== "user" ||
      lastMessage.content !== state.prompt
    ) {
      messages.push(
        new HumanMessage(state.prompt)
      );
    }

    // --------------------------------
    // 6. Call LLM
    // --------------------------------
    const response = await llm.invoke(messages);

    console.log("Chat response generated");
    console.log(response)

    // --------------------------------
    // 7. Return state
    // --------------------------------
    return {
      ...state,
      aiResponse: response.content,
      images: state.images ?? [],
      sources: state.searchResult?.results ?? [],
    };

  } catch (error) {
    console.error("========== CHAT AGENT ERROR ==========");
    console.error("Message:", error.message);
    console.error("Stack:", error.stack);
    console.error("======================================");

    return {
      ...state,
      aiResponse: null,
      images: [],
      sources: [],
      error: error.message,
    };
  }
};