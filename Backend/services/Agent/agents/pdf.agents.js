import generatePdf from "../utils/generatePdf.js"
import { getFormS3 } from "../utils/getS3Url.js"
import { getModel } from "../utils/model.js"
import { upload } from "../utils/uploadToS3.js"
export const pdfAgent = async (state) => {
    try {
        const llm = await getModel("pdf")
        const prompt = `
        You are an expert docuument writter.
        Return only Valid  json.
        Do Not return markdown.
        Do not return explaintions
        Structured::
    {
        "title": "",
        "subtitle":"",
        "section":[
        {
        "heading":"",
        "point":[],
    }
        ]

    }
        Generate 4-8 sections.
        Each Sections should have 3-6 concise points.
        Topic:
        ${state.prompt}
        `
        const res = await llm.invoke(prompt)
        // console.log(JSON.parse(res.content))
        const data = JSON.parse(res.content)
        const pdfBuffer = await generatePdf(data)
        const fileName = `pdf-${Date.now()}.pdf`
        await upload(fileName, pdfBuffer, "application/pdf")
        const downloadUrl = await getFormS3(fileName, 24 * 60)
        return {
            ...state,
            aiResponse: `# PDF Generated

Your document is ready to download.

[Download PDF](${downloadUrl})

_Link expires in 10 minutes._
`
        }
    } catch (error) {
        console.log(`Server Error During the pdf Agent ${error}`)
    }
}