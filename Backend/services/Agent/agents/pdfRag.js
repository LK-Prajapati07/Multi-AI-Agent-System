import fs from 'fs'
import { PDFParse } from 'pdf-parse'
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { vector } from "../config/vector.js"
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { getModel } from '../utils/model.js';

export const pdfRag = async (state) => {
    try {
        const buffer = fs.readFileSync(state.file.path)
        const pdf = new PDFParse({ data: buffer })

        const { text } = await pdf.getText()

        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 200
        })
        const docs = await splitter.createDocuments([text])

        const collectionName = `pdf-${Date.now()}`
        const store = await vector(docs, collectionName)

        const relevantDocs = await store.similaritySearch(state.prompt, 5)
        const context = relevantDocs.map(d => d.pageContent).join("\n\n") // FIXED: was "/n/n"

        const llm = getModel("pdfRag") // FIXED: removed unnecessary await

        const message = [
            new SystemMessage(`
                You are Lalit Prajapati PDF Assistant.
                Rules:
                - Answer Only from the uploaded pdf
                - Never make up information
                - If the answer is not present in the pdf, reply
                  "I couldn't find this information in the uploaded PDF."
                - Use Markdown formatting
            `),
            new HumanMessage(`
                Context: ${context}
                Question: ${state.prompt}
            `)
        ]

        const res = await llm.invoke(message) // FIXED: added missing await — this was the bug

        return {
            ...state,
            aiResponse: res.content
        }

    } catch (error) {
        console.error('pdfRag error:', error)
        return {
            ...state,
            aiResponse: "Failed to analyze Pdf"
        }
    } finally {
        fs.unlinkSync(state.file.path)
    }
}