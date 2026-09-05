import axios from "axios";
import { getModel } from "../utils/model.js";
import { upload } from "../utils/uploadToS3.js";
import { getFormS3 } from "../utils/getS3Url.js";

export const visionAgent = async (state) => {
    try {
        // Get vision model
        const llm = await getModel("vision");

        // Generate detailed image prompt
        const res = await llm.invoke(`
You are an elite image prompt engineer.

Convert the user's request into a highly detailed image generation prompt.

Requirements:
- Cinematic lighting
- Professional composition
- Ultra realistic
- High details
- Beautiful color palette
- Sharp focus
- 8K quality
- Photorealistic
- Depth of field
- Professional photography
- Stunning visuals

Return ONLY the image generation prompt.

User Request:
${state.prompt}
        `);

        const prompt = res.content.trim();

        // console.log("Generated Image Prompt:", prompt);

        // Generate image using Pollinations
        const imageUrl =
            `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`;

        const imgRes = await axios.get(imageUrl, {
            responseType: "arraybuffer",
            timeout: 120000,
        });

    
        const buffer = Buffer.from(imgRes.data);

    
        const filename = `${Date.now()}.png`;

        // Upload image to S3
        await upload(
            filename,
            buffer,
            "image/png"
        );

     

        // Generate presigned URL
        // 24 hours = 86400 seconds
        const expiresIn = 24*60;

        const downloadUrl = await getFormS3(
            filename,
            expiresIn
        );

      
        // Return state
        return {
            ...state,

            aiResponse: "Image Generated Successfully",
            // images:downloadUrl

            artifacts: {
                type: "image",
                url: downloadUrl,
                filename: filename,
                prompt: prompt,
                expiresIn: expiresIn,
            },
        };

    } catch (error) {
        console.error(
            "Error occurred during image generation:",
            error.response?.data || error.message
        );

        return {
            ...state,
            aiResponse: "Failed to generate image.",
            artifacts: null,
            error: error.message,
        };
    }
};