import { Router } from "express";
import { createConversation } from "../controllers/conversations/create-conversation.js";
import { getConversationById } from "../controllers/conversations/get-conversation-by-id.js";
import { deleteConversation } from "../controllers/conversations/delete-conversation.js";
import { updateConversation } from "../controllers/conversations/update-conversation.js";
import { getAllConversations } from "../controllers/conversations/get-all-conversation.js";

const router = Router()

router.post('/:conversationId', createConversation)
router.get('/', getAllConversations)
router.get('/:conversationId', getConversationById)
router.delete('/:conversationId', deleteConversation)
router.put('/:conversationId', updateConversation)

export { router as conversation_router }