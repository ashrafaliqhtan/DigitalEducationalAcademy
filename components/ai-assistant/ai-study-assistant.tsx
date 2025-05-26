"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Bot,
  Send,
  Lightbulb,
  BookOpen,
  Target,
  Clock,
  Brain,
  MessageSquare,
  Sparkles,
  FileText,
  CheckCircle,
  AlertCircle,
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: Date
  suggestions?: string[]
  resources?: Resource[]
}

interface Resource {
  id: string
  title: string
  type: "course" | "article" | "video" | "quiz"
  url: string
  duration?: string
}

interface StudyPlan {
  id: string
  title: string
  description: string
  tasks: StudyTask[]
  estimatedTime: string
  difficulty: "easy" | "medium" | "hard"
}

interface StudyTask {
  id: string
  title: string
  description: string
  completed: boolean
  estimatedTime: string
  type: "reading" | "practice" | "quiz" | "project"
}

export default function AIStudyAssistant() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [studyPlans, setStudyPlans] = useState<StudyPlan[]>([])
  const [activeTab, setActiveTab] = useState("chat")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    // Initialize with welcome message
    const welcomeMessage: Message = {
      id: "welcome",
      type: "assistant",
      content:
        "Hi! I'm your AI Study Assistant. I can help you create study plans, answer questions about your courses, suggest learning resources, and track your progress. What would you like to work on today?",
      timestamp: new Date(),
      suggestions: [
        "Create a study plan for React development",
        "Explain JavaScript closures",
        "Suggest practice exercises for CSS",
        "Help me prepare for a coding interview",
      ],
    }
    setMessages([welcomeMessage])

    // Mock study plans
    const mockPlans: StudyPlan[] = [
      {
        id: "1",
        title: "React Fundamentals Mastery",
        description: "Complete guide to mastering React basics in 2 weeks",
        estimatedTime: "2 weeks",
        difficulty: "medium",
        tasks: [
          {
            id: "1",
            title: "Learn JSX Syntax",
            description: "Understand JSX and how it differs from HTML",
            completed: true,
            estimatedTime: "2 hours",
            type: "reading",
          },
          {
            id: "2",
            title: "Components and Props",
            description: "Build reusable components and pass data with props",
            completed: true,
            estimatedTime: "3 hours",
            type: "practice",
          },
          {
            id: "3",
            title: "State Management",
            description: "Learn useState and state management patterns",
            completed: false,
            estimatedTime: "4 hours",
            type: "practice",
          },
          {
            id: "4",
            title: "Event Handling",
            description: "Handle user interactions and events",
            completed: false,
            estimatedTime: "2 hours",
            type: "practice",
          },
          {
            id: "5",
            title: "Build a Todo App",
            description: "Apply your knowledge in a practical project",
            completed: false,
            estimatedTime: "6 hours",
            type: "project",
          },
        ],
      },
    ]
    setStudyPlans(mockPlans)
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const sendMessage = async (content: string) => {
    if (!content.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    // Simulate AI response
    setTimeout(
      () => {
        const aiResponse = generateAIResponse(content)
        setMessages((prev) => [...prev, aiResponse])
        setIsLoading(false)
      },
      1000 + Math.random() * 2000,
    )
  }

  const generateAIResponse = (userInput: string): Message => {
    const input = userInput.toLowerCase()

    let content = ""
    let suggestions: string[] = []
    let resources: Resource[] = []

    if (input.includes("study plan") || input.includes("plan")) {
      content =
        "I'd be happy to help you create a personalized study plan! Based on your learning goals, I can suggest a structured approach with specific tasks, timelines, and resources. What subject or skill would you like to focus on?"
      suggestions = [
        "Create a plan for JavaScript",
        "Plan for UI/UX design",
        "Study plan for data structures",
        "Prepare for certification exam",
      ]
    } else if (input.includes("react")) {
      content =
        "React is a powerful JavaScript library for building user interfaces. Here are some key concepts to master: Components, JSX, Props, State, Event Handling, and Hooks. Would you like me to create a detailed study plan for React?"
      resources = [
        {
          id: "1",
          title: "React Official Documentation",
          type: "article",
          url: "/resources/react-docs",
          duration: "2 hours",
        },
        {
          id: "2",
          title: "React Fundamentals Course",
          type: "course",
          url: "/courses/react-fundamentals",
        },
      ]
      suggestions = ["Explain React hooks", "Show me React best practices", "Create React practice exercises"]
    } else if (input.includes("javascript") || input.includes("js")) {
      content =
        "JavaScript is the foundation of modern web development. Key topics include variables, functions, objects, arrays, DOM manipulation, async programming, and ES6+ features. What specific JavaScript concept would you like to explore?"
      suggestions = ["Explain closures", "Async/await tutorial", "JavaScript best practices", "DOM manipulation guide"]
    } else if (input.includes("css")) {
      content =
        "CSS is essential for styling web pages. Important concepts include selectors, box model, flexbox, grid, responsive design, and animations. I can help you practice with specific exercises or explain any concept in detail."
      suggestions = ["Flexbox exercises", "CSS Grid tutorial", "Responsive design tips", "CSS animations guide"]
    } else if (input.includes("interview") || input.includes("preparation")) {
      content =
        "Great! Interview preparation is crucial. I can help you with coding challenges, system design questions, behavioral questions, and technical concepts. What type of role are you preparing for?"
      suggestions = [
        "Frontend interview questions",
        "Algorithm practice problems",
        "System design basics",
        "Behavioral question prep",
      ]
    } else {
      content =
        "I understand you're looking for help with your studies. I can assist with creating study plans, explaining concepts, suggesting resources, and tracking your progress. Could you be more specific about what you'd like to learn or work on?"
      suggestions = [
        "Create a study schedule",
        "Explain a programming concept",
        "Find practice exercises",
        "Track my progress",
      ]
    }

    return {
      id: Date.now().toString(),
      type: "assistant",
      content,
      timestamp: new Date(),
      suggestions,
      resources,
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion)
  }

  const toggleTaskCompletion = (planId: string, taskId: string) => {
    setStudyPlans((prev) =>
      prev.map((plan) => {
        if (plan.id === planId) {
          return {
            ...plan,
            tasks: plan.tasks.map((task) => {
              if (task.id === taskId) {
                return { ...task, completed: !task.completed }
              }
              return task
            }),
          }
        }
        return plan
      }),
    )

    toast({
      title: "Progress updated",
      description: "Your study progress has been saved",
    })
  }

  const getTaskIcon = (type: string) => {
    switch (type) {
      case "reading":
        return <BookOpen className="h-4 w-4" />
      case "practice":
        return <Brain className="h-4 w-4" />
      case "quiz":
        return <FileText className="h-4 w-4" />
      case "project":
        return <Target className="h-4 w-4" />
      default:
        return <CheckCircle className="h-4 w-4" />
    }
  }

  const calculatePlanProgress = (plan: StudyPlan) => {
    const completed = plan.tasks.filter((task) => task.completed).length
    return (completed / plan.tasks.length) * 100
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
          <Bot className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">AI Study Assistant</h1>
          <p className="text-muted-foreground">Your personal learning companion</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="chat" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Chat
          </TabsTrigger>
          <TabsTrigger value="plans" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Study Plans
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Insights
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat">
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                AI Assistant
              </CardTitle>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col p-0">
              <ScrollArea className="flex-1 px-6">
                <div className="space-y-4 pb-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {message.type === "assistant" && (
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                            <Bot className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                      )}

                      <div className={`max-w-[80%] ${message.type === "user" ? "order-first" : ""}`}>
                        <div
                          className={`rounded-lg p-3 ${
                            message.type === "user" ? "bg-primary text-primary-foreground ml-auto" : "bg-muted"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                        </div>

                        {message.resources && message.resources.length > 0 && (
                          <div className="mt-2 space-y-2">
                            <p className="text-xs text-muted-foreground">Recommended resources:</p>
                            {message.resources.map((resource) => (
                              <Card key={resource.id} className="p-2">
                                <div className="flex items-center gap-2">
                                  {getTaskIcon(resource.type)}
                                  <div className="flex-1">
                                    <p className="text-sm font-medium">{resource.title}</p>
                                    {resource.duration && (
                                      <p className="text-xs text-muted-foreground">{resource.duration}</p>
                                    )}
                                  </div>
                                  <Badge variant="outline">{resource.type}</Badge>
                                </div>
                              </Card>
                            ))}
                          </div>
                        )}

                        {message.suggestions && message.suggestions.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {message.suggestions.map((suggestion, index) => (
                              <Button
                                key={index}
                                variant="outline"
                                size="sm"
                                className="text-xs h-7"
                                onClick={() => handleSuggestionClick(suggestion)}
                              >
                                {suggestion}
                              </Button>
                            ))}
                          </div>
                        )}

                        <p className="text-xs text-muted-foreground mt-1">{message.timestamp.toLocaleTimeString()}</p>
                      </div>

                      {message.type === "user" && (
                        <Avatar className="w-8 h-8">
                          <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                          <Bot className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-muted rounded-lg p-3">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                          <div
                            className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          />
                          <div
                            className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div ref={messagesEndRef} />
              </ScrollArea>

              <div className="border-t p-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Ask me anything about your studies..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && sendMessage(inputValue)}
                    disabled={isLoading}
                  />
                  <Button onClick={() => sendMessage(inputValue)} disabled={isLoading || !inputValue.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="plans">
          <div className="space-y-6">
            {studyPlans.map((plan) => (
              <Card key={plan.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5" />
                        {plan.title}
                      </CardTitle>
                      <p className="text-muted-foreground">{plan.description}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline">{plan.difficulty}</Badge>
                      <p className="text-sm text-muted-foreground mt-1">
                        <Clock className="h-3 w-3 inline mr-1" />
                        {plan.estimatedTime}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{Math.round(calculatePlanProgress(plan))}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${calculatePlanProgress(plan)}%` }}
                      />
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-3">
                    {plan.tasks.map((task) => (
                      <div
                        key={task.id}
                        className={`flex items-center gap-3 p-3 rounded-lg border ${
                          task.completed ? "bg-green-50 border-green-200" : "bg-background"
                        }`}
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-0 h-auto"
                          onClick={() => toggleTaskCompletion(plan.id, task.id)}
                        >
                          {task.completed ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : (
                            <div className="h-5 w-5 rounded-full border-2 border-muted-foreground" />
                          )}
                        </Button>

                        <div className="flex-1">
                          <h4 className={`font-medium ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                            {task.title}
                          </h4>
                          <p className="text-sm text-muted-foreground">{task.description}</p>
                        </div>

                        <div className="text-right">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            {getTaskIcon(task.type)}
                            <span>{task.type}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">{task.estimatedTime}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="insights">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Learning Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Study Streak</span>
                    <Badge variant="outline">7 days</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Total Study Time</span>
                    <span className="font-medium">24 hours</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Completed Tasks</span>
                    <span className="font-medium">12/20</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Average Session</span>
                    <span className="font-medium">45 minutes</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Take a break</p>
                      <p className="text-xs text-muted-foreground">
                        You've been studying for 2 hours. Consider a 15-minute break.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Great progress!</p>
                      <p className="text-xs text-muted-foreground">
                        You're ahead of schedule on your React study plan.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Lightbulb className="h-4 w-4 text-blue-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Try practice exercises</p>
                      <p className="text-xs text-muted-foreground">
                        Reinforce your learning with hands-on coding practice.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
