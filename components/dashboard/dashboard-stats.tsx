"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, BookOpen, Award, Calendar } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

interface DashboardStatsProps {
  courses: any[]
}

export default function DashboardStats({ courses }: DashboardStatsProps) {
  const { t } = useLanguage()

  // Calculate stats
  const totalCourses = courses.length
  const completedCourses = courses.filter((course) => course.progress === 100).length
  const inProgressCourses = courses.filter((course) => course.progress > 0 && course.progress < 100).length
  const notStartedCourses = courses.filter((course) => course.progress === 0).length

  // Calculate total learning time (in minutes)
  const totalLearningTime = courses.reduce((total, course) => {
    return total + (course.duration || 0) * (course.progress / 100)
  }, 0)

  // Format learning time
  const formatLearningTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = Math.floor(minutes % 60)
    return `${hours}h ${mins}m`
  }

  // Calculate average progress
  const averageProgress =
    totalCourses > 0 ? courses.reduce((total, course) => total + course.progress, 0) / totalCourses : 0

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <BookOpen className="h-5 w-5 text-primary mr-2" />
              <span className="text-3xl font-bold">{totalCourses}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completed Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Award className="h-5 w-5 text-primary mr-2" />
              <span className="text-3xl font-bold">{completedCourses}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Learning Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-primary mr-2" />
              <span className="text-3xl font-bold">{formatLearningTime(totalLearningTime)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Average Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center mb-2">
              <Calendar className="h-5 w-5 text-primary mr-2" />
              <span className="text-3xl font-bold">{Math.round(averageProgress)}%</span>
            </div>
            <Progress value={averageProgress} className="h-2" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Course Progress Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Courses</TabsTrigger>
              <TabsTrigger value="in-progress">In Progress</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              {totalCourses === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">You haven't enrolled in any courses yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="bg-muted/40 p-4 rounded-lg text-center">
                      <p className="text-sm text-muted-foreground mb-1">Not Started</p>
                      <p className="text-2xl font-bold">{notStartedCourses}</p>
                    </div>
                    <div className="bg-muted/40 p-4 rounded-lg text-center">
                      <p className="text-sm text-muted-foreground mb-1">In Progress</p>
                      <p className="text-2xl font-bold">{inProgressCourses}</p>
                    </div>
                    <div className="bg-muted/40 p-4 rounded-lg text-center">
                      <p className="text-sm text-muted-foreground mb-1">Completed</p>
                      <p className="text-2xl font-bold">{completedCourses}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {courses.map((course) => (
                      <div key={course.id} className="flex items-center">
                        <div className="w-48 truncate mr-4">{course.title}</div>
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs text-muted-foreground">{course.progress}% complete</span>
                          </div>
                          <Progress value={course.progress} className="h-2" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="in-progress">
              {inProgressCourses === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">You don't have any courses in progress</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {courses
                    .filter((course) => course.progress > 0 && course.progress < 100)
                    .map((course) => (
                      <div key={course.id} className="flex items-center">
                        <div className="w-48 truncate mr-4">{course.title}</div>
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs text-muted-foreground">{course.progress}% complete</span>
                          </div>
                          <Progress value={course.progress} className="h-2" />
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="completed">
              {completedCourses === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">You haven't completed any courses yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {courses
                    .filter((course) => course.progress === 100)
                    .map((course) => (
                      <div key={course.id} className="flex items-center">
                        <div className="w-48 truncate mr-4">{course.title}</div>
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs text-muted-foreground">Completed</span>
                          </div>
                          <Progress value={100} className="h-2 bg-primary/20" />
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
