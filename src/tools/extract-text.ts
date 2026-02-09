import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { EXTRACT_PHOTO_PROMPTS } from "../constants/prompts/extract-photo.js";

type GetExtractedTextParams = {
    fileUrl: string;
    message: string;
}

export const getExtractedText = async (props: GetExtractedTextParams) => {
    const promptText = EXTRACT_PHOTO_PROMPTS;
    try {
        const response = await generateText({
            model: openai('gpt-5-nano-2025-08-07'),
            messages: [
                {
                    role: 'user',
                    content: [
                        { type: 'text', text: promptText + " " + props.message },
                        {
                            type: 'image',
                            image: props.fileUrl || "", // Use URL directly
                        },
                    ],
                },
            ],
        });
        return response.text;
    } catch (error) {
        console.log(error);
        return null;
    }
}