import { StateGraph } from "@langchain/langgraph";
import { agentState } from "./state.js";
import { routes } from "./routes.js";
import { chatAgent } from "../agents/chat.agents.js";
import { searchAgent } from "../agents/search.agents.js";
import { pdfAgent } from "../agents/pdf.agents.js";
import { codingAgent } from "../agents/coding.agents.js";
import { pptAgent } from "../agents/ppt.agents.js";
import { visionAgent } from "../agents/vision.agent.js";

const workFlow=new StateGraph(agentState)
workFlow.addNode("router",routes)
workFlow.addNode("chat",chatAgent)
workFlow.addNode("search",searchAgent)
workFlow.addNode("pdf",pdfAgent)
workFlow.addNode("coding",codingAgent)
workFlow.addNode("ppt",pptAgent)
workFlow.addNode("vision",visionAgent)

workFlow.addEdge("__start__","router")
workFlow.addConditionalEdges("router",(state)=>{
    switch(state.agent){
        case "chat":
            return "chat"
        case "search":
            return "search"
        case "pdf":
            return "pdf"
        case "coding":
            return "coding"
        case "ppt":
            return "ppt"
        case "vision":
            return "vision"
        default:
            break
    }
},

{
    chat:"chat",
    search:"search",
    coding:"coding",
    pdf:"pdf",
    ppt:"ppt",
    vision:"vision"
})

workFlow.addEdge("search","chat")
workFlow.addEdge("chat","__end__")
workFlow.addEdge("coding","__end__")
workFlow.addEdge("pdf","__end__")
workFlow.addEdge("ppt","__end__")
workFlow.addEdge("vision","__end__")

const graph=workFlow.compile()
export default graph