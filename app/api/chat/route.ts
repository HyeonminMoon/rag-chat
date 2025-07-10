import { NextResponse } from 'next/server'
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter"
import { MemoryVectorStore } from "langchain/vectorstores/memory"
import { OpenAIEmbeddings } from "@langchain/openai"
import OpenAI from 'openai'
import path from 'path'
import fs from 'fs'

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

let vectorStore: MemoryVectorStore | null = null

async function initializeVectorStore() {
    if (vectorStore) return

    try {
        // 텍스트 파일 읽기
        const textPath = path.join(process.cwd(), 'public', 'rag.txt')
        const text = fs.readFileSync(textPath, 'utf-8')

        // 텍스트 분할
        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,  // 청크 사이즈 증가
            chunkOverlap: 200,  // 오버랩 증가
        })
        const splitDocs = await splitter.createDocuments([text])

        // 벡터 저장소 초기화
        vectorStore = await MemoryVectorStore.fromDocuments(
            splitDocs,
            new OpenAIEmbeddings({
                openAIApiKey: process.env.OPENAI_API_KEY,
            })
        )
    } catch (error) {
        console.error('Vector store initialization error:', error)
        throw error
    }
}

export async function POST(req: Request) {
    try {
        const { message } = await req.json()

        // 벡터 저장소 초기화 확인
        await initializeVectorStore()
        if (!vectorStore) {
            throw new Error("Vector store initialization failed")
        }

        // 관련 문서 검색 (관련성 높은 문서 수 증가)
        const relevantDocs = await vectorStore.similaritySearch(message, 2)
        const context = relevantDocs.map(doc => doc.pageContent).join('\n\n')

        // GPT-4를 사용한 답변 생성 (프롬프트 개선)
        const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                {
                    role: "system",
                    content: "당신은 RAG(Retrieval-Augmented Generation)에 대한 전문가입니다. 주어진 컨텍스트를 바탕으로 질문에 정확하게 답변해주세요. 컨텍스트에 없는 내용은 '주어진 컨텍스트에서 해당 정보를 찾을 수 없습니다'라고 답변해주세요."
                },
                {
                    role: "user",
                    content: `다음 컨텍스트를 바탕으로 질문에 답변해주세요:

컨텍스트:
${context}

질문:
${message}`
                }
            ],
            temperature: 0.3,  // 더 정확한 답변을 위해 temperature 낮춤
        })

        return NextResponse.json({
            answer: completion.choices[0].message.content,
            sourceText: context,
        })
    } catch (error) {
        console.error('Error:', error)
        return NextResponse.json(
            { error: '처리 중 오류가 발생했습니다.' },
            { status: 500 }
        )
    }
} 