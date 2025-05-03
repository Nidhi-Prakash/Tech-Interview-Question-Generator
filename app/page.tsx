import type { Metadata } from "next"
import QuestionGenerator from "@/components/question-generator"

export const metadata: Metadata = {
  title: "Technical Interview Question Generator",
  description: "Generate tailored technical interview questions based on job requirements and experience level",
}

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-2">Technical Interview Question Generator</h1>
          <p className="text-muted-foreground">
            Generate tailored technical questions with evaluation guidelines for more effective interviews
          </p>
        </div>
        <QuestionGenerator />
      </div>
    </div>
  )
}
