"use client"

import { useState, useEffect } from "react"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Plus, GripVertical, BookOpen, Clock, Target, Users, Star, Trash2, Edit, Save } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface Course {
  id: string
  title: string
  description: string
  duration: number
  level: "beginner" | "intermediate" | "advanced"
  category: string
  rating: number
  price: number
  thumbnail: string
}

interface LearningPathStep {
  id: string
  courseId: string
  course: Course
  order: number
  isCompleted: boolean
  estimatedWeeks: number
}

interface LearningPath {
  id: string
  title: string
  description: string
  category: string
  difficulty: "beginner" | "intermediate" | "advanced"
  estimatedDuration: number
  steps: LearningPathStep[]
  isPublic: boolean
  tags: string[]
  createdBy: string
  enrolledCount: number
}

export default function LearningPathBuilder() {
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([])
  const [selectedPath, setSelectedPath] = useState<LearningPath | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [availableCourses, setAvailableCourses] = useState<Course[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const { toast } = useToast()

  // Mock data
  useEffect(() => {
    const mockCourses: Course[] = [
      {
        id: "1",
        title: "HTML & CSS Fundamentals",
        description: "Learn the basics of web development",
        duration: 20,
        level: "beginner",
        category: "Web Development",
        rating: 4.8,
        price: 49.99,
        thumbnail: "/placeholder.svg?height=120&width=200",
      },
      {
        id: "2",
        title: "JavaScript Essentials",
        description: "Master JavaScript programming",
        duration: 35,
        level: "beginner",
        category: "Programming",
        rating: 4.7,
        price: 79.99,
        thumbnail: "/placeholder.svg?height=120&width=200",
      },
      {
        id: "3",
        title: "React Development",
        description: "Build modern web applications with React",
        duration: 45,
        level: "intermediate",
        category: "Web Development",
        rating: 4.9,
        price: 129.99,
        thumbnail: "/placeholder.svg?height=120&width=200",
      },
      {
        id: "4",
        title: "Node.js Backend Development",
        description: "Create server-side applications",
        duration: 40,
        level: "intermediate",
        category: "Backend",
        rating: 4.6,
        price: 119.99,
        thumbnail: "/placeholder.svg?height=120&width=200",
      },
    ]

    const mockPaths: LearningPath[] = [
      {
        id: "1",
        title: "Full Stack Web Developer",
        description: "Complete path to become a full stack web developer",
        category: "Web Development",
        difficulty: "beginner",
        estimatedDuration: 24,
        isPublic: true,
        tags: ["web development", "full stack", "javascript"],
        createdBy: "Educational Academy",
        enrolledCount: 1250,
        steps: [
          {
            id: "1",
            courseId: "1",
            course: mockCourses[0],
            order: 0,
            isCompleted: false,
            estimatedWeeks: 4,
          },
          {
            id: "2",
            courseId: "2",
            course: mockCourses[1],
            order: 1,
            isCompleted: false,
            estimatedWeeks: 6,
          },
          {
            id: "3",
            courseId: "3",
            course: mockCourses[2],
            order: 2,
            isCompleted: false,
            estimatedWeeks: 8,
          },
          {
            id: "4",
            courseId: "4",
            course: mockCourses[3],
            order: 3,
            isCompleted: false,
            estimatedWeeks: 6,
          },
        ],
      },
    ]

    setAvailableCourses(mockCourses)
    setLearningPaths(mockPaths)
    setSelectedPath(mockPaths[0])
  }, [])

  const handleDragEnd = (result: any) => {
    if (!result.destination || !selectedPath) return

    const items = Array.from(selectedPath.steps)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    // Update order
    const updatedSteps = items.map((step, index) => ({
      ...step,
      order: index,
    }))

    setSelectedPath({
      ...selectedPath,
      steps: updatedSteps,
    })
  }

  const addCourseToPath = (course: Course) => {
    if (!selectedPath) return

    const newStep: LearningPathStep = {
      id: Date.now().toString(),
      courseId: course.id,
      course,
      order: selectedPath.steps.length,
      isCompleted: false,
      estimatedWeeks: Math.ceil(course.duration / 10), // Rough estimate
    }

    setSelectedPath({
      ...selectedPath,
      steps: [...selectedPath.steps, newStep],
    })

    toast({
      title: "Course added",
      description: `${course.title} has been added to the learning path`,
    })
  }

  const removeCourseFromPath = (stepId: string) => {
    if (!selectedPath) return

    const updatedSteps = selectedPath.steps
      .filter((step) => step.id !== stepId)
      .map((step, index) => ({ ...step, order: index }))

    setSelectedPath({
      ...selectedPath,
      steps: updatedSteps,
    })
  }

  const createNewPath = () => {
    const newPath: LearningPath = {
      id: Date.now().toString(),
      title: "New Learning Path",
      description: "Describe your learning path",
      category: "General",
      difficulty: "beginner",
      estimatedDuration: 0,
      steps: [],
      isPublic: false,
      tags: [],
      createdBy: "You",
      enrolledCount: 0,
    }

    setLearningPaths([...learningPaths, newPath])
    setSelectedPath(newPath)
    setIsEditing(true)
  }

  const savePath = () => {
    if (!selectedPath) return

    const updatedPaths = learningPaths.map((path) => (path.id === selectedPath.id ? selectedPath : path))

    setLearningPaths(updatedPaths)
    setIsEditing(false)

    toast({
      title: "Learning path saved",
      description: "Your changes have been saved successfully",
    })
  }

  const calculateTotalDuration = (steps: LearningPathStep[]) => {
    return steps.reduce((total, step) => total + step.estimatedWeeks, 0)
  }

  const calculateProgress = (steps: LearningPathStep[]) => {
    if (steps.length === 0) return 0
    const completed = steps.filter((step) => step.isCompleted).length
    return (completed / steps.length) * 100
  }

  const filteredCourses = availableCourses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Learning Path Builder</h1>
          <p className="text-muted-foreground">Create personalized learning journeys</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={createNewPath}>
            <Plus className="mr-2 h-4 w-4" />
            New Path
          </Button>
          {selectedPath && (
            <Button onClick={savePath} disabled={!isEditing}>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Learning Paths List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">My Learning Paths</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {learningPaths.map((path) => (
                <Card
                  key={path.id}
                  className={`cursor-pointer transition-colors ${
                    selectedPath?.id === path.id ? "bg-primary/10 border-primary" : "hover:bg-muted/50"
                  }`}
                  onClick={() => setSelectedPath(path)}
                >
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-1">{path.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{path.description}</p>
                    <div className="flex items-center justify-between text-xs">
                      <Badge variant="outline">{path.difficulty}</Badge>
                      <span className="text-muted-foreground">{path.steps.length} courses</span>
                    </div>
                    <Progress value={calculateProgress(path.steps)} className="h-1 mt-2" />
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          {selectedPath ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    {isEditing ? (
                      <Input
                        value={selectedPath.title}
                        onChange={(e) =>
                          setSelectedPath({
                            ...selectedPath,
                            title: e.target.value,
                          })
                        }
                        className="text-xl font-bold mb-2"
                      />
                    ) : (
                      <CardTitle className="text-xl">{selectedPath.title}</CardTitle>
                    )}
                    {isEditing ? (
                      <Textarea
                        value={selectedPath.description}
                        onChange={(e) =>
                          setSelectedPath({
                            ...selectedPath,
                            description: e.target.value,
                          })
                        }
                        className="mt-2"
                        rows={2}
                      />
                    ) : (
                      <p className="text-muted-foreground">{selectedPath.description}</p>
                    )}
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {calculateTotalDuration(selectedPath.steps)} weeks
                  </span>
                  <span className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    {selectedPath.steps.length} courses
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {selectedPath.enrolledCount} enrolled
                  </span>
                  <Badge variant="outline">{selectedPath.difficulty}</Badge>
                </div>
              </CardHeader>

              <CardContent>
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="learning-path">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                        {selectedPath.steps.map((step, index) => (
                          <Draggable key={step.id} draggableId={step.id} index={index} isDragDisabled={!isEditing}>
                            {(provided, snapshot) => (
                              <Card
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className={`${
                                  snapshot.isDragging ? "shadow-lg" : ""
                                } ${step.isCompleted ? "bg-green-50 border-green-200" : ""}`}
                              >
                                <CardContent className="p-4">
                                  <div className="flex items-center gap-4">
                                    {isEditing && (
                                      <div {...provided.dragHandleProps} className="cursor-grab">
                                        <GripVertical className="h-5 w-5 text-muted-foreground" />
                                      </div>
                                    )}

                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                                      {index + 1}
                                    </div>

                                    <img
                                      src={step.course.thumbnail || "/placeholder.svg"}
                                      alt={step.course.title}
                                      className="w-16 h-12 object-cover rounded"
                                    />

                                    <div className="flex-1">
                                      <h3 className="font-medium">{step.course.title}</h3>
                                      <p className="text-sm text-muted-foreground line-clamp-1">
                                        {step.course.description}
                                      </p>
                                      <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                                        <span>{step.course.duration}h</span>
                                        <span>{step.course.level}</span>
                                        <span className="flex items-center gap-1">
                                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                          {step.course.rating}
                                        </span>
                                      </div>
                                    </div>

                                    <div className="text-right">
                                      <div className="text-sm font-medium">~{step.estimatedWeeks} weeks</div>
                                      <div className="text-xs text-muted-foreground">${step.course.price}</div>
                                    </div>

                                    {isEditing && (
                                      <Button variant="ghost" size="sm" onClick={() => removeCourseFromPath(step.id)}>
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                      </Button>
                                    )}
                                  </div>
                                </CardContent>
                              </Card>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>

                {selectedPath.steps.length === 0 && (
                  <div className="text-center py-12 border-2 border-dashed rounded-lg">
                    <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No courses added yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Add courses from the sidebar to build your learning path
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Select a Learning Path</h3>
                <p className="text-muted-foreground">Choose a learning path from the sidebar or create a new one</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Course Library */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Course Library</CardTitle>
              <Input
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </CardHeader>
            <CardContent className="space-y-3 max-h-[600px] overflow-y-auto">
              {filteredCourses.map((course) => (
                <Card key={course.id} className="cursor-pointer hover:bg-muted/50">
                  <CardContent className="p-3">
                    <img
                      src={course.thumbnail || "/placeholder.svg"}
                      alt={course.title}
                      className="w-full h-20 object-cover rounded mb-2"
                    />
                    <h4 className="font-medium text-sm mb-1 line-clamp-2">{course.title}</h4>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                      <span>{course.duration}h</span>
                      <Badge variant="outline" className="text-xs">
                        {course.level}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">${course.price}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => addCourseToPath(course)}
                        disabled={!selectedPath || !isEditing}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
