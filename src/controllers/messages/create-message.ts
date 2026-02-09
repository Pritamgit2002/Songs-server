import { openai } from '@ai-sdk/openai';
import { Request, response, Response } from "express";
import { z } from "zod";
import { Message } from "../../models/message.js";
import { postToAws } from "../../utils/aws/post-aws.js";
import { generateText, tool, stepCountIs } from "ai";
import { getExtractedText } from "../../tools/extract-text.js";
import { getSongsList } from "../../tools/song-list.js";
import { CHAT_PROMPTS } from '../../constants/prompts/index.js';

export const createMessage = async (req: Request, res: Response) => {
    try {
        const { message, file } = z_create_message_body.parse(req.body);
        const conversationId = z_create_message_params.parse(req.params).conversationId;

        console.log("Conversation ID", conversationId)
        console.log("Message", message)
        console.log("File", file)

        let fileUrl: string | null = null;

        if (file) {
            const base64Data = file.data.replace(/^data:.*?;base64,/, '');
            const fileBuffer = Buffer.from(base64Data, 'base64');

            const uploadResult = await postToAws({
                fileBuffer,
                fileName: file.fileName || `${Date.now()}-${conversationId}`,
                contentType: file.mimeType || 'application/octet-stream',
            });

            fileUrl = uploadResult.url;
        }

        console.log("File URL", fileUrl)

        // Save user message
        const userMessage = await Message.create({
            conversationId,
            role: 'user',
            content: message || "",
            file_url: fileUrl,
        });

        const tools = {
            getExtractedText: tool({
                description: 'Analyzes an image to extract detailed visual, emotional, and contextual information for music matching. Use this when an image needs to be analyzed.',
                inputSchema: z.object({
                    message: z.string().describe('User message or context about the image'),
                    fileUrl: z.string().describe('The S3 URL of the image to analyze'),
                }),
                execute: async ({ message, fileUrl }: { message: string; fileUrl: string }) => {
                    const extractedText = await getExtractedText({ fileUrl, message });
                    return extractedText;
                },
            }),
            getSongsList: tool({
                description: 'Generates song recommendations. Returns JSON array of songs.',
                inputSchema: z.object({
                    extractedText: z.string().describe('Detailed extracted text from image to get proper song recommendations'),
                }),
                execute: async ({ extractedText }: { extractedText: string }) => {
                    const songs = await getSongsList({ extractedText });
                    return JSON.stringify(songs);
                },
            }),
        }

        // Run the model with auto tool choice
        const result = await generateText({
            model: openai('gpt-5-mini-2025-08-07'),
            system: CHAT_PROMPTS,
            tools: tools,
            toolChoice: 'auto',
            stopWhen: stepCountIs(5),
            messages: [
                {
                    role: 'user',
                    content: [
                        {
                            type: 'text',
                            text: `${message}${fileUrl ? `\n\nImage URL available: ${fileUrl}` : ''}`
                        },
                    ],
                },
            ],
        });

         // Log detailed reasoning and tool calls
         console.log("=== Full Result ===");
         console.log(JSON.stringify(result, null, 2));
 
         console.log("\n=== Steps & Reasoning ===");
         result.steps?.forEach((step, index) => {
             console.log(`\nStep ${index + 1}:`);
             console.log("Text:", step.text);
             console.log("Tool Calls:", step.toolCalls);
             console.log("Tool Results:", step.toolResults.map(result => result.output));
         });
 
         console.log("\n=== Tool Results Summary ===");
         result.toolResults?.forEach((toolResult, index) => {
             console.log(`\nTool Result ${index + 1}:`);
             console.log("Tool Name:", toolResult.toolName);
             console.log("Args:", toolResult.input);
             console.log("Result:", toolResult.output);
         });

         const songsMatch = result.text.match(/\[[\s\S]*\]/);
         const songs = songsMatch ? JSON.parse(songsMatch[0]) : null;

            await Message.create({
                conversationId,
                role: 'assistant',
                content: result.text,
                songs: songs,
            });
        

        return res.status(201).json({
            message: 'Messages created successfully',
            data: {
                userMessage,
                songs: songs || [],
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: 'Internal server error',
            message: error,
        });
    }
};

const z_create_message_body = z.object({
    message: z.string(),
    file: z.object({
        data: z.string(),
        fileName: z.string().optional(),
        mimeType: z.string().optional(),
    }).optional(),
});

const z_create_message_params = z.object({
    conversationId: z.string(),
});