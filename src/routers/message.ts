import { Router } from "express";
import { createMessage } from "../controllers/messages/create-message.js";
import { getAllMessagesByConversationId } from "../controllers/messages/get-all-messages-by-conversationId.js";
import { deleteMessages } from "../controllers/messages/delete-messages.js";

const router = Router()

router.post('/', createMessage)
router.get('/:conversationId', getAllMessagesByConversationId)
router.delete('/:conversationId', deleteMessages)

export { router as message_router }
