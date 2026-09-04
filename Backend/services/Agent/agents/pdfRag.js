import fs, { stat } from 'fs'
import { PDFParse } from 'pdf-parse'
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { vector } from "../config/vector.js"
import { HumanMessage, SystemMessage } from '@langchain/core/messages';

export const pdfRag = async (state) => {
    try {
        const buffer = fs.readFileSync(state.file.path)
        const pdf = new PDFParse({ data: buffer })

        const { text } = await pdf.getText() // must await

        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 200
        })
        const docs = await splitter.createDocuments([text])

        const collectionName = `pdf-${Date.now()}`
        const store = await vector(docs, collectionName)

        const relevantDocs = await store.similaritySearch(state.prompt, 5)
        const context=relevantDocs.map(d=>d.pageContent).join("/n/n")
        const llm=await getModel("pdfRag")
        const message=[
            new SystemMessage(`
                You are Lalit Prajapati PDF Assistant.
    Rules:
                -Answer Only from the uploaded pdf
                -Never make up information
                -if the answer is not present in the pdf ,reply 
                "I couldn't  find this infomation in the uploaded PDF."
                -Use Markdown formatting

                
                `),
            new HumanMessage(`
                Context :${context}
                Question:${state.prompt}
                `)
        ]
       const res= llm.invoke(message)
       return {
        ...state,
        aiResponse:res.content
       }

    } catch (error) {
        console.error('pdfRag error:', error)
        return {
        ...state,
        aiResponse:"Failed to analyze Pdf"
       }
       
    }finally{
        fs.unlinkSync(state.file.path)
    }
}