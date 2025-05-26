import { Suspense } from "react"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Clock, BookOpen, BarChart, Users, CheckCircle, Star, Award, Globe, Play } from "lucide-react"
import EnrollButton from "@/components/courses/enroll-button"
import InteractiveLessonPlayer from "@/components/lessons/interactive-lesson-player"
import CourseReviews from "@/components/courses/course-reviews"
import ModernCertificate from "@/components/courses/modern-certificate"

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const supabase = getSupabaseServerClient()

  const { data: course } = await supabase.from("courses").select("*").eq("slug", params.slug).single()

  if (!course) {
    return {
      title: "Course Not Found",
      description: "The requested course could not be found",
    }
  }

  return {
    title: `${course.title} | Educational Academy`,
    description: course.description,
  }
}

export default async function ModernCoursePage({ params }: { params: { slug: string } }) {
  const supabase = getSupabaseServerClient()

  // Get the current user (if logged in)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Get course details
  const { data: course } = await supabase.from("courses").select("*").eq("slug", params.slug).single()

  if (!course) {
    notFound()
  }

  // Get course sections and lessons
  const { data: sections } = await supabase
    .from("course_sections")
    .select("*, lessons:course_lessons(*)")
    .eq("course_id", course.id)
    .order("order_index")

  // Check if user is enrolled
  let enrollment = null
  if (user) {
    const { data } = await supabase
      .from("enrollments")
      .select("*")
      .eq("user_id", user.id)
      .eq("course_id", course.id)
      .single()

    enrollment = data
  }

  // Calculate course stats
  const totalLessons = sections?.reduce((acc, section) => acc + section.lessons.length, 0) || 0
  const totalSections = sections?.length || 0

  // Get instructor details
  const { data: instructor } = await supabase.from("profiles").select("*").eq("id", course.instructor_id).single()

  // Sample certificate data for preview
  const certificateData = {
    id: "sample-cert",
    certificateNumber: "CERT-" + Math.random().toString(36).substring(2, 10).toUpperCase(),
    issuedAt: new Date().toISOString(),
    verificationCode: Math.random().toString(36).substring(2, 10),
    course: {
      title: course.title,
      instructor: instructor?.full_name || "Course Instructor",
      duration: course.duration || 10,
      completionDate: new Date().toISOString(),
    },
    student: {
      name: user?.email?.split("@")[0] || "John Doe",
      email: user?.email || "student@example.com",
    },
  }

  // Sample lesson content for preview
  const sampleLessonContent = [
    {
      id: "content-1",
      type: "text",
      title: "Introduction",
      content: `<p>Welcome to this lesson! In this section, we'll cover the fundamentals of ${course.title}.</p>
                <p>Learning objectives:</p>
                <ul>
                  <li>Understand the core concepts</li>
                  <li>Learn practical applications</li>
                  <li>Develop essential skills</li>
                </ul>`,
      duration: 5 * 60, // 5 minutes
    },
    {
      id: "content-2",
      type: "video",
      title: "Video Lecture",
      content: "Watch this video to learn more about the topic.",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      duration: 10 * 60, // 10 minutes
    },
    {
      id: "content-3",
      type: "quiz",
      title: "Knowledge Check",
      content: "Test your understanding with this quiz.",
      quizData: [
        {
          id: "q1",
          question: "What is the main purpose of this course?",
          type: "multiple_choice",
          options: [
            "To teach programming basics",
            "To improve problem-solving skills",
            "To understand educational concepts",
            "All of the above",
          ],
          correctAnswer: "All of the above",
          points: 10,
        },
        {
          id: "q2",
          question: "Which of the following are important skills for a learner? (Select all that apply)",
          type: "checkbox",
          options: ["Critical thinking", "Communication", "Attention to detail", "Time management"],
          correctAnswer: ["Critical thinking", "Communication", "Attention to detail", "Time management"],
          points: 10,
        },
      ],
      duration: 5 * 60, // 5 minutes
    },
  ]

  return (
    <div className="container py-10">
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <div>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="outline">{course.category}</Badge>
              <Badge variant="outline">{course.level}</Badge>
              <Badge variant="secondary">{course.language}</Badge>
              {course.is_featured && (
                <Badge variant="default" className="bg-amber-500">
                  Featured
                </Badge>
              )}
            </div>

            <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
            <p className="text-lg text-muted-foreground mb-6">{course.description}</p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Duration</p>
                  <p className="text-sm text-muted-foreground">{course.duration} hours</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 p-2 rounded-full">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Lessons</p>
                  <p className="text-sm text-muted-foreground">{totalLessons} lessons</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 p-2 rounded-full">
                  <BarChart className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Level</p>
                  <p className="text-sm text-muted-foreground">{course.level}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Students</p>
                  <p className="text-sm text-muted-foreground">{course.enrollment_count || 0}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center gap-1">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-5 w-5 ${
                        star <= Math.round(course.average_rating || 0)
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="font-medium">{course.average_rating?.toFixed(1) || "0.0"}</span>
                <span className="text-muted-foreground">({course.review_count || 0} reviews)</span>
              </div>

              <div className="flex items-center gap-1">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{course.language}</span>
              </div>

              <div className="flex items-center gap-1">
                <Award className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Certificate of completion</span>
              </div>
            </div>
          </div>

          <Tabs defaultValue="curriculum" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="instructor">Instructor</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="curriculum" className="pt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4">Course Content</h3>

                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      <span>{totalSections} sections</span>
                      <span>•</span>
                      <span>{totalLessons} lessons</span>
                      <span>•</span>
                      <span>{course.duration} total hours</span>
                    </div>

                    <Button variant="ghost" size="sm">
                      Expand All
                    </Button>
                  </div>

                  <Suspense fallback={<CourseCurriculumSkeleton />}>
                    {sections && sections.length > 0 ? (
                      <div className="space-y-4">
                        {sections.map((section, index) => (
                          <div key={section.id} className="border rounded-lg overflow-hidden">
                            <div className="bg-muted px-4 py-3">
                              <h3 className="font-medium">
                                Section {index + 1}: {section.title}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {section.lessons.length} lessons •{" "}
                                {Math.round(
                                  section.lessons.reduce((total, lesson) => total + (lesson.duration || 0), 0) / 60,
                                )}{" "}
                                hours
                              </p>
                            </div>
                            <div className="divide-y">
                              {section.lessons.map((lesson) => (
                                <div key={lesson.id} className="px-4 py-3 flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                      <BookOpen className="h-4 w-4 text-primary" />
                                    </div>
                                    <div>
                                      <p className="font-medium">{lesson.title}</p>
                                      <p className="text-sm text-muted-foreground">{lesson.duration || "10 min"}</p>
                                    </div>
                                  </div>
                                  {enrollment ? (
                                    <Button size="sm" variant="ghost" asChild>
                                      <Link href={`/courses/${course.slug}/learn?lesson=${lesson.id}`}>Watch</Link>
                                    </Button>
                                  ) : (
                                    <Badge variant="outline">Preview</Badge>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 border rounded-lg">
                        <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium mb-2">Curriculum Coming Soon</h3>
                        <p className="text-muted-foreground">The curriculum for this course is being prepared.</p>
                      </div>
                    )}
                  </Suspense>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="overview" className="pt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="prose max-w-none dark:prose-invert">
                    <h3>About This Course</h3>
                    <p>{course.long_description || course.description}</p>

                    {course.what_you_will_learn && (
                      <>
                        <h3>What You Will Learn</h3>
                        <ul>
                          {course.what_you_will_learn.split("\n").map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      </>
                    )}

                    {course.prerequisites && (
                      <>
                        <h3>Prerequisites</h3>
                        <p>{course.prerequisites}</p>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>

              <div className="mt-8">
                <h3 className="text-xl font-bold mb-4">Sample Lesson</h3>
                <InteractiveLessonPlayer
                  lessonId="sample-lesson"
                  lessonTitle="Introduction to the Course"
                  lessonDescription="Get a taste of what this course offers"
                  contents={sampleLessonContent}
                  onComplete={() => {}}
                />
              </div>

              <div className="mt-8">
                <h3 className="text-xl font-bold mb-4">Certificate Preview</h3>
                <ModernCertificate certificate={certificateData} showPreview={true} />
              </div>
            </TabsContent>

            <TabsContent value="instructor" className="pt-6">
              <Card>
                <CardContent className="p-6">
                  {instructor ? (
                    <div className="flex flex-col sm:flex-row gap-6">
                      <div className="flex-shrink-0">
                        <img
                          src={instructor.avatar_url || "/placeholder.svg?height=150&width=150"}
                          alt={instructor.full_name}
                          className="w-24 h-24 rounded-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-2">{instructor.full_name}</h3>
                        <p className="text-muted-foreground mb-4">{instructor.title || "Course Instructor"}</p>
                        <div className="prose max-w-none dark:prose-invert">
                          <p>{instructor.bio || "No bio available for this instructor."}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p>Instructor information not available.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="pt-6">
              <CourseReviews
                courseId={course.id}
                averageRating={course.average_rating || 0}
                totalReviews={course.review_count || 0}
              />
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <div className="sticky top-24">
            <Card className="overflow-hidden">
              <div className="aspect-video relative">
                <img
                  src={course.image_url || "/placeholder.svg?height=200&width=400"}
                  alt={course.title}
                  className="object-cover w-full h-full"
                />
                {course.has_video_preview && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-16 w-16 rounded-full bg-white/20 text-white hover:bg-white/30 hover:text-white"
                    >
                      <Play className="h-8 w-8" />
                    </Button>
                  </div>
                )}
              </div>
              <CardContent className="p-6">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-3xl font-bold">
                      {course.price > 0 ? `$${course.price.toFixed(2)}` : "Free"}
                    </span>
                    {course.original_price && course.original_price > course.price && (
                      <span className="text-lg text-muted-foreground line-through">
                        ${course.original_price.toFixed(2)}
                      </span>
                    )}
                  </div>

                  {course.price > 0 && course.original_price && course.original_price > course.price && (
                    <Badge className="mb-4 bg-green-500">
                      Save {Math.round(((course.original_price - course.price) / course.original_price) * 100)}%
                    </Badge>
                  )}

                  {course.sale_ends_at && new Date(course.sale_ends_at) > new Date() && (
                    <div className="text-sm text-red-500 mb-4">
                      Sale ends in{" "}
                      {Math.ceil(
                        (new Date(course.sale_ends_at).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
                      )}{" "}
                      days
                    </div>
                  )}
                </div>

                {enrollment ? (
                  <Button asChild className="w-full mb-4">
                    <Link href={`/courses/${course.slug}/learn`}>
                      {enrollment.status === "completed" ? "Review Course" : "Continue Learning"}
                    </Link>
                  </Button>
                ) : (
                  <EnrollButton courseId={course.id} className="w-full mb-4" />
                )}

                <p className="text-sm text-center text-muted-foreground mb-6">30-day money-back guarantee</p>

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-sm">{totalLessons} lessons</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-sm">{totalSections} sections</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-sm">Interactive quizzes and exercises</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-sm">Full lifetime access</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-sm">Access on mobile and TV</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-sm">Certificate of completion</span>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t">
                  <Button variant="outline" className="w-full">
                    Gift this course
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

function CourseCurriculumSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((section) => (
        <div key={section} className="border rounded-lg overflow-hidden">
          <div className="bg-muted px-4 py-3">
            <Skeleton className="h-5 w-1/3 mb-2" />
            <Skeleton className="h-4 w-1/4" />
          </div>
          <div className="divide-y">
            {[1, 2, 3].map((lesson) => (
              <div key={lesson} className="px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <div>
                    <Skeleton className="h-5 w-40 mb-2" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
                <Skeleton className="h-8 w-20" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
