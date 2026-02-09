import { Request, Response } from "express";
import { Conversation } from "../../models/conversation.js";

export const getAllConversations = async (req: Request, res: Response) => {
    try {
        const conversations = await Conversation.find().sort({ createdAt: -1 })
        return res.status(200).json({
            message: 'Conversations fetched successfully',
            data: conversations
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: 'Internal server error' })
    }
}