"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { CheckCircle2 } from "lucide-react"

interface QuizComponentProps {
  lessonId: string
  userId: string
}

interface Question {
  id: string
  question: string
  type: "multiple_choice" | "checkbox" | "text" | "essay"
  options?: string[]
  correctAnswer?: string | string[]
}

export default function QuizComponent({ lessonId, userId }: QuizComponentProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [score, setScore] = useState(0)

  // Fetch quiz questions
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const supabase = getSupabaseBrowserClient()

        // Check if quiz is already completed
        const { data: progress } = await supabase
          .from("lesson_progress")
          .select("completed")
          .eq("enrollment_id", userId)
          .eq("lesson_id", lessonId)
          .single()

        if (progress?.completed) {
          setQuizCompleted(true)
          setScore(100) // Assuming 100% for completed quizzes
        }

        // For simplicity, we'll use dummy questions
        setQuestions([
          {
            id: "1",
            question: "What is the main purpose of this course?",
            type: "multiple_choice",
            options: [
              "To teach programming basics",
              "To improve problem-solving skills",
              "To understand educational concepts",
              "All of the above",
            ],
            correctAnswer: "All of the above",
          },
          {
            id: "2",
            question: "Which of the following are important skills for a developer? (Select all that apply)",
            type: "checkbox",
            options: ["Problem solving", "Communication", "Attention to detail", "Time management"],
            correctAnswer: ["Problem solving", "Communication", "Attention to detail", "Time management"],
          },
          {
            id: "3",
            question: "Explain the concept of variables in your own words.",
            type: "essay",
          },
        ])

        setLoading(false)
      } catch (error) {
        console.error("Error fetching quiz:", error)
        toast({
          title: "Error",
          description: "Failed to load quiz questions",
          variant: "destructive",
        })
        setLoading(false)
      }
    }

    fetchQuiz()
  }, [lessonId, userId, toast])

  // Handle answer change
  const handleAnswerChange = (value: any) => {
    setAnswers({
      ...answers,
      [questions[currentQuestion].id]: value,
    })
  }

  // Handle checkbox change
  const handleCheckboxChange = (option: string, checked: boolean) => {
    const currentAnswer = answers[questions[currentQuestion].id] || []

    if (checked) {
      setAnswers({
        ...answers,
        [questions[currentQuestion].id]: [...currentAnswer, option],
      })
    } else {
      setAnswers({
        ...answers,
        [questions[currentQuestion].id]: currentAnswer.filter((item: string) => item !== option),
      })
    }
  }

  // Navigate to next question
  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      handleSubmit()
    }
  }

  // Navigate to previous question
  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  // Submit quiz
  const handleSubmit = async () => {
    setSubmitting(true)

    try {
      // Calculate score for graded questions
      let correctAnswers = 0
      let totalGradedQuestions = 0

      questions.forEach((question) => {
        if (question.type === "multiple_choice" || question.type === "checkbox") {
          totalGradedQuestions++

          const userAnswer = answers[question.id]

          if (question.type === "multiple_choice" && userAnswer === question.correctAnswer) {
            correctAnswers++
          } else if (question.type === "checkbox") {
            // For checkbox, compare arrays
            const correctOptions = question.correctAnswer as string[]
            const userOptions = (userAnswer as string[]) || []

            // Check if arrays have the same elements
            const isCorrect =
              correctOptions.length === userOptions.length &&
              correctOptions.every((option) => userOptions.includes(option))

            if (isCorrect) {
              correctAnswers++
            }
          }
        }
      })

      // Calculate percentage score
      const calculatedScore = totalGradedQuestions > 0 ? Math.round((correctAnswers / totalGradedQuestions) * 100) : 100

      setScore(calculatedScore)

      // Save quiz results
      const supabase = getSupabaseBrowserClient()

      // Update lesson progress
      await supabase.from("lesson_progress").upsert({
        enrollment_id: userId,
        lesson_id: lessonId,
        completed: true,
        last_watched: new Date().toISOString(),
      })

      setQuizCompleted(true)
      router.refresh()

      toast({
        title: "Quiz Completed",
        description: `You scored ${calculatedScore}% on this quiz`,
      })
    } catch (error) {
      console.error("Error submitting quiz:", error)
      toast({
        title: "Error",
        description: "Failed to submit quiz",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  // Retry quiz
  const handleRetry = () => {
    setAnswers({})
    setCurrentQuestion(0)
    setQuizCompleted(false)
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-60">
            <p>Loading quiz questions...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (quizCompleted) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            Quiz Completed
          </CardTitle>
          <CardDescription>You have successfully completed this quiz</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            <div className="text-center py-6">
              <div className="inline-flex items-center justify-center rounded-full bg-green-100 p-6 mb-4">
                <span className="text-3xl font-bold text-green-700">{score}%</span>
              </div>
              <h3 className="text-xl font-medium mb-2">{score >= 70 ? "Great job!" : "Keep practicing!"}</h3>
              <p className="text-muted-foreground">
                {score >= 70
                  ? "You've demonstrated a good understanding of the material."
                  : "Review the material and try again to improve your score."}
              </p>
            </div>

            <div className="flex justify-center gap-4">
              <Button variant="outline" onClick={handleRetry}>
                Retry Quiz
              </Button>
              <Button>Continue to Next Lesson</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const currentQuestionData = questions[currentQuestion]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quiz</CardTitle>
        <CardDescription>Answer all questions to complete this lesson</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">
                Question {currentQuestion + 1} of {questions.length}
              </span>
              <span className="text-sm font-medium">
                {Math.round(((currentQuestion + 1) / questions.length) * 100)}%
              </span>
            </div>
            <Progress value={((currentQuestion + 1) / questions.length) * 100} className="h-2" />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">{currentQuestionData.question}</h3>

            {currentQuestionData.type === "multiple_choice" && (
              <RadioGroup value={answers[currentQuestionData.id] || ""} onValueChange={handleAnswerChange}>
                <div className="space-y-3">
                  {currentQuestionData.options?.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <RadioGroupItem value={option} id={option} />
                      <Label htmlFor={option}>{option}</Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            )}

            {currentQuestionData.type === "checkbox" && (
              <div className="space-y-3">
                {currentQuestionData.options?.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox
                      id={option}
                      checked={(answers[currentQuestionData.id] || []).includes(option)}
                      onCheckedChange={(checked) => handleCheckboxChange(option, checked as boolean)}
                    />
                    <Label htmlFor={option}>{option}</Label>
                  </div>
                ))}
              </div>
            )}

            {currentQuestionData.type === "text" && (
              <Input
                value={answers[currentQuestionData.id] || ""}
                onChange={(e) => handleAnswerChange(e.target.value)}
                placeholder="Type your answer here"
              />
            )}

            {currentQuestionData.type === "essay" && (
              <Textarea
                value={answers[currentQuestionData.id] || ""}
                onChange={(e) => handleAnswerChange(e.target.value)}
                placeholder="Write your answer here"
                rows={6}
              />
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handlePrevious} disabled={currentQuestion === 0}>
          Previous
        </Button>
        <Button onClick={handleNext} disabled={!answers[currentQuestionData.id] || submitting}>
          {currentQuestion < questions.length - 1 ? "Next" : "Submit"}
        </Button>
      </CardFooter>
    </Card>
  )
}
