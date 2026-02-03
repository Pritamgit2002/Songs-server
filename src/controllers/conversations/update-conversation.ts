import { Request, Response } from 'express'
import { z } from 'zod'
import { Conversation } from '../../models/conversation.js'

export const updateConversation = async (req: Request, res: Response) => {
    try {
        const { conversationId } = z_update_conversation_params.parse(req.params)
        const { conversationName } = z_update_conversation_body.parse(req.body)
        const conversation = await Conversation.findByIdAndUpdate(conversationId, { conversationName }, { new: true })

        return res.status(200).json({
            message: 'Conversation updated successfully',
            conversation
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: 'Internal server error' })
    }
}

const z_update_conversation_params = z.object({
    conversationId: z.string(),
})

const z_update_conversation_body = z.object({
    conversationName: z.string(),
})