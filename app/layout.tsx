import './globals.css'

export const metadata = {
  title: 'RAG 챗봇',
  description: 'Next.js와 OpenAI를 이용한 RAG 챗봇',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}
