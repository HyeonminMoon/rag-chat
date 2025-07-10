'use client'

import { useState } from 'react'
import { useChatStore } from '@/store/chat'
import { Button } from '@/components/ui/button'
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
        <main className="flex flex-col h-screen bg-gray-50">
            {/* 헤더 */}
            <div className="bg-white shadow-sm py-4 px-6 border-b">
                <h1 className="text-xl font-semibold text-gray-800">RAG 챗봇</h1>
            </div>

            {/* 메인 채팅 영역 */}
            <div className="flex-1 overflow-hidden">
                <div className="h-full max-w-4xl mx-auto p-4 overflow-y-auto space-y-6">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[80%] rounded-2xl p-4 shadow-sm ${message.role === 'user'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white border'
                                    }`}
                            >
                                <p className="text-[15px] leading-relaxed">
                                    {message.content}
                                </p>
                                {message.sourceText && (
                                    <div className={`mt-3 text-sm ${message.role === 'user'
                                        ? 'border-t border-blue-400 pt-3 text-blue-100'
                                        : 'border-t border-gray-100 pt-3 text-gray-600'
                                        }`}>
                                        <p className="font-medium mb-1">참조 텍스트</p>
                                        <p className="text-[13px] leading-relaxed opacity-90">
                                            {message.sourceText}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="bg-white border rounded-2xl p-4 shadow-sm flex items-center space-x-2">
                                <div className="flex space-x-1">
                                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                                <p className="text-gray-600">답변 생성 중...</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* 입력 폼 */}
            <div className="bg-white border-t p-4">
                <form onSubmit={handleSubmit} className="max-w-4xl mx-auto flex gap-3">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="질문을 입력하세요..."
                        className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        disabled={isLoading}
                    />
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
                    >
                        전송
                    </Button>
                </form>
            </div>
        </main>
    )
} 