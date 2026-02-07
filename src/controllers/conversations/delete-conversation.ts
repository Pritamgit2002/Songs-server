import { Request, Response } from 'express'
import { z } from 'zod'
import { Conversation } from '../../models/conversation.js'

export const deleteConversation = async (req: Request, res: Response) => {
    try {
        const { conversationId } = z_delete_conversation_params.parse(req.params)
        console.log("router.replace", conversationId)
        const conversation = await Conversation.findOneAndDelete({
            conversationId: conversationId
        })

        console.log("router.replace", conversation)

        if (!conversation) {
            return res.status(404).json({ error: 'Conversation not found' })
        }

        return res.status(200).json({
            message: 'Conversation deleted successfully',
            conversation
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: 'Internal server error' })
    }
}

const z_delete_conversation_params = z.object({
    conversationId: z.string(),
})