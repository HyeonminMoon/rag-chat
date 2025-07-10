import { create } from 'zustand';
import { ChatStore, Message } from '../types/chat';

export const useChatStore = create<ChatStore>((set) => ({
    messages: [],
    isLoading: false,
    addMessage: (message: Message) =>
        set((state) => ({
            ...state,
            messages: [...state.messages, message],
        })),
    setLoading: (isLoading: boolean) =>
        set((state) => ({
            ...state,
            isLoading
        })),
    clearMessages: () =>
        set((state) => ({
            ...state,
            messages: []
        })),
})); 