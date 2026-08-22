import { tool } from "../config/tavily.js"

export const searchAgent=async(state)=>{
    try {
        const result=await tool.invoke({
            query:state.prompt
        })
        console.log("Dugging of code")
        console.log(result.results[0].url)
        return {
            ...state,
            searchResult:result,
            images:result[0].url
        }
    } catch (error) {
        console.log(`Server Error During the pdf Agent ${error}`)
    }
}