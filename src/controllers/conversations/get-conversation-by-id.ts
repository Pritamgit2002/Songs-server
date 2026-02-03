import { Request, Response } from 'express'
import { z } from 'zod'
import { Conversation } from '../../models/conversation.js'

export const getConversationById = async (req: Request, res: Response) => {
    try {
        const { conversationId } = z_get_conversation_by_id_params.parse(req.params)
        const conversation = await Conversation.findOne({ conversationId })

        return res.status(200).json({
            message: 'Conversation fetched successfully',
            conversation
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: 'Internal server error' })
    }
}

const z_get_conversation_by_id_params = z.object({
    conversationId: z.string(),
})