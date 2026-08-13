import { Annotation } from "@langchain/langgraph";

export const agentState = Annotation.Root({
  prompt: Annotation({
    default: () => "",
  }),
  aiResponse: Annotation({
    default: () => "",
  }),
  agent:Annotation({
    default:()=>""
  }),
  conversationId:Annotation()
});