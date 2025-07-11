'use client'

import { useState } from 'react'
import { useChatStore } from '@/store/chat'
import { Message } from '@/types/chat'

export default function Home() {
    const [input, setInput] = useState('')
    const { messages, isLoading, addMessage, setLoading } = useChatStore()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!input.trim() || isLoading) return

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input,
        }

        addMessage(userMessage)
        setInput('')
        setLoading(true)

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: input }),
            })

            const data = await response.json()

            addMessage({
                id: Date.now().toString(),
                role: 'assistant',
                content: data.answer,
                sourceText: data.sourceText,
            })
        } catch (error) {
            console.error('Error:', error)
            addMessage({
                id: Date.now().toString(),
                role: 'assistant',
                content: '죄송합니다. 오류가 발생했습니다.',
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="chat-container">
            <div className="chat-header">
                <h1>RAG 챗봇</h1>
            </div>

            <div className="chat-messages">
                <div className="messages-container">
                    {messages.map((message) => (
                        <div key={message.id} className={`message-wrapper ${message.role}`}>
                            <div className="avatar">
                                {message.role === 'user' ? '사' : 'R'}
                            </div>
                            <div className="message-content">
                                <div className="message-bubble">
                                    <p>{message.content}</p>
                                    {message.sourceText && (
                                        <div className="source-text">
                                            <p className="source-text-title">참조 텍스트</p>
                                            <p className="source-text-content">
                                                {message.sourceText}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="message-wrapper assistant">
                            <div className="avatar">R</div>
                            <div className="message-content">
                                <div className="loading-indicator">
                                    <div className="loading-dots">
                                        <div className="loading-dot" style={{ animationDelay: '0ms' }} />
                                        <div className="loading-dot" style={{ animationDelay: '150ms' }} />
                                        <div className="loading-dot" style={{ animationDelay: '300ms' }} />
                                    </div>
                                    <p>답변 생성 중...</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="chat-input-container">
                <form onSubmit={handleSubmit} className="chat-form">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="질문을 입력하세요..."
                        className="chat-input"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        className="send-button"
                        disabled={isLoading}
                    >
                        전송
                    </button>
                </form>
            </div>
        </main>
    )
} 