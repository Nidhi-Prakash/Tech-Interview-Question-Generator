"use client"

import { useState } from "react"
import type { QuestionType } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface QuestionListProps {
  questions: QuestionType[]
}

export default function QuestionList({ questions }: QuestionListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [difficultyFilter, setDifficultyFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")

  // Extract unique categories from questions
  const categories = Array.from(new Set(questions.map((q) => q.category)))

  const filteredQuestions = questions.filter((question) => {
    const matchesSearch = question.question.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDifficulty = difficultyFilter === "all" || question.difficulty === difficultyFilter
    const matchesCategory = categoryFilter === "all" || question.category === categoryFilter

    return matchesSearch && matchesDifficulty && matchesCategory
  })

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      case "medium":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
      case "hard":
        return "bg-red-100 text-red-800 hover:bg-red-100"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input placeholder="Search questions..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <div className="flex gap-2">
          <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Difficulties</SelectItem>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredQuestions.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">No questions match your filters</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredQuestions.map((question, index) => (
            <Card key={index} className="print:break-inside-avoid">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{question.question}</CardTitle>
                    <CardDescription className="mt-2">
                      <div className="flex flex-wrap gap-2 mt-1">
                        <Badge variant="outline" className={getDifficultyColor(question.difficulty)}>
                          {question.difficulty}
                        </Badge>
                        <Badge variant="outline">{question.category}</Badge>
                      </div>
                    </CardDescription>
                  </div>
                  <div className="text-sm text-muted-foreground">#{index + 1}</div>
                </div>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="evaluation">
                    <AccordionTrigger>Evaluation Criteria</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 text-sm">
                        {question.evaluationCriteria.map((criterion, idx) => (
                          <div key={idx} className="pl-4 border-l-2 border-muted">
                            {criterion}
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  {question.sampleAnswer && (
                    <AccordionItem value="sample-answer">
                      <AccordionTrigger>Sample Answer</AccordionTrigger>
                      <AccordionContent>
                        <div className="text-sm whitespace-pre-wrap">{question.sampleAnswer}</div>
                      </AccordionContent>
                    </AccordionItem>
                  )}
                  {question.followUpQuestions && question.followUpQuestions.length > 0 && (
                    <AccordionItem value="follow-up">
                      <AccordionTrigger>Follow-up Questions</AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          {question.followUpQuestions.map((followUp, idx) => (
                            <li key={idx}>{followUp}</li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  )}
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
