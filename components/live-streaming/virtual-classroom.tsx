"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Monitor,
  Users,
  MessageSquare,
  Hand,
  Settings,
  Maximize,
  Minimize,
  Share,
  RepeatIcon as Record,
  FileText,
  PenTool,
  Eraser,
  Square,
  Circle,
  Type,
  Download,
  Upload,
  Clock,
  Wifi,
  WifiOff,
  Plus,
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface Participant {
  id: string
  name: string
  avatar?: string
  role: "instructor" | "student" | "moderator"
  isVideoOn: boolean
  isAudioOn: boolean
  isHandRaised: boolean
  connectionStatus: "connected" | "connecting" | "disconnected"
}

interface ChatMessage {
  id: string
  userId: string
  userName: string
  message: string
  timestamp: Date
  type: "message" | "system" | "poll" | "quiz"
}

interface WhiteboardElement {
  id: string
  type: "line" | "rectangle" | "circle" | "text"
  x: number
  y: number
  width?: number
  height?: number
  color: string
  strokeWidth: number
  text?: string
}

interface Poll {
  id: string
  question: string
  options: string[]
  votes: { [option: string]: string[] }
  isActive: boolean
  createdAt: Date
}

export default function VirtualClassroom() {
  const [isInstructor, setIsInstructor] = useState(false)
  const [participants, setParticipants] = useState<Participant[]>([])
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isVideoOn, setIsVideoOn] = useState(false)
  const [isAudioOn, setIsAudioOn] = useState(false)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [isHandRaised, setIsHandRaised] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "connecting" | "disconnected">("connected")
  const [whiteboardElements, setWhiteboardElements] = useState<WhiteboardElement[]>([])
  const [selectedTool, setSelectedTool] = useState<"pen" | "eraser" | "rectangle" | "circle" | "text">("pen")
  const [selectedColor, setSelectedColor] = useState("#000000")
  const [strokeWidth, setStrokeWidth] = useState(2)
  const [polls, setPolls] = useState<Poll[]>([])
  const [showPollDialog, setShowPollDialog] = useState(false)
  const [newPoll, setNewPoll] = useState({ question: "", options: ["", ""] })
  const [activeTab, setActiveTab] = useState("video")
  const [isFullscreen, setIsFullscreen] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    // Mock participants data
    const mockParticipants: Participant[] = [
      {
        id: "1",
        name: "Dr. Sarah Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "instructor",
        isVideoOn: true,
        isAudioOn: true,
        isHandRaised: false,
        connectionStatus: "connected",
      },
      {
        id: "2",
        name: "Mike Chen",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "student",
        isVideoOn: true,
        isAudioOn: false,
        isHandRaised: true,
        connectionStatus: "connected",
      },
      {
        id: "3",
        name: "Emma Davis",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "student",
        isVideoOn: false,
        isAudioOn: true,
        isHandRaised: false,
        connectionStatus: "connected",
      },
      {
        id: "4",
        name: "Alex Rodriguez",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "student",
        isVideoOn: true,
        isAudioOn: true,
        isHandRaised: false,
        connectionStatus: "connecting",
      },
    ]

    const mockMessages: ChatMessage[] = [
      {
        id: "1",
        userId: "1",
        userName: "Dr. Sarah Johnson",
        message: "Welcome everyone! Today we'll be covering React Hooks in detail.",
        timestamp: new Date(Date.now() - 300000),
        type: "message",
      },
      {
        id: "2",
        userId: "2",
        userName: "Mike Chen",
        message: "Thank you! I'm excited to learn about useEffect.",
        timestamp: new Date(Date.now() - 240000),
        type: "message",
      },
      {
        id: "3",
        userId: "system",
        userName: "System",
        message: "Emma Davis joined the classroom",
        timestamp: new Date(Date.now() - 180000),
        type: "system",
      },
    ]

    setParticipants(mockParticipants)
    setChatMessages(mockMessages)
  }, [])

  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn)
    toast({
      title: isVideoOn ? "Camera turned off" : "Camera turned on",
      description: `Your camera is now ${isVideoOn ? "disabled" : "enabled"}`,
    })
  }

  const toggleAudio = () => {
    setIsAudioOn(!isAudioOn)
    toast({
      title: isAudioOn ? "Microphone muted" : "Microphone unmuted",
      description: `Your microphone is now ${isAudioOn ? "muted" : "unmuted"}`,
    })
  }

  const toggleScreenShare = () => {
    setIsScreenSharing(!isScreenSharing)
    toast({
      title: isScreenSharing ? "Screen sharing stopped" : "Screen sharing started",
      description: `Screen sharing is now ${isScreenSharing ? "disabled" : "enabled"}`,
    })
  }

  const toggleRecording = () => {
    setIsRecording(!isRecording)
    toast({
      title: isRecording ? "Recording stopped" : "Recording started",
      description: `Class recording is now ${isRecording ? "stopped" : "active"}`,
    })
  }

  const raiseHand = () => {
    setIsHandRaised(!isHandRaised)
    toast({
      title: isHandRaised ? "Hand lowered" : "Hand raised",
      description: isHandRaised ? "Your hand has been lowered" : "Your hand is raised",
    })
  }

  const sendMessage = () => {
    if (!newMessage.trim()) return

    const message: ChatMessage = {
      id: Date.now().toString(),
      userId: "current-user",
      userName: "You",
      message: newMessage,
      timestamp: new Date(),
      type: "message",
    }

    setChatMessages((prev) => [...prev, message])
    setNewMessage("")
  }

  const createPoll = () => {
    if (!newPoll.question || newPoll.options.some((opt) => !opt.trim())) {
      toast({
        title: "Invalid poll",
        description: "Please provide a question and at least two options",
        variant: "destructive",
      })
      return
    }

    const poll: Poll = {
      id: Date.now().toString(),
      question: newPoll.question,
      options: newPoll.options.filter((opt) => opt.trim()),
      votes: {},
      isActive: true,
      createdAt: new Date(),
    }

    setPolls((prev) => [...prev, poll])
    setShowPollDialog(false)
    setNewPoll({ question: "", options: ["", ""] })

    toast({
      title: "Poll created",
      description: "Your poll has been shared with the class",
    })
  }

  const votePoll = (pollId: string, option: string) => {
    setPolls((prev) =>
      prev.map((poll) => {
        if (poll.id === pollId) {
          const newVotes = { ...poll.votes }
          if (!newVotes[option]) newVotes[option] = []
          if (!newVotes[option].includes("current-user")) {
            // Remove user from other options
            Object.keys(newVotes).forEach((key) => {
              newVotes[key] = newVotes[key].filter((userId) => userId !== "current-user")
            })
            // Add to selected option
            newVotes[option].push("current-user")
          }
          return { ...poll, votes: newVotes }
        }
        return poll
      }),
    )
  }

  const getConnectionIcon = (status: string) => {
    switch (status) {
      case "connected":
        return <Wifi className="h-3 w-3 text-green-500" />
      case "connecting":
        return <Wifi className="h-3 w-3 text-yellow-500" />
      case "disconnected":
        return <WifiOff className="h-3 w-3 text-red-500" />
      default:
        return <Wifi className="h-3 w-3 text-gray-500" />
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 p-4 flex items-center justify-between border-b border-gray-700">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold">React Hooks Masterclass</h1>
          <Badge variant="outline" className="bg-red-500 text-white border-red-500">
            <Circle className="h-2 w-2 mr-1 fill-current" />
            LIVE
          </Badge>
          {isRecording && (
            <Badge variant="outline" className="bg-red-600 text-white border-red-600">
              <Record className="h-3 w-3 mr-1" />
              REC
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-300">
            <Clock className="h-4 w-4 inline mr-1" />
            {formatTime(new Date())}
          </span>
          <Badge variant="outline" className="text-gray-300 border-gray-600">
            <Users className="h-3 w-3 mr-1" />
            {participants.length} participants
          </Badge>
          {getConnectionIcon(connectionStatus)}
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="bg-gray-800 border-b border-gray-700 rounded-none justify-start">
              <TabsTrigger value="video" className="data-[state=active]:bg-gray-700">
                <Video className="h-4 w-4 mr-2" />
                Video
              </TabsTrigger>
              <TabsTrigger value="whiteboard" className="data-[state=active]:bg-gray-700">
                <PenTool className="h-4 w-4 mr-2" />
                Whiteboard
              </TabsTrigger>
              <TabsTrigger value="screen" className="data-[state=active]:bg-gray-700">
                <Monitor className="h-4 w-4 mr-2" />
                Screen Share
              </TabsTrigger>
            </TabsList>

            <TabsContent value="video" className="flex-1 p-4">
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 h-full">
                {participants.map((participant) => (
                  <Card key={participant.id} className="bg-gray-800 border-gray-700 relative">
                    <CardContent className="p-0 h-full">
                      <div className="relative h-full bg-gray-900 rounded-lg overflow-hidden">
                        {participant.isVideoOn ? (
                          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                            <span className="text-2xl font-bold">{participant.name.charAt(0)}</span>
                          </div>
                        ) : (
                          <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                            <VideoOff className="h-8 w-8 text-gray-400" />
                          </div>
                        )}

                        {/* Participant Info */}
                        <div className="absolute bottom-2 left-2 right-2">
                          <div className="bg-black/50 rounded px-2 py-1 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium truncate">{participant.name}</span>
                              {participant.role === "instructor" && (
                                <Badge variant="outline" className="text-xs bg-blue-600 border-blue-600">
                                  Instructor
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-1">
                              {participant.isHandRaised && <Hand className="h-3 w-3 text-yellow-400" />}
                              {participant.isAudioOn ? (
                                <Mic className="h-3 w-3 text-green-400" />
                              ) : (
                                <MicOff className="h-3 w-3 text-red-400" />
                              )}
                              {getConnectionIcon(participant.connectionStatus)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="whiteboard" className="flex-1 p-4">
              <div className="h-full flex flex-col">
                {/* Whiteboard Tools */}
                <div className="bg-gray-800 p-3 rounded-t-lg border border-gray-700">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant={selectedTool === "pen" ? "default" : "outline"}
                        onClick={() => setSelectedTool("pen")}
                      >
                        <PenTool className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant={selectedTool === "eraser" ? "default" : "outline"}
                        onClick={() => setSelectedTool("eraser")}
                      >
                        <Eraser className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant={selectedTool === "rectangle" ? "default" : "outline"}
                        onClick={() => setSelectedTool("rectangle")}
                      >
                        <Square className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant={selectedTool === "circle" ? "default" : "outline"}
                        onClick={() => setSelectedTool("circle")}
                      >
                        <Circle className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant={selectedTool === "text" ? "default" : "outline"}
                        onClick={() => setSelectedTool("text")}
                      >
                        <Type className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={selectedColor}
                        onChange={(e) => setSelectedColor(e.target.value)}
                        className="w-8 h-8 rounded border border-gray-600"
                      />
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={strokeWidth}
                        onChange={(e) => setStrokeWidth(Number(e.target.value))}
                        className="w-20"
                      />
                    </div>

                    <div className="flex items-center gap-2 ml-auto">
                      <Button size="sm" variant="outline">
                        <Upload className="h-4 w-4 mr-2" />
                        Import
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Whiteboard Canvas */}
                <div className="flex-1 bg-white rounded-b-lg border border-gray-700 border-t-0">
                  <canvas ref={canvasRef} className="w-full h-full cursor-crosshair" width={800} height={600} />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="screen" className="flex-1 p-4">
              <Card className="h-full bg-gray-800 border-gray-700">
                <CardContent className="p-0 h-full">
                  <div className="h-full bg-gray-900 rounded-lg flex items-center justify-center">
                    {isScreenSharing ? (
                      <div className="text-center">
                        <Monitor className="h-16 w-16 mx-auto mb-4 text-blue-400" />
                        <h3 className="text-xl font-medium mb-2">Screen Sharing Active</h3>
                        <p className="text-gray-400">Your screen is being shared with the class</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Monitor className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                        <h3 className="text-xl font-medium mb-2">No Screen Share</h3>
                        <p className="text-gray-400 mb-4">Click the share button to start sharing your screen</p>
                        <Button onClick={toggleScreenShare}>
                          <Share className="h-4 w-4 mr-2" />
                          Start Sharing
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Controls */}
          <div className="bg-gray-800 p-4 border-t border-gray-700">
            <div className="flex items-center justify-center gap-4">
              <Button
                size="lg"
                variant={isVideoOn ? "default" : "outline"}
                onClick={toggleVideo}
                className={isVideoOn ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-600 hover:bg-gray-700"}
              >
                {isVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
              </Button>

              <Button
                size="lg"
                variant={isAudioOn ? "default" : "outline"}
                onClick={toggleAudio}
                className={isAudioOn ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}
              >
                {isAudioOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
              </Button>

              <Button
                size="lg"
                variant={isScreenSharing ? "default" : "outline"}
                onClick={toggleScreenShare}
                className={isScreenSharing ? "bg-purple-600 hover:bg-purple-700" : ""}
              >
                <Monitor className="h-5 w-5" />
              </Button>

              <Button
                size="lg"
                variant={isHandRaised ? "default" : "outline"}
                onClick={raiseHand}
                className={isHandRaised ? "bg-yellow-600 hover:bg-yellow-700" : ""}
              >
                <Hand className="h-5 w-5" />
              </Button>

              {isInstructor && (
                <Button
                  size="lg"
                  variant={isRecording ? "default" : "outline"}
                  onClick={toggleRecording}
                  className={isRecording ? "bg-red-600 hover:bg-red-700" : ""}
                >
                  <Record className="h-5 w-5" />
                </Button>
              )}

              <Button size="lg" variant="outline">
                <Settings className="h-5 w-5" />
              </Button>

              <Button size="lg" variant="outline" onClick={() => setIsFullscreen(!isFullscreen)}>
                {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
          <Tabs defaultValue="chat" className="flex-1 flex flex-col">
            <TabsList className="bg-gray-700 rounded-none">
              <TabsTrigger value="chat" className="flex-1">
                <MessageSquare className="h-4 w-4 mr-2" />
                Chat
              </TabsTrigger>
              <TabsTrigger value="participants" className="flex-1">
                <Users className="h-4 w-4 mr-2" />
                People
              </TabsTrigger>
              <TabsTrigger value="polls" className="flex-1">
                <FileText className="h-4 w-4 mr-2" />
                Polls
              </TabsTrigger>
            </TabsList>

            <TabsContent value="chat" className="flex-1 flex flex-col p-0">
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-3">
                  {chatMessages.map((message) => (
                    <div key={message.id} className="space-y-1">
                      {message.type === "system" ? (
                        <div className="text-center text-sm text-gray-400 italic">{message.message}</div>
                      ) : (
                        <div>
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            <span className="font-medium">{message.userName}</span>
                            <span>{formatTime(message.timestamp)}</span>
                          </div>
                          <div className="text-sm">{message.message}</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="p-4 border-t border-gray-700">
                <div className="flex gap-2">
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                    className="bg-gray-700 border-gray-600"
                  />
                  <Button onClick={sendMessage} size="sm">
                    Send
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="participants" className="flex-1 p-4">
              <div className="space-y-3">
                {participants.map((participant) => (
                  <div key={participant.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-sm font-bold">
                      {participant.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{participant.name}</span>
                        {participant.role === "instructor" && (
                          <Badge variant="outline" className="text-xs bg-blue-600 border-blue-600">
                            Instructor
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        {participant.isHandRaised && <Hand className="h-3 w-3 text-yellow-400" />}
                        {participant.isAudioOn ? (
                          <Mic className="h-3 w-3 text-green-400" />
                        ) : (
                          <MicOff className="h-3 w-3 text-red-400" />
                        )}
                        {participant.isVideoOn ? (
                          <Video className="h-3 w-3 text-green-400" />
                        ) : (
                          <VideoOff className="h-3 w-3 text-red-400" />
                        )}
                        {getConnectionIcon(participant.connectionStatus)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="polls" className="flex-1 p-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Live Polls</h3>
                  {isInstructor && (
                    <Dialog open={showPollDialog} onOpenChange={setShowPollDialog}>
                      <DialogTrigger asChild>
                        <Button size="sm">
                          <Plus className="h-4 w-4 mr-2" />
                          Create Poll
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-gray-800 border-gray-700">
                        <DialogHeader>
                          <DialogTitle>Create Poll</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium">Question</label>
                            <Textarea
                              placeholder="Enter your poll question"
                              value={newPoll.question}
                              onChange={(e) => setNewPoll((prev) => ({ ...prev, question: e.target.value }))}
                              className="bg-gray-700 border-gray-600"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium">Options</label>
                            {newPoll.options.map((option, index) => (
                              <Input
                                key={index}
                                placeholder={`Option ${index + 1}`}
                                value={option}
                                onChange={(e) => {
                                  const newOptions = [...newPoll.options]
                                  newOptions[index] = e.target.value
                                  setNewPoll((prev) => ({ ...prev, options: newOptions }))
                                }}
                                className="mt-2 bg-gray-700 border-gray-600"
                              />
                            ))}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setNewPoll((prev) => ({ ...prev, options: [...prev.options, ""] }))}
                              className="mt-2"
                            >
                              Add Option
                            </Button>
                          </div>
                          <div className="flex gap-2">
                            <Button onClick={createPoll} className="flex-1">
                              Create Poll
                            </Button>
                            <Button variant="outline" onClick={() => setShowPollDialog(false)}>
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>

                <div className="space-y-4">
                  {polls.map((poll) => (
                    <Card key={poll.id} className="bg-gray-700 border-gray-600">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">{poll.question}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {poll.options.map((option) => {
                          const votes = poll.votes[option]?.length || 0
                          const totalVotes = Object.values(poll.votes).reduce((sum, v) => sum + v.length, 0)
                          const percentage = totalVotes > 0 ? (votes / totalVotes) * 100 : 0

                          return (
                            <Button
                              key={option}
                              variant="outline"
                              className="w-full justify-between text-left h-auto p-3"
                              onClick={() => votePoll(poll.id, option)}
                            >
                              <span>{option}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-xs">{votes} votes</span>
                                <div className="w-16 h-2 bg-gray-600 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-blue-500 transition-all"
                                    style={{ width: `${percentage}%` }}
                                  />
                                </div>
                              </div>
                            </Button>
                          )
                        })}
                      </CardContent>
                    </Card>
                  ))}

                  {polls.length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                      <FileText className="h-12 w-12 mx-auto mb-4" />
                      <p>No active polls</p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
