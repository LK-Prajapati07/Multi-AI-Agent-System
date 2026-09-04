import { MistralAIEmbeddings } from "@langchain/mistralai";

export const embeddings = new MistralAIEmbeddings({
  model: "mistral-embed",
  apiKey:process.env.MISTRAL_API_KEY
});
import dotenv from 'dotenv'
dotenv.config()