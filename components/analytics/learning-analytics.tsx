"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts"
import { TrendingUp, Clock, Target, Award, BookOpen, Brain, Star, Download } from "lucide-react"

interface LearningData {
  date: string
  studyTime: number
  coursesCompleted: number
  quizScore: number
  engagement: number
}

interface CourseProgress {
  courseId: string
  courseName: string
  progress: number
  timeSpent: number
  lastAccessed: string
  difficulty: string
  category: string
}

interface SkillProgress {
  skill: string
  level: number
  progress: number
  courses: number
  color: string
}

export default function LearningAnalytics() {
  const [timeRange, setTimeRange] = useState("7d")
  const [selectedMetric, setSelectedMetric] = useState("studyTime")
  const [learningData, setLearningData] = useState<LearningData[]>([])
  const [courseProgress, setCourseProgress] = useState<CourseProgress[]>([])
  const [skillProgress, setSkillProgress] = useState<SkillProgress[]>([])

  useEffect(() => {
    // Mock data generation
    const generateMockData = () => {
      const days = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90
      const data: LearningData[] = []

      for (let i = days - 1; i >= 0; i--) {
        const date = new Date()
        date.setDate(date.getDate() - i)

        data.push({
          date: date.toISOString().split("T")[0],
          studyTime: Math.floor(Math.random() * 180) + 30, // 30-210 minutes
          coursesCompleted: Math.floor(Math.random() * 3),
          quizScore: Math.floor(Math.random() * 40) + 60, // 60-100%
          engagement: Math.floor(Math.random() * 30) + 70, // 70-100%
        })
      }

      setLearningData(data)
    }

    const mockCourseProgress: CourseProgress[] = [
      {
        courseId: "1",
        courseName: "React Fundamentals",
        progress: 85,
        timeSpent: 24,
        lastAccessed: "2024-01-20",
        difficulty: "Intermediate",
        category: "Programming",
      },
      {
        courseId: "2",
        courseName: "JavaScript Advanced",
        progress: 60,
        timeSpent: 18,
        lastAccessed: "2024-01-19",
        difficulty: "Advanced",
        category: "Programming",
      },
      {
        courseId: "3",
        courseName: "UI/UX Design",
        progress: 40,
        timeSpent: 12,
        lastAccessed: "2024-01-18",
        difficulty: "Beginner",
        category: "Design",
      },
      {
        courseId: "4",
        courseName: "Node.js Backend",
        progress: 25,
        timeSpent: 8,
        lastAccessed: "2024-01-17",
        difficulty: "Intermediate",
        category: "Backend",
      },
    ]

    const mockSkillProgress: SkillProgress[] = [
      {
        skill: "JavaScript",
        level: 4,
        progress: 85,
        courses: 3,
        color: "#f7df1e",
      },
      {
        skill: "React",
        level: 3,
        progress: 70,
        courses: 2,
        color: "#61dafb",
      },
      {
        skill: "CSS",
        level: 3,
        progress: 65,
        courses: 2,
        color: "#1572b6",
      },
      {
        skill: "Node.js",
        level: 2,
        progress: 40,
        courses: 1,
        color: "#339933",
      },
      {
        skill: "UI/UX",
        level: 2,
        progress: 35,
        courses: 1,
        color: "#ff6b6b",
      },
    ]

    generateMockData()
    setCourseProgress(mockCourseProgress)
    setSkillProgress(mockSkillProgress)
  }, [timeRange])

  const totalStudyTime = learningData.reduce((sum, day) => sum + day.studyTime, 0)
  const averageQuizScore = learningData.reduce((sum, day) => sum + day.quizScore, 0) / learningData.length
  const coursesInProgress = courseProgress.filter((course) => course.progress > 0 && course.progress < 100).length
  const coursesCompleted = courseProgress.filter((course) => course.progress === 100).length

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  const getMetricData = () => {
    switch (selectedMetric) {
      case "studyTime":
        return learningData.map((d) => ({ ...d, value: d.studyTime }))
      case "quizScore":
        return learningData.map((d) => ({ ...d, value: d.quizScore }))
      case "engagement":
        return learningData.map((d) => ({ ...d, value: d.engagement }))
      default:
        return learningData.map((d) => ({ ...d, value: d.studyTime }))
    }
  }

  const getSkillLevelColor = (level: number) => {
    switch (level) {
      case 1:
        return "bg-red-100 text-red-800"
      case 2:
        return "bg-orange-100 text-orange-800"
      case 3:
        return "bg-yellow-100 text-yellow-800"
      case 4:
        return "bg-green-100 text-green-800"
      case 5:
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getSkillLevelText = (level: number) => {
    switch (level) {
      case 1:
        return "Beginner"
      case 2:
        return "Novice"
      case 3:
        return "Intermediate"
      case 4:
        return "Advanced"
      case 5:
        return "Expert"
      default:
        return "Unknown"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Learning Analytics</h1>
          <p className="text-muted-foreground">Track your learning progress and insights</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Study Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatTime(totalStudyTime)}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +12% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Quiz Score</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(averageQuizScore)}%</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +5% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Courses in Progress</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{coursesInProgress}</div>
            <p className="text-xs text-muted-foreground">{coursesCompleted} completed this period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Learning Streak</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7 days</div>
            <p className="text-xs text-muted-foreground">Keep it up! 🔥</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Study Time Chart */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Learning Activity</CardTitle>
                <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="studyTime">Study Time</SelectItem>
                    <SelectItem value="quizScore">Quiz Scores</SelectItem>
                    <SelectItem value="engagement">Engagement</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={getMetricData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value) =>
                      new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                    }
                  />
                  <YAxis />
                  <Tooltip
                    labelFormatter={(value) => new Date(value).toLocaleDateString()}
                    formatter={(value: number) => [
                      selectedMetric === "studyTime"
                        ? formatTime(value)
                        : selectedMetric === "quizScore"
                          ? `${value}%`
                          : `${value}%`,
                      selectedMetric === "studyTime"
                        ? "Study Time"
                        : selectedMetric === "quizScore"
                          ? "Quiz Score"
                          : "Engagement",
                    ]}
                  />
                  <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Weekly Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Most Active Day</span>
                    <Badge variant="outline">Wednesday</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Favorite Subject</span>
                    <Badge variant="outline">Programming</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Best Performance</span>
                    <Badge variant="outline">95% Quiz Average</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Study Sessions</span>
                    <span className="font-medium">12 sessions</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Learning Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <Brain className="h-4 w-4 text-blue-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Peak Learning Time</p>
                      <p className="text-xs text-muted-foreground">You're most productive between 2-4 PM</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <TrendingUp className="h-4 w-4 text-green-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Improving Areas</p>
                      <p className="text-xs text-muted-foreground">JavaScript concepts showing 15% improvement</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Target className="h-4 w-4 text-orange-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Focus Recommendation</p>
                      <p className="text-xs text-muted-foreground">Consider more practice with React hooks</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="courses" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Course Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {courseProgress.map((course) => (
                  <div key={course.courseId} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{course.courseName}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Badge variant="outline">{course.category}</Badge>
                          <Badge variant="outline">{course.difficulty}</Badge>
                          <span>{formatTime(course.timeSpent * 60)} spent</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">{course.progress}%</div>
                        <div className="text-xs text-muted-foreground">
                          Last: {new Date(course.lastAccessed).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <Progress value={course.progress} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Study Time by Course</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={courseProgress}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="courseName" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => [`${value} hours`, "Study Time"]} />
                  <Bar dataKey="timeSpent" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skills" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Skill Development</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {skillProgress.map((skill) => (
                  <div key={skill.skill} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: skill.color }} />
                        <div>
                          <h3 className="font-medium">{skill.skill}</h3>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className={getSkillLevelColor(skill.level)}>
                              {getSkillLevelText(skill.level)}
                            </Badge>
                            <span className="text-sm text-muted-foreground">{skill.courses} courses</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">{skill.progress}%</div>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i < skill.level ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <Progress value={skill.progress} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Skill Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={skillProgress} cx="50%" cy="50%" outerRadius={80} dataKey="progress" nameKey="skill">
                    {skillProgress.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => [`${value}%`, "Progress"]} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Learning Goals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">Complete React Course</h3>
                    <Badge variant="outline">In Progress</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Finish the React Fundamentals course by end of month
                  </p>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>85%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">Study 20 hours this month</h3>
                    <Badge variant="outline">On Track</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">Maintain consistent study schedule</p>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>16/20 hours</span>
                    </div>
                    <Progress value={80} className="h-2" />
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">Achieve 90% Quiz Average</h3>
                    <Badge variant="outline" className="bg-green-100 text-green-800">
                      Completed
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">Maintain high performance in assessments</p>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Current Average</span>
                      <span>92%</span>
                    </div>
                    <Progress value={100} className="h-2" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
