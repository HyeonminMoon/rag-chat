export interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    sourceText?: string;
}

export interface ChatStore {
    messages: Message[];
    isLoading: boolean;
    addMessage: (message: Message) => void;
    setLoading: (isLoading: boolean) => void;
    clearMessages: () => void;
} 