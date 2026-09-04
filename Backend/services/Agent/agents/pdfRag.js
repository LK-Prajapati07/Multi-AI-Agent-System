import fs from 'fs'
import { PDFParse } from 'pdf-parse'
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
export const pdfRag=(state)=>{
    try {
        const buffer=fs.readFileSync(state.file.path) //pdfpath come now
       const pdf = new PDFParse({ data: buffer }) // ready all pdf buffer change to pdf

        const result=pdf.getText().text//
        const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000, chunkOverlap: 200 })
        

    } catch (error) {
        console.log(error)
    }
}