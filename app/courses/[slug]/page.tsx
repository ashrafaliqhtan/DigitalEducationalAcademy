import { Suspense } from "react"
import { notFound } from "next/navigation"
import Image from "next/image"
import { Clock, BookOpen, BarChart, Users, CheckCircle, Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import CourseCurriculum from "@/components/courses/course-curriculum"
import CourseReviews from "@/components/courses/course-reviews"
import EnrollmentButton from "@/components/courses/enrollment-button"
import RelatedCourses from "@/components/courses/related-courses"
import { getCourseBySlug } from "@/services/course-service"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const course = await getCourseBySlug(params.slug)

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

export default async function CourseDetailPage({ params }: { params: { slug: string } }) {
  const course = await getCourseBySlug(params.slug)

  if (!course) {
    notFound()
  }

  // Get current user
  const supabase = getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Check if user is enrolled
  let isEnrolled = false
  if (user) {
    const { data: enrollment } = await supabase
      .from("enrollments")
      .select("*")
      .eq("user_id", user.id)
      .eq("course_id", course.id)
      .maybeSingle()

    isEnrolled = !!enrollment
  }

  // Format course duration
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins > 0 ? `${mins}m` : ""}`
  }

  // Calculate total lessons
  const totalLessons = course.sections?.reduce((total, section) => total + (section.lessons?.length || 0), 0) || 0

  return (
    <main className="container py-8 md:py-12">
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Course Header */}
          <div>
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge variant="outline" className="bg-primary/10 text-primary">
                {course.category?.name || course.level}
              </Badge>
              {course.is_featured && <Badge variant="secondary">Featured</Badge>}
              {course.is_new && <Badge variant="secondary">New</Badge>}
            </div>

            <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
            <p className="text-lg text-muted-foreground mb-6">{course.description}</p>

            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="flex items-center gap-1">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${star <= 4.5 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium">4.5</span>
                <span className="text-sm text-muted-foreground">(120 reviews)</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">1,240 students</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Last updated 2/2023</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Duration</p>
                  <p className="text-sm text-muted-foreground">{formatDuration(course.duration)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Lessons</p>
                  <p className="text-sm text-muted-foreground">{totalLessons} lessons</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <BarChart className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Level</p>
                  <p className="text-sm text-muted-foreground">{course.level}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Students</p>
                  <p className="text-sm text-muted-foreground">{course.enrollment_count || 0} enrolled</p>
                </div>
              </div>
            </div>
          </div>

          {/* Course Tabs */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
              <TabsTrigger value="instructor">Instructor</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="pt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="prose max-w-none">
                    <h3>About This Course</h3>
                    <p>{course.long_description || course.description}</p>

                    {course.objectives && course.objectives.length > 0 && (
                      <>
                        <h3>What You Will Learn</h3>
                        <ul>
                          {course.objectives.map((objective: string, index: number) => (
                            <li key={index}>{objective}</li>
                          ))}
                        </ul>
                      </>
                    )}

                    {course.requirements && course.requirements.length > 0 && (
                      <>
                        <h3>Requirements</h3>
                        <ul>
                          {course.requirements.map((requirement: string, index: number) => (
                            <li key={index}>{requirement}</li>
                          ))}
                        </ul>
                      </>
                    )}

                    {course.tags && course.tags.length > 0 && (
                      <>
                        <h3>Tags</h3>
                        <div className="flex flex-wrap gap-2">
                          {course.tags.map((tag: string, index: number) => (
                            <Badge key={index} variant="outline">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="curriculum" className="pt-6">
              <Suspense fallback={<div>Loading curriculum...</div>}>
                <CourseCurriculum course={course} showPreviewButton={!isEnrolled} />
              </Suspense>
            </TabsContent>

            <TabsContent value="instructor" className="pt-6">
              <Card>
                <CardContent className="p-6">
                  {course.instructors && course.instructors.length > 0 ? (
                    <div className="space-y-8">
                      {course.instructors.map((instructor) => (
                        <div key={instructor.id} className="flex flex-col sm:flex-row gap-6">
                          <div className="flex-shrink-0">
                            <Image
                              src={instructor.avatar || "/placeholder.svg?height=150&width=150"}
                              alt={instructor.name}
                              width={120}
                              height={120}
                              className="rounded-full object-cover"
                            />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold mb-2">{instructor.name}</h3>
                            <p className="text-muted-foreground mb-4">{instructor.title || "Course Instructor"}</p>
                            <div className="prose max-w-none">
                              <p>{instructor.bio || "No bio available for this instructor."}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p>Instructor information not available.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Reviews Section */}
          <div className="pt-8">
            <h2 className="text-2xl font-bold mb-6">Student Reviews</h2>
            <Suspense fallback={<div>Loading reviews...</div>}>
              <CourseReviews courseId={course.id} />
            </Suspense>
          </div>
        </div>

        {/* Sidebar */}
        <div>
          <div className="sticky top-24">
            <Card className="overflow-hidden">
              <div className="aspect-video relative">
                <Image
                  src={course.thumbnail || "/placeholder.svg?height=200&width=400"}
                  alt={course.title}
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="p-6">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-3xl font-bold">
                      {course.price > 0 ? `$${course.price.toFixed(2)}` : "Free"}
                    </span>
                    {course.discount_price && course.discount_price < course.price && (
                      <span className="text-lg text-muted-foreground line-through">${course.price.toFixed(2)}</span>
                    )}
                  </div>

                  {course.discount_price && course.discount_price < course.price && (
                    <Badge className="mb-4">
                      Save {Math.round(((course.price - course.discount_price) / course.price) * 100)}%
                    </Badge>
                  )}
                </div>

                <EnrollmentButton
                  courseId={course.id}
                  courseName={course.title}
                  coursePrice={course.price}
                  isEnrolled={isEnrolled}
                  className="w-full mb-4"
                />

                <p className="text-sm text-center text-muted-foreground mb-6">30-day money-back guarantee</p>

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <span className="text-sm">{totalLessons} lessons</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <span className="text-sm">{course.sections?.length || 0} sections</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <span className="text-sm">Full lifetime access</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <span className="text-sm">Certificate of completion</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Related Courses */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">Related Courses</h2>
        <Suspense fallback={<div>Loading related courses...</div>}>
          <RelatedCourses courseId={course.id} />
        </Suspense>
      </div>
    </main>
  )
}
