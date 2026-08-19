import dotenv from "dotenv";
import OpenAI from "openai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatMistralAI } from "@langchain/mistralai";
import { ChatGroq } from "@langchain/groq";
import { ChatOpenAI } from "@langchain/openai";

dotenv.config();

// Kimi (Coding)
const codingModel = new OpenAI({
  apiKey: process.env.MOONSHOT_API_KEY,
  baseURL: "https://api.moonshot.ai/v1",
});

// Gemini (Vision)
const visionModel = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-pro",
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
      return codingModel;

    case "vision":
      return visionModel;

    case "search":
      return searchModel;

    case "pdf":
      return searchModel;

    case "ppt":
      return searchModel;
    case 'router':
      return router

    default:
      throw new Error(`Unknown agent: ${agent}`);
  }
}
