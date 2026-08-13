import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { getModel } from "../utils/model.js";

export const routes = async (state) => {
  try {
    const llm = getModel("router");

    const prompt = `
You are an AI Router.

Your job is to select ONLY ONE agent based on the user's request.

Available agents:

1. chat
- General conversation
- Greetings
- Explanations
- Learning concepts
- Question answering
- Brainstorming

2. search
- Latest news
- Current events
- Real-time information
- Internet search
- Facts that may have changed recently

3. coding
- Programming
- Debugging
- Code generation
- Algorithms
- DSA
- React
- Node.js
- Python
- Java
- JavaScript
- API development
- System design

4. pdf
- PDF summarization
- PDF question answering
- Document analysis
- Resume analysis
- Research paper analysis

5. image
- Image analysis
- OCR
- Object detection
- Face detection
- Image description
- Vision tasks

Rules:
- Return ONLY one word.
- Do not explain.
- Do not use punctuation.
- Valid outputs are:
chat
search
coding
pdf
image
`;

    const response = await llm.invoke([
      new SystemMessage(prompt),
      new HumanMessage(state.message),
    ]);

    return {
      ...state,
      agent: response.content.trim().toLowerCase(),
    };
  } catch (error) {
    console.error("Router Error:", error);

    return {
      ...state,
      agent: "chat",
    };
  }
};