"use client"

import { Badge } from "@/components/ui/badge"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import confetti from "canvas-confetti"
import { CheckCircle, XCircle, HelpCircle, ArrowRight, RefreshCcw, Award, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"

interface QuizQuestion {
  id: string
  question: string
  type: "multiple_choice" | "checkbox" | "text" | "essay"
  options?: string[]
  correctAnswer?: string | string[]
  explanation?: string
  points: number
}

interface InteractiveQuizProps {
  title: string
  quizData: QuizQuestion[]
  onComplete: () => void
  timeLimit?: number // in seconds
}

export default function InteractiveQuiz({ title, quizData, onComplete, timeLimit }: InteractiveQuizProps) {
  const { toast } = useToast()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [results, setResults] = useState<Record<string, boolean>>({})
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)
  const [maxScore, setMaxScore] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(timeLimit || 0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)

  useEffect(() => {
    // Calculate max possible score
    const totalPoints = quizData.reduce((total, question) => total + question.points, 0)
    setMaxScore(totalPoints)
  }, [quizData])

  useEffect(() => {
    // Handle timer if time limit is set
    if (timeLimit && timeRemaining > 0 && !showResults) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            handleSubmit()
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [timeLimit, timeRemaining, showResults])

  const handleAnswerChange = (value: any) => {
    setAnswers({
      ...answers,
      [quizData[currentQuestion].id]: value,
    })
  }

  const handleCheckboxChange = (option: string, checked: boolean) => {
    const currentAnswer = answers[quizData[currentQuestion].id] || []

    if (checked) {
      setAnswers({
        ...answers,
        [quizData[currentQuestion].id]: [...currentAnswer, option],
      })
    } else {
      setAnswers({
        ...answers,
        [quizData[currentQuestion].id]: currentAnswer.filter((item: string) => item !== option),
      })
    }
  }

  const handleNext = () => {
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setShowExplanation(false)
    } else {
      handleSubmit()
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
      setShowExplanation(false)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      // Calculate score
      let correctAnswers = 0
      let totalPoints = 0
      const questionResults: Record<string, boolean> = {}

      quizData.forEach((question) => {
        const userAnswer = answers[question.id]
        let isCorrect = false

        if (question.type === "multiple_choice" && userAnswer === question.correctAnswer) {
          isCorrect = true
          totalPoints += question.points
        } else if (question.type === "checkbox") {
          // For checkbox, compare arrays
          const correctOptions = question.correctAnswer as string[]
          const userOptions = (userAnswer as string[]) || []

          // Check if arrays have the same elements
          isCorrect =
            correctOptions.length === userOptions.length &&
            correctOptions.every((option) => userOptions.includes(option))

          if (isCorrect) {
            totalPoints += question.points
          }
        } else if (question.type === "text") {
          // Case insensitive comparison for text answers
          isCorrect =
            (userAnswer || "").toLowerCase().trim() === ((question.correctAnswer as string) || "").toLowerCase().trim()

          if (isCorrect) {
            totalPoints += question.points
          }
        } else if (question.type === "essay") {
          // Essays are always marked as "correct" but need manual review
          isCorrect = true
        }

        if (isCorrect) {
          correctAnswers++
        }

        questionResults[question.id] = isCorrect
      })

      setResults(questionResults)
      setScore(totalPoints)
      setShowResults(true)

      // Trigger confetti if score is good
      if (totalPoints / maxScore >= 0.7) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        })
      }

      // Call onComplete callback
      onComplete()

      toast({
        title: "Quiz completed!",
        description: `You scored ${totalPoints} out of ${maxScore} points.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error submitting your quiz.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRetry = () => {
    setAnswers({})
    setResults({})
    setShowResults(false)
    setCurrentQuestion(0)
    setTimeRemaining(timeLimit || 0)
    setShowExplanation(false)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  if (quizData.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <HelpCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-2">No questions available</h3>
          <p className="text-muted-foreground">This quiz doesn't have any questions yet.</p>
        </CardContent>
      </Card>
    )
  }

  if (showResults) {
    return (
      <Card className="border-primary/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            Quiz Results: {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            <div className="text-center py-6">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="inline-flex items-center justify-center rounded-full bg-primary/10 p-6 mb-4"
              >
                <span className="text-4xl font-bold text-primary">{Math.round((score / maxScore) * 100)}%</span>
              </motion.div>

              <h3 className="text-xl font-medium mb-2">
                {score === maxScore
                  ? "Perfect score!"
                  : score / maxScore >= 0.7
                    ? "Great job!"
                    : score / maxScore >= 0.5
                      ? "Good effort!"
                      : "Keep practicing!"}
              </h3>

              <p className="text-muted-foreground mb-4">
                You scored {score} out of {maxScore} points.
              </p>

              <div className="flex flex-wrap justify-center gap-2 mb-6">
                <Badge variant="outline" className="text-sm">
                  {quizData.length} Questions
                </Badge>
                <Badge variant="outline" className="text-sm">
                  {Object.values(results).filter(Boolean).length} Correct
                </Badge>
                <Badge variant="outline" className="text-sm">
                  {Object.values(results).filter((r) => !r).length} Incorrect
                </Badge>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Question Review</h4>

              {quizData.map((question, index) => (
                <div
                  key={question.id}
                  className={cn(
                    "p-4 rounded-lg",
                    results[question.id] ? "bg-green-50 dark:bg-green-950/20" : "bg-red-50 dark:bg-red-950/20",
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {results[question.id] ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                    </div>

                    <div className="space-y-2 flex-1">
                      <div>
                        <span className="text-sm text-muted-foreground">Question {index + 1}</span>
                        <h5 className="font-medium">{question.question}</h5>
                      </div>

                      {question.type === "multiple_choice" && (
                        <div className="space-y-2">
                          {question.options?.map((option) => (
                            <div
                              key={option}
                              className={cn(
                                "p-2 rounded border",
                                option === question.correctAnswer
                                  ? "border-green-500 bg-green-50 dark:bg-green-950/20"
                                  : option === answers[question.id] && option !== question.correctAnswer
                                    ? "border-red-500 bg-red-50 dark:bg-red-950/20"
                                    : "border-transparent",
                              )}
                            >
                              {option}
                            </div>
                          ))}
                        </div>
                      )}

                      {question.type === "checkbox" && (
                        <div className="space-y-2">
                          {question.options?.map((option) => {
                            const isCorrect = (question.correctAnswer as string[]).includes(option)
                            const isSelected = (answers[question.id] || []).includes(option)

                            return (
                              <div
                                key={option}
                                className={cn(
                                  "p-2 rounded border",
                                  isCorrect && isSelected
                                    ? "border-green-500 bg-green-50 dark:bg-green-950/20"
                                    : !isCorrect && isSelected
                                      ? "border-red-500 bg-red-50 dark:bg-red-950/20"
                                      : isCorrect
                                        ? "border-green-500 border-dashed"
                                        : "border-transparent",
                                )}
                              >
                                {option}
                              </div>
                            )
                          })}
                        </div>
                      )}

                      {question.type === "text" && (
                        <div className="space-y-2">
                          <div className="p-2 rounded border">
                            <p className="font-medium">Your answer:</p>
                            <p>{answers[question.id] || "No answer provided"}</p>
                          </div>

                          <div className="p-2 rounded border border-green-500 bg-green-50 dark:bg-green-950/20">
                            <p className="font-medium">Correct answer:</p>
                            <p>{question.correctAnswer as string}</p>
                          </div>
                        </div>
                      )}

                      {question.explanation && (
                        <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                          <p className="font-medium text-sm">Explanation:</p>
                          <p className="text-sm">{question.explanation}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleRetry}>
            <RefreshCcw className="h-4 w-4 mr-2" />
            Retry Quiz
          </Button>

          <Button onClick={onComplete}>Continue</Button>
        </CardFooter>
      </Card>
    )
  }

  const currentQuestionData = quizData[currentQuestion]

  return (
    <Card className="border-primary/10">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-primary" />
            {title}
          </span>

          {timeLimit && (
            <Badge variant={timeRemaining < 30 ? "destructive" : "outline"} className="gap-1">
              <Clock className="h-3 w-3" />
              {formatTime(timeRemaining)}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">
                Question {currentQuestion + 1} of {quizData.length}
              </span>
              <span className="text-sm font-medium">
                {Math.round(((currentQuestion + 1) / quizData.length) * 100)}%
              </span>
            </div>
            <Progress value={((currentQuestion + 1) / quizData.length) * 100} className="h-2" />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-medium">{currentQuestionData.question}</h3>
                  <Badge variant="outline">{currentQuestionData.points} points</Badge>
                </div>

                {currentQuestionData.type === "multiple_choice" && (
                  <RadioGroup
                    value={answers[currentQuestionData.id] || ""}
                    onValueChange={handleAnswerChange}
                    className="space-y-3 pt-3"
                  >
                    {currentQuestionData.options?.map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <RadioGroupItem value={option} id={`option-${option}`} />
                        <Label
                          htmlFor={`option-${option}`}
                          className="flex-1 p-3 rounded-md hover:bg-muted cursor-pointer"
                        >
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}

                {currentQuestionData.type === "checkbox" && (
                  <div className="space-y-3 pt-3">
                    {currentQuestionData.options?.map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <Checkbox
                          id={`option-${option}`}
                          checked={(answers[currentQuestionData.id] || []).includes(option)}
                          onCheckedChange={(checked) => handleCheckboxChange(option, checked as boolean)}
                        />
                        <Label
                          htmlFor={`option-${option}`}
                          className="flex-1 p-3 rounded-md hover:bg-muted cursor-pointer"
                        >
                          {option}
                        </Label>
                      </div>
                    ))}
                  </div>
                )}

                {currentQuestionData.type === "text" && (
                  <div className="pt-3">
                    <Input
                      value={answers[currentQuestionData.id] || ""}
                      onChange={(e) => handleAnswerChange(e.target.value)}
                      placeholder="Type your answer here"
                      className="w-full"
                    />
                  </div>
                )}

                {currentQuestionData.type === "essay" && (
                  <div className="pt-3">
                    <Textarea
                      value={answers[currentQuestionData.id] || ""}
                      onChange={(e) => handleAnswerChange(e.target.value)}
                      placeholder="Write your answer here"
                      rows={6}
                      className="w-full"
                    />
                  </div>
                )}
              </div>

              {showExplanation && currentQuestionData.explanation && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg"
                >
                  <p className="font-medium">Explanation:</p>
                  <p>{currentQuestionData.explanation}</p>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between">
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrevious} disabled={currentQuestion === 0}>
            Previous
          </Button>

          {currentQuestionData.explanation && (
            <Button variant="ghost" onClick={() => setShowExplanation(!showExplanation)}>
              {showExplanation ? "Hide Hint" : "Show Hint"}
            </Button>
          )}
        </div>

        <Button onClick={handleNext} disabled={!answers[currentQuestionData.id] || isSubmitting}>
          {currentQuestion < quizData.length - 1 ? (
            <>
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          ) : (
            "Submit"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
