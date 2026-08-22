import redis from "../../../shared/redis/redis.js";
import { getMessage } from "./getMessage.js";

const MEMORY_TTL = 60 * 60 * 24; // 24 hours
const MAX_MESSAGES = 10;

const getMemoryKey = (conversationId) => {
  return `memory_${conversationId}`;
};

export const getMemory = async (conversationId) => {
  try {
    const key = getMemoryKey(conversationId);

    // 1. Check Redis
    const cached = await redis.get(key);

    if (cached) {
      const messages = JSON.parse(cached);

      if (Array.isArray(messages)) {
        return messages;
      }

      // Corrupted Redis data
      await redis.del(key);
    }

    // 2. Redis miss → fetch from DB / Chat Service
    const messages = await getMessage(conversationId);

    if (!Array.isArray(messages)) {
      throw new Error(
        "getMessage() must return an array"
      );
    }

    // Only keep recent messages
    const recentMessages = messages.slice(-MAX_MESSAGES);

    // 3. Store in Redis
    await redis.set(
      key,
      JSON.stringify(recentMessages),
      "EX",
      MEMORY_TTL
    );

    return recentMessages;

  } catch (err) {
    console.error("getMemory error:", err);
    throw err;
  }
};


export const addMessage = async (
  conversationId,
  role,
  content
) => {
  try {
    // if (!content) {
    //   throw new Error(
    //     "Cannot store empty message content"
    //   );
    // }

    const key = getMemoryKey(conversationId);

    // Get existing memory
    const rawMessage = await redis.get(key);

    let messages = [];

    if (rawMessage) {
      const parsed = JSON.parse(rawMessage);

      if (Array.isArray(parsed)) {
        messages = parsed;
      }
    }

    // Add new message
    messages.push({
      role,
      content,
    });

    // Keep only latest 10 messages
    messages = messages.slice(-MAX_MESSAGES);

    // Save to Redis
    await redis.set(
      key,
      JSON.stringify(messages),
      "EX",
      MEMORY_TTL
    );

    return messages;

  } catch (err) {
    console.error("addMessage error:", err);
    throw err;
  }
};