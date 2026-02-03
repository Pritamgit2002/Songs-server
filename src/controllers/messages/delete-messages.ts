import { Request, Response } from "express";
import { z } from "zod";
import { Message } from "../../models/message.js";

export const deleteMessages = async (req: Request, res: Response) => {
    try {
        const { conversationId } = z_delete_messages_params.parse(req.params)
        await Message.deleteOne({ conversationId })
        return res.status(200).json({
            message: 'Message deleted successfully',
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: 'Internal server error' })
    }
}

const z_delete_messages_params = z.object({
    conversationId: z.string(),
})