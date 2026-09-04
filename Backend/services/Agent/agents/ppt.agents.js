import { getModel } from "../utils/model.js";

export const pptAgent = async (state) => {
  try {
    const llm = await getModel("ppt");
    const prompt = `
You are an expert presentation writer.
Return only valid JSON.
Do not return markdown.
Do not return explanations.

Structure:
{
    "title": "",
    "subtitle": "",
    "slides": [
        {
            "heading": "",
            "point": []
        }
    ]
}

Generate 6 slides.
Each slide should have 3-5 concise points.
Each point should be a short phrase, not a full sentence.
The first slide should act as an agenda/overview of the topic.
The last slide should be a summary or key takeaways slide.
Topic:
${state.prompt}
`;
const res=await llm.invoke(prompt)
    console.log(res.content)
  } catch (error) {
    console.log(`Server Error During the pdf Agent ${error}`);
  }
};
