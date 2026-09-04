import { embeddings } from "./embedding.model.js";
import dotenv from 'dotenv'
dotenv.config()

export const vector = async (docs, collectionName) => {
    try {
        return await QdrantVectorStore.fromExistingCollection(docs, embeddings, {
            url: process.env.QDRANT_URL,
            collectionName: collectionName,
        });
    } catch (error) {
        console.log(error || "error occure during the connection of Vector DB")
    }
}