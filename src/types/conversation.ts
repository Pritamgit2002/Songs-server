export type Conversation = {
    conversationId: string;
    conversationName: string;
    createdAt: Date;
    updatedAt: Date;
}

export type ConversationDocument = Conversation & Document;
