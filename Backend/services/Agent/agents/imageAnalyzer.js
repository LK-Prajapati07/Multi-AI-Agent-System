import { getModel } from "../utils/model.js"
import { SystemMessage, HumanMessage } from "@langchain/core/messages"
import fs from 'fs/promises'

export const imageAnalyzer = async (state) => {
  try {
    const llm = await getModel("imageAnalyzer")
    const imageBuffer = await fs.readFile(state.file.path)
    const base64Image = imageBuffer.toString("base64")

    const messages = [
      new SystemMessage(
        `You are Lalit Prajapati AI System
        Rules:
        - Analyze only the uploaded image.
        - Answer the user's question accurately.
        - If text exists in the image, extract it.
        - If something is unclear, say so.
        - If charts or tables exist, explain them.
        - Use markdown when helpful.
        - Do not hallucinate.`
      ),
      new HumanMessage({
        content: [
          {
            type: "text",
            text: state.prompt || "Analyze the image"
          },
          {
            type: "image_url",
            image_url: {
              url: `data:${state.file.mimetype};base64,${base64Image}`
            }
          }
        ]
      })
    ]

    const res = await llm.invoke(messages)

    return {
      ...state,
      aiResponce: res.content
    }
  } catch (error) {
    console.error(error)
    return {
      ...state,
      aiResponce: null,
      error: error.message
    }
  } finally {
    try {
      await fs.unlink(state.file.path)
    } catch (unlinkErr) {
      console.error("Failed to delete temp file:", unlinkErr)
    }
  }
}