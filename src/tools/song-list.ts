import { generateText } from "ai";
import { SONGS_LIST_PROMPTS } from "../constants/prompts/songs-list.js";
import { openai } from "@ai-sdk/openai";

type GetSongsListParams = {
    extractedText: string;
}

export const getSongsList = async (props: GetSongsListParams) => {
    const promptText = SONGS_LIST_PROMPTS;

    try {
        const response = await generateText({
            model: openai('gpt-4o'),
            messages: [
                {
                    role: 'user',
                    content: [
                        { type: 'text', text: promptText + "\n\nContent to analyze:\n" + props.extractedText },
                    ],
                },
            ],
        });

        // Parse the JSON response
        const jsonMatch = response.text.match(/\[[\s\S]*\]/);
        if (!jsonMatch) {
            throw new Error('No JSON array found in response');
        }

        const songsArray = JSON.parse(jsonMatch[0]);
        
        // Validate structure
        if (!Array.isArray(songsArray)) {
            throw new Error('Response is not an array');
        }

        return songsArray; // Return parsed array, not raw text
    } catch (error) {
        console.error('Error in getSongsList:', error);
        return null;
    }
}