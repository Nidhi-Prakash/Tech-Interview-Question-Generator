"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { generateQuestions } from "@/lib/actions"
import type { QuestionType } from "@/lib/types"
import QuestionList from "@/components/question-list"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

const formSchema = z.object({
  jobTitle: z.string().min(2, {
    message: "Job title must be at least 2 characters.",
  }),
  domain: z.string({
    required_error: "Please select a technical domain.",
  }),
  experienceLevel: z.string({
    required_error: "Please select an experience level.",
  }),
  requirements: z.string().min(10, {
    message: "Requirements must be at least 10 characters.",
  }),
  questionCount: z.coerce.number().min(1).max(10),
})

export default function QuestionGenerator() {
  const [questions, setQuestions] = useState<QuestionType[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [activeTab, setActiveTab] = useState("form")
  const [error, setError] = useState<string | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jobTitle: "",
      domain: "",
      experienceLevel: "",
      requirements: "",
      questionCount: 5,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsGenerating(true)
      setError(null)
      const generatedQuestions = await generateQuestions(values)
      setQuestions(generatedQuestions)
      setActiveTab("results")
    } catch (error) {
      console.error("Failed to generate questions:", error)
      setError(error instanceof Error ? error.message : "Failed to generate questions. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="form">Input Requirements</TabsTrigger>
        <TabsTrigger value="results" disabled={questions.length === 0}>
          Generated Questions ({questions.length})
        </TabsTrigger>
      </TabsList>
      <TabsContent value="form">
        <Card className="p-6">
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="jobTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Frontend Developer" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="questionCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Questions</FormLabel>
                      <FormControl>
                        <Input type="number" min={1} max={10} {...field} />
                      </FormControl>
                      <FormDescription>Generate 1-10 questions</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="domain"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Technical Domain</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select domain" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="web-development">Web Development</SelectItem>
                          <SelectItem value="data-science">Data Science</SelectItem>
                          <SelectItem value="devops">DevOps</SelectItem>
                          <SelectItem value="mobile-development">Mobile Development</SelectItem>
                          <SelectItem value="backend-development">Backend Development</SelectItem>
                          <SelectItem value="frontend-development">Frontend Development</SelectItem>
                          <SelectItem value="machine-learning">Machine Learning</SelectItem>
                          <SelectItem value="cloud-computing">Cloud Computing</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="experienceLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Experience Level</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="junior">Junior (0-2 years)</SelectItem>
                          <SelectItem value="mid-level">Mid-level (3-5 years)</SelectItem>
                          <SelectItem value="senior">Senior (6+ years)</SelectItem>
                          <SelectItem value="lead">Lead/Architect</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="requirements"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Requirements</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter the job requirements, skills needed, and responsibilities..."
                        className="min-h-32"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Include specific technologies, frameworks, and skills required for the position
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isGenerating}>
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Questions...
                  </>
                ) : (
                  "Generate Questions"
                )}
              </Button>
            </form>
          </Form>
        </Card>
      </TabsContent>
      <TabsContent value="results">
        <QuestionList questions={questions} />
        <div className="mt-6 flex justify-end">
          <Button onClick={() => setActiveTab("form")} variant="outline" className="mr-2">
            Back to Form
          </Button>
          <Button onClick={() => window.print()} className="print:hidden">
            Print Questions
          </Button>
        </div>
      </TabsContent>
    </Tabs>
  )
}
