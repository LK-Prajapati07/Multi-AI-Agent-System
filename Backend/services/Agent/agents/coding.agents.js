import { getModel } from "../utils/model.js"; 
 
export const codingAgent = async (state) => { 
    try { 
        const llm = await getModel("coding"); 
 
        // Intent Classification 
        const intentRes = await llm.invoke(` 
You are an intent classifier. 
 
Classify the user's request into exactly ONE of these categories: 
 
Code_Generation 
Code_Review 
Code_Explain 
Debugging 
Optimization 
Conversation 
Documentation 
User_Request 
 
Return ONLY the category name. 
Do not return markdown. 
Do not explain your answer. 
 
User Request: 
${state.prompt} 
        `); 
 
        const intent = intentRes.content.trim(); 
 
        console.log("Detected Intent:", intent); 
 
        // Code Generation 
       if(intent=="Code_Generation"){ 
        const prompt=` 
        You are PrabhAI Coding Agent 
        Generate the requested project. 
        Default stack: 
        -HTML 
        -CSS 
        -JavaScript 
         User React / Next.js /Vue.js only if explicity requested. 
         Rules: 
 
         -Responsive  
         -Modern UI 
         -CSS variable 
         -Flex/Gride 
         -Smooth scroll 
         -Hover Effect 
         -Beautiful spacing 
         -Single page unless user ask otherwise 
         Return Only valid JSON 
         Schema:{ 
            "files":[ 
            { 
            "name":"Index.html" 
                "content":"..." 
 
            }, 
              { 
            "name":"Index.css" 
                "content":"..." 
 
            }, 
              { 
            "name":"Index.js" 
                "content":"..." 
 
            }, 
 
            ] 
         } 
        Rules: 
        -output must start with { 
        -output must end with 
         
        } 
        -no markdown  
        -no explaination 
        -no \'\'\\ 
        -never mention intent 
        User Request: 
        ${state.prompt} 
        ` 
        const res=await llm.invoke(prompt)

        const cleanedResponse = res.content
            .replace(/^```json\s*/i, "")
            .replace(/^```\s*/i, "")
            .replace(/\s*```$/i, "")
            .trim();

        console.log(JSON.parse(cleanedResponse));
       } 
 
         
    } catch (error) { 
        console.error("Coding Agent Error:", error); 
 
        return { 
            intent: "Error", 
            response: "## Error\n\nSomething went wrong while processing your request." 
        }; 
    } 
};