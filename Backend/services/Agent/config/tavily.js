import { TavilySearch } from "@langchain/tavily";
import dotenv from 'dotenv'
dotenv.config()
export const tool = new TavilySearch({
  maxResults: 5,
  topic: "general",
  incl:true
});