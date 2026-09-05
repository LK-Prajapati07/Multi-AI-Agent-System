import { embeddings } from "./embedding.model.js";
import dotenv from 'dotenv';
import { QdrantVectorStore } from "@langchain/qdrant";
dotenv.config();

export const vector = async (docs, collectionName) => {
    try {
        return await QdrantVectorStore.fromDocuments(docs, embeddings, {
            url: process.env.QDRANT_URL,
            collectionName: collectionName,
            apiKey: process.env.QDRANT_API_KEY,
        });
    } catch (error) {
        console.log(error || "error occurred during the connection of Vector DB");
        throw error; // important — see note below
    }
};