export interface QuestionType {
  question: string
  difficulty: string
  category: string
  evaluationCriteria: string[]
  sampleAnswer?: string
  followUpQuestions?: string[]
}

export interface GenerateQuestionsParams {
  jobTitle: string
  domain: string
  experienceLevel: string
  requirements: string
  questionCount: number
}
