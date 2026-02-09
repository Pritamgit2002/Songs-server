export type Song = {
    songTitle: string;
    creator: string;
    reason: string;
}
export type Message = {
    conversationId: string;
    role: "user" | "assistant";
    content?: string;
    file_url?: string | null;
    extractedText?: string | null;
    songs?: Song[] | null;
}

export type MessageDocument = Message & Document;
