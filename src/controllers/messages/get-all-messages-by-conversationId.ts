import { Request, Response } from "express";
import { z } from "zod";
import { Message } from "../../models/message.js";

export const getAllMessagesByConversationId = async (req: Request, res: Response) => {
    try {
        const { conversationId } = z_get_all_messages_by_conversationId_params.parse(req.params)

        const messages = await Message.find({ conversationId })
            .sort({ createdAt: 1 })
            .lean();

        return res.status(200).json({
            data: messages,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

const z_get_all_messages_by_conversationId_params = z.object({
    conversationId: z.string(),
})