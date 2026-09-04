import { getModel } from "../utils/model.js";

export const codingAgent = async (state) => {
    try {
        const llm = await getModel("coding");
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

        const validIntents = [
            "Code_Generation",
            "Code_Review",
            "Code_Explain",
            "Debugging",
            "Optimization",
            "Conversation",
            "Documentation",
            "User_Request",
        ];

        if (!validIntents.includes(intent)) {
            throw new Error(
                `Invalid intent returned by LLM: ${intent}`
            );
        }

        if (intent === "Code_Generation") {

            const prompt = `
You are PrabhAI Coding Agent.

Generate the requested project.

Default stack:
- HTML
- CSS
- JavaScript

Use React / Next.js / Vue.js only if explicitly requested.

Rules:
- Responsive
- Modern UI
- CSS variables
- Flexbox/Grid
- Smooth scrolling
- Hover effects
- Beautiful spacing
- Single page unless user asks otherwise

Return ONLY valid JSON.

Required schema:

{
  "files": [
    {
      "name": "index.html",
      "content": "..."
    },
    {
      "name": "style.css",
      "content": "..."
    },
    {
      "name": "script.js",
      "content": "..."
    }
  ]
}

Strict rules:
- Output must start with {
- Output must end with }
- No markdown
- No explanation
- No code fences
- Never mention the intent
- Return valid JSON only

User Request:
${state.prompt}
`;

            console.log("Starting code generation...");

            const startTime = Date.now();

            const res = await llm.invoke(prompt);

            console.log(
                `Code generation completed in ${
                    Date.now() - startTime
                }ms`
            );

            const cleanedResponse = res.content
                .replace(/^```json\s*/i, "")
                .replace(/^```\s*/i, "")
                .replace(/\s*```$/i, "")
                .trim();

            let data;

            try {
                data = JSON.parse(cleanedResponse);
            } catch (parseError) {

                console.error(
                    "Invalid JSON returned by LLM:"
                );

                console.error(cleanedResponse);

                throw new Error(
                    `LLM returned invalid JSON: ${parseError.message}`
                );
            }

            if (
                !data ||
                !Array.isArray(data.files)
            ) {
                throw new Error(
                    "Generated response does not contain a valid files array"
                );
            }

          
            const artifacts = [
                {
                    id: Date.now(),
                    type: "Project",
                    files: data.files,
                    title:state.prompt
                },
            ];

            console.log(
                "Generated Artifacts:",
                artifacts
            );

            return {
                ...state,

                intent,

                aiResponse:
                    "Code generated successfully",

                artifacts,
            };
        }

        // ========================================
        // 3. Other Intents
        // ========================================

        const res = await llm.invoke(`
The user request is:

${state.prompt}

Detected intent:
${intent}

Return markdown only.

Never generate project files.

Use this structure when applicable:

# Overview

## Explanation

## Problem

## Improvement

## Best Practices

## Optimized Code

Only include Optimized Code if needed.

User Request:
${state.prompt}
        `);

        const data = res.content;

        return {
            ...state,

            intent,

            aiResponse: data,

            // No project generated
            artifacts: [],
        };

    } catch (error) {

        console.error(
            "========== CODING AGENT ERROR =========="
        );

        console.error(
            "Message:",
            error.message
        );

        console.error(
            "Stack:",
            error.stack
        );

        console.error(
            "========================================"
        );

        return {
            ...state,

            intent: "Error",

            aiResponse:
                "## Error\n\nSomething went wrong while processing your request.",

            artifacts: [],
        };
    }
};