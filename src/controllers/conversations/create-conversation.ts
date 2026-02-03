import { Request, Response } from 'express'
import { z } from 'zod'
import { Conversation } from '../../models/conversation.js'

export const createConversation = async (req: Request, res: Response) => {
    try {
        const { conversationId } = z_create_conversation_params.parse(req.params)
        const conversation = await Conversation.create({ conversationId })

        return res.status(201).json({
            message: 'Conversation created successfully',
            conversation
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: 'Internal server error' })
    }
}

const z_create_conversation_params = z.object({
    conversationId: z.string(),
})