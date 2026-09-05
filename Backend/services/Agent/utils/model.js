import dotenv from "dotenv";
import OpenAI from "openai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatMistralAI } from "@langchain/mistralai";
import { ChatGroq } from "@langchain/groq";
import { ChatOpenAI } from "@langchain/openai";
import { ChatOpenRouter } from "@langchain/openrouter";

dotenv.config();

// Kimi (Coding)
const codingModel = new OpenAI({
  apiKey: process.env.MOONSHOT_API_KEY,
  baseURL: "https://api.moonshot.ai/v1",
});
const openRouter= new ChatOpenRouter({
  model: "anthropic/claude-sonnet-4.5",
  temperature: 0,
  apiKey:process.env.OPENROUTER_API_KEY

});
// Gemini (Vision)
const visionModel = new ChatGoogleGenerativeAI({
  model: "gemini-3.8-flash",
  temperature: 0.8,
  apiKey: process.env.GOOGLE_API_KEY,
});

// Groq (Chat)
const chatModel = new ChatGroq({
  model: "openai/gpt-oss-120b",
  temperature: 0.7,
  maxRetries: 2,
  apiKey: process.env.GROQ_API_KEY,
});

// Mistral (Search / General)
const searchModel = new ChatMistralAI({
  model: "mistral-large-latest",
  temperature: 0.8,
  apiKey: process.env.MISTRAL_API_KEY,
});
const router = new ChatOpenAI({
  model: "gpt-5.5",
  temperature: 0,
  apiKey: process.env.OPENAI_API_KEY,
});

export function getModel(agent) {
  switch (agent) {
    case "chat":
      return chatModel;

    case "coding":
      return openRouter;

    case "vision":
      return chatModel;

    case "search":
      return searchModel;

    case "pdf":
      return chatModel;

    case "ppt":
      return chatModel;

    case 'router':
      return router
    case 'pdfRag':
      return chatModel
    case "imageAnalyzer":
      return openRouter

    default:
      return searchModel
  }
}
