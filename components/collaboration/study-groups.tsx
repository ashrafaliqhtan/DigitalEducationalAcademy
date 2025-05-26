"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Users,
  Plus,
  Search,
  MessageCircle,
  Calendar,
  BookOpen,
  Video,
  Globe,
  Lock,
  UserPlus,
  Settings,
  Clock,
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface StudyGroup {
  id: string
  name: string
  description: string
  subject: string
  level: "beginner" | "intermediate" | "advanced"
  privacy: "public" | "private"
  memberCount: number
  maxMembers: number
  createdBy: string
  createdAt: string
  tags: string[]
  nextSession?: {
    date: string
    time: string
    topic: string
    type: "discussion" | "study" | "project"
  }
  members: GroupMember[]
  isJoined: boolean
}

interface GroupMember {
  id: string
  name: string
  avatar?: string
  role: "admin" | "moderator" | "member"
  joinedAt: string
  lastActive: string
}

interface StudySession {
  id: string
  groupId: string
  title: string
  description: string
  date: string
  time: string
  duration: number
  type: "discussion" | "study" | "project" | "quiz"
  host: string
  attendees: string[]
  maxAttendees: number
  isRecurring: boolean
  meetingLink?: string
}

export default function StudyGroups() {
  const [studyGroups, setStudyGroups] = useState<StudyGroup[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSubject, setSelectedSubject] = useState("all")
  const [selectedLevel, setSelectedLevel] = useState("all")
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [activeTab, setActiveTab] = useState("discover")
  const [newGroup, setNewGroup] = useState({
    name: "",
    description: "",
    subject: "",
    level: "beginner" as const,
    privacy: "public" as const,
    maxMembers: 20,
    tags: [] as string[],
  })
  const { toast } = useToast()

  useEffect(() => {
    // Mock data
    const mockGroups: StudyGroup[] = [
      {
        id: "1",
        name: "React Developers Circle",
        description:
          "A community for React developers to share knowledge, discuss best practices, and work on projects together.",
        subject: "Programming",
        level: "intermediate",
        privacy: "public",
        memberCount: 45,
        maxMembers: 50,
        createdBy: "Sarah Johnson",
        createdAt: "2024-01-15",
        tags: ["react", "javascript", "frontend"],
        nextSession: {
          date: "2024-01-25",
          time: "19:00",
          topic: "React Hooks Deep Dive",
          type: "discussion",
        },
        isJoined: true,
        members: [
          {
            id: "1",
            name: "Sarah Johnson",
            avatar: "/placeholder.svg?height=32&width=32",
            role: "admin",
            joinedAt: "2024-01-15",
            lastActive: "2024-01-24",
          },
          {
            id: "2",
            name: "Mike Chen",
            avatar: "/placeholder.svg?height=32&width=32",
            role: "moderator",
            joinedAt: "2024-01-16",
            lastActive: "2024-01-24",
          },
        ],
      },
      {
        id: "2",
        name: "UI/UX Design Fundamentals",
        description:
          "Learn the basics of user interface and user experience design through collaborative projects and peer feedback.",
        subject: "Design",
        level: "beginner",
        privacy: "public",
        memberCount: 32,
        maxMembers: 40,
        createdBy: "Emma Davis",
        createdAt: "2024-01-10",
        tags: ["ui", "ux", "design", "figma"],
        nextSession: {
          date: "2024-01-26",
          time: "18:00",
          topic: "Design System Workshop",
          type: "project",
        },
        isJoined: false,
        members: [],
      },
      {
        id: "3",
        name: "Advanced JavaScript Concepts",
        description:
          "Dive deep into advanced JavaScript topics including closures, prototypes, async programming, and performance optimization.",
        subject: "Programming",
        level: "advanced",
        privacy: "private",
        memberCount: 15,
        maxMembers: 20,
        createdBy: "Alex Rodriguez",
        createdAt: "2024-01-08",
        tags: ["javascript", "advanced", "performance"],
        isJoined: false,
        members: [],
      },
      {
        id: "4",
        name: "Data Science Study Group",
        description:
          "Collaborative learning environment for data science enthusiasts. We cover Python, statistics, machine learning, and data visualization.",
        subject: "Data Science",
        level: "intermediate",
        privacy: "public",
        memberCount: 28,
        maxMembers: 35,
        createdBy: "Dr. Lisa Wang",
        createdAt: "2024-01-12",
        tags: ["python", "statistics", "ml", "data"],
        nextSession: {
          date: "2024-01-27",
          time: "20:00",
          topic: "Machine Learning Algorithms",
          type: "study",
        },
        isJoined: true,
        members: [],
      },
    ]

    setStudyGroups(mockGroups)
  }, [])

  const filteredGroups = studyGroups.filter((group) => {
    const matchesSearch =
      group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesSubject = selectedSubject === "all" || group.subject === selectedSubject
    const matchesLevel = selectedLevel === "all" || group.level === selectedLevel

    return matchesSearch && matchesSubject && matchesLevel
  })

  const myGroups = studyGroups.filter((group) => group.isJoined)

  const joinGroup = (groupId: string) => {
    setStudyGroups((prev) =>
      prev.map((group) =>
        group.id === groupId ? { ...group, isJoined: true, memberCount: group.memberCount + 1 } : group,
      ),
    )

    toast({
      title: "Joined study group",
      description: "You've successfully joined the study group!",
    })
  }

  const leaveGroup = (groupId: string) => {
    setStudyGroups((prev) =>
      prev.map((group) =>
        group.id === groupId ? { ...group, isJoined: false, memberCount: group.memberCount - 1 } : group,
      ),
    )

    toast({
      title: "Left study group",
      description: "You've left the study group.",
    })
  }

  const createGroup = () => {
    if (!newGroup.name || !newGroup.description || !newGroup.subject) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const group: StudyGroup = {
      id: Date.now().toString(),
      ...newGroup,
      memberCount: 1,
      createdBy: "You",
      createdAt: new Date().toISOString().split("T")[0],
      isJoined: true,
      members: [],
    }

    setStudyGroups((prev) => [group, ...prev])
    setShowCreateDialog(false)
    setNewGroup({
      name: "",
      description: "",
      subject: "",
      level: "beginner",
      privacy: "public",
      maxMembers: 20,
      tags: [],
    })

    toast({
      title: "Study group created",
      description: "Your study group has been created successfully!",
    })
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case "beginner":
        return "bg-green-100 text-green-800"
      case "intermediate":
        return "bg-yellow-100 text-yellow-800"
      case "advanced":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getSessionTypeIcon = (type: string) => {
    switch (type) {
      case "discussion":
        return <MessageCircle className="h-4 w-4" />
      case "study":
        return <BookOpen className="h-4 w-4" />
      case "project":
        return <Settings className="h-4 w-4" />
      case "quiz":
        return <Clock className="h-4 w-4" />
      default:
        return <Calendar className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Study Groups</h1>
          <p className="text-muted-foreground">Connect with peers and learn together</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Group
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create Study Group</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Group Name</label>
                <Input
                  placeholder="Enter group name"
                  value={newGroup.name}
                  onChange={(e) => setNewGroup((prev) => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  placeholder="Describe your study group"
                  value={newGroup.description}
                  onChange={(e) => setNewGroup((prev) => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Subject</label>
                  <Select
                    value={newGroup.subject}
                    onValueChange={(value) => setNewGroup((prev) => ({ ...prev, subject: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Programming">Programming</SelectItem>
                      <SelectItem value="Design">Design</SelectItem>
                      <SelectItem value="Data Science">Data Science</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Business">Business</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Level</label>
                  <Select
                    value={newGroup.level}
                    onValueChange={(value: any) => setNewGroup((prev) => ({ ...prev, level: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Privacy</label>
                  <Select
                    value={newGroup.privacy}
                    onValueChange={(value: any) => setNewGroup((prev) => ({ ...prev, privacy: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Max Members</label>
                  <Input
                    type="number"
                    min="5"
                    max="100"
                    value={newGroup.maxMembers}
                    onChange={(e) => setNewGroup((prev) => ({ ...prev, maxMembers: Number(e.target.value) }))}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={createGroup} className="flex-1">
                  Create Group
                </Button>
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="discover">Discover</TabsTrigger>
          <TabsTrigger value="my-groups">My Groups ({myGroups.length})</TabsTrigger>
          <TabsTrigger value="sessions">Upcoming Sessions</TabsTrigger>
        </TabsList>

        <TabsContent value="discover" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search study groups..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subjects</SelectItem>
                    <SelectItem value="Programming">Programming</SelectItem>
                    <SelectItem value="Design">Design</SelectItem>
                    <SelectItem value="Data Science">Data Science</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Business">Business</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Study Groups Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGroups.map((group) => (
              <Card key={group.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg line-clamp-2">{group.name}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">by {group.createdBy}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {group.privacy === "private" ? (
                        <Lock className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Globe className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline">{group.subject}</Badge>
                    <Badge variant="outline" className={getLevelColor(group.level)}>
                      {group.level}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-3">{group.description}</p>

                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {group.memberCount}/{group.maxMembers} members
                    </span>
                    <span className="text-muted-foreground">
                      Created {new Date(group.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {group.nextSession && (
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        {getSessionTypeIcon(group.nextSession.type)}
                        <span className="text-sm font-medium">Next Session</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{group.nextSession.topic}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(group.nextSession.date).toLocaleDateString()} at {group.nextSession.time}
                      </p>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-1">
                    {group.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    {group.isJoined ? (
                      <>
                        <Button size="sm" className="flex-1">
                          <MessageCircle className="mr-2 h-4 w-4" />
                          Open Chat
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => leaveGroup(group.id)}>
                          Leave
                        </Button>
                      </>
                    ) : (
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={() => joinGroup(group.id)}
                        disabled={group.memberCount >= group.maxMembers}
                      >
                        <UserPlus className="mr-2 h-4 w-4" />
                        {group.memberCount >= group.maxMembers ? "Full" : "Join Group"}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="my-groups" className="space-y-6">
          {myGroups.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No study groups yet</h3>
                <p className="text-muted-foreground mb-4">
                  Join or create a study group to start collaborating with peers
                </p>
                <Button onClick={() => setActiveTab("discover")}>Discover Groups</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {myGroups.map((group) => (
                <Card key={group.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-medium">{group.name}</h3>
                          <Badge variant="outline">{group.subject}</Badge>
                          <Badge variant="outline" className={getLevelColor(group.level)}>
                            {group.level}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground mb-3">{group.description}</p>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {group.memberCount} members
                          </span>
                          {group.nextSession && (
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              Next: {new Date(group.nextSession.date).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline">
                          <Settings className="h-4 w-4" />
                        </Button>
                        <Button size="sm">
                          <MessageCircle className="mr-2 h-4 w-4" />
                          Chat
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="sessions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Study Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {myGroups
                  .filter((group) => group.nextSession)
                  .map((group) => (
                    <div key={group.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                          {getSessionTypeIcon(group.nextSession!.type)}
                        </div>
                        <div>
                          <h4 className="font-medium">{group.nextSession!.topic}</h4>
                          <p className="text-sm text-muted-foreground">{group.name}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(group.nextSession!.date).toLocaleDateString()}
                            <Clock className="h-3 w-3 ml-2" />
                            {group.nextSession!.time}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline">
                          <Calendar className="mr-2 h-4 w-4" />
                          Add to Calendar
                        </Button>
                        <Button size="sm">
                          <Video className="mr-2 h-4 w-4" />
                          Join Session
                        </Button>
                      </div>
                    </div>
                  ))}

                {myGroups.filter((group) => group.nextSession).length === 0 && (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No upcoming sessions</h3>
                    <p className="text-muted-foreground">Join study groups to see upcoming sessions here</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
