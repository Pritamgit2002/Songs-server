import { Schema, type Model, model, models } from "mongoose";
import { ConversationDocument } from "../types/conversation.js";

const conversationSchema = new Schema<ConversationDocument>({
    conversationId: {
        type: String,
        required: true
    },
    conversationName: {
        type: String,
        required: true,
        default: "New Conversation"
    }
}, {
    timestamps: true
})

export const Conversation = model<ConversationDocument>("Conversation", conversationSchema);
