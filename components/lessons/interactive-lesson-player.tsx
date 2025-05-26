"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useInView } from "react-intersection-observer"
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  BookOpen,
  FileText,
  ImageIcon,
  Code,
  PenTool,
  CheckCircle,
  HelpCircle,
  Award,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import InteractiveQuiz from "./interactive-quiz"
import CodePlayground from "./code-playground"
import DragDropExercise from "./drag-drop-exercise"
import TextToSpeech from "../accessibility/text-to-speech"
import { useTheme } from "next-themes"

interface LessonContent {
  id: string
  type: "text" | "video" | "image" | "code" | "quiz" | "exercise" | "attachment"
  title: string
  content: string
  videoUrl?: string
  imageUrl?: string
  codeLanguage?: string
  codeSnippet?: string
  attachmentUrl?: string
  quizData?: any
  exerciseData?: any
  duration?: number
}

interface InteractiveLessonPlayerProps {
  lessonId: string
  lessonTitle: string
  lessonDescription: string
  contents: LessonContent[]
  onComplete: () => void
  initialProgress?: number
}

export default function InteractiveLessonPlayer({
  lessonId,
  lessonTitle,
  lessonDescription,
  contents,
  onComplete,
  initialProgress = 0,
}: InteractiveLessonPlayerProps) {
  const { toast } = useToast()
  const { theme } = useTheme()
  const [activeContentIndex, setActiveContentIndex] = useState(0)
  const [progress, setProgress] = useState(initialProgress)
  const [completedContents, setCompletedContents] = useState<string[]>([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(0.7)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [showControls, setShowControls] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const playerRef = useRef<HTMLDivElement>(null)
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [ref, inView] = useInView({
    threshold: 0.5,
    triggerOnce: true,
  })

  const activeContent = contents[activeContentIndex]

  useEffect(() => {
    // Mark content as viewed when in view for more than 5 seconds
    if (inView && activeContent && !completedContents.includes(activeContent.id)) {
      const timer = setTimeout(() => {
        handleContentComplete(activeContent.id)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [inView, activeContent])

  useEffect(() => {
    // Calculate overall progress
    const progressPercentage = (completedContents.length / contents.length) * 100
    setProgress(progressPercentage)

    // If all contents are completed, mark lesson as complete
    if (progressPercentage >= 100) {
      onComplete()
    }
  }, [completedContents, contents.length])

  const handleContentComplete = (contentId: string) => {
    if (!completedContents.includes(contentId)) {
      setCompletedContents((prev) => [...prev, contentId])

      toast({
        title: "Progress saved",
        description: "Your progress has been updated",
        duration: 2000,
      })
    }
  }

  const handleNext = () => {
    if (activeContentIndex < contents.length - 1) {
      setActiveContentIndex(activeContentIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (activeContentIndex > 0) {
      setActiveContentIndex(activeContentIndex - 1)
    }
  }

  const handleVideoProgress = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget
    setCurrentTime(video.currentTime)

    // Mark video as completed when watched more than 90%
    if (video.currentTime / video.duration > 0.9 && activeContent) {
      handleContentComplete(activeContent.id)
    }
  }

  const handleVideoPlay = () => {
    setIsPlaying(true)

    // Hide controls after 3 seconds of playing
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current)
    }

    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false)
    }, 3000)
  }

  const handleVideoPause = () => {
    setIsPlaying(false)
    setShowControls(true)
  }

  const handleMouseMove = () => {
    setShowControls(true)

    if (isPlaying && controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current)

      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false)
      }, 3000)
    }
  }

  const toggleFullscreen = () => {
    if (!playerRef.current) return

    if (!document.fullscreenElement) {
      playerRef.current
        .requestFullscreen()
        .then(() => {
          setIsFullscreen(true)
        })
        .catch((err) => {
          toast({
            title: "Fullscreen error",
            description: `Error attempting to enable fullscreen: ${err.message}`,
            variant: "destructive",
          })
        })
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  const renderContentByType = (content: LessonContent) => {
    switch (content.type) {
      case "text":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="prose prose-lg dark:prose-invert max-w-none"
            ref={ref}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold m-0">{content.title}</h2>
              <TextToSpeech text={content.content} />
            </div>
            <div dangerouslySetInnerHTML={{ __html: content.content }} />
          </motion.div>
        )

      case "video":
        return (
          <div
            className="relative aspect-video bg-black rounded-lg overflow-hidden"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => isPlaying && setShowControls(false)}
            ref={playerRef}
          >
            <video
              ref={videoRef}
              src={content.videoUrl}
              className="w-full h-full"
              onTimeUpdate={handleVideoProgress}
              onPlay={handleVideoPlay}
              onPause={handleVideoPause}
              onDurationChange={(e) => setDuration(e.currentTarget.duration)}
              muted={isMuted}
              playsInline
              controls={false}
            />

            {/* Custom Video Controls */}
            <div
              className={cn(
                "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity",
                showControls ? "opacity-100" : "opacity-0",
              )}
            >
              <div className="mb-2">
                <Progress
                  value={(currentTime / duration) * 100}
                  className="h-1 cursor-pointer"
                  onClick={(e) => {
                    if (!videoRef.current) return
                    const rect = e.currentTarget.getBoundingClientRect()
                    const pos = (e.clientX - rect.left) / rect.width
                    videoRef.current.currentTime = pos * duration
                  }}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-white hover:bg-white/20"
                    onClick={() => {
                      if (videoRef.current) {
                        if (isPlaying) {
                          videoRef.current.pause()
                        } else {
                          videoRef.current.play()
                        }
                      }
                    }}
                  >
                    {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-white hover:bg-white/20"
                    onClick={() => setIsMuted(!isMuted)}
                  >
                    {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                  </Button>

                  <span className="text-xs text-white">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-white hover:bg-white/20"
                  onClick={toggleFullscreen}
                >
                  <Maximize className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        )

      case "image":
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
            ref={ref}
          >
            <h3 className="text-xl font-semibold">{content.title}</h3>
            <figure className="relative">
              <img
                src={content.imageUrl || "/placeholder.svg?height=400&width=600"}
                alt={content.title}
                className="rounded-lg w-full object-cover max-h-[600px]"
              />
              <figcaption className="text-sm text-muted-foreground mt-2">{content.content}</figcaption>
            </figure>
          </motion.div>
        )

      case "code":
        return (
          <div className="space-y-4" ref={ref}>
            <h3 className="text-xl font-semibold">{content.title}</h3>
            <CodePlayground
              language={content.codeLanguage || "javascript"}
              code={content.codeSnippet || "// Your code here"}
              editable={true}
              onComplete={() => handleContentComplete(content.id)}
            />
          </div>
        )

      case "quiz":
        return (
          <div className="space-y-4" ref={ref}>
            <InteractiveQuiz
              title={content.title}
              quizData={content.quizData || []}
              onComplete={() => handleContentComplete(content.id)}
            />
          </div>
        )

      case "exercise":
        return (
          <div className="space-y-4" ref={ref}>
            <h3 className="text-xl font-semibold">{content.title}</h3>
            <DragDropExercise
              exerciseData={content.exerciseData || {}}
              onComplete={() => handleContentComplete(content.id)}
            />
          </div>
        )

      case "attachment":
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4" ref={ref}>
            <h3 className="text-xl font-semibold">{content.title}</h3>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{content.title}</p>
                    <p className="text-sm text-muted-foreground">{content.content}</p>
                  </div>
                  <Button asChild>
                    <a href={content.attachmentUrl} download target="_blank" rel="noopener noreferrer">
                      Download
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )

      default:
        return <div>Unsupported content type</div>
    }
  }

  const getContentIcon = (type: string) => {
    switch (type) {
      case "text":
        return <BookOpen className="h-4 w-4" />
      case "video":
        return <Play className="h-4 w-4" />
      case "image":
        return <ImageIcon className="h-4 w-4" />
      case "code":
        return <Code className="h-4 w-4" />
      case "quiz":
        return <HelpCircle className="h-4 w-4" />
      case "exercise":
        return <PenTool className="h-4 w-4" />
      case "attachment":
        return <FileText className="h-4 w-4" />
      default:
        return <BookOpen className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">{lessonTitle}</h1>
          <p className="text-muted-foreground">{lessonDescription}</p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-sm">
            {formatTime(contents.reduce((acc, content) => acc + (content.duration || 0), 0))} total
          </Badge>
          <Badge variant="outline" className="text-sm">
            {contents.length} sections
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-8">
          <Card className="overflow-hidden border-primary/10">
            <CardContent className="p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeContentIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderContentByType(activeContent)}
                </motion.div>
              </AnimatePresence>
            </CardContent>
          </Card>

          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={handlePrevious} disabled={activeContentIndex === 0} className="gap-2">
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            <div className="text-sm text-muted-foreground">
              {activeContentIndex + 1} of {contents.length}
            </div>

            <Button onClick={handleNext} disabled={activeContentIndex === contents.length - 1} className="gap-2">
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            <Card>
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Your Progress</h3>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{Math.round(progress)}% complete</span>
                      <span>
                        {completedContents.length}/{contents.length}
                      </span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-medium mb-2">Lesson Contents</h3>
                    <ScrollArea className="h-[300px] pr-4">
                      <ul className="space-y-2">
                        {contents.map((content, index) => (
                          <li key={content.id}>
                            <Button
                              variant={activeContentIndex === index ? "default" : "ghost"}
                              className={cn(
                                "w-full justify-start text-left h-auto py-2 px-3",
                                completedContents.includes(content.id) && "border-green-500",
                              )}
                              onClick={() => setActiveContentIndex(index)}
                            >
                              <div className="flex items-start gap-3">
                                <div className="mt-0.5">
                                  {completedContents.includes(content.id) ? (
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                  ) : (
                                    getContentIcon(content.type)
                                  )}
                                </div>
                                <div>
                                  <div className="font-medium">{content.title}</div>
                                  <div className="text-xs text-muted-foreground flex items-center gap-2">
                                    <Badge variant="outline" className="text-xs">
                                      {content.type}
                                    </Badge>
                                    {content.duration && <span>{formatTime(content.duration)}</span>}
                                  </div>
                                </div>
                              </div>
                            </Button>
                          </li>
                        ))}
                      </ul>
                    </ScrollArea>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Award className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Complete this lesson</h3>
                    <p className="text-sm text-muted-foreground">Earn points and track your progress</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
