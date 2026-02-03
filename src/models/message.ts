import { Schema, model } from "mongoose";
import { MessageDocument } from "../types/message.js";

const messageSchema = new Schema<MessageDocument>({
    conversationId: {
        type: String,
        required: true,
        index: true // for faster queries
    },
    role: {
        type: String,
        enum: ["user", "assistant"],
        required: true
    },
    content: {
        type: String,
        required: true
    },
    file_url: {
        type: String,
        default: null
    },
    extractedText: {
        type: String,
        default: null
    }
}, {
    timestamps: true
})

// Compound index for efficient conversation retrieval
messageSchema.index({ conversationId: 1, createdAt: 1 });

export const Message = model<MessageDocument>("Message", messageSchema);