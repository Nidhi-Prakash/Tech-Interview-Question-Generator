"use server"

import { generateText } from "ai"
import { google } from "@ai-sdk/google"
import type { QuestionType, GenerateQuestionsParams } from "@/lib/types"

export async function generateQuestions(params: GenerateQuestionsParams): Promise<QuestionType[]> {
  try {
    // Check if Google AI API key is available
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      throw new Error("Google AI API key is not configured. Please check your environment variables.")
    }

    const { jobTitle, domain, experienceLevel, requirements, questionCount } = params

    // Extract key skills from requirements
    const skillsPrompt = `
      Extract the key technical skills and technologies from the following job requirements:
      ${requirements}
      
      Return only a comma-separated list of the most important technical skills.
    `

    const { text: skillsText } = await generateText({
      model: google("gemini-1.5-pro"),
      prompt: skillsPrompt,
      maxTokens: 500,
    })

    const skills = skillsText.split(",").map((skill) => skill.trim())

    // Generate questions based on the extracted skills
    const questionsPrompt = `
      Generate ${questionCount} technical interview questions for a ${jobTitle} position in the ${domain} domain.
      
      Job Requirements: ${requirements}
      
      Experience Level: ${experienceLevel}
      
      Key Skills: ${skills.join(", ")}
      
      For each question:
      1. Make sure it's relevant to the job requirements and key skills
      2. Set an appropriate difficulty (Easy, Medium, Hard) based on the experience level
      3. Categorize it by the specific skill area it tests
      4. Include 3-5 evaluation criteria for assessing the candidate's answer
      5. Include a sample answer that would meet all evaluation criteria
      6. Include 2-3 follow-up questions to probe deeper if time allows
      
      Format each question as a JSON object with these fields:
      - question (string)
      - difficulty (string: "easy", "medium", or "hard")
      - category (string: specific skill area)
      - evaluationCriteria (array of strings)
      - sampleAnswer (string)
      - followUpQuestions (array of strings)
      
      Return an array of these question objects in valid JSON format.
    `

    const { text: questionsJson } = await generateText({
      model: google("gemini-1.5-pro"),
      prompt: questionsPrompt,
      maxTokens: 4000,
    })

    // Parse the JSON response
    let questions: QuestionType[]
    try {
      // Find the JSON part in the response (in case there's any extra text)
      const jsonMatch = questionsJson.match(/\[[\s\S]*\]/)
      if (jsonMatch) {
        questions = JSON.parse(jsonMatch[0])
      } else {
        throw new Error("No valid JSON found in response")
      }
    } catch (error) {
      console.error("Failed to parse questions JSON:", error)
      console.log("Raw response:", questionsJson)
      throw new Error("Failed to parse generated questions")
    }

    return questions
  } catch (error) {
    console.error("Error generating questions:", error)
    throw error
  }
}
