import { Request, Response } from "express";
import { z } from "zod";
import { Message } from "../../models/message.js";
import { postToAws } from "../../utils/aws/post-aws.js";

export const createMessage = async (req: Request, res: Response) => {
    try {
        const { conversationId, message, file } = z_create_message_body.parse(req.body);

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

        // Save user message
        const userMessage = await Message.create({
            conversationId,
            role: 'user',
            content: message,
            file_url: fileUrl,
        });

        //placeholder
        const assistantResponse = "This is a placeholder response";

        const assistantMessage = await Message.create({
            conversationId,
            role: 'assistant',
            content: assistantResponse,
        });

        return res.status(201).json({
            message: 'Messages created successfully',
            data: {
                userMessage,
                assistantMessage,
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

const z_create_message_body = z.object({
    conversationId: z.string(),
    message: z.string(),
    file: z.object({
        data: z.string(),
        fileName: z.string().optional(),
        mimeType: z.string().optional(),
    }).optional(),
});