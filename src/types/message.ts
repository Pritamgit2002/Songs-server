export type Message = {
    conversationId: string;
    role: "user" | "assistant";
    content: string;
    file_url?: string | null;
    extractedText?: string | null;
}

export type MessageDocument = Message & Document;
