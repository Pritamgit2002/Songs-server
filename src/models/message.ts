import { Schema, model } from "mongoose";
import { MessageDocument, Song } from "../types/message.js";

const songSchema = new Schema<Song>({
    songTitle: {
        type: String,
        required: true
    },
    creator: {
        type: String,
        required: true
    },
    reason: {
        type: String,
        required: true
    }
}, { _id: false }); // Disable _id for subdocuments


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
        default: ""
    },
    file_url: {
        type: String,
        default: null
    },
    extractedText: {
        type: String,
        default: null
    },
    songs: {
        type: [songSchema],
        default: []
    }
}, {
    timestamps: true
});

// Compound index for efficient conversation retrieval
messageSchema.index({ conversationId: 1, createdAt: 1 });

export const Message = model<MessageDocument>("Message", messageSchema);