import { create } from 'zustand';
import { ChatStore, Message } from '../types/chat';
import { StateCreator } from 'zustand';

export const useChatStore = create<ChatStore>((set: StateCreator<ChatStore>) => ({
    messages: [],
    isLoading: false,
    addMessage: (message: Message) =>
        set((state: ChatStore) => ({
            messages: [...state.messages, message],
        })),
    setLoading: (isLoading: boolean) => set({ isLoading }),
    clearMessages: () => set({ messages: [] }),
})); 