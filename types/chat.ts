export interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    sourceText?: string;
}

export interface ChatState {
    messages: Message[];
    isLoading: boolean;
}

export interface ChatStore extends ChatState {
    addMessage: (message: Message) => void;
    setLoading: (isLoading: boolean) => void;
    clearMessages: () => void;
} 